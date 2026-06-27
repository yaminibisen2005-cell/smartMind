import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";
import { Cpu, Radio, ShieldAlert } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [statusText, setStatusText] = useState("INITIALIZING SIGNAL MIND SYSTEM...");
  const [progress, setProgress] = useState(0);
  const [skipHovered, setSkipHovered] = useState(false);

  const loadingStages = [
    { threshold: 10, text: "INITIALIZING DIGITAL TWIN OF MUMBAI GRID..." },
    { threshold: 25, text: "SYNCING LIVE TELEMETRY CHANNELS..." },
    { threshold: 45, text: "CALCULATING ACTIVE GREEN CORRIDORS..." },
    { threshold: 65, text: "CONNECTING TO COGNITIVE AI TRAFFIC COP MODEL..." },
    { threshold: 85, text: "SYNCHRONIZING MUNICIPAL SIGNAL NODES..." },
    { threshold: 95, text: "SYSTEM READY. COCKPIT ACCESSIBLE." }
  ];

  useEffect(() => {
    // Progress increment timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a tiny bit then trigger completion
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        
        const increment = Math.floor(Math.random() * 8) + 4;
        const nextProgress = Math.min(prev + increment, 100);

        // Update status stage text
        const matchedStage = loadingStages.find(stage => nextProgress >= stage.threshold);
        if (matchedStage) {
          setStatusText(matchedStage.text);
        }

        return nextProgress;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      id="splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19] text-white select-none overflow-hidden font-sans"
    >
      {/* Decorative Immersive Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* Main Glassmorphic Animated Container */}
      <div className="relative flex flex-col items-center justify-center max-w-xl px-6 text-center z-10 space-y-8">
        
        {/* Glowing Logo Circle Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Neon Ring Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 blur-xl opacity-20 animate-pulse"></div>
          
          <Logo className="w-24 h-24 sm:w-32 sm:h-32" isLight={false} withText={false} />
        </motion.div>

        {/* Title & Brand Typography */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-4xl font-black tracking-[0.25em] uppercase"
          >
            SIGNAL <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">MIND</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-[10px] sm:text-xs font-mono tracking-[0.4em] uppercase text-slate-400"
          >
            AI-POWERED COGNITIVE TRAFFIC COMMAND
          </motion.p>
        </div>

        {/* Sync Progress Loading Ring & Percent */}
        <div className="relative flex flex-col items-center space-y-3 pt-4">
          <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
              layoutId="splash-progress-bar"
            />
          </div>

          <div className="flex justify-between w-64 text-[10px] font-mono text-slate-500">
            <span>GRID SYNCHRONIZATION</span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Live Status Terminal Text */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-mono tracking-wide text-cyan-400 font-bold flex items-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              {statusText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Secondary Tech Specs Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-8 pt-4 border-t border-slate-800/40 w-full text-[9px] font-mono text-slate-400"
        >
          <div>
            <p className="text-slate-500">ENGINE</p>
            <p className="font-bold">GEMINI 2.5 PRO</p>
          </div>
          <div>
            <p className="text-slate-500">GRID NODE</p>
            <p className="font-bold">MUMBAI_022</p>
          </div>
          <div>
            <p className="text-slate-500">LATENCY</p>
            <p className="font-bold">0.04 ms (FIBER)</p>
          </div>
        </motion.div>

        {/* Skip Animation Overlay Option */}
        <motion.button
          onClick={onComplete}
          onMouseEnter={() => setSkipHovered(true)}
          onMouseLeave={() => setSkipHovered(false)}
          className="mt-6 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest bg-slate-900/60 hover:bg-slate-800/80 hover:text-white text-slate-500 border border-slate-800/80 transition-all cursor-pointer hover:border-cyan-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {skipHovered ? "⚡ Enter Command Room" : "Skip Synchronization"}
        </motion.button>

      </div>
    </div>
  );
}
