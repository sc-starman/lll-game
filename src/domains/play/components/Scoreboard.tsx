import { cn } from "@/lib/utils";

interface ScoreboardProps {
  score: number;
  chips: number;
  spins: number;
  isLoading: boolean;
}

export function Scoreboard({ score, chips, spins, isLoading }: ScoreboardProps) {
  return (
    <div className={cn(
        "relative w-full max-w-md rounded-2xl",
        "border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.45)] p-4"
      )}>
      <div className="grid grid-cols-3 gap-4 text-center">


        {/* Chips */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">🎯 CHIPS</p>
          <p className={cn("text-2xl md:text-3xl font-bold text-neon-pink font-orbitron", isLoading && "blur-sm")}>
            {chips.toLocaleString()}
          </p>
        </div>

        {/* Current Score */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">🎟 POINTS</p>
          <p className={cn("text-2xl md:text-3xl font-bold text-neon-cyan font-orbitron animate-neon-pulse", isLoading && "blur-sm")}>
            {score.toLocaleString()}
          </p>
        </div>

        {/* Spins */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">🎰 SPINS</p>
          <p className={cn("text-2xl md:text-3xl font-bold text-neon-purple font-orbitron", isLoading && "blur-sm")}>
            {spins}
          </p>
        </div>
      </div>
    </div>
  );
}