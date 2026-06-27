import React, { useState, useEffect } from "react";
import { MAP_NODES, MAP_LINKS } from "../data";
import { 
  ShieldAlert, 
  SquareParking, 
  Bus, 
  MapPin, 
  AlertTriangle, 
  Zap, 
  Activity, 
  TrendingUp, 
  Navigation
} from "lucide-react";
import { EmergencyVehicle, ParkingSpot, TrafficIncident, TransitVehicle } from "../types";

interface MapContainerProps {
  emergencyVehicles: EmergencyVehicle[];
  parkingSpots: ParkingSpot[];
  incidents: TrafficIncident[];
  transitVehicles: TransitVehicle[];
  activeRoutePath?: { from: string; to: string; pathName?: string; isGreenCorridor?: boolean } | null;
  selectedSpotId?: string;
  onSelectSpot?: (id: string) => void;
}

export default function MapContainer({
  emergencyVehicles,
  parkingSpots,
  incidents,
  transitVehicles,
  activeRoutePath,
  selectedSpotId,
  onSelectSpot
}: MapContainerProps) {
  const [hoveredItem, setHoveredItem] = useState<{ type: string; name: string; info: string } | null>(null);
  const [pulseTime, setPulseTime] = useState(0);

  // Simulate subtle moving of transit vehicles for interactive feel
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTime((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Map coordinates configuration
  const width = 600;
  const height = 550;

  // Let's render custom elements
  return (
    <div id="traffic-control-map" className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 h-full flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Map Header with controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 pointer-events-auto">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white">Live Grid Radar</span>
        </div>
        {activeRoutePath && (
          <div className="bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-2 pointer-events-auto">
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
            <span className="text-[10px] font-mono font-medium text-emerald-300">
              {activeRoutePath.isGreenCorridor ? "Green Corridor Active" : "Route Highlighted"}
            </span>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 text-[10px] bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-slate-400 pointer-events-auto max-w-[150px]">
        <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1 mb-1 font-mono text-[9px] uppercase tracking-wider">Legend</div>
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Free Flow</div>
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span> Moderate</div>
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span> Heavy grid</div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-rose-500 text-white flex items-center justify-center text-[6px] rounded font-bold">⚠️</span> Incident</div>
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-emerald-600 rounded-full flex items-center justify-center text-[6px] text-white">⚡</span> Active Green Link</div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative w-full h-[380px] md:h-[420px] flex items-center justify-center select-none mt-6">
        <svg 
          viewBox="0 0 400 750" 
          className="w-full h-full max-w-[420px] filter drop-shadow-[0_0_15px_rgba(16,185,129,0.03)]"
          style={{ background: "transparent" }}
        >
          {/* Grid Background Patterns */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(51, 65, 85, 0.08)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Draw Roads/Links */}
          {MAP_LINKS.map((link, i) => {
            const sNode = MAP_NODES.find(n => n.id === link.source);
            const tNode = MAP_NODES.find(n => n.id === link.target);
            if (!sNode || !tNode) return null;

            // Determine stroke color
            let strokeColor = "stroke-emerald-500/20";
            let strokeWidth = 2.5;
            let strokeDash = "";

            if (link.traffic === "moderate") {
              strokeColor = "stroke-amber-500/40";
              strokeWidth = 3;
            } else if (link.traffic === "heavy") {
              strokeColor = "stroke-rose-600/50";
              strokeWidth = 4;
            }

            // Green Corridor route override
            const isEmergencyGreenCorridor = emergencyVehicles.some(ev => ev.greenCorridor && ev.activeRoute !== "");
            if (isEmergencyGreenCorridor && link.special === "sea-link") {
              strokeColor = "stroke-emerald-400 animate-[dash_2s_linear_infinite]";
              strokeWidth = 5;
              strokeDash = "8,4";
            } else if (activeRoutePath) {
              // Highlight selected route planning link
              const routeKey = `${sNode.name.toLowerCase()}-${tNode.name.toLowerCase()}`;
              const inverseRouteKey = `${tNode.name.toLowerCase()}-${sNode.name.toLowerCase()}`;
              const activeString = `${activeRoutePath.from.toLowerCase()}-${activeRoutePath.to.toLowerCase()}`;
              
              // Simulate route path mapping matches
              if (activeString.includes(sNode.name.toLowerCase()) && activeString.includes(tNode.name.toLowerCase())) {
                strokeColor = activeRoutePath.isGreenCorridor ? "stroke-emerald-400" : "stroke-blue-400";
                strokeWidth = 5;
                strokeDash = activeRoutePath.isGreenCorridor ? "4,4" : "";
              }
            }

            return (
              <g key={`link-${i}`}>
                {/* Glow layer */}
                <line 
                  x1={sNode.x} 
                  y1={sNode.y} 
                  x2={tNode.x} 
                  y2={tNode.y} 
                  className={`${strokeColor} opacity-20`}
                  strokeWidth={strokeWidth * 3}
                  strokeLinecap="round"
                />
                <line 
                  x1={sNode.x} 
                  y1={sNode.y} 
                  x2={tNode.x} 
                  y2={tNode.y} 
                  className={`transition-all duration-500 ${strokeColor}`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Draw Base Nodes / Intersections */}
          {MAP_NODES.map((node) => {
            let color = "bg-slate-800 border-slate-700";
            if (node.traffic === "heavy") color = "bg-rose-500 shadow-rose-500/50";
            else if (node.traffic === "moderate") color = "bg-amber-500 shadow-amber-500/50";
            else color = "bg-emerald-500 shadow-emerald-500/50";

            return (
              <g key={node.id} className="cursor-pointer group">
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="12" 
                  className="fill-slate-900 stroke-slate-800 opacity-60 hover:opacity-100 transition-opacity"
                  onMouseEnter={() => setHoveredItem({ type: "Intersection", name: node.name, info: `Traffic Capacity: ${node.traffic.toUpperCase()}` })}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r="4" 
                  className={`fill-current ${node.traffic === "heavy" ? "text-rose-500" : node.traffic === "moderate" ? "text-amber-500" : "text-emerald-500"}`}
                />
                <text 
                  x={node.x + 8} 
                  y={node.y + 4} 
                  className="fill-slate-400 font-mono text-[9px] font-medium tracking-tight pointer-events-none select-none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}

          {/* Draw Interactive Active Overlays (Buses/Metro/Parking/Ambulances) */}
          
          {/* 1. Smart Parking Overlays */}
          {parkingSpots.map((spot, index) => {
            // Projecting them safely inside map grid coordinate range
            const seedX = [260, 220, 240, 180][index % 4];
            const seedY = [420, 600, 700, 300][index % 4];
            const isSelected = selectedSpotId === spot.id;

            return (
              <g 
                key={`spot-${spot.id}`} 
                className="cursor-pointer group"
                onClick={() => onSelectSpot && onSelectSpot(spot.id)}
                onMouseEnter={() => setHoveredItem({ type: "Smart Parking Lot", name: spot.name, info: `${spot.available}/${spot.total} slots free at ${spot.rate}` })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <circle 
                  cx={seedX} 
                  cy={seedY - 12} 
                  r={isSelected ? "14" : "11"} 
                  className={`transition-all duration-300 fill-slate-950 stroke-2 ${
                    isSelected ? "stroke-blue-400 shadow-blue-500/50 fill-blue-950/20" : "stroke-blue-500/60"
                  }`}
                />
                <text 
                  x={seedX - 4} 
                  y={seedY - 9} 
                  className={`font-sans font-bold text-[8px] fill-current ${isSelected ? "text-blue-300" : "text-blue-400"}`}
                >
                  P
                </text>
                {/* Available pulse beacon */}
                {spot.available > 10 && (
                  <circle 
                    cx={seedX} 
                    cy={seedY - 12} 
                    r={(pulseTime / 6) + 11} 
                    className="stroke-blue-400/20 fill-none pointer-events-none"
                    strokeWidth="0.5"
                  />
                )}
              </g>
            );
          })}

          {/* 2. Public Transit Bus Icons */}
          {transitVehicles.map((bus, index) => {
            const seedX = [120, 180, 280][index % 3];
            const seedY = [140, 320, 485][index % 3];

            return (
              <g 
                key={`bus-${bus.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem({ type: "Transit Bus", name: `BEST ${bus.route}`, info: `${bus.from} ➔ ${bus.to} | Delay: ${bus.delay} (${bus.status})` })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <circle 
                  cx={seedX + 15} 
                  cy={seedY - 20} 
                  r="9" 
                  className="fill-amber-950 stroke-amber-500/50 stroke-1"
                />
                <text 
                  x={seedX + 11} 
                  y={seedY - 17} 
                  className="font-sans text-[7px] fill-amber-400 font-bold"
                >
                  🚌
                </text>
              </g>
            );
          })}

          {/* 3. Incidents alerts */}
          {incidents.map((inc, index) => {
            const seedX = [140, 200, 270][index % 3];
            const seedY = [210, 410, 500][index % 3];

            return (
              <g 
                key={`inc-${inc.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem({ type: "Hazard Blockage", name: inc.type, info: `${inc.location} (${inc.time}) - ${inc.severity} Severity` })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <circle 
                  cx={seedX - 15} 
                  cy={seedY + 15} 
                  r="10" 
                  className="fill-rose-950 stroke-rose-600 animate-pulse"
                />
                <text 
                  x={seedX - 19} 
                  y={seedY + 19} 
                  className="font-sans text-[8px] fill-white font-bold"
                >
                  ⚠️
                </text>
              </g>
            );
          })}

          {/* 4. Pulse beacon for Emergency response vehicles */}
          {emergencyVehicles.map((ev, index) => {
            if (ev.status === "Standby") return null;
            const seedX = [230, 210][index % 2];
            const seedY = [440, 510][index % 2];

            return (
              <g 
                key={`ev-${ev.id}`} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredItem({ type: `Active ${ev.type}`, name: ev.vehicleNo, info: `Driver: ${ev.driver} | Speed: ${ev.speed} (${ev.status})` })}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Glowing neon red-blue responder circle */}
                <circle 
                  cx={seedX} 
                  cy={seedY} 
                  r="15" 
                  className={`fill-rose-950/40 stroke-2 ${ev.greenCorridor ? "stroke-emerald-400" : "stroke-rose-500"}`}
                />
                <circle 
                  cx={seedX} 
                  cy={seedY} 
                  r={(pulseTime / 4) + 14} 
                  className={`fill-none stroke-1 pointer-events-none ${ev.greenCorridor ? "stroke-emerald-400/20" : "stroke-rose-500/20"}`}
                />
                <text 
                  x={seedX - 7} 
                  y={seedY + 4} 
                  className="font-sans text-[11px] animate-[bounce_1s_infinite]"
                >
                  {ev.type === "Ambulance" ? "🚑" : "🚨"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Card Detail HUD */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl min-h-[75px] flex items-center transition-all duration-300">
        {hoveredItem ? (
          <div className="w-full flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${
              hoveredItem.type.includes("Emergency") ? "bg-rose-500/10 text-rose-400" :
              hoveredItem.type.includes("Parking") ? "bg-blue-500/10 text-blue-400" :
              hoveredItem.type.includes("Transit") ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
            }`}>
              {hoveredItem.type.includes("Emergency") ? <ShieldAlert className="w-4 h-4 animate-bounce" /> :
               hoveredItem.type.includes("Parking") ? <SquareParking className="w-4 h-4" /> :
               hoveredItem.type.includes("Transit") ? <Bus className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500 block">
                {hoveredItem.type}
              </span>
              <h4 className="text-xs font-bold text-white truncate">{hoveredItem.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">{hoveredItem.info}</p>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              Hover over map radar signals for real-time telemetry HUD
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
