import React, { useState } from "react";
import { User } from "../types";
import { 
  User as UserIcon, 
  Settings as SettingsIcon, 
  Trash2 as TrashIcon, 
  Bell as BellIcon, 
  ShieldAlert as ShieldAlertIcon, 
  Car as CarIcon, 
  MapPin as MapPinIcon,
  CheckCircle as CheckIcon,
  Clock as ClockIcon,
  Navigation as NavigationIcon,
  BookmarkCheck
} from "lucide-react";
import { User as UserType } from "../types";

interface UserProfileViewProps {
  currentUser: UserType | null;
  onUpdateUser: (user: UserType) => void;
}

export default function UserProfileView({ currentUser, onUpdateUser }: UserProfileViewProps) {
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [city, setCity] = useState(currentUser?.city || "Mumbai");
  const [plate, setPlate] = useState(currentUser?.vehicle_number || "");
  const [vehicleType, setVehicleType] = useState(currentUser?.vehicle_type || "Four-Wheeler (EV)");
  
  // Preferences state
  const [notify, setNotify] = useState(currentUser?.preferences?.notifications ?? true);
  const [ecoFriendly, setEcoFriendly] = useState(currentUser?.preferences?.eco_friendly ?? true);
  const [avoidTolls, setAvoidTolls] = useState(currentUser?.preferences?.avoid_tolls ?? false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/50 p-12 rounded-2xl text-center flex flex-col items-center justify-center space-y-4">
        <UserIcon className="w-12 h-12 text-slate-700 animate-pulse" />
        <h4 className="text-base font-bold text-slate-400 uppercase tracking-wider font-mono">Profile Terminal Locked</h4>
        <p className="text-xs text-slate-500 max-w-sm">Please click **Connect Identity** at the top right to access profile statistics, saved routes, and preference terminals.</p>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentUser.id,
          phone,
          city,
          vehicle_number: plate,
          vehicle_type: vehicleType,
          preferences: {
            notifications: notify,
            eco_friendly: ecoFriendly,
            avoid_tolls: avoidTolls
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      onUpdateUser(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    try {
      const response = await fetch("/api/auth/delete-route", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          routeId
        })
      });

      const data = await response.json();
      if (data.success) {
        onUpdateUser({
          ...currentUser,
          saved_routes: data.saved_routes
        });
      }
    } catch (err) {
      console.error("Error deleting route choice:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* Edit Profile Form */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <SettingsIcon className="w-4.5 h-4.5 text-emerald-400" />
                Profile Customization Terminal
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure your personal commuter plate credentials and vehicle telemetry.</p>
            </div>
            
            <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase">
              NODE ID {currentUser.id}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Full Name</label>
                <input 
                  type="text" 
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={currentUser.email}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Phone Connection</label>
                <input 
                  id="profile-phone"
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">City Grid</label>
                <input 
                  id="profile-city"
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Vehicle Profile</label>
                <select
                  id="profile-vehicle-type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                  <option>Four-Wheeler (EV)</option>
                  <option>Four-Wheeler (Gas)</option>
                  <option>Two-Wheeler</option>
                  <option>Commercial Truck</option>
                  <option>None (Pedestrian)</option>
                </select>
              </div>

              {/* Plate */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Plate Number</label>
                <div className="relative">
                  <CarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    id="profile-plate"
                    type="text" 
                    placeholder="MH-02-EE-2026"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Notification settings checkboxes */}
            <div className="border-t border-slate-800 pt-5 mt-4 space-y-3.5">
              <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">commute telemetry options</h4>
              
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-950 p-3 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors">
                  <input 
                    id="notify-alert-checkbox"
                    type="checkbox" 
                    checked={notify}
                    onChange={(e) => setNotify(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs text-white font-bold block">Active Hazard Broadcast Alerts</span>
                    <span className="text-[10px] text-slate-500">Enable high priority warnings for severe weather, accidents, and road blocks.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-950 p-3 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors">
                  <input 
                    id="eco-routing-checkbox"
                    type="checkbox" 
                    checked={ecoFriendly}
                    onChange={(e) => setEcoFriendly(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs text-white font-bold block">Prefer Eco Routing Choices</span>
                    <span className="text-[10px] text-slate-500">Route via EV priority lanes and minimize idle stop times.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-950 p-3 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors">
                  <input 
                    id="avoid-tolls-checkbox"
                    type="checkbox" 
                    checked={avoidTolls}
                    onChange={(e) => setAvoidTolls(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs text-white font-bold block">Avoid Municipal Toll Intersections</span>
                    <span className="text-[10px] text-slate-500">Avoid Bandra Sea-Link tolls if congestion delays do not exceed 10 minutes.</span>
                  </div>
                </label>
              </div>
            </div>

            {success && (
              <div id="profile-success-banner" className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2.5">
                <CheckIcon className="w-4 h-4" />
                <p className="font-medium">Profile parameters synchronized successfully!</p>
              </div>
            )}

            <button
              id="save-profile-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {loading ? "Synchronizing Profile..." : "Update Profile Terminal"}
            </button>
          </form>
        </div>
      </div>

      {/* Saved Routes & Quick History */}
      <div className="xl:col-span-5 space-y-6">
        {/* Saved Routes */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            Your Saved Transit Routes
          </h4>
          
          <div className="space-y-2">
            {currentUser.saved_routes && currentUser.saved_routes.length > 0 ? (
              currentUser.saved_routes.map((saved) => (
                <div 
                  key={saved.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-bold text-white truncate max-w-[150px]">{saved.from} ➔ {saved.to}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5 uppercase">{saved.mode} MODE • {saved.distance} • {saved.time}</p>
                  </div>
                  
                  <button
                    id={`delete-saved-route-${saved.id}`}
                    onClick={() => handleDeleteRoute(saved.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
                    title="Remove Route"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No saved routes on file yet. Design a route in the Route Planner and click bookmark to save!</p>
            )}
          </div>
        </div>

        {/* Emergency Contacts card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3.5 font-bold flex items-center gap-1.5 text-rose-400">
            <ShieldAlertIcon className="w-4 h-4 text-rose-500 animate-pulse" />
            Emergency Contacts Terminal
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
              <span className="text-slate-400 font-sans">Primary Emergency SMS Contact</span>
              <span className="text-white font-bold">+91 99999 11111</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
              <span className="text-slate-400 font-sans">Auto Incident SMS Broadcast</span>
              <span className="text-emerald-400 font-bold font-mono">ENABLED</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
