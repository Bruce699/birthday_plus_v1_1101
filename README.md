# birthday + 🎂

A warm, Meta-style one-sided note app for keeping track of your friends' birthdays, preferences, and special moments.

## Features

- 📝 **Free-form notes** - Write anything about your friends
- ✨ **AI-organized view** - See your notes organized into summaries, highlights, todos, and sentiments (mock API)
- 🎨 **Warm orange theme** - Clean, friendly interface with rounded corners and soft shadows
- 📱 **Mobile-first** - Optimized for mobile devices with safe-area support
- 💾 **Local storage** - All data persists in your browser

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **lucide-react** icons
- **date-fns** for time formatting

## Getting Started

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Initialize shadcn/ui components (if needed):
\`\`\`bash
npx shadcn@latest init
npx shadcn@latest add button card input textarea toast sheet skeleton
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
app/
  layout.tsx              # Root layout with Toaster
  page.tsx                # Friend list page
  friend/[id]/page.tsx    # Individual friend note page
  api/organize/route.ts   # Mock API for organizing notes
components/
  AddFriend.tsx           # Add friend form in sheet
  FriendCard.tsx          # Friend list item with avatar
  ChipToggle.tsx          # Toggle between Free Input and Organized
  NoteEditor.tsx          # Textarea for free-form notes
  OrganizedView.tsx       # Display organized notes with cards
  EmptyState.tsx          # Empty state for friend list
lib/
  store.ts                # localStorage utilities
  types.ts                # TypeScript types
  organize.ts             # API client for organizing notes
\`\`\`

## Usage

1. **Add a friend** - Click "Add Friend" button and enter their name
2. **Take notes** - Click on a friend to open their page and write notes in Free Input mode
3. **View organized** - Switch to Organized tab to see AI-organized summaries (mock data)
4. **Regenerate** - Click Regenerate to fetch new organized view

## Note

This is a prototype with a **mock API**. The `/api/organize` endpoint returns static mock data and does not use real AI/OpenAI integration.

## License

MIT
