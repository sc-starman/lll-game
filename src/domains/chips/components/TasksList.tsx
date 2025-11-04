"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";
import { Gift, Users, Twitter, Send, Copy, Link2, Brain } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { openLink, openTelegramLink } from "@telegram-apps/sdk-react";

export default function TasksList() {
  const { profile, canClaimDaily, loading, claimDailyBonus, getReferralLink, refreshProfile } = useProfile();

  const [copied, setCopied] = useState(false);
  const [verifyingX, setVerifyingX] = useState(false);
  const [verifyingTg, setVerifyingTg] = useState(false);

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
    const text = `Join me on Lossless Lottery! Use my referral link and we both get chips to play! ${link}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const goToTwitter = () => openLink("https://x.com/lll_space_en");
  const goToTelegram = () => openTelegramLink("https://t.me/lll_space");

  const verifyFollow = async (platform: "twitter" | "telegram") => {
    try {
      platform === "twitter" ? setVerifyingX(true) : setVerifyingTg(true);
      const res = await fetch("/api/gateway/verify-follow", {
        method: "POST",
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast("Verification Failed", {
          description: data?.message || "Please try again",
          duration: 3000,
        });
        return;
      }
      await refreshProfile();
      toast.success("Verified! Chips rewarded.");
    } catch {
      toast.error("Verification error");
    } finally {
      platform === "twitter" ? setVerifyingX(false) : setVerifyingTg(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* DAILY TASKS */}
      <div className="pt-2">
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-xs font-semibold tracking-wider text-white/70">DAILY TASKS</h2>
        </div>
        {/* Daily bonus */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-3",
            "bg-white/[0.04] border border-white/10",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.35)]",
            "flex items-center justify-between gap-3 mb-3"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20">
              <Gift className="h-4 w-4 text-emerald-300" />
            </span>
            <div>
              <div className="text-white text-sm font-medium">Claim daily bonus</div>
              <div className="text-[11px] text-emerald-300/90">+3 chips</div>
            </div>
          </div>
          <Button
            onClick={claimDailyBonus}
            disabled={!canClaimDaily || loading}
            className={cn(
              "rounded-xl px-3 h-8 text-xs font-semibold",
              canClaimDaily ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-white/10 text-white/50"
            )}
            variant="ghost"
          >
            {canClaimDaily ? "CLAIM" : loading ? "CLAIMING..." : "DONE"}
          </Button>
        </div>
        {/* Crypto quiz bonus */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-3",
            "bg-white/[0.04] border border-white/10",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.35)]",
            "flex items-center justify-between gap-3 mb-3"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20">
              <Brain className="h-4 w-4 text-emerald-300" />
            </span>
            <div>
              <div className="text-white text-sm font-medium">Crypto Quiz</div>
              <div className="text-[11px] text-emerald-300/90">+5 chips</div>
            </div>
          </div>
          <Button
            onClick={() => openTelegramLink("https://t.me/lll_space_bot")}
            // disabled={!canClaimDaily || loading}
            className={cn(
              "rounded-xl px-3 h-8 text-xs font-semibold",
              "bg-emerald-500 text-black hover:bg-emerald-400"
            )}
            variant="ghost"
          >
            CHECK
          </Button>
        </div>
      </div>

      {/* QUESTS */}
      <div className="pt-1">
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-xs font-semibold tracking-wider text-white/70">QUESTS</h2>
        </div>

        {/* Invite friends */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-3 mb-3",
            "bg-white/[0.04] border border-white/10",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.35)]",
            "flex items-center justify-between gap-3"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 border border-sky-400/20">
              <Users className="h-4 w-4 text-sky-300" />
            </span>
            <div>
              <div className="text-white text-sm font-medium">Invite friends</div>
              <div className="text-[11px] text-emerald-300/90">+5 chips for each invite</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={copyReferralLink} variant="ghost" className="h-8 px-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/15">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareToTelegram} variant="ghost" className="h-8 px-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/15">
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Follow on X */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-3 mb-3",
            "bg-white/[0.04] border border-white/10",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.35)]",
            "flex items-center justify-between gap-3"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 border border-sky-400/20">
              <Twitter className="h-4 w-4 text-sky-400" />
            </span>
            <div>
              <div className="text-white text-sm font-medium">Follow on X</div>
              <div className="text-[11px] text-emerald-300/90">+5 chips</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={goToTwitter} variant="ghost" className="h-8 px-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/15">
              Open
            </Button>
            <Button
              onClick={() => verifyFollow("twitter")}
              disabled={profile?.is_x_verified || verifyingX}
              variant="ghost"
              className={cn(
                "h-8 px-3 rounded-xl text-xs font-semibold",
                profile?.is_x_verified ? "bg-white/10 text-white/50" : "bg-emerald-500 text-black hover:bg-emerald-400"
              )}
            >
              {profile?.is_x_verified ? "DONE" : verifyingX ? "CHECKING..." : "CHECK"}
            </Button>
          </div>
        </div>

        {/* Join Telegram */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl p-3",
            "bg-white/[0.04] border border-white/10",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.35)]",
            "flex items-center justify-between gap-3"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
              <Send className="h-4 w-4 text-neon-cyan" />
            </span>
            <div>
              <div className="text-white text-sm font-medium">Join our channel</div>
              <div className="text-[11px] text-emerald-300/90">+10 chips</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={goToTelegram} variant="ghost" className="h-8 px-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/15">
              Open
            </Button>
            <Button
              onClick={() => verifyFollow("telegram")}
              disabled={profile?.is_telegram_verified || verifyingTg}
              variant="ghost"
              className={cn(
                "h-8 px-3 rounded-xl text-xs font-semibold",
                profile?.is_telegram_verified ? "bg-white/10 text-white/50" : "bg-emerald-500 text-black hover:bg-emerald-400"
              )}
            >
              {profile?.is_telegram_verified ? "DONE" : verifyingTg ? "CHECKING..." : "CHECK"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

