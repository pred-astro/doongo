import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import L from "leaflet";
import { Search, MapPin, LocateFixed, Footprints, IndianRupee, Bus, AlertCircle, ArrowLeft, Clock, ChevronDown, Car } from "lucide-react";
import { STOPS, ROUTES, findSmartRoutes, compressLegs, formatDist, LocationPoint } from "./lib/data";

const DICT = {
  en: { err: "Looks like shared transit doesn't reach there. You might need a cab.", off: "Night Hours", offMsg: "Transit frequency drops severely after 9:00 PM.", cab: "Find a Cab", from: "Leaving from...", to: "Where to?" },
  hi: { err: "यहाँ तक कोई शेयरिंग वाहन नहीं जाता। आपको कैब लेनी पड़ सकती है।", off: "रात का समय", offMsg: "रात 9 बजे के बाद वाहन कम मिलते हैं।", cab: "कैब ढूँढें", from: "कहाँ से...", to: "कहाँ तक?" },
};

const DoonGoLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="4" fill="#0284C7" opacity="0.1"/>
    <path d="M8 15a2 2 0 100-4 2 2 0 000 4z" fill="#0369A1"/>
    <path d="M16 11a2 2 0 100-4 2 2 0 000 4z" fill="#38BDF8"/>
    <path d="M8 13c0 0 2-4 8-2" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
  </svg>
);

