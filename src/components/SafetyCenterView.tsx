import React, { useState, useEffect } from "react";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  Plus, 
  Activity, 
  CheckCircle2
} from "lucide-react";
import { TrafficIncident } from "../types";

interface SafetyCenterViewProps {
  onAddIncident: (inc: TrafficIncident) => void;
  incidents: TrafficIncident[];
}

export default function SafetyCenterView({ onAddIncident, incidents }: SafetyCenterViewProps) {
  const [reportType, setReportType] = useState("Accident");
  const [location, setLocation] = useState("Western Express Hwy (Andheri)");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState<"Low" | "Moderate" | "High">("Moderate");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emergencyContacts = [
    { title: "Smart City Grid Control Room", number: "022-26568000" },
    { title: "Mumbai Road Accident Lifeline", number: "108" },
    { title: "Mumbai Traffic Police Helpline", number: "8454999999" },
    { title: "Disaster Management Cell", number: "1916" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !location.trim()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reportType,
          location,
          description: desc,
          severity
        })
      });

      const data = await response.json();
      if (data.success) {
        onAddIncident(data.incident);
        setDesc("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error submitting incident report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Incident reporting form */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Report Active Hazard
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Hazard Category</label>
              <select
                id="report-hazard-type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option>Accident</option>
                <option>Waterlogging</option>
                <option>Road Construction</option>
                <option>Signal Malfunction</option>
                <option>Double Parking Obstruction</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Grid Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input 
                  id="report-hazard-location"
                  type="text"
                  required
                  placeholder="e.g. Western Express Hwy (Andheri)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Severity selection */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Severity Score</label>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] font-bold">
                {["Low", "Moderate", "High"].map((sev) => (
                  <button
                    key={sev}
                    id={`sev-select-${sev}`}
                    type="button"
                    onClick={() => setSeverity(sev as any)}
                    className={`py-2 rounded-xl border transition-all cursor-pointer ${
                      severity === sev 
                        ? sev === "High" 
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-400" 
                          : sev === "Moderate"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Description Details</label>
              <textarea 
                id="report-hazard-description"
                rows={3}
                required
                placeholder="e.g. Left lane blocked completely due to collision. Slow traffic starting to build up."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            {success && (
              <div id="safety-report-success" className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <p className="font-medium">Hazard registered successfully on live radar grid!</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="submit-hazard-report-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {loading ? "Broadcasting Hazard..." : "Broadcast Incident Report"}
            </button>
          </form>
        </div>

        {/* Emergency Hotlines list */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold">Emergency Hotline Contacts</h4>
          <div className="space-y-2 text-xs font-mono">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400 font-sans font-bold">{contact.title}</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {contact.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live incidents stream timeline */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-emerald-400" />
                Live Incident Broadcast Stream
              </h3>
              <p className="text-xs text-slate-400 mt-1">Active municipal road alerts and commuter safety logs.</p>
            </div>
            
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 bg-slate-950 rounded-xl border border-slate-900 flex gap-4 items-start">
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  inc.severity === "High" ? "bg-rose-500/10 text-rose-400" :
                  inc.severity === "Moderate" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                }`}>
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                      inc.severity === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/10" :
                      inc.severity === "Moderate" ? "bg-amber-500/10 text-amber-400 border-amber-500/10" : "bg-blue-500/10 text-blue-400 border-blue-500/10"
                    }`}>
                      {inc.severity} Severity
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {inc.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5 font-mono">{inc.type} - {inc.location}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{inc.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
