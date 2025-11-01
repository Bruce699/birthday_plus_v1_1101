export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🎂</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">No friends yet</h2>
      <p className="text-muted-foreground">Add one to start keeping notes!</p>
    </div>
  )
}
