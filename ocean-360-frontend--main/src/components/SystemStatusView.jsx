import React, { useState } from 'react';
import {
  Activity, RefreshCw, Satellite,
  Ship, Cpu, GitMerge, Map, Bell, FileText
} from 'lucide-react';

export default function SystemStatusView() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('JUST NOW');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('JUST NOW');
    }, 600);
  };

  const services = [
    {
      id: 'sat',
      name: 'Satellite Data Feed',
      mode: 'DEMO MODE',
      updated: lastRefreshed,
      status: 'DEGRADED',
      statusColor: 'text-amber-400',
      dotColor: 'bg-amber-400',
      icon: Satellite
    },
    {
      id: 'ais',
      name: 'AIS Data Feed',
      mode: 'DEMO / SAMPLE',
      updated: lastRefreshed,
      status: 'ONLINE',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: Ship
    },
    {
      id: 'detection',
      name: 'Detection Engine',
      mode: 'PROTOTYPE DETECTOR',
      updated: lastRefreshed,
      status: 'ONLINE',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: Cpu
    },
    {
      id: 'correlation',
      name: 'Correlation Engine',
      mode: 'READY',
      updated: lastRefreshed,
      status: 'ONLINE',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: GitMerge
    },
    {
      id: 'map',
      name: 'Map Services',
      mode: 'CARTO® TILES',
      updated: lastRefreshed,
      status: 'ONLINE',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: Map
    },
    {
      id: 'alert',
      name: 'Alert Service',
      mode: 'OPERATIONAL',
      updated: lastRefreshed,
      status: 'ONLINE',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: Bell
    },
    {
      id: 'report',
      name: 'Report Service',
      mode: 'OPERATIONAL',
      updated: lastRefreshed,
      status: 'ONLINE',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400',
      icon: FileText
    }
  ];

  const activityLogs = [
    {
      id: 'log-1',
      msg: 'Tactical surveillance feeds operational and synchronized.',
      time: '11 Sept 2026, 10:36'
    },
    {
      id: 'log-2',
      msg: 'Satellite SAR scene indexed and calibrated.',
      time: '11 Sept 2026, 10:35'
    },
    {
      id: 'log-3',
      msg: 'Drift simulation model completed successfully.',
      time: '11 Sept 2026, 10:32'
    },
    {
      id: 'log-4',
      msg: 'AIS spatial-temporal search corridor active.',
      time: '11 Sept 2026, 10:30'
    }
  ];

  return (
    <div className="space-y-4 max-w-[1920px] mx-auto w-full animate-fade-in text-[#0F172A]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-wider text-[#0F172A] uppercase font-sans">
            System Status & Health
          </h2>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="py-2 px-4 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2-Column Split: OPERATIONAL HEALTH and ACTIVITY LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Operational Health Grid */}
        <div className="lg:col-span-8 space-y-3">
          <div className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
            OPERATIONAL HEALTH
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7]">
                      <Icon className="w-4 h-4 text-[#0284C7]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F172A]">
                        {s.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {s.mode} · {s.updated}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.dotColor} ${s.status === 'ONLINE' ? 'animate-pulse' : ''}`}></span>
                    <span className={`text-xs font-mono font-bold tracking-wider ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subcard for Satellite update */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-600">
            Last satellite update: Sentinel-1A C-SAR Scene Calibrated (11 Sept 2026, 14:30 UTC)
          </div>
        </div>

        {/* Right Column (4 cols): Activity Log */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
            ACTIVITY LOG
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                <Activity className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-800 font-sans leading-relaxed font-medium">
                    {log.msg}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    {log.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
