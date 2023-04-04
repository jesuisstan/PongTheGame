import { createContext } from 'react';

interface GameStateContextData {
  gameState: string;
  setGameState: (gameState: string) => void;
}

export const GameStateContext = createContext<GameStateContextData>({
  gameState: 'lobby',
  setGameState: (string) => {}
});
