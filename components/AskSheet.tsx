"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { askQuestion } from "@/lib/ask"
import { getFriends, getMessages } from "@/lib/store"
import type { Friend } from "@/lib/types"
import { Loader2, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  friendName?: string
  friendId?: string
  friendBirthday?: string
  messages?: string[]
}

export function AskSheet({ open, onOpenChange, friendName, friendId, friendBirthday, messages }: AskSheetProps) {
  const [scope, setScope] = useState<"friend" | "general">(friendId ? "friend" : "general")
  const [selectedFriendId, setSelectedFriendId] = useState(friendId || "")
  const [friends, setFriends] = useState<Friend[]>([])
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const answerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setFriends(getFriends())
      if (friendId) {
        setSelectedFriendId(friendId)
        setScope("friend")
      }
    }
  }, [open, friendId])

  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [answer])

  const handleAsk = async () => {
    if (!question.trim()) return
    if (scope === "friend" && !selectedFriendId) {
      toast({
        title: "Select a friend",
        description: "Please select a friend to ask about",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setAnswer("")

    try {
      let payload

      if (scope === "friend") {
        const friend = friends.find((f) => f.id === selectedFriendId)
        if (!friend) return

        const friendMessages = messages || getMessages(selectedFriendId).map((m) => m.text)

        payload = {
          scope: "friend" as const,
          friendId: selectedFriendId,
          question,
          friendSnapshot: {
            name: friendName || friend.name,
            birthday: friendBirthday || friend.birthday,
            messages: friendMessages,
          },
        }
      } else {
        const allFriendsData = friends.map((f) => ({
          id: f.id,
          name: f.name,
          birthday: f.birthday,
          messages: getMessages(f.id).map((m) => m.text),
        }))

        payload = {
          scope: "general" as const,
          question,
          allFriends: allFriendsData,
        }
      }

      const result = await askQuestion(payload)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setAnswer(result.answer || "No answer received.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get answer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(answer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "Answer copied to clipboard",
    })
  }

  const selectedFriend = friends.find((f) => f.id === selectedFriendId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl h-[80vh] flex flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle>Ask a Question</SheetTitle>
          <SheetDescription>Get answers about your friends or general questions</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 overflow-y-auto flex-1">
          {/* Scope Toggle */}
          <Tabs value={scope} onValueChange={(v) => setScope(v as "friend" | "general")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="friend">About a friend</TabsTrigger>
            </TabsList>
          </Tabs>

          {scope === "friend" && (
            <Select value={selectedFriendId} onValueChange={setSelectedFriendId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a friend" />
              </SelectTrigger>
              <SelectContent>
                {friends.map((friend) => (
                  <SelectItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Question Input */}
          <div className="space-y-2">
            <Textarea
              placeholder={
                scope === "friend" && selectedFriend ? `Ask about ${selectedFriend.name}...` : "Ask a question..."
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] resize-none"
              disabled={loading}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleAsk}
            disabled={!question.trim() || loading || (scope === "friend" && !selectedFriendId)}
            className="w-full bg-brand-500 hover:bg-brand-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              "Ask"
            )}
          </Button>

          {/* Answer Panel */}
          {answer && (
            <Card ref={answerRef} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Answer</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">{answer}</div>
              {answer.includes("I'm not sure from the notes") && selectedFriend && (
                <p className="text-xs text-muted-foreground italic">
                  Try asking more specifically or add more notes about {selectedFriend.name}.
                </p>
              )}
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
