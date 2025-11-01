"use client"

import type { Friend } from "@/lib/types"
import { daysUntilNextBirthday } from "@/lib/store"
import { format } from "date-fns"

interface CalendarStoriesProps {
  friends: Friend[]
  onTap?: (friend: Friend) => void
}

export function CalendarStories({ friends, onTap }: CalendarStoriesProps) {
  // Filter friends with birthdays and sort by soonest
  const friendsWithBirthdays = friends.filter((f) => f.birthday)
  const sorted = [...friendsWithBirthdays].sort(
    (a, b) => daysUntilNextBirthday(a.birthday) - daysUntilNextBirthday(b.birthday),
  )

  if (sorted.length === 0) return null

  return (
    <div className="sticky top-[128px] z-[8] bg-white/90 backdrop-blur border-b">
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-3 py-3">
          {sorted.map((f) => {
            const days = daysUntilNextBirthday(f.birthday)
            const [, m, d] = f.birthday.split("-").map(Number)
            const dateStr = format(new Date(2000, m - 1, d), "MMM d")

            return (
              <button
                key={f.id}
                className="flex shrink-0 flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400 rounded-lg p-1"
                onClick={() => onTap?.(f)}
              >
                <span className="relative">
                  {f.avatarUrl ? (
                    <img
                      src={f.avatarUrl || "/placeholder.svg"}
                      alt={f.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-brand-300"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-brand-200 border-2 border-brand-300 flex items-center justify-center">
                      <span className="text-sm font-semibold text-brand-800">{f.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 bg-white rounded-full border border-brand-300 font-medium text-brand-700">
                    {days === 0 ? "Today" : `D-${days}`}
                  </span>
                </span>
                <span className="text-[11px] text-gray-700 max-w-[64px] truncate font-medium">{f.name}</span>
                <span className="text-[9px] text-gray-500">{dateStr}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
