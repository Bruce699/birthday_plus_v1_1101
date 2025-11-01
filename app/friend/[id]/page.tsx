"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getFriend, getMessages, addMessage } from "@/lib/store"
import type { Friend, Message } from "@/lib/types"
import { ChipToggle } from "@/components/ChipToggle"
import { ChatTimeline } from "@/components/ChatTimeline"
import { ChatComposer } from "@/components/ChatComposer"
import { OrganizedView } from "@/components/OrganizedView"
import { EditFriend } from "@/components/EditFriend"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FriendPage() {
  const params = useParams()
  const router = useRouter()
  const [friend, setFriend] = useState<Friend | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<"free" | "organized">("free")
  const [editOpen, setEditOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const id = params.id as string
    const foundFriend = getFriend(id)
    if (foundFriend) {
      setFriend(foundFriend)
      setMessages(getMessages(id))
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const handleSend = (text: string) => {
    if (!friend) return

    const newMessage = addMessage(friend.id, text)
    setMessages((prev) => [...prev, newMessage])

    toast({
      title: "Sent",
      description: "Message saved",
    })
  }

  const handleEditSuccess = () => {
    if (friend) {
      const updatedFriend = getFriend(friend.id)
      if (updatedFriend) {
        setFriend(updatedFriend)
      }
    }
    setEditOpen(false)
  }

  if (!friend) {
    return null
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-3 px-4 max-w-2xl mx-auto">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold flex-1">{friend.name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit Friend</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mode Toggle */}
        <div className="max-w-2xl mx-auto w-full px-4 py-4">
          <ChipToggle mode={mode} onModeChange={setMode} />
        </div>

        {/* Content */}
        {mode === "free" ? (
          <>
            <ChatTimeline messages={messages} />
            <ChatComposer friendId={friend.id} onSend={handleSend} />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4">
              <OrganizedView friendId={friend.id} />
            </div>
          </div>
        )}
      </div>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Edit Friend</SheetTitle>
            <SheetDescription>Update your friend's details</SheetDescription>
          </SheetHeader>
          <EditFriend friend={friend} onSuccess={handleEditSuccess} />
        </SheetContent>
      </Sheet>
    </>
  )
}
