"use client"

import type { Friend, Message } from "./types"

const FRIENDS_KEY = "birthday_plus_friends"
const MESSAGES_KEY = "birthday_plus_messages"

const SEED_FRIENDS: Friend[] = [
  {
    id: "f1",
    name: "Anna",
    birthday: "1995-03-15",
    updatedAt: 1700000000000,
  },
  {
    id: "f2",
    name: "Leo",
    birthday: "1992-07-22",
    updatedAt: 1705000000000,
  },
]

const SEED_MESSAGES: Message[] = [
  {
    id: "m1",
    friendId: "f1",
    text: "She loves mango mousse; maybe free on 12/10.",
    createdAt: 1700000000000,
  },
  {
    id: "m2",
    friendId: "f2",
    text: "Missed his birthday last year—don't forget this time.",
    createdAt: 1705000000000,
  },
]

export const getFriends = (): Friend[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(FRIENDS_KEY)
  if (!stored) {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(SEED_FRIENDS))
    // Also seed messages
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(SEED_MESSAGES))
    return SEED_FRIENDS
  }

  try {
    return JSON.parse(stored)
  } catch {
    return SEED_FRIENDS
  }
}

export const saveFriends = (friends: Friend[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends))
}

export const getFriend = (id: string): Friend | undefined => {
  const friends = getFriends()
  return friends.find((f) => f.id === id)
}

export const addFriend = async (name: string, birthday: string, file?: File): Promise<Friend> => {
  const friends = getFriends()
  const avatarUrl = file ? await fileToDataUrl(file) : undefined
  const newFriend: Friend = {
    id: `f${Date.now()}`,
    name,
    birthday,
    avatarUrl,
    updatedAt: Date.now(),
  }
  const updated = [newFriend, ...friends]
  saveFriends(updated)
  return newFriend
}

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const updateFriend = (id: string, updates: Partial<Friend>): void => {
  const friends = getFriends()
  const index = friends.findIndex((f) => f.id === id)
  if (index !== -1) {
    friends[index] = { ...friends[index], ...updates, updatedAt: Date.now() }
    saveFriends(friends)
  }
}

export const updateFriendWithFile = async (
  id: string,
  updates: Partial<Omit<Friend, "id" | "updatedAt">>,
  file?: File,
): Promise<void> => {
  const friends = getFriends()
  const index = friends.findIndex((f) => f.id === id)
  if (index !== -1) {
    const avatarUrl = file ? await fileToDataUrl(file) : updates.avatarUrl
    friends[index] = {
      ...friends[index],
      ...updates,
      avatarUrl,
      updatedAt: Date.now(),
    }
    saveFriends(friends)
  }
}

export const deleteFriend = (id: string): void => {
  const friends = getFriends()
  const filtered = friends.filter((f) => f.id !== id)
  saveFriends(filtered)

  const messages = getAllMessages()
  const filteredMessages = messages.filter((m) => m.friendId !== id)
  saveMessages(filteredMessages)
}

export const getAllMessages = (): Message[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(MESSAGES_KEY)
  if (!stored) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(SEED_MESSAGES))
    return SEED_MESSAGES
  }

  try {
    return JSON.parse(stored)
  } catch {
    return SEED_MESSAGES
  }
}

export const saveMessages = (messages: Message[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export const getMessages = (friendId: string): Message[] => {
  const messages = getAllMessages()
  return messages.filter((m) => m.friendId === friendId).sort((a, b) => a.createdAt - b.createdAt)
}

export const addMessage = (friendId: string, text: string): Message => {
  const messages = getAllMessages()
  const newMessage: Message = {
    id: `m${Date.now()}`,
    friendId,
    text,
    createdAt: Date.now(),
  }
  const updated = [...messages, newMessage]
  saveMessages(updated)

  // Update friend's updatedAt timestamp
  updateFriend(friendId, { updatedAt: Date.now() })

  return newMessage
}

export const friendsOn = (month: number, day: number, friends: Friend[]): Friend[] => {
  return friends.filter((f) => {
    if (!f.birthday) return false
    const [, m, d] = f.birthday.split("-").map(Number)
    return m === month && d === day
  })
}

export const buildMonth = (year: number, month: number): (Date | null)[][] => {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const startDay = first.getDay()
  const days = last.getDate()
  const cells: (Date | null)[] = []

  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month - 1, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

export const daysUntilNextBirthday = (birthdayISO: string, today = new Date()): number => {
  if (!birthdayISO) return Number.POSITIVE_INFINITY
  const [, m, d] = birthdayISO.split("-").map(Number)
  const startOfToday = new Date(today)
  startOfToday.setHours(0, 0, 0, 0)

  const thisYear = new Date(today.getFullYear(), m - 1, d)
  const next = thisYear >= startOfToday ? thisYear : new Date(today.getFullYear() + 1, m - 1, d)

  const ms = next.getTime() - startOfToday.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export const getBirthdayMonthDay = (birthdayISO: string): string => {
  if (!birthdayISO) return ""
  const [, m, d] = birthdayISO.split("-").map(Number)
  return `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}
