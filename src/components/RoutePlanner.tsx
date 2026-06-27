import React, { useState } from "react";
import { 
  Navigation, 
  MapPin, 
  ArrowRight, 
  Leaf, 
  Fuel, 
  Clock, 
  Car, 
  Bus, 
  Train, 
  Footprints, 
  Bike,
  Sparkles,
  BookmarkPlus,
  BookmarkCheck
} from "lucide-react";
import { RouteProposal, User as UserType } from "../types";

interface RoutePlannerProps {
  currentUser: UserType | null;
  onUpdateUser: (user: UserType) => void;
  onSetMapRoute: (route: { from: string; to: string; pathName?: string; isGreenCorridor?: boolean } | null) => void;
}

export default function RoutePlanner({ currentUser, onUpdateUser, onSetMapRoute }: RoutePlannerProps) {
  const [source, setSource] = useState("Borivali Station");
  const [destination, setDestination] = useState("Bandra Kurla Complex");
  const [mode, setMode] = useState("car");
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteProposal | null>({
    recommendedRoute: "Western Express Highway ➔ BKC Connector (Flyover Lanes)",
    alternateRoute: "S.V. Road ➔ Link Road (Coastal bypass)",
    timeMinutes: 32,
    distanceKm: 18.6,
    trafficLevel: "Moderate",
    fuelSavingLitres: 1.4,
    carbonEmissionKg: 2.1,
    explanation: "Taking the elevated highway avoids waterlogged signals on S.V. Road, reducing carbon footprint by 2.1kg and optimizing fuel usage."
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;

    setLoading(true);
    setIsSaved(false);
    try {
      const response = await fetch("/api/gemini/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination, mode })
      });
      const data = await response.json();
      setRouteResult(data);
      
      // Update the Map highlight route
      onSetMapRoute({
        from: source,
        to: destination,
        pathName: data.recommendedRoute,
        isGreenCorridor: false
      });
    } catch (err) {
      console.error("Error fetching AI route:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!currentUser || !routeResult) return;

    try {
      const response = await fetch("/api/auth/save-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          route: {
            from: source,
            to: destination,
            mode,
            distance: `${routeResult.distanceKm} km`,
            time: `${routeResult.timeMinutes} min`
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        onUpdateUser({
          ...currentUser,
          saved_routes: data.saved_routes
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  const travelModes = [
    { id: "car", label: "Car/Cab", icon: Car },
    { id: "bus", label: "Bus", icon: Bus },
    { id: "metro", label: "Metro", icon: Train },
    { id: "bicycle", label: "Bicycle", icon: Bike },
    { id: "walking", label: "Walk", icon: Footprints }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Route Inputs */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            Route Planner Coordinates
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Source */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Starting Point</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input 
                  id="route-source"
                  type="text"
                  required
                  placeholder="e.g. Borivali Station"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Destination Point</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400 animate-pulse" />
                <input 
                  id="route-destination"
                  type="text"
                  required
                  placeholder="e.g. Bandra Kurla Complex"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Travel Mode Mode</label>
              <div className="grid grid-cols-5 gap-1">
                {travelModes.map((tMode) => {
                  const ModeIcon = tMode.icon;
                  return (
                    <button
                      key={tMode.id}
                      type="button"
                      id={`mode-select-${tMode.id}`}
                      onClick={() => setMode(tMode.id)}
                      className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        mode === tMode.id 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <ModeIcon className="w-4 h-4" />
                      <span className="text-[8px] font-semibold">{tMode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="route-calculate-button"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                  Optimize Route via AI Cop
                </>
              )}
            </button>
          </form>
        </div>

        {currentUser && currentUser.saved_routes && currentUser.saved_routes.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold">Your Saved Quick Routes</h4>
            <div className="space-y-2">
              {currentUser.saved_routes.map((saved, i) => (
                <button
                  key={i}
                  id={`saved-route-quick-${i}`}
                  onClick={() => {
                    setSource(saved.from);
                    setDestination(saved.to);
                    setMode(saved.mode);
                  }}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center text-left hover:border-slate-700 transition-colors cursor-pointer text-xs"
                >
                  <div>
                    <p className="font-bold text-white truncate max-w-[150px]">{saved.from} ➔ {saved.to}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">{saved.mode} mode • {saved.distance}</p>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">{saved.time}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Routing Results */}
      <div className="xl:col-span-7 space-y-6">
        {routeResult ? (
          <div className="space-y-6">
            
            {/* Main recommendation HUD */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-5 md:p-6 border-b border-slate-800 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">AI Recommendation</span>
                  <h4 className="text-base font-extrabold text-white leading-tight">
                    {routeResult.recommendedRoute}
                  </h4>
                </div>
                {currentUser && (
                  <button
                    id="save-route-bookmark"
                    onClick={handleSaveRoute}
                    disabled={isSaved}
                    className={`p-2 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
                      isSaved 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
                  </button>
                )}
              </div>

              {/* Stats Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-slate-800 bg-slate-950/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">Travel Time</span>
                  </div>
                  <p className="text-lg font-extrabold text-white font-mono">{routeResult.timeMinutes} min</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">Distance</span>
                  </div>
                  <p className="text-lg font-extrabold text-white font-mono">{routeResult.distanceKm} km</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">Fuel Savings</span>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-400 font-mono">+{routeResult.fuelSavingLitres} L</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">CO2 Saved</span>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-400 font-mono">-{routeResult.carbonEmissionKg} kg</p>
                </div>
              </div>

              {/* Explain Block */}
              <div className="p-5 md:p-6 space-y-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs leading-relaxed text-slate-300">
                  <p>{routeResult.explanation}</p>
                </div>

                {/* Alternate Route HUD */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                  <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-widest block">Alternate Highway Choice</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white truncate max-w-[200px]">{routeResult.alternateRoute}</span>
                    <span className="text-rose-400 font-mono">+{routeResult.timeMinutes + 12} min delay</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Includes 4 heavy intersections and higher fuel usage. Not recommended.</div>
                </div>
              </div>
            </div>

            {/* Interactive map placeholder mock visual card */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-2">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Live Route Simulation</span>
              <p className="text-xs text-slate-300">The GPS radar is automatically synchronized. Use the <strong>Live Grid Radar</strong> on the left map workspace to monitor vehicular coordinates in real time.</p>
            </div>

          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/50 p-12 rounded-2xl text-center flex flex-col items-center justify-center space-y-3">
            <Navigation className="w-10 h-10 text-slate-700 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">No Active Route Calculation</h4>
            <p className="text-xs text-slate-500 max-w-sm">Enter coordinate terminals and select optimization mode to fetch real-time route grids.</p>
          </div>
        )}
      </div>

    </div>
  );
}
