import React from "react";
import { 
  LayoutDashboard, 
  Navigation, 
  SquareParking, 
  TrainFront, 
  ShieldAlert, 
  MessageSquare, 
  Shield, 
  BarChart3, 
  User, 
  LogOut, 
  Cpu
} from "lucide-react";
import { User as UserType } from "../types";
import Logo from "./Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  theme?: "dark" | "light";
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout, 
  onOpenLogin,
  theme = "dark"
}: SidebarProps) {
  
  const isLight = theme === "light";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "planner", label: "Route Planner", icon: Navigation },
    { id: "parking", label: "Smart Parking", icon: SquareParking },
    { id: "transit", label: "Public Transport", icon: TrainFront },
    { id: "emergency", label: "Emergency Control", icon: ShieldAlert },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "safety", label: "Safety Center", icon: Shield },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "User Profile", icon: User },
  ];

  return (
    <aside 
      id="app-sidebar" 
      className={`w-64 border-r flex flex-col h-screen shrink-0 transition-all duration-300 ${
        isLight 
          ? "bg-white border-gray-200 text-slate-700" 
          : "bg-[#0B0F19] border-slate-800 text-slate-300"
      }`}
    >
      {/* Brand Header */}
      <div className={`p-5 border-b flex items-center justify-between ${isLight ? "border-gray-150" : "border-slate-900"}`}>
        <Logo className="w-9 h-9" isLight={isLight} withText={true} />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? isLight 
                    ? "bg-cyan-50 border border-cyan-500/25 text-cyan-600 font-semibold"
                    : "bg-slate-900 border border-cyan-500/20 text-white shadow-lg shadow-cyan-500/5 font-semibold" 
                  : isLight
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/50"
              }`}
            >
              <IconComponent className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? "text-cyan-500 scale-105" : "text-slate-500 group-hover:text-slate-300"
              }`} />
              {item.label}
              {item.id === "emergency" && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Status / Bottom Area */}
      <div className={`p-4 border-t ${
        isLight ? "border-gray-100 bg-slate-50" : "border-slate-900 bg-slate-950/80"
      }`}>
        {currentUser ? (
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
            isLight ? "bg-white border-gray-200" : "bg-[#111726] border-slate-900"
          }`}>
            <div className="relative">
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-slate-950"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${isLight ? "text-slate-900" : "text-white"}`}>{currentUser.name}</p>
              <p className="text-[10px] text-cyan-500 truncate font-mono uppercase tracking-wider">{currentUser.role} user</p>
            </div>
            <button 
              id="logout-button"
              onClick={onLogout}
              className="text-slate-500 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/5 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-3">Sign in for saved routes & reserves</p>
            <button
              id="sidebar-login-button"
              onClick={onOpenLogin}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              Access Control Panel
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
