import React from 'react';
import {
  Satellite, Layers, Wind, Compass, MapPin, Ship,
  ShieldCheck, ChevronRight, CheckCircle2, Workflow
} from 'lucide-react';
import { SEVEN_STAGES } from './SevenStagesPipeline';

export default function SevenStagesStatusBar({ onOpenFullPipeline }) {
  return (
    <div className="space-y-2">
      {/* Tactical Status Pills matching Screenshot 5 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>SATELLITE: DEMO</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00D2FF] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></span>
            <span>AIS: DEMO</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DETECTION: READY</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>INCIDENTS: OPERATIONAL</span>
          </div>
        </div>

        <button
          onClick={onOpenFullPipeline}
          className="text-xs text-[#00D2FF] hover:underline flex items-center gap-1 font-sans cursor-pointer"
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Full Pipeline Technical Spec &rarr;</span>
        </button>
      </div>

      {/* 7-STAGE PIPELINE: Clear, neat, prominent interactive bar */}
      <div className="bg-[#0B1321] border border-[#16263D] rounded-xl p-2.5 shadow-md">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#16263D]">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-[#00D2FF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
              SIH26143 · 7-STAGE FORENSIC INVESTIGATION PIPELINE
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
            Stages 1–6 Automated &bull; Stage 7 Active Forensic Attribution
          </span>
        </div>

        {/* 7 Stages Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {SEVEN_STAGES.map((s) => {
            const Icon = s.icon;
            const isStage7 = s.stage === 7;
            return (
              <button
                key={s.stage}
                onClick={onOpenFullPipeline}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isStage7
                    ? 'bg-[#00D2FF]/10 border-[#00D2FF]/60 text-white shadow-sm ring-1 ring-[#00D2FF]/30'
                    : 'bg-[#060B14] border-[#16263D] text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                    isStage7 ? 'bg-[#00D2FF] text-black' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {s.stage}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isStage7
                      ? 'bg-[#00D2FF]/20 text-[#00D2FF]'
                      : 'bg-emerald-950/40 text-emerald-400'
                  }`}>
                    {isStage7 ? 'ACTIVE' : 'DONE'}
                  </span>
                </div>

                <div className="text-[11px] font-bold font-sans truncate text-slate-100">
                  {s.shortName}
                </div>

                <div className="text-[9px] font-mono text-slate-400 mt-1 truncate">
                  {s.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
