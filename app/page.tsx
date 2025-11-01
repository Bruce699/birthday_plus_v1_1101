"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getFriends, deleteFriend, addMessage } from "@/lib/store"
import type { Friend } from "@/lib/types"
import { FriendCard } from "@/components/FriendCard"
import { AddFriend } from "@/components/AddFriend"
import { EmptyState } from "@/components/EmptyState"
import { AskSheet } from "@/components/AskSheet"
import { DeleteConfirm } from "@/components/DeleteConfirm"
import { Plus, MessageCircleQuestion, PenLine, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [open, setOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)
  const [askOpen, setAskOpen] = useState(false)
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState<string>("")
  const [noteText, setNoteText] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    setFriends(getFriends())
  }, [])

  const handleFriendAdded = () => {
    setFriends(getFriends())
    setOpen(false)
  }

  const handleFriendUpdated = () => {
    setFriends(getFriends())
  }

  const handleDeleteRequest = (id: string, name: string) => {
    setConfirmDelete({ id, name })
  }

  const handleDeleteConfirm = (id: string) => {
    deleteFriend(id)
    setFriends(getFriends())
    setConfirmDelete(null)
    toast({
      title: "Deleted",
      description: "Friend and all messages removed",
    })
  }

  const handleQuickNoteSend = () => {
    if (!selectedFriendId || !noteText.trim()) return

    addMessage(selectedFriendId, noteText.trim())

    const friend = friends.find((f) => f.id === selectedFriendId)
    toast({
      title: "Saved",
      description: `Note saved to ${friend?.name}`,
    })

    setNoteText("")
    setSelectedFriendId("")
    setQuickNoteOpen(false)
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* AppBar */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-brand-600">birthday +</h1>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white rounded-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Friend
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Add a Friend</SheetTitle>
                <SheetDescription>Enter your friend's details to start keeping notes.</SheetDescription>
              </SheetHeader>
              <AddFriend onSuccess={handleFriendAdded} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="px-4 max-w-2xl mx-auto pb-2">
          <Tabs value={pathname === "/calendar" ? "calendar" : "friends"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="friends" onClick={() => router.push("/")}>
                Friends
              </TabsTrigger>
              <TabsTrigger value="calendar" onClick={() => router.push("/calendar")}>
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Friend List */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {friends.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onUpdate={handleFriendUpdated}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 pointer-events-none z-20">
        <div className="mx-auto max-w-2xl px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] flex justify-between">
          <button
            aria-label="Ask a question"
            className="pointer-events-auto h-14 w-14 rounded-full bg-brand-500 text-white shadow-lg grid place-items-center active:scale-95 transition-transform"
            onClick={() => setAskOpen(true)}
          >
            <MessageCircleQuestion className="h-6 w-6" />
          </button>
          <button
            aria-label="Quick note"
            className="pointer-events-auto h-14 w-14 rounded-full bg-brand-500 text-white shadow-lg grid place-items-center active:scale-95 transition-transform"
            onClick={() => setQuickNoteOpen(true)}
          >
            <PenLine className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Sheet open={quickNoteOpen} onOpenChange={setQuickNoteOpen}>
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
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note..."
              className="min-h-[100px] rounded-2xl"
            />

            <Button
              onClick={handleQuickNoteSend}
              disabled={!selectedFriendId || !noteText.trim()}
              className="w-full rounded-2xl bg-brand-500 hover:bg-brand-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AskSheet open={askOpen} onOpenChange={setAskOpen} />

      <DeleteConfirm
        open={!!confirmDelete}
        friend={confirmDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
