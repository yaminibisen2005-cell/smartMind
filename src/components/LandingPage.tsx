import React, { useState, useEffect } from "react";
import { LANDING_FEATURES, SYSTEM_STATS, ROAD_CONDITIONS } from "../data";
import Logo from "./Logo";
import { 
  ArrowRight, 
  Cpu, 
  Navigation, 
  SquareParking, 
  TrainFront, 
  ShieldAlert, 
  Leaf, 
  Users, 
  Clock, 
  Activity, 
  Milestone,
  CheckCircle2,
  Sparkles,
  Sliders,
  Volume2,
  Check,
  Share2,
  Sun,
  Moon
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  theme?: "dark" | "light";
  toggleTheme?: () => void;
  setViewMode?: (mode: "landing" | "app") => void;
  setActiveTab?: (tab: string) => void;
}

export default function LandingPage({ 
  onEnterApp, 
  onOpenLogin,
  theme = "dark",
  toggleTheme,
  setViewMode,
  setActiveTab
}: LandingPageProps) {
  
  const isLight = theme === "light";

  // Landing Page custom navigation links
  const navLinks = [
    { id: "home", label: "Home", action: "landing", tabId: "home" },
    { id: "dashboard", label: "Dashboard", action: "tab", tabId: "dashboard" },
    { id: "planner", label: "Smart Routes", action: "tab", tabId: "planner" },
    { id: "livetraffic", label: "Live Traffic", action: "tab", tabId: "dashboard" },
    { id: "parking", label: "Smart Parking", action: "tab", tabId: "parking" },
    { id: "transit", label: "Public Transport", action: "tab", tabId: "transit" },
    { id: "emergency", label: "Emergency", action: "tab", tabId: "emergency" },
    { id: "chat", label: "AI Assistant", action: "tab", tabId: "chat" },
    { id: "analytics", label: "Analytics", action: "tab", tabId: "analytics" }
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    if (link.action === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (setViewMode) setViewMode("app");
      if (setActiveTab) setActiveTab(link.tabId);
    }
  };

  // --- STATE FOR INTERACTIVE HERO ---
  const [activeCockpitTab, setActiveCockpitTab] = useState<"sensor" | "heatmap" | "corridor" | "telemetry">("sensor");
  
  // Tab 1: Sensor Grid State
  const [selectedRadarBlip, setSelectedRadarBlip] = useState<string | null>(null);
  
  // Tab 2: Heatmap State
  const [trafficDensity, setTrafficDensity] = useState<number>(55); // 0 to 100
  
  // Tab 3: Green Corridor State
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [corridorStep, setCorridorStep] = useState<number>(0);
  
  // Tab 4: Live Telemetry State
  const [selectedRoad, setSelectedRoad] = useState<string>("Western Express Hwy");

  // --- STATE FOR COMMUTER CHALLENGE ---
  const [fromLocation, setFromLocation] = useState<string>("Borivali");
  const [toLocation, setToLocation] = useState<string>("BKC Plaza");
  const [vehicleType, setVehicleType] = useState<string>("EV Four-Wheeler");
  const [challengeSaved, setChallengeSaved] = useState<boolean>(false);

  // --- STATE FOR REAL-TIME CO2 SAVINGS ---
  const [co2Saved, setCo2Saved] = useState<number>(14298.54);

  // --- STATE FOR NEWSLETTER ---
  const [newsEmail, setNewsEmail] = useState<string>("");
  const [newsSuccess, setNewsSuccess] = useState<boolean>(false);

  // --- STATE FOR EMERGENCY ALERT BANNER DISMISSAL ---
  const [alertDismissed, setAlertDismissed] = useState<boolean>(false);

  // CO2 Saved tick up interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Saved((prev) => prev + parseFloat((Math.random() * 0.03 + 0.01).toFixed(4)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Emergency corridor stepping simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emergencyActive) {
      setCorridorStep(0);
      const runStep = (step: number) => {
        if (step <= 4) {
          timer = setTimeout(() => {
            setCorridorStep(step);
            runStep(step + 1);
          }, 1200);
        } else {
          timer = setTimeout(() => {
            setEmergencyActive(false);
            setCorridorStep(0);
          }, 1800);
        }
      };
      runStep(1);
    }
    return () => clearTimeout(timer);
  }, [emergencyActive]);

  // Dynamic Icon mapping helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Navigation": return Navigation;
      case "ShieldAlert": return ShieldAlert;
      case "SquareParking": return SquareParking;
      case "TrainFront": return TrainFront;
      case "Cpu": return Cpu;
      case "Leaf": return Leaf;
      case "Users": return Users;
      case "Clock": return Clock;
      case "Activity": return Activity;
      case "Milestone": return Milestone;
      default: return Cpu;
    }
  };

  // Commuter Challenge Logic
  const getCommuteStats = () => {
    let distance = 16.4; // base km
    if (fromLocation === "Borivali") distance = 22.8;
    else if (fromLocation === "Thane") distance = 26.5;
    else if (fromLocation === "Andheri") distance = 11.2;
    else if (fromLocation === "Dahisar") distance = 29.4;

    if (toLocation === "CSMT Yard") distance += 8.5;
    else if (toLocation === "Colaba") distance += 12.0;
    else if (toLocation === "Bandra") distance -= 3.6;

    // Speeds and carbon emission factors
    let speed = 22; // base km/h
    let carbonEmissionFactor = 0.22; // kg CO2 per km

    // Adjust speed based on simulated heatmap density
    const densityPenalty = (trafficDensity - 30) / 10; // penalty index

    if (vehicleType === "Petrol SUV") {
      speed = Math.max(12, 22 - densityPenalty * 1.8);
      carbonEmissionFactor = 0.29;
    } else if (vehicleType === "Diesel Sedan") {
      speed = Math.max(14, 24 - densityPenalty * 1.5);
      carbonEmissionFactor = 0.21;
    } else if (vehicleType === "EV Four-Wheeler") {
      // EV lanes bypass some traffic
      speed = Math.max(20, 28 - densityPenalty * 0.8);
      carbonEmissionFactor = 0.04;
    } else if (vehicleType === "Mumbai Metro") {
      // Metro is completely unaffected by road traffic density
      speed = 48;
      carbonEmissionFactor = 0.01;
    } else if (vehicleType === "BEST Bus") {
      speed = Math.max(15, 21 - densityPenalty * 1.2);
      carbonEmissionFactor = 0.05;
    }

    const timeMinutes = Math.round((distance / speed) * 60);
    const co2Emitted = parseFloat((distance * carbonEmissionFactor).toFixed(2));
    const baselineCo2 = distance * 0.29; // SUV Baseline
    const co2SavedKg = parseFloat(Math.max(0, baselineCo2 - co2Emitted).toFixed(2));
    const efficiencyScore = Math.round((co2SavedKg / (baselineCo2 || 1)) * 100);

    return {
      distance: distance.toFixed(1),
      timeMinutes,
      co2Emitted,
      co2SavedKg,
      efficiencyScore
    };
  };

  const challengeStats = getCommuteStats();

  const handleSaveChallenge = (e: React.MouseEvent) => {
    e.preventDefault();
    setChallengeSaved(true);
    setTimeout(() => setChallengeSaved(false), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setNewsSuccess(true);
      setTimeout(() => {
        setNewsSuccess(false);
        setNewsEmail("");
      }, 4000);
    }
  };

  // Find info of selected road for Telemetry tab
  const activeRoadData = ROAD_CONDITIONS.find(r => r.road === selectedRoad) || ROAD_CONDITIONS[0];

  // Radar mock blips
  const RADAR_BLIPS = [
    { id: "EM-1102", type: "Ambulance", speed: "78 km/h", status: "Active Corridor", x: "35%", y: "45%" },
    { id: "PL-5599", type: "Police Patrol", speed: "42 km/h", status: "On Patrol", x: "65%", y: "25%" },
    { id: "EV-8012", type: "EV Bus", speed: "28 km/h", status: "On Route", x: "50%", y: "70%" },
    { id: "MT-302", type: "Metro Train", speed: "45 km/h", status: "On Time", x: "20%", y: "30%" }
  ];

  return (
    <div 
      id="landing-container" 
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 selection:bg-cyan-500 selection:text-slate-950 ${
        isLight ? "bg-[#F3F4F6] text-slate-800" : "bg-[#0B0F19] text-slate-100"
      }`}
    >
      
      {/* Top Floating Glassmorphic Header */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 border-b ${
        isLight 
          ? "bg-white/70 border-gray-200/80 text-slate-800" 
          : "bg-[#0B0F19]/70 border-slate-800/80 text-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Logo className="w-9 h-9" isLight={isLight} withText={true} />

          {/* Center Links with smooth hover underlines expanding from center */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-wrap xl:flex-nowrap justify-center max-w-full">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className={`relative px-2 xl:px-2.5 py-1.5 text-[10px] xl:text-[11px] font-bold tracking-wider uppercase transition-all duration-200 rounded-xl cursor-pointer ${
                  link.id === "home"
                    ? isLight 
                      ? "text-cyan-600 bg-cyan-50/50 animate-pulse" 
                      : "text-white bg-slate-900"
                    : isLight 
                      ? "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80" 
                      : "text-slate-400 hover:text-white hover:bg-slate-950/40"
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Balanced Theme Toggle Button */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isLight 
                    ? "bg-slate-100 hover:bg-slate-200 border-gray-200 text-slate-700" 
                    : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                }`}
                title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            )}

            <button 
              id="landing-header-login"
              onClick={onOpenLogin}
              className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer border ${
                isLight 
                  ? "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-gray-200" 
                  : "text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800"
              }`}
            >
              Sign In
            </button>
            <button 
              id="landing-header-cta"
              onClick={onEnterApp}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02] cursor-pointer"
            >
              Access Command Center
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Broadcast alert bar styled in Electric Amber */}
      {!alertDismissed && (
        <div className="bg-amber-500/10 border-y border-amber-500/20 py-2.5 px-4 text-center relative transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-amber-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="animate-ping inline-block h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <Volume2 className="w-4 h-4 animate-bounce text-amber-500" />
              <span><strong>ACTIVE GREEN CORRIDOR PROPOSAL:</strong> Priority signaling active for approaching emergency responders.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setEmergencyActive(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider transition-all"
              >
                Simulate Corridor Clear
              </button>
              <button 
                onClick={() => setAlertDismissed(true)} 
                className="text-slate-500 hover:text-slate-300 font-bold ml-2 text-sm"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-28 pb-16 lg:pt-40 lg:pb-24 border-b ${
        isLight ? "border-gray-200" : "border-slate-900"
      }`}>
        {/* Glow Effects (Radial Sapphire Glows) */}
        {!isLight && (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none"></div>
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Refined typography & massive headline */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 shadow-inner">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-wider">AI Powered Traffic Management</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
                <span className={isLight ? "text-slate-950" : "text-white"}>Smarter Roads,</span> <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
                  Safer Journeys
                </span>
              </h1>
              
              <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Smart AI Traffic Cop uses real-time road grid data and advanced artificial intelligence models to predict congestion, optimize active public transit, clear emergency routes, and save valuable commuter time.
              </p>

              {/* Dynamic Live Environmental Savings Stats Counter */}
              <div className={`border p-5 rounded-2xl max-w-lg space-y-3.5 backdrop-blur-md transition-all duration-300 ${
                isLight 
                  ? "bg-white/80 border-cyan-200/60 shadow-lg shadow-slate-100" 
                  : "bg-slate-950/40 border-cyan-500/15 shadow-[0_0_20px_rgba(6,182,212,0.06)]"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Collective Grid CO2 Savings Today
                  </span>
                  <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/20 animate-pulse uppercase tracking-wider font-bold">LIVE INCREMENTAL</span>
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold font-mono tracking-tight tabular-nums bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                    {co2Saved.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">kg CO₂</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Calculated based on real-time routing recommendations accepted by EV and transit commuters across the Mumbai metropolitan area.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="landing-hero-get-started"
                  onClick={onEnterApp}
                  className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/15 hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#commute-sandbox"
                  className={`px-6 py-4 font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all border cursor-pointer text-center ${
                    isLight 
                      ? "bg-white hover:bg-slate-50 border-gray-200 text-slate-700" 
                      : "bg-[#111726]/60 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  Try commute sandbox
                </a>
              </div>

              {/* Statistics Grid */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t ${
                isLight ? "border-gray-200" : "border-slate-900"
              }`}>
                {SYSTEM_STATS.map((stat, i) => {
                  const StatIcon = getIcon(stat.icon);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <StatIcon className="w-4 h-4 text-cyan-500/70" />
                        <span className="text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <p className={`text-xl sm:text-2xl font-extrabold font-mono ${isLight ? "text-slate-950" : "text-white"}`}>{stat.value}</p>
                      <p className="text-[10px] text-slate-400">{stat.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Layered geometric "Traffic Hub Matrix" */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center">
                
                {/* Glowing background halo */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Pulsing circular grid background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[100%] h-[100%] rounded-full border border-cyan-500/5 animate-pulse absolute"></div>
                  <div className="w-[80%] h-[80%] rounded-full border border-blue-500/10 absolute"></div>
                  <div className="w-[60%] h-[60%] rounded-full border border-cyan-500/15 absolute animate-pulse"></div>
                  <div className="w-[40%] h-[40%] rounded-full border border-blue-500/20 absolute"></div>
                </div>

                {/* Rotating sweep line */}
                <div className="absolute w-[90%] h-[90%] rounded-full border border-cyan-500/5 flex items-center justify-center animate-[spin_12s_linear_infinite] pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-[45%] bg-gradient-to-b from-cyan-400/40 via-cyan-400/10 to-transparent origin-bottom"></div>
                </div>

                {/* Neon-lit vector lines mimicking illuminated street lanes that slowly glow and fade */}
                <svg viewBox="0 0 200 200" className="absolute w-[95%] h-[95%] pointer-events-none opacity-70">
                  <defs>
                    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Glowing street lanes */}
                  <path d="M 20,100 C 60,50 140,50 180,100" fill="none" stroke="url(#neonCyan)" strokeWidth="3" className="animate-pulse" />
                  <path d="M 100,20 C 50,60 50,140 100,180" fill="none" stroke="url(#neonCyan)" strokeWidth="2.5" className="animate-pulse" />
                  <path d="M 20,180 Q 100,100 180,20" fill="none" stroke="url(#neonCyan)" strokeWidth="2.5" strokeDasharray="3,4" className="animate-pulse" />
                </svg>

                {/* Hoverable floating telemetry nodes with live statistics */}
                <div className="absolute top-[18%] left-[16%] group/node cursor-pointer">
                  <div className="absolute -inset-1.5 bg-cyan-500 rounded-full blur opacity-30 group-hover/node:opacity-80 transition duration-300 animate-ping"></div>
                  <div className={`relative border px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg group-hover/node:scale-105 transition-all ${
                    isLight ? "bg-white border-cyan-200 text-cyan-600" : "bg-[#111726]/95 border-cyan-400/40 text-cyan-400"
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Grid Density: Optimal</span>
                  </div>
                </div>

                <div className="absolute bottom-[22%] right-[10%] group/node cursor-pointer">
                  <div className="absolute -inset-1.5 bg-blue-500 rounded-full blur opacity-30 group-hover/node:opacity-80 transition duration-300 animate-ping"></div>
                  <div className={`relative border px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg group-hover/node:scale-105 transition-all ${
                    isLight ? "bg-white border-blue-200 text-blue-600" : "bg-[#111726]/95 border-blue-400/40 text-cyan-400"
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    <span>Signal Delay: -18%</span>
                  </div>
                </div>

                <div className="absolute bottom-[12%] left-[24%] group/node cursor-pointer">
                  <div className="absolute -inset-1.5 bg-amber-500 rounded-full blur opacity-30 group-hover/node:opacity-80 transition duration-300 animate-ping"></div>
                  <div className={`relative border px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg group-hover/node:scale-105 transition-all ${
                    isLight ? "bg-white border-amber-200 text-amber-600" : "bg-[#111726]/95 border-amber-400/40 text-amber-500"
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Green Corridor: Sion</span>
                  </div>
                </div>

                <div className="absolute top-[28%] right-[18%] group/node cursor-pointer">
                  <div className="absolute -inset-1.5 bg-teal-500 rounded-full blur opacity-30 group-hover/node:opacity-80 transition duration-300 animate-ping"></div>
                  <div className={`relative border px-3 py-1.5 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg group-hover/node:scale-105 transition-all ${
                    isLight ? "bg-white border-teal-200 text-teal-600" : "bg-[#111726]/95 border-teal-400/40 text-teal-400"
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    <span>Transit Priority: Active</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE COMMUTE SANDBOX (MUMBAI COMMUTE CHALLENGE) */}
      <section id="commute-sandbox" className={`py-20 border-b ${
        isLight ? "bg-slate-50/85 border-gray-200" : "bg-[#0E1322] border-slate-900/60"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-cyan-500 font-mono text-[10px] font-bold tracking-widest uppercase block">Interactive Sandbox</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>
              Predict Your Commute & Savings
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Use our live routing analyzer below to compare travel times, fuel efficiency, and CO₂ savings across different transit modes in Mumbai based on active traffic grid density.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Selection Panel */}
            <div className={`border rounded-2xl p-6 space-y-6 ${
              isLight ? "bg-white border-gray-200" : "bg-[#111726]/60 border-slate-800"
            } lg:col-span-5`}>
              <h3 className={`text-base font-bold font-mono tracking-wider uppercase flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                <Sliders className="w-5 h-5 text-cyan-500" />
                Configure Simulated Route
              </h3>

              <div className="space-y-4">
                
                {/* From Location */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Departure Point (From)</label>
                  <select 
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer transition-colors ${
                      isLight 
                        ? "bg-slate-100 border-gray-200 text-slate-800 hover:border-gray-300" 
                        : "bg-slate-950 border-slate-800 text-white hover:border-slate-700"
                    }`}
                  >
                    <option value="Borivali">Borivali Station</option>
                    <option value="Thane">Thane Gokhale Road</option>
                    <option value="Andheri">Andheri East Hub</option>
                    <option value="Dahisar">Dahisar Check Naka</option>
                  </select>
                </div>

                {/* To Location */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Destination Point (To)</label>
                  <select 
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none cursor-pointer transition-colors ${
                      isLight 
                        ? "bg-slate-100 border-gray-200 text-slate-800 hover:border-gray-300" 
                        : "bg-slate-950 border-slate-800 text-white hover:border-slate-700"
                    }`}
                  >
                    <option value="BKC Plaza">Bandra Kurla Complex (BKC)</option>
                    <option value="CSMT Yard">Chhatrapati Shivaji Terminal (CSMT)</option>
                    <option value="Colaba">Colaba Coast Point</option>
                    <option value="Bandra">Bandra West Bandstand</option>
                  </select>
                </div>

                {/* Transport Mode */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Transit Mode Selection</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "Petrol SUV", label: "Petrol SUV", icon: "🚗" },
                      { value: "Diesel Sedan", label: "Diesel Sedan", icon: "🚙" },
                      { value: "EV Four-Wheeler", label: "EV Four-Wheeler", icon: "⚡" },
                      { value: "Mumbai Metro", label: "Mumbai Metro", icon: "🚇" },
                      { value: "BEST Bus", label: "BEST Bus", icon: "🚌" }
                    ].map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setVehicleType(m.value)}
                        className={`p-3 rounded-xl border text-[11px] text-left transition-all flex items-center gap-2 cursor-pointer ${
                          vehicleType === m.value 
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-600 font-bold" 
                            : isLight 
                            ? "bg-slate-100 border-gray-200 text-slate-600 hover:text-slate-950 hover:bg-slate-200" 
                            : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={onEnterApp}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Access Full Map Integration <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Response output */}
            <div className={`border rounded-2xl p-6 flex flex-col justify-between h-full space-y-6 lg:col-span-7 ${
              isLight ? "bg-white border-gray-200" : "bg-[#111726]/40 border-slate-900"
            }`}>
              <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-slate-900 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Estimated Routing Performance</span>
                  <span className="text-xs text-slate-400">Calculated based on active lane parameters in the system</span>
                </div>
                <div className="flex items-center gap-1.5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-2.5 py-1 rounded-xl text-[10px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Safe</span>
                </div>
              </div>

              {/* Large Output Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border space-y-1 ${isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900"}`}>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block">Estimated Distance</span>
                  <p className={`text-xl font-extrabold font-mono ${isLight ? "text-slate-950" : "text-white"}`}>{challengeStats.distance} km</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900"}`}>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block">Commute Time</span>
                  <p className="text-xl font-extrabold font-mono text-cyan-500">{challengeStats.timeMinutes} mins</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900"}`}>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block">CO₂ Footprint</span>
                  <p className={`text-xl font-extrabold font-mono ${isLight ? "text-slate-950" : "text-white"}`}>{challengeStats.co2Emitted} kg</p>
                </div>
                <div className={`p-4 rounded-xl border space-y-1 ${isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900"}`}>
                  <span className="text-[9px] text-slate-400 font-mono uppercase block">CO₂ Saved</span>
                  <p className="text-xl font-extrabold text-cyan-500 font-mono flex items-baseline gap-1">
                    +{challengeStats.co2SavedKg} <span className="text-[9px] text-slate-400 font-mono uppercase">kg</span>
                  </p>
                </div>
              </div>

              {/* Progress Offset Circle and AI tip */}
              <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl border ${
                isLight ? "bg-slate-50 border-gray-200/60" : "bg-slate-950 border-slate-900/60"
              }`}>
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="56" cy="56" r="44" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="56" 
                        cy="56" 
                        r="44" 
                        stroke="#06B6D4" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 44}
                        strokeDashoffset={2 * Math.PI * 44 * (1 - challengeStats.efficiencyScore / 100)}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={`text-xl font-extrabold font-mono ${isLight ? "text-slate-950" : "text-white"}`}>
                        {challengeStats.efficiencyScore}%
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono uppercase font-bold">Eco Score</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    AI Cop Routing Insights
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    By selecting <strong className={isLight ? "text-slate-950" : "text-white"}>{vehicleType}</strong>, your commute from {fromLocation} to {toLocation} reduces global emissions by approximately <strong className="text-cyan-500 font-mono">{challengeStats.co2SavedKg} kg</strong> compared to a traditional gasoline SUV baseline.
                  </p>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {vehicleType === "Mumbai Metro" 
                      ? "⚡ Superb choice. High frequency electric metro trains bypass all terrestrial congestion nodes."
                      : vehicleType === "EV Four-Wheeler"
                      ? "⚡ EVs bypass heavy emissions and enjoy discounted toll charges along the Bandra-Worli Sea Link."
                      : "💡 Switching to Mumbai Metro or EV Car for this route could save you up to 18 additional minutes."}
                  </p>
                </div>
              </div>

              {/* Dynamic Action Trigger */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleSaveChallenge}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
                    isLight 
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-gray-200" 
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  {challengeSaved ? (
                    <>
                      <Check className="w-4 h-4 text-cyan-500" />
                      Saved route parameters!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-400" />
                      Save route parameters
                    </>
                  )}
                </button>
                <span className="text-[9px] font-mono text-slate-500">MAPPED USING MUMBAI REAL-TIME GRID</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features-section" className={`py-20 ${
        isLight ? "bg-white border-b border-gray-200" : "bg-[#0B0F19] border-b border-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-cyan-500 font-mono text-[10px] font-bold tracking-widest uppercase block">Next-Gen Modules</span>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>
              Advanced Traffic Cop Capabilities
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Discover how our platform integrates AI mapping models, smart vehicle coordination, and municipal database linkages to deliver immediate travel ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANDING_FEATURES.map((feat) => {
              const Icon = getIcon(feat.icon);
              return (
                <div 
                  key={feat.id} 
                  className={`border p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/[0.02] ${
                    isLight ? "bg-slate-50 border-gray-200 hover:border-gray-300" : "bg-[#111726]/60 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="space-y-4">
                    <div className={`p-3 rounded-xl w-fit ${
                      feat.color === "emerald" ? "bg-cyan-500/10 text-cyan-500" :
                      feat.color === "rose" ? "bg-rose-500/10 text-rose-500" :
                      feat.color === "blue" ? "bg-blue-500/10 text-blue-500" :
                      feat.color === "amber" ? "bg-amber-500/10 text-amber-500" :
                      feat.color === "purple" ? "bg-purple-500/10 text-purple-500" : "bg-teal-500/10 text-teal-500"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-sm font-bold uppercase font-mono tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
                      {feat.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Call To Action Banner */}
      <section className={`py-20 relative overflow-hidden ${isLight ? "bg-slate-50" : "bg-[#0B0F19]"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${isLight ? "text-slate-950" : "text-white"}`}>
            Ready to Experience the Future of Urban Transit?
          </h2>
          <p className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            Create an account, register your vehicle credentials, search live parking hubs, optimize routes with the Gemini Travel assistant, and save fuel emissions.
          </p>

          {/* Interactive Newsletter Update Card */}
          <div className="max-w-md mx-auto pt-4">
            <form onSubmit={handleNewsletterSubmit} className={`flex gap-2 border p-1.5 rounded-2xl ${
              isLight ? "bg-white border-gray-200" : "bg-[#111726]/60 border-slate-800"
            }`}>
              <input 
                type="email" 
                required
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="Enter your email for grid updates"
                className={`text-xs px-3 py-2 flex-1 outline-none font-sans bg-transparent ${
                  isLight ? "text-slate-800 placeholder-slate-400" : "text-slate-200 placeholder-slate-500"
                }`}
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap"
              >
                Get Updates
              </button>
            </form>
            {newsSuccess && (
              <p className="text-cyan-500 text-[10px] font-mono font-bold mt-2.5 animate-pulse text-center">
                ✓ Success! Your communication credentials are added to dispatch channel.
              </p>
            )}
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
            >
              Enter Dashboard Command
            </button>
            <button
              onClick={onOpenLogin}
              className={`px-6 py-3.5 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border cursor-pointer ${
                isLight 
                  ? "bg-white hover:bg-slate-50 border-gray-200 text-slate-700" 
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              Create Account Credentials
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 text-slate-500 text-xs mt-auto ${
        isLight ? "bg-white border-gray-200" : "bg-[#0B0F19] border-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500/70" />
            <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">SMART AI TRAFFIC COP © 2026</span>
          </div>
          <div className="flex gap-6 text-slate-500">
            <a href="#" className="hover:text-cyan-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-500 transition-colors">Grid Terms</a>
            <a href="#" className="hover:text-cyan-500 transition-colors">API Grounding</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
