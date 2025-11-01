import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { scope, friendId, question, friendSnapshot, allFriends } = await req.json()

  if (!question?.trim()) {
    return Response.json({ error: "Question required" }, { status: 400 })
  }

  if (scope === "friend" && !friendId) {
    return Response.json({ error: "friendId required for friend scope" }, { status: 400 })
  }

  const hasKey = !!process.env.OPENAI_API_KEY

  let detectedFriend = null
  if (scope === "general" && allFriends && allFriends.length > 0) {
    const questionLower = question.toLowerCase()
    // Remove punctuation and split into words for better matching
    const questionWords = questionLower.replace(/[^\w\s]/g, " ").split(/\s+/)

    detectedFriend = allFriends.find((f) => {
      const nameLower = f.name.toLowerCase()
      const firstName = nameLower.split(/\s+/)[0]

      // Check if full name or first name appears in question
      return questionLower.includes(nameLower) || questionWords.includes(firstName) || questionWords.includes(nameLower)
    })
  }

  if (!hasKey) {
    // Mock fallback
    if (scope === "general" && detectedFriend) {
      return Response.json({
        answer: `Mock: I detected you're asking about ${detectedFriend.name}. Based on your notes about them, here's a helpful answer to: "${question}".`,
      })
    }
    return Response.json({
      answer:
        scope === "friend"
          ? `Mock: Based on your notes about ${friendSnapshot?.name || "this friend"}, here's a helpful synthesized answer to: "${question}".`
          : `Mock: General answer to: "${question}".`,
    })
  }

  // Real OpenAI call
  let systemPrompt = ""
  let userPrompt = ""

  if (scope === "friend") {
    systemPrompt = `You are a helpful assistant that answers questions about a specific person using their notes.

INSTRUCTIONS:
- Answer based ONLY on the provided notes about this person
- Be conversational and natural in your responses
- If the notes contain relevant information, synthesize it into a clear answer
- If the answer isn't in the notes, say "I don't have that information in the notes" and optionally provide a brief general suggestion
- Never make up personal facts not present in the notes
- Keep responses concise but complete (2-4 sentences typically)`

    userPrompt = `Friend: ${friendSnapshot?.name || "Unknown"}
Birthday: ${friendSnapshot?.birthday || "Unknown"}

NOTES:
${friendSnapshot?.messages?.join("\n\n") || "No notes available."}

QUESTION: ${question}`
  } else if (detectedFriend) {
    systemPrompt = `You are a helpful assistant. The user asked a question that mentions "${detectedFriend.name}".

INSTRUCTIONS:
- First, check if the notes about ${detectedFriend.name} contain relevant information
- If yes, use those notes to provide a personalized, specific answer
- If the notes don't help, provide a helpful general answer to their question
- Be natural and conversational
- Synthesize information from multiple notes if needed
- Keep responses concise but complete (2-4 sentences typically)`

    userPrompt = `The user is asking about ${detectedFriend.name}.

NOTES ABOUT ${detectedFriend.name.toUpperCase()}:
${detectedFriend.messages?.join("\n\n") || "No notes available."}

Birthday: ${detectedFriend.birthday || "Unknown"}

QUESTION: ${question}

Provide a helpful answer using the notes if relevant, or answer generally if the notes don't contain the information.`
  } else {
    systemPrompt = `You are a helpful, concise assistant. Provide clear, practical answers in 2-4 sentences.`
    userPrompt = question
  }

  try {
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
        max_tokens: 500, // Increased from 300 for more complete answers
        temperature: 0.5, // Lowered from 0.7 for more consistent responses
      }),
    })

    const data = await response.json()
    const answer = data?.choices?.[0]?.message?.content ?? "Sorry, no answer available."

    return Response.json({ answer })
  } catch (error) {
    console.error("[v0] OpenAI API error:", error)
    return Response.json({ error: "Failed to get answer" }, { status: 500 })
  }
}
