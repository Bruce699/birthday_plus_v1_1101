import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const hasKey = !!process.env.OPENAI_API_KEY

    if (!hasKey) {
      const mockResponse = {
        summary: "Example auto-generated summary (mock).",
        highlights: ["Birthday plan mentioned", "Favorite cake: mango mousse", "Planning a small surprise"],
        todos: ["Order cake next week", "Buy a handwritten card", "Confirm party location"],
        sentiments: ["caring", "hopeful", "warm"],
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      return NextResponse.json(mockResponse)
    }

    const systemPrompt = `You are an assistant that organizes personal notes about friends into a structured format.

Analyze the provided notes and return a JSON object with these fields:
- summary: A 2-3 sentence overview of the key information
- highlights: Array of 3-5 important facts or memorable moments (strings)
- todos: Array of 2-4 action items or things to remember (strings)
- sentiments: Array of 2-4 emotional keywords that capture the tone (strings, lowercase)

Be concise, warm, and focus on what matters most for maintaining the friendship.`

    const userPrompt = `Organize these notes:

${text}

Return only valid JSON with the structure: {"summary": "...", "highlights": [...], "todos": [...], "sentiments": [...]}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No content in OpenAI response")
    }

    // Parse the JSON response from OpenAI
    const organized = JSON.parse(content)

    return NextResponse.json(organized)
  } catch (error) {
    console.error("[v0] OpenAI organize error:", error)
    return NextResponse.json({ error: "Failed to organize notes" }, { status: 500 })
  }
}
