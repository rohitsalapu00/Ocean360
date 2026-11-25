import React, { useState } from 'react';
import {
  Bell, Check, Trash2, ChevronRight, AlertTriangle, Info,
  AlertCircle, ShieldAlert, Sliders, Ship, Filter
} from 'lucide-react';
import SuspectFilterPanel from './SuspectFilterPanel';
import SuspectList from './SuspectList';

export default function LiveAlertsPanel({
  suspects = [],
  selectedMmsi,
  onSelectSuspect,
  onOpenCompare,
  filters,
  onChangeFilters,
  weights,
  onChangeWeights,
  onResetFilters,
  totalSuspectsCount = 0,
  filteredCount = 0,
  maxDistanceInData,
  maxDwellInData,
  maxSpeedInData
}) {
  const [activeTab, setActiveTab] = useState('suspects'); // 'suspects' | 'filters'

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters?.maxDistanceKm && filters.maxDistanceKm < 50) count++;
    if (filters?.minDwellMins && filters.minDwellMins > 0) count++;
    if (filters?.maxSpeedKnots && filters.maxSpeedKnots < 30) count++;
    if (filters?.shipTypes && filters.shipTypes.length > 0) count++;
    if (filters?.timeWindow && filters.timeWindow !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-white text-[#0F172A] border border-slate-200 rounded-2xl shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header with Navigation Tabs */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('suspects')}
            className={`flex items-center gap-1.5 text-xs font-bold tracking-wide px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'suspects'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Suspect Vessels</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'suspects' ? 'bg-white text-[#0284C7]' : 'bg-slate-200 text-slate-800'
            }`}>
              {filteredCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('filters')}
            className={`flex items-center gap-1.5 text-xs font-bold tracking-wide px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'filters'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title="Filter Controls"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Stage 7 Filters</span>
            {activeFiltersCount > 0 && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'filters' ? 'bg-white text-[#0284C7]' : 'bg-[#0284C7] text-white'
              }`}>
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-230px)] p-4">
        {activeTab === 'suspects' && (
          <div className="space-y-3">
            <SuspectList
              suspects={suspects}
              selectedMmsi={selectedMmsi}
              onSelectSuspect={onSelectSuspect}
              onOpenCompare={onOpenCompare}
              onResetFilters={onResetFilters}
              totalSuspectsCount={totalSuspectsCount}
              onSwitchToFilters={() => setActiveTab('filters')}
            />
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-3">
            <SuspectFilterPanel
              filters={filters}
              onChangeFilters={onChangeFilters}
              weights={weights}
              onChangeWeights={onChangeWeights}
              onReset={onResetFilters}
              totalSuspectsCount={totalSuspectsCount}
              filteredCount={filteredCount}
              maxDistanceInData={maxDistanceInData}
              maxDwellInData={maxDwellInData}
              maxSpeedInData={maxSpeedInData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
