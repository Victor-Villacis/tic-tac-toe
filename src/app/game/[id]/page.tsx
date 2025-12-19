"use client";

import { use, useEffect, useState } from "react";
import { useGame } from "@/app/hooks/useGame";
import { Board } from "@/app/components/Board";
import { GameStatus } from "@/app/components/GameStatus";
import Link from "next/link";
import { FaArrowLeft, FaRedo, FaSpinner } from "react-icons/fa";

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [playerId, setPlayerId] = useState<string>("");
  const [joining, setJoining] = useState(false);

  // Get or create playerId
  useEffect(() => {
    let id = localStorage.getItem("playerId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("playerId", id);
    }
    setPlayerId(id);
  }, []);

  const { game, error, makeMove } = useGame(id);

  useEffect(() => {
    if (!game || !playerId) return;
    if (game.mode !== "pvp") return;
    if (game.status !== "waiting") return;
    if (game.players.X === playerId) return;
    if (game.players.O !== null) return;

    const joinGame = async () => {
      setJoining(true);
      try {
        await fetch(`/api/game/${id}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId }),
        });
      } catch (err) {
        console.error("Failed to join:", err);
      } finally {
        setJoining(false);
      }
    };

    joinGame();
  }, [game, playerId, id]);

  if (!game || !playerId) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <FaSpinner className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-zinc-500">Loading game...</p>
      </main>
    );
  }

  if (joining) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <FaSpinner className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-zinc-500">Joining game...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 gap-8">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span className="text-sm">New Game</span>
      </Link>

      {/* Game Status */}
      <GameStatus game={game} playerId={playerId} />

      {/* Board */}
      <Board
        game={game}
        playerId={playerId}
        onMove={(pos) => makeMove(pos, playerId)}
      />

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Move history */}
      {game.moves.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-zinc-600 uppercase tracking-wide">
            Move History
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {game.moves.map((move, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded text-xs font-mono ${
                  move.player === "X"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-teal-500/10 text-teal-400"
                }`}
              >
                {move.player}→{move.position}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Play again button */}
      {game.status === "finished" && (
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
        >
          <FaRedo className="w-4 h-4" />
          Play Again
        </Link>
      )}
    </main>
  );
}