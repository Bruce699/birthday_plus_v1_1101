"use client"

interface ChipToggleProps {
  mode: "free" | "organized"
  onModeChange: (mode: "free" | "organized") => void
}

export function ChipToggle({ mode, onModeChange }: ChipToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onModeChange("free")}
        aria-pressed={mode === "free"}
        className={`
          px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-out
          ${
            mode === "free"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-secondary text-secondary-foreground border border-border hover:bg-accent"
          }
        `}
      >
        Free Input
      </button>
      <button
        onClick={() => onModeChange("organized")}
        aria-pressed={mode === "organized"}
        className={`
          px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-out
          ${
            mode === "organized"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-secondary text-secondary-foreground border border-border hover:bg-accent"
          }
        `}
      >
        Organized
      </button>
    </div>
  )
}
