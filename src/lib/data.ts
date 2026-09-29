export interface LocationPoint {
  id: string;
  name_en: string;
  name_hi: string;
  lat: number;
  lng: number;
  isCustom?: boolean;
}

export const STOPS: Record<string, LocationPoint> = {
  clock_tower: { id: "clock_tower", name_en: "Clock Tower", name_hi: "घंटाघर", lat: 30.3244, lng: 78.0419 },
  parade_ground: { id: "parade_ground", name_en: "Parade Ground / Astley Hall", name_hi: "परेड ग्राउंड", lat: 30.3255, lng: 78.046 },
  bindal_pull: { id: "bindal_pull", name_en: "Bindal Pull", name_hi: "बिंदाल पुल", lat: 30.326, lng: 78.031 },
  saharanpur_chowk: { id: "saharanpur_chowk", name_en: "Saharanpur Chowk", name_hi: "सहारनपुर चौक", lat: 30.312, lng: 78.028 },
  prince_chowk: { id: "prince_chowk", name_en: "Prince Chowk", name_hi: "प्रिंस चौक", lat: 30.318, lng: 78.038 },
  ballupur: { id: "ballupur", name_en: "Ballupur Chowk", name_hi: "बल्लूपुर चौक", lat: 30.33, lng: 78.015 },
  balliwala: { id: "balliwala", name_en: "Balliwala Chowk", name_hi: "बल्लीवाला चौक", lat: 30.322, lng: 78.005 },
  dilaram: { id: "dilaram", name_en: "Dilaram Chowk", name_hi: "दिलाराम चौक", lat: 30.3345, lng: 78.0535 },
  madhuban: { id: "madhuban", name_en: "Madhuban / Secretariat", name_hi: "सचिवालय", lat: 30.339, lng: 78.058 },
  pacific_mall: { id: "pacific_mall", name_en: "Pacific Mall", name_hi: "पैसिफिक मॉल", lat: 30.362, lng: 78.071 },
  jakhan: { id: "jakhan", name_en: "Jakhan", name_hi: "जाखन", lat: 30.368, lng: 78.075 },
  rajpur_fork: { id: "rajpur_fork", name_en: "Rajpur", name_hi: "राजपुर", lat: 30.395, lng: 78.087 },
  lansdowne: { id: "lansdowne", name_en: "Lansdowne Chowk", name_hi: "लैंसडाउन चौक", lat: 30.322, lng: 78.048 },
  survey_chowk: { id: "survey_chowk", name_en: "Survey Chowk", name_hi: "सर्वे चौक", lat: 30.32, lng: 78.052 },
  karanpur: { id: "karanpur", name_en: "Karanpur / DAV", name_hi: "करनपुर", lat: 30.328, lng: 78.061 },
  sahastradhara_x: { id: "sahastradhara_x", name_en: "Sahastradhara Crossing", name_hi: "सहस्त्रधारा क्रॉसिंग", lat: 30.334, lng: 78.077 },
  it_park: { id: "it_park", name_en: "IT Park Stand", name_hi: "आईटी पार्क", lat: 30.36, lng: 78.09 },
  raipur_market: { id: "raipur_market", name_en: "Raipur Market", name_hi: "रायपुर", lat: 30.308, lng: 78.095 },
  araghar: { id: "araghar", name_en: "Araghar Chowk", name_hi: "आराघर", lat: 30.313, lng: 78.045 },
  dharampur: { id: "dharampur", name_en: "Dharampur", name_hi: "धर्मपुर", lat: 30.308, lng: 78.046 },
  nehru_colony: { id: "nehru_colony", name_en: "Nehru Colony", name_hi: "नेहरू कॉलोनी", lat: 30.303, lng: 78.048 },
  rispna: { id: "rispna", name_en: "Rispana Bridge", name_hi: "रिस्पना पुल", lat: 30.297, lng: 78.047 },
  jogiwala: { id: "jogiwala", name_en: "Jogiwala Chowk", name_hi: "जोगीवाला", lat: 30.285, lng: 78.055 },
  iip: { id: "iip", name_en: "IIP Gate", name_hi: "आईआईपी", lat: 30.26, lng: 78.08 },
  doiwala: { id: "doiwala", name_en: "Doiwala Chowk", name_hi: "डोईवाला", lat: 30.16, lng: 78.118 },
  railway_stn: { id: "railway_stn", name_en: "Railway Station", name_hi: "रेलवे स्टेशन", lat: 30.316, lng: 78.034 },
  matawala_bagh: { id: "matawala_bagh", name_en: "Matawala Bagh", name_hi: "मातावाला बाग", lat: 30.302, lng: 78.018 },
  niranjanpur: { id: "niranjanpur", name_en: "Niranjanpur Mandi", name_hi: "निरंजनपुर मंडी", lat: 30.292, lng: 78.012 },
  patel_nagar: { id: "patel_nagar", name_en: "Patel Nagar", name_hi: "पटेल नगर", lat: 30.285, lng: 78.008 },
  majra: { id: "majra", name_en: "Majra Chowk", name_hi: "माजरा", lat: 30.279, lng: 78.001 },
  isbt: { id: "isbt", name_en: "ISBT Dehradun", name_hi: "आईएसबीटी", lat: 30.2743, lng: 77.9961 },
  kishan_nagar: { id: "kishan_nagar", name_en: "Kishan Nagar", name_hi: "किशन नगर", lat: 30.332, lng: 78.026 },
  ongc: { id: "ongc", name_en: "ONGC Tel Bhavan", name_hi: "ओएनजीसी", lat: 30.3395, lng: 78.0192 },
  kaulagarh: { id: "kaulagarh", name_en: "Kaulagarh", name_hi: "कौलागढ़", lat: 30.342, lng: 78.016 },
  fri: { id: "fri", name_en: "FRI Gate", name_hi: "एफआरआई", lat: 30.338, lng: 77.999 },
  panditwari: { id: "panditwari", name_en: "Panditwari", name_hi: "पंडितवाड़ी", lat: 30.334, lng: 77.985 },
  ima: { id: "ima", name_en: "IMA", name_hi: "आईएमए", lat: 30.3345, lng: 77.975 },
  premnagar: { id: "premnagar", name_en: "Premnagar", name_hi: "प्रेमनगर", lat: 30.335, lng: 77.965 },
  kanwali: { id: "kanwali", name_en: "Kanwali Road", name_hi: "कंवली रोड", lat: 30.316, lng: 78.015 },
  vasant_vihar: { id: "vasant_vihar", name_en: "Vasant Vihar", name_hi: "वसंत विहार", lat: 30.31, lng: 78.0 },
  seemadwar: { id: "seemadwar", name_en: "Seemadwar / ITBP", name_hi: "सीमाद्वार", lat: 30.305, lng: 77.995 },
  dakra: { id: "dakra", name_en: "Dakra Bazar", name_hi: "डाकरा", lat: 30.34, lng: 78.03 },
  garhi_cantt: { id: "garhi_cantt", name_en: "Garhi Cantt", name_hi: "गढ़ी कैंट", lat: 30.354, lng: 78.029 },
  kargi_chowk: { id: "kargi_chowk", name_en: "Kargi Chowk", name_hi: "कारगी चौक", lat: 30.285, lng: 78.025 },
  mohkampur: { id: "mohkampur", name_en: "Mohkampur", name_hi: "मोहकमपुर", lat: 30.275, lng: 78.065 },
  harrawala: { id: "harrawala", name_en: "Harrawala", name_hi: "हर्रावाला", lat: 30.250, lng: 78.080 },
  jolly_grant: { id: "jolly_grant", name_en: "Jolly Grant Airport", name_hi: "जॉली ग्रांट एयरपोर्ट", lat: 30.189, lng: 78.180 },
  suddhowala: { id: "suddhowala", name_en: "Suddhowala", name_hi: "सुद्धोवाला", lat: 30.335, lng: 77.935 },
  selaqui: { id: "selaqui", name_en: "Selaqui", name_hi: "सेलाकुई", lat: 30.365, lng: 77.865 },
  shiv_mandir: { id: "shiv_mandir", name_en: "Shiv Mandir", name_hi: "शिव मंदिर", lat: 30.405, lng: 78.090 },
  bhatta_falls: { id: "bhatta_falls", name_en: "Bhatta Falls", name_hi: "भट्टा फॉल्स", lat: 30.435, lng: 78.085 },
  mussoorie: { id: "mussoorie", name_en: "Mussoorie (Picture Palace)", name_hi: "मसूरी", lat: 30.455, lng: 78.075 },
  sahaspur: { id: "sahaspur", name_en: "Sahaspur", name_hi: "सहसपुर", lat: 30.385, lng: 77.805 },
  herbertpur: { id: "herbertpur", name_en: "Herbertpur", name_hi: "हर्बर्टपुर", lat: 30.415, lng: 77.725 },
  vikasnagar: { id: "vikasnagar", name_en: "Vikasnagar", name_hi: "विकासनगर", lat: 30.435, lng: 77.675 },
  subhash_nagar: { id: "subhash_nagar", name_en: "Subhash Nagar", name_hi: "सुभाष नगर", lat: 30.265, lng: 77.995 },
  graphic_era: { id: "graphic_era", name_en: "Graphic Era University", name_hi: "ग्राफिक एरा", lat: 30.260, lng: 77.990 },
  clement_town: { id: "clement_town", name_en: "Clement Town", name_hi: "क्लेमेंट टाउन", lat: 30.255, lng: 77.985 },
  thano: { id: "thano", name_en: "Thano", name_hi: "थानो", lat: 30.260, lng: 78.150 },
  bhogpur: { id: "bhogpur", name_en: "Bhogpur", name_hi: "भोगपुर", lat: 30.220, lng: 78.180 },
  sahastradhara_falls: { id: "sahastradhara_falls", name_en: "Sahastradhara Waterfalls", name_hi: "सहस्त्रधारा फॉल्स", lat: 30.380, lng: 78.130 }
};

