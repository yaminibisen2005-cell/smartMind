import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Cpu, 
  Train, 
  Clock, 
  SquareParking,
  Leaf
} from "lucide-react";
import { HOURLY_CONGESTION, PEAK_HOUR_CHART, ACCIDENT_REPORTS_STATS } from "../data";

export default function AnalyticsView() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG Congestion Index Dimensions
  const svgWidth = 500;
  const svgHeight = 150;
  const padding = 20;

  // Render simple lines for SVG chart
  const points = HOURLY_CONGESTION.map((data, i) => {
    const x = padding + (i * (svgWidth - (padding * 2)) / (HOURLY_CONGESTION.length - 1));
    const y = svgHeight - padding - (data.score * (svgHeight - (padding * 2)) / 100);
    return { x, y, score: data.score, hour: data.hour, delay: data.delayText };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* 1. Daily Congestion Graph */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
                Live City-Grid Congestion Index
              </h3>
              <p className="text-xs text-slate-400 mt-1">Real-time daily delay timeline for Greater Mumbai arterial corridors.</p>
            </div>
            
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest block">Peak Hour Triggered</span>
              <span className="text-xs text-white font-bold font-mono">09:00 AM - 10:30 AM</span>
            </div>
          </div>

          {/* SVG Custom Line Chart */}
          <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-40">
              {/* Grid lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" />
              <line x1={padding} y1={svgHeight/2} x2={svgWidth - padding} y2={svgHeight/2} stroke="rgba(255,255,255,0.03)" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.08)" />

              {/* Area path */}
              <path d={areaD} fill="rgba(16,185,129,0.04)" />

              {/* Line path */}
              <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

              {/* Data points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoverIndex === i ? "5" : "3"} 
                    className="fill-slate-950 stroke-emerald-400 stroke-2 cursor-pointer transition-all"
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                  {hoverIndex === i && (
                    <line x1={p.x} y1={p.y} x2={p.x} y2={svgHeight - padding} stroke="rgba(16,185,129,0.3)" strokeDasharray="2,2" />
                  )}
                </g>
              ))}

              {/* Labels */}
              <text x={padding} y={svgHeight - 4} fill="#475569" fontSize="6" fontFamily="monospace">06:00 AM</text>
              <text x={svgWidth/2 - 15} y={svgHeight - 4} fill="#475569" fontSize="6" fontFamily="monospace">12:00 PM</text>
              <text x={svgWidth - padding - 35} y={svgHeight - 4} fill="#475569" fontSize="6" fontFamily="monospace">10:00 PM</text>
            </svg>

            {/* Hover tooltip HUD */}
            <div className="mt-3 bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
              {hoverIndex !== null ? (
                <>
                  <span className="text-slate-400">Timestamp: <strong className="text-white">{points[hoverIndex].hour}</strong></span>
                  <span className="text-slate-400">Congestion Score: <strong className="text-rose-400">{points[hoverIndex].score}%</strong></span>
                  <span className="text-emerald-400 font-bold">{points[hoverIndex].delay}</span>
                </>
              ) : (
                <div className="text-slate-500 text-center w-full text-[10px] uppercase tracking-wider">Hover timeline points for grid telemetry details</div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Peak Hour transit Mode Analysis */}
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-4">
            <Train className="w-4.5 h-4.5 text-emerald-400" />
            Commute Efficiency Mode Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 font-mono text-[9px] text-slate-500 uppercase tracking-widest pb-2">
                  <th className="py-2">Transit Mode</th>
                  <th className="py-2">Peak Speed Profile</th>
                  <th className="py-2">Route Reliability</th>
                  <th className="py-2 text-right">CO2 Offsets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {PEAK_HOUR_CHART.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-900/10">
                    <td className="py-3 font-bold text-white">{item.mode}</td>
                    <td className="py-3 font-mono text-slate-400">{item.peakSpeed}</td>
                    <td className="py-3 font-mono font-semibold text-emerald-400">{item.reliability}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">{item.carbonSaving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Right Analytics Cards (Accidents, Parking, CO2) */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Accident break-down */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
            Arterial Accident Cause Factors
          </h4>
          <div className="space-y-2 text-xs">
            {ACCIDENT_REPORTS_STATS.map((stat, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-300 font-bold truncate max-w-[150px]">{stat.cause}</span>
                <span className="font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded text-[10px] border border-rose-500/10">
                  {stat.count} incidents
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Parking Utilization Index */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <SquareParking className="w-4 h-4 text-blue-400" />
            Parking Utilization Index
          </h4>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Avg. Peak Occupancy</span>
            <span className="font-mono text-white font-bold">78% capacity</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }}></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">Level 1 EV Charging spaces experience 92% occupancy turnaround between 09:00 AM and 01:00 PM.</p>
        </div>

        {/* Environmental impact saved */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-2">
          <Leaf className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-white uppercase font-mono">Carbon grid efficiency</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">By optimizing travel lines, allocating Green corridors, and reserving smart park hubs, Greater Mumbai commuters saved a collective **14.2 Metric Tons of CO2 emissions** this month.</p>
        </div>

      </div>

    </div>
  );
}
