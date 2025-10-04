"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, MessageSquare, FileText } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={user ? "/chat" : "/"} className="flex items-center gap-2 font-semibold text-lg">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>The Library</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/chat">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/assignments">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Assignments</span>
                </Link>
              </Button>
            </nav>

            <div className="h-6 w-px bg-border" />

            <span className="hidden text-sm text-muted-foreground md:inline">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
