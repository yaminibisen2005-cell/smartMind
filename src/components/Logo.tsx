import React from "react";

interface LogoProps {
  className?: string;
  isLight?: boolean;
  withText?: boolean;
}

export default function Logo({ className = "w-10 h-10", isLight = false, withText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className={`relative flex-shrink-0 group ${className}`}>
        {/* Glow behind the logo */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-md opacity-35 group-hover:opacity-75 transition duration-300"></div>
        
        <svg 
          viewBox="0 0 400 400" 
          className="relative w-full h-full" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan 500 */}
              <stop offset="50%" stopColor="#10B981" /> {/* Emerald 500 */}
              <stop offset="100%" stopColor="#22C55E" /> {/* Green 500 */}
            </linearGradient>
            <linearGradient id="road-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B0F19" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="road-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Outer circle layout border lines */}
          <path 
            d="M 75,325 C 40,280 40,180 100,100 C 130,70 160,55 180,50" 
            stroke={isLight ? "#475569" : "#64748B"} 
            strokeWidth="10" 
            strokeLinecap="round" 
          />

          {/* Right side head contour / brain outline */}
          <path 
            d="M 180,50 C 270,50 340,120 340,210 C 340,265 315,290 300,310 C 285,325 270,340 270,360 C 255,360 240,350 240,335 C 240,305 270,280 270,235 C 270,165 230,115 180,115" 
            stroke="url(#circuit-grad)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Circuit nodes and lines inside the head (right side) */}
          <path d="M 210,90 L 235,115 L 265,115" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" />
          <path d="M 260,110 L 280,135 L 300,135" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
          <path d="M 305,155 L 280,180 L 255,180" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
          <path d="M 315,210 L 275,210 L 255,190" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round" />
          <path d="M 285,260 L 260,260 L 245,245" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
          <path d="M 250,295 L 225,295" stroke="#059669" strokeWidth="5" strokeLinecap="round" />

          {/* Circuit connection dots/synapses */}
          <circle cx="210" cy="90" r="10" fill="#22D3EE" />
          <circle cx="260" cy="110" r="10" fill="#10B981" />
          <circle cx="305" cy="155" r="10" fill="#34D399" />
          <circle cx="315" cy="210" r="10" fill="#22D3EE" />
          <circle cx="285" cy="260" r="10" fill="#10B981" />
          <circle cx="250" cy="295" r="10" fill="#059669" />

          {/* Left side city skyline */}
          <path 
            d="M 50,300 L 50,240 L 70,240 L 70,210 L 85,210 L 85,170 L 95,170 L 95,110 L 110,110 L 110,170 L 120,170 L 120,230 L 135,230 L 135,260 L 155,260 L 155,300 Z" 
            fill={isLight ? "#1E293B" : "#334155"} 
            opacity="0.9"
          />
          {/* Skyline windows */}
          <rect x="101" y="125" width="4" height="8" fill="#FBBF24" />
          <rect x="101" y="145" width="4" height="8" fill="#FBBF24" />
          <rect x="75" y="225" width="4" height="6" fill="#FBBF24" />
          <rect x="55" y="255" width="4" height="6" fill="#FBBF24" />
          <rect x="125" y="245" width="4" height="6" fill="#FBBF24" />

          {/* Curved road at the bottom */}
          <path 
            d="M 50,300 C 90,210 210,210 260,300 L 235,335 C 175,275 115,275 70,335 Z" 
            fill="url(#road-grad)" 
          />
          {/* Road dashed lane marks */}
          <path 
            d="M 130,265 C 135,280 140,295 145,310" 
            stroke="#FFFFFF" 
            strokeWidth="5" 
            strokeLinecap="round"
            strokeDasharray="10 15" 
          />

          {/* Traffic signal box in the center */}
          <rect x="140" y="85" width="56" height="130" rx="14" fill="#020617" stroke="#334155" strokeWidth="6" />
          
          {/* Traffic lights: Red, Yellow, Green */}
          <circle cx="168" cy="112" r="14" fill="#EF4444" />
          <circle cx="168" cy="150" r="14" fill="#F59E0B" />
          <circle cx="168" cy="188" r="14" fill="#10B981" />

          {/* Glow lights mapping overlay (semitransparent for high-end look) */}
          <circle cx="168" cy="112" r="12" fill="#EF4444" opacity="0.8" />
          <circle cx="168" cy="150" r="12" fill="#F59E0B" opacity="0.8" />
          <circle cx="168" cy="188" r="12" fill="#10B981" opacity="0.8" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-extrabold tracking-wider font-display uppercase leading-none flex items-center gap-1">
            <span className={isLight ? "text-slate-950" : "text-white"}>SIGNAL</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">MIND</span>
          </h1>
          <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase block mt-1">
            AI TRAFFIC COP PLATFORM
          </span>
        </div>
      )}
    </div>
  );
}
