import React, { useState, useEffect } from 'react';
import {
  X, GitCompare, Ship, CheckCircle, AlertTriangle, ArrowRight,
  Crosshair, Scale, Satellite, Compass, MapPin
} from 'lucide-react';
import { resolveMaritimeRegion } from '../normalizeCase';

export default function SuspectComparisonModal({
  isOpen,
  onClose,
  suspects = [],
  selectedMmsi,
  onSelectSuspect,
  caseData
}) {
  const [mmsiA, setMmsiA] = useState('');
  const [mmsiB, setMmsiB] = useState('');

  // Auto-select candidate A and B when suspects change
  useEffect(() => {
    if (suspects.length > 0) {
      // Suspect A: either the selected one or rank 1
      const initialA = suspects.find(s => s.mmsi === selectedMmsi) || suspects[0];
      setMmsiA(initialA?.mmsi || suspects[0]?.mmsi || '');

      // Suspect B: rank 2 or fallback to another
      const initialB = suspects.find(s => s.mmsi !== initialA?.mmsi) || suspects[1] || suspects[0];
      setMmsiB(initialB?.mmsi || '');
    }
  }, [isOpen, suspects, selectedMmsi]);

  if (!isOpen) return null;

  const det = caseData?.detection || {};
  const hc = caseData?.hindcast || {};

  const detLat = det.centroid ? det.centroid[0] : (det.lat || 18.9182);
  const detLon = det.centroid ? det.centroid[1] : (det.lon || 72.7845);

  const originLat = hc.origin ? (Array.isArray(hc.origin) ? hc.origin[0] : hc.origin.lat) : 18.8350;
  const originLon = hc.origin ? (Array.isArray(hc.origin) ? hc.origin[1] : (hc.origin.lon ?? hc.origin.lng)) : 72.6920;

  const regionName = caseData?.region || resolveMaritimeRegion(detLat, detLon, caseData);
  const originRegionName = hc?.origin_region || resolveMaritimeRegion(originLat, originLon, caseData);

  const candidateA = suspects.find(s => s.mmsi === mmsiA) || suspects[0];
  const candidateB = suspects.find(s => s.mmsi === mmsiB) || suspects[1] || suspects[0];

  const scoreA = candidateA?.score ?? 0;
  const scoreB = candidateB?.score ?? 0;
  const scoreDiff = (scoreA - scoreB).toFixed(1);

  const distA = candidateA?.distance_km ?? 999;
  const distB = candidateB?.distance_km ?? 999;
  const distDiff = (distB - distA).toFixed(1); // positive means A is closer

  const dwellA = candidateA?.dwell_time_mins ?? 0;
  const dwellB = candidateB?.dwell_time_mins ?? 0;
  const dwellDiff = (dwellA - dwellB).toFixed(1); // positive means A lingered longer

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Culprit Differential Comparison
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Multi-metric side-by-side forensic analysis of candidate vessels {caseData?.region && <span className="text-[#0284C7] font-semibold">· 📍 {caseData.region}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

          {/* Forensic Reference: Spill Detected Point & Calculated Release Origin */}
          <div className="bg-gradient-to-r from-slate-50 via-sky-50/40 to-amber-50/40 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold pb-1.5 border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Crosshair className="w-3.5 h-3.5 text-[#0284C7]" />
                Forensic Ground Truth: Spill Detected Point & Drift Release Origin
              </span>
              <span className="text-[#0284C7] font-semibold">
                Case ID: {caseData?.case_id || 'ACTIVE'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5 text-xs font-sans">
              {/* Spill Detection Point */}
              <div className="bg-white border border-rose-100 rounded-xl p-2.5 flex items-start gap-2.5 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Satellite className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase text-rose-600 font-mono flex items-center justify-between">
                    <span>1. Spill Detected Point (Observed)</span>
                    <span className="text-slate-500 font-normal">{det.area_km2 ? `${Number(det.area_km2).toFixed(2)} km²` : ''}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    {Number(detLat).toFixed(4)}°N, {Number(detLon).toFixed(4)}°E
                  </div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">
                    📍 {regionName}
                  </div>
                  {det.detection_time && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Observed: {new Date(det.detection_time).toUTCString().replace('GMT', 'UTC')}
                    </div>
                  )}
                </div>
              </div>

              {/* Spill Release Origin */}
              <div className="bg-white border border-amber-100 rounded-xl p-2.5 flex items-start gap-2.5 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase text-[#D97706] font-mono flex items-center justify-between">
                    <span>2. Spill Release Origin (Hindcast)</span>
                    <span className="text-emerald-700 font-bold">{hc.confidence ? `${(hc.confidence > 1 ? hc.confidence : hc.confidence * 100).toFixed(1)}% conf.` : ''}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    {Number(originLat).toFixed(4)}°N, {Number(originLon).toFixed(4)}°E
                  </div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">
                    🎯 Origin: {originRegionName}
                  </div>
                  {hc.release_time && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Estimated Release: {new Date(hc.release_time).toUTCString().replace('GMT', 'UTC')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Candidate Selectors Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200">
            {/* Candidate A Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase flex items-center justify-between">
                <span>Suspect Candidate A</span>
                {candidateA?.rank === 1 && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                    RANK #1
                  </span>
                )}
              </label>
              <select
                value={mmsiA}
                onChange={(e) => setMmsiA(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#0284C7] shadow-2xs"
              >
                {suspects.map((s, idx) => (
                  <option key={`a-${s.mmsi}`} value={s.mmsi}>
                    #{s.rank || idx + 1} - {s.name} ({s.score?.toFixed(1)}% · {s.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Candidate B Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase flex items-center justify-between">
                <span>Suspect Candidate B</span>
                {candidateB?.rank === 1 && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                    RANK #1
                  </span>
                )}
              </label>
              <select
                value={mmsiB}
                onChange={(e) => setMmsiB(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#0284C7] shadow-2xs"
              >
                {suspects.map((s, idx) => (
                  <option key={`b-${s.mmsi}`} value={s.mmsi}>
                    #{s.rank || idx + 1} - {s.name} ({s.score?.toFixed(1)}% · {s.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Differential Key Takeaways Banner */}
          {candidateA && candidateB && candidateA.mmsi !== candidateB.mmsi && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0284C7] text-white flex items-center justify-center shrink-0">
                  <GitCompare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Differential Delta: {scoreA >= scoreB ? candidateA.name : candidateB.name} leads by{' '}
                    <span className="text-[#0284C7] font-mono font-bold">+{Math.abs(scoreDiff)}%</span> attribution confidence
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                    {distDiff > 0
                      ? `${candidateA.name} was ${Math.abs(distDiff)} km closer to the discharge origin.`
                      : `${candidateB.name} was ${Math.abs(distDiff)} km closer to the discharge origin.`}
                    {' '}
                    {dwellDiff > 0
                      ? `${candidateA.name} loitered ${Math.abs(dwellDiff)} min longer in the slick drift corridor.`
                      : `${candidateB.name} loitered ${Math.abs(dwellDiff)} min longer in the slick drift corridor.`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-Side Cards Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Candidate A Card */}
            {candidateA ? (
              <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 shadow-xs space-y-3.5 transition-all">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 text-[#0284C7] font-bold font-mono text-xs flex items-center justify-center">
                      #{candidateA.rank || 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm truncate max-w-[170px]">{candidateA.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">MMSI: {candidateA.mmsi}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Attribution Score</div>
                    <div className="text-base font-black font-mono text-[#0284C7]">
                      {scoreA.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-[#0284C7] rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(5, scoreA))}%` }}
                  ></div>
                </div>

                {/* Metric Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Distance to Spill Origin</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateA.distance_km != null ? `${candidateA.distance_km} km` : '—'}
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Dwell Time</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateA.dwell_time_mins != null ? `${candidateA.dwell_time_mins} min` : '—'}
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Average Speed</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateA.avg_speed_knots != null ? `${candidateA.avg_speed_knots} kn` : '—'}
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Temporal Offset</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateA.time_offset_hours != null
                        ? `${candidateA.time_offset_hours > 0 ? '+' : ''}${candidateA.time_offset_hours}h`
                        : '±0h'}
                    </div>
                  </div>
                </div>

                {/* Classification & Metadata */}
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vessel Type:</span>
                    <span className="font-semibold text-slate-800">{candidateA.type} ({candidateA.category})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flag State:</span>
                    <span className="font-mono font-semibold text-slate-800">{candidateA.flag || 'Unspecified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Track Waypoints:</span>
                    <span className="font-mono font-semibold text-slate-800">{candidateA.track?.length || 0} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {candidateA.length_m ? `${candidateA.length_m}m` : '—'} {candidateA.draft_m ? `(Draft: ${candidateA.draft_m}m)` : ''}
                    </span>
                  </div>
                </div>

                {/* Justification */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800">Forensic Justification: </span>
                  {candidateA.justification || candidateA.reason || 'Track intersects hindcast reverse corridor during estimated release window.'}
                </div>

                {/* Focus Button */}
                <button
                  onClick={() => {
                    onSelectSuspect && onSelectSuspect(candidateA.mmsi);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Highlight {candidateA.name} on Map</span>
                </button>
              </div>
            ) : null}

            {/* Candidate B Card */}
            {candidateB ? (
              <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 shadow-xs space-y-3.5 transition-all">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold font-mono text-xs flex items-center justify-center">
                      #{candidateB.rank || 2}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm truncate max-w-[170px]">{candidateB.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">MMSI: {candidateB.mmsi}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Attribution Score</div>
                    <div className="text-base font-black font-mono text-[#0284C7]">
                      {scoreB.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-[#0284C7] rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(5, scoreB))}%` }}
                  ></div>
                </div>

                {/* Metric Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Distance to Spill Origin</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateB.distance_km != null ? `${candidateB.distance_km} km` : '—'}
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Dwell Time</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateB.dwell_time_mins != null ? `${candidateB.dwell_time_mins} min` : '—'}
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Average Speed</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateB.avg_speed_knots != null ? `${candidateB.avg_speed_knots} kn` : '—'}
                    </div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-medium">Temporal Offset</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {candidateB.time_offset_hours != null
                        ? `${candidateB.time_offset_hours > 0 ? '+' : ''}${candidateB.time_offset_hours}h`
                        : '±0h'}
                    </div>
                  </div>
                </div>

                {/* Classification & Metadata */}
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vessel Type:</span>
                    <span className="font-semibold text-slate-800">{candidateB.type} ({candidateB.category})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flag State:</span>
                    <span className="font-mono font-semibold text-slate-800">{candidateB.flag || 'Unspecified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Track Waypoints:</span>
                    <span className="font-mono font-semibold text-slate-800">{candidateB.track?.length || 0} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {candidateB.length_m ? `${candidateB.length_m}m` : '—'} {candidateB.draft_m ? `(Draft: ${candidateB.draft_m}m)` : ''}
                    </span>
                  </div>
                </div>

                {/* Justification */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800">Forensic Justification: </span>
                  {candidateB.justification || candidateB.reason || 'Track intersects hindcast reverse corridor during estimated release window.'}
                </div>

                {/* Focus Button */}
                <button
                  onClick={() => {
                    onSelectSuspect && onSelectSuspect(candidateB.mmsi);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Highlight {candidateB.name} on Map</span>
                </button>
              </div>
            ) : null}

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex justify-end bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs font-sans transition-all cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
}
