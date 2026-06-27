import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client successfully initialized");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found in env; falling back to offline mock intelligence.");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- IN-MEMORY DATABASE STATES ---
  const users: any[] = [
    {
      id: "usr_1",
      name: "Piyush Kumar",
      email: "piyush@gmail.com",
      phone: "+91 98765 43210",
      password: "password123",
      city: "Mumbai",
      vehicle_type: "Four-Wheeler (EV)",
      vehicle_number: "MH-02-EE-2026",
      role: "driver",
      created_at: new Date().toISOString(),
      saved_routes: [
        { id: "r1", from: "Western Express Hwy", to: "Bandra Kurla Complex", mode: "car", distance: "18.6 km", time: "32 min" }
      ],
      preferences: { notifications: true, avoid_tolls: false, eco_friendly: true }
    }
  ];

  const parkingSpots = [
    { id: "p1", name: "BKC Plaza Parking", total: 150, available: 42, rate: "₹40/hr", coordinates: { lat: 19.0596, lng: 72.8712 }, slots: ["A-101", "A-102", "B-201", "B-205", "C-302"] },
    { id: "p2", name: "Gateway Mall Parking", total: 200, available: 112, rate: "₹50/hr", coordinates: { lat: 18.9220, lng: 72.8347 }, slots: ["G-12", "G-15", "F-45", "F-46"] },
    { id: "p3", name: "CSMT Central Yard", total: 80, available: 3, rate: "₹30/hr", coordinates: { lat: 18.9400, lng: 72.8354 }, slots: ["X-01", "Y-14"] },
    { id: "p4", name: "Andheri Metro Station Lot", total: 120, available: 75, rate: "₹25/hr", coordinates: { lat: 19.1197, lng: 72.8468 }, slots: ["M-03", "M-08", "M-12"] }
  ];

  const parkingReservations: any[] = [
    { id: "res_1", userId: "usr_1", parkingId: "p1", slot: "A-101", time: "2026-06-27T10:00:00.000Z", duration: "2 hours", status: "Active" }
  ];

  const transitData = {
    buses: [
      { id: "B101", route: "AS-440", from: "Borivali Station", to: "BKC", speed: "24 km/h", status: "On Time", delay: "0 min", nextStop: "Dindoshi", eta: "8 min", coordinates: { lat: 19.1690, lng: 72.8550 } },
      { id: "B102", route: "C-12", from: "Andheri East", to: "Colaba", speed: "18 km/h", status: "Delayed", delay: "12 min", nextStop: "Bandra", eta: "15 min", coordinates: { lat: 19.0540, lng: 72.8400 } },
      { id: "B103", route: "AS-501", from: "Thane", to: "Vashi", speed: "32 km/h", status: "On Time", delay: "2 min", nextStop: "Airoli", eta: "4 min", coordinates: { lat: 19.1550, lng: 72.9920 } }
    ],
    metro: [
      { id: "M1", line: "Blue Line 1", route: "Versova to Ghatkopar", speed: "45 km/h", status: "On Time", delay: "0 min", nextStation: "DN Nagar", eta: "2 min" },
      { id: "M2", line: "Red Line 7", route: "Dahisar to Andheri East", speed: "40 km/h", status: "Slight Congestion", delay: "4 min", nextStation: "Akurli", eta: "5 min" },
      { id: "M3", line: "Yellow Line 2A", route: "Dahisar to DN Nagar", speed: "42 km/h", status: "On Time", delay: "0 min", nextStation: "Shimpoli", eta: "3 min" }
    ]
  };

  const emergencyVehicles = [
    { id: "em_1", type: "Ambulance", vehicleNo: "MH-02-EM-1102", status: "Responding", speed: "65 km/h", driver: "Ravi Shankar", source: "Sion Hospital", destination: "BKC Apex Clinic", coordinates: { lat: 19.0400, lng: 72.8630 }, greenCorridor: true, activeRoute: "LBS Marg -> BKC Connector" },
    { id: "em_2", type: "Fire Brigade", vehicleNo: "MH-01-FD-3301", status: "Standby", speed: "0 km/h", driver: "Anil Parab", source: "Andheri Station", destination: "None", coordinates: { lat: 19.1190, lng: 72.8460 }, greenCorridor: false, activeRoute: "" },
    { id: "em_3", type: "Police Patrol", vehicleNo: "MH-02-PL-5599", status: "On Patrol", speed: "42 km/h", driver: "Inspector Jadhav", source: "Western Express Highway", destination: "Carter Road", coordinates: { lat: 19.0760, lng: 72.8250 }, greenCorridor: false, activeRoute: "" }
  ];

  const recentIncidents = [
    { id: "inc_1", type: "Accident", location: "Western Express Hwy (Andheri)", description: "Minor fender bender blocking left lane.", time: "2 min ago", severity: "Moderate" },
    { id: "inc_2", type: "Waterlogging", location: "S.V. Road (Bandra)", description: "Heavy rain causing slow movement.", time: "25 min ago", severity: "High" },
    { id: "inc_3", type: "Road Construction", location: "LBS Marg (Kurla)", description: "Metro construction work. Lane diversion in place.", time: "1 hr ago", severity: "Low" }
  ];

  // --- AUTH ENDPOINTS ---
  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone, password, city, vehicle_type, vehicle_number, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields (name, email, password)." });
    }

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    const newUser = {
      id: "usr_" + (users.length + 1),
      name,
      email,
      phone: phone || "",
      password,
      city: city || "Mumbai",
      vehicle_type: vehicle_type || "None",
      vehicle_number: vehicle_number || "",
      role: role || "driver",
      created_at: new Date().toISOString(),
      saved_routes: [],
      preferences: { notifications: true, avoid_tolls: false, eco_friendly: true }
    };

    users.push(newUser);
    // Destructure password out before returning
    const { password: _, ...userSafe } = newUser;
    res.status(201).json(userSafe);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const { password: _, ...userSafe } = user;
    res.json(userSafe);
  });

  app.put("/api/auth/profile", (req, res) => {
    const { id, name, phone, city, vehicle_type, vehicle_number, preferences } = req.body;
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users[index] = {
      ...users[index],
      name: name || users[index].name,
      phone: phone || users[index].phone,
      city: city || users[index].city,
      vehicle_type: vehicle_type || users[index].vehicle_type,
      vehicle_number: vehicle_number || users[index].vehicle_number,
      preferences: preferences || users[index].preferences
    };

    const { password: _, ...userSafe } = users[index];
    res.json(userSafe);
  });

  app.post("/api/auth/save-route", (req, res) => {
    const { userId, route } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const newRoute = {
      id: "r_" + Date.now(),
      ...route
    };
    user.saved_routes = user.saved_routes || [];
    user.saved_routes.push(newRoute);
    res.json({ success: true, saved_routes: user.saved_routes });
  });

  app.delete("/api/auth/delete-route", (req, res) => {
    const { userId, routeId } = req.body;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.saved_routes = (user.saved_routes || []).filter((r: any) => r.id !== routeId);
    res.json({ success: true, saved_routes: user.saved_routes });
  });

  // --- TRANSIT, PARKING, INCIDENTS ---
  app.get("/api/transit", (req, res) => {
    res.json(transitData);
  });

  app.get("/api/parking", (req, res) => {
    res.json({ spots: parkingSpots, reservations: parkingReservations });
  });

  app.post("/api/parking/reserve", (req, res) => {
    const { userId, parkingId, slot, duration } = req.body;
    const spot = parkingSpots.find(p => p.id === parkingId);
    if (!spot) {
      return res.status(404).json({ error: "Parking lot not found" });
    }

    if (spot.available <= 0) {
      return res.status(400).json({ error: "No slots available" });
    }

    spot.available -= 1;
    const reservation = {
      id: "res_" + Date.now(),
      userId: userId || "guest",
      parkingId,
      slot: slot || spot.slots[Math.floor(Math.random() * spot.slots.length)],
      time: new Date().toISOString(),
      duration: duration || "2 hours",
      status: "Active"
    };

    parkingReservations.push(reservation);
    res.status(201).json({ success: true, reservation, spot });
  });

  app.get("/api/emergency", (req, res) => {
    res.json(emergencyVehicles);
  });

  app.post("/api/emergency/corridor", (req, res) => {
    const { vehicleId, activate, routeName } = req.body;
    const vehicle = emergencyVehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Emergency vehicle not found" });
    }

    vehicle.greenCorridor = !!activate;
    if (activate) {
      vehicle.status = "Responding (GREEN CORRIDOR ACTIVE)";
      vehicle.speed = "78 km/h";
      vehicle.activeRoute = routeName || "Sion Circle -> BKC Apex Expressway Link (All Intersections Cleared)";
    } else {
      vehicle.status = "Patrol";
      vehicle.speed = "40 km/h";
      vehicle.activeRoute = "";
    }

    res.json({ success: true, vehicle });
  });

  app.get("/api/incidents", (req, res) => {
    res.json(recentIncidents);
  });

  app.post("/api/incidents", (req, res) => {
    const { type, location, description, severity } = req.body;
    if (!type || !location || !description) {
      return res.status(400).json({ error: "Type, location, and description are required." });
    }

    const newInc = {
      id: "inc_" + Date.now(),
      type,
      location,
      description,
      time: "Just now",
      severity: severity || "Moderate"
    };

    recentIncidents.unshift(newInc);
    res.status(201).json({ success: true, incident: newInc });
  });

  // --- GEMINI AI CHAT & ANALYTICS API ---
  app.post("/api/gemini/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const promptText = `
You are the AI Travel Assistant of the "Smart AI Traffic Cop" platform. You have real-time access to Mumbai traffic grids, parking reservations, emergency situations, transit routes, and carbon saving analyses.
Respond concisely in maximum 3-4 professional, helpful sentences. Mention actual roads (e.g. Western Express Highway, S.V. Road, LBS Marg, Bandra-Worli Sea Link, BKC Road, Eastern Freeway) when explaining things. Provide custom, smart tips.

User message: ${message}
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            systemInstruction: "You are Smart AI Traffic Cop, a supportive and highly intelligent traffic planning assistant. You provide precise, polite, and data-driven travel recommendations.",
            temperature: 0.7,
          }
        });
        return res.json({ reply: response.text || "I am analyzing the traffic data grid right now. Try another route." });
      } catch (err: any) {
        console.error("Gemini API error in chat:", err);
        // Fallback to mock intelligence below
      }
    }

    // Offline Mock Intelligence fallback
    let reply = "The system is running in offline mode. I've optimized the coordinates for you! SV Road is currently at heavy capacity due to minor pooling. We suggest taking the Western Express Highway which flows cleanly at 45km/h with a travel saving of 12 minutes.";
    const lower = message.toLowerCase();
    if (lower.includes("route") || lower.includes("go to") || lower.includes("bkc") || lower.includes("airport")) {
      reply = "AI Traffic Alert: The route to BKC via Link Road has moderate congestion near Bandra. I recommend using the Western Express Highway with EV priority lane active, which will save you approximately 14 minutes and save 0.8kg of CO2 emissions.";
    } else if (lower.includes("parking") || lower.includes("spot") || lower.includes("reserve")) {
      reply = "AI Parking Intelligence: BKC Plaza Parking has 42 available spots remaining. I suggest slot A-102 on Level 1 as it is equipped with a high-speed EV charging dock and provides immediate elevator access.";
    } else if (lower.includes("emergency") || lower.includes("ambulance") || lower.includes("green corridor")) {
      reply = "Emergency Signal Status: An active Ambulance (MH-02-EM-1102) is currently responding towards BKC Apex Clinic. I have automatically activated a Green Corridor along LBS Marg, switching 4 upcoming signal junctions to steady green.";
    } else if (lower.includes("metro") || lower.includes("bus") || lower.includes("train") || lower.includes("transit")) {
      reply = "Transit Status: Mumbai Metro Blue Line 1 is operating completely on schedule with 2-minute headway intervals. However, BEST Bus route AS-440 has a 4-minute delay near Kurla due to pedestrian volume.";
    } else if (lower.includes("weather") || lower.includes("rain") || lower.includes("flood")) {
      reply = "Weather Intelligence: The current temp is 28°C with Partly Cloudy skies. S.V. Road has slight waterlogging near Bandra West. Please avoid low-lying underpasses and use the flyovers where possible.";
    }

    res.json({ reply });
  });

  app.post("/api/gemini/route", async (req, res) => {
    const { source, destination, mode } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination are required." });
    }

    const travelMode = mode || "car";
    const promptText = `
Given a source of "${source}" and a destination of "${destination}" using mode "${travelMode}", generate an optimal AI routing proposal in Mumbai. 
Return a strictly formatted JSON block with the following fields:
{
  "recommendedRoute": "Name of the primary recommended route",
  "alternateRoute": "Name of an alternate route",
  "timeMinutes": 32,
  "distanceKm": 18.5,
  "trafficLevel": "Heavy" | "Moderate" | "Light",
  "fuelSavingLitres": 1.4,
  "carbonEmissionKg": 2.1,
  "explanation": "A short, helpful 2-sentence explanation of why this route is chosen and any potential road conditions."
}
Do not return any markdown tags or extra characters, just the raw JSON object.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });

        if (response.text) {
          try {
            const parsed = JSON.parse(response.text.trim());
            return res.json(parsed);
          } catch (e) {
            console.error("Failed to parse Gemini route response JSON:", response.text);
          }
        }
      } catch (err: any) {
        console.error("Gemini API error in routing:", err);
      }
    }

    // High quality offline fallback
    const distances = [12.4, 18.6, 24.1, 8.5, 15.3];
    const times = [25, 32, 45, 15, 28];
    const trafficLevels = ["Light", "Moderate", "Heavy"];
    const randIndex = Math.abs(source.charCodeAt(0) + destination.charCodeAt(0)) % 3;
    
    const randomDistance = distances[randIndex % distances.length];
    const randomTime = times[randIndex % times.length];
    const randomTraffic = trafficLevels[randIndex % trafficLevels.length];
    const fuelSaved = (randomDistance * 0.08).toFixed(1);
    const co2Saved = (randomDistance * 0.12).toFixed(1);

    res.json({
      recommendedRoute: `${source} -> Western Express Highway -> ${destination} Flyover`,
      alternateRoute: `${source} -> S.V. Road (Coastal Lane) -> ${destination}`,
      timeMinutes: randomTime,
      distanceKm: randomDistance,
      trafficLevel: randomTraffic,
      fuelSavingLitres: parseFloat(fuelSaved),
      carbonEmissionKg: parseFloat(co2Saved),
      explanation: `We recommend taking the Western Express Highway route as there is currently ${randomTraffic.toLowerCase()} congestion. Utilizing the elevated express lanes avoids standard delays and decreases carbon emissions by ${co2Saved}kg.`
    });
  });

  app.get("/api/gemini/insights", async (req, res) => {
    const promptText = `
Generate exactly 3 smart traffic insights for Mumbai traffic control today.
Each insight should look like:
- Title (e.g. "WEH Peak Congestion")
- Type ("alert" | "eco" | "info")
- Message (e.g. "Western Express Highway is clear. Consider using this route instead of S.V. Road.")
Return a raw JSON array:
[
  { "title": "...", "type": "...", "message": "..." },
  ...
]
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            temperature: 0.5
          }
        });
        if (response.text) {
          try {
            const parsed = JSON.parse(response.text.trim());
            return res.json(parsed);
          } catch (e) {
            console.error("Failed to parse dynamic insights:", response.text);
          }
        }
      } catch (err) {
        console.error("Gemini API error in insights:", err);
      }
    }

    // Offline high-fidelity fallback
    res.json([
      {
        title: "BKC Congestion Expected",
        type: "alert",
        message: "Heavy gridlock is forming near BKC Connector between 5:00 PM and 6:30 PM. Transit users are advised to shift departure times by 20 mins."
      },
      {
        title: "Green Corridor Activated",
        type: "info",
        message: "An active Ambulance MH-02-EM-1102 has triggered automated Green Corridor on LBS Marg. Signals synchronized for fast traversal."
      },
      {
        title: "Eco-Route Priority Active",
        type: "eco",
        message: "EV and hybrid vehicles utilizing the Bandra-Worli Sea Link are currently saving 1.2kg carbon per trip due to dedicated lane routing."
      }
    ]);
  });

  // --- VITE MIDDLEWARE SETUP / STATIC FILE SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
