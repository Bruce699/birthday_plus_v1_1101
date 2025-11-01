export async function askQuestion(payload: {
  scope: "friend" | "general"
  friendId?: string
  question: string
  friendSnapshot?: { name: string; birthday: string; messages: string[] }
  allFriends?: Array<{ id: string; name: string; birthday: string; messages: string[] }>
}) {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json() as Promise<{ answer?: string; error?: string }>
}
