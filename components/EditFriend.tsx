"use client"

import type React from "react"

import { useState } from "react"
import { updateFriendWithFile } from "@/lib/store"
import type { Friend } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/ImageUploader"
import { useToast } from "@/hooks/use-toast"

interface EditFriendProps {
  friend: Friend
  onSuccess: () => void
}

export function EditFriend({ friend, onSuccess }: EditFriendProps) {
  const [name, setName] = useState(friend.name)
  const [birthday, setBirthday] = useState(friend.birthday)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(friend.avatarUrl)
  const [file, setFile] = useState<File | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      toast({
        title: "Name required",
        description: "Please enter a friend's name.",
        variant: "destructive",
      })
      return
    }

    if (!birthday) {
      toast({
        title: "Birthday required",
        description: "Please enter a birthday.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateFriendWithFile(friend.id, { name: trimmedName, birthday, avatarUrl }, file)
      toast({
        title: "Updated successfully!",
        description: `${trimmedName}'s details have been updated.`,
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update friend. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (dataUrl?: string, uploadedFile?: File) => {
    setAvatarUrl(dataUrl)
    setFile(uploadedFile)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label>Name</Label>
        <Input
          type="text"
          placeholder="Friend's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-2xl mt-1"
          required
        />
      </div>

      <div>
        <Label>Birthday</Label>
        <Input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="rounded-2xl mt-1"
          required
        />
      </div>

      <ImageUploader value={avatarUrl} onChange={handleImageChange} />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
