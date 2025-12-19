import { NextResponse } from "next/server";
import { Game, CreateGameRequest } from "@/app/types";
import { saveGame } from "@/app/lib/db";

export async function POST(req: Request) {
  const { mode, playerId, model }: CreateGameRequest = await req.json();

  const game: Game = {
    id: crypto.randomUUID(),
    mode,
    model: mode === "vs-llm" ? model ?? "gpt-5.1" : undefined,
    board: Array(9).fill(null),
    currentTurn: "X",
    status: mode === "pvp" ? "waiting" : "in-progress",
    winner: null,
    players: {
      X: playerId,
      O: mode === "vs-llm" ? "llm" : null,
    },
    moves: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await saveGame(game);

  return NextResponse.json({ gameId: game.id });
}
