import React, { useState } from 'react';
import {
  FileText, Search, Filter, AlertTriangle, ShieldCheck,
  ChevronRight, ArrowUpDown, Eye, Download, Calendar
} from 'lucide-react';

export const INCIDENT_RECORDS = [
  {
    id: 'SP-01',
    caseId: 'SP-01-MUMBAI-OFFSHORE',
    name: 'Mumbai Offshore Terminal Slick',
    date: '2026-09-11 14:30 UTC',
    area: '18.45 km²',
    status: 'CONFIRMED',
    severity: 'HIGH',
    suspectName: 'MT ARABIAN PEARL',
    score: 87.4,
    vesselsCount: 3,
    confidence: '95%'
  },
  {
    id: 'SP-02',
    caseId: 'SP-02-FALSE-POSITIVE',
    name: 'North Arabian Low-Wind Feature',
    date: '2026-09-11 12:00 UTC',
    area: '6.20 km²',
    status: 'LOOK-ALIKE',
    severity: 'LOW',
    suspectName: 'None (Natural Feature)',
    score: 0,
    vesselsCount: 0,
    confidence: '88%'
  },
  {
    id: 'SP-03',
    caseId: 'SP-03-MULTI-CANDIDATES',
    name: 'Jawaharlal Nehru Port Approach',
    date: '2026-09-11 15:00 UTC',
    area: '24.10 km²',
    status: 'CONFIRMED',
    severity: 'HIGH',
    suspectName: 'MT GULF HORIZON',
    score: 89.2,
    vesselsCount: 5,
    confidence: '92%'
  },
  {
    id: 'SP-04',
    caseId: 'SP-04-OFFSHORE-NO-AIS',
    name: 'Deep Offshore Unattributed Feature',
    date: '2026-09-11 16:00 UTC',
    area: '12.80 km²',
    status: 'SUSPICIOUS',
    severity: 'MEDIUM',
    suspectName: 'Insufficient Evidence',
    score: 18.0,
    vesselsCount: 0,
    confidence: '71%'
  },
  {
    id: 'SP-05',
    caseId: 'SP-05-GUJARAT-COAST',
    name: 'Gulf of Khambhat Industrial Slick',
    date: '2026-09-10 09:15 UTC',
    area: '15.60 km²',
    status: 'CONFIRMED',
    severity: 'HIGH',
    suspectName: 'OCEAN VALOR',
    score: 84.1,
    vesselsCount: 4,
    confidence: '94%'
  },
  {
    id: 'SP-06',
    caseId: 'SP-06-RATNAGIRI-TRANSIT',
    name: 'Konkan Shelf Transit Corridor',
    date: '2026-09-09 18:40 UTC',
    area: '9.35 km²',
    status: 'SUSPICIOUS',
    severity: 'MEDIUM',
    suspectName: 'PACIFIC DAWN',
    score: 62.7,
    vesselsCount: 2,
    confidence: '81%'
  },
  {
    id: 'SP-07',
    caseId: 'SP-07-KANDLA-ANCHORAGE',
    name: 'Kandla Inner Anchorage Discharge',
    date: '2026-09-08 22:10 UTC',
    area: '21.05 km²',
    status: 'CONFIRMED',
    severity: 'HIGH',
    suspectName: 'MARINER EMPRESS',
    score: 91.0,
    vesselsCount: 6,
    confidence: '96%'
  },
  {
    id: 'SP-08',
    caseId: 'SP-08-GOA-OFFSHORE',
    name: 'Mormugao Deepwater Channel',
    date: '2026-09-07 11:25 UTC',
    area: '5.10 km²',
    status: 'LOOK-ALIKE',
    severity: 'LOW',
    suspectName: 'Biogenic Slick',
    score: 0,
    vesselsCount: 1,
    confidence: '85%'
  },
  {
    id: 'SP-09',
    caseId: 'SP-09-COCHIN-PASSAGE',
    name: 'Malabar Coastal Channel Slick',
    date: '2026-09-06 04:50 UTC',
    area: '13.90 km²',
    status: 'CONFIRMED',
    severity: 'HIGH',
    suspectName: 'EASTERN GLORY',
    score: 88.6,
    vesselsCount: 3,
    confidence: '93%'
  }
];

export default function IncidentLogsView({ onLoadIncident }) {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredIncidents = INCIDENT_RECORDS.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.name.toLowerCase().includes(q) ||
        inc.suspectName.toLowerCase().includes(q) ||
        inc.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-[1920px] mx-auto w-full animate-fade-in text-slate-100">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B1321] border border-[#16263D] p-3.5 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00D2FF]" />
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Incident Logs & Historical Records
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Archived satellite SAR detections & AIS vessel attribution dossiers
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[#060B14] border border-[#16263D] px-3 py-1.5 rounded-lg text-xs">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search incident ID, ship, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-slate-200 outline-none w-48 placeholder-slate-500 font-sans"
            />
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-colors ${
                  filterSeverity === s
                    ? 'bg-[#16263D] text-[#00D2FF] border border-[#00D2FF]/40'
                    : 'text-slate-400 hover:text-white bg-[#060B14] border border-[#16263D]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Table */}
      <div className="bg-[#0B1321] border border-[#16263D] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0D1829] text-slate-400 text-[10px] uppercase font-mono tracking-wider border-b border-[#16263D]">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Date / Time (UTC)</th>
                <th className="py-3 px-4">Location / Name</th>
                <th className="py-3 px-4">Slick Area</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Leading Suspect</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16263D] font-mono text-[11px]">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#0D1829]/60 transition-colors group">
                  <td className="py-3 px-4 font-bold text-white">
                    {inc.id}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {inc.date}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-200">
                    {inc.name}
                  </td>
                  <td className="py-3 px-4 text-[#00D2FF]">
                    {inc.area}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.status === 'CONFIRMED'
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-600/40'
                        : inc.status === 'LOOK-ALIKE'
                        ? 'bg-yellow-950/60 text-yellow-400 border border-yellow-600/40'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-600/40'
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'HIGH'
                        ? 'text-rose-400'
                        : inc.severity === 'MEDIUM'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    {inc.suspectName}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {inc.score > 0 ? (
                      <span className={inc.score >= 80 ? 'text-rose-400' : 'text-amber-400'}>
                        {inc.score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onLoadIncident && onLoadIncident(inc)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#16263D] hover:bg-[#00D2FF]/20 text-slate-200 hover:text-[#00D2FF] border border-[#213A5E] transition-colors cursor-pointer text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Case</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
