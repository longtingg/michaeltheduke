import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { subject, topic, difficulty, questionCount, questionTypes } = await req.json()

    const prompt = `Generate a comprehensive educational assignment with the following specifications:

Subject: ${subject}
Topic: ${topic}
Difficulty Level: ${difficulty}
Number of Questions: ${questionCount}
Question Types: ${questionTypes}

Please create a well-structured assignment that includes:
1. A clear title and instructions
2. ${questionCount} questions appropriate for the ${difficulty} difficulty level
3. A mix of question types as specified (or varied types if not specified)
4. Clear marking guidelines or answer space indicators
5. Use British English spelling and grammar

Format the assignment professionally, as if it were being given to a student. Include any necessary diagrams, formulas, or context needed for the questions.`

    const result = streamText({
      model: "anthropic/claude-3-5-sonnet-20241022",
      prompt,
      temperature: 0.8,
      maxTokens: 3000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[v0] Generate assignment API error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate assignment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
