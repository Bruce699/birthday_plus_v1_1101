"use client"

import { useState, useEffect } from "react"
import type { OrganizedNote } from "@/lib/types"
import { organizeNotes } from "@/lib/organize"
import { getMessages } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Sparkles, CheckCircle2, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrganizedViewProps {
  friendId: string
}

export function OrganizedView({ friendId }: OrganizedViewProps) {
  const [organized, setOrganized] = useState<OrganizedNote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const messages = getMessages(friendId)
  const notesText = messages
    .map((m) => m.text.trim())
    .filter(Boolean)
    .join("\n\n")

  const fetchOrganized = async () => {
    if (!notesText.trim()) {
      setOrganized(null)
      return
    }

    setIsLoading(true)
    try {
      const result = await organizeNotes(notesText)
      setOrganized(result)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to organize notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganized()
  }, [notesText])

  const handleRegenerate = () => {
    fetchOrganized()
  }

  if (!notesText.trim()) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No messages to organize yet.</p>
        <p className="text-sm mt-2">Switch to Free Input to add some messages.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4 pb-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-2xl" />
        </div>
        <Card className="rounded-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!organized) {
    return null
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Regenerate button */}
      <div className="flex justify-end">
        <Button
          onClick={handleRegenerate}
          variant="outline"
          size="sm"
          className="rounded-2xl bg-transparent"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </div>

      {/* Summary */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-600">
            <Sparkles className="h-5 w-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{organized.summary}</p>
        </CardContent>
      </Card>

      {/* Highlights */}
      {organized.highlights.length > 0 && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-600">
              <Sparkles className="h-5 w-5" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {organized.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1">•</span>
                  <span className="text-foreground leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Todos */}
      {organized.todos.length > 0 && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-600">
              <CheckCircle2 className="h-5 w-5" />
              To-Dos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {organized.todos.map((todo, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-brand-500 mt-1">□</span>
                  <span className="text-foreground leading-relaxed">{todo}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sentiments */}
      {organized.sentiments.length > 0 && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-600">
              <Heart className="h-5 w-5" />
              Sentiments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {organized.sentiments.map((sentiment, index) => (
                <span key={index} className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                  {sentiment}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
