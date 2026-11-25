import React, { useState } from 'react';
import {
  Satellite, ChevronUp, ChevronDown, RefreshCw, CheckCircle2,
  Upload, MapPin
} from 'lucide-react';
import { resolveMaritimeRegion } from '../normalizeCase';

export default function SatelliteDataPanel({
  caseData,
  onRefresh,
  onUploadClick
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const detection = caseData?.detection || {};
  const hindcast = caseData?.hindcast || {};
  const caseId = caseData?.case_id || 'CASE a1';

  const lat = detection.centroid ? detection.centroid[0] : (detection.lat || 18.9182);
  const lon = detection.centroid ? detection.centroid[1] : (detection.lon || 72.7845);
  const regionName = caseData?.region || resolveMaritimeRegion(lat, lon, caseData);
  const coverageLabel = `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E (${regionName})`;

  const sceneMeta = {
    mission: 'Sentinel-1A C-SAR',
    sensor: 'Interferometric Wide (IW)',
    acquired: detection.detection_time ? new Date(detection.detection_time).toUTCString() : '11 Sept 2026, 14:30 UTC',
    region: regionName,
    coverage: coverageLabel,
    resolution: '10 m/px Spatial Resolution',
    orbit: 'Sentinel-1 Constellation Orbit',
    sceneId: caseId
  };

  return (
    <div className="bg-white text-[#0F172A] border border-slate-200 rounded-2xl shadow-xs flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-[#0284C7]" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#0F172A] font-sans">
            SATELLITE OBSERVATION
          </h2>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
            {caseId}
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-[#0F172A] p-1 rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)] text-xs">
          {/* Scene Metadata Card */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
                ACTIVE OBSERVATION METADATA
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2 font-sans text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500 font-medium">Mission</span>
                <span className="font-bold text-[#0284C7]">{sceneMeta.mission}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500 font-medium">Sensor</span>
                <span>{sceneMeta.sensor}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500 font-medium">Acquired</span>
                <span className="text-slate-900 font-semibold">{sceneMeta.acquired}</span>
              </div>
              <div className="flex justify-between items-start text-slate-600">
                <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#0284C7]" /> Region
                </span>
                <span className="font-bold text-[#0284C7] text-right leading-snug">{sceneMeta.region}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500 font-medium">Coverage</span>
                <span>{sceneMeta.coverage}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500 font-medium">Resolution</span>
                <span>{sceneMeta.resolution}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Case ID</span>
                <span className="text-[#0284C7] text-xs font-bold font-mono">{sceneMeta.sceneId}</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Observation scene calibrated.</span>
            </div>
          </div>

          {/* Slick Metric Profile */}
          {caseData && (
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
                  DETECTION METRICS
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                  {caseData.status || 'CHARACTERISED'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Spill Area</div>
                  <div className="text-base font-bold font-mono text-[#0284C7]">
                    {detection.area_km2 ? `${Number(detection.area_km2).toFixed(2)} km²` : '18.45 km²'}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Correlated Vessels</div>
                  <div className="text-base font-bold font-mono text-emerald-600">
                    {caseData.suspects ? caseData.suspects.length : 0}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-700 font-mono space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Centroid:</span>
                  <span className="font-semibold text-slate-900">
                    {detection.centroid
                      ? `${detection.centroid[0].toFixed(4)}°N, ${detection.centroid[1].toFixed(4)}°E`
                      : detection.centroid_lat
                      ? `${Number(detection.centroid_lat).toFixed(4)}°N, ${Number(detection.centroid_lon).toFixed(4)}°E`
                      : '18.9182°N, 72.7845°E'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Origin:</span>
                  <span className="text-[#D97706] font-bold">
                    {hindcast.origin
                      ? `${hindcast.origin[0] ? hindcast.origin[0].toFixed(4) : (hindcast.origin.lat ? hindcast.origin.lat.toFixed(4) : '')}°N, ${hindcast.origin[1] ? hindcast.origin[1].toFixed(4) : (hindcast.origin.lon ? hindcast.origin.lon.toFixed(4) : '')}°E`
                      : '18.8350°N, 72.6920°E'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="w-full py-2.5 px-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Observation</span>
            </button>

            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="w-full py-2 px-3 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Upload Case JSON</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
