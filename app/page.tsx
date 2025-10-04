import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Download, Sparkles, Brain, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>The Library</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Learning Assistant</span>
          </div>
          <h1 className="mb-6 font-bold text-4xl text-balance leading-tight md:text-6xl">
            Your Personal AI Tutor for Interactive Learning
          </h1>
          <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl">
            Get instant help with homework, generate custom assignments, and learn at your own pace with our intelligent
            AI assistant.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link href="/signup">
                Start Learning Free
                <Zap className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-balance md:text-4xl">Everything You Need to Excel</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Powerful features designed to make learning engaging, efficient, and personalised to your needs.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-xl">Interactive Chat</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ask questions and get instant, detailed explanations on any topic. Your AI tutor is available 24/7.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-xl">Assignment Generator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create custom assignments tailored to your subject, topic, and difficulty level in seconds.
              </p>
            </Card>

            <Card className="p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-xl">Export & Share</h3>
              <p className="text-muted-foreground leading-relaxed">
                Download your assignments as DOCX or PDF files. Perfect for printing or sharing with teachers.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-balance md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Get started in three simple steps and transform your learning experience.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">Create Your Account</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign up for free in seconds. No credit card required.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">Ask or Generate</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Chat with your AI tutor or generate custom assignments.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">Learn & Excel</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Master your subjects with personalised guidance and practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <Brain className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h2 className="mb-4 font-bold text-3xl text-balance md:text-4xl">Ready to Transform Your Learning?</h2>
            <p className="mb-8 text-lg text-muted-foreground text-pretty">
              Join students who are already using The Library to achieve their academic goals.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/signup">
                Get Started for Free
                <Zap className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Created by Michael MUSONDA Chawe | Built with Base 44</p>
          <p className="mt-2">© {new Date().getFullYear()} The Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
