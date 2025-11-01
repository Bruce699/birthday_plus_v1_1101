export type Message = {
  id: string
  friendId: string
  text: string
  createdAt: number // epoch ms
}

export type Friend = {
  id: string
  name: string
  birthday: string // ISO date string: "YYYY-MM-DD"
  avatarUrl?: string // data URL (base64) or http(s) URL
  updatedAt: number
}

export type OrganizedNote = {
  summary: string
  highlights: string[]
  todos: string[]
  sentiments: string[]
}
