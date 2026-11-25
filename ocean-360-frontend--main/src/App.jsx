import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Homepage from './components/Homepage';
import PipelineView from './components/PipelineView';
import ResourcesView from './components/ResourcesView';
import ImprovedAccuracyView from './components/ImprovedAccuracyView';
import UploadModal from './components/UploadModal';
import SatelliteDataPanel from './components/SatelliteDataPanel';
import ForensicMap from './components/ForensicMap';
import LiveAlertsPanel from './components/LiveAlertsPanel';
import AnalyticsView from './components/AnalyticsView';
import DemoScenarioModal, { DEMO_SCENARIOS } from './components/DemoScenarioModal';
import MapApiKeyModal from './components/MapApiKeyModal';
import ExportReportModal from './components/ExportReportModal';
import SuspectComparisonModal from './components/SuspectComparisonModal';
import normalizeCase from './normalizeCase';
import {
  DEFAULT_STAGE7_FILTERS,
  DEFAULT_STAGE7_WEIGHTS,
  runFilterPipeline
} from './filterEngine';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import caseA1Data from '../input/case_a1.json';

export default function App() {
  // Top-level Navigation View: 'home' | 'pipeline' | 'accuracy' | 'resources' | 'dashboard'
  const [currentView, setCurrentView] = useState('home');

  // Dashboard Sub-navigation tabs: 'monitoring' | 'analytics'
  const [activeTab, setActiveTab] = useState('monitoring');

  // Case Data State (Single Source of Truth)
  const [caseData, setCaseData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading case data…');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Hidden direct file input ref for instant upload
  const fileInputRef = useRef(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMapKeyModalOpen, setIsMapKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Stage 7 Suspect & Filter State
  const [selectedMmsi, setSelectedMmsi] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_STAGE7_FILTERS);
  const [weights, setWeights] = useState(DEFAULT_STAGE7_WEIGHTS);

  // Load sample case file on initial launch to present operational UI
  const loadSampleCase = useCallback(() => {
    setIsLoading(true);
    setLoadingMessage('Loading initial case data…');
    setErrorMsg(null);
    try {
      const data = normalizeCase(caseA1Data);
      setCaseData(data);
      setFileName('CASE_a1.json');

      if (data.filter_defaults) {
        setFilters(prev => ({
          ...prev,
          maxDistanceKm: data.filter_defaults.max_distance_km ?? prev.maxDistanceKm,
          minDwellMins: data.filter_defaults.min_dwell_mins ?? prev.minDwellMins,
          maxSpeedKnots: data.filter_defaults.max_speed_knots ?? prev.maxSpeedKnots,
          shipTypes: data.filter_defaults.ship_types ?? prev.shipTypes,
          timeWindow: data.filter_defaults.time_window ?? prev.timeWindow,
          topN: data.filter_defaults.top_n ?? prev.topN,
          sortBy: data.filter_defaults.sort_by ?? prev.sortBy
        }));
      }

      if (data.suspects && data.suspects.length > 0) {
        setSelectedMmsi(data.suspects[0].mmsi);
      }
    } catch (err) {
      console.error('Error initializing caseA1Data:', err);
      setErrorMsg(`Initialization error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pre-load default sample case data in background
  useEffect(() => {
    loadSampleCase();
  }, [loadSampleCase]);

  // View Navigation Handler
  const handleSelectView = (view) => {
    if (view === 'ecosystem') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('analysis-services-360');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Universal File Upload Handler:
   * 1. Read file
   * 2. Parse JSON
   * 3. Validate
   * 4. Store in case state
   * 5. Refresh complete dashboard
   */
  const handleFileUpload = (file) => {
    if (!file) return;
    setIsLoading(true);
    setLoadingMessage('Loading and validating case file…');
    setErrorMsg(null);
    setSuccessMsg(null);

    const isJson = file.name.endsWith('.json') || file.type === 'application/json';

    if (isJson) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result ? e.target.result.trim() : '';

          if (!content) {
            throw new Error('File is empty.');
          }

          let raw;
          try {
            raw = JSON.parse(content);
          } catch (jsonErr) {
            throw new Error(`Invalid JSON syntax: ${jsonErr.message}`);
          }

          // Structural validation
          if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            throw new Error('Case JSON must be an object root.');
          }

          // Must contain at least one valid case identifier or section
          const hasCaseId = Boolean(raw.case_id || raw.id || raw.title);
          const hasDetection = Boolean(raw.detection);
          const hasHindcast = Boolean(raw.hindcast);
          const hasSuspects = Array.isArray(raw.suspects);

          if (!hasCaseId && !hasDetection && !hasHindcast && !hasSuspects) {
            throw new Error('Missing required case information (detection, hindcast, or suspects array).');
          }

          setLoadingMessage('Processing & normalizing case layers…');

          // Central normalization
          const normalized = normalizeCase(raw);
          if (!normalized) {
            throw new Error('Normalization failed on the provided case data.');
          }

          // Set case state as single source of truth
          setCaseData(normalized);
          setFileName(file.name);
          setCurrentView('dashboard');
          setActiveTab('monitoring');

          // Apply uploaded case filter defaults or dynamically adapted defaults
          const fd = normalized.filter_defaults || {};
          const maxDistInSuspects = (normalized.suspects || []).reduce((max, s) => (s.distance_km != null && !isNaN(Number(s.distance_km))) ? Math.max(max, Number(s.distance_km)) : max, 0);
          const maxSpeedInSuspects = (normalized.suspects || []).reduce((max, s) => (s.avg_speed_knots != null && !isNaN(Number(s.avg_speed_knots))) ? Math.max(max, Number(s.avg_speed_knots)) : max, 0);

          const safeMaxDist = fd.max_distance_km != null
            ? Number(fd.max_distance_km)
            : (maxDistInSuspects > 0 ? Math.max(50, Math.ceil(maxDistInSuspects * 1.25)) : DEFAULT_STAGE7_FILTERS.maxDistanceKm);

          const safeMaxSpeed = fd.max_speed_knots != null
            ? Number(fd.max_speed_knots)
            : (maxSpeedInSuspects > 0 ? Math.max(30, Math.ceil(maxSpeedInSuspects * 1.25)) : DEFAULT_STAGE7_FILTERS.maxSpeedKnots);

          setFilters({
            maxDistanceKm: safeMaxDist,
            minDwellMins: fd.min_dwell_mins != null ? Number(fd.min_dwell_mins) : 0,
            maxSpeedKnots: safeMaxSpeed,
            shipTypes: Array.isArray(fd.ship_types) ? fd.ship_types : [],
            timeWindow: fd.time_window || 'all',
            topN: fd.top_n != null ? Number(fd.top_n) : Math.max(20, (normalized.suspects?.length || 10)),
            sortBy: fd.sort_by || 'score_desc'
          });
          setWeights(DEFAULT_STAGE7_WEIGHTS);

          if (normalized.suspects && normalized.suspects.length > 0) {
            setSelectedMmsi(normalized.suspects[0].mmsi);
          } else {
            setSelectedMmsi(null);
          }

          setSuccessMsg(`Case loaded successfully: ${normalized.case_id} (${normalized.suspects.length} vessels)`);
          setTimeout(() => setSuccessMsg(null), 5000);
        } catch (err) {
          console.error('Validation Error:', err);
          setErrorMsg(`Invalid case file: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setErrorMsg('Failed to read local file from disk.');
        setIsLoading(false);
      };

      reader.readAsText(file);
    } else {
      // For satellite imagery files (PNG/JPG/TIFF)
      setTimeout(() => {
        setIsLoading(false);
        setFileName(file.name);
        setCurrentView('dashboard');
        setActiveTab('monitoring');
        setSuccessMsg(`Satellite image loaded: ${file.name}`);
        setTimeout(() => setSuccessMsg(null), 4000);
      }, 400);
    }
  };

  // Scenario selection from DemoScenarioModal
  const handleSelectScenario = (sc) => {
    if (!sc?.caseData) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const normalized = normalizeCase(sc.caseData);
      setCaseData(normalized);
      setFileName(`${sc.code || sc.id}.json`);
      setCurrentView('dashboard');
      setActiveTab('monitoring');

      const fd = normalized.filter_defaults || {};
      setFilters({
        maxDistanceKm: fd.max_distance_km ?? DEFAULT_STAGE7_FILTERS.maxDistanceKm,
        minDwellMins: fd.min_dwell_mins ?? DEFAULT_STAGE7_FILTERS.minDwellMins,
        maxSpeedKnots: fd.max_speed_knots ?? DEFAULT_STAGE7_FILTERS.maxSpeedKnots,
        shipTypes: fd.ship_types ?? DEFAULT_STAGE7_FILTERS.shipTypes,
        timeWindow: fd.time_window ?? DEFAULT_STAGE7_FILTERS.timeWindow,
        topN: fd.top_n ?? DEFAULT_STAGE7_FILTERS.topN,
        sortBy: fd.sort_by ?? DEFAULT_STAGE7_FILTERS.sortBy
      });
      setWeights(DEFAULT_STAGE7_WEIGHTS);

      if (normalized.suspects && normalized.suspects.length > 0) {
        setSelectedMmsi(normalized.suspects[0].mmsi);
      } else {
        setSelectedMmsi(null);
      }

      setSuccessMsg(`Case loaded successfully: ${normalized.case_id}`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(`Error loading demo scenario: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCase = () => {
    if (!caseData) return;
    setIsExportModalOpen(true);
  };

  // Centralized Stage 7 Dynamic Filtering & Multi-Criteria Scoring Pipeline
  const { filteredCandidates, allCandidates, filterImpact } = useMemo(() => {
    if (!caseData?.suspects) {
      return {
        filteredCandidates: [],
        allCandidates: [],
        filterImpact: { raw: 0, afterDistance: 0, afterDwell: 0, afterSpeed: 0, afterType: 0, afterTime: 0, final: 0 }
      };
    }
    return runFilterPipeline(caseData.suspects, filters, weights);
  }, [caseData, filters, weights]);

  // Adaptive slider maximum bounds derived dynamically from dataset
  const maxDistanceInData = useMemo(() => {
    if (!caseData?.suspects?.length) return 50;
    const maxD = Math.max(...caseData.suspects.map(s => s.distance_km || 0));
    return Math.max(30, Math.ceil(maxD * 1.25));
  }, [caseData]);

  const maxDwellInData = useMemo(() => {
    if (!caseData?.suspects?.length) return 60;
    const maxDw = Math.max(...caseData.suspects.map(s => s.dwell_time_mins || 0));
    return Math.max(60, Math.ceil(maxDw * 1.15));
  }, [caseData]);

  const maxSpeedInData = useMemo(() => {
    if (!caseData?.suspects?.length) return 30;
    const maxSp = Math.max(...caseData.suspects.map(s => s.avg_speed_knots || 0));
    return Math.max(25, Math.ceil(maxSp * 1.25));
  }, [caseData]);

  // Reset filters to uploaded case defaults or adaptive defaults
  const handleResetFilters = () => {
    const jsonDefaults = caseData?.filter_defaults || {};
    const maxDistInSuspects = (caseData?.suspects || []).reduce((max, s) => (s.distance_km != null && !isNaN(Number(s.distance_km))) ? Math.max(max, Number(s.distance_km)) : max, 0);
    const maxSpeedInSuspects = (caseData?.suspects || []).reduce((max, s) => (s.avg_speed_knots != null && !isNaN(Number(s.avg_speed_knots))) ? Math.max(max, Number(s.avg_speed_knots)) : max, 0);

    const safeMaxDist = jsonDefaults.max_distance_km != null
      ? Number(jsonDefaults.max_distance_km)
      : (maxDistInSuspects > 0 ? Math.max(50, Math.ceil(maxDistInSuspects * 1.25)) : DEFAULT_STAGE7_FILTERS.maxDistanceKm);

    const safeMaxSpeed = jsonDefaults.max_speed_knots != null
      ? Number(jsonDefaults.max_speed_knots)
      : (maxSpeedInSuspects > 0 ? Math.max(30, Math.ceil(maxSpeedInSuspects * 1.25)) : DEFAULT_STAGE7_FILTERS.maxSpeedKnots);

    setFilters({
      maxDistanceKm: safeMaxDist,
      minDwellMins: jsonDefaults.min_dwell_mins != null ? Number(jsonDefaults.min_dwell_mins) : 0,
      maxSpeedKnots: safeMaxSpeed,
      shipTypes: Array.isArray(jsonDefaults.ship_types) ? jsonDefaults.ship_types : [],
      timeWindow: jsonDefaults.time_window || 'all',
      topN: jsonDefaults.top_n != null ? Number(jsonDefaults.top_n) : Math.max(20, (caseData?.suspects?.length || 10)),
      sortBy: jsonDefaults.sort_by || 'score_desc'
    });
    setWeights(DEFAULT_STAGE7_WEIGHTS);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#0F172A] flex flex-col font-sans transition-colors">
      {/* Hidden file input for header direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileUpload(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {/* Top Navigation Bar */}
      <Header
        currentView={currentView}
        onSelectView={handleSelectView}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenMapApiKey={() => setIsMapKeyModalOpen(true)}
        onResetSample={loadSampleCase}
        onExportCase={handleExportCase}
        currentCaseId={caseData?.case_id}
        fileName={fileName}
        hasCaseData={Boolean(caseData)}
      />

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-emerald-800 text-xs flex items-center justify-between animate-slide-up z-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div className="bg-rose-50 border-b border-rose-200 px-5 py-2 text-rose-800 text-xs flex items-center justify-between animate-slide-up z-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-600 hover:text-rose-900 underline text-xs cursor-pointer font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: HOMEPAGE */}
      {currentView === 'home' && (
        <Homepage
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPipeline={() => {
            setCurrentView('pipeline');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAccuracy={() => {
            setCurrentView('accuracy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectDemoCase={(sc) => {
            handleSelectScenario(sc);
            setCurrentView('dashboard');
          }}
        />
      )}

      {/* VIEW 2: PIPELINE & THEORY STUDY VIEW */}
      {currentView === 'pipeline' && (
        <PipelineView
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAccuracy={() => {
            setCurrentView('accuracy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onSelectDemoCase={(sc) => {
            handleSelectScenario(sc);
            setCurrentView('dashboard');
          }}
        />
      )}

      {/* VIEW 3: IMPROVED ACCURACY & EMPIRICAL MODEL BENCHMARKS */}
      {currentView === 'accuracy' && (
        <ImprovedAccuracyView
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPipeline={() => {
            setCurrentView('pipeline');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenResources={() => {
            setCurrentView('resources');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW 4: RESOURCES & DATASETS DIRECTORY */}
      {currentView === 'resources' && (
        <ResourcesView
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPipeline={() => {
            setCurrentView('pipeline');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAccuracy={() => {
            setCurrentView('accuracy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectDemoCase={(sc) => {
            handleSelectScenario(sc);
            setCurrentView('dashboard');
          }}
        />
      )}

      {/* VIEW 5: DASHBOARD */}
      {currentView === 'dashboard' && (
        <main className="flex-1 p-3 md:p-4 max-w-[1920px] mx-auto w-full flex flex-col space-y-3">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 min-h-[60vh]">
              <div className="w-9 h-9 border-3 border-slate-300 border-t-[#0284C7] rounded-full animate-spin"></div>
              <p className="text-xs text-slate-600 font-mono font-bold">{loadingMessage}</p>
            </div>
          ) : (
            <>
              {/* SUB-VIEW 1: LIVE MONITORING */}
              {activeTab === 'monitoring' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 items-stretch min-h-[640px]">
                  {/* Left Panel: SATELLITE DATA */}
                  <div className="lg:col-span-3 h-full">
                    <SatelliteDataPanel
                      caseData={caseData}
                      onRefresh={loadSampleCase}
                      onUploadClick={() => setIsUploadModalOpen(true)}
                      onLoadSample={loadSampleCase}
                    />
                  </div>

                  {/* Center Panel: Tactical Map (Connected strictly to filtered candidates) */}
                  <div className="lg:col-span-6 h-full min-h-[560px]">
                    <ForensicMap
                      caseData={caseData}
                      suspects={filteredCandidates}
                      selectedMmsi={selectedMmsi}
                      onSelectSuspect={setSelectedMmsi}
                    />
                  </div>

                  {/* Right Panel: Live Alerts & Suspect Attribution Filters */}
                  <div className="lg:col-span-3 h-full">
                    <LiveAlertsPanel
                      suspects={filteredCandidates}
                      selectedMmsi={selectedMmsi}
                      onSelectSuspect={setSelectedMmsi}
                      onOpenCompare={() => setIsCompareModalOpen(true)}
                      filters={filters}
                      onChangeFilters={setFilters}
                      weights={weights}
                      onChangeWeights={setWeights}
                      onResetFilters={handleResetFilters}
                      totalSuspectsCount={caseData?.suspects?.length || 0}
                      filteredCount={filteredCandidates.length}
                      maxDistanceInData={maxDistanceInData}
                      maxDwellInData={maxDwellInData}
                      maxSpeedInData={maxSpeedInData}
                    />
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: ANALYTICS & REPORTS */}
              {activeTab === 'analytics' && (
                <AnalyticsView
                  caseData={caseData}
                  filteredCandidates={filteredCandidates}
                  allCandidates={allCandidates}
                  filterImpact={filterImpact}
                  selectedMmsi={selectedMmsi}
                  onSelectSuspect={setSelectedMmsi}
                  onOpenExport={() => setIsExportModalOpen(true)}
                  onOpenCompare={() => setIsCompareModalOpen(true)}
                />
              )}
            </>
          )}
        </main>
      )}

      {/* UPLOAD MODAL */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleFileUpload}
        onLoadSample={() => {
          loadSampleCase();
          setCurrentView('dashboard');
        }}
      />

      {/* DEMO SCENARIO CONTROLLER MODAL */}
      <DemoScenarioModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectScenario={handleSelectScenario}
      />

      {/* MAP API KEY MODAL */}
      <MapApiKeyModal
        isOpen={isMapKeyModalOpen}
        onClose={() => setIsMapKeyModalOpen(false)}
        currentKey={localStorage.getItem('sih_map_api_key') || ''}
        currentProvider={localStorage.getItem('sih_map_provider') || 'carto'}
        onSaveKey={(k) => {
          if (k) localStorage.setItem('sih_map_api_key', k);
          else localStorage.removeItem('sih_map_api_key');
        }}
        onSaveProvider={(p) => localStorage.setItem('sih_map_provider', p)}
      />

      {/* EXPORT FORENSIC REPORT MODAL (PDF / CSV / JSON) */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        caseData={caseData}
        filteredCandidates={filteredCandidates}
        allCandidates={allCandidates}
        filters={filters}
        weights={weights}
      />

      {/* SIDE-BY-SIDE CULPRIT COMPARISON MODAL */}
      <SuspectComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        suspects={filteredCandidates.length > 0 ? filteredCandidates : allCandidates}
        selectedMmsi={selectedMmsi}
        onSelectSuspect={setSelectedMmsi}
        caseData={caseData}
      />
    </div>
  );
}
