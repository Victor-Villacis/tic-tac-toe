import { Game } from "@/app/types";
import { checkWinner } from "./checkWinner";
import { saveGame } from "./db";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function makeLLMMove(game: Game): Promise<void> {
  const emptyPositions = game.board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index): index is number => index !== null);

  if (emptyPositions.length === 0) return;

  const prompt = `Tic-tac-toe. You are O. Board positions 0-8 (top-left to bottom-right).
Current board: ${game.board.map((cell) => cell ?? "_").join(",")}
Available moves: ${emptyPositions.join(",")}
Respond with ONLY a single number.`;

  try {
    const { text } = await generateText({
      model: openai(game.model ?? "gpt-5.1"),
      prompt,
    });

    const position = parseInt(text.trim());
    const finalPosition = emptyPositions.includes(position)
      ? position
      : emptyPositions[0];

    // Apply move
    game.board[finalPosition] = "O";
    game.moves.push({
      player: "O",
      position: finalPosition,
      timestamp: new Date(),
    });

    // Check win/draw
    const winner = checkWinner(game.board);

    if (winner) {
      game.status = "finished";
      game.winner = winner;
    } else if (game.board.every((cell) => cell !== null)) {
      game.status = "finished";
      game.winner = "draw";
    } else {
      game.currentTurn = "X";
    }

    game.updatedAt = new Date();
    await saveGame(game);
  } catch (error) {
    console.error("LLM move failed:", error);

    // Fallback: random move
    const randomPosition =
      emptyPositions[Math.floor(Math.random() * emptyPositions.length)];

    game.board[randomPosition] = "O";
    game.moves.push({
      player: "O",
      position: randomPosition,
      timestamp: new Date(),
    });

    const winner = checkWinner(game.board);
    if (winner) {
      game.status = "finished";
      game.winner = winner;
    } else if (game.board.every((cell) => cell !== null)) {
      game.status = "finished";
      game.winner = "draw";
    } else {
      game.currentTurn = "X";
    }

    game.updatedAt = new Date();
    await saveGame(game);
  }
}
