"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getFriends, friendsOn, buildMonth, getBirthdayMonthDay } from "@/lib/store"
import type { Friend } from "@/lib/types"
import { AvatarMini } from "@/components/AvatarMini"
import { CalendarStories } from "@/components/CalendarStories"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Plus, MessageSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CalendarPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedDay, setSelectedDay] = useState<{ month: number; day: number } | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const today = new Date()

  useEffect(() => {
    setFriends(getFriends())
  }, [])

  const handleDayClick = (month: number, day: number) => {
    const people = friendsOn(month, day, friends)
    if (people.length > 0) {
      setSelectedDay({ month, day })
      setSheetOpen(true)
    }
  }

  const scrollToDay = (birthday: string) => {
    const monthDay = getBirthdayMonthDay(birthday)
    const element = document.getElementById(`day-${monthDay}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      // Flash the cell
      element.classList.add("ring-4", "ring-brand-400")
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-brand-400")
      }, 1500)
    }
  }

  const selectedPeople = selectedDay ? friendsOn(selectedDay.month, selectedDay.day, friends) : []

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* AppBar */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-brand-600">birthday +</h1>
          <Button
            size="sm"
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-full"
            onClick={() => router.push("/")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>
        </div>
        <div className="px-4 max-w-2xl mx-auto pb-2">
          <Tabs value="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="friends" onClick={() => router.push("/")}>
                Friends
              </TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <CalendarStories friends={friends} onTap={(f) => scrollToDay(f.birthday)} />

      {/* Calendar Grid */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {MONTHS.map((monthName, idx) => {
          const monthNum = idx + 1
          const weeks = buildMonth(currentYear, monthNum)

          return (
            <section key={monthName} className="space-y-3">
              {/* Month Header */}
              <div className="sticky top-32 bg-background/90 backdrop-blur py-2 -mx-4 px-4 z-[5]">
                <h2 className="text-sm font-medium text-gray-500">{monthName}</h2>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-[10px] text-gray-500 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {weeks.flat().map((date, cellIdx) => {
                  if (!date) {
                    return <div key={`empty-${cellIdx}`} className="min-h-[56px]" />
                  }

                  const day = date.getDate()
                  const people = friendsOn(monthNum, day, friends)
                  const isToday =
                    today.getDate() === day && today.getMonth() === monthNum - 1 && today.getFullYear() === currentYear

                  const monthDay = `${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`

                  return (
                    <div
                      key={cellIdx}
                      id={`day-${monthDay}`}
                      className={`relative min-h-[56px] p-1 border rounded-xl transition-all ${
                        people.length > 0 ? "cursor-pointer hover:shadow-md hover:border-brand-300" : ""
                      } ${isToday ? "ring-2 ring-brand-400" : ""}`}
                      onClick={() => people.length > 0 && handleDayClick(monthNum, day)}
                    >
                      <div className="text-[10px] text-gray-500">{day}</div>
                      {people.length > 0 && (
                        <div className="absolute left-1 bottom-1 flex -space-x-1">
                          {people.slice(0, 3).map((person) => (
                            <AvatarMini key={person.id} src={person.avatarUrl} name={person.name} />
                          ))}
                          {people.length > 3 && (
                            <span className="h-5 min-w-5 px-1 rounded-full border bg-white text-[10px] grid place-items-center font-medium">
                              +{people.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>

      {/* Birthday Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>
              {selectedDay &&
                `Birthdays on ${format(new Date(currentYear, selectedDay.month - 1, selectedDay.day), "MMM d")}`}
            </SheetTitle>
            <SheetDescription>Friends celebrating their birthday</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 mt-4">
            {selectedPeople.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 rounded-2xl border hover:bg-accent transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center">
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl || "/placeholder.svg"}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-semibold text-brand-800">
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{person.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-transparent"
                    onClick={() => {
                      setSheetOpen(false)
                      router.push(`/friend/${person.id}`)
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-brand-500 hover:bg-brand-600"
                    onClick={() => {
                      setSheetOpen(false)
                      router.push(`/friend/${person.id}`)
                    }}
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
