import { useState, useEffect, useCallback } from "react";
import { SlotMachineUnit } from "./SlotMachineUnit";
import { Scoreboard } from "./Scoreboard";
import { Confetti } from "./Confetti";
import { CurvedHeader } from "./CurvedHeader";
import { SponsorLogos } from "./SponsorLogos";
// import { GameStats } from "./GameStats";
import { useToast } from "@/hooks/use-toast";
import { useGameData } from "@/hooks/useGameData";
import { useChips } from "@/hooks/useChips";
import { defaultConfig, type GameState, getResultMessage } from "@/lib/gameConfig";
export function MobileSlotMachine() {
  const { toast } = useToast();
  const {
    userStats,
    loading: gameLoading
  } = useGameData();
  const {
    chips,
    refreshProfile
  } = useChips();

  const [confetti, setConfetti] = useState<{
    active: boolean;
    type: 'mild' | 'burst' | 'jackpot';
  }>({
    active: false,
    type: 'mild'
  });
  const [gameState, setGameState] = useState<GameState>(() => ({
    score: 0,
    bestScore: 0,
    spins: 0,
    lastResult: null,
    isSpinning: false,
    muted: true
  }));
  const [sessionStats, setSessionStats] = useState({
    jackpots: 0
  });

  // Update best score from user stats
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      bestScore: userStats.bestScore
    }));
  }, [userStats]);

  // Telegram haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
    }
  };
  const handleSpin = useCallback(async () => {
    if (gameState.isSpinning) return;

    // Check if user has chips
    if (chips <= 0) {
      toast({
        title: "No Chips Left!",
        description: "Visit the Chips page to get more chips to play",
        duration: 3000
      });
      return;
    }
    triggerHaptic('light');
    setGameState(prev => ({
      ...prev,
      isSpinning: true
    }));
    try {
      // Simulate spin animation delay
      await new Promise(resolve => setTimeout(resolve, defaultConfig.animationMs));

      // Call secure backend spin function
      const res = await fetch('/api/gateway/spin')
      
      const data = await res.json()
      if (!res.ok) {
        console.error('Spin error:', data);
        toast({
          title: "Spin Failed",
          description: "Please try again",
          duration: 3000
        });
        setGameState(prev => ({
          ...prev,
          isSpinning: false
        }));
        return;
      }
      if (!data.success) {
        toast({
          title: "Spin Failed",
          description: data.message || "Please try again",
          duration: 3000
        });
        setGameState(prev => ({
          ...prev,
          isSpinning: false
        }));
        return;
      }

      // Update game state with server result
      const result = {
        reels: data.reels,
        lCount: data.lCount,
        delta: data.delta
      };
      const newScore = data.newScore;
      const newBestScore = Math.max(gameState.bestScore, newScore);
      const newJackpots = data.isJackpot ? sessionStats.jackpots + 1 : sessionStats.jackpots;
      setGameState(prev => ({
        ...prev,
        score: newScore,
        bestScore: newBestScore,
        spins: prev.spins + 1,
        lastResult: result,
        isSpinning: false
      }));
      setSessionStats(prev => ({
        ...prev,
        jackpots: newJackpots
      }));

      // Update chips display by refreshing profile data
      await refreshProfile();

      // Show result message
      if (result.lCount > 0) {
        triggerHaptic(result.lCount === 3 ? 'heavy' : 'medium');
        toast({
          title: result.lCount === 3 ? "🎰 JACKPOT! 🎰" : "🎉 Winner! 🎉",
          description: data.message,
          duration: 3000
        });

        // Trigger confetti
        if (result.lCount === 3) {
          setConfetti({
            active: true,
            type: 'jackpot'
          });
        } else if (result.lCount === 2) {
          setConfetti({
            active: true,
            type: 'burst'
          });
        } else {
          setConfetti({
            active: true,
            type: 'mild'
          });
        }
        setTimeout(() => setConfetti({
          active: false,
          type: 'mild'
        }), 1000);
      } else {
        toast({
          title: "Try Again!",
          description: data.message,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error calling spin function:', error);
      toast({
        title: "Network Error",
        description: "Please check your connection and try again",
        duration: 3000
      });
      setGameState(prev => ({
        ...prev,
        isSpinning: false
      }));
    }
  }, [gameState.isSpinning, gameState.score, gameState.bestScore, sessionStats.jackpots, chips, toast]);

  const isWinningReel = (index: number): boolean => {
    return gameState.lastResult?.reels[index] === 'L' && !gameState.isSpinning;
  };
  return <div className="min-h-screen bg-background flex flex-col pb-20 relative overflow-x-hidden">
    {/* Confetti */}
    <Confetti isActive={confetti.active} type={confetti.type} />

    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-machine opacity-20" />

    <div className="relative z-10 flex-1 flex flex-col">
      {/* Curved Header */}
      <CurvedHeader />

      {/* Content with proper spacing */}
      <div className="flex-1 flex flex-col space-y-8 px-4 py-4">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-bold font-orbitron text-foreground text-2xl">
              Loss Loss Lottery
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Win without losing your funds!
          </p>
        </div>

        {/* Sponsor Logos Section */}
        <SponsorLogos />

        {/* Slot Machine Container */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Slot Machine - Centered */}
          <SlotMachineUnit reels={gameState.lastResult?.reels || ["L", "L", "L"]} isSpinning={gameState.isSpinning} winningReels={Array.from({
            length: 3
          }, (_, index) => isWinningReel(index))} onSpin={handleSpin} />

          {/* Game Stats - Positioned around SPIN button */}
          {/* <GameStats chips={chips} score={gameState.score} /> */}
        </div>

        {/* Last Result Message */}
        {gameState.lastResult && <div className="text-center">
          <p className="text-lg font-medium text-neon-cyan animate-neon-pulse">
            {getResultMessage(gameState.lastResult.lCount, gameState.lastResult.delta)}
          </p>
        </div>}

        {/* Scoreboard */}
        <div className="flex justify-center">
          <Scoreboard score={gameState.score} chips={chips} spins={gameState.spins} />
        </div>
      </div>
    </div>
  </div>;
}