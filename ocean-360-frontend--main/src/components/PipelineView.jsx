import React, { useState } from 'react';
import {
  Layers, ArrowRight, ArrowLeft, Satellite, Cpu, Compass, Search,
  ShieldCheck, Activity, Database, CheckCircle2, ChevronRight,
  Info, ExternalLink, Sliders, AlertTriangle, BookOpen, Code2,
  MapPin, Wind, Waves, Ship, BarChart3, Sparkles
} from 'lucide-react';

export default function PipelineView({
  onOpenDashboard,
  onOpenHome,
  onOpenAccuracy,
  onOpenDemo,
  onSelectDemoCase
}) {
  const [activeSection, setActiveSection] = useState('all');
  const [copiedFormula, setCopiedFormula] = useState(null);

  const handleCopyFormula = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const navItems = [
    { id: 'all', label: 'Complete Pipeline' },
    { id: 'sec-0', label: '0. System Theory & Physics' },
    { id: 'sec-1', label: '1. SAR Preprocessing' },
    { id: 'sec-2', label: '2. AI Detection & U-Net' },
    { id: 'sec-filter', label: 'Filter Layer' },
    { id: 'sec-3', label: '3. Geometry & State' },
    { id: 'sec-4', label: '4. Ocean Forcing' },
    { id: 'sec-5', label: '5. Drift Hindcast' },
    { id: 'sec-6', label: '6. AIS Maritime Intersect' },
    { id: 'sec-7', label: '7. Multi-Criteria Ranking' },
    { id: 'sec-accuracy', label: 'Empirical Accuracy (95.8%)' },
    { id: 'sec-summary', label: 'Summary & Revision' },
    { id: 'sec-resources', label: 'Resources & Datasets' }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#E0F2FE] selection:text-[#0369A1] flex flex-col pb-24">
      {/* Top Breadcrumb & Header Banner */}
      <section className="bg-white border-b border-slate-200 py-8 px-6 md:px-12 sticky top-[45px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <button
                onClick={onOpenHome}
                className="hover:text-[#0284C7] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <span>/</span>
              <span className="text-[#0284C7] font-semibold">SIH26143 Pipeline Theory & Architecture</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#0F172A]">
                  SIH26143 — Study Notes & Pipeline Theory
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-sans">
                  Deep-dive explanation of <strong>why each stage exists</strong>, underlying physics, math formulas, and the forensic attribution chain.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-md"
            >
              <span>Open Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Horizontal Sticky Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-[#0F172A] text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#0F172A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-16 w-full">

        {/* ============================================================ */}
        {/* 0. SYSTEM THEORY (BIG PICTURE & PROBLEM PHYSICS) */}
        {/* ============================================================ */}
        <section id="sec-0" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-mono text-xs font-bold">
                LAYER 00
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                System Theory (Big Picture & Problem Physics)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 font-semibold">
              Forensic Chain of Evidence
            </span>
          </div>

          {/* Problem Physics Callout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Waves className="w-5 h-5 text-[#0284C7]" />
                <span>Problem Physics</span>
              </h3>
              <ul className="space-y-3 text-sm text-[#334155] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                  <span>
                    <strong>Surface Film Dampening:</strong> Oil on the sea creates a thin viscoelastic surface film that dampens short capillary gravity waves.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                  <span>
                    <strong>Radar Dark Patches:</strong> A smoother surface yields <em>weaker radar backscatter</em> (Bragg scattering cancellation). On SAR radar, oil slicks appear as dark patches against a bright, speckled sea.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                  <span>
                    <strong>Ocean Transport:</strong> The slick moves with ocean currents and is dragged by surface wind (rule of thumb: <strong>~1–3% of wind speed</strong> in the wind direction + surface current).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2 shrink-0" />
                  <span>
                    <strong>Attribution Gap:</strong> By the time a satellite observes the slick, the source ship may be 50–150 km away. <em>Detection alone is not attribution!</em>
                  </span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>The Core System Philosophy</span>
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Your pipeline is an end-to-end <strong>forensic chain of evidence</strong>. You never claim absolute legal guilt from SAR alone; you produce <strong>ranked, explainable candidates</strong> based on verifiable physical models and AIS trajectory correlation.
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
                <strong>SIH Rule:</strong> High-confidence candidate alerts with honest status labels & explainable scores beat black-box accusations.
              </div>
            </div>
          </div>

          {/* Forensic Chain Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[#0F172A] border-b border-slate-200 font-mono">
                  <th className="p-3.5 font-bold">Layer</th>
                  <th className="p-3.5 font-bold">Scientific Theory</th>
                  <th className="p-3.5 font-bold">Output Artifact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="p-3.5 font-bold text-[#0284C7]">Remote Sensing</td>
                  <td className="p-3.5 text-slate-600">Detect radar backscatter anomaly consistent with mineral oil capillary dampening</td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">Calibrated Sigma0 GeoTIFF</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#0284C7]">Geometry</td>
                  <td className="p-3.5 text-slate-600">Measure slick physical state at observation time (area, centroid, perimeter, axis)</td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">State Vector (Lat, Lon, Area km²)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#0284C7]">Geophysics</td>
                  <td className="p-3.5 text-slate-600">Invert ocean hydrodynamic drift backward in time to estimate origin window in space–time</td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">Lagrangian Origin Cloud (24–72h)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#0284C7]">Maritime Tracking</td>
                  <td className="p-3.5 text-slate-600">Determine which vessels were physically present in that space–time release envelope</td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">AIS Trajectory Intersections</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#0284C7]">Decision Support</td>
                  <td className="p-3.5 text-slate-600">Rank culprit hypotheses using multi-criteria explainable scoring with interactive sensitivity</td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">Ranked Suspects Scorecard</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 1 — SAR DATA & PREPROCESSING */}
        {/* ============================================================ */}
        <section id="sec-1" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 01
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                SAR Data & Preprocessing
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Sentinel-1 IW GRDH Calibration</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Image Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-4/3">
                <img
                  src="/imagery/sar_sentinel1.jpg"
                  alt="Sentinel-1 SAR Calibrated Radar Capture"
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-[11px]">
                  Sentinel-1A C-SAR · VV Polarised
                </div>
              </div>
              <p className="text-xs text-slate-500 font-mono text-center">
                Figure 1.1: Calibrated Sentinel-1 SAR C-Band Level-1 GRDH Observation
              </p>
            </div>

            {/* Theory Explanation */}
            <div className="lg:col-span-7 space-y-6 text-sm text-[#334155]">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Theory: What Sentinel-1 SAR Is & Why We Use It
                </h3>
                <p className="leading-relaxed">
                  <strong>Synthetic Aperture Radar (SAR)</strong> is an active microwave instrument that illuminates the Earth's surface with its own radar pulses rather than ambient sunlight. Because microwaves easily penetrate cloud cover, fog, and nighttime darkness, Sentinel-1 guarantees 24/7 all-weather maritime surveillance.
                </p>
                <p className="leading-relaxed">
                  <strong>Sentinel-1 IW GRD (Interferometric Wide Ground Range Detected):</strong> We utilize the <strong>VV (Vertical transmit, Vertical receive)</strong> polarization channel because Bragg scattering from surface capillary waves is strongest in VV, making wave dampening by oil slicks exhibit the sharpest contrast ratio.
                </p>
              </div>

              {/* Preprocessing Steps Table */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Why Raw Data Is Not Model-Ready
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 font-mono text-[#0F172A]">
                      <tr>
                        <th className="p-2.5 text-left font-bold">Step</th>
                        <th className="p-2.5 text-left font-bold">Scientific Purpose & Math</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold text-[#0284C7]">Calibration → Sigma0</td>
                        <td className="p-2.5 text-slate-600">Converts raw digital numbers (DN) to true backscatter reflectivity (\( \sigma^0 \)), ensuring scenes across different dates/angles are comparable.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#0284C7]">Speckle Filter</td>
                        <td className="p-2.5 text-slate-600">SAR suffers from multiplicative speckle noise (coherent wave interference). Lee / Refined Lee filtering suppresses noise while keeping sharp slick boundaries.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#0284C7]">Terrain Correction</td>
                        <td className="p-2.5 text-slate-600">Geocodes slant-range radar pixels to a standardized WGS-84 geographic lat/lon grid (CRS: EPSG:4326), mandatory for spatial area computation and GIS alignment.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#0284C7]">dB Scale Conversion</td>
                        <td className="p-2.5 text-slate-600">σ⁰ (dB) = 10 · log₁₀(σ⁰). Compresses wide dynamic range; oil slicks remain noticeably dark (-25 dB to -30 dB).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Look-Alikes Alert Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>The Fundamental Challenge: Look-Alikes (Why Stage 1 Does Not Prove Oil)</span>
                </div>
                <p>
                  Dark patches on SAR are <em>not always oil</em>: low wind zones (&lt; 3 m/s), biogenic plant slicks, rain cells, oceanic upwelling, current shear, and ship wakes all produce smooth sea surface returns. Stage 1 prepares calibrated data; it does not classify oil.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-mono text-slate-400">Tech Stack:</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-mono text-slate-600">Copernicus SciHub / ASF</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-mono text-slate-600">ESA SNAP Toolbox</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-xs font-mono text-slate-600">GeoTIFF / rasterio</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 2 — DETECTION (CLASSIFIER + U-NET) */}
        {/* ============================================================ */}
        <section id="sec-2" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 02
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Detection (Classifier + U-Net)
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
              Dice ≈ 0.88 · F1 ≈ 0.94
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Diagram Preview */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-16/9">
                <img
                  src="/imagery/unet_segmentation.jpg"
                  alt="U-Net Deep Learning Architecture for SAR Segmentation"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-500 font-mono text-center">
                Figure 2.1: U-Net Encoder-Decoder with Skip Connections for Pixel-Level Masking
              </p>
            </div>

            {/* Content & Math */}
            <div className="lg:col-span-6 space-y-6 text-sm text-[#334155]">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Two Distinct Deep Learning Formulations
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-slate-200 rounded-xl">
                    <thead className="bg-slate-100 font-mono text-[#0F172A]">
                      <tr>
                        <th className="p-2.5 text-left font-bold">Model</th>
                        <th className="p-2.5 text-left font-bold">Learning Task</th>
                        <th className="p-2.5 text-left font-bold">Output</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold text-[#0284C7]">EfficientNet-B0 (CSIRO)</td>
                        <td className="p-2.5 text-slate-600">Scene / Tile Classification</td>
                        <td className="p-2.5 text-slate-600">Single scalar label: <em>Oil (1) vs Sea (0)</em>. Answers: "Is there oil somewhere in this tile?"</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-[#0284C7]">U-Net (SOS Dataset)</td>
                        <td className="p-2.5 text-slate-600">Pixel Semantic Segmentation</td>
                        <td className="p-2.5 text-slate-600">Dense binary mask (1024×1024). Answers: "Exactly which pixels are oil?"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <span className="font-bold font-mono text-[#0F172A]">Why CSIRO Cannot Train U-Net:</span>
                <p>
                  CSIRO chips only have image-level labels (oil vs clean). U-Net requires dense pixel ground-truth masks. Different dataset structures serve completely distinct tasks in the pipeline.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#0F172A]">U-Net Architecture & Loss Function Theory</h4>
                <p className="leading-relaxed text-xs">
                  <strong>Encoder:</strong> Progressively downsamples spatial resolution to extract high-level feature maps. <br />
                  <strong>Decoder:</strong> Upsamples feature maps back to original 1024×1024 resolution. <br />
                  <strong>Skip Connections:</strong> Pass fine, high-resolution edge details across contracting and expanding paths to preserve sharp slick borders.
                </p>

                {/* Formula Block */}
                <div className="p-3 bg-slate-900 text-cyan-300 font-mono text-xs rounded-xl flex items-center justify-between">
                  <span>Loss = BCE_Loss + (1 - Dice_Coefficient)</span>
                  <button
                    onClick={() => handleCopyFormula('f1', 'Loss = BCE + (1 - (2 * |A ∩ B|) / (|A| + |B|))')}
                    className="text-slate-400 hover:text-white cursor-pointer text-[10px]"
                  >
                    {copiedFormula === 'f1' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Because oil pixels comprise &lt; 2% of the scene, pure accuracy is useless (a model predicting all ocean gets 98% accuracy). Combined <strong>Dice + BCE loss</strong> forces the network to maximize intersection-over-union.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FILTER LAYER — CANDIDATE CONTROL THEORY */}
        {/* ============================================================ */}
        <section id="sec-filter" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-mono text-xs font-bold">
                FILTER LAYER
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Candidate Control Theory (Reliable Software Design)
              </h2>
            </div>
            <span className="text-xs font-mono text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-semibold">
              Operational Gatekeeping
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Machine learning predictions are <em>hypotheses, not truth</em>. In operational deployments, without an automated filter layer, false alarms would flood maritime coast guards. Reliability does not mean zero ML error; <strong>reliability means controlled false alarms with honest status labels.</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-[#0284C7]">01. Minimum Area</span>
              <p className="text-xs text-slate-600">
                Real slicks possess spatial coherence. Isolated clusters (&lt; 0.5 km² or &lt; 50 pixels) are discarded as sensor speckle noise.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-[#0284C7]">02. Edge Rejection</span>
              <p className="text-xs text-slate-600">
                Radar swath borders and scene seams exhibit severe intensity drops. Slicks touching edge margins are flagged to prevent false gradients.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-[#0284C7]">03. Maximum Fraction</span>
              <p className="text-xs text-slate-600">
                If &gt; 40% of an ocean tile is labeled as oil, it indicates regional low-wind sea calming or rain collapse, not an industrial oil spill.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-[#0284C7]">04. Spatial Compactness</span>
              <p className="text-xs text-slate-600">
                Checks shape elongation. Real vessel discharges form slender continuous tracks along navigation corridors rather than diffuse clouds.
              </p>
            </div>
          </div>

          {/* Decision Policy ASCII Pipeline */}
          <div className="p-4 bg-[#0F172A] rounded-2xl text-slate-300 font-mono text-xs overflow-x-auto">
            <span className="text-emerald-400 font-bold">Decision Policy: </span>
            <span>Raw GRD → U-Net Inference → Rule Filters → Confidence ≥ Threshold → High-Confidence Spill Candidate (Proceed to Drift)</span>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 3 — CHARACTERISATION (GEOMETRY THEORY) */}
        {/* ============================================================ */}
        <section id="sec-3" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 03
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Characterisation & Geometry Theory
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">State Vector Computation</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Once a binary segmentation polygon is confirmed, we convert pixel groupings into a georeferenced <strong>Physical State Vector</strong> representing the slick at observation time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase">Observable 1</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Surface Area (km²)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct proxy for discharge severity. Computed as pixel count × pixel resolution² (100 m² per pixel in 10m Sentinel-1 GRD).
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase">Observable 2</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Centroid (Lat, Lon)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Geometric center of mass (spatial moments). Acts as the critical seed point for inverse particle tracking in Stage 5.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase">Observable 3</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Perimeter & Complexity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates boundary length and compactness ratio. Fractured borders indicate weathering, wave dispersion, and age.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase">Observable 4</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Orientation Angle</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Principal axis computed via ellipse fitting or PCA. Typically aligns with the direction of prevailing wind or vessel heading.
              </p>
            </div>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-[#0369A1] space-y-1">
            <strong>Why Georeferencing is Mandatory:</strong>
            <p>
              Without rasterio affine transformation metadata (transform matrix + EPSG:4326 CRS), a centroid is merely a pixel coordinate (x, y). Real Earth coordinates (Latitude, Longitude) are essential to feed hydrodynamic ocean models and query AIS maritime databases.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 4 — OCEAN & ATMOSPHERE FORCING */}
        {/* ============================================================ */}
        <section id="sec-4" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 04
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Ocean & Atmosphere Forcing (Geophysical Theory)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">CMEMS & ECMWF Integration</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Waves className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm">Ocean Currents (u, v)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Horizontal transport of the ocean surface mixed layer. Sourced from Copernicus Marine Service (CMEMS) GLOBAL_ANALYSISFORECAST_PHY_001_024 at 1/12° spatial resolution.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm">Atmospheric Wind Stress</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct aerodynamic drag on the floating oil film. Uses ECMWF ERA5 10-meter wind vectors (u10, v10) with an empirical wind leeway drift coefficient (\( \alpha \approx 0.03 \)).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm">72-Hour Temporal Slices</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hindcasts integrate backward across 24h, 48h, and 72h horizons. Subsetting tightly around the spill bounding box keeps files light (&lt; 2 MB) and computation instantaneous.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 5 — HINDCAST (INVERSE DRIFT THEORY) */}
        {/* ============================================================ */}
        <section id="sec-5" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 05
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Hindcast (Inverse Drift Theory)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Lagrangian Particle Advection</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Image */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3">
                <img
                  src="/imagery/drift_hindcast.jpg"
                  alt="Oil Spill Trajectory Hindcast Simulation"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-500 font-mono text-center">
                Figure 5.1: Backward Lagrangian Particle Cloud Reconstructing Release Origin Zone
              </p>
            </div>

            {/* Theory */}
            <div className="lg:col-span-6 space-y-5 text-sm text-[#334155]">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Forward Forecast vs. Backward Hindcast
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <strong className="text-slate-800">Forward Forecast:</strong>
                    <p className="text-slate-600 mt-1">"Where will the oil spill travel over the next 48 hours?" (Response & boom placement)</p>
                  </div>
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                    <strong className="text-[#0284C7]">Backward Hindcast:</strong>
                    <p className="text-slate-700 mt-1">"Where was this oil dumped hours before the satellite saw it?" (Forensic culprit attribution)</p>
                  </div>
                </div>
              </div>

              {/* Math Formula */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#0F172A]">Mathematical Formulation</h4>
                <div className="p-4 bg-slate-900 text-cyan-300 font-mono text-xs rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span>x(t - Δt) ≈ x(t) - v(x, t) · Δt</span>
                    <button
                      onClick={() => handleCopyFormula('f2', 'x(t - Δt) = x(t) - (v_current + 0.03 * v_wind) * Δt')}
                      className="text-slate-400 hover:text-white cursor-pointer text-[10px]"
                    >
                      {copiedFormula === 'f2' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    where v(x, t) = v_current(x, t) + α · v_wind(x, t), and α ≈ 0.03 (wind leeway)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                <p>
                  <strong>Lagrangian Particle Clouds:</strong> We seed hundreds of synthetic particles throughout the detected slick footprint and integrate them backward in time using RK4 (4th-order Runge-Kutta) numerical integration.
                </p>
                <p>
                  <strong>Uncertainty in Age:</strong> Because the spill age is unknown when seen, we run multiple time horizons (<strong>24h, 48h, 72h</strong>). Tight particle convergence indicates high geometric confidence, whereas wide dispersion indicates ocean shear uncertainty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 6 — AIS THEORY (WHO WAS THERE?) */}
        {/* ============================================================ */}
        <section id="sec-6" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 06
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                AIS Maritime Theory (Who Was There?)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Spatio-Temporal Intersection</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Image */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 bg-slate-950">
                <img
                  src="/imagery/ais_tracking.jpg"
                  alt="AIS Vessel Trajectory Reconstructions & Release Zone Intersection"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-500 font-mono text-center">
                Figure 6.1: Historical AIS Vessel Trajectory Reconstructions Intersecting Release Zone
              </p>
            </div>

            {/* Theory */}
            <div className="lg:col-span-6 space-y-5 text-sm text-[#334155]">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Attribution Theory via Space-Time Neighborhood
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Ships broadcast VHF Automatic Identification System (AIS) messages detailing their MMSI, position, speed over ground (SOG), and course over ground (COG). If an oil release occurred at origin \((Lat_0, Lon_0, t_0)\), the culprit vessel <strong>must</strong> have sailed through that space–time neighborhood.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider font-mono">
                  Spatio-Temporal Query Parameters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#0284C7]">Spatial Radius</span>
                    <p className="text-slate-500">Accounts for origin cloud spread and current model deviation (~15–25 km buffer).</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#0284C7]">Time Buffer</span>
                    <p className="text-slate-500">Covers uncertainty in the exact release hour (±3 hours window around estimated hindcast time).</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-[#0284C7]">Trajectory Splines</span>
                    <p className="text-slate-500">Interpolates discrete AIS broadcast pings into continuous voyage lines.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong>No Neural Net Required:</strong>
                <p>
                  Stage 6 does not require a black-box AI model: it is a pure, transparent <strong>database query + geospatial polygon intersection</strong> executed with pandas and geopandas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* STAGE 7 — RANKING THEORY (MULTI-CRITERIA DECISION) */}
        {/* ============================================================ */}
        <section id="sec-7" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                STAGE 07
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Ranking Theory (Multi-Criteria Decision Analysis - MCDA)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-100 font-bold">
              Explainable Scoring
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Rather than producing an uninterpretable single label, we formulate attribution as an <strong>explainable Multi-Criteria Decision Analysis (MCDA)</strong> problem where every candidate ship receives transparent component scores.
          </p>

          {/* Scoring Formula */}
          <div className="p-5 bg-slate-900 text-cyan-300 font-mono text-xs rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Score = ∑ (w_i · s_i), where ∑ w_i = 1.0</span>
              <button
                onClick={() => handleCopyFormula('f3', 'Score = 0.30*Proximity + 0.25*Dwell + 0.20*Speed + 0.15*Path + 0.10*ShipType')}
                className="text-slate-400 hover:text-white cursor-pointer text-[10px]"
              >
                {copiedFormula === 'f3' ? 'Copied Weights!' : 'Copy Formula'}
              </button>
            </div>
            <div className="text-slate-400 text-[11px]">
              Default calibrated SIH weights: Proximity (30%) · Dwell Time (25%) · Speed Anomaly (20%) · Path Alignment (15%) · Vessel Type (10%)
            </div>
          </div>

          {/* Feature Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 text-[#0F172A] font-mono">
                <tr>
                  <th className="p-3 text-left font-bold">Feature</th>
                  <th className="p-3 text-left font-bold">Default Weight</th>
                  <th className="p-3 text-left font-bold">Physical Reason for Suspicion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="p-3 font-bold text-[#0284C7]">Proximity to Origin</td>
                  <td className="p-3 font-mono font-bold text-[#0F172A]">0.30 (30%)</td>
                  <td className="p-3 text-slate-600">The vessel must have passed extremely close to the hindcast release center at that exact hour.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0284C7]">Dwell Time in Box</td>
                  <td className="p-3 font-mono font-bold text-[#0F172A]">0.25 (25%)</td>
                  <td className="p-3 text-slate-600">Discharging bilge waste or illegal tank washing operations requires time; lingering vessels exhibit high dwell scores.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0284C7]">Speed Anomaly (Low Speed)</td>
                  <td className="p-3 font-mono font-bold text-[#0F172A]">0.20 (20%)</td>
                  <td className="p-3 text-slate-600">Deliberate discharges frequently occur during slowing down (&lt; 10 knots) or drifting maneuvers.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0284C7]">Path Alignment</td>
                  <td className="p-3 font-mono font-bold text-[#0F172A]">0.15 (15%)</td>
                  <td className="p-3 text-slate-600">Vessel trajectory azimuth matches the orientation and elongation axis of the detected slick trail.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0284C7]">Vessel Type Prior</td>
                  <td className="p-3 font-mono font-bold text-[#0F172A]">0.10 (10%)</td>
                  <td className="p-3 text-slate-600">Crude oil tankers, chemical carriers, and cargo ships have higher operational base rates for oil residues than yachts or tugs.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              <strong>Interactive What-If Sensitivity:</strong> The Live Dashboard exposes these 5 weights as interactive sliders so operators can test alternative legal hypotheses in real time!
            </span>
            <button
              onClick={onOpenDashboard}
              className="px-3.5 py-1.5 rounded-full bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition-all cursor-pointer shrink-0 ml-4"
            >
              Try Sliders in Dashboard →
            </button>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SUMMARY & QUICK REVISION TABLE */}
        {/* ============================================================ */}
        <section id="sec-summary" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#D97706] text-white font-mono text-xs font-bold">
                REVISION GUIDE
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                Quick Revision Table (Exam & Presentation Ready)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Key Keywords per Stage</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 text-[#0F172A] font-mono">
                <tr>
                  <th className="p-3 text-left font-bold">Stage</th>
                  <th className="p-3 text-left font-bold">Name</th>
                  <th className="p-3 text-left font-bold">Core Theory Keyword</th>
                  <th className="p-3 text-left font-bold">Primary Software / Metric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 1</td>
                  <td className="p-3 font-medium text-slate-800">SAR Ingestion & Preprocessing</td>
                  <td className="p-3 text-slate-600">Backscatter (\( \sigma^0 \)), Lee speckle filter, Terrain geocoding</td>
                  <td className="p-3 font-mono text-xs text-slate-500">ESA SNAP, Sentinel-1 IW GRD</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 2</td>
                  <td className="p-3 font-medium text-slate-800">Deep Learning Detection</td>
                  <td className="p-3 text-slate-600">Classification vs. Segmentation, Dice + BCE loss, Domain shift</td>
                  <td className="p-3 font-mono text-xs text-slate-500">U-Net (Dice ≈ 0.88), EfficientNet (F1 ≈ 0.94)</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-amber-600">Filter Layer</td>
                  <td className="p-3 font-medium text-slate-800">Candidate Control Gate</td>
                  <td className="p-3 text-slate-600">Candidate vs. Confirmation, Look-alikes suppression, Edge rejection</td>
                  <td className="p-3 font-mono text-xs text-slate-500">Area &gt; 0.5 km², Max fraction &lt; 40%</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 3</td>
                  <td className="p-3 font-medium text-slate-800">Characterisation</td>
                  <td className="p-3 text-slate-600">Centroid seeding, Surface area (km²), Coordinate Reference System</td>
                  <td className="p-3 font-mono text-xs text-slate-500">OpenCV moments, EPSG:4326</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 4</td>
                  <td className="p-3 font-medium text-slate-800">Geophysical Forcing</td>
                  <td className="p-3 text-slate-600">Advection forcing, Surface current (u, v), Wind drag (3% leeway)</td>
                  <td className="p-3 font-mono text-xs text-slate-500">Copernicus Marine, ECMWF ERA5</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 5</td>
                  <td className="p-3 font-medium text-slate-800">Lagrangian Hindcast</td>
                  <td className="p-3 text-slate-600">Inverse time integration (\( t - \Delta t \)), Particle cloud, Multi-horizon (24/48/72h)</td>
                  <td className="p-3 font-mono text-xs text-slate-500">OpenDrift, RK4 Particle Integrator</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 6</td>
                  <td className="p-3 font-medium text-slate-800">AIS Maritime Tracking</td>
                  <td className="p-3 text-slate-600">Space–time neighborhood buffer, Historical voyage spline reconstruction</td>
                  <td className="p-3 font-mono text-xs text-slate-500">pandas, geopandas polygon intersect</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 7</td>
                  <td className="p-3 font-medium text-slate-800">Culprit Attribution Ranking</td>
                  <td className="p-3 text-slate-600">Multi-Criteria Decision Analysis (MCDA), Explainable scoring weights</td>
                  <td className="p-3 font-mono text-xs text-slate-500">5-factor weighted linear combination</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-[#0284C7]">Stage 8</td>
                  <td className="p-3 font-medium text-slate-800">Decision Support Dashboard</td>
                  <td className="p-3 text-slate-600">Situational awareness, Layered forensic evidence, Sensitivity tuning</td>
                  <td className="p-3 font-mono text-xs text-slate-500">React, Leaflet/MapLibre, Tailwind</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* One-Page Oral Closer Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] to-slate-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>SIH Narrative in One Breath (Oral Closer)</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic text-slate-200 leading-relaxed">
              "We detect dark SAR films with deep learning, constrain false alarms with rigorous rules, measure slick geometry, invert ocean drift backward to a source window, and then rank vessels by spatio-temporal behaviour—presented as an explainable, interactive forensic briefing."
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-300">Detect: SAR + U-Net</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-300">Trace: Ocean Current Drift</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-300">Attribute: AIS Multi-Criteria Scoring</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* EMPIRICAL MODEL ACCURACY & EVALUATION BENCHMARKS */}
        {/* ============================================================ */}
        <section id="sec-accuracy" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold">
                  EMPIRICAL EVALUATION
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                  Trained Model Accuracy & Test Benchmarks
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                Real checkpoint test metrics evaluated on blind Sentinel-1 C-SAR patches ingested via Alaska Satellite Facility (ASF DAAC).
              </p>
            </div>
            <button
              onClick={onOpenAccuracy}
              className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold font-mono hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>View Interactive Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">EfficientNet-B0</span>
              <div className="text-3xl font-black font-serif text-[#0F172A]">95.85%</div>
              <p className="text-[11px] text-slate-500">Test Accuracy (554 patches) · Oil F1: 0.9387</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-mono text-[#0284C7] font-bold uppercase">Custom U-Net</span>
              <div className="text-3xl font-black font-serif text-[#0284C7]">0.8828</div>
              <p className="text-[11px] text-slate-500">Test Dice Overlap · Test IoU: 0.7926</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-mono text-amber-600 font-bold uppercase">Oil Spill Recall</span>
              <div className="text-3xl font-black font-serif text-[#D97706]">95.65%</div>
              <p className="text-[11px] text-slate-500">176 / 184 Detected · Only 8 Missed Spills</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-mono text-purple-600 font-bold uppercase">Fay Age Inversion</span>
              <div className="text-3xl font-black font-serif text-purple-700">1.65 h</div>
              <p className="text-[11px] text-slate-500">Median Age (3.00–0.30h band) · Compactness: 0.8727</p>
            </div>
          </div>

          {/* Terminal Highlights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Classification & Confusion Matrix */}
            <div className="p-5 rounded-2xl bg-[#0F172A] text-white border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                <span>STAGE 1 & 2 · EFFICIENTNET-B0 EVALUATION</span>
                <span className="text-slate-400">Epoch 5 Best Checkpoint</span>
              </div>
              <div className="p-3 bg-black/60 rounded-xl text-slate-300 space-y-1 text-[11px]">
                <div className="text-slate-400">TEST SET CLASSIFICATION REPORT:</div>
                <div className="text-slate-400">              precision    recall  f1-score   support</div>
                <div>No Oil (0)    0.9780    0.9595    0.9686       370</div>
                <div className="text-emerald-400 font-bold">   Oil (1)    0.9215    0.9565    0.9387       184</div>
                <div className="pt-1 text-slate-400">accuracy                               0.9585       554</div>
                <div className="pt-2 text-emerald-400">CONFUSION MATRIX: [[355 15], [8 176]]</div>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                High recall (95.65%) ensures minimal missed environmental spills, while 355/370 clean water patches are correctly discarded without raising false alarms.
              </p>
            </div>

            {/* U-Net & Age Estimation */}
            <div className="p-5 rounded-2xl bg-[#0B132B] text-white border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-sky-400 font-bold text-[11px]">
                <span>STAGE 3 & 4 · U-NET SEGMENTATION & FAY AGE</span>
                <span className="text-slate-400">Epoch 30 Best Checkpoint</span>
              </div>
              <div className="p-3 bg-black/60 rounded-xl text-slate-300 space-y-1 text-[11px]">
                <div className="text-slate-400">Loading best checkpoint for test evaluation...</div>
                <div className="text-sky-300 font-bold">TEST Dice: 0.8828  IoU: 0.7926</div>
                <div className="text-slate-400">Best Val Dice: 0.8855  IoU: 0.7971  Epoch: 30</div>
                <div className="pt-1 text-slate-500">Saved metrics → outputs\unet_test_metrics.txt</div>
                <div className="pt-1 text-purple-300">Fay-sanity age band: 3.00–0.30 h (median 1.65 h)</div>
                <div className="text-purple-300">Compactness: 0.8727 | Orientation: 45.00°</div>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Mixed BCE + Dice loss prevents spatial boundary erosion on thin dispersing trailing tails, yielding 0.8828 Dice score compared to 0.8120 for baseline pure-BCE networks.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* RESOURCES & DATASETS DIRECTORY */}
        {/* ============================================================ */}
        <section id="sec-resources" className="scroll-mt-40 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white font-mono text-xs font-bold">
                  RESOURCES & DIRECTORY
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0F172A]">
                  Stage-by-Stage Resources, Datasets & Source Links
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                Official source repositories, satellite data APIs, open-access machine learning benchmarks, and data pipelines used in each stage.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-semibold shrink-0">
              100% Open Access & Verifiable
            </span>
          </div>

          {/* COMPLETE STAGE-BY-STAGE RESOURCES TABLE */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">
              Stage-by-Stage Datasets, APIs, Models & Source Links
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 text-[#0F172A] font-mono">
                  <tr>
                    <th className="p-3.5 text-left font-bold">Pipeline Stage</th>
                    <th className="p-3.5 text-left font-bold">Resource / Dataset Name</th>
                    <th className="p-3.5 text-left font-bold">Provider / Category</th>
                    <th className="p-3.5 text-left font-bold">Purpose in Stage</th>
                    <th className="p-3.5 text-left font-bold">Official Source Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {/* RESEARCH PAPERS */}
                  <tr className="bg-sky-50/50 hover:bg-sky-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-700">Research</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Trujillo-Acatitla et al. (2024)
                    </td>
                    <td className="p-3.5 text-slate-600">Marine Pollution Bulletin · Elsevier</td>
                    <td className="p-3.5 text-slate-600">Dual-stage deep learning framework for SAR detection & segmentation (Foundation for CNN + U-Net)</td>
                    <td className="p-3.5">
                      <a
                        href="https://doi.org/10.1016/j.marpolbul.2024.116549"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>DOI: 116549</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="bg-sky-50/50 hover:bg-sky-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-700">Research</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Li et al. (2023)
                    </td>
                    <td className="p-3.5 text-slate-600">Remote Sensing of Environment · Elsevier</td>
                    <td className="p-3.5 text-slate-600">Self-evolving deep learning for automated SAR oil spill detection & look-alike rejection</td>
                    <td className="p-3.5">
                      <a
                        href="https://doi.org/10.1016/J.RSE.2023.113872"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>DOI: 113872</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="bg-sky-50/50 hover:bg-sky-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-700">Research</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Kalogirou et al. (2025)
                    </td>
                    <td className="p-3.5 text-slate-600">ISPRS Archives · Copernicus</td>
                    <td className="p-3.5 text-slate-600">Oil spill detection combining Convolutional Neural Networks and Sentinel-1 SAR imagery</td>
                    <td className="p-3.5">
                      <a
                        href="https://doi.org/10.5194/isprs-archives-XLVIII-G-2025-757-2025"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>DOI: 757-2025</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="bg-sky-50/50 hover:bg-sky-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-emerald-700">Research</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Alkhalifa et al. (2025)
                    </td>
                    <td className="p-3.5 text-slate-600">ISPRS Annals · Copernicus</td>
                    <td className="p-3.5 text-slate-600">SAR & deep learning/ViTs in UAE / Arabian marine waters (Key regional foundation)</td>
                    <td className="p-3.5">
                      <a
                        href="https://doi.org/10.5194/isprs-annals-X-G-2025-57-2025"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>DOI: 57-2025</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 1 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 1</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Sentinel-1 C-SAR GRD Products
                    </td>
                    <td className="p-3.5 text-slate-600">ESA / Copernicus CDSE</td>
                    <td className="p-3.5 text-slate-600">Level-1 IW Ground Range Detected radar observations (VV polarization)</td>
                    <td className="p-3.5">
                      <a
                        href="https://dataspace.copernicus.eu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>dataspace.copernicus.eu</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 1</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Alaska Satellite Facility (ASF DAAC)
                    </td>
                    <td className="p-3.5 text-slate-600">NASA / ASF DAAC & Vertex</td>
                    <td className="p-3.5 text-slate-600">Programmatic wget script & API bulk download for original Sentinel-1 SAR training/testing granules</td>
                    <td className="p-3.5">
                      <a
                        href="https://asf.alaska.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>asf.alaska.edu</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 1</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      ESA SNAP Toolbox (gpt command line)
                    </td>
                    <td className="p-3.5 text-slate-600">European Space Agency</td>
                    <td className="p-3.5 text-slate-600">Radiometric calibration, Lee speckle filtering, Range Doppler terrain correction</td>
                    <td className="p-3.5">
                      <a
                        href="https://step.esa.int/main/toolboxes/snap/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>step.esa.int/snap</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 2 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 2</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      CSIRO Oil Spill Image Chip Dataset
                    </td>
                    <td className="p-3.5 text-slate-600">CSIRO Marine Research</td>
                    <td className="p-3.5 text-slate-600">Training EfficientNet-B0 scene-level binary classifier (Oil vs Clean ocean)</td>
                    <td className="p-3.5">
                      <a
                        href="https://www.csiro.au/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>csiro.au</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 2</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Satellite Ocean Spill (SOS) Dataset
                    </td>
                    <td className="p-3.5 text-slate-600">Remote Sensing Academic Benchmark</td>
                    <td className="p-3.5 text-slate-600">Dense pixel-level ground truth masks for training U-Net segmentation</td>
                    <td className="p-3.5">
                      <a
                        href="https://github.com/m4ans/Satellite-Ocean-Spill-Dataset"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>GitHub / SOS Benchmark</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 2</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Segmentation Models PyTorch (smp)
                    </td>
                    <td className="p-3.5 text-slate-600">Open-Source PyTorch Library</td>
                    <td className="p-3.5 text-slate-600">Pretrained U-Net architectures with VGG16/ResNet backbones & Dice+BCE loss</td>
                    <td className="p-3.5">
                      <a
                        href="https://github.com/qubvel/segmentation_models.pytorch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>github.com/qubvel/smp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 3 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 3</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      OpenCV & Shapely Geometry
                    </td>
                    <td className="p-3.5 text-slate-600">Python Geospatial Libraries</td>
                    <td className="p-3.5 text-slate-600">Spatial moments for centroid lat/lon, contour area in km², perimeter & principal axis</td>
                    <td className="p-3.5">
                      <a
                        href="https://shapely.readthedocs.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>shapely.readthedocs.io</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 4 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 4</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Copernicus Marine Physics Product
                    </td>
                    <td className="p-3.5 text-slate-600">CMEMS (GLOBAL_ANALYSISFORECAST_PHY)</td>
                    <td className="p-3.5 text-slate-600">Global surface ocean current vectors (u, v) at 1/12° spatial resolution</td>
                    <td className="p-3.5">
                      <a
                        href="https://marine.copernicus.eu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>marine.copernicus.eu</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 4</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      ECMWF ERA5 Reanalysis Winds
                    </td>
                    <td className="p-3.5 text-slate-600">ECMWF Atmospheric Model</td>
                    <td className="p-3.5 text-slate-600">Hourly 10-meter neutral surface wind fields (u10, v10) for leeway transport</td>
                    <td className="p-3.5">
                      <a
                        href="https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>ecmwf.int/era5</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 5 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 5</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      OpenDrift / OpenOil Framework
                    </td>
                    <td className="p-3.5 text-slate-600">Norwegian Meteorological Institute</td>
                    <td className="p-3.5 text-slate-600">Lagrangian inverse backward-in-time RK4 particle advection & leeway dynamics</td>
                    <td className="p-3.5">
                      <a
                        href="https://opendrift.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>opendrift.github.io</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 6 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 6</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      NOAA MarineCadastre AIS Archives
                    </td>
                    <td className="p-3.5 text-slate-600">US NOAA / BOEM</td>
                    <td className="p-3.5 text-slate-600">Terrestrial & Satellite AIS historical voyage database (MMSI, SOG, COG, Lat/Lon)</td>
                    <td className="p-3.5">
                      <a
                        href="https://marinecadastre.gov/ais/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>marinecadastre.gov/ais</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 6</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      MovingPandas & GeoPandas
                    </td>
                    <td className="p-3.5 text-slate-600">Spatio-Temporal Python GIS</td>
                    <td className="p-3.5 text-slate-600">Trajectory spline reconstruction, speed profiling, polygon intersection buffer</td>
                    <td className="p-3.5">
                      <a
                        href="https://movingpandas.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>movingpandas.org</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 7 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 7</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Multi-Criteria Decision Analysis (MCDA)
                    </td>
                    <td className="p-3.5 text-slate-600">Analytic Hierarchy Process / WLC</td>
                    <td className="p-3.5 text-slate-600">Weighted linear combination of Proximity, Dwell Time, SOG Anomaly, Path & Type</td>
                    <td className="p-3.5">
                      <a
                        href="https://scikit-learn.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>scikit-learn.org</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>

                  {/* STAGE 8 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0284C7]">Stage 8</td>
                    <td className="p-3.5 font-bold text-slate-800">
                      Leaflet & CartoDB Dark Matter
                    </td>
                    <td className="p-3.5 text-slate-600">Web GIS & Mapping Stack</td>
                    <td className="p-3.5 text-slate-600">Interactive satellite SAR overlays, drift vector fields, vessel markers & track playback</td>
                    <td className="p-3.5">
                      <a
                        href="https://leafletjs.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0284C7] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>leafletjs.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
