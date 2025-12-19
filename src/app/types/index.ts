export type Player = "X" | "O";

export interface Move {
  player: Player;
  position: number; // 0-8
  timestamp: Date;
}

export interface Game {
  id: string;
  mode: "pvp" | "vs-llm";
  model?: string; // only for "vs-llm"
  board: (Player | null)[]; // length 9
  currentTurn: Player;
  status: "waiting" | "in-progress" | "finished";
  winner: Player | "draw" | null;
  players: {
    X: string | null; // playerId
    O: string | null;
  };
  moves: Move[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGameRequest {
  mode: "pvp" | "vs-llm";
  model?: string;
  playerId: string;
}

export interface MakeMoveRequest {
  playerId: string;
  position: number;
}

export interface JoinGameRequest {
  playerId: string;
}
