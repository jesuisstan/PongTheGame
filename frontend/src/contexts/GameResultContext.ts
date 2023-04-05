import { createContext } from 'react';
import { GameResult } from '../components/game/game.interface';

interface GameResultContextData {
  gameResult: GameResult | null;
  setGameResult: (gameResult: GameResult) => void;
}

export const GameResultContext = createContext<GameResultContextData>({
  gameResult: null,
  setGameResult: (gameResult) => {}
});
