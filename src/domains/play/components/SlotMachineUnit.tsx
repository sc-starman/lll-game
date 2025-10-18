import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SlotMachineUnitProps {
  reels: string[];
  isSpinning: boolean;
  winningReels: boolean[];
  onSpin: () => void;
  noChips?: boolean;
  jackpot?: boolean;
}

export function SlotMachineUnit({ 
  reels, 
  isSpinning, 
  winningReels, 
  onSpin, 
  noChips,
  jackpot = false 
}: SlotMachineUnitProps) {
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number}>>([]);
  const hasWin = winningReels.some(w => w);

  // Generate celebration particles on win
  useEffect(() => {
    if (hasWin && !isSpinning) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasWin, isSpinning]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto relative">
      {/* Jackpot Header - Show when winning */}
      {/* {!jackpot && hasWin && !isSpinning && (
        <div className="absolute left-1/2 -translate-x-1/2 text-center animate-jackpot z-20">
          <h2 className="text-5xl font-bold font-orbitron text-neon-yellow text-glow-gold tracking-wider animate-bounce-in">
            JACKPOT!
          </h2>
        </div>
      )} */}

      {/* Main Slot Machine Container */}
       <div className="relative bg-card rounded-3xl border-2 border-neon-pink/30 shadow-glow-pink p-6">
        {/* Machine Frame Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-border opacity-20 blur-md -z-10" />

        {/* Three Separated Reels */}
        <div className="flex gap-4 justify-center">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className={cn(
                "relative w-20 h-24 bg-reel-bg rounded-2xl border-2 flex items-center justify-center",
                "shadow-inner border-neon-cyan/40 overflow-hidden",
                winningReels[index] && !isSpinning && "border-neon-yellow shadow-glow-yellow animate-pulse-win",
                isSpinning && "animate-spin-reel"
              )}
              style={{
                animationDelay: isSpinning ? `${index * 150}ms` : '0ms'
              }}
            >
              {/* Reel Inner Circle Effect */}
              <div className="absolute inset-2 rounded-xl border border-neon-cyan/20 bg-gradient-reel" />

              {/* Symbol */}
              <div
                className={cn(
                  "text-3xl font-bold font-orbitron transition-all duration-300 relative z-10",
                  symbol === "L"
                    ? "text-neon-yellow drop-shadow-[0_0_10px_hsl(var(--neon-yellow))]"
                    : "text-neon-cyan drop-shadow-[0_0_10px_hsl(var(--neon-cyan))]",
                  winningReels[index] && !isSpinning && "animate-bounce-in scale-110",
                  isSpinning && "blur-sm opacity-50"
                )}
                aria-label={`Reel ${index + 1}: ${symbol}`}
              >
                {symbol}
              </div>

              {/* Winning Glow Effect */}
              {winningReels[index] && !isSpinning && (
                <div className="absolute inset-0 rounded-2xl bg-neon-yellow/10 animate-neon-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SPIN Button */}
      <button
        onClick={onSpin}
        disabled={isSpinning}
        className={cn(
          "relative w-40 h-40 rounded-full border-4 transition-all duration-300 group",
          "hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center font-orbitron font-bold text-2xl",
          isSpinning 
            ? "border-neon-cyan bg-gradient-spin-button shadow-glow-multi animate-pulse" 
            : noChips
            ? "border-neon-orange bg-gradient-gold shadow-glow-yellow hover-neon"
            : "border-neon-pink bg-gradient-spin-button shadow-glow-spin hover-neon"
        )}
        aria-label={isSpinning ? "Spinning..." : noChips ? "Get chips" : "Spin the reels"}
      >
        {/* Outer Ring Glow */}
        <div className={cn(
          "absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-border blur-xl"
        )} />

        {/* Button Inner Layers */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-neon-pink/30 via-neon-purple/20 to-neon-cyan/30" />
        <div className="absolute inset-6 rounded-full bg-card/40 backdrop-blur-sm" />
        
        {/* Button Text */}
        <span className={cn(
          "relative z-10 text-white drop-shadow-lg transition-all duration-300",
          isSpinning ? "animate-pulse text-neon-cyan" : "group-hover:scale-110",
          noChips && "text-neon-yellow"
        )}>
          {noChips ? (
            <span className="flex flex-col items-center gap-1">
              <span className="text-xl">🪙</span>
              <span className="text-sm">GET CHIPS</span>
            </span>
          ) : isSpinning ? (
            <span className="flex flex-col items-center gap-1">
              <span className="text-3xl animate-spin">⚡</span>
              <span className="text-xs tracking-wider">SPINNING</span>
            </span>
          ) : (
            <span className="tracking-widest">SPIN</span>
          )}
        </span>

        {/* Rotating Border Effect */}
        <div className={cn(
          "absolute -inset-1 rounded-full opacity-60",
          isSpinning && "animate-spin"
        )}>
          <div className="w-full h-full rounded-full border-4 border-transparent bg-gradient-border"
            style={{
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude'
            }} 
          />
        </div>

        {/* Corner Accent Lights */}
        {!isSpinning && (
          <>
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-neon-cyan glow-cyan animate-pulse" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neon-pink glow-pink animate-pulse" style={{animationDelay: '0.3s'}} />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-neon-pink glow-pink animate-pulse" style={{animationDelay: '0.6s'}} />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-neon-cyan glow-cyan animate-pulse" style={{animationDelay: '0.9s'}} />
          </>
        )}
      </button>
    </div>
  );
}