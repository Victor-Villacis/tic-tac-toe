import { Game } from "@/app/types";

const games = new Map<string, Game>();

export async function getGame(id: string): Promise<Game | null> {
  return games.get(id) ?? null;
}

export async function saveGame(game: Game): Promise<void> {
  games.set(game.id, game);
}

export async function getAllGames(): Promise<Game[]> {
  return Array.from(games.values());
}

export async function getGamesByPlayer(playerId: string): Promise<Game[]> {
  return Array.from(games.values()).filter(
    (game) => game.players.X === playerId || game.players.O === playerId
  );
}