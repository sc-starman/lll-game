"use client";

interface CurvedHeaderProps {}

export function CurvedHeader({}: CurvedHeaderProps) {
  return (
    <header className="relative w-full">
      <div className="relative h-24 w-full overflow-hidden">
        {/* Aurora / grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f18] via-[#0a0e16] to-[#090b10]" />
          {/* very soft neon glow */}
          <div className="absolute -inset-24 bg-[conic-gradient(at_25%_-10%,#00e6ff33,transparent_30%,#ffe60033_55%,transparent_70%,#ff33cc33)] blur-2xl" />
          {/* subtle dotted stars */}
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#ffffff_0.8px,transparent_1.2px)] [background-size:22px_22px]" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex h-full justify-start">
          {/* Glass logo capsule */}
            {/* Use your existing .logo-lll styles / image */}
            <div
              className="logo-lll h-20 w-20 bg-center bg-contain bg-no-repeat"
              aria-label="LLL logo"
            />
        </div>

        {/* Smooth curved bottom (matches page background) */}
        <svg
          className="absolute -bottom-px left-0 h-16 w-full text-background"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C260,140 1180,0 1440,80 L1440,160 L0,160 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </header>
  );
}
