import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  MapPin, 
  Zap, 
  HeartHandshake, 
  TrafficCone,
  ZapOff
} from "lucide-react";
import { EmergencyVehicle } from "../types";

interface EmergencyViewProps {
  onSetMapRoute: (route: { from: string; to: string; pathName?: string; isGreenCorridor?: boolean } | null) => void;
}

export default function EmergencyView({ onSetMapRoute }: EmergencyViewProps) {
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      const response = await fetch("/api/emergency");
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching emergency data:", err);
    }
  };

  const handleToggleCorridor = async (id: string, currentlyActive: boolean) => {
    setLoadingId(id);
    try {
      const response = await fetch("/api/emergency/corridor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: id,
          activate: !currentlyActive,
          routeName: !currentlyActive ? "Sion Circle -> WEH Apex Junction corridor" : ""
        })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh vehicles list
        await fetchEmergencyData();
        
        // Update the centralized Map container route visualizer
        if (!currentlyActive) {
          onSetMapRoute({
            from: "Sion Circle",
            to: "Western Express Highway",
            pathName: "Emergency Corridor Link Cleared",
            isGreenCorridor: true
          });
        } else {
          onSetMapRoute(null);
        }
      }
    } catch (err) {
      console.error("Error toggling emergency corridor:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Responders Grid */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                Active Incident Responders
              </h3>
              <p className="text-xs text-slate-400 mt-1">Real-time status of first responders and municipal corridor clearance.</p>
            </div>
            
            <div className="bg-rose-950/40 border border-rose-500/20 text-rose-400 font-mono text-[9px] px-2 py-1 rounded flex items-center gap-1.5 font-bold uppercase animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              Radio Link Active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => {
              const hasCorridor = v.greenCorridor;
              return (
                <div 
                  key={v.id} 
                  className={`bg-slate-950 p-5 rounded-2xl border transition-all relative overflow-hidden ${
                    hasCorridor ? "border-emerald-500/30 shadow-lg shadow-emerald-500/5" : "border-slate-900"
                  }`}
                >
                  {/* Flashing neon indicator */}
                  {hasCorridor && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 animate-pulse"></div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                        {v.type} • ID {v.id}
                      </span>
                      <h4 className="text-sm font-extrabold text-white">{v.vehicleNo}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border uppercase ${
                      hasCorridor 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : v.status.includes("Responding") 
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                          : "bg-slate-900 text-slate-500 border-slate-800"
                    }`}>
                      {hasCorridor ? "Green Lane Active" : v.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono border-t border-slate-900 pt-3 text-slate-400">
                    <div>
                      <span className="text-[8px] text-slate-600 block uppercase font-bold">Speed</span>
                      <span className="text-white font-bold">{v.speed}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-600 block uppercase font-bold">Driver</span>
                      <span className="text-white font-bold">{v.driver}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[8px] text-slate-600 block uppercase font-bold">Transit Route</span>
                      <span className="text-white font-medium truncate block">
                        {v.source} ➔ {v.destination}
                      </span>
                    </div>
                  </div>

                  {/* Green Corridor Control button */}
                  <div className="mt-5 pt-4 border-t border-slate-900/50">
                    <button
                      id={`corridor-toggle-btn-${v.id}`}
                      onClick={() => handleToggleCorridor(v.id, hasCorridor)}
                      disabled={loadingId === v.id || v.status === "Standby"}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        v.status === "Standby" 
                          ? "bg-slate-900 border-slate-950 text-slate-600 cursor-not-allowed" 
                          : hasCorridor 
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20" 
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10"
                      }`}
                    >
                      {loadingId === v.id ? (
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : hasCorridor ? (
                        <>
                          <ZapOff className="w-3.5 h-3.5" />
                          Deactivate Green Corridor
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Activate Green Corridor
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Corridor HUD and Rules */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold">Municipal Corridor Protocols</h4>
          <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 flex gap-2.5 items-start">
              <span className="text-lg">🚥</span>
              <p>Activating a **Green Corridor** automatically forces next-generation municipal signal relays to steady green, clearing cross traffic 90 seconds prior to responder arrival.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 flex gap-2.5 items-start">
              <span className="text-lg">📢</span>
              <p>Commuters navigating on parallel routes are automatically pushed push-notifications via GPS to clear the primary responding lanes.</p>
            </div>
          </div>
        </div>

        {/* Live status feed */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-2">
          <HeartHandshake className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">Automated Safety First</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">By prioritizing ambulance crossing at BKC connecting roads, the Smart AI system has successfully reduced first responder transit delay times by an average of 42%.</p>
        </div>
      </div>

    </div>
  );
}
