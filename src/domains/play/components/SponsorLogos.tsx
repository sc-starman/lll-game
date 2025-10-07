import { useState } from "react";
import { cn } from "@/lib/utils";
import { openLink } from "@telegram-apps/sdk-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Sponsor = { id: number; name: string };

export function SponsorLogos() {
  const sponsors: Sponsor[] = [
    { id: 1, name: "Sponsor 1" },
    { id: 2, name: "Sponsor 2" },
    { id: 3, name: "Sponsor 3" },
  ];

  const [open, setOpen] = useState(false);
  const [activeSponsor, setActiveSponsor] = useState<Sponsor | null>(null);

  const onSponsorClick = (sponsor: Sponsor) => {
    setActiveSponsor(sponsor);
    setOpen(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-muted-foreground">Our Sponsors</h3>

      <div className="flex items-center gap-4">
        {sponsors.map((sponsor) => (
          <button
            key={sponsor.id}
            type="button"
            onClick={() => onSponsorClick(sponsor)}
            aria-label={`Open sponsorship info for ${sponsor.name}`}
            className={cn(
              "w-12 h-12 rounded-full border-2 border-neon-cyan/50",
              "bg-card/50 flex items-center justify-center",
              "hover:border-neon-cyan hover:shadow-glow-cyan transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-cyan/60"
            )}
          >
            <span className="text-xs font-medium text-neon-cyan">
              {sponsor.name.charAt(0)}
            </span>
          </button>
        ))}

        {/* Become Sponsor Button */}
        <button
          className={cn(
            "w-12 h-12 rounded-full border-2 border-dashed border-neon-pink/50",
            "bg-card/30 flex items-center justify-center text-neon-pink",
            "hover:border-neon-pink hover:bg-neon-pink/10 transition-all duration-300",
            "text-xl font-bold focus:outline-none focus:ring-2 focus:ring-neon-pink/60"
          )}
          aria-label="Become a sponsor"
          onClick={() => openLink("https://lll.space/sponsorship")}
          type="button"
        >
          +
        </button>
      </div>

      {/* Bottom Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className={cn(
            "border-t border-neon-cyan/20",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70"
          )}
        >
          <SheetHeader>
            <SheetTitle className="font-orbitron text-xl">
              Sponsorship Opportunity
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {activeSponsor
                ? `${activeSponsor.name}, partner with LLL for our Pre-Launch Lossless Lottery game on TON.`
                : "Partner with LLL for our Pre-Launch Lossless Lottery game on TON."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-2 text-sm text-white">
            <p>
              ✅ Branded presence in the mini-app & socials
            </p>
            <p>
              ✅ Feature in the Airdrop & leaderboard promos
            </p>
            <p>
              ✅ Co-marketing with our TON community push
            </p>
          </div>

          <SheetFooter className="mt-6 flex items-center justify-between gap-2">
            <SheetClose asChild>
              <Button variant="ghost" className="text-white">Close</Button>
            </SheetClose>
            <Button
              onClick={() => openLink("https://lll.space/sponsorship")}
              className="bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
            >
              Learn more / Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
