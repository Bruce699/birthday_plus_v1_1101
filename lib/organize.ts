import type { OrganizedNote } from "./types"

export async function organizeNotes(text: string): Promise<OrganizedNote> {
  const response = await fetch("/api/organize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error("Failed to organize notes")
  }

  return response.json()
}
