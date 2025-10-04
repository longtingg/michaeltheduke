"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"

interface ModelSelectorProps {
  selectedModel: string
  onSelectModel: (model: string) => void
}

const MODELS = [
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
]

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const currentModel = MODELS.find((m) => m.id === selectedModel)

  return (
    <Select value={selectedModel} onValueChange={onSelectModel}>
      <SelectTrigger className="w-[200px] gap-2">
        <Sparkles className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.provider}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
