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
  score: number;
  bestScore: number;
  spins: number;
  lastResult: {
    reels: string[];
    lCount: number;
    delta: number;
  } | null;
  isSpinning: boolean;
  muted: boolean;
}

export interface SpinResult {
  reels: string[];
  lCount: number;
  delta: number;
}

// Cryptographically secure random number generator with fallback
export function cryptoRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / 2**32;
  }
  return Math.random();
}

// Weighted random index selection
export function randIndex(weights?: number[] | null): number {
  const r = cryptoRandom();
  
  if (!weights || weights.length !== SYMBOLS.length) {
    return Math.floor(r * SYMBOLS.length);
  }
  
  const sum = weights.reduce((a, b) => a + b, 0);
  let threshold = r * sum;
  
  for (let i = 0; i < weights.length; i++) {
    threshold -= weights[i];
    if (threshold <= 0) return i;
  }
  
  return weights.length - 1;
}

// Core game logic for a single spin
export function spinOnce(config: GameConfig): SpinResult {
  const reels = Array.from(
    { length: config.reels }, 
    () => SYMBOLS[randIndex(config.weights)]
  );
  
  const lCount = reels.filter(s => s === WINNING_SYMBOL).length;
  
  let delta = 0;
  if (lCount === 1) delta = 1;
  if (lCount === 2) delta = 10;
  if (lCount === 3) delta = 100;
  
  return { reels, lCount, delta };
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

export function saveBestScore(key: string, score: number): void {
  try {
    localStorage.setItem(key, score.toString());
  } catch {
    // Silently fail if localStorage is unavailable
  }
}