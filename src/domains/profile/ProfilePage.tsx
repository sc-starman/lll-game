"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useChips } from "@/hooks/useChips";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import WebsiteTile from "./components/WebsiteTile";

export function ProfilePage() {
  const { userProfile: telegramUser } = useProfile();
  const { userStats } = useChips();

  const winRate =
    userStats.spins > 0
      ? ((userStats.wins / userStats.spins) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a15] to-black p-4 pb-[max(88px,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_18px_rgba(0,255,255,0.25)]">
            Profile
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Lossless Lottery on TON
          </p>
        </div>

        {/* User Profile Card */}
        <Card
          className={cn(
            "bg-card/70 backdrop-blur-xl border border-white/10 rounded-3xl",
            "shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-1 ring-black/20"
          )}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              {/* Avatar with neon ring */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink blur opacity-30"></div>
                <Avatar className="relative h-20 w-20 ring-2 ring-white/10">
                  <AvatarImage
                    src={telegramUser?.photo_url}
                    alt={`${telegramUser?.first_name}'s Avatar`}
                  />
                  <AvatarFallback className="text-xl bg-gradient-to-b from-[#111319] to-[#0c0e14] text-white">
                    {telegramUser?.first_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">
                  {telegramUser?.first_name} {telegramUser?.last_name}
                </h2>
                {telegramUser?.username && (
                  <p className="text-sm text-muted-foreground">
                    @{telegramUser?.username}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/5 text-foreground border border-white/10"
                  >
                    Crypto Miner
                  </Badge>
                  <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                    LLL Player
                  </Badge>
                </div>
              </div>
            </div>

            {/* Pill quick summary */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 py-3 text-center">
                <div className="text-lg font-bold text-neon-green">
                  {userStats.jackpots}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Jackpots
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 py-3 text-center">
                <div className="text-lg font-bold text-neon-cyan">
                  {userStats.spins.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground">Spins</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 py-3 text-center">
                <div className="text-lg font-bold text-neon-yellow">
                  {userStats.referral_count.toLocaleString()}
                </div>
                <div className="text-[11px] text-muted-foreground">Referrals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        <Card
          className={cn(
            "bg-card/70 backdrop-blur-xl border border-white/10 rounded-3xl",
            "shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-1 ring-black/20"
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-neon-cyan tracking-wide">
              Game Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* row */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-semibold text-neon-green">{winRate}%</span>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Score</span>
              <span className="font-semibold text-neon-yellow">
                {userStats.score.toLocaleString()}
              </span>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Wins</span>
              <span className="font-semibold text-bitcoin">
                {userStats.wins.toLocaleString()}
              </span>
            </div>
            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Losses</span>
              <span className="font-semibold text-bitcoin">
                {userStats.losses.toLocaleString()}
              </span>
            </div>

            {/* progress (visual hint) */}
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink"
                  style={{
                    width:
                      userStats.spins > 0
                        ? `${Math.min(
                            100,
                            (userStats.wins / userStats.spins) * 100
                          )}%`
                        : "0%",
                  }}
                />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Win progress
              </div>
            </div>
          </CardContent>
        </Card>

        <WebsiteTile/>
        {/* (Optional) Achievements – keep commented if not needed */}
        {/*
        <Card className="bg-card/70 backdrop-blur-xl border border-white/10 rounded-3xl ring-1 ring-black/20">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            ...
          </CardContent>
        </Card>
        */}
      </div>
    </div>
  );
}
