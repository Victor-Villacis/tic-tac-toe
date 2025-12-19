"use client";

import { Game } from "@/app/types";
import {
  FaHourglass,
  FaHandshake,
  FaTrophy,
  FaTimesCircle,
  FaRobot,
  FaHandPointer,
  FaClock,
  FaCopy
} from "react-icons/fa";

interface GameStatusProps {
  game: Game;
  playerId: string;
}

export function GameStatus({ game, playerId }: GameStatusProps) {
  const mySymbol = game.players.X === playerId ? "X" : "O";
  const isMyTurn = game.players[game.currentTurn as "X" | "O"] === playerId;

  const getStatusContent = () => {
    if (game.status === "waiting") {
      return {
        title: "Waiting for opponent",
        subtitle: "Share this link with a friend",
        icon: <FaHourglass className="w-8 h-8" />,
        color: "text-amber-400",
      };
    }

    if (game.status === "finished") {
      if (game.winner === "draw") {
        return {
          title: "It's a draw!",
          subtitle: "Well played by both",
          icon: <FaHandshake className="w-8 h-8" />,
          color: "text-zinc-400",
        };
      }

      const didIWin = game.winner === mySymbol;
      return {
        title: didIWin ? "You won!" : "You lost",
        subtitle: didIWin ? "Congratulations!" : "Better luck next time",
        icon: didIWin ? <FaTrophy className="w-8 h-8" /> : <FaTimesCircle className="w-8 h-8" />,
        color: didIWin ? "text-emerald-400" : "text-red-400",
      };
    }

    if (game.mode === "vs-llm" && !isMyTurn) {
      return {
        title: "AI is thinking...",
        subtitle: `Playing against ${game.model}`,
        icon: <FaRobot className="w-8 h-8 animate-pulse" />,
        color: "text-purple-400",
      };
    }

    return {
      title: isMyTurn ? "Your turn" : "Opponent's turn",
      subtitle: `You are ${mySymbol}`,
      icon: isMyTurn ? <FaHandPointer className="w-8 h-8" /> : <FaClock className="w-8 h-8" />,
      color: isMyTurn ? "text-emerald-400" : "text-zinc-400",
    };
  };

  const status = getStatusContent();

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className={status.color}>{status.icon}</span>
      <h2 className={`text-2xl font-bold ${status.color}`}>{status.title}</h2>
      <p className="text-sm text-zinc-500">{status.subtitle}</p>

      {game.status === "waiting" && (
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="mt-2 flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <FaCopy className="w-3 h-3" />
          Copy invite link
        </button>
      )}

      {game.mode === "vs-llm" && game.status !== "finished" && (
        <div className="mt-1 px-3 py-1 rounded-full bg-zinc-800/50 text-xs text-zinc-500">
          Model: {game.model}
        </div>
      )}
    </div>
  );
}