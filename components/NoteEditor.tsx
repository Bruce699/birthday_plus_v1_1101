"use client"

import { useState, useEffect } from "react"
import type { Friend } from "@/lib/types"
import { updateFriend } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

interface NoteEditorProps {
  friend: Friend
  onUpdate: (friend: Friend) => void
}

export function NoteEditor({ friend, onUpdate }: NoteEditorProps) {
  const [notes, setNotes] = useState(friend.notes)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setNotes(friend.notes)
  }, [friend.notes])

  const handleSave = () => {
    setIsSaving(true)

    try {
      updateFriend(friend.id, { notes })
      const updatedFriend = { ...friend, notes, updatedAt: Date.now() }
      onUpdate(updatedFriend)

      toast({
        title: "Saved",
        description: "Your notes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 pb-24">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write anything about your friend here..."
        className="min-h-[400px] resize-none rounded-2xl text-base"
      />

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t supports-[backdrop-filter]:bg-background/60 pb-safe">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}
