"use client"

interface AvatarMiniProps {
  src?: string
  name: string
}

export function AvatarMini({ src, name }: AvatarMiniProps) {
  const initial = (name?.[0] || "?").toUpperCase()

  if (src) {
    return (
      <img
        src={src || "/placeholder.svg"}
        alt={name}
        className="h-5 w-5 rounded-full border border-white object-cover"
      />
    )
  }

  return (
    <div className="h-5 w-5 rounded-full border border-white bg-brand-300 text-brand-800 grid place-items-center text-[10px] font-semibold">
      {initial}
    </div>
  )
}
