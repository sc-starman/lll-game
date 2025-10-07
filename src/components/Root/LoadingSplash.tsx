"use client";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-[#0a0a15] to-black text-white overflow-hidden">
      {/* Glowing background circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-pink/20 blur-[120px] rounded-full animate-pulse delay-500" />

      {/* LLL Logo or text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="text-5xl font-orbitron font-bold tracking-widest bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
          LLL
        </div>
        <p className="mt-2 text-sm text-muted-foreground tracking-widest uppercase">
          Lossless Lottery
        </p>
      </motion.div>

      {/* Loading spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative mt-12"
      >
        <div className="w-10 h-10 border-4 border-neon-cyan/40 border-t-neon-cyan rounded-full animate-spin" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 text-xs tracking-wide text-muted-foreground"
      >
        Connecting to TON Blockchain...
      </motion.p>
    </div>
  );
}
