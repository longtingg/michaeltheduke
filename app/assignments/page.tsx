"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { FileText, Loader2, Plus, Trash2, Download, FileDown, Menu } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { exportToDocx, exportToPdf } from "@/lib/export-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

interface Assignment {
  id: string
  subject: string
  topic: string
  difficulty: string
  questionCount: number
  questionTypes: string
  content: string
  createdAt: string
}

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "Languages",
  "Arts",
  "Music",
  "Business Studies",
  "Economics",
]

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Advanced"]

export default function AssignmentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Form state
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [questionCount, setQuestionCount] = useState("5")
  const [questionTypes, setQuestionTypes] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`assignments_${user.id}`)
      if (stored) {
        setAssignments(JSON.parse(stored))
      }
    }
  }, [user])

  const saveAssignments = (assgns: Assignment[]) => {
    if (user) {
      localStorage.setItem(`assignments_${user.id}`, JSON.stringify(assgns))
      setAssignments(assgns)
    }
  }

  const generateAssignment = async () => {
    if (!subject || !topic || !difficulty) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          questionCount: Number.parseInt(questionCount),
          questionTypes: questionTypes || "mixed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate assignment")
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
            }
          }
        }
      }

      const newAssignment: Assignment = {
        id: crypto.randomUUID(),
        subject,
        topic,
        difficulty,
        questionCount: Number.parseInt(questionCount),
        questionTypes: questionTypes || "mixed",
        content: accumulatedContent,
        createdAt: new Date().toISOString(),
      }

      const updated = [newAssignment, ...assignments]
      saveAssignments(updated)
      setSelectedAssignment(newAssignment)

      toast({
        title: "Assignment Generated",
        description: "Your assignment has been created successfully",
      })

      // Reset form
      setSubject("")
      setTopic("")
      setDifficulty("")
      setQuestionCount("5")
      setQuestionTypes("")
    } catch (error) {
      console.error("[v0] Error generating assignment:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate assignment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteAssignment = (id: string) => {
    const updated = assignments.filter((a) => a.id !== id)
    saveAssignments(updated)
    if (selectedAssignment?.id === id) {
      setSelectedAssignment(null)
    }
    toast({
      title: "Assignment Deleted",
      description: "The assignment has been removed",
    })
  }

  const handleExportDocx = async () => {
    if (!selectedAssignment) return
    setIsExporting(true)
    try {
      await exportToDocx(selectedAssignment)
      toast({
        title: "Export Successful",
        description: "Assignment exported as DOCX",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export to DOCX. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPdf = () => {
    if (!selectedAssignment) return
    setIsExporting(true)
    try {
      exportToPdf(selectedAssignment)
      toast({
        title: "Export Successful",
        description: "Assignment exported as PDF",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export to PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
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
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 border-r border-border lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold text-lg">Your Assignments</h2>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2 p-2">
                {assignments.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">No assignments yet</div>
                ) : (
                  assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`group relative flex items-start gap-2 rounded-lg p-3 transition-colors ${
                        selectedAssignment?.id === assignment.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="flex flex-1 flex-col items-start gap-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0" />
                          <span className="font-medium text-sm">{assignment.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{assignment.topic}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(assignment.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteAssignment(assignment.id)
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
        </aside>

        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open assignments menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b border-border p-4">
                  <h2 className="font-semibold text-lg">Your Assignments</h2>
                </div>
                <ScrollArea className="flex-1">
                  <div className="space-y-2 p-2">
                    {assignments.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">No assignments yet</div>
                    ) : (
                      assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className={`group relative flex items-start gap-2 rounded-lg p-3 transition-colors ${
                            selectedAssignment?.id === assignment.id
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment)
                              setMobileMenuOpen(false)
                            }}
                            className="flex flex-1 flex-col items-start gap-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 shrink-0" />
                              <span className="font-medium text-sm">{assignment.subject}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{assignment.topic}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(assignment.createdAt).toLocaleDateString("en-GB")}
                            </span>
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteAssignment(assignment.id)
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
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="container mx-auto max-w-4xl px-4 py-8">
              {/* Generator Form */}
              <Card className="mb-8 p-6">
                <h2 className="mb-6 font-semibold text-xl">Generate New Assignment</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject} disabled={isGenerating}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subj) => (
                          <SelectItem key={subj} value={subj}>
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty} disabled={isGenerating}>
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Quadratic Equations, World War II, Photosynthesis"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question-count">Number of Questions</Label>
                    <Input
                      id="question-count"
                      type="number"
                      min="1"
                      max="20"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question-types">Question Types (Optional)</Label>
                    <Input
                      id="question-types"
                      placeholder="e.g., multiple choice, short answer, essay"
                      value={questionTypes}
                      onChange={(e) => setQuestionTypes(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <Button
                  onClick={generateAssignment}
                  disabled={!subject || !topic || !difficulty || isGenerating}
                  className="mt-6 w-full gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Assignment...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Generate Assignment
                    </>
                  )}
                </Button>
              </Card>

              {/* Display Selected Assignment */}
              {selectedAssignment && (
                <Card className="p-6">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h2 className="mb-2 font-semibold text-2xl">{selectedAssignment.subject}</h2>
                      <p className="text-muted-foreground">{selectedAssignment.topic}</p>
                      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                        <span>Difficulty: {selectedAssignment.difficulty}</span>
                        <span>Questions: {selectedAssignment.questionCount}</span>
                        <span>{new Date(selectedAssignment.createdAt).toLocaleDateString("en-GB")}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-transparent" disabled={isExporting}>
                          {isExporting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Exporting...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Export
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExportDocx}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Export as DOCX
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPdf}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Export as PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap">{selectedAssignment.content}</div>
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>

      <Footer />
    </div>
  )
}
