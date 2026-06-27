import { TrafficIncident, TransitVehicle, EmergencyVehicle } from "./types";

export const LANDING_FEATURES = [
  {
    id: "f1",
    title: "AI Route Optimization",
    desc: "Predicts lane-by-lane speed differentials using deep neural networks to route you around bottlenecks before they happen.",
    icon: "Navigation",
    color: "emerald"
  },
  {
    id: "f2",
    title: "Active Green Corridors",
    desc: "Dynamically clears upcoming traffic signals for emergency ambulances and fire engines in real time, saving lives.",
    icon: "ShieldAlert",
    color: "rose"
  },
  {
    id: "f3",
    title: "Smart Parking Reserve",
    desc: "Locate vacant spots with real-time occupancy updates, reserve slots, and navigate straight to EV charging bays.",
    icon: "SquareParking",
    color: "blue"
  },
  {
    id: "f4",
    title: "Integrated Public Transit",
    desc: "Live tracking of metros and BEST buses with exact arrival predictions and predictive delay warning systems.",
    icon: "TrainFront",
    color: "amber"
  },
  {
    id: "f5",
    title: "AIAssistant Travel Cop",
    desc: "Have a real-time speech/text conversation about road conditions, smart route explanations, and weather diversions.",
    icon: "Cpu",
    color: "purple"
  },
  {
    id: "f6",
    title: "Eco-Emission Analytics",
    desc: "Compare carbon footprints across cars, metros, and buses to maximize fuel savings and eco efficiency.",
    icon: "Leaf",
    color: "teal"
  }
];

export const SYSTEM_STATS = [
  { label: "Active Drivers", value: "25K+", sub: "Live in Mumbai Grid", icon: "Users" },
  { label: "Trips Optimized", value: "1.2M+", sub: "Reduced Commute Congestion", icon: "Milestone" },
  { label: "Time Saved", value: "35%", sub: "Avg. commute time reduction", icon: "Clock" },
  { label: "Incidents Managed", value: "20K+", sub: "Automatic route rerouting", icon: "Activity" }
];

export const ROAD_CONDITIONS = [
  { road: "Western Express Hwy", condition: "Heavy Traffic", speed: "18 km/h", statusColor: "rose", percentage: 85 },
  { road: "Eastern Express Hwy", condition: "Moderate", speed: "34 km/h", statusColor: "amber", percentage: 55 },
  { road: "S.V. Road (Bandra)", condition: "Heavy", speed: "12 km/h", statusColor: "rose", percentage: 90 },
  { road: "Bandra-Worli Sea Link", condition: "Free Flow", speed: "68 km/h", statusColor: "emerald", percentage: 15 },
  { road: "LBS Marg (Kurla)", condition: "Slow Moving", speed: "22 km/h", statusColor: "amber", percentage: 65 },
  { road: "Eastern Freeway", condition: "Free Flow", speed: "55 km/h", statusColor: "emerald", percentage: 20 }
];

export const MAP_NODES = [
  { id: "n1", name: "Borivali", x: 100, y: 80, traffic: "light" },
  { id: "n2", name: "Kandivali", x: 120, y: 130, traffic: "moderate" },
  { id: "n3", name: "Malad", x: 130, y: 180, traffic: "heavy" },
  { id: "n4", name: "Goregaon", x: 150, y: 230, traffic: "moderate" },
  { id: "n5", name: "Andheri", x: 180, y: 300, traffic: "heavy" },
  { id: "n6", name: "Bandra", x: 200, y: 400, traffic: "heavy" },
  { id: "n7", name: "BKC", x: 260, y: 420, traffic: "heavy" },
  { id: "n8", name: "Dharavi", x: 230, y: 460, traffic: "moderate" },
  { id: "n9", name: "Sion", x: 280, y: 480, traffic: "light" },
  { id: "n10", name: "Worli", x: 170, y: 490, traffic: "light" },
  { id: "n11", name: "Dadabhai", x: 210, y: 530, traffic: "light" },
  { id: "n12", name: "Byculla", x: 220, y: 600, traffic: "light" },
  { id: "n13", name: "Colaba", x: 240, y: 700, traffic: "light" }
];

export const MAP_LINKS = [
  { source: "n1", target: "n2", traffic: "light" },
  { source: "n2", target: "n3", traffic: "moderate" },
  { source: "n3", target: "n4", traffic: "heavy" },
  { source: "n4", target: "n5", traffic: "moderate" },
  { source: "n5", target: "n6", traffic: "heavy" },
  { source: "n6", target: "n7", traffic: "heavy" },
  { source: "n7", target: "n8", traffic: "moderate" },
  { source: "n8", target: "n9", traffic: "light" },
  { source: "n6", target: "n10", traffic: "light", special: "sea-link" },
  { source: "n10", target: "n11", traffic: "light" },
  { source: "n11", target: "n12", traffic: "light" },
  { source: "n12", target: "n13", traffic: "light" }
];

// Analytical metrics
export const HOURLY_CONGESTION = [
  { hour: "06:00 AM", score: 15, delayText: "No delays" },
  { hour: "08:00 AM", score: 45, delayText: "+5m average" },
  { hour: "09:00 AM", score: 85, delayText: "+24m heavy delay" },
  { hour: "10:00 AM", score: 92, delayText: "+35m heavy delay" },
  { hour: "12:00 PM", score: 55, delayText: "+12m moderate delay" },
  { hour: "02:00 PM", score: 40, delayText: "+8m average delay" },
  { hour: "04:00 PM", score: 65, delayText: "+18m delay" },
  { hour: "06:00 PM", score: 88, delayText: "+28m heavy delay" },
  { hour: "08:00 PM", score: 75, delayText: "+18m delay" },
  { hour: "10:00 PM", score: 30, delayText: "+4m delay" }
];

export const PEAK_HOUR_CHART = [
  { mode: "Metro Travel", peakSpeed: "45 km/h", reliability: "98%", carbonSaving: "85%" },
  { mode: "Electric EV Bus", peakSpeed: "22 km/h", reliability: "90%", carbonSaving: "72%" },
  { mode: "Private EV Sedan", peakSpeed: "18 km/h", reliability: "82%", carbonSaving: "45%" },
  { mode: "Private Gas Car", peakSpeed: "14 km/h", reliability: "68%", carbonSaving: "0%" }
];

export const ACCIDENT_REPORTS_STATS = [
  { cause: "Sudden Lane Swerving", count: 42, severity: "Moderate" },
  { cause: "Waterlogging Slippages", count: 28, severity: "High" },
  { cause: "Intersection Signal Jumps", count: 19, severity: "High" },
  { cause: "Double Parking Obstructions", count: 35, severity: "Low" }
];

export const SUGGESTED_QUESTIONS = [
  "How can I save fuel going to BKC from Borivali?",
  "Is there parking space near CSMT Metro lot?",
  "What roads are waterlogged right now?",
  "Is any Green Corridor active currently?",
  "Should I take Metro or EV Bus from Dahisar to DN Nagar?"
];
