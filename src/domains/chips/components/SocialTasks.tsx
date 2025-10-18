"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Twitter, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { openLink } from "@telegram-apps/sdk-react";
import { useChips } from "@/hooks/useChips";
import { toast } from "sonner";

export default function FollowUsCard() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"twitter" | "telegram" | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const { refreshProfile, userStats } = useChips();

  const handleOpen = (type: "twitter" | "telegram") => {
    setActive(type);
    setVerified(null);
    setOpen(true);
  };

  const handleVerify = async () => {
    setVerifying(true);


    // Call secure backend spin function
    const res = await fetch('/api/gateway/verify-follow', {
      method: 'POST',
      body: JSON.stringify({ platform: active }),
    });

    const data = await res.json()
    if (!res.ok) {
      console.error('Verification error:', data);
      toast("Verification Failed", {
        description: "Please try again",
        duration: 3000
      });
      setVerifying(false);
      return;
    }
    if (!data.success) {
      toast("Verification Failed", {
        description: data.message || "Please try again",
        duration: 3000
      });
      setVerifying(false);
      return;
    }

    await refreshProfile();
    setVerifying(false);
    setVerified(true);
  };

  const handleOpenPlatform = () => {
    if (active === "telegram")
      openLink("https://t.me/lll_space");
    else
      openLink("https://x.com/lll_space_en");
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur border border-white/10">
        <CardHeader>
          <CardTitle className="font-orbitron text-lg">Follow Us</CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete tasks and earn bonus chips!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition"
            onClick={() => handleOpen("twitter")}
          >
            <Twitter className="h-4 w-4 mr-2 text-sky-400" />
            {userStats?.is_x_verified ? "Already Followed (5 Chips)" : "Follow on X (Twitter)"}
          </Button>

          <Button
            variant="outline"
            className="w-full hover:border-neon-pink hover:shadow-[0_0_10px_rgba(255,0,150,0.3)] transition"
            onClick={() => handleOpen("telegram")}
          >
            <Send className="h-4 w-4 mr-2 text-neon-cyan" />
            {userStats?.is_telegram_verified ? "Already Joined (10 Chips)" : "Join Telegram Channel"}
          </Button>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className={cn(
            "border-t border-white/10 rounded-t-2xl",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70"
          )}
        >
          <SheetHeader>
            <SheetTitle className="font-orbitron text-lg">
              {active === "twitter" ? "Follow on Twitter [5 Chips]" : "Join Telegram Channel [10 Chips]"}
            </SheetTitle>
            <SheetDescription>
              {active === "twitter"
                ? "Go to our Twitter page, follow us, then come back and press Verify."
                : "Join our Telegram channel, then return and press Verify."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex items-center gap-3">
            <Button
              onClick={handleOpenPlatform}
              className="flex-1 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition"
            >
              Go to {active === "twitter" ? "Twitter" : "Telegram"}
            </Button>

            <Button
              onClick={handleVerify}
              disabled={verifying}
              className="flex-1 bg-neon-yellow/20 text-neon-yellow hover:bg-neon-yellow/30 transition"
            >
              {verifying ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 border-2 border-neon-yellow/70 border-t-transparent rounded-full animate-spin" />
                  Checking...
                </span>
              ) : (
                "Verify"
              )}
            </Button>
          </div>

          {verified !== null && (
            <div
              className={cn(
                "mt-4 p-3 text-sm rounded-xl text-center",
                verified
                  ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/40 text-red-400"
              )}
            >
              {verified ? "✅ Verified! Chips rewarded." : "❌ Not verified yet."}
            </div>
          )}

          <SheetFooter className="mt-6 flex justify-center">
            <SheetClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>

          <div className="mt-4 flex justify-center">
            <div className="h-1 w-14 bg-white/10 rounded-full" />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
