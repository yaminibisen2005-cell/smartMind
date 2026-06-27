import React, { useState, useEffect } from "react";
import { 
  TrainFront, 
  Bus, 
  MapPin, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Navigation,
  ArrowRight
} from "lucide-react";
import { TransitVehicle } from "../types";

export default function TransitView() {
  const [buses, setBuses] = useState<TransitVehicle[]>([]);
  const [metro, setMetro] = useState<TransitVehicle[]>([]);
  const [activeSegment, setActiveSegment] = useState<"bus" | "metro">("metro");

  useEffect(() => {
    fetchTransitData();
  }, []);

  const fetchTransitData = async () => {
    try {
      const response = await fetch("/api/transit");
      const data = await response.json();
      setBuses(data.buses);
      setMetro(data.metro);
    } catch (err) {
      console.error("Error fetching transit schedules:", err);
    }
  };

  const nearbyHubs = [
    { name: "Andheri Metro Interchange Terminal", lines: ["Line 1", "Line 2A", "BEST Bus 12C"], distance: "150m away" },
    { name: "BKC Commercial Transit Hub", lines: ["BEST Express AS-440", "Sion Feeder Bus"], distance: "400m away" },
    { name: "Ghatkopar Central Station Link", lines: ["Metro Line 1", "Central Line Railways"], distance: "900m away" }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Live Schedules */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <TrainFront className="w-4.5 h-4.5 text-amber-400" />
                Live Transit Schedules
              </h3>
              <p className="text-xs text-slate-400 mt-1">Real-time arrival prediction grids for public transit networks.</p>
            </div>

            {/* Selector Segment */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                id="transit-segment-metro"
                onClick={() => setActiveSegment("metro")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSegment === "metro" 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/10 font-bold" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <TrainFront className="w-3.5 h-3.5" />
                Metro Lines
              </button>
              <button
                id="transit-segment-bus"
                onClick={() => setActiveSegment("bus")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSegment === "bus" 
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/10 font-bold" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                BEST Buses
              </button>
            </div>
          </div>

          {/* Sched table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                  <th className="py-2.5 pb-3">Line/Route</th>
                  <th className="py-2.5 pb-3">Destination Link</th>
                  <th className="py-2.5 pb-3">Speed</th>
                  <th className="py-2.5 pb-3">Status</th>
                  <th className="py-2.5 pb-3 text-right">Estimated ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {activeSegment === "metro" ? (
                  metro.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/20">
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        {m.line}
                      </td>
                      <td className="py-3.5 text-slate-300">
                        <span className="font-medium text-white">{m.route}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">Next stop: {m.nextStation}</span>
                      </td>
                      <td className="py-3.5 font-mono text-slate-400">{m.speed}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                          m.delay === "0 min" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {m.delay === "0 min" ? "ON TIME" : `DELAYED ${m.delay}`}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-emerald-400 animate-pulse">{m.eta}</td>
                    </tr>
                  ))
                ) : (
                  buses.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/20">
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        ROUTE {b.route}
                      </td>
                      <td className="py-3.5 text-slate-300">
                        <span className="font-medium text-white">{b.from} ➔ {b.to}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">Next stop: {b.nextStop}</span>
                      </td>
                      <td className="py-3.5 font-mono text-slate-400">{b.speed}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                          b.delay === "0 min" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {b.delay === "0 min" ? "ON TIME" : `DELAYED ${b.delay}`}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-emerald-400 animate-pulse">{b.eta}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Transit Map / Nearby stations HUD */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold">Nearby Boarding Station Hubs</h4>
          <div className="space-y-3.5">
            {nearbyHubs.map((hub, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {hub.name}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {hub.lines.map((line, lIdx) => (
                      <span key={lIdx} className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded text-[8px] font-mono border border-slate-800">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 shrink-0">{hub.distance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tips Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">AI Smart Transit Recommendation</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Metros are running at 98% efficiency with absolutely zero signal delays. Commuters travelling from Borivali to BKC can save up to <strong>₹120</strong> and <strong>24 minutes</strong> by switching to Metro Line 7 instead of private gasoline transport.
          </p>
        </div>
      </div>

    </div>
  );
}
