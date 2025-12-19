"use client";

import { Game, Player } from "@/app/types";

interface BoardProps {
  game: Game;
  playerId: string;
  onMove: (position: number) => void;
}

export function Board({ game, playerId, onMove }: BoardProps) {
  const isMyTurn = game.players[game.currentTurn as "X" | "O"] === playerId;
  const isGameOver = game.status === "finished";

  const renderCell = (cell: Player | null, index: number) => {
    const canClick = cell === null && isMyTurn && !isGameOver;

    return (
      <button
        key={index}
        onClick={() => canClick && onMove(index)}
        disabled={!canClick}
        className={`
          aspect-square w-full
          flex items-center justify-center
          text-5xl font-black
          rounded-lg border-2
          transition-colors
          ${canClick
            ? "border-zinc-700 hover:border-emerald-500 hover:bg-emerald-500/5 cursor-pointer"
            : "border-zinc-800 cursor-not-allowed"
          }
          ${cell === "X" ? "text-emerald-400" : ""}
          ${cell === "O" ? "text-teal-400" : ""}
        `}
      >
        {cell}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-72 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
      {game.board.map((cell, i) => renderCell(cell, i))}
    </div>
  );
}