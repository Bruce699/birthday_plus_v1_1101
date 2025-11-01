"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  value?: string
  onChange: (dataUrl?: string, file?: File) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      onChange(dataUrl, file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(undefined)
    onChange(undefined, undefined)
  }

  return (
    <div className="space-y-2">
      <Label>Profile Photo (optional)</Label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="h-20 w-20 rounded-2xl object-cover border-2 border-brand-200"
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
          <Label
            htmlFor="photo-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {preview ? "Change Photo" : "Upload Photo"}
          </Label>
        </div>
      </div>
    </div>
  )
}