export const ROUTES = [
  { id: "v1", label: "Vikram 1", color: "#f97316", type: "vikram", stops: ["parade_ground", "clock_tower", "dilaram", "madhuban", "pacific_mall", "jakhan", "rajpur_fork"] },
  { id: "v2_n", label: "Vikram 2 (IT Park)", color: "#f97316", type: "vikram", stops: ["clock_tower", "lansdowne", "survey_chowk", "karanpur", "sahastradhara_x", "it_park"] },
  { id: "v2_e", label: "Vikram 2 (Raipur)", color: "#f97316", type: "vikram", stops: ["clock_tower", "lansdowne", "survey_chowk", "karanpur", "sahastradhara_x", "raipur_market"] },
  { id: "v3", label: "Vikram 3", color: "#f97316", type: "vikram", stops: ["clock_tower", "prince_chowk", "araghar", "dharampur", "nehru_colony", "rispna"] },
  { id: "v4", label: "Vikram 4", color: "#f97316", type: "vikram", stops: ["rispna", "jogiwala", "iip", "doiwala"] },
  { id: "v5", label: "Vikram 5", color: "#f97316", type: "vikram", stops: ["parade_ground", "clock_tower", "railway_stn", "saharanpur_chowk", "matawala_bagh", "niranjanpur", "patel_nagar", "majra", "isbt"] },
  { id: "v6", label: "Vikram 6", color: "#f97316", type: "vikram", stops: ["bindal_pull", "kishan_nagar", "ongc", "kaulagarh"] },
  { id: "v7", label: "Vikram 7", color: "#f97316", type: "vikram", stops: ["bindal_pull", "kishan_nagar", "ballupur", "fri", "panditwari", "ima", "premnagar"] },
  { id: "v8", label: "Vikram 8", color: "#f97316", type: "vikram", stops: ["parade_ground", "clock_tower", "saharanpur_chowk", "kanwali", "balliwala", "vasant_vihar", "seemadwar"] },
  { id: "v9", label: "Vikram 9", color: "#f97316", type: "vikram", stops: ["bindal_pull", "dakra", "garhi_cantt"] },
  { id: "v10", label: "Vikram 10", color: "#f97316", type: "vikram", stops: ["saharanpur_chowk", "kanwali", "balliwala", "vasant_vihar", "panditwari", "premnagar"] },
  { id: "bus_101", label: "City Bus", color: "#10b981", type: "city_bus", stops: ["isbt", "majra", "saharanpur_chowk", "prince_chowk", "clock_tower", "dilaram", "pacific_mall", "rajpur_fork"] },
  { id: "bus_102", label: "City Bus", color: "#10b981", type: "city_bus", stops: ["isbt", "kargi_chowk", "rispna", "jogiwala", "mohkampur", "harrawala", "doiwala", "jolly_grant"] },
  { id: "bus_103", label: "City Bus", color: "#10b981", type: "city_bus", stops: ["parade_ground", "clock_tower", "bindal_pull", "ballupur", "ima", "premnagar", "suddhowala", "selaqui"] },
  { id: "bus_104", label: "City Bus", color: "#10b981", type: "city_bus", stops: ["isbt", "dharampur", "araghar", "survey_chowk", "karanpur", "raipur_market"] },
  { id: "magic_m1", label: "Tata Magic", color: "#8b5cf6", type: "magic", stops: ["parade_ground", "dilaram", "jakhan", "rajpur_fork", "shiv_mandir", "bhatta_falls", "mussoorie"] },
  { id: "magic_m2", label: "Tata Magic", color: "#8b5cf6", type: "magic", stops: ["premnagar", "selaqui", "sahaspur", "herbertpur", "vikasnagar"] },
  { id: "magic_m3", label: "Tata Magic", color: "#8b5cf6", type: "magic", stops: ["isbt", "subhash_nagar", "graphic_era", "clement_town"] },
  { id: "magic_m4", label: "Tata Magic", color: "#8b5cf6", type: "magic", stops: ["parade_ground", "survey_chowk", "sahastradhara_x", "it_park", "sahastradhara_falls"] },
  { id: "magic_m5", label: "Tata Magic", color: "#8b5cf6", type: "magic", stops: ["rispna", "jogiwala", "raipur_market", "thano", "bhogpur"] },
  { id: "hub_link", label: "Hub Transfer", color: "#94a3b8", type: "walk", stops: ["bindal_pull", "clock_tower", "parade_ground"] }
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

function getAbsoluteNearestStop(lat: number, lng: number): { stop: LocationPoint; dist: number } | null {
  const sorted = Object.values(STOPS)
    .map((stop) => ({ stop, dist: getDistance(lat, lng, stop.lat, stop.lng) }))
    .sort((a, b) => a.dist - b.dist);
  return sorted.length > 0 ? sorted[0] : null;
}

export function findSmartRoutes(start: LocationPoint, end: LocationPoint) {
  const graph = new Map<string, any[]>();
  Object.keys(STOPS).forEach((id) => graph.set(id, []));

  ROUTES.forEach((route) => {
    for (let i = 0; i < route.stops.length - 1; i++) {
      const from = route.stops[i];
      const to = route.stops[i + 1];
      const dist = getDistance(STOPS[from].lat, STOPS[from].lng, STOPS[to].lat, STOPS[to].lng);
      
      let speed = 20; 
      if (route.type === "walk") speed = 4;
      else if (route.type === "city_bus") speed = 24;
      else if (route.type === "magic") speed = 28;

      const edge = { routeId: route.id, type: route.type, fromStop: from, toStop: to, duration: (dist / speed) * 60, distKm: dist };
      graph.get(from)?.push(edge);
      graph.get(to)?.push({ ...edge, fromStop: to, toStop: from });
    }
  });

  const startId = start.isCustom ? "custom_start" : start.id;
  const endId = end.isCustom ? "custom_end" : end.id;

  if (start.isCustom) graph.set(startId, []);
  if (end.isCustom) graph.set(endId, []);

  const directDist = getDistance(start.lat, start.lng, end.lat, end.lng);

  if (directDist <= 0.5) {
    graph.get(startId)?.push({ routeId: "direct_walk", type: "direct_walk", mode: "walk", fromStop: startId, toStop: endId, duration: (directDist / 4) * 60, distKm: directDist });
  }

  const connectNode = (node: LocationPoint, nodeId: string, isStart: boolean) => {
    if (!node.isCustom) return true;

    const nearest = getAbsoluteNearestStop(node.lat, node.lng);
    if (!nearest || nearest.dist > 40.0) return false; 

    let mode = "walk";
    let speed = 4;

    if (nearest.dist > 0.5 && nearest.dist <= 3.0) { mode = "erickshaw"; speed = 15; } 
    else if (nearest.dist > 3.0) { mode = "cab"; speed = 25; }

    const edge = {
      routeId: isStart ? "first_mile" : "last_mile",
      type: isStart ? "first_mile" : "last_mile",
      mode: mode, fromStop: isStart ? nodeId : nearest.stop.id, toStop: isStart ? nearest.stop.id : nodeId,
      duration: (nearest.dist / speed) * 60, distKm: nearest.dist,
    };

    if (isStart) graph.get(nodeId)?.push(edge);
    else graph.get(nearest.stop.id)?.push(edge);

    return true;
  };

  const startValid = connectNode(start, startId, true);
  const endValid = connectNode(end, endId, false);

  if (!startValid || !endValid) return { error: "Location is entirely outside the Dehradun / Regional service area." };

  let queue = [{ currentStop: startId, legs: [] as any[], totalMins: 0, transfers: 0 }];
  const results = [];
  const visited = new Map<string, number>();

  while (queue.length > 0) {
    queue.sort((a, b) => a.totalMins - b.totalMins);
    const { currentStop, legs, totalMins, transfers } = queue.shift()!;

    if (currentStop === endId) {
      results.push({ legs, totalMins, transfers });
      continue;
    }
    if (transfers > 3 || results.length >= 8) continue;
    if (visited.has(currentStop) && visited.get(currentStop)! < totalMins) continue;
    visited.set(currentStop, totalMins);

    for (const edge of graph.get(currentStop) || []) {
      const isTransfer = legs.length > 0 && legs[legs.length - 1].routeId !== edge.routeId && edge.type !== "walk" && edge.type !== "first_mile" && edge.type !== "last_mile";
      const transferPenalty = isTransfer ? 5 : legs.length === 0 ? 3 : 0;
      queue.push({
        currentStop: edge.toStop,
        legs: [...legs, edge],
        totalMins: totalMins + edge.duration + transferPenalty,
        transfers: transfers + (isTransfer ? 1 : 0),
      });
    }
  }

  if (results.length === 0) return { error: "No shared transit route exists between these locations." };

  const sortedResults = results.sort((a, b) => a.totalMins - b.totalMins);
  const bestTime = sortedResults[0].totalMins;
  const competitiveResults = sortedResults.filter(r => r.totalMins <= (bestTime * 1.5) + 5);

  return { data: competitiveResults.slice(0, 6) };
}

export function compressLegs(legs: any[]) {
  const compressed: any[] = [];
  for (const leg of legs) {
    if (compressed.length === 0) {
      compressed.push({ ...leg });
    } else {
      const last = compressed[compressed.length - 1];
      if (last.routeId === leg.routeId && (last.type === "vikram" || last.type === "city_bus" || last.type === "magic")) {
        last.toStop = leg.toStop;
        last.duration += leg.duration;
        last.distKm += leg.distKm;
      } else {
        compressed.push({ ...leg });
      }
    }
  }

  compressed.forEach((leg) => {
    if (leg.type === "vikram") leg.fare = Math.max(10, Math.ceil(leg.distKm / 3) * 10);
    else if (leg.type === "city_bus") leg.fare = Math.max(15, Math.ceil(leg.distKm * 2.5));
    else if (leg.type === "magic") leg.fare = Math.max(20, Math.ceil(leg.distKm * 3));
    else if (leg.type === "erickshaw" || leg.mode === "erickshaw") leg.fare = Math.max(20, Math.ceil(leg.distKm) * 15);
    else if (leg.type === "cab" || leg.mode === "cab") leg.fare = Math.max(50, Math.ceil(leg.distKm * 20));
    else leg.fare = 0;
  });
  return compressed;
}

export function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)} km`;
}