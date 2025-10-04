"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { ModelSelector } from "@/components/model-selector"
import { Button } from "@/components/ui/button"
import { Menu, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: string
  updatedAt: string
}

export default function ChatPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load conversations from localStorage
    if (user) {
      const stored = localStorage.getItem(`conversations_${user.id}`)
      if (stored) {
        const loadedConversations = JSON.parse(stored)
        setConversations(loadedConversations)
        if (loadedConversations.length > 0 && !currentConversationId) {
          setCurrentConversationId(loadedConversations[0].id)
        }
      }
    }
  }, [user, currentConversationId])

  const saveConversations = (convs: Conversation[]) => {
    if (user) {
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(convs))
      setConversations(convs)
    }
  }

  const currentConversation = conversations.find((c) => c.id === currentConversationId)

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: "New Conversation",
      messages: [],
      model: selectedModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [newConv, ...conversations]
    saveConversations(updated)
    setCurrentConversationId(newConv.id)
    setIsSidebarOpen(false)
  }

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id)
    saveConversations(updated)
    if (currentConversationId === id) {
      setCurrentConversationId(updated.length > 0 ? updated[0].id : null)
    }
  }

  const sendMessage = async (content: string) => {
    if (!currentConversationId) {
      createNewConversation()
      return
    }

    if (isGenerating) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    // Add user message immediately
    const updated = conversations.map((conv) => {
      if (conv.id === currentConversationId) {
        const newMessages = [...conv.messages, userMessage]
        const newTitle = conv.messages.length === 0 ? content.slice(0, 50) : conv.title

        return {
          ...conv,
          messages: newMessages,
          title: newTitle,
          model: selectedModel,
          updatedAt: new Date().toISOString(),
        }
      }
      return conv
    })

    saveConversations(updated)
    setIsGenerating(true)

    try {
      // Create placeholder AI message
      const aiMessageId = crypto.randomUUID()
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      }

      // Add placeholder message
      const withPlaceholder = conversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage, aiMessage],
            updatedAt: new Date().toISOString(),
          }
        }
        return conv
      })
      saveConversations(withPlaceholder)

      // Prepare messages for API
      const currentConv = conversations.find((c) => c.id === currentConversationId)
      const apiMessages = currentConv
        ? [...currentConv.messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          }))
        : [{ role: "user" as const, content }]

      // Call AI API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const content = line.slice(2).replace(/^"(.*)"$/, "$1")
              accumulatedContent += content

              // Update message with accumulated content
              const withContent = conversations.map((conv) => {
                if (conv.id === currentConversationId) {
                  return {
                    ...conv,
                    messages: conv.messages.map((m) =>
                      m.id === aiMessageId ? { ...m, content: accumulatedContent } : m,
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                }
                return conv
              })
              saveConversations(withContent)
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)

      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologise, but I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }

      const withError = conversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage, errorMessage],
            updatedAt: new Date().toISOString(),
          }
        }
        return conv
      })
      saveConversations(withError)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <ChatSidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={(id) => {
                  setCurrentConversationId(id)
                  setIsSidebarOpen(false)
                }}
                onDeleteConversation={deleteConversation}
                onNewConversation={createNewConversation}
              />
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon" onClick={createNewConversation} className="hidden lg:flex">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />

        <div className="w-10" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-80 border-r border-border lg:block">
          <ChatSidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={setCurrentConversationId}
            onDeleteConversation={deleteConversation}
            onNewConversation={createNewConversation}
          />
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {currentConversation ? (
            <>
              <ChatMessages messages={currentConversation.messages} isGenerating={isGenerating} />
              <ChatInput onSendMessage={sendMessage} disabled={isGenerating} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold">Start a new conversation</h2>
                <p className="mb-6 text-sm text-muted-foreground">Ask me anything about your studies</p>
                <Button onClick={createNewConversation} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Conversation
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
