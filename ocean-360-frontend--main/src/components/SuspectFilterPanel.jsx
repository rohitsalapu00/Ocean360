import React, { useState, useMemo } from 'react';
import { Filter, Sliders, RotateCcw, ChevronDown, ChevronUp, Ship, ArrowUpDown, Hash, Clock, Check, Sparkles, ShieldCheck, Search } from 'lucide-react';
import { DEFAULT_STAGE7_FILTERS, DEFAULT_STAGE7_WEIGHTS } from '../filterEngine';

export { DEFAULT_STAGE7_FILTERS, DEFAULT_STAGE7_WEIGHTS };

export default function SuspectFilterPanel({
  filters,
  onChangeFilters,
  weights,
  onChangeWeights,
  onReset,
  totalSuspectsCount = 0,
  filteredCount = 0,
  maxDistanceInData = 50,
  maxDwellInData = 60,
  maxSpeedInData = 30
}) {
  const [showWeights, setShowWeights] = useState(false);

  const SHIP_CATEGORIES = ['Oil Tanker', 'Product Tanker', 'Cargo', 'Other'];

  const handleShipTypeToggle = (cat) => {
    const current = filters.shipTypes || [];
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    onChangeFilters({ ...filters, shipTypes: updated });
  };

  const handleAllTypesClick = () => {
    onChangeFilters({ ...filters, shipTypes: [] });
  };

  // One-click Forensic Presets for quick analyst / pitch workflows
  const applyPreset = (presetKey) => {
    if (presetKey === 'strict') {
      onChangeFilters({
        ...filters,
        maxDistanceKm: 5,
        minDwellMins: 30,
        maxSpeedKnots: 15,
        shipTypes: ['Oil Tanker'],
        timeWindow: '3h',
        sortBy: 'score_desc'
      });
    } else if (presetKey === 'balanced') {
      onChangeFilters({
        ...filters,
        maxDistanceKm: 15,
        minDwellMins: 10,
        maxSpeedKnots: 20,
        shipTypes: ['Oil Tanker', 'Product Tanker', 'Cargo'],
        timeWindow: '6h',
        sortBy: 'score_desc'
      });
    } else if (presetKey === 'broad') {
      onChangeFilters({
        ...filters,
        maxDistanceKm: Math.max(30, Math.ceil(maxDistanceInData)),
        minDwellMins: 0,
        maxSpeedKnots: Math.max(25, Math.ceil(maxSpeedInData)),
        shipTypes: [],
        timeWindow: 'all',
        sortBy: 'score_desc'
      });
    }
  };

  // Adaptive slider bounds based on data
  const distMax = Math.max(50, Math.ceil(maxDistanceInData));
  const dwellMax = Math.max(60, Math.ceil(maxDwellInData));
  const speedMax = Math.max(30, Math.ceil(maxSpeedInData));

  // Multi-criteria weights normalization
  const totalWeight = useMemo(() => {
    const w = weights || DEFAULT_STAGE7_WEIGHTS;
    return (
      (Number(w.pipelineScore) || 0) +
      (Number(w.distance) || 0) +
      (Number(w.dwell) || 0) +
      (Number(w.speed) || 0) +
      (Number(w.timeMatch) || 0) || 100
    );
  }, [weights]);

  // Normalized weight percentages
  const normalizedPercentages = useMemo(() => {
    const w = weights || DEFAULT_STAGE7_WEIGHTS;
    const tot = totalWeight || 1;
    return {
      pipelineScore: Math.round(((Number(w.pipelineScore) || 0) / tot) * 100),
      distance: Math.round(((Number(w.distance) || 0) / tot) * 100),
      dwell: Math.round(((Number(w.dwell) || 0) / tot) * 100),
      speed: Math.round(((Number(w.speed) || 0) / tot) * 100),
      timeMatch: Math.round(((Number(w.timeMatch) || 0) / tot) * 100)
    };
  }, [weights, totalWeight]);

  const handleWeightChange = (key, newVal) => {
    const w = { ...(weights || DEFAULT_STAGE7_WEIGHTS) };
    w[key] = Math.max(0, newVal);
    onChangeWeights(w);
  };

  const SliderRow = ({ label, value, displayVal, suffix, min, max, step, onChange }) => (
    <div className="space-y-1 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between text-xs font-sans">
        <span className="text-slate-700 font-bold tracking-wide">{label}</span>
        <span className="font-mono text-[#0284C7] font-black bg-white px-2.5 py-0.5 rounded-full border border-sky-200 text-xs shadow-xs">
          {displayVal != null ? displayVal : value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-[#0284C7]"
      />
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs animate-slide-up space-y-4 text-[#0F172A]">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
            <Filter className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#0F172A] font-sans">
            STAGE 7 SUSPECT FILTERS
          </h2>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
            {filteredCount} / {totalSuspectsCount}
          </span>
        </div>
        <button
          onClick={onReset}
          id="btn-filter-reset"
          className="flex items-center gap-1 text-xs text-[#0284C7] hover:text-[#0369A1] font-sans font-bold underline transition-colors cursor-pointer"
          title="Reset to uploaded case default filter settings"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-[#F8FAFC] p-2 rounded-xl border border-slate-200 space-y-1.5">
        <div className="text-[10px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D97706]" /> Quick Forensic Presets:
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('strict')}
            title="High Confidence: Dist < 5km, Dwell > 30m, Oil Tankers"
            className="py-1 px-1.5 rounded-lg text-[10px] font-bold font-sans bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer truncate text-center shadow-xs"
          >
            Strict Forensic
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            title="Balanced: Dist < 15km, Dwell > 10m, Tankers & Cargo"
            className="py-1 px-1.5 rounded-lg text-[10px] font-bold font-sans bg-white hover:bg-sky-50 text-[#0284C7] border border-sky-200 hover:border-sky-300 transition-all cursor-pointer truncate text-center shadow-xs"
          >
            Balanced
          </button>
          <button
            type="button"
            onClick={() => applyPreset('broad')}
            title="Broad Quadrant: Max Distance & Speeds, All Ships"
            className="py-1 px-1.5 rounded-lg text-[10px] font-bold font-sans bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer truncate text-center shadow-xs"
          >
            Broad Search
          </button>
        </div>
      </div>

      {/* Sliders (Max Distance, Min Dwell Time, Max Vessel Speed) */}
      <div className="space-y-3">
        <SliderRow
          label="Max Distance"
          value={filters.maxDistanceKm}
          suffix=" km"
          min={1}
          max={distMax}
          step={1}
          onChange={(v) => onChangeFilters({ ...filters, maxDistanceKm: v })}
        />
        <SliderRow
          label="Min Dwell Time"
          value={filters.minDwellMins}
          suffix=" min"
          min={0}
          max={dwellMax}
          step={5}
          onChange={(v) => onChangeFilters({ ...filters, minDwellMins: v })}
        />
        <SliderRow
          label="Max Vessel Speed"
          value={filters.maxSpeedKnots}
          suffix=" kn"
          min={1}
          max={speedMax}
          step={0.5}
          onChange={(v) => onChangeFilters({ ...filters, maxSpeedKnots: v })}
        />
      </div>

      {/* Target Ship Types Multi-Select */}
      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-sans">
            <Ship className="w-4 h-4 text-[#0284C7]" /> Target Ship Types
          </span>
          <button
            onClick={handleAllTypesClick}
            className={`text-xs font-sans font-bold transition-colors cursor-pointer ${
              !filters.shipTypes || filters.shipTypes.length === 0
                ? 'text-[#0284C7] underline font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SHIP_CATEGORIES.map((cat) => {
            const isSelected = filters.shipTypes?.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleShipTypeToggle(cat)}
                className={`text-xs font-sans px-3 py-1 rounded-full border font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Window & Top Candidates Dropdowns */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 space-y-1.5 overflow-hidden">
          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1 font-sans">
            <Clock className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="truncate">Time Window</span>
          </div>
          <select
            value={filters.timeWindow || 'all'}
            onChange={(e) => onChangeFilters({ ...filters, timeWindow: e.target.value })}
            className="w-full bg-white border border-slate-200 text-xs text-[#0284C7] font-sans font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer shadow-xs focus:border-[#0284C7] truncate"
          >
            <option value="all">All Times</option>
            <option value="1h">±1 Hour</option>
            <option value="3h">±3 Hours</option>
            <option value="6h">±6 Hours</option>
            <option value="12h">±12 Hours</option>
            <option value="24h">±24 Hours</option>
          </select>
        </div>

        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 space-y-1.5 overflow-hidden">
          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1 font-sans">
            <Hash className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="truncate">Top Candidates</span>
          </div>
          <select
            value={filters.topN || 10}
            onChange={(e) => onChangeFilters({ ...filters, topN: Number(e.target.value) })}
            className="w-full bg-white border border-slate-200 text-xs text-[#0284C7] font-sans font-bold rounded-lg px-2 py-1.5 outline-none cursor-pointer shadow-xs focus:border-[#0284C7] truncate"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={999}>All Candidates</option>
          </select>
        </div>
      </div>

      {/* Sort Candidates By Dropdown */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-700 flex items-center gap-1.5 font-bold font-sans">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> Sort Candidates By
          </span>
        </div>
        <select
          value={filters.sortBy || 'score_desc'}
          onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value })}
          className="w-full bg-white border border-slate-200 text-xs text-[#0284C7] font-sans font-bold rounded-lg px-2.5 py-1.5 outline-none cursor-pointer shadow-xs focus:border-[#0284C7]"
        >
          <option value="score_desc">Calculated Score ↓ (Highest first)</option>
          <option value="score_asc">Calculated Score ↑ (Lowest first)</option>
          <option value="dist_asc">Distance ↑ (Closest first)</option>
          <option value="dist_desc">Distance ↓ (Farthest first)</option>
          <option value="dwell_desc">Dwell Time ↓ (Longest first)</option>
          <option value="dwell_asc">Dwell Time ↑ (Shortest first)</option>
          <option value="speed_desc">Speed ↓ (Fastest first)</option>
          <option value="speed_asc">Speed ↑ (Slowest first)</option>
          <option value="time_asc">Time Offset ↑ (Earliest before release)</option>
          <option value="time_desc">Time Offset ↓ (Latest after release)</option>
        </select>
      </div>

      {/* Expandable Multi-Criteria Weight Configuration */}
      <div className="pt-2 border-t border-slate-200">
        <button
          onClick={() => setShowWeights(!showWeights)}
          id="btn-toggle-weights"
          className="w-full flex items-center justify-between text-xs text-[#0284C7] font-sans font-bold py-1 transition-colors cursor-pointer hover:underline"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Multi-Criteria Weight Configuration</span>
          </span>
          {showWeights ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showWeights && (
          <div className="mt-2.5 p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3 animate-slide-up">
            <div className="flex justify-between items-center text-[11px] font-sans text-slate-500 pb-1 border-b border-slate-200">
              <span>Adjust evidence weighting priorities:</span>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Sum: 100%
              </span>
            </div>

            <SliderRow
              label="Trajectory / Pipeline Score"
              value={weights?.pipelineScore ?? DEFAULT_STAGE7_WEIGHTS.pipelineScore}
              displayVal={normalizedPercentages.pipelineScore}
              suffix="%"
              min={0}
              max={100}
              step={5}
              onChange={(v) => handleWeightChange('pipelineScore', v)}
            />

            <SliderRow
              label="Distance (Proximity)"
              value={weights?.distance ?? DEFAULT_STAGE7_WEIGHTS.distance}
              displayVal={normalizedPercentages.distance}
              suffix="%"
              min={0}
              max={100}
              step={5}
              onChange={(v) => handleWeightChange('distance', v)}
            />

            <SliderRow
              label="Dwell Time"
              value={weights?.dwell ?? DEFAULT_STAGE7_WEIGHTS.dwell}
              displayVal={normalizedPercentages.dwell}
              suffix="%"
              min={0}
              max={100}
              step={5}
              onChange={(v) => handleWeightChange('dwell', v)}
            />

            <SliderRow
              label="Vessel Speed"
              value={weights?.speed ?? DEFAULT_STAGE7_WEIGHTS.speed}
              displayVal={normalizedPercentages.speed}
              suffix="%"
              min={0}
              max={100}
              step={5}
              onChange={(v) => handleWeightChange('speed', v)}
            />

            <SliderRow
              label="Time Match"
              value={weights?.timeMatch ?? DEFAULT_STAGE7_WEIGHTS.timeMatch}
              displayVal={normalizedPercentages.timeMatch}
              suffix="%"
              min={0}
              max={100}
              step={5}
              onChange={(v) => handleWeightChange('timeMatch', v)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
