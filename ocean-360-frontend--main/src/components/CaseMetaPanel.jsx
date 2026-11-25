import React from 'react';
import {
  FileText, MapPin, Clock, Satellite, Layers, Compass,
  Calendar, ShieldAlert
} from 'lucide-react';
import { resolveMaritimeRegion } from '../normalizeCase';

export default function CaseMetaPanel({ caseData }) {
  if (!caseData) return null;

  const { case_id = 'N/A', status = 'CANDIDATE IDENTIFIED', detection = {}, hindcast = {} } = caseData;
  const {
    detection_time = 'Unknown',
    area_km2 = 0,
    centroid = null,
    satellite = 'SAR',
    notes = ''
  } = detection;

  const {
    release_time = 'Not calculated',
    origin = null,
    trajectory = []
  } = hindcast;

  const regionName = caseData.region || resolveMaritimeRegion(centroid?.[0], centroid?.[1], caseData);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Unknown' || dateStr === 'Not calculated') return dateStr;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toUTCString().replace('GMT', 'UTC');
    } catch (e) { return dateStr; }
  };

  const MetaRow = ({ icon: Icon, label, value, isAccent = false }) => (
    <div className="flex items-start gap-3 py-2.5">
      <div className={`p-1.5 rounded-md ${isAccent ? 'bg-accent-50 text-accent' : 'bg-surface-100 text-text-tertiary'} shrink-0 mt-0.5`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{label}</div>
        <div className={`text-xs font-medium mt-0.5 ${isAccent ? 'text-accent font-semibold' : 'text-text-primary'} break-words`}>
          {value || 'Not recorded'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-surface-300 rounded-2xl p-4 md:p-5 shadow-card animate-fade-in space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-300">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-text-secondary" />
          <h2 className="text-sm font-semibold text-text-primary">Case & Detection</h2>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent-50 text-accent border border-accent-200">
          {status}
        </span>
      </div>

      {/* Case ID Box */}
      <div className="bg-surface-50 border border-surface-300 rounded-xl p-3">
        <div className="text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Case Identifier</div>
        <div className="text-sm font-semibold font-mono text-text-primary mt-0.5">{case_id}</div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
          <div className="text-[10px] text-text-secondary uppercase tracking-wider flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-accent" /> Area (km²)
          </div>
          <div className="text-base font-semibold text-text-primary mt-1 font-mono">
            {area_km2 ? `${Number(area_km2).toFixed(2)} km²` : 'N/A'}
          </div>
        </div>
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
          <div className="text-[10px] text-text-secondary uppercase tracking-wider flex items-center gap-1 font-medium">
            <Compass className="w-3 h-3 text-accent" /> Drift Points
          </div>
          <div className="text-base font-semibold text-text-primary mt-1 font-mono">
            {trajectory ? trajectory.length : 0}
          </div>
        </div>
      </div>

      {/* Detail Fields */}
      <div className="divide-y divide-surface-200 text-xs">
        <MetaRow
          icon={MapPin}
          label="Geographic Region / Location"
          isAccent
          value={regionName}
        />
        <MetaRow icon={Clock} label="SAR Detection Time" value={formatDate(detection_time)} />
        <MetaRow icon={Calendar} label="Estimated Release Time" value={formatDate(release_time)} />
        <MetaRow
          icon={MapPin}
          label="Slick Centroid (Observed)"
          isAccent
          value={centroid && Array.isArray(centroid) ? `${centroid[0].toFixed(4)}°N, ${centroid[1].toFixed(4)}°E` : 'Not recorded'}
        />
        <MetaRow
          icon={MapPin}
          label="Estimated Release Origin"
          value={origin && Array.isArray(origin) ? `${origin[0].toFixed(4)}°N, ${origin[1].toFixed(4)}°E` : 'Not recorded'}
        />
        <MetaRow icon={Satellite} label="Sensor / Satellite" value={satellite || 'SAR'} />
      </div>

      {/* Analyst Notes */}
      {notes && (
        <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
          <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 font-medium">Analyst Notes</div>
          <p className="text-xs text-text-secondary leading-relaxed italic">
            "{notes}"
          </p>
        </div>
      )}
    </div>
  );
}
