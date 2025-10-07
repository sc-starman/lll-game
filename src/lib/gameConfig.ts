export const SYMBOLS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "L"] as const;
export const WINNING_SYMBOL = "L";

export interface GameConfig {
  symbols: typeof SYMBOLS;
  winningSymbol: typeof WINNING_SYMBOL;
  reels: number;
  animationMs: number;
  sounds: {
    win1: boolean;
    win2: boolean;
    win3: boolean;
  };
  weights?: number[] | null;
  persistenceKey: string;
}

export const defaultConfig: GameConfig = {
  symbols: SYMBOLS,
  winningSymbol: WINNING_SYMBOL,
  reels: 3,
  animationMs: 700,
  sounds: { win1: true, win2: true, win3: true },
  weights: null,
  persistenceKey: "ljackpot_bestscore"
};

export interface GameState {
  // score: number;
  // spins: number;
  // jackpots: number;
  lastResult: SpinResult | null;
  isSpinning: boolean;
}

export interface SpinResult {
  reels: string[];
  lCount: number;
  delta: number;
}



// Get result message based on L count
export function getResultMessage(lCount: number, delta: number): string {
  switch (lCount) {
    case 1:
      return "1× L! +1 point";
    case 2:
      return "2× L! +10 points";
    case 3:
      return "JACKPOT! 3× L! +100 points";
    default:
      return "No L this time!";
  }
}

// Persistence helpers
export function loadBestScore(key: string): number {
  try {
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) || 0 : 0;
  } catch {
    return 0;
  }
}