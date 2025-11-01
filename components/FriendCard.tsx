"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Friend } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditFriend } from "@/components/EditFriend"
import { format } from "date-fns"
import { MoreVertical, Cake, Trash2 } from "lucide-react"

interface FriendCardProps {
  friend: Friend
  onUpdate: () => void
  onDelete: (id: string, name: string) => void
}

export function FriendCard({ friend, onUpdate, onDelete }: FriendCardProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const initial = friend.name.charAt(0).toUpperCase()
  const birthdayDisplay = friend.birthday ? format(new Date(friend.birthday), "MMM d") : null

  const handleEditSuccess = () => {
    setEditOpen(false)
    onUpdate()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(friend.id, friend.name)
  }

  return (
    <>
      <Card className="p-4 transition-all duration-200 ease-out hover:shadow-md rounded-2xl">
        <div className="flex items-center gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-200 flex items-center justify-center cursor-pointer"
            onClick={() => router.push(`/friend/${friend.id}`)}
          >
            {friend.avatarUrl ? (
              <img
                src={friend.avatarUrl || "/placeholder.svg"}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-brand-800">{initial}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => router.push(`/friend/${friend.id}`)}>
            <h3 className="font-semibold text-foreground truncate">{friend.name}</h3>
            {birthdayDisplay && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Cake className="h-3 w-3" />
                <span>{birthdayDisplay}</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 text-muted-foreground hover:text-red-500"
            onClick={handleDelete}
            aria-label="Delete friend"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

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
