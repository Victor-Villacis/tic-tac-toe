"use client";

import { useState, useEffect } from "react";
import { Game } from "@/app/types";

export function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/game/${gameId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setGame(data);
        setError(null);
      } catch {
        console.error("Failed to parse game data");
      }
    };

    eventSource.onerror = () => {
      setError("Connection lost. Reconnecting...");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [gameId]);

  const makeMove = async (position: number, playerId: string) => {
    setError(null);

    try {
      const res = await fetch(`/api/game/${gameId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, playerId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to make move");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return { game, error, makeMove };
}
