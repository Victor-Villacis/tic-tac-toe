"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRobot, FaUserFriends, FaPlay, FaSpinner } from "react-icons/fa";

const MODELS = [{ id: "gpt-5.1", name: "GPT-5.1", description: "Latest model" }];

export function CreateGame() {
  const router = useRouter();
  const [mode, setMode] = useState<"pvp" | "vs-llm">("vs-llm");
  const [model, setModel] = useState<string>("gpt-5.1");
  const [loading, setLoading] = useState(false);

  const getPlayerId = () => {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("playerId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("playerId", id);
    }
    return id;
  };

  const handleCreate = async () => {
    setLoading(true);
    const playerId = getPlayerId();

    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          playerId,
          model: mode === "vs-llm" ? model : undefined,
        }),
      });

      const { gameId } = await res.json();
      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      {/* Mode Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">
          Game Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("vs-llm")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
              mode === "vs-llm"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <FaRobot className="w-6 h-6" />
            <span className="font-medium">vs AI</span>
          </button>
          <button
            onClick={() => setMode("pvp")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
              mode === "pvp"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <FaUserFriends className="w-6 h-6" />
            <span className="font-medium">vs Friend</span>
          </button>
        </div>
      </div>

      {/* Model Selection */}
      {mode === "vs-llm" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wide">
            AI Model
          </label>
          <div className="flex flex-col gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  model === m.id
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-zinc-500">{m.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <FaSpinner className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <FaPlay className="w-4 h-4" />
            Start Game
          </>
        )}
      </button>

      {mode === "pvp" && (
        <p className="text-xs text-zinc-500 text-center">
          Share the game link with your friend to play together
        </p>
      )}
    </div>
  );
}