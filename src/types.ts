export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle_type: string;
  vehicle_number: string;
  role: "driver" | "operator" | "admin";
  created_at: string;
  saved_routes?: SavedRoute[];
  preferences?: {
    notifications: boolean;
    avoid_tolls: boolean;
    eco_friendly: boolean;
  };
}

export interface SavedRoute {
  id: string;
  from: string;
  to: string;
  mode: string;
  distance: string;
  time: string;
}

export interface ParkingSpot {
  id: string;
  name: string;
  total: number;
  available: number;
  rate: string;
  coordinates: { lat: number; lng: number };
  slots: string[];
}

export interface ParkingReservation {
  id: string;
  userId: string;
  parkingId: string;
  slot: string;
  time: string;
  duration: string;
  status: string;
}

export interface TransitVehicle {
  id: string;
  route: string;
  from: string;
  to: string;
  speed: string;
  status: string;
  delay: string;
  nextStop?: string;
  nextStation?: string;
  line?: string;
  eta: string;
  coordinates?: { lat: number; lng: number };
}

export interface EmergencyVehicle {
  id: string;
  type: "Ambulance" | "Fire Brigade" | "Police Patrol";
  vehicleNo: string;
  status: string;
  speed: string;
  driver: string;
  source: string;
  destination: string;
  coordinates: { lat: number; lng: number };
  greenCorridor: boolean;
  activeRoute: string;
}

export interface TrafficIncident {
  id: string;
  type: string;
  location: string;
  description: string;
  time: string;
  severity: "Low" | "Moderate" | "High";
}

export interface AIInsight {
  title: string;
  type: "alert" | "eco" | "info";
  message: string;
}

export interface RouteProposal {
  recommendedRoute: string;
  alternateRoute: string;
  timeMinutes: number;
  distanceKm: number;
  trafficLevel: "Light" | "Moderate" | "Heavy";
  fuelSavingLitres: number;
  carbonEmissionKg: number;
  explanation: string;
}
