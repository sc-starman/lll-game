"use client";
import { Gamepad2, Coins, User, ChartColumnBig } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
};

const navItems: NavItem[] = [
  { path: "/", label: "Play", icon: Gamepad2 },
  { path: "/chips", label: "Tasks", icon: Coins }, // example badge
  { path: "/leaderboard", label: "Leaders", icon: ChartColumnBig, badge: "LV" }, // example badge
  { path: "/profile", label: "Profile", icon: User },
];

export const MobileBottomNav = () => {
  const { showNavigation } = useProfile();
  const pathname = usePathname();

  if (!showNavigation) return <></>
  return (
    <nav
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden",
        "pb-[max(8px,env(safe-area-inset-bottom))]" // safe area
      )}
      aria-label="Primary"
    >
      <div className="mx-auto max-w-md">
        {/* Floating pill container */}
        <div
          className={cn(
            "pointer-events-auto mx-8 mb-2",
            "rounded-full bg-card/80 backdrop-blur-xl",
            "border border-white/10",
            "shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
            "ring-1 ring-black/20",
            "px-2 py-1.5",
            "relative flex items-center justify-between"
          )}
          style={{ transform: "translateY(-8px)" }}
        >
          {navItems.map((item, idx) => {
            const active = pathname === item.path;

            // middle button slightly larger
            const isMiddle = false;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative inline-flex items-center justify-center flex-col gap-0.5",
                  "transition-all duration-200 rounded-full",
                  // increase height to accommodate label below icon
                  "h-12 w-12",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* glow ring for active */}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full -z-10 transition-opacity",
                    active
                      ? "opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.06)]"
                      : "opacity-0"
                  )}
                />
                {/* subtle background for middle or active */}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full transition",
                    isMiddle
                      ? "bg-white/5"
                      : active
                        ? "bg-white/5"
                        : "bg-transparent"
                  )}
                />

                <item.icon
                  className={cn(
                    "transition-transform",
                    isMiddle ? "h-5.5 w-5.5" : "h-5 w-5",
                    active ? "scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" : "scale-100"
                  )}
                />

                {/* visible label under icon */}
                <span
                  className={cn(
                    "text-[10px] leading-3",
                    active ? "text-white" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>

                {/* badge (e.g., Chips) */}
                {item.badge ? (
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 min-w-[16px] h-4",
                      "rounded-full bg-neon-yellow text-black",
                      "text-[10px] leading-4 font-semibold text-center",
                      "shadow-[0_2px_10px_rgba(255,230,0,0.45)]"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}

                {/* active indicator dot under icon */}
                {/* <span
                  className={cn(
                    "pointer-events-none absolute -bottom-1.5 h-1 w-1 rounded-full",
                    active ? "bg-white/80" : "bg-transparent"
                  )}
                /> */}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
