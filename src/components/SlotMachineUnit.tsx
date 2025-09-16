import { cn } from "@/lib/utils";

interface SlotMachineUnitProps {
  reels: string[];
  isSpinning: boolean;
  winningReels: boolean[];
  onSpin: () => void;
}

export function SlotMachineUnit({ reels, isSpinning, winningReels, onSpin }: SlotMachineUnitProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* JACKPOT Text */}
      <div className="text-center">
        <h2 className="text-4xl font-bold font-orbitron text-neon-cyan animate-neon-pulse tracking-wider">
          JACKPOT
        </h2>
      </div>

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
          "relative w-32 h-32 rounded-full border-4 border-neon-pink",
          "bg-gradient-spin-button shadow-glow-spin transition-all duration-300",
          "hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center font-orbitron font-bold text-xl",
          isSpinning ? "animate-pulse" : "hover:shadow-glow-pink"
        )}
        aria-label={isSpinning ? "Spinning..." : "Spin the reels"}
      >
        {/* Button Inner Glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20" />
        
        {/* Button Text */}
        <span className={cn(
          "relative z-10 text-white drop-shadow-lg transition-all duration-300",
          isSpinning && "animate-pulse"
        )}>
          {isSpinning ? "SPIN..." : "SPIN"}
        </span>

        {/* Rotating Border Effect */}
        <div className={cn(
          "absolute inset-0 rounded-full border-4 border-transparent bg-gradient-border",
          "animate-cyber-border opacity-60",
          isSpinning && "animate-spin"
        )} style={{
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor'
        }} />
      </button>
    </div>
  );
}