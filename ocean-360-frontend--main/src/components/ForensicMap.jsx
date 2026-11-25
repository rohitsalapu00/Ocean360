import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Rectangle,
  CircleMarker,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Key, Crosshair, Compass, Navigation, Play, Pause, Clock, RotateCcw } from 'lucide-react';
import MapApiKeyModal from './MapApiKeyModal';
import { resolveMaritimeRegion } from '../normalizeCase';

// Robust coordinate parser to avoid "Invalid LatLng" Leaflet errors
const parseCoord = (pt) => {
  if (!pt) return null;
  if (Array.isArray(pt) && pt.length >= 2) {
    const lat = Number(pt[0]);
    const lon = Number(pt[1]);
    if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
  }
  if (typeof pt === 'object') {
    const lat = Number(pt.lat ?? pt.latitude ?? pt.centroid_lat);
    const lon = Number(pt.lon ?? pt.lng ?? pt.longitude ?? pt.centroid_lon);
    if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
  }
  return null;
};

// Clean tactical marker icons
const createIcon = (color, label, pulse = false) => {
  return L.divIcon({
    className: `custom-map-icon ${pulse ? 'pulse-marker' : ''}`,
    html: `<div style="
      width:26px; height:26px; border-radius:50%; background:${color}; border:2px solid #FFFFFF;
      box-shadow: 0 0 10px ${color};
      display:flex; align-items:center; justify-content:center;
      color:white; font-size:9px; font-weight:800; font-family:monospace;
    ">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
};

const centroidIcon = createIcon('#FF3366', 'SAR', true);
const originIcon = createIcon('#FFD600', 'ORG');

function MapRecenter({ bounds, center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true });
    } else if (center) {
      map.setView(center, zoom || 11);
    }
  }, [bounds, center, zoom, map]);
  return null;
}

function VesselFocus({ suspects, selectedMmsi }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedMmsi) return;
    const vessel = suspects.find(s => s.mmsi === selectedMmsi);
    if (!vessel || !vessel.track || !Array.isArray(vessel.track) || vessel.track.length === 0) return;
    const pts = vessel.track.map(parseCoord).filter(Boolean);
    if (pts.length > 0) {
      const b = L.latLngBounds(pts);
      map.fitBounds(b, { padding: [60, 60], maxZoom: 13, animate: true });
    }
  }, [selectedMmsi, suspects, map]);
  return null;
}

export default function ForensicMap({ caseData, suspects = [], selectedMmsi, onSelectSuspect }) {
  if (!caseData) return null;

  const det = caseData?.detection || {};
  const hindcast = caseData?.hindcast || {};

  const centroid = parseCoord(det.centroid) || [18.9182, 72.7845];
  const origin = parseCoord(hindcast.origin) || [18.8350, 72.6920];
  const regionName = caseData?.region || resolveMaritimeRegion(centroid[0], centroid[1], caseData);
  const originRegionName = hindcast?.origin_region || resolveMaritimeRegion(origin[0], origin[1], caseData);
  const mapCenter = parseCoord(caseData?.map?.center) || centroid;
  const mapZoom = caseData?.map?.zoom || 11;

  // Hindcast Simulation Selection (for cases with multiple simulations)
  const simulations = hindcast.simulations || [];
  const [selectedSimIndex, setSelectedSimIndex] = useState(0);

  const activeSimulation = useMemo(() => {
    if (simulations.length > 0 && simulations[selectedSimIndex]) {
      return simulations[selectedSimIndex];
    }
    return null;
  }, [simulations, selectedSimIndex]);

  // Active Trajectory points
  const trajectoryPolyline = useMemo(() => {
    if (activeSimulation && activeSimulation.trajectory && activeSimulation.trajectory.length > 0) {
      return activeSimulation.trajectory.map(parseCoord).filter(Boolean);
    }
    const rawTraj = hindcast.trajectory || [];
    return rawTraj.map(parseCoord).filter(Boolean);
  }, [activeSimulation, hindcast.trajectory]);

  // Map API Key State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('sih_map_api_key') ||
      import.meta.env.VITE_CARTO_API_KEY ||
      import.meta.env.VITE_MAP_API_KEY ||
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ||
      '';
  });

  // Timeline Playback Animation State (0 = Detection/Observation, 24 = Origin window)
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeStep, setTimeStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStep(prev => {
          if (prev >= 24) return 0;
          return prev + 1;
        });
      }, 750);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Interpolated animated drifting slick position along hindcast trajectory
  const animatedSlickPos = useMemo(() => {
    if (!trajectoryPolyline || trajectoryPolyline.length < 2) return centroid;
    const ratio = Math.min(1, Math.max(0, timeStep / 24));
    const maxIdx = trajectoryPolyline.length - 1;
    const exactIdx = (1 - ratio) * maxIdx;
    const lower = Math.floor(exactIdx);
    const upper = Math.min(maxIdx, lower + 1);
    const fraction = exactIdx - lower;

    const p1 = trajectoryPolyline[lower] || centroid;
    const p2 = trajectoryPolyline[upper] || p1;

    return [
      p1[0] + (p2[0] - p1[0]) * fraction,
      p1[1] + (p2[1] - p1[1]) * fraction
    ];
  }, [trajectoryPolyline, timeStep, centroid]);
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('sih_map_provider') || 'carto';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Basemap Selection: Default to Esri Satellite Earth Imagery
  const [selectedBasemap, setSelectedBasemap] = useState(() => {
    return localStorage.getItem('sih_basemap') || 'esri_satellite';
  });

  const BASEMAPS = useMemo(() => {
    if (provider === 'mapbox' && apiKey && apiKey.startsWith('pk.')) {
      return {
        mapbox_satellite: {
          name: 'Mapbox High-Res Satellite',
          url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${apiKey}`,
          attribution: '&copy; Mapbox &copy; OpenStreetMap',
          maxZoom: 19
        },
        mapbox_dark: {
          name: 'Mapbox Dark (Tactical)',
          url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${apiKey}`,
          attribution: '&copy; Mapbox &copy; OpenStreetMap',
          maxZoom: 19
        }
      };
    }

    return {
      esri_satellite: {
        name: 'Satellite Earth Imagery (Esri High-Res)',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, Earthstar Geographics',
        maxZoom: 18
      },
      carto_voyager: {
        name: 'CARTO Voyager (Oceans & Coastal)',
        url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        attribution: '&copy; Leaflet | Tiles &copy; CARTO',
        maxZoom: 19
      },
      carto_light: {
        name: 'CARTO Light Positron',
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; Leaflet | Tiles &copy; CARTO',
        maxZoom: 19
      },
      carto_dark: {
        name: 'CARTO Dark Matter (Tactical)',
        url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attribution: '&copy; Leaflet | Tiles &copy; CARTO',
        maxZoom: 19
      },
      osm_standard: {
        name: 'OpenStreetMap (Standard Hydrography)',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }
    };
  }, [apiKey, provider]);

  const currentBasemap = BASEMAPS[selectedBasemap] || BASEMAPS.esri_satellite;

  const handleSelectBasemap = (key) => {
    setSelectedBasemap(key);
    localStorage.setItem('sih_basemap', key);
  };

  // SAR Slick Bounding Box (dashed cyan rectangle)
  const boundingBox = useMemo(() => {
    const cLat = centroid[0];
    const cLon = centroid[1];
    const halfLat = det.major_axis_km ? (det.major_axis_km / 111) * 0.6 : 0.04;
    const halfLon = det.minor_axis_km ? (det.minor_axis_km / 111) * 0.6 : 0.05;
    return [
      [cLat - halfLat, cLon - halfLon],
      [cLat + halfLat, cLon + halfLon]
    ];
  }, [centroid, det.major_axis_km, det.minor_axis_km]);

  // Oil spill polygon shape (slick footprint)
  const slickPolygon = useMemo(() => {
    const cLat = centroid[0];
    const cLon = centroid[1];
    const rMajor = det.major_axis_km ? (det.major_axis_km / 111) * 0.35 : 0.025;
    const rMinor = det.minor_axis_km ? (det.minor_axis_km / 111) * 0.25 : 0.015;

    // Generate multi-lobed slick geometry
    return [
      [cLat - rMajor * 0.7, cLon - rMinor * 1.5],
      [cLat + rMajor * 0.3, cLon - rMinor * 0.8],
      [cLat + rMajor * 1.0, cLon + rMinor * 0.4],
      [cLat + rMajor * 0.5, cLon + rMinor * 1.4],
      [cLat - rMajor * 0.4, cLon + rMinor * 1.0],
      [cLat - rMajor * 0.9, cLon - rMinor * 0.4]
    ];
  }, [centroid, det.major_axis_km, det.minor_axis_km]);

  // Auto-fit map bounds
  const allBounds = useMemo(() => {
    const coords = [];
    if (centroid) coords.push(centroid);
    if (origin) coords.push(origin);
    trajectoryPolyline.forEach(pt => coords.push(pt));
    suspects.forEach(s => {
      if (s.track && Array.isArray(s.track)) {
        s.track.forEach(pt => {
          const p = parseCoord(pt);
          if (p) coords.push(p);
        });
      }
    });

    if (coords.length < 2) return null;
    return L.latLngBounds(coords);
  }, [centroid, origin, trajectoryPolyline, suspects]);

  return (
    <div className="bg-white text-[#0F172A] border border-slate-200 rounded-2xl shadow-xs flex flex-col h-full overflow-hidden relative isolate z-0">
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 md:px-4 py-2 border-b border-slate-200 bg-[#F8FAFC] z-10 gap-2">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#0284C7]" />
          <span className="text-xs font-bold tracking-wider uppercase text-[#0F172A] font-sans">
            TACTICAL MARITIME RADAR MAP
          </span>
          <span className="hidden md:inline-block text-[10px] font-mono text-[#0284C7] font-bold">
            [{centroid[0].toFixed(4)}°N, {centroid[1].toFixed(4)}°E]
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
            📍 {regionName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Multiple Simulation Selector (if case has simulations) */}
          {simulations.length > 1 && (
            <div className="flex items-center gap-1 text-xs">
              <Navigation className="w-3.5 h-3.5 text-[#00E676]" />
              <select
                value={selectedSimIndex}
                onChange={(e) => setSelectedSimIndex(Number(e.target.value))}
                className="text-xs font-sans font-semibold bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-[#0284C7] transition-colors"
              >
                {simulations.map((sim, i) => (
                  <option key={sim.id || i} value={i}>
                    {sim.name || `Simulation ${i + 1} (${sim.duration_hours || 24}h)`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Basemap Switcher */}
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedBasemap}
              onChange={(e) => handleSelectBasemap(e.target.value)}
              id="select-basemap"
              className="text-xs font-sans font-semibold bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:border-[#0284C7] transition-colors"
            >
              {Object.entries(BASEMAPS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Key status */}
          <button
            onClick={() => setIsKeyModalOpen(true)}
            id="btn-open-map-key-modal"
            title="Configure Map Tiles API Key"
            className="text-xs font-sans font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0284C7] transition-colors cursor-pointer"
          >
            <Key className="w-3 h-3 text-[#0284C7]" />
            <span className="hidden sm:inline">{apiKey ? 'Key Active' : 'API Key'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="flex-1 relative w-full h-full min-h-[520px] z-0 overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full bg-[#060B14]"
          scrollWheelZoom={true}
        >
          <TileLayer
            key={selectedBasemap}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
            maxZoom={currentBasemap.maxZoom}
            subdomains={['a', 'b', 'c']}
          />

          <MapRecenter bounds={allBounds} center={mapCenter} zoom={mapZoom} />
          <VesselFocus suspects={suspects} selectedMmsi={selectedMmsi} />

          {/* SAR Slick Bounding Box (cyan dashed rectangle) */}
          {boundingBox && (
            <Rectangle
              bounds={boundingBox}
              pathOptions={{
                color: '#00D2FF',
                weight: 1.5,
                dashArray: '4, 4',
                fillOpacity: 0.04,
                fillColor: '#00D2FF'
              }}
            />
          )}

          {/* Oil Slick Polygon (Red polygon) */}
          {slickPolygon && (
            <Polygon
              positions={slickPolygon}
              pathOptions={{
                color: '#FF3366',
                weight: 2,
                fillColor: '#FF3366',
                fillOpacity: 0.7
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs font-sans text-slate-900">
                  <div className="font-bold text-rose-600 font-mono">
                    DETECTED OIL SPILL SLICK
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Location / Region: <strong className="text-[#0284C7]">{regionName}</strong>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Area: <strong>{det.area_km2 != null ? `${Number(det.area_km2).toFixed(2)} km²` : 'N/A'}</strong>
                  </div>
                  {det.perimeter_km != null && (
                    <div className="text-[11px] text-slate-600">
                      Perimeter: <strong>{det.perimeter_km} km</strong>
                    </div>
                  )}
                  {det.major_axis_km != null && (
                    <div className="text-[11px] text-slate-600">
                      Axes: <strong>{det.major_axis_km} km × {det.minor_axis_km} km</strong>
                    </div>
                  )}
                  {det.orientation_deg != null && (
                    <div className="text-[11px] text-slate-600">
                      Orientation: <strong>{det.orientation_deg}°</strong>
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>
          )}

          {/* Reverse Drift Trajectory Polyline */}
          {trajectoryPolyline.length > 1 && (
            <Polyline
              positions={trajectoryPolyline}
              pathOptions={{
                color: '#00E676',
                weight: 2.5,
                dashArray: '4, 4',
                opacity: 0.95
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs font-sans text-slate-900">
                  <div className="font-bold text-emerald-600 font-mono">
                    LAGRANGIAN DRIFT TRAJECTORY
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Duration: <strong>{hindcast.duration_hours || 24} hours back</strong>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Confidence: <strong>{hindcast.confidence != null ? `${(hindcast.confidence > 1 ? hindcast.confidence : hindcast.confidence * 100).toFixed(1)}%` : 'N/A'}</strong>
                  </div>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* Suspect Vessel Track Polylines & Markers (ONLY FILTERED CANDIDATES) */}
          {suspects.map((suspect, idx) => {
            const isSelected = suspect.mmsi === selectedMmsi;
            const pts = suspect.track ? suspect.track.map(parseCoord).filter(Boolean) : [];
            const lastPt = pts.length > 0
              ? pts[pts.length - 1]
              : (suspect.lat != null && suspect.lon != null && !isNaN(Number(suspect.lat)) && !isNaN(Number(suspect.lon))
                  ? [Number(suspect.lat), Number(suspect.lon)]
                  : null);

            // Color coding based on rank
            const trackColor = isSelected
              ? '#00D2FF'
              : idx === 0
              ? '#FF3366'
              : idx === 1
              ? '#FFD600'
              : '#00E676';

            return (
              <React.Fragment key={`vessel-${suspect.mmsi}`}>
                {/* AIS Vessel Track Polyline */}
                {pts.length >= 2 && (
                  <Polyline
                    positions={pts}
                    eventHandlers={{ click: () => onSelectSuspect(suspect.mmsi) }}
                    pathOptions={{
                      color: trackColor,
                      weight: isSelected ? 3.5 : 2,
                      opacity: isSelected ? 1 : 0.85,
                      dashArray: '4, 4'
                    }}
                  >
                    <Popup>
                      <div className="space-y-1 text-xs font-sans text-slate-900">
                        <div className="font-bold text-[#0284C7] font-mono">
                          {suspect.name} (Rank #{suspect.rank || idx + 1})
                        </div>
                        <div className="text-[11px] text-slate-600">
                          MMSI: <strong>{suspect.mmsi}</strong> · Type: <strong>{suspect.type}</strong>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Attribution Score: <strong>{suspect.score != null ? `${suspect.score.toFixed(1)}%` : 'N/A'}</strong>
                        </div>
                      </div>
                    </Popup>
                  </Polyline>
                )}

                {/* Vessel Position Marker */}
                {lastPt && (
                  <CircleMarker
                    center={lastPt}
                    radius={isSelected ? 7 : 5}
                    eventHandlers={{ click: () => onSelectSuspect(suspect.mmsi) }}
                    pathOptions={{
                      color: '#FFFFFF',
                      fillColor: trackColor,
                      fillOpacity: 1,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="space-y-1.5 text-xs font-sans text-slate-900 min-w-[200px]">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                          <span className="font-bold text-slate-900 font-mono">{suspect.name}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Rank #{suspect.rank || idx + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-slate-600">
                          <div>MMSI: <strong className="font-mono text-slate-900">{suspect.mmsi}</strong></div>
                          <div>Type: <strong className="text-slate-900">{suspect.type || 'N/A'}</strong></div>
                          <div>Flag: <strong className="text-slate-900">{suspect.flag || 'N/A'}</strong></div>
                          <div>Distance: <strong className="text-slate-900">{suspect.distance_km != null ? `${suspect.distance_km} km` : 'N/A'}</strong></div>
                          <div>Dwell: <strong className="text-slate-900">{suspect.dwell_time_mins != null ? `${suspect.dwell_time_mins} min` : 'N/A'}</strong></div>
                          <div>Speed: <strong className="text-slate-900">{suspect.avg_speed_knots != null ? `${suspect.avg_speed_knots} kn` : 'N/A'}</strong></div>
                          <div>Time Offset: <strong className="text-slate-900">{suspect.time_offset_hours != null ? `${suspect.time_offset_hours > 0 ? '+' : ''}${suspect.time_offset_hours} h` : '±0h'}</strong></div>
                          <div>Backend Score: <strong className="text-slate-900">{suspect.backend_score != null ? `${suspect.backend_score}%` : 'N/A'}</strong></div>
                        </div>

                        <div className="pt-1 border-t border-slate-200 flex justify-between items-center text-[11px]">
                          <span className="text-slate-500 font-medium">Calculated Score:</span>
                          <span className="font-bold text-[#0284C7] font-mono text-xs">
                            {suspect.score != null ? `${suspect.score.toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>

                        {suspect.justification && (
                          <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200 leading-tight">
                            {suspect.justification}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                )}
              </React.Fragment>
            );
          })}

          {/* Slick Centroid Marker */}
          {centroid && (
            <Marker position={centroid} icon={centroidIcon}>
              <Popup>
                <div className="space-y-1 text-xs font-sans text-slate-900">
                  <div className="font-bold text-rose-600 font-mono">
                    SAR SLICK CENTROID (DETECTION POINT)
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Location / Region: <strong className="text-[#0284C7]">{regionName}</strong>
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    {centroid[0].toFixed(4)}°N, {centroid[1].toFixed(4)}°E
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Time: {det.detection_time || 'N/A'}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Animated Drifting Slick Position during Playback */}
          {timeStep > 0 && animatedSlickPos && (
            <CircleMarker
              center={animatedSlickPos}
              radius={11}
              pathOptions={{
                color: '#FFD600',
                fillColor: '#FF3366',
                fillOpacity: 0.85,
                weight: 3
              }}
            >
              <Popup>
                <div className="space-y-1 text-xs font-sans">
                  <div className="font-bold text-[#D97706] font-mono">
                    DRIFTING SLICK (T - {timeStep}h)
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Position: {animatedSlickPos[0].toFixed(4)}°N, {animatedSlickPos[1].toFixed(4)}°E
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )}

          {/* Release Origin Marker */}
          {origin && (
            <Marker position={origin} icon={originIcon}>
              <Popup>
                <div className="space-y-1 text-xs font-sans text-slate-900">
                  <div className="font-bold text-amber-600 font-mono">
                    PROBABLE SPILL RELEASE ORIGIN
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Origin Vicinity: <strong className="text-[#D97706]">{originRegionName}</strong>
                  </div>
                  <div className="text-[11px] font-mono text-slate-600">
                    {origin[0].toFixed(4)}°N, {origin[1].toFixed(4)}°E
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Estimated Time: {hindcast.release_time || 'N/A'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Confidence: <strong>{hindcast.confidence != null ? `${(hindcast.confidence > 1 ? hindcast.confidence : hindcast.confidence * 100).toFixed(1)}%` : 'N/A'}</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Timeline Playback Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2.5 shadow-lg flex flex-wrap items-center justify-between gap-2.5 font-sans">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title={isPlaying ? 'Pause Drift Simulation' : 'Play Drift Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0284C7]" />
                <span>Lagrangian Playback: <strong>{timeStep === 0 ? 'Observation (0h)' : `T - ${timeStep}h`}</strong></span>
              </div>
              <div className="text-[9px] font-mono text-slate-500">
                {timeStep === 0 ? 'Satellite Snapshot' : timeStep >= 24 ? 'Estimated Spill Release Origin' : 'Drifting along current corridor'}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="flex-1 min-w-[140px] max-w-xs flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-400">0h</span>
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              value={timeStep}
              onChange={(e) => setTimeStep(Number(e.target.value))}
              className="w-full cursor-pointer accent-[#0284C7] h-1.5 bg-slate-200 rounded-lg"
            />
            <span className="text-[10px] font-mono font-bold text-[#D97706]">-24h</span>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTimeStep(0)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                timeStep === 0 ? 'bg-[#0284C7] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Detection
            </button>
            <button
              onClick={() => setTimeStep(12)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                timeStep === 12 ? 'bg-[#0284C7] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              -12h
            </button>
            <button
              onClick={() => setTimeStep(24)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                timeStep === 24 ? 'bg-[#D97706] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              -24h Origin
            </button>
          </div>
        </div>
      </div>

      {/* Map Api Key Modal */}
      <MapApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentKey={apiKey}
        currentProvider={provider}
        onSaveKey={(k) => {
          setApiKey(k);
          if (k) localStorage.setItem('sih_map_api_key', k);
          else localStorage.removeItem('sih_map_api_key');
        }}
        onSaveProvider={(p) => {
          setProvider(p);
          localStorage.setItem('sih_map_provider', p);
        }}
      />
    </div>
  );
}
