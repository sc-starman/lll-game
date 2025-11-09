"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Brain, Star, Sparkles } from "lucide-react";

type OnboardingPopupProps = {
  storageKey: string;
  onOpenClose?: () => void;
};


type Slide = {
  title: string;
  subtitle?: string;
  content?: string;
  secondContent?: string;
  bullets?: string[];
  cta: string;
  bg: string; // tailwind gradient classes
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // hero icon
};

export default function OnboardingPopup({
  storageKey,
  onOpenClose: onClose,
}: OnboardingPopupProps) {
  // Slide content provided
  const slides: Slide[] = [
    {
      title: "Welcome to LLL – Lossless League",
      subtitle:
        "The pre-launch game of LLL – Lossless Lottery",
      content: "A new way to win without losing your funds.",
      // secondContent: "Play now, earn points, and prepare for the upcoming airdrop.",
      cta: "Start Playing >>",
      bg: "bg-gradient-to-b from-[#7c2ea6] via-[#7b2cbf] to-[#3a0ca3]",
      icon: Sparkles,
    },
    // {
    //   title: "What’s the Lossless Lottery?",
    //   subtitle:
    //     "A community-powered DeFi platform where every participant keeps their funds safe. Your balance is staked, not spent, while you join transparent on-chain draws.",
    //   bullets: [
    //     "100% lossless, yield-based rewards",
    //     "DAO governance by LLL token holders",
    //     "Fully built on TON",
    //   ],
    //   cta: "Next >>",
    //   bg: "bg-gradient-to-b from-[#0ea5a5] via-[#059669] to-[#0b3d3d]",
    //   icon: ShieldCheck,
    // },
    {
      title: "Play → Earn → Rank",
      subtitle:
        "This pre-launch game helps you earn early rewards and climb the leaderboard.",
      bullets: [
        "Collect chips from bonuses, referrals & quests.",
        "Use chips to spin and collect points",
        "Your spins decide your LLL airdrop share.",
      ],
      cta: "Got it >>",
      bg: "bg-gradient-to-b from-[#a7791a] via-[#b45309] to-[#3f2d1b]",
      icon: Star,
    },
    {
      title: "Join the Mission",
      subtitle: "Help us build the world’s first Lossless Lottery.",
      content: "Invite friends, grow the community, and secure your place in the LLL DAO.",
      // secondContent: "You’re early — and your actions today shape what’s next.",
      cta: "Done — Start Playing",
      bg: "bg-gradient-to-b from-[#52a9ff] via-[#1af0ff] to-[#0060d1]",
      icon: Brain,
    },
  ];

  const DURATION_MS = 4500; // per-slide timer

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 of current slide
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [shouldClose, setShouldClose] = useState(false);

  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem(storageKey);
    if (!seen) {
      setOpen(true);
      onClose?.()
    }
  }, [storageKey]);

  useEffect(() => {
    if (!open) return;
    startAnimation();
    return stopAnimation;
  }, [open, index]);

  // notify parent AFTER close (not during render)
  useEffect(() => {
    if (shouldClose) onClose?.();
    setShouldClose(false)
  }, [shouldClose]);

  const startAnimation = () => {
    startRef.current = null;
    pausedRef.current = false;
    const step = (ts: number) => {
      if (pausedRef.current) return;
      if (startRef.current == null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(1, elapsed / DURATION_MS);
      setProgress(p);
      if (p >= 1) {
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const stopAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const close = () => {
    stopAnimation();
    setOpen(false);
    try { localStorage.setItem(storageKey, "1"); } catch { }
    setShouldClose(true)
  };

  const goPrev = () => {
    stopAnimation();
    setProgress(0);
    setIndex((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    stopAnimation();
    setProgress(0);
    setIndex((i) => {
      const next = i + 1;
      if (next >= slides.length) {
        close();
        return i;
      }
      return next;
    });
  };

  if (!open) return null;

  const current = slides[index];

  // optional footer tagline
  const tagline = "Train your luck. Participate in the upcoming LLL airdrop.";

  return (
    <div
      className="fixed inset-0 z-[80] overflow-hidden"
      onPointerDown={() => {
        pausedRef.current = true;
        stopAnimation();
      }}
      onPointerUp={(e) => {
        const target = e.target as HTMLElement;
        if (target?.dataset?.cta === "true") return; // allow CTA tap
        const x = (e as any).clientX ?? 0;
        const w = typeof window !== "undefined" ? window.innerWidth : 0;
        if (w && x < w / 2) goPrev(); else goNext();
        pausedRef.current = false;
        startAnimation();
      }}
    >
      {/* full-screen slide background */}
      <div className={`absolute inset-0 ${current.bg}`} />
      <div className="absolute inset-0 bg-black/20" />

      {/* top progress bars */}
      <div className="absolute top-[env(safe-area-inset-top)] left-0 right-0 px-4 pt-3">
        <div className="flex gap-1">
          {slides.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className={`h-full bg-white ${i < index ? "w-full" : i > index ? "w-0" : ""}`}
                style={i === index ? { width: `${progress * 100}%` } : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center select-none">
        {current.icon ? (
          <current.icon className="mb-4 h-20 w-20 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]" />
        ) : null}
        <h1 className="text-white font-semibold text-3xl leading-tight md:text-4xl font-orbitron">
          {current.title}
        </h1>
        {current.subtitle && (
          <span className="mt-3 text-white/90 text-sm md:text-base max-w-xs">
            {current.subtitle}
          </span>
        )}
        {current.content && (
          <span className="mt-3 text-white/90 text-sm md:text-base max-w-xs">
            {current.content}
          </span>
        )}
        {current.secondContent && (
          <span className="mt-3 text-white/90 text-sm md:text-base max-w-xs">
            {current.secondContent}
          </span>
        )}
        {current.bullets && (
          <div className="mt-4 space-y-2 text-white/90 text-sm">
            {current.bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-white/80" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="absolute left-0 right-0 bottom-[max(20px,calc(env(safe-area-inset-bottom)+12px))] px-5">
          <div className="mb-2 text-[11px] text-white/80">{tagline}</div>
          <button
            data-cta="true"
            onPointerUp={(e) => e.stopPropagation()}
            onClick={goNext}
            className="w-full h-12 rounded-2xl bg-white text-black font-semibold tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          >
            {current.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
