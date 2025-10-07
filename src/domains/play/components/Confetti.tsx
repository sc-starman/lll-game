import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ConfettiProps {
  isActive: boolean;
  type: 'mild' | 'burst' | 'jackpot';
}

const confettiColors = [
  'bg-neon-cyan',
  'bg-neon-pink', 
  'bg-neon-green',
  'bg-neon-purple',
  'bg-neon-orange',
  'bg-bitcoin'
];

export function Confetti({ isActive, type }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; color: string; delay: number }>>([]);
  
  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }
    
    const count = type === 'jackpot' ? 50 : type === 'burst' ? 25 : 10;
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 500
    }));
    
    setPieces(newPieces);
    
    // Auto cleanup after animation
    const timeout = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(timeout);
  }, [isActive, type]);
  
  if (!isActive || pieces.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={cn(
            "absolute w-3 h-3 rounded opacity-80 animate-confetti",
            piece.color
          )}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${2500 + Math.random() * 1000}ms`
          }}
        />
      ))}
    </div>
  );
}