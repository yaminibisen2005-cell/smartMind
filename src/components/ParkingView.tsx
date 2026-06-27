import React, { useState, useEffect } from "react";
import { 
  SquareParking, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { ParkingSpot, ParkingReservation, User as UserType } from "../types";

interface ParkingViewProps {
  currentUser: UserType | null;
  selectedSpotId?: string;
  onSelectSpot: (id: string) => void;
}

export default function ParkingView({ currentUser, selectedSpotId, onSelectSpot }: ParkingViewProps) {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [reservations, setReservations] = useState<ParkingReservation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [duration, setDuration] = useState("2 hours");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    try {
      const response = await fetch("/api/parking");
      const data = await response.json();
      setSpots(data.spots);
      setReservations(data.reservations);
      if (data.spots.length > 0 && !selectedSpotId) {
        onSelectSpot(data.spots[0].id);
      }
    } catch (err) {
      console.error("Error fetching parking data:", err);
    }
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpotId) return;

    const activeSpot = spots.find(s => s.id === selectedSpotId);
    if (!activeSpot) return;

    setLoading(true);
    setMessage(null);

    const chosenSlot = selectedSlot || activeSpot.slots[0];

    try {
      const response = await fetch("/api/parking/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id || "guest",
          parkingId: selectedSpotId,
          slot: chosenSlot,
          duration
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to make reservation");
      }

      setMessage({ type: "success", text: `Success! Slot ${chosenSlot} reserved at ${activeSpot.name}.` });
      setSelectedSlot("");
      fetchParkingData();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Reservation failed." });
    } finally {
      setLoading(false);
    }
  };

  const activeSpot = spots.find(s => s.id === selectedSpotId) || spots[0];

  const filteredSpots = spots.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Parking Lots Selection */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <SquareParking className="w-4.5 h-4.5 text-blue-400" />
            Parking Hub Terminal
          </h3>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              id="parking-search"
              type="text"
              placeholder="Search Mumbai Parking Lots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpotId === spot.id;
              const occupancyPct = ((spot.total - spot.available) / spot.total) * 100;
              
              return (
                <button
                  key={spot.id}
                  id={`parking-lot-button-${spot.id}`}
                  onClick={() => onSelectSpot(spot.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-blue-500/10 border-blue-500/30 text-white" 
                      : "bg-slate-950/80 border-slate-900 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{spot.name}</h4>
                    <span className="font-mono text-[10px] font-bold text-blue-400">{spot.rate}</span>
                  </div>
                  
                  {/* Availability badge */}
                  <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono">
                    <span className="text-slate-500">Available Slots:</span>
                    <span className={`font-bold ${spot.available > 15 ? "text-emerald-400" : "text-rose-400"}`}>
                      {spot.available} / {spot.total}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1 mt-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPct > 85 ? "bg-rose-500" : occupancyPct > 60 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Previous History */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold">Your Reservations Log</h4>
          <div className="space-y-2">
            {reservations.length > 0 ? (
              reservations.map((res, i) => {
                const associatedSpot = spots.find(s => s.id === res.parkingId);
                return (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs flex justify-between items-center">
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{associatedSpot?.name || "Smart Spot"}</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">SLOT {res.slot} • {res.duration}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-mono">
                      {res.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center">No active slot bookings on file.</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Slot Layout & Booking Form */}
      <div className="xl:col-span-7 space-y-6">
        {activeSpot ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">Selected Location Layout</span>
              <h3 className="text-base font-extrabold text-white">{activeSpot.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Select an active green bay representing empty spaces equipped with smart EV billing relays.</p>
            </div>

            {/* Parking Slots Layout Map Grid */}
            <div>
              <div className="text-[10px] font-mono text-slate-400 mb-2.5 font-semibold flex items-center justify-between">
                <span>BAY LEVEL 01 MATRIX</span>
                <div className="flex gap-3 text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500/20 border border-emerald-500/30"></span> Vacant</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-950"></span> Occupied</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2.5 p-4 bg-slate-950 rounded-xl border border-slate-900 text-center font-mono">
                {["A-101", "A-102", "A-103", "B-201", "B-202", "B-205", "C-301", "C-302", "C-305", "D-401"].map((slotName) => {
                  const isOccupiedInMock = !activeSpot.slots.includes(slotName);
                  const isSelected = selectedSlot === slotName;
                  
                  return (
                    <button
                      key={slotName}
                      id={`slot-select-${slotName}`}
                      type="button"
                      disabled={isOccupiedInMock}
                      onClick={() => setSelectedSlot(slotName)}
                      className={`py-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isOccupiedInMock 
                          ? "bg-slate-950 border-slate-950 text-slate-700 cursor-not-allowed" 
                          : isSelected 
                            ? "bg-blue-500/20 border-blue-400 text-blue-400 shadow-md shadow-blue-500/10 scale-105 font-black"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50"
                      }`}
                    >
                      {slotName}
                      <span className="block text-[7px] font-medium mt-1 font-sans">
                        {isOccupiedInMock ? "LOCKED" : "FREE"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reservation form */}
            <form onSubmit={handleReserve} className="border-t border-slate-800 pt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Slot Select HUD */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Slot Assignment</label>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="Click grid slot above"
                    value={selectedSlot ? `Bay Spot ${selectedSlot}` : `Click vacant cell above`}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold font-mono focus:outline-none"
                  />
                </div>

                {/* Duration select */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Reservation Duration</label>
                  <select
                    id="parking-duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/50 cursor-pointer font-mono"
                  >
                    <option>1 hour (₹40)</option>
                    <option>2 hours (₹80)</option>
                    <option>4 hours (₹160)</option>
                    <option>12 hours (₹480)</option>
                  </select>
                </div>
              </div>

              {message && (
                <div id="parking-msg-banner" className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  message.type === "success" 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                    : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                }`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              <button
                id="reserve-parking-button"
                type="submit"
                disabled={loading || !selectedSlot}
                className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                {loading ? "Transmitting Reservation..." : selectedSlot ? `Confirm Reservation (Spot ${selectedSlot})` : "Select an available spot above"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/50 p-12 rounded-2xl text-center flex flex-col items-center justify-center space-y-3">
            <SquareParking className="w-10 h-10 text-slate-700 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">No Parking Lot Active</h4>
          </div>
        )}
      </div>

    </div>
  );
}