export default function App() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = DICT[lang];

  const [view, setView] = useState<"home" | "search" | "results">("home");
  const [filter, setFilter] = useState<'all' | 'vikram' | 'bus' | 'magic'>('all');

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromLoc, setFromLoc] = useState<LocationPoint | null>(null);
  const [toLoc, setToLoc] = useState<LocationPoint | null>(null);

  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
  const [searchResults, setSearchResults] = useState<LocationPoint[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [routes, setRoutes] = useState<any[]>([]);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [expandedRoute, setExpandedRoute] = useState<number | null>(0);

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 21;

  const getGreeting = () => {
    if (lang === 'hi') return "आज कहाँ जाना है?";
    if (hour >= 5 && hour < 12) return "Good morning! Heading out?";
    if (hour >= 12 && hour < 17) return "Good afternoon! Where to?";
    if (hour >= 17 && hour < 22) return "Good evening! Heading home?";
    return "Late night? Stay safe.";
  };

  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.LayerGroup | null>(null);

  const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(40); };

  // Guaranteed Leaflet Initialization & Map Resizing
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: false, attributionControl: false }).setView([30.3165, 78.0322], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapRef.current);
      routeLayerRef.current = L.layerGroup().addTo(mapRef.current);
      userMarkerRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        if (view !== 'search') return;
        const droppedLoc: LocationPoint = {
          id: `pin_${e.latlng.lat}`,
          name_en: "Dropped Pin", name_hi: "ड्रॉप किया गया पिन",
          lat: e.latlng.lat, lng: e.latlng.lng, isCustom: true,
        };
        selectLocation(droppedLoc);
        triggerHaptic();
      });
    }
  }, [view, lang]);

  useEffect(() => {
    if (view === 'results' && mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 150);
    }
  }, [view]);

  // Hybrid Search Engine
  useEffect(() => {
    if (view !== 'search') return;
    const query = activeInput === "from" ? fromQuery : toQuery;
    if (!query || query.length < 2) {
      setSearchResults(Object.values(STOPS));
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const localMatches = Object.values(STOPS).filter((s) => {
        const en = (s.name_en || "").toLowerCase();
        const hi = s.name_hi || "";
        return en.includes(query.toLowerCase()) || hi.includes(query);
      });

      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=77.5,29.9,78.5,30.6&limit=5`);
        const data = await res.json();
        const liveMatches: LocationPoint[] = data.features
          .map((f: any) => {
            const baseName = f.properties.name || "Unknown Location";
            const streetStr = f.properties.street ? `, ${f.properties.street}` : "";
            return {
              id: `custom_${f.properties.osm_id}`,
              name_en: baseName + streetStr, name_hi: baseName,
              lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], isCustom: true,
            };
          })
          .filter((l: any) => !l.name_en.startsWith("Unknown"));

        const combined = [...localMatches, ...liveMatches];
        const unique = Array.from(new Map(combined.map((item) => [item.name_en || "", item])).values());
        setSearchResults(unique);
      } catch (e) {
        setSearchResults(localMatches);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [fromQuery, toQuery, activeInput, view]);

  useEffect(() => {
    if (fromLoc && toLoc && view === 'search') {
      handleSearch();
    }
  }, [fromLoc, toLoc, view]);

  const handleUseCurrentLocation = () => {
    triggerHaptic();
    if (!navigator.geolocation) { setRouteError(t.err); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: LocationPoint = {
          id: "user_current_location", name_en: "Your Location", name_hi: "आपकी लोकेशन",
          lat: pos.coords.latitude, lng: pos.coords.longitude, isCustom: true,
        };
        setFromLoc(loc);
        setFromQuery(lang === "en" ? loc.name_en : loc.name_hi);

        userMarkerRef.current?.clearLayers();
        L.circle([loc.lat, loc.lng], { radius: 45, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 1 }).addTo(userMarkerRef.current!);
        L.circleMarker([loc.lat, loc.lng], { radius: 7, fillColor: "#2563eb", color: "#fff", weight: 2.5, fillOpacity: 1 }).addTo(userMarkerRef.current!);
        mapRef.current?.flyTo([loc.lat, loc.lng], 15, { animate: true, duration: 0.8 });

        setIsLocating(false);
        if (!toLoc) setActiveInput("to");
        else setActiveInput(null);
      },
      () => { setIsLocating(false); setRouteError("Unable to acquire GPS."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectLocation = (loc: LocationPoint) => {
    triggerHaptic();
    const nameEn = loc.name_en || "";
    const nameHi = loc.name_hi || nameEn;
    const displayName = lang === "en" ? nameEn : nameHi;

    if (activeInput === "from") {
      setFromLoc(loc);
      setFromQuery(displayName);
      if (!toLoc) setActiveInput("to");
    } else {
      setToLoc(loc);
      setToQuery(displayName);
      if (!fromLoc) setActiveInput("from");
    }
  };

  const setQuickChip = (stopId: string) => {
    const loc = STOPS[stopId];
    if (!loc) return;
    const displayName = lang === "en" ? loc.name_en : loc.name_hi;

    setToLoc(loc);
    setToQuery(displayName || '');
    if (!fromLoc) {
      setView('search');
      setActiveInput("from");
    } else {
      setView('search');
    }
  };

  const handleSearch = () => {
    triggerHaptic();
    if (fromLoc && toLoc) {
      setView('results');
      setRouteError(null);
      setFilter('all');
      const response = findSmartRoutes(fromLoc, toLoc);
      if (response.error) {
        setRoutes([]);
        setRouteError(response.error);
        routeLayerRef.current?.clearLayers();
      } else if (response.data) {
        setRoutes(response.data);
        drawRouteOnMap(response.data[0].legs);
        setExpandedRoute(0);
      }
    }
  };

  const drawRouteOnMap = (legs: any[]) => {
    if (!routeLayerRef.current || !mapRef.current) return;
    routeLayerRef.current.clearLayers();

    let boundsCoords: [number, number][] = [];
    const createMarker = (lat: number, lng: number, isStart: boolean) => {
      L.circleMarker([lat, lng], { radius: 7, fillColor: isStart ? "#000" : "#0284C7", color: "#fff", weight: 2.5, fillOpacity: 1 }).addTo(routeLayerRef.current!);
    };

    if (fromLoc?.isCustom) createMarker(fromLoc.lat, fromLoc.lng, true);
    if (toLoc?.isCustom) createMarker(toLoc.lat, toLoc.lng, false);

    const compressed = compressLegs(legs);
    compressed.forEach((leg) => {
      const startCoord = leg.fromStop === "custom_start" ? [fromLoc!.lat, fromLoc!.lng] : [STOPS[leg.fromStop].lat, STOPS[leg.fromStop].lng];
      const endCoord = leg.toStop === "custom_end" ? [toLoc!.lat, toLoc!.lng] : [STOPS[leg.toStop].lat, STOPS[leg.toStop].lng];

      if (leg.mode === "walk" || leg.type === "direct_walk") {
        L.polyline([startCoord as [number, number], endCoord as [number, number]], { color: "#94a3b8", weight: 5, dashArray: "6, 8", lineCap: "round" }).addTo(routeLayerRef.current!);
        boundsCoords.push(startCoord as [number, number], endCoord as [number, number]);
      } else if (leg.mode === "cab") {
        L.polyline([startCoord as [number, number], endCoord as [number, number]], { color: "#000000", weight: 5, dashArray: "5, 8", lineCap: "round" }).addTo(routeLayerRef.current!);
        boundsCoords.push(startCoord as [number, number], endCoord as [number, number]);
      } else {
        const routeData = ROUTES.find((r) => r.id === leg.routeId);
        if (routeData) {
          const sIdx = routeData.stops.indexOf(leg.fromStop);
          const eIdx = routeData.stops.indexOf(leg.toStop);
          const step = sIdx < eIdx ? 1 : -1;
          const segmentPath: [number, number][] = [];

          for (let i = sIdx; i !== eIdx + step; i += step) {
            const stopNode = STOPS[routeData.stops[i]];
            segmentPath.push([stopNode.lat, stopNode.lng]);
            L.circleMarker([stopNode.lat, stopNode.lng], { radius: 5, fillColor: "#fff", color: routeData.color, weight: 2.5, fillOpacity: 1 }).addTo(routeLayerRef.current!);
          }
          L.polyline(segmentPath, { color: routeData.color, weight: 6, opacity: 0.9, lineCap: "round", lineJoin: "round" }).addTo(routeLayerRef.current!);
          boundsCoords = [...boundsCoords, ...segmentPath];
        }
      }
    });

    if (boundsCoords.length > 0) {
      mapRef.current.flyToBounds(L.latLngBounds(boundsCoords), {
        paddingBottomRight: [40, window.innerHeight * 0.65], 
        paddingTopLeft: [40, 80],
        duration: 0.8,
      });
    }
  };

  const openUber = () => {
    const plat = fromLoc?.lat || 30.3165; const plng = fromLoc?.lng || 78.0322;
    const dlat = toLoc?.lat || 30.3165; const dlng = toLoc?.lng || 78.0322;
    window.open(`https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${plat}&pickup[longitude]=${plng}&dropoff[latitude]=${dlat}&dropoff[longitude]=${dlng}`, "_blank");
  };

  const resetToHome = () => {
    setRoutes([]);
    setView('home');
    setRouteError(null);
    setFromLoc(null);
    setFromQuery('');
    setToLoc(null);
    setToQuery('');
    routeLayerRef.current?.clearLayers();
    triggerHaptic();
  };

  const getStyleForMode = (type: string) => {
    if (type === 'city_bus') return { bg: 'bg-emerald-100', text: 'text-emerald-800' };
    if (type === 'magic') return { bg: 'bg-purple-100', text: 'text-purple-800' };
    if (type === 'vikram') return { bg: 'bg-orange-100', text: 'text-orange-800' };
    if (type === 'first_mile' || type === 'last_mile') return { bg: 'bg-cyan-100', text: 'text-cyan-800' };
    return { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const filteredRoutes = routes.filter(journey => {
    if (filter === 'all') return true;
    const modes = journey.legs.map((l: any) => l.type);
    const isDirect = modes.length === 1 && modes[0] === 'direct_walk';
    if (isDirect) return true;
    
    if (filter === 'vikram') return modes.includes('vikram');
    if (filter === 'bus') return modes.includes('city_bus');
    if (filter === 'magic') return modes.includes('magic');
    return true;
  });

  return (
    <div className="relative h-screen w-full sm:w-[420px] sm:mx-auto bg-slate-50 sm:shadow-2xl overflow-hidden flex flex-col font-sans selection:bg-blue-100">
      
      {/* MAP: Always rendered to avoid Leaflet errors, covered by UI when not needed */}
      <div id="map" className="absolute inset-0 z-0 bg-slate-100"></div>

      {/* Dynamic Background Overlay */}
      <div className={`absolute inset-0 z-10 bg-slate-50 pointer-events-none transition-opacity duration-500 ${view === 'results' ? 'opacity-0' : 'opacity-100'}`}></div>

      {/* STATE 1: HOME UI */}
      {view === 'home' && (
        <div className="absolute inset-0 z-20 flex flex-col pt-12 px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <DoonGoLogo className="h-8 w-8" />
              <h1 className="font-bold text-xl text-slate-800 tracking-tight">Doon<span className="text-sky-600">Go</span></h1>
            </div>
            <button 
              onClick={() => { setLang(lang === "en" ? "hi" : "en"); triggerHaptic(); }}
              className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-600 border border-slate-200 active:scale-95 transition-transform"
            >
              {lang === "en" ? "अ/A" : "A/अ"}
            </button>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-6 leading-tight">{getGreeting()}</h2>
          
          <div onClick={() => { setView('search'); setActiveInput('to'); }} className="bg-white rounded-2xl p-5 flex items-center gap-4 cursor-pointer shadow-sm border border-slate-200 hover:border-sky-300 transition-colors">
            <Search className="h-6 w-6 text-sky-600" />
            <span className="text-[17px] font-semibold text-slate-400">{t.to}</span>
          </div>
          
          <div className="mt-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Saved Hubs</span>
            <div className="flex flex-col gap-3 mt-3">
              {["isbt", "railway_stn", "jolly_grant"].map((id) => (
                <div key={id} onClick={() => setQuickChip(id)} className="bg-white p-4 rounded-2xl flex items-center gap-4 cursor-pointer border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="bg-sky-50 p-2.5 rounded-full"><MapPin className="h-5 w-5 text-sky-600"/></div>
                  <span className="font-semibold text-slate-700">{lang === "en" ? STOPS[id].name_en : STOPS[id].name_hi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: SEARCH OVERLAY */}
      {view === 'search' && (
        <div className="absolute inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-4 pt-12 flex items-start gap-4 bg-white shadow-sm border-b border-slate-100 relative">
            <ArrowLeft className="h-6 w-6 mt-3.5 cursor-pointer text-slate-700 flex-shrink-0 active:scale-90 transition" onClick={() => setView('home')} />
            
            <div className="flex-1 relative">
              <div className="absolute left-[13px] top-[26px] bottom-[26px] w-[2px] bg-slate-200"></div>
              <div className="absolute left-[10px] top-[18px] h-2 w-2 rounded-full border-[2px] border-sky-500 bg-white z-10"></div>
              <div className="absolute left-[10px] bottom-[18px] h-2 w-2 bg-slate-800 rounded-sm z-10"></div>

              <div className="flex flex-col gap-3 ml-7">
                <input
                  className="w-full bg-slate-100 py-3.5 px-4 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-sky-100 font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400"
                  placeholder={t.from} value={fromQuery}
                  onFocus={() => setActiveInput("from")}
                  onChange={(e) => { setFromQuery(e.target.value); setFromLoc(null); }}
                />
                <input
                  className="w-full bg-slate-100 py-3.5 px-4 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-sky-100 font-semibold text-slate-800 placeholder:font-medium placeholder:text-slate-400"
                  placeholder={t.to} value={toQuery}
                  onFocus={() => setActiveInput("to")}
                  onChange={(e) => { setToQuery(e.target.value); setToLoc(null); }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
            {activeInput === "from" && !isSearching && (
              <div onClick={handleUseCurrentLocation} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition">
                <div className="bg-sky-100 text-sky-600 p-2 rounded-full"><LocateFixed className="h-5 w-5" /></div>
                <span className="font-semibold text-sky-700 text-[16px]">{isLocating ? "..." : "Your Current Location"}</span>
              </div>
            )}

            {isSearching && (
              <div className="p-4 space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center animate-pulse">
                    <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                    <div className="flex flex-col gap-2 w-full"><div className="h-3 bg-slate-200 rounded w-1/2"></div><div className="h-2 bg-slate-100 rounded w-1/4"></div></div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && searchResults.map((loc) => {
              const nameEn = loc.name_en || "Unknown";
              const nameHi = loc.name_hi || nameEn;
              const primaryName = lang === "en" ? nameEn.split(",")[0] : nameHi;
              const secondaryName = nameEn.includes(",") ? nameEn.split(",").slice(1).join(",") : null;

              return (
                <div key={loc.id} onClick={() => selectLocation(loc)} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition">
                  <div className="bg-slate-100 p-2.5 rounded-full flex-shrink-0">
                    {loc.isCustom ? <MapPin className="h-5 w-5 text-slate-500" /> : <Bus className="h-5 w-5 text-slate-500" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-[16px]">{primaryName}</span>
                    {secondaryName && <span className="text-[13px] text-slate-500 font-medium truncate">{secondaryName}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 3: RESULTS (Map Visible) */}
      {view === 'results' && (
        <>
          <button onClick={resetToHome} className="absolute top-12 left-4 z-40 bg-white p-3 rounded-full shadow-md border border-slate-100 active:scale-95 transition-all">
            <ArrowLeft className="h-6 w-6 text-slate-700" />
          </button>

          {isNight && routes.length > 0 && (
            <div className="absolute top-28 left-4 right-4 z-30 bg-orange-50 border border-orange-200 p-3 rounded-2xl shadow-lg flex gap-3 items-start animate-in slide-in-from-top-4">
              <Clock className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-orange-900">{t.off}</span>
                <span className="text-xs font-semibold text-orange-800">{t.offMsg}</span>
              </div>
            </div>
          )}

          {routeError && (
            <div className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-[0_-5px_25px_rgba(0,0,0,0.1)] flex flex-col pb-8 animate-in slide-in-from-bottom-full">
              <div className="w-full flex justify-center py-3 flex-shrink-0"><div className="w-12 h-1.5 bg-slate-200 rounded-full"></div></div>
              <div className="bg-slate-50 p-6 m-4 mt-0 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-3">
                <div className="bg-white p-3 rounded-full shadow-sm"><AlertCircle className="h-6 w-6 text-sky-500" /></div>
                <div><h3 className="font-semibold text-slate-800 text-lg">{t.err}</h3></div>
                <button onClick={openUber} className="mt-4 w-full bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 active:scale-95"><Car className="h-5 w-5"/> {t.cab}</button>
              </div>
            </div>
          )}

          {routes.length > 0 && !routeError && (
            <div className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] flex flex-col h-[65vh] animate-in slide-in-from-bottom-full duration-300">
              <div className="w-full flex justify-center pt-4 pb-3 flex-shrink-0 bg-white rounded-t-3xl z-50">
                 <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
              </div>
              
              <div className="flex gap-2 px-5 pb-3 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>All Options</button>
                <button onClick={() => setFilter('vikram')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'vikram' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-700'}`}>Vikrams</button>
                <button onClick={() => setFilter('bus')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'bus' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700'}`}>City Bus</button>
                <button onClick={() => setFilter('magic')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === 'magic' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700'}`}>Tata Magic</button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 space-y-4 pb-8">
                {filteredRoutes.length === 0 ? (
                   <div className="text-center text-slate-500 font-medium py-10">No routes match this filter.</div>
                ) : filteredRoutes.map((journey, idx) => {
                  const compressedLegs = compressLegs(journey.legs);
                  const totalFare = compressedLegs.reduce((sum, leg) => sum + (leg.fare || 0), 0);
                  const isDirectWalk = compressedLegs.length === 1 && compressedLegs[0].type === "direct_walk";
                  const hasCab = compressedLegs.some((l) => l.mode === "cab");
                  const isExpanded = expandedRoute === idx;

                  return (
                    <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300">
                      <div onClick={() => { setExpandedRoute(isExpanded ? null : idx); drawRouteOnMap(journey.legs); triggerHaptic(); }} className="p-5 cursor-pointer hover:bg-slate-50 flex justify-between items-center">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1 text-slate-800">
                            <span className="font-bold text-3xl tracking-tight">{Math.round(journey.totalMins)}</span>
                            <span className="text-md font-semibold text-slate-400">min</span>
                          </div>
                          {!isDirectWalk && (
                            <span className="text-[14px] font-semibold text-emerald-600 flex items-center mt-0.5">
                              <IndianRupee className="h-3.5 w-3.5 mr-0.5" />{totalFare} est.
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isDirectWalk ? (
                            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Footprints className="h-3 w-3" /> Walk</span>
                          ) : hasCab ? (
                            <span className="text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Car className="h-3 w-3" /> Cab Connect</span>
                          ) : (
                            <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                              {journey.transfers === 0 ? "Direct" : `${journey.transfers} Transfer`}
                            </span>
                          )}
                          <ChevronDown className={`h-5 w-5 text-slate-400 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-50 bg-slate-50/50">
                          <div className="flex flex-col pl-3 mt-4">
                            {compressedLegs.map((leg: any, i: number) => {
                              const route = ROUTES.find((r) => r.id === leg.routeId);
                              const stopNode = STOPS[leg.toStop];
                              const stopNameEn = stopNode?.name_en || "";
                              const stopNameHi = stopNode?.name_hi || stopNameEn;
                              const toName = leg.toStop === "custom_end" ? (lang === 'en' ? 'destination' : 'मंजिल') : lang === "en" ? stopNameEn : stopNameHi;
                              const isLast = i === compressedLegs.length - 1;
                              const style = getStyleForMode(leg.type || leg.mode);

                              return (
                                <div key={i} className={`relative pl-8 pb-7 ${!isLast ? "border-l-[2px] border-slate-200" : ""}`}>
                                  <div className="absolute -left-[13px] top-0 bg-slate-50 py-1">
                                    <div className={`p-1.5 rounded-full shadow-sm ${style.bg} ${style.text}`}>
                                        {leg.mode === 'walk' || leg.type === 'direct_walk' ? <Footprints className="h-3.5 w-3.5" /> :
                                         leg.mode === 'cab' ? <Car className="h-3.5 w-3.5" /> : <Bus className="h-3.5 w-3.5"/>}
                                    </div>
                                  </div>

                                  <div className="-mt-1 flex-1">
                                    {leg.type === "first_mile" || leg.type === "last_mile" ? (
                                      <div className="flex flex-col">
                                        {leg.mode !== "walk" && (
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${style.bg} ${style.text}`}>
                                              {leg.mode === "cab" ? "Cab / Auto" : "E-Rickshaw"}
                                            </span>
                                            <span className="text-[12px] font-semibold text-slate-500">~₹{leg.fare}</span>
                                          </div>
                                        )}
                                        <span className="text-[15px] font-semibold text-slate-800 tracking-tight">{leg.mode === "walk" ? `Walk ${formatDist(leg.distKm)}` : `Ride ${formatDist(leg.distKm)}`}</span>
                                        <span className="text-[13px] text-slate-500 font-medium mt-0.5">
                                          {leg.type === "last_mile" && leg.mode !== "walk" ? `Transit ends. Continue to ${toName}` : `towards ${toName}`}
                                        </span>
                                      </div>
                                    ) : leg.type === "direct_walk" ? (
                                      <div className="flex flex-col">
                                        <span className="text-[15px] font-semibold text-slate-800 tracking-tight">Walk {formatDist(leg.distKm)}</span>
                                        <span className="text-[13px] text-slate-500 font-medium mt-0.5">to {toName}</span>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${style.bg} ${style.text}`}>
                                              {route?.label}
                                          </span>
                                        </div>
                                        <span className="text-[15px] font-semibold text-slate-800 tracking-tight">Ride {formatDist(leg.distKm)}</span>
                                        <span className="text-[13px] text-slate-500 font-medium mt-0.5">Get off near {toName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="relative pl-8">
                              <div className="absolute -left-[9px] top-1">
                                <div className="h-4 w-4 rounded-full border-[3px] border-slate-800 bg-white shadow-sm"></div>
                              </div>
                              <div className="font-bold text-[15px] text-slate-800 tracking-tight mt-0.5">Arrive</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}