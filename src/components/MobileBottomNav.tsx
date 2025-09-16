import { Gamepad2, Coins, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", label: "Game", icon: Gamepad2 },
  { path: "/chips", label: "Chips", icon: Coins },
  { path: "/profile", label: "Profile", icon: User },
];

export const MobileBottomNav = () => {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={
              cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 rounded-lg transition-all duration-200",
                item.path === pathname
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};