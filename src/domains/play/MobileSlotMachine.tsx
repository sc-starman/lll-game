import { useState, useCallback, useRef } from "react";
import { SlotMachineUnit } from "./components/SlotMachineUnit";
import { Scoreboard } from "./components/Scoreboard";
import { Confetti } from "./components/Confetti";
// import { CurvedHeader } from "./components/CurvedHeader";
// import { SponsorLogos } from "./components/SponsorLogos";
import { useChips } from "@/hooks/useChips";
import { defaultConfig, type GameState, getResultMessage } from "@/lib/gameConfig";
// import Onboarding from "./components/Onboarding";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OnboardingInfoButton } from "./components/OnboardingInfoButton";
import { hapticFeedback } from '@telegram-apps/sdk-react';


export function MobileSlotMachine() {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // restart from beginning
      audioRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    }
  };

  // const { toast } = useToast();
  const {
    userStats,
    loading: isUserStatsLoading,
    refreshProfile
  } = useChips();

  const { push } = useRouter();

  const [confetti, setConfetti] = useState<{
    active: boolean;
    type: 'mild' | 'burst' | 'jackpot';
  }>({
    active: false,
    type: 'mild'
  });
  const [gameState, setGameState] = useState<GameState>(() => ({
    lastResult: null,
    isSpinning: false,
  }));
  const [sessionStats, setSessionStats] = useState({
    jackpots: 0
  });

  // Telegram haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
    }
  };
  const handleSpin = useCallback(async () => {
    
    hapticFeedback.impactOccurred('medium');
    const noChips = userStats.chips <= 0;
    if (noChips) {
      push('/chips')
      return;
    }

    if (gameState.isSpinning) return;

    // Check if user has chips
    if (userStats.chips <= 0) {
      toast('No Chips Left!', {
        
        description: "Visit the Chips page to get more chips to play",
        duration: 3000,
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
        toast("Spin Failed", {
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
        toast("Spin Failed", {
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
      // const newScore = data.newScore;
      const newJackpots = data.isJackpot ? sessionStats.jackpots + 1 : sessionStats.jackpots;
      setGameState(prev => ({
        ...prev,
        lastResult: result,
        isSpinning: false
      }));
      setSessionStats(prev => ({
        ...prev,
        jackpots: newJackpots
      }));
      handlePlaySound();

      // Update chips display by refreshing profile data
      await refreshProfile();

      // Show result message
      if (result.lCount > 0) {
        triggerHaptic(result.lCount === 3 ? 'heavy' : 'medium');
        toast(result.lCount === 3 ? "🎰 JACKPOT! 🎰" : "🎉 Winner! 🎉" , {
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
        toast("Try Again!", {
          description: data.message,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error calling spin function:', error);
      toast("Network Error", {
        description: "Please check your connection and try again",
        duration: 3000
      });
      setGameState(prev => ({
        ...prev,
        isSpinning: false
      }));
    }

  }, [gameState.isSpinning, sessionStats.jackpots, userStats.chips, toast]);

  const isWinningReel = (index: number): boolean => {
    return gameState.lastResult?.reels[index] === 'L' && !gameState.isSpinning;
  };
  return <div className="min-h-screen bg-background flex flex-col pb-20 relative overflow-x-hidden">
    {/* <Onboarding /> */}
    {/* Hidden audio file */}
    <audio ref={audioRef} src="/effects/spin.mp3" preload="auto" />
    {/* Confetti */}
    <Confetti isActive={confetti.active} type={confetti.type} />

    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-machine opacity-20" />

    <div className="relative z-10 flex-1 flex flex-col">
      {/* Curved Header */}
      {/* <CurvedHeader /> */}

      {/* Content with proper spacing */}
      <div className="flex-1 flex flex-col space-y-8 px-4 py-4 bg-background">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-bold font-orbitron text-foreground text-2xl">
              <span className="text-primary">L</span>oss <span className="text-primary">L</span>ess <span className="text-primary">L</span>ottery
            </h1>
          </div>
          <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
            <OnboardingInfoButton /> Win without losing your funds!
          </p>
        </div>





        {/* Slot Machine Container */}
        <div className="flex flex-col items-center px-8">
          {/* Slot Machine - Centered */}
          <SlotMachineUnit reels={gameState.lastResult?.reels || ["L", "L", "L"]}
            isSpinning={gameState.isSpinning} noChips={userStats.chips <= 0}
            winningReels={Array.from({
              length: 3
            }, (_, index) => isWinningReel(index))} onSpin={handleSpin} />

        </div>

        {/* Last Result Message */}
        {/* {gameState.lastResult && <div className="text-center">
          <p className="text-lg font-medium text-neon-cyan animate-neon-pulse">
            {getResultMessage(gameState.lastResult.lCount, gameState.lastResult.delta)}
          </p>
        </div>} */}

        {/* Scoreboard */}
        <div className="flex justify-center">
          <Scoreboard score={userStats.score} chips={userStats.chips} spins={userStats.spins} isLoading={isUserStatsLoading || gameState.isSpinning} />
        </div>
      </div>
    </div>
  </div>;
}