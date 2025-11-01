"use client"

import { Button } from "@/components/ui/button"

interface DeleteConfirmProps {
  open: boolean
  friend: { id: string; name: string } | null
  onConfirm: (id: string) => void
  onCancel: () => void
}

export function DeleteConfirm({ open, friend, onConfirm, onCancel }: DeleteConfirmProps) {
  if (!open || !friend) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm rounded-2xl bg-background p-6 shadow-lg border">
        <h3 className="text-lg font-semibold">Delete {friend.name}?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This will permanently remove all messages and notes for this friend.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl bg-transparent" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onConfirm(friend.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
