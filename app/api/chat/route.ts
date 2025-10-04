import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    // Map frontend model IDs to AI Gateway model strings
    const modelMap: Record<string, string> = {
      "claude-3-5-sonnet": "anthropic/claude-3-5-sonnet-20241022",
      "gpt-4": "openai/gpt-4",
      "gemini-pro": "google/gemini-pro",
    }

    const aiModel = modelMap[model] || modelMap["claude-3-5-sonnet"]

    // Add educational context to system message
    const systemMessage = {
      role: "system" as const,
      content: `You are an educational AI assistant called "The Library". You help students of all levels with their studies across all subjects. You provide clear, accurate, and helpful explanations. You encourage learning and critical thinking. You use British English spelling and grammar.`,
    }

    const result = streamText({
      model: aiModel,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
