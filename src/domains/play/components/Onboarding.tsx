"use client";
import { useEffect, useState } from "react";

type OnboardingPopupProps = {
  storageKey?: string;     // override if needed
  defaultOpen?: boolean;   // set true to preview during dev
  onClose?: () => void;    // callback on finish/skip
};

const STORAGE_KEY = "lll_onboarding_seen_v2";

export default function OnboardingPopup({
  storageKey = STORAGE_KEY,
  defaultOpen,
  onClose,
}: OnboardingPopupProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem(storageKey);
    if (defaultOpen) setOpen(true);
    else if (!seen) setOpen(true);
  }, [defaultOpen, storageKey]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(storageKey, "1"); } catch {}
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <button
        aria-label="Close onboarding"
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Centered popup */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-sm">
          {/* gradient border frame */}
          <div className="rounded-3xl p-[1.2px] bg-[conic-gradient(from_140deg_at_50%_50%,rgba(0,230,255,.45),rgba(255,230,0,.45),rgba(255,51,204,.45),rgba(0,230,255,.45))] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            {/* frosted card */}
            <div className="rounded-[calc(1.5rem-2px)] border border-white/10 bg-white/[0.06] backdrop-blur-xl">
              {/* header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="font-orbitron text-base bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent">
                  Welcome to LLL
                </h3>
                <button
                  onClick={close}
                  className="text-xs text-white/70 hover:text-white/90 rounded-md px-2 py-1 hover:bg-white/10 transition"
                >
                  Skip
                </button>
              </div>

              {/* content */}
              <div className="px-5 pb-5">
                {step === 0 && <PageOne />}
                {step === 1 && <PageTwo />}
                {step === 2 && <PageThree />}
                {step === 3 && <PageFour />}

                {/* progress */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Dot active={step === 0} />
                  <Dot active={step === 1} />
                  <Dot active={step === 2} />
                  <Dot active={step === 3} />
                </div>

                {/* actions */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => (s === 0 ? 0 : ((s - 1) as any)))}
                    className="h-9 px-4 rounded-xl text-xs text-white/85 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={step === 0}
                  >
                    Back
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => ((s + 1) as any))}
                      className="h-9 px-5 rounded-xl text-xs font-semibold bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={close}
                      className="h-9 px-5 rounded-xl text-xs font-semibold bg-neon-yellow/20 text-neon-yellow hover:bg-neon-yellow/30 transition"
                    >
                      Done — Start Playing
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* safe-area spacing for small screens */}
          <div className="h-[max(8px,env(safe-area-inset-bottom))]" />
        </div>
      </div>
    </div>
  );
}

/* ----------------- Pages ----------------- */

// Page 1: What is LLL? (revised per your 2.a)
function PageOne() {
  return (
    <div className="space-y-3">
      <h4 className="font-orbitron text-white/90 text-base">What is LLL?</h4>
      <p className="text-sm text-white/80">
        <strong>LLL is a Lossless Lottery platform built on TON.</strong> Your
        principal is not spent; it’s <em>staked</em>. Staking grants you{" "}
        <strong>tickets</strong> to participate in on-chain lotteries, where{" "}
        <strong>winners are selected transparently on-chain</strong>.
      </p>
      <ul className="mt-1 space-y-1 text-sm text-white/75 list-disc list-inside">
        <li>On-chain selection → fair & verifiable.</li>
        <li>Transparent rules, auditable outcomes.</li>
        <li>Principal remains staked; you keep exposure to yield.</li>
      </ul>
      <InfoRow
        items={[
          { title: "On TON", text: "Fast, low fees, mobile-first." },
          { title: "Transparent", text: "On-chain draws, open data." },
        ]}
      />
    </div>
  );
}

// Page 2: How LLL works (stake → tickets → draws)
function PageTwo() {
  return (
    <div className="space-y-3">
      <h4 className="font-orbitron text-white/90 text-base">How it works</h4>
      <ul className="space-y-2 text-sm text-white/80">
        <li>
          <strong>Stake funds</strong> in LLL pools (non-custodial). Your principal is not
          burned; it keeps working for you.
        </li>
        <li>
          Receive <strong>tickets</strong> that enter periodic on-chain draws.
        </li>
        <li>
          <strong>Winners</strong> are elected on-chain; results are open and auditable.
        </li>
        <li>
          Claim prizes while your staked principal remains intact.
        </li>
      </ul>
      <InfoRow
        items={[
          { title: "Tickets", text: "Your entries into draws" },
          { title: "Lossless", text: "Principal stays staked" },
        ]}
      />
    </div>
  );
}

// Page 3: Pre-launch purpose (revised per your 2.b)
function PageThree() {
  return (
    <div className="space-y-3">
      <h4 className="font-orbitron text-white/90 text-base">Why a pre-launch game?</h4>
      <p className="text-sm text-white/80">
        The pre-launch helps us attract <strong>attention, sponsors, and community</strong> so the{" "}
        <strong>prize pool</strong> is large at official launch. As an early user, you can{" "}
        <strong>participate in this mission</strong> and earn a share of the{" "}
        <strong>LLL DAO token airdrop</strong> — empowering you to <strong>vote</strong> and{" "}
        <strong>shape platform criteria</strong>.
      </p>
      <ul className="mt-1 space-y-1 text-sm text-white/75 list-disc list-inside">
        <li>Grow prize pool before the main release.</li>
        <li>Be early: help steer product & integrations.</li>
        <li>Qualify for LLL DAO airdrop & governance.</li>
      </ul>
    </div>
  );
}

// Page 4: How to play (chips, spins, points)
function PageFour() {
  return (
    <div className="space-y-3">
      <h4 className="font-orbitron text-white/90 text-base">How to play (pre-launch)</h4>
      <ul className="space-y-2 text-sm text-white/80">
        <li>
          <strong>Chips</strong>: play credits. Get them via daily bonus, referrals, and social tasks.
        </li>
        <li>
          <strong>Spins</strong>: each spin uses chips. Match{" "}
          <span className="text-neon-yellow font-semibold">L L L</span> for a jackpot.
        </li>
        <li>
          <strong>Points</strong>: your progress for pre-launch leaderboards and airdrop eligibility.
        </li>
      </ul>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Pill title="Chips" text="play credits" />
        <Pill title="Spins" text="attempts" />
        <Pill title="Points" text="rank score" />
      </div>
    </div>
  );
}

/* ----------------- Bits ----------------- */
function Dot({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "h-1.5 w-6 rounded-full transition",
        active ? "bg-white/90" : "bg-white/30",
      ].join(" ")}
    />
  );
}

function Pill({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1">
      <div className="font-orbitron text-[11px] text-white/90">{title}</div>
      <div className="text-[10px] text-white/60">{text}</div>
    </div>
  );
}

function InfoRow({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2"
        >
          <div className="text-xs font-semibold text-white/85">{it.title}</div>
          <div className="text-[11px] text-white/70">{it.text}</div>
        </div>
      ))}
    </div>
  );
}
