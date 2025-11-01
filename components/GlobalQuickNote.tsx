"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenLine, Send } from "lucide-react"
import { getFriends, addMessage } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function GlobalQuickNote() {
  const [open, setOpen] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState<string>("")
  const [text, setText] = useState("")
  const { toast } = useToast()

  const friends = getFriends()

  const handleSend = () => {
    if (!selectedFriendId || !text.trim()) return

    addMessage(selectedFriendId, text.trim())

    const friend = friends.find((f) => f.id === selectedFriendId)
    toast({
      title: "Saved",
      description: `Note saved to ${friend?.name}`,
    })

    // Reset and close
    setText("")
    setSelectedFriendId("")
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-brand-500 hover:bg-brand-600 z-50"
          style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          <PenLine className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Quick Note</SheetTitle>
          <SheetDescription>Send a quick note to any friend</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <Select value={selectedFriendId} onValueChange={setSelectedFriendId}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="Select a friend" />
            </SelectTrigger>
            <SelectContent>
              {friends.map((friend) => (
                <SelectItem key={friend.id} value={friend.id}>
                  <div className="flex items-center gap-2">
                    {friend.avatarUrl ? (
                      <img
                        src={friend.avatarUrl || "/placeholder.svg"}
                        alt={friend.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-brand-300 text-brand-800 grid place-items-center text-[10px] font-semibold">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{friend.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your note..."
            className="min-h-[100px] rounded-2xl"
          />

          <Button
            onClick={handleSend}
            disabled={!selectedFriendId || !text.trim()}
            className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
