"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Trash2 } from "lucide-react"
import type { Conversation } from "@/app/chat/page"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onNewConversation: () => void
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <Button onClick={onNewConversation} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 text-foreground"
                }`}
              >
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className="flex flex-1 items-center gap-2 overflow-hidden text-left"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm">{conv.title}</span>
                </button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(conv.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
