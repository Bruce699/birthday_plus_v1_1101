"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ChatComposerProps {
  friendId: string
  onSend?: (text: string) => void
}

export function ChatComposer({ friendId, onSend }: ChatComposerProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return

    onSend?.(trimmed)
    setValue("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="sticky bottom-0 border-t bg-background pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)] px-4">
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          aria-label="Message input"
          inputMode="text"
          enterKeyHint="send"
          className="min-h-[44px] max-h-[120px] resize-none rounded-2xl"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          size="icon"
          className="rounded-full h-11 w-11 shrink-0 bg-brand-500 hover:bg-brand-600"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
