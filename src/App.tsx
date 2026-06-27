import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MapContainer from "./components/MapContainer";
import LandingPage from "./components/LandingPage";
import LoginModal from "./components/LoginModal";
import RoutePlanner from "./components/RoutePlanner";
import ParkingView from "./components/ParkingView";
import TransitView from "./components/TransitView";
import EmergencyView from "./components/EmergencyView";
import AIAssistant from "./components/AIAssistant";
import SafetyCenterView from "./components/SafetyCenterView";
import AnalyticsView from "./components/AnalyticsView";
import UserProfileView from "./components/UserProfileView";
import SplashScreen from "./components/SplashScreen";

import { User, EmergencyVehicle, ParkingSpot, TrafficIncident, TransitVehicle, AIInsight } from "./types";
import { ROAD_CONDITIONS } from "./data";
import { 
  CloudSun, 
  SquareParking, 
  TrainFront, 
  Car, 
  Zap, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [viewMode, setViewMode] = useState<"landing" | "app">("landing");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  
  // Dynamic application state
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [transitVehicles, setTransitVehicles] = useState<TransitVehicle[]>([]);
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Synchronized state links
  const [mapRoute, setMapRoute] = useState<{ from: string; to: string; pathName?: string; isGreenCorridor?: boolean } | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string>("p1");

  // Fetch initial telemetry data from backend API
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Transit
      const transitRes = await fetch("/api/transit");
      const transitData = await transitRes.json();
      setTransitVehicles([...transitData.buses, ...transitData.metro]);

      // 2. Parking
      const parkingRes = await fetch("/api/parking");
      const parkingData = await parkingRes.json();
      setParkingSpots(parkingData.spots);

      // 3. Emergency
      const emergencyRes = await fetch("/api/emergency");
      const emergencyData = await emergencyRes.json();
      setEmergencyVehicles(emergencyData);

      // 4. Incidents
      const incidentsRes = await fetch("/api/incidents");
      const incidentsData = await incidentsRes.json();
      setIncidents(incidentsData);

      // 5. Dynamic AI Insights
      const insightsRes = await fetch("/api/gemini/insights");
      const insightsData = await insightsRes.json();
      setAiInsights(insightsData);
    } catch (err) {
      console.error("Error fetching telemetry parameters:", err);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setViewMode("app");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode("landing");
  };

  // Add reported hazard from Safety Center
  const handleAddIncident = (newInc: TrafficIncident) => {
    setIncidents((prev) => [newInc, ...prev]);
  };

  const isLight = theme === "light";

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div id="application-shell" className={`min-h-screen flex flex-col font-sans overflow-hidden transition-all duration-300 ${
      isLight ? "bg-[#F3F4F6] text-slate-800" : "bg-[#0B0F19] text-slate-100"
    }`}>
      
      {/* 1. Landing Mode */}
      {viewMode === "landing" ? (
        <LandingPage 
          onEnterApp={() => setViewMode("app")}
          onOpenLogin={() => setLoginOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          setViewMode={setViewMode}
          setActiveTab={setActiveTab}
        />
      ) : (
        /* 2. Cockpit App Mode */
        <div className="flex h-screen w-screen overflow-hidden">
          
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenLogin={() => setLoginOpen(true)}
            theme={theme}
          />

          {/* Main workspace area */}
          <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-colors duration-300 ${
            isLight ? "bg-[#F3F4F6]" : "bg-[#0B0F19]"
          }`}>
            
            {/* Top Navbar */}
            <Navbar 
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenLogin={() => setLoginOpen(true)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              theme={theme}
              toggleTheme={toggleTheme}
            />

            {/* Inner Workspace Grid */}
            <main className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-thin">
              
              {/* Premium Back Button to return to Hero Page on every view */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200/50 dark:border-slate-800/60">
                <button
                  onClick={() => setViewMode("landing")}
                  className={`group flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 rounded-xl border cursor-pointer hover:scale-[1.02] shadow-sm ${
                    isLight
                      ? "bg-white border-gray-200 text-slate-700 hover:text-slate-950 hover:border-gray-300 hover:shadow-md"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/40"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-500 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Hero Page</span>
                </button>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                  SIGNAL MIND COMMAND COCKPIT / {activeTab}
                </span>
              </div>
              
              {/* Layout for default Command Dashboard Tab */}
              {activeTab === "dashboard" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column Content */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Welcome card */}
                    <div className={`border p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl transition-all duration-300 ${
                      isLight ? "bg-white border-gray-200" : "bg-[#111726] border-slate-800/80"
                    }`}>
                      <div>
                        <h3 className={`text-base font-extrabold flex items-center gap-1.5 font-sans ${isLight ? "text-slate-900" : "text-white"}`}>
                          Welcome back, {currentUser ? currentUser.name : "Guest Dispatcher"}! 👋
                        </h3>
                        <p className={`text-xs mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Here is a real-time summary of the Greater Mumbai traffic grid telemetry.</p>
                      </div>

                      {/* Micro environmental stats */}
                      <div className="flex gap-4 text-xs font-mono">
                        <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 transition-colors duration-300 ${
                          isLight ? "bg-slate-50 border-gray-200 text-slate-700" : "bg-slate-950 border-slate-900"
                        }`}>
                          <CloudSun className="w-4 h-4 text-amber-500" />
                          <span className={isLight ? "text-slate-600" : "text-slate-300"}>28°C • Partly Cloudy</span>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard quick-jump widgets matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Active AI recommended route widget */}
                      <div className={`border p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                        isLight ? "bg-white border-gray-200 text-slate-800" : "bg-[#111726] border-slate-800/80 text-slate-300"
                      }`}>
                        <div className="space-y-3">
                          <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest block">AI Active route proposal</span>
                          <div className="flex justify-between items-center text-xs">
                            <span className={isLight ? "text-slate-500" : "text-slate-400"}>From / To:</span>
                            <span className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}>My Location ➔ BKC Plaza</span>
                          </div>
                          
                          <div className={`p-3.5 rounded-xl border text-xs transition-colors duration-300 ${
                            isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900"
                          }`}>
                            <span className={`font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>Western Express Highway Link</span>
                            <p className="text-[10px] text-slate-500 mt-1">18.6 km • 32 min • Save 1.4L fuel</p>
                          </div>
                        </div>

                        <button 
                          id="dash-routing-jump"
                          onClick={() => setActiveTab("planner")}
                          className="mt-4 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10"
                        >
                          View Route Details <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Road conditions summary widget */}
                      <div className={`border p-5 rounded-2xl transition-all duration-300 ${
                        isLight ? "bg-white border-gray-200 text-slate-800" : "bg-[#111726] border-slate-800/80 text-slate-300"
                      }`}>
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3.5">Highway Traffic Speeds</span>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                          {ROAD_CONDITIONS.map((r, i) => (
                            <div key={i} className={`flex justify-between items-center text-xs p-2 rounded-lg border transition-colors duration-300 ${
                              isLight ? "bg-slate-50 border-gray-150" : "bg-slate-950/40 border-slate-950"
                            }`}>
                              <span className={`truncate max-w-[120px] font-medium ${isLight ? "text-slate-700" : "text-slate-400"}`}>{r.road}</span>
                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span className={
                                  r.statusColor === "emerald" ? "text-cyan-500 font-bold" :
                                  r.statusColor === "rose" ? "text-rose-500 font-bold" : "text-amber-500 font-bold"
                                }>{r.speed}</span>
                                <span className="text-slate-500">({r.condition})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Large map area in dashboard */}
                    <div className="h-[480px]">
                      <MapContainer 
                        emergencyVehicles={emergencyVehicles}
                        parkingSpots={parkingSpots}
                        incidents={incidents}
                        transitVehicles={transitVehicles}
                        activeRoutePath={mapRoute}
                        selectedSpotId={selectedSpotId}
                        onSelectSpot={(id) => {
                          setSelectedSpotId(id);
                          setActiveTab("parking");
                        }}
                      />
                    </div>

                    {/* Sub-bays selector cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      {/* Smart Parking slot counter */}
                      <button 
                        id="dash-jump-parking"
                        onClick={() => setActiveTab("parking")}
                        className={`border p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                          isLight 
                            ? "bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50/20 text-slate-800" 
                            : "bg-[#111726] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center text-cyan-500 mb-1.5">
                          <SquareParking className="w-5 h-5" />
                          <span className="text-[9px] font-mono font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/10">120+ Spots</span>
                        </div>
                        <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Smart Parking</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Reserve empty bays</p>
                      </button>

                      {/* Metro tracking */}
                      <button 
                        id="dash-jump-transit"
                        onClick={() => setActiveTab("transit")}
                        className={`border p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                          isLight 
                            ? "bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50/20 text-slate-800" 
                            : "bg-[#111726] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center text-amber-500 mb-1.5">
                          <TrainFront className="w-5 h-5" />
                          <span className="text-[9px] font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10">Metros On Time</span>
                        </div>
                        <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>Public Transit</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Live bus/metro status</p>
                      </button>

                      {/* Ride Sharing EV priority */}
                      <button 
                        id="dash-jump-profile"
                        onClick={() => setActiveTab("profile")}
                        className={`border p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                          isLight 
                            ? "bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50/20 text-slate-800" 
                            : "bg-[#111726] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center text-teal-500 mb-1.5">
                          <Car className="w-5 h-5" />
                          <span className="text-[9px] font-mono font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/10">Active EV</span>
                        </div>
                        <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>EV Telemetry</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Route preference terminal</p>
                      </button>

                      {/* AI Assistant */}
                      <button 
                        id="dash-jump-chat"
                        onClick={() => setActiveTab("chat")}
                        className={`border p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                          isLight 
                            ? "bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50/20 text-slate-800" 
                            : "bg-[#111726] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center text-cyan-500 mb-1.5">
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-[9px] font-mono font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/10">Cop AI Online</span>
                        </div>
                        <h4 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>AI Assistant</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Hands-free voice help</p>
                      </button>

                    </div>

                  </div>

                  {/* Right Column Content - Live AI Insights & Incidents */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Live AI insights feed */}
                    <div className={`border p-5 rounded-2xl space-y-4 shadow-xl transition-all duration-300 ${
                      isLight ? "bg-white border-gray-200" : "bg-[#111726] border-slate-800/80"
                    }`}>
                      <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-cyan-500 animate-pulse" />
                        AI Traffic Cop Insights
                      </h4>

                      <div className="space-y-3">
                        {aiInsights.map((insight, idx) => (
                          <div key={idx} className={`p-3.5 rounded-xl border text-xs space-y-1 transition-colors duration-300 ${
                            isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900/60"
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className={`font-bold ${isLight ? "text-slate-900" : "text-white"}`}>{insight.title}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border uppercase ${
                                insight.type === "alert" ? "bg-amber-500/10 text-amber-500 border-amber-500/15" :
                                insight.type === "eco" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/15" :
                                "bg-blue-500/10 text-blue-500 border-blue-500/15"
                              }`}>
                                {insight.type}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>{insight.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Incident notifications timeline list */}
                    <div className={`border p-5 rounded-2xl space-y-4 shadow-xl transition-all duration-300 ${
                      isLight ? "bg-white border-gray-200" : "bg-[#111726] border-slate-800/80"
                    }`}>
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                          Recent Incidents Timeline
                        </h4>
                        <button 
                          id="dash-incidents-jump"
                          onClick={() => setActiveTab("safety")}
                          className="text-[10px] text-cyan-500 hover:underline font-bold cursor-pointer"
                        >
                          Report Hazard
                        </button>
                      </div>

                      <div className="space-y-3">
                        {incidents.slice(0, 3).map((inc) => (
                          <div key={inc.id} className={`p-3.5 rounded-xl border text-xs transition-colors duration-300 ${
                            isLight ? "bg-slate-50 border-gray-200" : "bg-slate-950 border-slate-900"
                          }`}>
                            <div className="flex justify-between items-start">
                              <span className={`font-bold truncate max-w-[150px] ${isLight ? "text-slate-900" : "text-white"}`}>{inc.type}</span>
                              <span className="text-[9px] font-mono text-slate-500 font-semibold">{inc.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 font-mono font-bold uppercase">{inc.location}</p>
                            <p className={`text-[11px] mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{inc.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              ) : (
                /* Layout wrapper for other tabs */
                <div className="space-y-6">
                  {activeTab === "planner" && (
                    <RoutePlanner 
                      currentUser={currentUser}
                      onUpdateUser={setCurrentUser}
                      onSetMapRoute={setMapRoute}
                    />
                  )}
                  {activeTab === "parking" && (
                    <ParkingView 
                      currentUser={currentUser}
                      selectedSpotId={selectedSpotId}
                      onSelectSpot={setSelectedSpotId}
                    />
                  )}
                  {activeTab === "transit" && (
                    <TransitView />
                  )}
                  {activeTab === "emergency" && (
                    <EmergencyView 
                      onSetMapRoute={setMapRoute}
                    />
                  )}
                  {activeTab === "chat" && (
                    <AIAssistant />
                  )}
                  {activeTab === "safety" && (
                    <SafetyCenterView 
                      onAddIncident={handleAddIncident}
                      incidents={incidents}
                    />
                  )}
                  {activeTab === "analytics" && (
                    <AnalyticsView />
                  )}
                  {activeTab === "profile" && (
                    <UserProfileView 
                      currentUser={currentUser}
                      onUpdateUser={setCurrentUser}
                    />
                  )}
                </div>
              )}

            </main>
          </div>

        </div>
      )}

      {/* Authentication Popup Modal */}
      <LoginModal 
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
