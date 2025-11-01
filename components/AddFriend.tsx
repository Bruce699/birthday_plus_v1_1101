"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addFriend } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/ImageUploader"
import { useToast } from "@/hooks/use-toast"

interface AddFriendProps {
  onSuccess: () => void
}

export function AddFriend({ onSuccess }: AddFriendProps) {
  const [name, setName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [file, setFile] = useState<File | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
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
      const newFriend = await addFriend(trimmedName, birthday, file)
      toast({
        title: "Added successfully!",
        description: `${trimmedName} has been added to your friends.`,
      })
      setName("")
      setBirthday("")
      setAvatarUrl(undefined)
      setFile(undefined)
      onSuccess()

      // Navigate to the new friend's page
      setTimeout(() => {
        router.push(`/friend/${newFriend.id}`)
      }, 100)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add friend. Please try again.",
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
          autoFocus
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
        {isSubmitting ? "Adding..." : "Add"}
      </Button>
    </form>
  )
}
