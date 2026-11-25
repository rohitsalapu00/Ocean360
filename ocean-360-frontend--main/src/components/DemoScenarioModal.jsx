import React from 'react';
import { X, CheckCircle2, AlertTriangle, Users, Anchor, Play } from 'lucide-react';
import caseA1Data from '../../input/case_a1.json';
import caseA2Data from '../../input/case_a2.json';

export const DEMO_SCENARIOS = [
  {
    id: 'CASE_a1',
    code: 'CASE A1',
    title: 'CASE A1 — Confirmed Oil Spill',
    icon: CheckCircle2,
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200 hover:border-rose-500 bg-[#F8FAFC] hover:bg-rose-50/40',
    desc: 'High-contrast Sentinel-1 SAR slick with MT Arabian Pearl tanker trajectory intersecting footprint prior to acquisition.',
    result: 'High Vessel Attribution (Score: 94.2%)',
    resultColor: 'text-rose-600',
    caseData: caseA1Data
  },
  {
    id: 'CASE_a2',
    code: 'CASE A2',
    title: 'CASE A2 — Characterised Anomaly',
    icon: AlertTriangle,
    iconColor: 'text-[#D97706]',
    borderColor: 'border-amber-200 hover:border-amber-500 bg-[#F8FAFC] hover:bg-amber-50/40',
    desc: 'Characterised oil slick feature off Lakshadweep / South Arabian Sea (Area: 25.63 km²).',
    result: 'Ranked 3 Vessel Candidates (Sea Champion lead)',
    resultColor: 'text-[#D97706]',
    caseData: caseA2Data
  }
];

export default function DemoScenarioModal({ isOpen, onClose, onSelectScenario }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-slide-up text-[#0F172A] max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#0F172A] flex items-center gap-2 font-sans">
                Choose a Demonstration Case
              </h2>
              <p className="text-xs font-mono text-slate-500 tracking-wider">
                SELECT CASE A1 OR CASE A2 TO LOAD REALISTIC OCEAN 360 DATASETS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_SCENARIOS.map((sc) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc);
                  onClose();
                }}
                className={`border ${sc.borderColor} rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group hover:scale-[1.02] shadow-xs`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${sc.iconColor}`} />
                      <h3 className="text-xs font-bold text-slate-900 tracking-wide font-sans">
                        {sc.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[#0284C7]">
                      {sc.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal">
                    {sc.desc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200">
                  <div className={`text-xs font-mono font-bold flex items-center gap-1.5 ${sc.resultColor}`}>
                    <span>→</span>
                    <span>{sc.result}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2 text-xs text-slate-500 font-sans font-medium">
          Selecting a case loads the dataset and opens the Ocean 360 Intelligence Dashboard.
        </div>
      </div>
    </div>
  );
}
