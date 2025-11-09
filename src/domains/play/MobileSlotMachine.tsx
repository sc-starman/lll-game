import { useState, useCallback, useRef } from "react";
import { SlotMachineUnit } from "./components/SlotMachineUnit";
import { Scoreboard } from "./components/Scoreboard";
import { Confetti } from "./components/Confetti";
import { useProfile } from "@/contexts/ProfileContext";
import { defaultConfig, type GameState } from "@/lib/gameConfig";
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

  const {
    profile,
    loading: isUserStatsLoading,
    updateStats
  } = useProfile();

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

  const handleSpin = useCallback(async () => {

    hapticFeedback.impactOccurred('medium');
    const noChips = profile.chips <= 0;
    if (noChips) {
      push('/chips')
      return;
    }

    if (gameState.isSpinning) return;

    // Check if user has chips
    if (profile.chips <= 0) {
      toast('No Chips Left!', {
        description: "Visit the Chips page to get more chips to play",
        duration: 3000,
      });
      return;
    }
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

      updateStats(data.chips, data.score, data.spins, data.jackpots, data.losses, data.wins)
      // Update chips display by refreshing profile data
      // await refreshProfile();

      // Show result message
      if (result.lCount > 0) {
        hapticFeedback.impactOccurred(result.lCount === 3 ? 'heavy' : 'medium');
        toast(result.lCount === 3 ? "🎰 JACKPOT! 🎰" : "🎉 Winner! 🎉", {
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

  }, [gameState.isSpinning, sessionStats.jackpots, profile.chips, toast]);

  const isWinningReel = (index: number): boolean => {
    return gameState.lastResult?.reels[index] === 'L' && !gameState.isSpinning;
  };
  return <div className="min-h-screen bg-background flex flex-col relative overflow-x-hidden pb-[max(94px,env(safe-area-inset-bottom))]">
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
      <div className="flex-1 flex flex-col space-y-8 px-4 pt-4 bg-background">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-bold font-orbitron text-foreground text-2xl flex items-center gap-2 justify-center">
              <img width={36} src="/imgs/logo.png" />
              <div>
                <span className="text-neon-yellow">L</span>oss<span className="text-neon-yellow">L</span>ess <span className="text-neon-yellow">L</span>eague
              </div>
            </h1>
          </div>
          <span className="text-muted-foreground font-medium flex items-center justify-center gap-2">
            <OnboardingInfoButton /> Spin. Score. Get ready for the airdrop!
          </span>
        </div>

        {/* Slot Machine Container */}
        <div className="flex flex-col items-center px-8">
          {/* Slot Machine - Centered */}
          <SlotMachineUnit reels={gameState.lastResult?.reels || ["L", "L", "L"]}
            isSpinning={gameState.isSpinning} noChips={profile.chips <= 0}
            chips={profile.chips}
            winningReels={Array.from({
              length: 3
            }, (_, index) => isWinningReel(index))} onSpin={handleSpin} />

        </div>


        {/* Scoreboard */}
        <div className="flex justify-center">
          <Scoreboard score={profile.score} chips={profile.chips} spins={profile.spins} isLoading={isUserStatsLoading || gameState.isSpinning} />
        </div>
      </div>
    </div>
  </div>;
}
