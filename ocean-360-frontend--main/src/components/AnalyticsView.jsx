import React, { useState, useMemo } from 'react';
import {
  Activity, AlertTriangle, Droplet, Grid, Ship, Clock,
  Compass, BarChart3, Filter, CheckCircle2, ArrowRight,
  TrendingUp, Navigation, Crosshair, Layers, Gauge,
  Download, Printer, GitCompare, Radar
} from 'lucide-react';

export default function AnalyticsView({
  caseData,
  filteredCandidates = [],
  allCandidates = [],
  filterImpact = {},
  selectedMmsi,
  onSelectSuspect,
  onOpenExport,
  onOpenCompare
}) {
  // Dataset mode selector: 'filtered' (default) | 'all'
  const [datasetMode, setDatasetMode] = useState('filtered');

  // Tooltip state for interactive charts
  const [hoveredCandidate, setHoveredCandidate] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const activeCandidates = datasetMode === 'filtered' ? filteredCandidates : allCandidates;

  const det = caseData?.detection || {};
  const hindcast = caseData?.hindcast || {};
  const caseId = caseData?.case_id || 'CASE';

  const lat = det.centroid ? det.centroid[0] : (det.lat || 18.9182);
  const lon = det.centroid ? det.centroid[1] : (det.lon || 72.7845);

  const originLat = hindcast.origin ? (Array.isArray(hindcast.origin) ? hindcast.origin[0] : hindcast.origin.lat) : 18.8350;
  const originLon = hindcast.origin ? (Array.isArray(hindcast.origin) ? hindcast.origin[1] : (hindcast.origin.lon ?? hindcast.origin.lng)) : 72.6920;

  // ─────────────────────────────────────────────────────────
  // D. CANDIDATE SUMMARY CALCULATIONS
  // ─────────────────────────────────────────────────────────
  const summaryMetrics = useMemo(() => {
    if (!activeCandidates || activeCandidates.length === 0) {
      return {
        total: allCandidates.length,
        filtered: filteredCandidates.length,
        topCandidate: null,
        highestScore: 0,
        nearestVessel: null,
        longestDwell: null,
        fastestVessel: null,
        avgSpeed: 0
      };
    }

    const sortedByScore = [...activeCandidates].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const sortedByDist = [...activeCandidates].filter(c => c.distance_km != null).sort((a, b) => a.distance_km - b.distance_km);
    const sortedByDwell = [...activeCandidates].filter(c => c.dwell_time_mins != null).sort((a, b) => b.dwell_time_mins - a.dwell_time_mins);
    const sortedBySpeed = [...activeCandidates].filter(c => c.avg_speed_knots != null).sort((a, b) => b.avg_speed_knots - a.avg_speed_knots);

    const speedSum = activeCandidates.reduce((acc, c) => acc + (c.avg_speed_knots || 0), 0);
    const speedCount = activeCandidates.filter(c => c.avg_speed_knots != null).length || 1;

    return {
      total: allCandidates.length,
      filtered: filteredCandidates.length,
      topCandidate: sortedByScore[0] || null,
      highestScore: sortedByScore[0]?.score ?? 0,
      nearestVessel: sortedByDist[0] || null,
      longestDwell: sortedByDwell[0] || null,
      fastestVessel: sortedBySpeed[0] || null,
      avgSpeed: Number((speedSum / speedCount).toFixed(1))
    };
  }, [activeCandidates, allCandidates, filteredCandidates]);

  // ─────────────────────────────────────────────────────────
  // I. SHIP TYPE DISTRIBUTION
  // ─────────────────────────────────────────────────────────
  const shipTypeCounts = useMemo(() => {
    const counts = { 'Oil Tanker': 0, 'Product Tanker': 0, 'Cargo': 0, 'Other': 0 };
    activeCandidates.forEach(c => {
      const cat = c.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [activeCandidates]);

  // ─────────────────────────────────────────────────────────
  // J. DISTANCE DISTRIBUTION (HISTOGRAM)
  // ─────────────────────────────────────────────────────────
  const distanceDistribution = useMemo(() => {
    const bins = [
      { label: '< 2 km', min: 0, max: 2, count: 0 },
      { label: '2 - 5 km', min: 2, max: 5, count: 0 },
      { label: '5 - 10 km', min: 5, max: 10, count: 0 },
      { label: '10 - 20 km', min: 10, max: 20, count: 0 },
      { label: '> 20 km', min: 20, max: 999, count: 0 }
    ];

    activeCandidates.forEach(c => {
      if (c.distance_km != null) {
        const bin = bins.find(b => c.distance_km >= b.min && c.distance_km < b.max) || bins[bins.length - 1];
        bin.count += 1;
      }
    });

    return bins;
  }, [activeCandidates]);

  // ─────────────────────────────────────────────────────────
  // L. VESSEL SPEED STATISTICS
  // ─────────────────────────────────────────────────────────
  const speedStats = useMemo(() => {
    const speeds = activeCandidates.map(c => c.avg_speed_knots).filter(s => s != null).sort((a, b) => a - b);
    if (speeds.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };

    const min = speeds[0];
    const max = speeds[speeds.length - 1];
    const sum = speeds.reduce((a, b) => a + b, 0);
    const avg = Number((sum / speeds.length).toFixed(1));
    const mid = Math.floor(speeds.length / 2);
    const median = speeds.length % 2 !== 0 ? speeds[mid] : Number(((speeds[mid - 1] + speeds[mid]) / 2).toFixed(1));

    return { min, max, avg, median };
  }, [activeCandidates]);

  // Helper for scatter hover
  const handleScatterEnter = (e, c) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 8 });
    setHoveredCandidate(c);
  };

  const handleScatterLeave = () => {
    setHoveredCandidate(null);
  };

  return (
    <div className="space-y-4 max-w-[1920px] mx-auto w-full animate-fade-in text-[#0F172A] font-sans pb-8">
      {/* ─────────────────────────────────────────────────────────
          HEADER & DATASET SWITCHER (Requirement 17)
      ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#0F172A]">
              Operational Analytics & Forensic Attribution Engine
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Active Case: <strong className="text-[#0284C7]">{caseId}</strong> · Hindcast Origin: [{Number(originLat).toFixed(4)}°N, {Number(originLon).toFixed(4)}°E]
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Analytics Dataset Selector */}
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 px-2 font-sans">
              Analytics Dataset:
            </span>
            <button
              onClick={() => setDatasetMode('filtered')}
              className={`text-xs font-sans px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                datasetMode === 'filtered'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Filtered Candidates ({filteredCandidates.length})
            </button>
            <button
              onClick={() => setDatasetMode('all')}
              className={`text-xs font-sans px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                datasetMode === 'all'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Candidates ({allCandidates.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                title="Compare top candidate vessels side-by-side"
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#0284C7] border border-sky-200 text-xs font-bold font-sans flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Candidates</span>
              </button>
            )}

            {onOpenExport && (
              <button
                onClick={onOpenExport}
                title="Export Forensic Briefing Report (PDF, CSV, JSON)"
                className="px-3.5 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export Report (PDF)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          A. CASE OVERVIEW CARDS (Requirement 16.A)
      ───────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase px-1">
          A. Case Overview & Observation Parameters
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Case ID</div>
            <div className="text-xs font-mono font-bold text-[#0284C7] mt-1 truncate">{caseId}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Case Status</div>
            <div className="text-xs font-mono font-bold text-emerald-700 mt-1 truncate">{caseData?.status || 'ACTIVE'}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Detection Time</div>
            <div className="text-[11px] font-mono font-bold text-slate-800 mt-1 truncate">
              {det.detection_time ? new Date(det.detection_time).toLocaleDateString() : '11 Sep 2026'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Latitude</div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">{Number(lat).toFixed(4)}°N</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Longitude</div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">{Number(lon).toFixed(4)}°E</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Spill Area</div>
            <div className="text-xs font-mono font-bold text-[#0284C7] mt-1">
              {det.area_km2 != null ? `${Number(det.area_km2).toFixed(2)} km²` : 'N/A'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Perimeter</div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              {det.perimeter_km != null ? `${det.perimeter_km} km` : 'N/A'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Major Axis</div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              {det.major_axis_km != null ? `${det.major_axis_km} km` : 'N/A'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Minor Axis</div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              {det.minor_axis_km != null ? `${det.minor_axis_km} km` : 'N/A'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium">Orientation</div>
            <div className="text-xs font-mono font-bold text-amber-700 mt-1">
              {det.orientation_deg != null ? `${det.orientation_deg}°` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          B. SPILL CHARACTERISTICS & C. HINDCAST ANALYSIS
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* B. SPILL CHARACTERISTICS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-rose-500" />
              <span>B. Slick Geometric Characteristics</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              SAR ANOMALY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            {/* Visual SVG Ellipse Representation */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center relative min-h-[160px]">
              <svg className="w-44 h-32" viewBox="0 0 160 120">
                {/* Background grid */}
                <circle cx="80" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeDasharray="3,3" />
                <line x1="80" y1="10" x2="80" y2="110" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="20" y1="60" x2="140" y2="60" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2,2" />

                {/* Rotated Ellipse */}
                <g transform={`rotate(${det.orientation_deg || 38.4}, 80, 60)`}>
                  <ellipse
                    cx="80"
                    cy="60"
                    rx={Math.min(50, Math.max(25, (det.major_axis_km || 6) * 7))}
                    ry={Math.min(35, Math.max(15, (det.minor_axis_km || 4) * 6))}
                    fill="#FF3366"
                    fillOpacity="0.25"
                    stroke="#FF3366"
                    strokeWidth="2"
                  />
                  {/* Major axis line */}
                  <line x1="35" y1="60" x2="125" y2="60" stroke="#FF3366" strokeWidth="1.5" strokeDasharray="3,2" />
                  {/* Minor axis line */}
                  <line x1="80" y1="40" x2="80" y2="80" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="80" cy="60" r="3" fill="#FF3366" />
                </g>
              </svg>
              <div className="text-[10px] font-mono text-slate-500 text-center mt-1">
                Orientation: <strong>{det.orientation_deg || 38.4}°</strong> · Centroid Marker
              </div>
            </div>

            {/* Geometry Details */}
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Spill Footprint Area:</span>
                <span className="font-mono font-bold text-[#0284C7]">{det.area_km2 != null ? `${Number(det.area_km2).toFixed(2)} km²` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Perimeter Length:</span>
                <span className="font-mono font-bold text-slate-800">{det.perimeter_km != null ? `${det.perimeter_km} km` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Major Axis:</span>
                <span className="font-mono font-bold text-slate-800">{det.major_axis_km != null ? `${det.major_axis_km} km` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Minor Axis:</span>
                <span className="font-mono font-bold text-slate-800">{det.minor_axis_km != null ? `${det.minor_axis_km} km` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Aspect Ratio (Major/Minor):</span>
                <span className="font-mono font-bold text-[#D97706]">{det.aspect_ratio != null ? `${det.aspect_ratio}:1` : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Sensor / Satellite:</span>
                <span className="font-mono text-slate-700 truncate max-w-[140px]">{det.satellite}</span>
              </div>
            </div>
          </div>
        </div>

        {/* C. HINDCAST ANALYSIS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#00E676]" />
              <span>C. Hindcast Drift Analysis & Timeline</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              LAGRANGIAN
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Duration</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{hindcast.duration_hours || 24} Hours</div>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Origin Lat/Lon</div>
              <div className="font-mono font-bold text-[#D97706] mt-0.5">{Number(originLat).toFixed(3)}°N, {Number(originLon).toFixed(3)}°E</div>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Detection Lat/Lon</div>
              <div className="font-mono font-bold text-rose-600 mt-0.5">{Number(lat).toFixed(3)}°N, {Number(lon).toFixed(3)}°E</div>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Drift Confidence</div>
              <div className="font-mono font-bold text-emerald-700 mt-0.5">
                {hindcast.confidence != null ? `${(hindcast.confidence > 1 ? hindcast.confidence : hindcast.confidence * 100).toFixed(1)}%` : '98.5%'}
              </div>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Trajectory Points</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{hindcast.trajectory?.length || 5} Waypoints</div>
            </div>
            <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500">Simulations</div>
              <div className="font-mono font-bold text-[#0284C7] mt-0.5">{hindcast.simulations?.length || 1} Run(s)</div>
            </div>
          </div>

          {/* Timeline -24h to Detection */}
          <div className="pt-2">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-2">
              Reverse Drift Timeline (-{hindcast.duration_hours || 24}h Backwards):
            </div>
            <div className="relative flex items-center justify-between px-2 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0"></div>
              {['-24h Origin', '-18h', '-12h', '-6h', 'Detection'].map((step, idx) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                    idx === 0
                      ? 'bg-[#FFD600]'
                      : idx === 4
                      ? 'bg-[#FF3366]'
                      : 'bg-[#00E676]'
                  }`}></div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 mt-1.5">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          D. CANDIDATE SUMMARY METRICS (Requirement 16.D)
      ───────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase px-1">
          D. Candidate Evidence Summary ({activeCandidates.length} Analyzed)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Total Uploaded</div>
            <div className="text-base font-mono font-bold text-slate-800 mt-0.5">{summaryMetrics.total}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Passing Filters</div>
            <div className="text-base font-mono font-bold text-[#0284C7] mt-0.5">{summaryMetrics.filtered}</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Top Candidate</div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {summaryMetrics.topCandidate?.name || 'None'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Highest Score</div>
            <div className="text-base font-mono font-bold text-[#0284C7] mt-0.5">
              {summaryMetrics.highestScore > 0 ? `${summaryMetrics.highestScore.toFixed(1)}%` : '—'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Nearest Vessel</div>
            <div className="text-xs font-mono font-bold text-emerald-700 mt-1 truncate">
              {summaryMetrics.nearestVessel ? `${summaryMetrics.nearestVessel.distance_km} km` : '—'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Longest Dwell</div>
            <div className="text-xs font-mono font-bold text-amber-700 mt-1 truncate">
              {summaryMetrics.longestDwell ? `${summaryMetrics.longestDwell.dwell_time_mins} min` : '—'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Fastest Vessel</div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1 truncate">
              {summaryMetrics.fastestVessel ? `${summaryMetrics.fastestVessel.avg_speed_knots} kn` : '—'}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Avg Candidate Speed</div>
            <div className="text-base font-mono font-bold text-slate-800 mt-0.5">
              {summaryMetrics.avgSpeed > 0 ? `${summaryMetrics.avgSpeed} kn` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          E. VESSEL ATTRIBUTION & MULTI-FACTOR RADAR FINGERPRINT
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Attribution Ranking (Horizontal Bar Chart) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#0284C7]" />
              <span>E. Vessel Attribution Ranking ({activeCandidates.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Click candidate to inspect radar
            </span>
          </div>

          {activeCandidates.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-sans">
              No candidates available in current dataset.
            </div>
          ) : (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {activeCandidates.map((cand, idx) => {
                const isSelected = cand.mmsi === (selectedMmsi || activeCandidates[0]?.mmsi);
                const isTop = idx === 0;
                const score = cand.score || 0;

                return (
                  <div
                    key={cand.mmsi}
                    onClick={() => onSelectSuspect && onSelectSuspect(cand.mmsi)}
                    className={`p-2 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-sky-50 border-[#0284C7] shadow-xs'
                        : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-sans pb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                          isTop ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">{cand.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({cand.type})</span>
                        {isTop && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            TOP CULPRIT
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-xs text-[#0284C7]">
                        {score.toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/80 rounded-full h-3.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all flex items-center justify-end pr-2 text-[9px] font-mono font-bold text-white ${
                          isTop
                            ? 'bg-gradient-to-r from-amber-500 to-[#D97706]'
                            : isSelected
                            ? 'bg-[#0284C7]'
                            : 'bg-[#0369A1]'
                        }`}
                        style={{ width: `${Math.max(8, Math.min(100, score))}%` }}
                      >
                        {cand.distance_km != null ? `${cand.distance_km}km` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Multi-Factor Forensic Spider / Radar Chart */}
        {(() => {
          const profileCand = activeCandidates.find(c => c.mmsi === selectedMmsi) || activeCandidates[0];
          
          if (!profileCand) {
            return (
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-center">
                <span className="text-xs text-slate-400">Select a candidate to view radar profile</span>
              </div>
            );
          }

          // Compute 5 forensic radar factor values (0 - 100%)
          const dist = profileCand.distance_km ?? 15;
          const f0_proximity = Math.max(10, Math.min(100, Math.round(100 - (dist / 25) * 100)));

          const dwell = profileCand.dwell_time_mins ?? 0;
          const f1_dwell = Math.max(10, Math.min(100, Math.round((dwell / 60) * 100)));

          const spd = profileCand.avg_speed_knots ?? 10;
          const f2_speed = spd >= 5 && spd <= 12
            ? Math.round(100 - Math.abs(spd - 8.5) * 5)
            : Math.max(15, Math.round(75 - Math.abs(spd - 8.5) * 5));

          const offset = Math.abs(profileCand.time_offset_hours ?? 0);
          const f3_temporal = Math.max(15, Math.min(100, Math.round(100 - offset * 18)));

          const cat = (profileCand.category || profileCand.type || '').toLowerCase();
          let f4_risk = 40;
          if (cat.includes('oil')) f4_risk = 95;
          else if (cat.includes('product')) f4_risk = 85;
          else if (cat.includes('tanker')) f4_risk = 80;
          else if (cat.includes('cargo')) f4_risk = 55;

          const factors = [f0_proximity, f1_dwell, f2_speed, f3_temporal, f4_risk];
          const angles = [
            -Math.PI / 2,
            -Math.PI / 2 + (2 * Math.PI) / 5,
            -Math.PI / 2 + (4 * Math.PI) / 5,
            -Math.PI / 2 + (6 * Math.PI) / 5,
            -Math.PI / 2 + (8 * Math.PI) / 5
          ];

          const cx = 110;
          const cy = 100;
          const maxR = 68;

          const polyPoints = factors.map((v, i) => {
            const r = (v / 100) * maxR;
            const px = cx + r * Math.cos(angles[i]);
            const py = cy + r * Math.sin(angles[i]);
            return `${px.toFixed(1)},${py.toFixed(1)}`;
          }).join(' ');

          const rings = [0.25, 0.5, 0.75, 1.0];

          return (
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                  <Radar className="w-4 h-4 text-[#D97706]" />
                  <span>Forensic Risk Fingerprint</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
                  {profileCand.score?.toFixed(1)}% Confidence
                </span>
              </div>

              {/* Profiled Vessel Identifier Banner */}
              <div className="flex items-center justify-between bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <div className="truncate">
                  <span className="text-slate-500 text-[10px]">Profile: </span>
                  <span className="font-bold text-slate-900">{profileCand.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-1">({profileCand.type})</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600 shrink-0">
                  MMSI: {profileCand.mmsi}
                </span>
              </div>

              {/* SVG 5-Axis Spider / Radar Chart */}
              <div className="flex items-center justify-center relative">
                <svg className="w-56 h-52 overflow-visible" viewBox="0 0 220 200">
                  {/* Concentric Grid Rings */}
                  {rings.map((ringScale, rIdx) => {
                    const ringPts = angles.map(a => {
                      const r = ringScale * maxR;
                      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
                    }).join(' ');

                    return (
                      <polygon
                        key={rIdx}
                        points={ringPts}
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        strokeDasharray={ringScale === 1.0 ? 'none' : '2,2'}
                      />
                    );
                  })}

                  {/* 5 Axis Radial Spokes */}
                  {angles.map((a, i) => {
                    const px = cx + maxR * Math.cos(a);
                    const py = cy + maxR * Math.sin(a);
                    return (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={px}
                        y2={py}
                        stroke="#CBD5E1"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Filled Value Polygon */}
                  <polygon
                    points={polyPoints}
                    fill="#0284C7"
                    fillOpacity="0.25"
                    stroke="#0284C7"
                    strokeWidth="2"
                  />

                  {/* Vertex Points */}
                  {factors.map((v, i) => {
                    const r = (v / 100) * maxR;
                    const px = cx + r * Math.cos(angles[i]);
                    const py = cy + r * Math.sin(angles[i]);
                    return (
                      <circle
                        key={i}
                        cx={px}
                        cy={py}
                        r="3.5"
                        fill="#0284C7"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Labels on outer perimeter */}
                  <text x="110" y="18" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Proximity ({f0_proximity}%)
                  </text>
                  <text x="185" y="75" textAnchor="start" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Dwell ({f1_dwell}%)
                  </text>
                  <text x="165" y="175" textAnchor="start" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Speed Sig ({f2_speed}%)
                  </text>
                  <text x="55" y="175" textAnchor="end" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Time Match ({f3_temporal}%)
                  </text>
                  <text x="35" y="75" textAnchor="end" fill="#475569" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    Ship Risk ({f4_risk}%)
                  </text>
                </svg>
              </div>

              {/* 5-Dimension Mini Matrix */}
              <div className="grid grid-cols-5 gap-1 text-center font-mono">
                <div className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200">
                  <div className="text-[8px] text-slate-500 uppercase">Prox</div>
                  <div className="text-[11px] font-bold text-slate-800">{f0_proximity}%</div>
                </div>
                <div className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200">
                  <div className="text-[8px] text-slate-500 uppercase">Dwell</div>
                  <div className="text-[11px] font-bold text-slate-800">{f1_dwell}%</div>
                </div>
                <div className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200">
                  <div className="text-[8px] text-slate-500 uppercase">Speed</div>
                  <div className="text-[11px] font-bold text-slate-800">{f2_speed}%</div>
                </div>
                <div className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200">
                  <div className="text-[8px] text-slate-500 uppercase">Time</div>
                  <div className="text-[11px] font-bold text-slate-800">{f3_temporal}%</div>
                </div>
                <div className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200">
                  <div className="text-[8px] text-slate-500 uppercase">Type</div>
                  <div className="text-[11px] font-bold text-slate-800">{f4_risk}%</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ─────────────────────────────────────────────────────────
          F, G, H: INTERACTIVE SCATTER PLOTS (3-Column Grid)
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* F. DISTANCE VS SCORE SCATTER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center justify-between border-b border-slate-200 pb-2">
            <span>F. Distance vs Score</span>
            <span className="text-[10px] font-mono text-slate-400">X: km · Y: %</span>
          </div>

          <div className="relative h-44 w-full bg-[#F8FAFC] rounded-xl border border-slate-200 p-2 flex items-center justify-center">
            {activeCandidates.length === 0 ? (
              <span className="text-xs text-slate-400">No data</span>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 240 140">
                {/* Axes */}
                <line x1="30" y1="120" x2="230" y2="120" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="120" stroke="#CBD5E1" strokeWidth="1" />
                <text x="5" y="20" fill="#64748B" fontSize="9" fontFamily="monospace">100</text>
                <text x="15" y="123" fill="#64748B" fontSize="9" fontFamily="monospace">0</text>
                <text x="215" y="133" fill="#64748B" fontSize="9" fontFamily="monospace">Dist</text>

                {/* Data Points */}
                {activeCandidates.map(c => {
                  const dist = c.distance_km ?? 15;
                  const cx = Math.min(220, Math.max(35, 30 + (dist / 30) * 190));
                  const cy = Math.max(15, 120 - ((c.score ?? 50) / 100) * 105);
                  const isSelected = c.mmsi === selectedMmsi;

                  return (
                    <circle
                      key={c.mmsi}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#0284C7' : '#D97706'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:r-7 transition-all"
                      onClick={() => onSelectSuspect && onSelectSuspect(c.mmsi)}
                      onMouseEnter={(e) => handleScatterEnter(e, c)}
                      onMouseLeave={handleScatterLeave}
                    />
                  );
                })}
              </svg>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-center">
            Points closer to origin (left) with high scores (top)
          </div>
        </div>

        {/* G. DWELL TIME VS SCORE SCATTER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center justify-between border-b border-slate-200 pb-2">
            <span>G. Dwell Time vs Score</span>
            <span className="text-[10px] font-mono text-slate-400">X: min · Y: %</span>
          </div>

          <div className="relative h-44 w-full bg-[#F8FAFC] rounded-xl border border-slate-200 p-2 flex items-center justify-center">
            {activeCandidates.length === 0 ? (
              <span className="text-xs text-slate-400">No data</span>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 240 140">
                <line x1="30" y1="120" x2="230" y2="120" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="120" stroke="#CBD5E1" strokeWidth="1" />
                <text x="5" y="20" fill="#64748B" fontSize="9" fontFamily="monospace">100</text>
                <text x="15" y="123" fill="#64748B" fontSize="9" fontFamily="monospace">0</text>
                <text x="210" y="133" fill="#64748B" fontSize="9" fontFamily="monospace">Dwell</text>

                {activeCandidates.map(c => {
                  const dwell = c.dwell_time_mins ?? 20;
                  const cx = Math.min(220, Math.max(35, 30 + (dwell / 60) * 190));
                  const cy = Math.max(15, 120 - ((c.score ?? 50) / 100) * 105);
                  const isSelected = c.mmsi === selectedMmsi;

                  return (
                    <circle
                      key={c.mmsi}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#0284C7' : '#00E676'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:r-7 transition-all"
                      onClick={() => onSelectSuspect && onSelectSuspect(c.mmsi)}
                      onMouseEnter={(e) => handleScatterEnter(e, c)}
                      onMouseLeave={handleScatterLeave}
                    />
                  );
                })}
              </svg>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-center">
            High dwell time near spill origin correlates with discharge
          </div>
        </div>

        {/* H. SPEED VS SCORE SCATTER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center justify-between border-b border-slate-200 pb-2">
            <span>H. Vessel Speed vs Score</span>
            <span className="text-[10px] font-mono text-slate-400">X: kn · Y: %</span>
          </div>

          <div className="relative h-44 w-full bg-[#F8FAFC] rounded-xl border border-slate-200 p-2 flex items-center justify-center">
            {activeCandidates.length === 0 ? (
              <span className="text-xs text-slate-400">No data</span>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 240 140">
                <line x1="30" y1="120" x2="230" y2="120" stroke="#CBD5E1" strokeWidth="1" />
                <line x1="30" y1="10" x2="30" y2="120" stroke="#CBD5E1" strokeWidth="1" />
                <text x="5" y="20" fill="#64748B" fontSize="9" fontFamily="monospace">100</text>
                <text x="15" y="123" fill="#64748B" fontSize="9" fontFamily="monospace">0</text>
                <text x="210" y="133" fill="#64748B" fontSize="9" fontFamily="monospace">Speed</text>

                {activeCandidates.map(c => {
                  const spd = c.avg_speed_knots ?? 12;
                  const cx = Math.min(220, Math.max(35, 30 + (spd / 25) * 190));
                  const cy = Math.max(15, 120 - ((c.score ?? 50) / 100) * 105);
                  const isSelected = c.mmsi === selectedMmsi;

                  return (
                    <circle
                      key={c.mmsi}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : 4.5}
                      fill={isSelected ? '#0284C7' : '#FF3366'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:r-7 transition-all"
                      onClick={() => onSelectSuspect && onSelectSuspect(c.mmsi)}
                      onMouseEnter={(e) => handleScatterEnter(e, c)}
                      onMouseLeave={handleScatterLeave}
                    />
                  );
                })}
              </svg>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-center">
            Moderate speeds (~8-12 kn) align with pump-out profiles
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip for Scatter Plots */}
      {hoveredCandidate && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-900/90 text-white p-2 rounded-xl text-xs font-sans shadow-lg -translate-x-1/2 -translate-y-full min-w-[160px]"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="font-bold border-b border-slate-700 pb-1">{hoveredCandidate.name}</div>
          <div className="text-[11px] text-slate-300 font-mono mt-1 space-y-0.5">
            <div>Score: <strong className="text-sky-400">{hoveredCandidate.score}%</strong></div>
            <div>Distance: <strong>{hoveredCandidate.distance_km} km</strong></div>
            <div>Dwell: <strong>{hoveredCandidate.dwell_time_mins} min</strong></div>
            <div>Speed: <strong>{hoveredCandidate.avg_speed_knots} kn</strong></div>
            <div>Type: <strong>{hoveredCandidate.type}</strong></div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          I. SHIP TYPE & J. DISTANCE DISTRIBUTION & K. TIME OFFSET
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* I. SHIP TYPE DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center justify-between border-b border-slate-200 pb-2">
            <span>I. Ship Type Breakdown</span>
            <Ship className="w-4 h-4 text-[#0284C7]" />
          </div>

          <div className="space-y-2 pt-1 font-sans text-xs">
            {Object.entries(shipTypeCounts).map(([type, count]) => {
              const total = activeCandidates.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{type}</span>
                    <span className="font-mono font-bold text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        type === 'Oil Tanker'
                          ? 'bg-[#D97706]'
                          : type === 'Product Tanker'
                          ? 'bg-[#0284C7]'
                          : type === 'Cargo'
                          ? 'bg-slate-700'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* J. DISTANCE DISTRIBUTION (HISTOGRAM) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center justify-between border-b border-slate-200 pb-2">
            <span>J. Distance Distribution</span>
            <Compass className="w-4 h-4 text-[#0284C7]" />
          </div>

          <div className="space-y-2 pt-1 font-sans text-xs">
            {distanceDistribution.map((bin) => {
              const maxCount = Math.max(1, ...distanceDistribution.map(b => b.count));
              const pct = Math.round((bin.count / maxCount) * 100);

              return (
                <div key={bin.label} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-mono text-[11px]">{bin.label}</span>
                    <span className="font-mono font-bold text-[#0284C7]">{bin.count} vessels</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-[#0284C7] h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* K. TIME OFFSET ANALYSIS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center justify-between border-b border-slate-200 pb-2">
            <span>K. Time Offset (- / + vs Release)</span>
            <Clock className="w-4 h-4 text-[#0284C7]" />
          </div>

          {activeCandidates.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-6">No candidates</div>
          ) : (
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs font-sans">
              {activeCandidates.map(c => {
                const offset = c.time_offset_hours ?? 0;
                const isBefore = offset <= 0;

                return (
                  <div key={c.mmsi} className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="truncate max-w-[120px] font-medium text-slate-800">{c.name}</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      isBefore
                        ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
                        : 'bg-amber-50 text-[#D97706] border border-amber-200'
                    }`}>
                      {offset > 0 ? `+${offset}h After` : `${offset}h Before`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          L. VESSEL SPEED STATISTICS & M. FILTER IMPACT SUMMARY
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* L. VESSEL SPEED STATISTICS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#0284C7]" />
              <span>L. Vessel Speed Statistics</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Selected Dataset</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Minimum Speed</div>
              <div className="text-base font-mono font-bold text-slate-900 mt-1">{speedStats.min} kn</div>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Maximum Speed</div>
              <div className="text-base font-mono font-bold text-slate-900 mt-1">{speedStats.max} kn</div>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Average Speed</div>
              <div className="text-base font-mono font-bold text-[#0284C7] mt-1">{speedStats.avg} kn</div>
            </div>
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Median Speed</div>
              <div className="text-base font-mono font-bold text-emerald-700 mt-1">{speedStats.median} kn</div>
            </div>
          </div>
        </div>

        {/* M. FILTER IMPACT SUMMARY (FUNNEL / SEQUENTIAL) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#D97706]" />
              <span>M. Search Space Reduction Pipeline</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              STAGE 7 FUNNEL
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {[
              { label: 'Raw Candidates', count: filterImpact.raw ?? allCandidates.length, color: 'bg-slate-700' },
              { label: 'After Distance Filter', count: filterImpact.afterDistance ?? allCandidates.length, color: 'bg-[#0284C7]' },
              { label: 'After Dwell Filter', count: filterImpact.afterDwell ?? allCandidates.length, color: 'bg-sky-600' },
              { label: 'After Speed Filter', count: filterImpact.afterSpeed ?? allCandidates.length, color: 'bg-emerald-600' },
              { label: 'After Type Filter', count: filterImpact.afterType ?? allCandidates.length, color: 'bg-[#D97706]' },
              { label: 'Final Filtered Candidates', count: filterImpact.final ?? filteredCandidates.length, color: 'bg-amber-600' }
            ].map((step) => {
              const maxC = Math.max(1, filterImpact.raw || allCandidates.length || 1);
              const barWidth = Math.max(8, Math.round((step.count / maxC) * 100));

              return (
                <div key={step.label} className="space-y-0.5 text-xs font-sans">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{step.label}</span>
                    <span className="font-mono font-bold text-slate-900">{step.count} vessels</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
