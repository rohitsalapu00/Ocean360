import React from 'react';
import {
  Upload, RotateCcw, Download, Play, Radio, BarChart3, Activity,
  Home, Layers, LayoutDashboard, ArrowRight, ChevronDown, Sparkles,
  BookOpen, Award, Compass
} from 'lucide-react';

export default function Header({
  currentView = 'home',
  onSelectView,
  activeTab = 'monitoring',
  onSelectTab,
  onOpenUpload,
  onOpenDemo,
  onResetSample,
  onExportCase,
  currentCaseId,
  hasCaseData
}) {
  const mainNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ecosystem', label: '360° Ecosystem', icon: Compass, badge: 'Radar' },
    { id: 'pipeline', label: 'Pipeline', icon: Layers },
    { id: 'accuracy', label: 'Improved Accuracy', icon: Award, badge: '95.8%' },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  const dashboardTabs = [
    { id: 'monitoring', label: 'Live Monitoring', icon: Radio },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="w-full sticky top-0 z-50 font-sans shadow-xs">
      {/* Top SkyTruth Orange Announcement Banner */}
      <div className="bg-[#D97706] text-white text-[11px] md:text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>SIH26143 · Ocean 360 AI & Satellite-Powered Marine Oil Spill Detection Platform</span>
      </div>

      {/* Main SkyTruth White Navbar */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Ocean 360 Logo Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectView('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            {/* Rounded Icon Logo Mark with two colors */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#0284C7] flex items-center justify-center font-black text-xs shadow-md shadow-sky-500/25 group-hover:scale-105 transition-all">
              <span className="text-white">O</span><span className="text-cyan-200">360</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase text-[#0F172A] font-sans group-hover:text-[#0284C7] transition-colors">
                  OCEAN <span className="text-[#0284C7]">360</span>
                </h1>
                {currentCaseId && currentView === 'dashboard' && (
                  <span className="hidden sm:inline-block font-mono text-[10px] bg-[#F1F5F9] text-[#0284C7] border border-[#CBD5E1] px-2 py-0.5 rounded-full font-bold">
                    {currentCaseId}
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1 md:gap-2">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#0284C7] bg-sky-50 font-bold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="hidden md:inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sub-tabs when inside Dashboard */}
          {currentView === 'dashboard' && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] animate-fade-in">
              {dashboardTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right: SkyTruth Rounded Pill Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Upload Image Button */}
          <button
            onClick={onOpenUpload}
            id="btn-header-upload"
            className="px-4 py-2 rounded-full border border-[#0284C7] text-[#0284C7] hover:bg-sky-50 text-xs md:text-sm font-bold font-sans tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Case JSON</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Explore Demo Button */}
          <button
            onClick={onOpenDemo}
            id="btn-header-demo"
            className="px-4 py-2 rounded-full border border-slate-300 text-[#0F172A] hover:bg-slate-100 text-xs md:text-sm font-bold font-sans tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#0284C7] fill-current" />
            <span className="hidden sm:inline">Explore Demo</span>
          </button>

          {/* SkyTruth Primary Orange Launch Button */}
          <button
            onClick={() => onSelectView('dashboard')}
            id="btn-header-launch-dashboard"
            className="px-5 py-2 rounded-full bg-[#D97706] hover:bg-[#C2410C] text-white text-xs md:text-sm font-bold font-sans tracking-wide flex items-center gap-2 transition-all shadow-sm cursor-pointer hover:shadow-md"
          >
            <span>{currentView === 'dashboard' ? 'Dashboard Active' : 'Launch Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Export / Reset Actions */}
          {hasCaseData && currentView === 'dashboard' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={onResetSample}
                id="btn-reset-sample"
                title="Reset sample case data"
                className="p-2 rounded-full hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#0284C7]" />
              </button>
              <button
                onClick={onExportCase}
                id="btn-export-report"
                title="Export forensic report (PDF, CSV, JSON)"
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] border border-slate-300 hover:border-sky-300 text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
