import { cn } from "@/lib/utils";

interface GameStatsProps {
  chips?: number;
  score: number;
  onGetChips?: () => void;
}

export function GameStats({ chips, score, onGetChips }: GameStatsProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-center">
      {/* Chips Section - Left Side */}
      {typeof chips === 'number' && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full border border-neon-cyan/30">
            <span className="text-sm font-medium text-muted-foreground">Chips:</span>
            <span className="text-lg font-bold text-neon-cyan">{chips}</span>
          </div>
          {onGetChips && (
            <button 
              onClick={onGetChips}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full border transition-all duration-300",
                "border-neon-pink/50 text-neon-pink hover:bg-neon-pink/10 hover:border-neon-pink"
              )}
            >
              Get More
            </button>
          )}
        </div>
      )}

    </div>
  );
}