interface CurvedHeaderProps {
}

export function CurvedHeader({  }: CurvedHeaderProps) {
  return (
    <div className="relative w-full">
      {/* Curved Header Background */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* Background with proper curved shape */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-400">
          {/* More natural curved bottom */}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-background rounded-t-[3rem]"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-4 pb-16">
          {/* Logo */}
          <img 
            src="/lovable-uploads/e5df373a-4821-4f0e-804b-e2934270227e.png" 
            alt="LLL Lotto Logo" 
            className="w-32 h-32 drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}