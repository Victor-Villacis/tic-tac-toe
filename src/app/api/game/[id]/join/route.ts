import { NextResponse } from "next/server";
import { JoinGameRequest } from "@/app/types";
import { getGame, saveGame } from "@/app/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { playerId }: JoinGameRequest = await request.json();

  const game = await getGame(id);

  // Validation
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.mode !== "pvp") {
    return NextResponse.json(
      { error: "Cannot join LLM game" },
      { status: 400 }
    );
  }

  if (game.status !== "waiting") {
    return NextResponse.json(
      { error: "Game already started" },
      { status: 400 }
    );
  }

  if (game.players.X === playerId) {
    return NextResponse.json(
      { error: "Cannot join your own game" },
      { status: 400 }
    );
  }

  if (game.players.O !== null) {
    return NextResponse.json({ error: "Game is full" }, { status: 400 });
  }

  // Join game
  game.players.O = playerId;
  game.status = "in-progress";
  game.updatedAt = new Date();

  await saveGame(game);

  return NextResponse.json(game);
}
