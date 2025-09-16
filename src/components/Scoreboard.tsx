interface ScoreboardProps {
  score: number;
  chips: number;
  spins: number;
}

export function Scoreboard({ score, chips, spins }: ScoreboardProps) {
  return (
    <div className="bg-gradient-machine rounded-2xl border-2 border-neon-cyan shadow-glow-cyan p-6 w-full max-w-md animate-cyber-border">
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Current Score */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">🎟 POINTS</p>
          <p className="text-2xl md:text-3xl font-bold text-neon-cyan font-orbitron animate-neon-pulse">
            {score.toLocaleString()}
          </p>
        </div>
        
        {/* Chips */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">🎯 CHIPS</p>
          <p className="text-2xl md:text-3xl font-bold text-neon-pink font-orbitron">
            {chips.toLocaleString()}
          </p>
        </div>
        
        {/* Spins */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">🎰 SPINS</p>
          <p className="text-2xl md:text-3xl font-bold text-neon-purple font-orbitron">
            {spins}
          </p>
        </div>
      </div>
    </div>
  );
}