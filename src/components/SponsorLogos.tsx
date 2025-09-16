import { cn } from "@/lib/utils";

export function SponsorLogos() {
  // Placeholder sponsor logos - can be replaced with actual sponsor data
  const sponsors = [
    { id: 1, name: "Sponsor 1" },
    { id: 2, name: "Sponsor 2" },
    { id: 3, name: "Sponsor 3" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-muted-foreground">Our Sponsors</h3>
      
      <div className="flex items-center gap-4">
        {/* Sponsor Logo Circles */}
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className={cn(
              "w-12 h-12 rounded-full border-2 border-neon-cyan/50",
              "bg-card/50 flex items-center justify-center",
              "hover:border-neon-cyan hover:shadow-glow-cyan transition-all duration-300"
            )}
          >
            <span className="text-xs font-medium text-neon-cyan">
              {sponsor.name.charAt(0)}
            </span>
          </div>
        ))}
        
        {/* Become Sponsor Button */}
        <button
          className={cn(
            "w-12 h-12 rounded-full border-2 border-dashed border-neon-pink/50",
            "bg-card/30 flex items-center justify-center text-neon-pink",
            "hover:border-neon-pink hover:bg-neon-pink/10 transition-all duration-300",
            "text-xl font-bold"
          )}
          aria-label="Become a sponsor"
        >
          +
        </button>
      </div>
    </div>
  );
}