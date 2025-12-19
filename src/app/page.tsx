'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaRobot, FaUserFriends, FaPlay, FaSpinner } from "react-icons/fa";

const MODELS = ["gpt-5.1"];

export default function Home() {
    const router = useRouter();
    const [mode, setMode] = useState<"pvp" | "vs-llm">("vs-llm");
    const [model, setModel] = useState<string>("gpt-5.1");
    const [loading, setLoading] = useState<boolean>(false);

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
                body: JSON.stringify({ mode, model, playerId }),
            });
            const data = await res.json();
            router.push(`/game/${data.gameId}`);
        } catch (error) {
            console.error("Error creating game:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Tic-Tac-Toe</h1>

            <div className="flex flex-col gap-6 w-full max-w-sm">
                {/* Mode Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-wide">
                        Game Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setMode("vs-llm")}
                            className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors ${
                                mode === "vs-llm"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                        >
                            <FaRobot className="w-5 h-5" />
                            <span className="font-medium">vs AI</span>
                        </button>
                        <button
                            onClick={() => setMode("pvp")}
                            className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors ${
                                mode === "pvp"
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                        >
                            <FaUserFriends className="w-5 h-5" />
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
                                    key={m}
                                    onClick={() => setModel(m)}
                                    className={`p-3 rounded-lg border text-left transition-colors ${
                                        model === m
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                            : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Start Button */}
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
            </div>
        </main>
    );
}