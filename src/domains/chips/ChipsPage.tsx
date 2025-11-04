"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import {
  Coins,
  // Gift,
  // Users,
  // Copy,
  // Check,
  // Send,
} from "lucide-react";
import { toast } from "sonner";
// import FollowUsCard from "./components/SocialTasks";
import TasksList from "./components/TasksList";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";

export function ChipsPage() {
  const {
    profile,
    referralCode,
    canClaimDaily,
    loading,
    claimDailyBonus,
    // processReferral,
    getReferralLink,
  } = useProfile();

  // const [referralInput, setReferralInput] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-process referral from URL (kept from your original)
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const refCode = urlParams.get("ref");
  //   if (refCode && !referralInput) {
  //     setReferralInput(refCode);
  //     setTimeout(() => {
  //       processReferral(refCode);
  //     }, 800);
  //   }
  // }, [processReferral, referralInput]);

  const handleClaimDaily = async () => {
    await claimDailyBonus();
  };

  // const handleProcessReferral = async () => {
  //   if (!referralInput.trim()) {
  //     toast.error("Please enter a referral code");
  //     return;
  //   }
  //   const success = await processReferral(referralInput.trim());
  //   if (success) setReferralInput("");
  // };

  const copyReferralLink = async () => {
    const link = getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToTelegram = () => {
    const link = getReferralLink();
    const text = `🎰 Join me on Lossless Lottery! Use my referral code and we both get chips to play! ${link}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      link
    )}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a15] to-black p-4 pb-[max(94px,env(safe-area-inset-bottom))] pb-20">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent tracking-wide">
            Get More Chips
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Earn chips to play the lossless slot.
          </p>
        </div>

        {/* Your Chips (glassy, neon) */}
        <Card
          className={cn(
            "rounded-3xl bg-card/70 backdrop-blur-xl border border-white/10",
            "ring-1 ring-black/20 shadow-[0_8px_30px_rgba(0,0,0,0.45)] relative overflow-hidden"
          )}
        >
          <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-neon-cyan/25 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-28 -right-24 h-56 w-56 rounded-full bg-neon-pink/20 blur-[100px]" />
          <CardHeader className="text-center pb-2 relative z-10">
            <CardTitle className="flex items-center justify-center gap-2">
              <Coins className="h-6 w-6 text-neon-yellow drop-shadow-[0_0_10px_rgba(255,230,0,0.35)]" />
              Your Chips
            </CardTitle>
            <CardDescription className="text-white/60">
              Available to play
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 text-center">
            <div className="text-5xl font-extrabold text-neon-yellow drop-shadow-[0_0_14px_rgba(255,230,0,0.35)] tracking-wider">
              {profile.chips}
            </div>
            <div className="mt-3 mx-auto h-2 w-[80%] rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink transition-[width] duration-700"
                style={{
                  width: `${Math.min(100, (profile.chips % 50) * 2)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tip: Daily bonus + referrals boost your stack
            </p>
          </CardContent>
        </Card>

        {/* Redesigned tasks list (daily + quests) */}
        <TasksList />

        {/* Daily Bonus (legacy card kept below for reference) */}
        {/* Daily Bonus */}
        {/* <Card className="rounded-3xl bg-card/70 backdrop-blur-xl border border-white/10 ring-1 ring-black/20 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neon-green/15 border border-neon-green/30">
                <Gift className="h-4 w-4 text-neon-green" />
              </span>
              Daily Bonus
            </CardTitle>
            <CardDescription>Claim 3 free chips every day.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClaimDaily}
              disabled={!canClaimDaily || loading}
              className={cn(
                "w-full rounded-xl transition",
                canClaimDaily
                  ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              )}
              variant="ghost"
            >
              {canClaimDaily ? "Claim 3 Chips" : "Already claimed today"}
            </Button>
          </CardContent>
        </Card> */}

        {/* Invite Friends (Referrals) */}
        {/* <Card className="rounded-3xl bg-card/70 backdrop-blur-xl border border-white/10 ring-1 ring-black/20 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/15 border border-sky-400/30">
                <Users className="h-4 w-4 text-sky-400" />
              </span>
              Invite Friends
            </CardTitle>
            <CardDescription>
              Both you and your friend get <strong>5 chips</strong> when they
              join with your code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share your link</label>
              <div className="flex gap-2">
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="flex-1 rounded-xl border-white/15 hover:bg-white/5"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  onClick={shareToTelegram}
                  variant="outline"
                  className="rounded-xl border-white/15 hover:bg-white/5"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Enter Referral Code */}
        {/* <Card className="rounded-3xl bg-card/70 backdrop-blur-xl border border-white/10 ring-1 ring-black/20 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-400/15 border border-purple-400/30">
                <Share2 className="h-4 w-4 text-purple-400" />
              </span>
              Have a referral code?
            </CardTitle>
            <CardDescription>
              Enter a friend’s code to get bonus chips.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="Enter referral code"
              value={referralInput}
              onChange={(e) =>
                setReferralInput(e.target.value.toUpperCase())
              }
              className="font-mono rounded-xl bg-white/5 border-white/10 placeholder:text-white/40"
            />
            <Button
              onClick={handleProcessReferral}
              disabled={!referralInput.trim() || loading}
              className="w-full rounded-xl bg-neon-yellow/20 text-neon-yellow hover:bg-neon-yellow/30"
              variant="ghost"
            >
              Submit Code
            </Button>
          </CardContent>
        </Card> */}

        {/* Social follow tasks replaced by inline list above */}
        {/* <FollowUsCard /> */}

        {/* Sponsor Logos Section */}

            {/* <div className={cn(
        "relative w-full max-w-md rounded-2xl",
        "border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.45)] p-4"
      )}>
        <SponsorLogos />
      </div> */}
      </div>
    </div>
  );
}
