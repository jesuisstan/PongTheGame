import { createContext } from 'react';

interface GameStatusContextData {
  gameStatus: string;
  setGameStatus: (gameState: string) => void;
}

export const GameStatusContext = createContext<GameStatusContextData>({
  gameStatus: 'lobby',
  setGameStatus: (string) => {}
});
