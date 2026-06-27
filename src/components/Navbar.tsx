import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  Settings, 
  ChevronDown, 
  Menu, 
  X, 
  Globe, 
  Search, 
  Sparkles, 
  Navigation, 
  SquareParking, 
  TrainFront, 
  ShieldAlert, 
  BarChart3, 
  User, 
  AlertTriangle, 
  Radio, 
  Activity, 
  HelpCircle,
  PlusCircle,
  FileText
} from "lucide-react";
import { User as UserType } from "../types";
import Logo from "./Logo";

interface NavbarProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  viewMode?: "landing" | "app";
  setViewMode?: (mode: "landing" | "app") => void;
  theme?: "dark" | "light";
  toggleTheme?: () => void;
}

export default function Navbar({ 
  currentUser, 
  onLogout, 
  onOpenLogin, 
  activeTab,
  setActiveTab,
  viewMode = "app",
  setViewMode,
  theme = "dark",
  toggleTheme
}: NavbarProps) {
  
  // Navigation lists
  const navLinks = [
    { id: "home", label: "Home", action: "landing", tabId: "home" },
    { id: "dashboard", label: "Dashboard", action: "tab", tabId: "dashboard" },
    { id: "planner", label: "Smart Routes", action: "tab", tabId: "planner" },
    { id: "livetraffic", label: "Live Traffic", action: "tab", tabId: "dashboard" },
    { id: "parking", label: "Smart Parking", action: "tab", tabId: "parking" },
    { id: "transit", label: "Public Transport", action: "tab", tabId: "transit" },
    { id: "emergency", label: "Emergency", action: "tab", tabId: "emergency" },
    { id: "chat", label: "AI Assistant", action: "tab", tabId: "chat" },
    { id: "analytics", label: "Analytics", action: "tab", tabId: "analytics" },
    { id: "services", label: "Services", action: "mega", tabId: "services" }
  ];

  // Services listed in the Mega Menu
  const servicesList = [
    { id: "planner", label: "Smart Routes", desc: "Optimize eco-friendly paths and avoid congestion nodes.", icon: Navigation, color: "text-cyan-500 bg-cyan-500/10" },
    { id: "dashboard", label: "Live Traffic Map", desc: "Real-time metropolitan grid status, lane-by-lane speed views.", icon: Radio, color: "text-emerald-500 bg-emerald-500/10" },
    { id: "parking", label: "Smart Parking", desc: "Browse empty bays and pre-reserve vehicle slots instantly.", icon: SquareParking, color: "text-blue-500 bg-blue-500/10" },
    { id: "transit", label: "Public Transport", desc: "Live-track BEST buses, metro networks and delays.", icon: TrainFront, color: "text-amber-500 bg-amber-500/10" },
    { id: "emergency", label: "Emergency SOS Control", desc: "Request Green Corridors and priority signal overrides.", icon: ShieldAlert, color: "text-rose-500 bg-rose-500/10" },
    { id: "analytics", label: "City Analytics Hub", desc: "Historical emission reduction telemetry and CO2 indicators.", icon: BarChart3, color: "text-purple-500 bg-purple-500/10" }
  ];

  const languages = [
    { code: "EN", name: "English (US)", flag: "🇺🇸" },
    { code: "HI", name: "Hindi (हिंदी)", flag: "🇮🇳" },
    { code: "MR", name: "Marathi (मराठी)", flag: "🇮🇳" }
  ];

  // Active UI States
  const [scrolled, setScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status Indicator state
  const [gridStatus, setGridStatus] = useState<"green" | "yellow" | "red">("green");

  // Notifications Mock Data (connected conceptually to incident reports)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Green Corridor Activated", desc: "Ambulance AM-402 cleared Sion Link.", time: "2m ago", unread: true },
    { id: 2, title: "Heavy Congestion WEH", desc: "Average speeds dropped to 14 km/h near Bandra.", time: "15m ago", unread: true },
    { id: 3, title: "Parking Bay Reserved", desc: "Bay C-22 reserved successfully at BKC Hub.", time: "1h ago", unread: false }
  ]);

  // Detect scroll to trigger glassmorphism refinement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown closure helpers
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) setMegaMenuOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(target)) setNotificationOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(target)) setLanguageOpen(false);
      if (statusRef.current && !statusRef.current.contains(target)) setStatusDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (link: { id: string; label: string; action: string; tabId?: string }) => {
    if (link.action === "landing") {
      if (setViewMode) {
        setViewMode("landing");
      }
    } else if (link.action === "tab") {
      if (setViewMode) setViewMode("app");
      if (setActiveTab && link.tabId) setActiveTab(link.tabId);
    } else if (link.action === "mega") {
      setMegaMenuOpen(!megaMenuOpen);
    }
    setMobileDrawerOpen(false);
  };

  const handleServiceClick = (serviceId: string) => {
    if (setViewMode) setViewMode("app");
    if (setActiveTab) setActiveTab(serviceId);
    setMegaMenuOpen(false);
    setMobileDrawerOpen(false);
    showToast(`Routing to ${servicesList.find(s => s.id === serviceId)?.label}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`AI Searching grid for "${searchQuery}"`);
      // Simulating action
      if (setViewMode) setViewMode("app");
      if (setActiveTab) setActiveTab("dashboard");
      setSearchQuery("");
      setSearchFocused(false);
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast("Notifications cleared");
  };

  const triggerSOS = () => {
    if (setViewMode) setViewMode("app");
    if (setActiveTab) setActiveTab("emergency");
    showToast("🚨 SOS Emergency Protocol Activated! Signals overridden.");
    setGridStatus("red");
  };

  const triggerReport = () => {
    if (setViewMode) setViewMode("app");
    if (setActiveTab) setActiveTab("safety");
    showToast("Redirecting to Safety Hazard reporting terminal...");
  };

  const hasUnread = notifications.some(n => n.unread);
  const isLight = theme === "light";

  return (
    <>
      <header 
        id="app-navbar" 
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          scrolled 
            ? isLight 
              ? "bg-white/85 shadow-lg shadow-slate-100/30 border-gray-200/80 backdrop-blur-xl" 
              : "bg-[#0B0F19]/85 shadow-2xl shadow-slate-950/40 border-slate-900/90 backdrop-blur-xl"
            : isLight 
              ? "bg-white/60 border-gray-200/40 backdrop-blur-lg" 
              : "bg-[#0B0F19]/60 border-slate-900/40 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* 1. Brand Logo (Left Side) */}
          <button 
            id="navbar-logo-button"
            onClick={() => handleLinkClick({ id: "home", label: "Home", action: "landing" })}
            className="flex items-center text-left focus:outline-none"
          >
            <Logo className="w-9 h-9 sm:w-11 sm:h-11" isLight={isLight} withText={true} />
          </button>

          {/* 2. Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 flex-wrap xl:flex-nowrap justify-center max-w-full">
            {navLinks.map((link) => {
              const isHomeActive = viewMode === "landing" && link.id === "home";
              const isAppActive = viewMode === "app" && activeTab === link.tabId && link.id !== "livetraffic";
              const isServicesOpen = link.id === "services" && megaMenuOpen;
              const isActive = isHomeActive || isAppActive;

              return (
                <div key={link.id} className="relative">
                  <button
                    id={`nav-link-${link.id}`}
                    onClick={() => handleLinkClick(link)}
                    className={`relative px-2 xl:px-2.5 py-1.5 text-[10px] xl:text-[11px] font-bold tracking-wider uppercase transition-all duration-200 rounded-xl cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? isLight 
                          ? "text-cyan-600 bg-cyan-50/50" 
                          : "text-white bg-slate-900"
                        : isLight 
                          ? "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80" 
                          : "text-slate-400 hover:text-white hover:bg-slate-950/40"
                    }`}
                  >
                    {link.label}
                    {link.id === "services" && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isServicesOpen ? "rotate-180 text-cyan-500" : "text-slate-500"}`} />
                    )}
                  </button>

                  {/* Sleek active dot / underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-cyan-500" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* 3. Right Side Interactive Elements */}
          <div className="flex items-center gap-2 xl:gap-3.5">
            
            {/* Global Search Bar (Rounded & Premium) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative max-w-[150px] lg:max-w-[200px] xl:max-w-[240px]">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search highways, bays, or route..."
                  className={`w-full text-xs py-2 pl-9 pr-4 rounded-full border outline-none font-sans transition-all duration-300 ${
                    searchFocused 
                      ? isLight 
                        ? "bg-white border-cyan-500 text-slate-950 ring-2 ring-cyan-500/10 w-[180px] xl:w-[260px]" 
                        : "bg-slate-950 border-cyan-500 text-white ring-2 ring-cyan-500/20 w-[180px] xl:w-[260px]"
                      : isLight 
                        ? "bg-slate-100 border-gray-200 text-slate-800 placeholder-slate-400 hover:border-gray-300" 
                        : "bg-slate-900/60 border-slate-800/80 text-slate-300 placeholder-slate-500 hover:border-slate-700"
                  }`}
                />
                <Search className={`absolute left-3 top-2.5 w-4 h-4 transition-colors ${searchFocused ? "text-cyan-500" : "text-slate-500"}`} />
              </div>

              {/* Instant Search Hints */}
              {searchFocused && (
                <div className={`absolute left-0 mt-2 w-[220px] rounded-2xl border p-2 shadow-2xl z-50 text-left font-sans transition-all duration-200 ${
                  isLight ? "bg-white border-gray-200 text-slate-800" : "bg-slate-950 border-slate-900 text-slate-200"
                }`}>
                  <p className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider font-bold">Suggested Nodes</p>
                  <button 
                    type="button"
                    onMouseDown={() => { setSearchQuery("Western Express Highway"); }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-lg ${isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900 text-slate-300"}`}
                  >
                    🛣️ Western Express Highway
                  </button>
                  <button 
                    type="button"
                    onMouseDown={() => { setSearchQuery("BKC Smart Parking"); }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-lg ${isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900 text-slate-300"}`}
                  >
                    🅿️ BKC Smart Parking
                  </button>
                  <button 
                    type="button"
                    onMouseDown={() => { setSearchQuery("Sion Sector 4"); }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-lg ${isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900 text-slate-300"}`}
                  >
                    🟢 Sion Emergency Corridor
                  </button>
                </div>
              )}
            </form>

            {/* Live Traffic Status Pulse Indicator */}
            <div className="relative" ref={statusRef}>
              <button 
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono font-bold transition-all hover:scale-[1.02] cursor-pointer ${
                  isLight 
                    ? "bg-white border-gray-200 text-slate-700 hover:border-gray-300" 
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
                title="Municipal Grid Congestion Status"
              >
                <span className={`relative flex h-2 w-2`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    gridStatus === "green" ? "bg-emerald-400" : gridStatus === "yellow" ? "bg-amber-400" : "bg-rose-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    gridStatus === "green" ? "bg-emerald-500" : gridStatus === "yellow" ? "bg-amber-500" : "bg-rose-500"
                  }`}></span>
                </span>
                <span className="hidden xl:inline uppercase">Grid:</span>
                <span className={`uppercase font-bold ${
                  gridStatus === "green" ? "text-emerald-500" : gridStatus === "yellow" ? "text-amber-500" : "text-rose-500"
                }`}>
                  {gridStatus === "green" ? "Optimal" : gridStatus === "yellow" ? "Moderate" : "SOS Override"}
                </span>
              </button>

              {statusDropdownOpen && (
                <div className={`absolute right-0 mt-2.5 w-64 rounded-2xl border p-4 shadow-2xl z-50 text-left ${
                  isLight 
                    ? "bg-white border-gray-200 text-slate-800" 
                    : "bg-[#0B0F19]/95 border-slate-800 text-slate-200 backdrop-blur-xl"
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-500 border-b border-gray-200/50 dark:border-slate-900 pb-2 mb-2">Municipal Grid Health</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Average Congestion:</span>
                      <span className="font-bold font-mono">18% (Low)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Green Corridors Open:</span>
                      <span className="font-bold font-mono text-emerald-400">1 Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Signals Sync Status:</span>
                      <span className="font-bold font-mono text-cyan-500">98.4% Efficiency</span>
                    </div>
                    <div className="pt-2 border-t border-slate-900/40 flex flex-wrap gap-2">
                      <button 
                        onClick={() => { setGridStatus("green"); setStatusDropdownOpen(false); }}
                        className="flex-1 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold font-mono rounded text-[9px] uppercase border border-emerald-500/10"
                      >
                        GREEN
                      </button>
                      <button 
                        onClick={() => { setGridStatus("yellow"); setStatusDropdownOpen(false); }}
                        className="flex-1 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold font-mono rounded text-[9px] uppercase border border-amber-500/10"
                      >
                        YELLOW
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`p-2.5 rounded-xl border transition-all relative hover:scale-105 cursor-pointer ${
                  isLight 
                    ? "bg-slate-100 hover:bg-slate-200 border-gray-200 text-slate-700" 
                    : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                }`}
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-amber-500 border border-[#0B0F19] animate-pulse"></span>
                )}
              </button>

              {notificationOpen && (
                <div className={`absolute right-0 mt-2.5 w-72 rounded-2xl border p-2 shadow-2xl z-50 ${
                  isLight 
                    ? "bg-white border-gray-200 text-slate-800" 
                    : "bg-[#0B0F19] border-slate-800 text-slate-200"
                }`}>
                  <div className="p-3 border-b border-gray-200/50 dark:border-slate-900 flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase font-mono tracking-wider text-slate-400">Live Grid Incidents</span>
                    {hasUnread && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-cyan-500 font-bold hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[240px] overflow-y-auto divide-y divide-gray-200/50 dark:divide-slate-900 scrollbar-thin">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 text-xs space-y-1 transition-colors ${n.unread ? (isLight ? "bg-cyan-50/20" : "bg-cyan-500/5") : ""}`}>
                        <div className="flex justify-between items-start">
                          <span className={`font-bold flex items-center gap-1.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                            {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>}
                            {n.title}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-200/50 dark:border-slate-900 text-center">
                    <button 
                      onClick={() => { setNotificationOpen(false); if (setActiveTab) handleServiceClick("safety"); }}
                      className="text-[10px] text-cyan-500 hover:underline font-bold"
                    >
                      View incident reporting center
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setLanguageOpen(!languageOpen)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-1 hover:scale-105 cursor-pointer ${
                  isLight 
                    ? "bg-slate-100 hover:bg-slate-200 border-gray-200 text-slate-700" 
                    : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                }`}
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-mono font-bold tracking-wider">{selectedLang.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {languageOpen && (
                <div className={`absolute right-0 mt-2.5 w-40 rounded-2xl border p-1 shadow-2xl z-50 ${
                  isLight 
                    ? "bg-white border-gray-200 text-slate-800" 
                    : "bg-[#0B0F19] border-slate-800 text-slate-200"
                }`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang); setLanguageOpen(false); showToast(`Language changed to ${lang.name}`); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                        selectedLang.code === lang.code 
                          ? isLight ? "bg-cyan-50 text-cyan-600 font-bold" : "bg-slate-900 text-white font-bold"
                          : isLight ? "hover:bg-slate-100 text-slate-600" : "hover:bg-slate-900 text-slate-400"
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                  isLight 
                    ? "bg-slate-100 hover:bg-slate-200 border-gray-200 text-slate-700" 
                    : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300"
                }`}
                title={isLight ? "Toggle Dark Mode" : "Toggle Light Mode"}
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            )}

            {/* User Profile Avatar with rich dropdown */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 text-left p-1 rounded-full transition-all border cursor-pointer ${
                    isLight 
                      ? "hover:bg-slate-100 border-transparent hover:border-gray-200" 
                      : "hover:bg-slate-900/60 border-transparent hover:border-slate-800"
                  }`}
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} 
                    alt="Profile" 
                    className="w-7.5 h-7.5 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className={`absolute right-0 mt-2.5 w-60 rounded-2xl border p-2 shadow-2xl z-50 ${
                    isLight 
                      ? "bg-white border-gray-200 text-slate-800" 
                      : "bg-[#0B0F19] border-slate-800 text-slate-200"
                  }`}>
                    <div className="p-3 border-b border-gray-200/50 dark:border-slate-900">
                      <p className={`text-xs font-extrabold truncate ${isLight ? "text-slate-900" : "text-white"}`}>{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                      <p className="text-[9px] text-cyan-500 mt-1.5 uppercase font-mono tracking-wider">ROLE: {currentUser.role} Cop</p>
                    </div>
                    
                    <div className="py-1">
                      <button 
                        onClick={() => { setProfileOpen(false); handleServiceClick("profile"); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                          isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900 text-slate-300"
                        }`}
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </button>
                      <button 
                        onClick={() => { setProfileOpen(false); handleServiceClick("planner"); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                          isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900 text-slate-300"
                        }`}
                      >
                        <Navigation className="w-4 h-4 text-cyan-500" />
                        Saved Routes
                      </button>
                      <button 
                        onClick={() => { setProfileOpen(false); handleServiceClick("profile"); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl transition-colors text-left ${
                          isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900 text-slate-300"
                        }`}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        System Settings
                      </button>
                    </div>

                    <div className="border-t border-gray-200/50 dark:border-slate-900 pt-1.5 mt-1">
                      <button 
                        onClick={() => {
                          setProfileOpen(false);
                          onLogout();
                          showToast("Logged out successfully");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-500 hover:text-white hover:bg-rose-500/10 rounded-xl transition-all text-left font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect Dispatcher
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="px-4.5 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all shadow-md shadow-cyan-500/10 cursor-pointer hidden sm:block"
              >
                Sign In
              </button>
            )}

            {/* Mobile drawer toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className={`lg:hidden p-2.5 rounded-xl border cursor-pointer ${
                isLight ? "bg-slate-100 border-gray-200 text-slate-700" : "bg-slate-900 border-slate-800 text-slate-300"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* 4. MEGA MENU FOR SERVICES (Sleek Glassmorphic Dropdown) */}
        {megaMenuOpen && (
          <div 
            ref={megaMenuRef}
            className={`absolute left-0 right-0 top-full border-b shadow-2xl z-50 transition-all duration-300 ${
              isLight 
                ? "bg-white/95 border-gray-200 backdrop-blur-2xl" 
                : "bg-[#0B0F19]/95 border-slate-900/90 backdrop-blur-2xl text-slate-100"
            }`}
          >
            <div className="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="space-y-4 md:border-r border-gray-200/50 dark:border-slate-900/40 md:pr-6">
                <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest block">Municipal Command</span>
                <h3 className={`text-base font-extrabold ${isLight ? "text-slate-950" : "text-white"}`}>SIGNAL MIND Operations</h3>
                <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Access full telemetry endpoints. Trigger overrides, map green light corridors, and view active EV carbon index reductions instantly.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={triggerSOS}
                    className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md shadow-rose-500/10"
                  >
                    <ShieldAlert className="w-4 h-4 animate-bounce" /> Emergency SOS Dispatch
                  </button>
                  <button 
                    onClick={triggerReport}
                    className={`w-full py-2 border text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                      isLight 
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-gray-200" 
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" /> Report Grid Incident
                  </button>
                </div>
              </div>

              {/* Grid of services */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicesList.map((service) => {
                  const SvgIcon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all hover:scale-[1.01] hover:shadow-lg ${
                        isLight 
                          ? "bg-slate-50 border-gray-150 hover:bg-cyan-50/10 hover:border-cyan-300" 
                          : "bg-slate-900/40 border-slate-900/60 hover:bg-slate-900/80 hover:border-slate-800"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${service.color}`}>
                        <SvgIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-xs font-extrabold uppercase font-mono tracking-wider ${isLight ? "text-slate-900" : "text-white"}`}>
                          {service.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{service.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </header>

      {/* 5. SLIDE-OUT MOBILE NAVIGATION DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          
          {/* Backdrop */}
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-sm flex flex-col h-full shadow-2xl relative transition-all duration-300 border-l ${
              isLight ? "bg-white border-gray-200 text-slate-800" : "bg-[#0B0F19] border-slate-900 text-slate-100"
            }`}>
              
              {/* Header */}
              <div className="p-5 border-b border-gray-200/50 dark:border-slate-900 flex justify-between items-center">
                <Logo className="w-8 h-8" isLight={isLight} withText={true} />
                <button 
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`p-2 rounded-xl border ${isLight ? "bg-slate-100 border-gray-200" : "bg-slate-900 border-slate-800"}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search highways, parking, transit..."
                    className={`w-full text-xs py-3 pl-10 pr-4 rounded-xl border outline-none font-sans ${
                      isLight 
                        ? "bg-slate-100 border-gray-200 text-slate-800 placeholder-slate-400" 
                        : "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                    }`}
                  />
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                </form>

                {/* Primary navigation list */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-2">Command Centers</span>
                  
                  {navLinks.filter(l => l.id !== "services").map((link, idx) => (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-left text-[11px] uppercase font-mono font-bold tracking-wider transition-all flex items-center justify-between ${
                        viewMode === "app" && activeTab === link.tabId && link.id !== "livetraffic"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md" 
                          : isLight ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-[9px] text-slate-500 font-mono">0{idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Services Modules */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-2">Services Modules</span>
                  <div className="grid grid-cols-1 gap-2">
                    {servicesList.map((service) => {
                      const IconComponent = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => handleServiceClick(service.id)}
                          className={`w-full py-3 px-4 rounded-xl text-left text-xs transition-all border flex items-center gap-3 ${
                            isLight 
                              ? "bg-slate-50 hover:bg-slate-100 border-gray-200 text-slate-700" 
                              : "bg-slate-900/40 hover:bg-slate-900 border-slate-900 text-slate-300"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${service.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="font-bold uppercase font-mono text-[10px] tracking-wider">{service.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="space-y-2 border-t border-gray-200/50 dark:border-slate-900 pt-5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-2">Direct Overrides</span>
                  <button 
                    onClick={triggerSOS}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/10"
                  >
                    <ShieldAlert className="w-4 h-4 text-white animate-bounce" /> Emergency SOS Dispatch
                  </button>
                  <button 
                    onClick={triggerReport}
                    className={`w-full py-3 border text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                      isLight 
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-gray-200" 
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Report Traffic Hazard
                  </button>
                  <button 
                    onClick={() => { setMobileDrawerOpen(false); if (setActiveTab) handleServiceClick("chat"); }}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-extrabold rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-cyan-500/15"
                  >
                    <Sparkles className="w-4 h-4 text-white animate-pulse" /> AI Assistant Copilot
                  </button>
                </div>

              </div>

              {/* Bottom user profile section */}
              <div className="p-4 border-t border-gray-200/50 dark:border-slate-900 bg-slate-950/20">
                {currentUser ? (
                  <div className="flex items-center justify-between gap-3 p-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} 
                        alt="Avatar" 
                        className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                      />
                      <div>
                        <p className="text-xs font-extrabold">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ROLE: {currentUser.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setMobileDrawerOpen(false); onLogout(); }}
                      className="text-slate-500 hover:text-rose-500 p-2 rounded-xl"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileDrawerOpen(false); onOpenLogin(); }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl tracking-wider uppercase border border-slate-800 cursor-pointer"
                  >
                    Sign In to Dashboard
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Floating Action Message notification toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-950 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl shadow-2xl border border-cyan-500/30 flex items-center gap-3 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
