import { NextResponse } from "next/server";
import { MakeMoveRequest } from "@/app/types";
import { getGame, saveGame } from "@/app/lib/db";
import { checkWinner } from "@/app/lib/checkWinner";
import { makeLLMMove } from "@/app/lib/llm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { playerId, position }: MakeMoveRequest = await request.json();

  const game = await getGame(id);

  // Validation
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.status !== "in-progress") {
    return NextResponse.json(
      { error: "Game is not in progress" },
      { status: 400 }
    );
  }

  if (game.board[position] !== null) {
    return NextResponse.json(
      { error: "Position is already taken" },
      { status: 400 }
    );
  }

  if (game.players[game.currentTurn as "X" | "O"] !== playerId) {
    return NextResponse.json({ error: "It's not your turn" }, { status: 400 });
  }

  // Apply move
  game.board[position] = game.currentTurn;
  game.moves.push({
    player: game.currentTurn,
    position,
    timestamp: new Date(),
  });

  // Check win or draw
  const winner = checkWinner(game.board);

  if (winner) {
    game.status = "finished";
    game.winner = winner;
  } else if (game.board.every((cell) => cell !== null)) {
    game.status = "finished";
    game.winner = "draw";
  } else {
    game.currentTurn = game.currentTurn === "X" ? "O" : "X";
  }

  // Update
  game.updatedAt = new Date();
  await saveGame(game);

  // LLM move if applicable
  if (game.mode === "vs-llm" && game.status === "in-progress") {
    await makeLLMMove(game);
  }

  return NextResponse.json(game);
}
