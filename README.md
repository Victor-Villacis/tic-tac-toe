# Tic-Tac-Toe

Real-time multiplayer Tic-Tac-Toe with AI opponent support.

## Install

```bash
npm install
```

## Setup

### Playing vs AI (LLM)

Create a `.env.local` file in the project root:

```dotenv
OPENAI_API_KEY=sk-your-key-here
```

Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)

### Playing vs Friend (PvP)

No API key needed for PvP mode.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Play

### vs AI

1. Select "vs AI" mode
2. Choose your model
3. Click "Start Game"
4. You are X, AI is O
5. Click any cell to make your move

### vs Friend (PvP)

1. Select "vs Friend" mode
2. Click "Start Game"
3. Click "Copy invite link"
4. Send the link to your friend
5. **Important:** Your friend must open the link in an **incognito window** or **different browser** (same browser shares the same player ID)
6. Once they join, the game begins
7. Take turns clicking cells

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Server-Sent Events (SSE)