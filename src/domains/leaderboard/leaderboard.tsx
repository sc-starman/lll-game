"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";

// Optional: your public leaderboard URL (landing / mini app deep-link)
const PUBLIC_URL = "https://lll.space/leaderboard";

export default function LeaderboardPage() {
  const { profile } = useProfile();     // e.g., { rank?: number, spins, score, ... }

  // rank is optional; if not present, we’re in "calculating" mode
  const rank = undefined//userStats?.rank; // undefined or number
  const userName =
    profile?.username
      ? `@${profile.username}`
      : `${profile?.firstName ?? "Player"}`;

  const shareText = useMemo(() => {
    const base = rank
      ? `I’m currently #${rank} on the LLL Leaderboard!`
      : `Leaderboard is being calculated, but I’m already playing LLL!`;
    return `${base} 🎰✨\nPlay the Lossless Lottery on TON.\n`;
  }, [rank]);

  const shareUrl = useMemo(() => {
    // Include something unique (e.g., referral or tg id) if you have it
    return PUBLIC_URL;
  }, []);

  const onShareTelegram = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    const tgShare = `https://t.me/share/url?url=${url}&text=${text}`;

    // Mini App native open, with graceful fallback
    // @ts-ignore
    const tg = typeof window !== "undefined" ? window?.Telegram?.WebApp : null;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(tgShare);
    } else {
      window.open(tgShare, "_blank", "noopener,noreferrer");
    }
  };

  const onShareTwitter = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(shareUrl);
    const tw = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    // @ts-ignore
    const tg = typeof window !== "undefined" ? window?.Telegram?.WebApp : null;
    if (tg?.openLink) {
      tg.openLink(tw);
    } else {
      window.open(tw, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a15] to-black p-4 pb-[max(94px,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent tracking-wide">
            Leaderboard
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">Lossless Lottery on TON</p>
        </div>

        {/* Coming Soon / Calculating Card */}
        <Card className="rounded-3xl bg-card/70 backdrop-blur-xl border border-white/10 ring-1 ring-black/20 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-neon-cyan">Global Rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Neon loader row */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-xs text-white/60">Early Access</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-neon-cyan/70 border-t-transparent animate-spin" />
                <span className="text-foreground font-medium">Calculating leaderboard…</span>
              </div>

              {/* subtle animated shimmer */}
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="animate-[pulse_2.5s_ease-in-out_infinite] absolute -top-20 -left-32 h-40 w-40 rounded-full bg-neon-cyan/30 blur-[80px]" />
                <div className="animate-[pulse_3s_ease-in-out_infinite] absolute -bottom-24 -right-32 h-44 w-44 rounded-full bg-neon-pink/30 blur-[90px]" />
              </div>
            </div>

            {/* Current User Snapshot */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Player</p>
                  <p className="text-foreground font-semibold">{userName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className={cn("font-semibold", rank ? "text-neon-yellow" : "text-white/60")}>
                    {rank ? `#${rank}` : "Calculating"}
                  </p>
                </div>
              </div>

              <Separator className="my-3 bg-white/10" />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div>Spins: <span className="text-foreground font-medium">{profile?.spins ?? 0}</span></div>
                <div>Score: <span className="text-foreground font-medium">{profile?.score ?? 0}</span></div>
                <div>Wins: <span className="text-foreground font-medium">{profile?.wins ?? 0}</span></div>
              </div>
            </div>

            {/* Share Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={onShareTelegram}
                className="flex-1 rounded-xl bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
              >
                Share on Telegram
              </Button>
              <Button
                onClick={onShareTwitter}
                className="flex-1 rounded-xl bg-neon-yellow/20 text-neon-yellow hover:bg-neon-yellow/30"
              >
                Share on X
              </Button>
            </div>

            {/* Subnote */}
            <p className="text-center text-[11px] text-muted-foreground">
              We’ll publish the global board as soon as there are enough players to keep things fair.
            </p>
          </CardContent>
        </Card>

        {/* (Optional) Placeholder list with skeleton rows */}
        <Card className="rounded-3xl bg-card/70 backdrop-blur-xl border border-white/10 ring-1 ring-black/20 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm text-muted-foreground">Top Players (Preview)</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/10" />
                  <div className="h-4 w-24 rounded bg-white/10" />
                </div>
                <div className="h-4 w-10 rounded bg-white/10" />
              </div>
            ))}
            <p className="text-[11px] text-muted-foreground text-center mt-1">
              Preview rows are placeholders while rankings are computed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
