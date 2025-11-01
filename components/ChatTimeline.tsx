"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { format, isToday, isYesterday, isSameDay } from "date-fns"

interface ChatTimelineProps {
  messages: Message[]
}

export function ChatTimeline({ messages }: ChatTimelineProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p className="text-lg">No messages yet</p>
        <p className="text-sm mt-2">Say hi 🎂</p>
      </div>
    )
  }

  // Group messages by day
  const groupedMessages: { date: Date; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt)
    const lastGroup = groupedMessages[groupedMessages.length - 1]

    if (lastGroup && isSameDay(lastGroup.date, msgDate)) {
      lastGroup.messages.push(msg)
    } else {
      groupedMessages.push({ date: msgDate, messages: [msg] })
    }
  })

  const formatDateSeparator = (date: Date): string => {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM d, yyyy")
  }

  return (
    <div ref={ref} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          {/* Date separator */}
          <div
            role="separator"
            aria-label={`Messages from ${formatDateSeparator(group.date)}`}
            className="text-xs text-gray-400 text-center my-4"
          >
            {formatDateSeparator(group.date)}
          </div>

          {/* Messages for this day */}
          <div className="space-y-3">
            {group.messages.map((msg) => (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="bg-brand-500 text-white rounded-2xl px-3 py-2 shadow-sm max-w-[80%] break-words">
                  {msg.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">{format(new Date(msg.createdAt), "HH:mm")}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
