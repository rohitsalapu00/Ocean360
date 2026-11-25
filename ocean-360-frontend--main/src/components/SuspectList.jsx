import React, { useState } from 'react';
import { Ship, AlertTriangle, LayoutList, Table, Anchor, CheckCircle, GitCompare, RotateCcw, Sliders } from 'lucide-react';

export default function SuspectList({
  suspects = [],
  selectedMmsi,
  onSelectSuspect,
  onOpenCompare,
  onResetFilters,
  totalSuspectsCount = 0,
  onSwitchToFilters
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const selectedVessel = suspects.find(s => s.mmsi === selectedMmsi) || suspects[0];

  if (!suspects || suspects.length === 0) {
    return (
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-xs animate-fade-in my-auto">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-800 font-sans">
            No candidate vessels match the current filters.
          </h3>
          <p className="text-[11px] text-slate-500 font-sans max-w-xs mx-auto">
            {totalSuspectsCount > 0
              ? `${totalSuspectsCount} candidate vessels exist in dataset, but active filter limits (distance, speed, or dwell) exclude them.`
              : 'Adjust the distance, dwell time, speed, vessel type, or time-window filters.'}
          </p>
        </div>

        {totalSuspectsCount > 0 && onResetFilters && (
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={onResetFilters}
              className="px-3.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All {totalSuspectsCount} Candidates</span>
            </button>
            {onSwitchToFilters && (
              <button
                onClick={onSwitchToFilters}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Adjust Filters</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Ranking Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-800 font-sans tracking-wide">
            Ranked Suspect Vessels
          </h3>
          <span className="text-[11px] font-mono font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            {suspects.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onOpenCompare && suspects.length >= 2 && (
            <button
              onClick={onOpenCompare}
              title="Compare top candidate vessels side-by-side"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200 text-xs font-bold font-sans transition-all cursor-pointer shadow-2xs"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
          )}

          <div className="flex items-center p-0.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1 rounded text-xs transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0284C7] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Cards View"
              className={`p-1 rounded text-xs transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#0284C7] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Primary Ranking Table */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs animate-fade-in">
          <div className="overflow-x-auto max-h-[290px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Rank</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Vessel / MMSI</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Type</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Score</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Distance</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Dwell</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Speed</th>
                  <th className="py-2 px-2.5 font-bold text-slate-600 text-[10px] uppercase font-sans">Offset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {suspects.map((s, idx) => {
                  const isSelected = s.mmsi === selectedMmsi;
                  const rank = s.rank || idx + 1;
                  return (
                    <tr
                      key={s.mmsi || idx}
                      onClick={() => onSelectSuspect(s.mmsi)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50/90 text-slate-900 font-semibold ring-1 ring-inset ring-sky-300'
                          : idx % 2 === 1
                          ? 'bg-slate-50/50 hover:bg-slate-100/70'
                          : 'bg-white hover:bg-slate-100/70'
                      }`}
                    >
                      <td className="py-2 px-2.5">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                          rank === 1
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {rank}
                        </span>
                      </td>
                      <td className="py-2 px-2.5">
                        <div className="truncate max-w-[110px] font-bold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">MMSI: {s.mmsi}</div>
                      </td>
                      <td className="py-2 px-2.5 text-slate-600">
                        <div className="truncate max-w-[85px] text-[11px]">{s.type}</div>
                      </td>
                      <td className="py-2 px-2.5">
                        <span className="font-mono font-bold text-[#0284C7] text-xs">
                          {s.score != null ? `${s.score.toFixed(1)}%` : '—'}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700">
                        {s.distance_km != null ? `${s.distance_km.toFixed(1)} km` : '—'}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700">
                        {s.dwell_time_mins != null ? `${s.dwell_time_mins}m` : '—'}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700">
                        {s.avg_speed_knots != null ? `${s.avg_speed_knots} kn` : '—'}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-700">
                        {s.time_offset_hours != null ? `${s.time_offset_hours > 0 ? '+' : ''}${s.time_offset_hours}h` : '0h'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Alternative Cards View */
        <div className="space-y-2 max-h-[290px] overflow-y-auto pr-0.5 font-sans">
          {suspects.map((suspect, idx) => {
            const isSelected = suspect.mmsi === selectedMmsi;
            const rank = suspect.rank || idx + 1;
            return (
              <div
                key={suspect.mmsi || idx}
                onClick={() => onSelectSuspect(suspect.mmsi)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#0284C7] shadow-sm ring-1 ring-[#0284C7]/40'
                    : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                      rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {rank}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900">{suspect.name}</span>
                      <span className="ml-1.5 text-[10px] text-slate-500 font-mono">({suspect.type})</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    {suspect.score != null ? `${suspect.score.toFixed(1)}%` : '—'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200">
                  <div>Dist: <strong className="text-slate-900">{suspect.distance_km != null ? `${suspect.distance_km}km` : '—'}</strong></div>
                  <div>Dwell: <strong className="text-slate-900">{suspect.dwell_time_mins != null ? `${suspect.dwell_time_mins}m` : '—'}</strong></div>
                  <div>Spd: <strong className="text-slate-900">{suspect.avg_speed_knots != null ? `${suspect.avg_speed_knots}kn` : '—'}</strong></div>
                  <div>Offset: <strong className="text-slate-900">{suspect.time_offset_hours != null ? `${suspect.time_offset_hours}h` : '0h'}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL STRIP (Selected Candidate Vessel Details) */}
      {selectedVessel && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs animate-slide-up space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[#0284C7]" />
              <h4 className="text-xs font-bold text-slate-900 font-sans">
                Selected Candidate: {selectedVessel.name}
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-500">
                Backend: {selectedVessel.backend_score != null ? `${selectedVessel.backend_score}%` : 'N/A'}
              </span>
              <span className="font-mono text-xs font-black text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Score {selectedVessel.score != null ? `${selectedVessel.score.toFixed(1)}%` : '—'}
              </span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans">
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Distance</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {selectedVessel.distance_km != null ? `${selectedVessel.distance_km.toFixed(2)} km` : '—'}
              </div>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Dwell Time</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {selectedVessel.dwell_time_mins != null ? `${selectedVessel.dwell_time_mins} min` : '—'}
              </div>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Vessel Speed</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {selectedVessel.avg_speed_knots != null ? `${selectedVessel.avg_speed_knots} kn` : '—'}
              </div>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Time Offset</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                {selectedVessel.time_offset_hours != null
                  ? `${selectedVessel.time_offset_hours > 0 ? '+' : ''}${selectedVessel.time_offset_hours}h`
                  : '±0h'}
              </div>
            </div>
          </div>

          {/* Justification & Vessel Identifiers */}
          <div className="text-xs text-slate-600 font-sans space-y-1.5 pt-1">
            <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-200 text-[11px] leading-relaxed">
              <span className="font-bold text-slate-800">Analytical Justification: </span>
              <span>{selectedVessel.justification || selectedVessel.reason || 'Candidate vessel track correlates with the estimated release origin corridor.'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500 pt-1">
              <span>MMSI: <strong className="text-slate-800">{selectedVessel.mmsi}</strong></span>
              {selectedVessel.flag && <span>Flag: <strong className="text-slate-800">{selectedVessel.flag}</strong></span>}
              {selectedVessel.length_m && <span>Length: <strong className="text-slate-800">{selectedVessel.length_m}m</strong></span>}
              {selectedVessel.closest_time && <span>Closest: <strong className="text-slate-800">{new Date(selectedVessel.closest_time).toLocaleTimeString()}</strong></span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
