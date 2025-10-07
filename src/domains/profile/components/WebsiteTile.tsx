"use client";

import { Globe } from "lucide-react";
import { openLink } from "@telegram-apps/sdk-react";
import { cn } from "@/lib/utils";

export default function LLLWebsiteTileMiniApp() {
  const handleOpenWebsite = () => {
    openLink("https://lll.space", { tryInstantView: false });
  };

  return (
    <button
      onClick={handleOpenWebsite}
      className={cn(
        "relative w-full rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.45)] p-4 transition-all duration-300",
        "hover:scale-[1.02] hover:border-white/20 active:scale-[0.98]"
      )}
    >
      {/* soft neon halo */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 
                      bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="font-orbitron text-lg font-semibold bg-gradient-to-r 
                         from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent">
            Visit LLL.Space
          </h3>
          <p className="text-sm text-white/70">
            Explore the official Lossless Lottery website
          </p>
        </div>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl 
                     bg-white/10 border border-white/10 transition group-hover:bg-white/15"
        >
          <Globe className="h-5 w-5 text-neon-cyan" />
        </div>
      </div>
    </button>
  );
}
