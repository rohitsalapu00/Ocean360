import React, { useState, useEffect } from 'react';
import {
  Upload, Play, ArrowRight, ChevronLeft, ChevronRight, ChevronDown,
  Award, TrendingUp, Cpu, CheckCircle2, Shield, Scale, Radar,
  LifeBuoy, FileCheck, Fish, Building2, Gavel, Users, ArrowUpRight,
  AlertTriangle, Eye, Globe, Compass, ExternalLink, Activity, Pause,
  RotateCw
} from 'lucide-react';

const CORNERS_360 = [
  {
    id: 'c1',
    cornerNum: 'CORNER 01',
    shortNum: 'C-01',
    title: 'Environmental Protection',
    shortTitle: 'Ecology Defense',
    badge: 'Ecology & Habitat',
    agency: 'MoEFCC & Coastal Conservation Teams',
    icon: Globe,
    image: '/imagery/sar_sentinel1.jpg',
    imageCaption: 'Sentinel-1 C-Band SAR Radar: Capillary wave dampening exposes dark slick contour encroaching on coral sanctuaries.',
    sensorTag: 'Sentinel-1 C-SAR IW · 10m Res',
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    ringColor: 'border-emerald-500 bg-emerald-500/10 text-emerald-700',
    dotBorder: 'border-emerald-400 group-hover:border-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    tagline: 'Preserving fragile marine ecosystems, coral reefs, and artisanal fisheries from irreversible contamination.',
    objectives: [
      { need: 'Protect mangroves, coral reefs, and fisheries', deliverable: 'Early detection within hours of overpass before oil weathers into toxic emulsified mousse.' },
      { need: 'Prevent slick from reaching shallow shorelines', deliverable: 'Lagrangian forward forecast envelope + arrival ETA countdown to coastal beaching.' },
      { need: 'Reduce ecological impact in critical habitats', deliverable: 'Automated priority overlay for marine protected areas (MPAs) & breeding zones.' },
      { need: 'Support rapid response cleanup logistics', deliverable: 'Slick spatial area (km²), thickness proxy gradient, and estimated oil type volume.' }
    ],
    metric: 'Time from Sentinel-1 overpass → alert to ICG < 2 hours',
    note: 'Early containment within the first 6 hours cuts coastal remediation costs by up to 85%.'
  },
  {
    id: 'c2',
    cornerNum: 'CORNER 02',
    shortNum: 'C-02',
    title: 'Attribution & Justice',
    shortTitle: 'Forensic Attribution',
    badge: 'Legal Forensics',
    agency: 'Admiralty Courts & Maritime Legal Tribunals',
    icon: Scale,
    image: '/imagery/ais_tracking.jpg',
    imageCaption: 'Multi-Vessel AIS S-AIS Intercept Vectoring: High-density AIS kinematic tracking correlated with backwards drift release envelope.',
    sensorTag: 'Terrestrial & Satellite AIS Fusion',
    accentColor: 'text-sky-600 bg-sky-50 border-sky-200',
    ringColor: 'border-sky-500 bg-sky-500/10 text-sky-700',
    dotBorder: 'border-sky-400 group-hover:border-sky-300',
    glowColor: 'rgba(2, 132, 199, 0.6)',
    tagline: 'Transforming satellite backscatter and vessel GPS tracks into mathematically defensible suspect dossiers.',
    objectives: [
      { need: 'Identify the polluting vessel without bias', deliverable: 'Ranked suspect list with multi-criteria MCDA confidence score (0–100).' },
      { need: 'Create permanent maritime deterrence in Indian waters', deliverable: 'Consistent longitudinal tracking of chronic night discharges across sea lanes.' },
      { need: 'Enable legal compensation under Civil Liability Convention', deliverable: 'Unbroken forensic chain: slick → backward drift cone → vessel trajectory.' },
      { need: 'Support national maritime court prosecution', deliverable: 'Explainable AHP criteria weights with complete sensitivity audit (no black-box scores).' }
    ],
    metric: 'Top-1 suspect correct in >70% of validated cases; top-3 in >90%',
    note: 'Legal Reality: Ocean 360 produces intelligence-grade forensic trails to direct physical boarding and bunker sampling, not speculative conjecture.'
  },
  {
    id: 'c3',
    cornerNum: 'CORNER 03',
    shortNum: 'C-03',
    title: 'Maritime Domain Awareness',
    shortTitle: 'Dark Fleet (NTRO)',
    badge: "NTRO's Core Interest",
    agency: 'National Technical Research Org (NTRO)',
    icon: Radar,
    image: '/imagery/sar_sentinel1.jpg',
    imageCaption: 'SAR Radar Cross-Section vs Missing AIS Gap: Pinpoints dark ships deliberately disabling transponders inside the Indian EEZ.',
    sensorTag: 'SAR Cross-Section & S-AIS Anomaly',
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    ringColor: 'border-indigo-500 bg-indigo-500/10 text-indigo-700',
    dotBorder: 'border-indigo-400 group-hover:border-indigo-300',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    tagline: 'Exposing dark vessels, AIS transponder tampering, and illicit high-seas rendezvous in the Indian EEZ.',
    objectives: [
      { need: 'Continuous surveillance across the 2.37M km² Indian EEZ', deliverable: 'Automated ingestion of Sentinel-1 C-SAR IW granules over SLOCs and chokepoints.' },
      { need: 'Detect AIS-dark vessels evading conventional tracking', deliverable: 'SAR vessel candidate radar cross-section detection vs AIS broadcast gap correlation.' },
      { need: 'Flag suspicious navigational behaviors', deliverable: 'Ship-to-Ship (STS) transfer detection, anomalous loitering, and sudden route deviations.' },
      { need: 'National maritime security synergy', deliverable: 'Direct integration with existing NTRO and Coast Guard maritime surveillance feeds.' }
    ],
    metric: 'Detect AIS-dark vessels near slicks; flag kinematic anomalies within 15 minutes',
    note: 'Why NTRO is the sponsoring org: Oil spill attribution serves as an operational testbed for broader Maritime Domain Awareness (MDA) and dark fleet interdiction.'
  },
  {
    id: 'c4',
    cornerNum: 'CORNER 04',
    shortNum: 'C-04',
    title: 'Operational Response',
    shortTitle: 'Coast Guard (ICG)',
    badge: 'Indian Coast Guard (ICG)',
    agency: 'Indian Coast Guard Tactical Command',
    icon: LifeBuoy,
    image: '/imagery/drift_hindcast.jpg',
    imageCaption: 'Lagrangian Hydrodynamic 48h Drift Simulation: ECMWF ocean surface current vectors computing intercept coordinates for ICG ships.',
    sensorTag: 'ECMWF & INCOIS OOSA Ocean Currents',
    accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    ringColor: 'border-amber-500 bg-amber-500/10 text-amber-700',
    dotBorder: 'border-amber-400 group-hover:border-amber-300',
    glowColor: 'rgba(217, 119, 6, 0.6)',
    tagline: 'Giving maritime interceptors the tactical coordinates needed to interdict polluting vessels before they exit jurisdiction.',
    objectives: [
      { need: 'Deploy pollution response assets to the exact coordinates', deliverable: 'Real-time slick centroid, orientation angle, and drift vector field.' },
      { need: 'Intercept the suspect vessel underway', deliverable: 'Ranked suspect MMSI, current AIS course, speed over ground, and ETA to EEZ boundary.' },
      { need: 'Protect vulnerable coastal infrastructure & ports', deliverable: 'Shoreline impact timeline with 48h to 96h forward dispersion cones.' },
      { need: 'Coordinate multi-agency command response', deliverable: 'Unified Common Operating Picture (COP) with exportable PDF briefing packages.' }
    ],
    metric: 'Actionable tactical alert within 2 hours; forecast usable for 48–96 h planning',
    note: 'Integration Point: Feeds validated initial conditions (location, time, extent, age) directly into INCOIS OOSA hydrodynamic models.'
  },
  {
    id: 'c5',
    cornerNum: 'CORNER 05',
    shortNum: 'C-05',
    title: 'Regulatory & Compliance',
    shortTitle: 'MARPOL Compliance',
    badge: 'DG Shipping & MoPSW',
    agency: 'DG Shipping / Port State Control Authorities',
    icon: FileCheck,
    image: '/imagery/unet_segmentation.jpg',
    imageCaption: 'Deep U-Net Pixel Mask: High-aspect ratio slick geometry (>10) and linear elongation proving underway bilge discharge under MARPOL Annex I.',
    sensorTag: 'Custom U-Net (Dice: 0.8828, IoU: 0.7926)',
    accentColor: 'text-teal-600 bg-teal-50 border-teal-200',
    ringColor: 'border-teal-500 bg-teal-500/10 text-teal-700',
    dotBorder: 'border-teal-400 group-hover:border-teal-300',
    glowColor: 'rgba(20, 184, 166, 0.6)',
    tagline: 'Empowering port state control authorities to enforce MARPOL Annex I regulations and notify international flag states.',
    objectives: [
      { need: 'Enforce MARPOL Annex I discharge prohibitions', deliverable: 'Geometric proof of underway bilge discharge (aspect ratio > 10, linearity > 0.85).' },
      { need: 'Target Port State Control (PSC) inspections', deliverable: 'Historical vessel compliance profiles and prior spill anomaly logs.' },
      { need: 'Issue formal flag state diplomatic notices', deliverable: 'Standardized dossier with IMO number, registered owner, flag state, and satellite evidence.' },
      { need: 'Design national maritime environmental policy', deliverable: 'Spill density heatmaps identifying chronic high-risk discharge corridors.' }
    ],
    metric: 'Attribution report fully compliant with IMO MEPC format for flag-state notification',
    note: 'Transforms unmonitored open-ocean dumping into auditable legal risk for vessel operators and P&I insurance clubs.'
  },
  {
    id: 'c6',
    cornerNum: 'CORNER 06',
    shortNum: 'C-06',
    title: 'Economic & Coastal Livelihoods',
    shortTitle: 'Fisheries & Coast',
    badge: 'Socio-Economic Defense',
    agency: 'Coastal Fishermen Co-operatives & State PCBs',
    icon: Fish,
    image: '/imagery/ocean_hero_bg.jpg',
    imageCaption: 'Coastal Ecosystem & Artisanal Fishing Overlay: Hazard zone projection calculating potential gear damage and nursery contamination.',
    sensorTag: 'Coastal Eco-Vulnerability Envelope',
    accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    ringColor: 'border-rose-500 bg-rose-500/10 text-rose-700',
    dotBorder: 'border-rose-400 group-hover:border-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    tagline: 'Safeguarding coastal fishing communities, tourist beaches, and enforcing the polluter-pays principle.',
    objectives: [
      { need: 'Compensate artisanal fishermen for tainted nets & lost catch', deliverable: 'Forensic evidence connecting specific vessel discharge to damaged fishing zones.' },
      { need: 'Reduce multimillion-dollar cleanup expenditures', deliverable: 'Early offshore interception before emulsification multiplies cleanup volume 3-5x.' },
      { need: 'Protect coastal tourism and harbor operations', deliverable: 'Forward beaching forecasts allowing timely deployment of containment booms.' },
      { need: 'Enforce Polluter-Pays Principle (IOPC Funds)', deliverable: 'Complete forensic audit trail supporting international civil liability claims.' }
    ],
    metric: 'Compensation claims backed by tamper-proof satellite and trajectory evidence',
    note: 'Gives vulnerable coastal communities the scientific leverage needed to seek fair restitution against multinational shipping lines.'
  },
  {
    id: 'c11',
    cornerNum: 'CORNER 11',
    shortNum: 'C-11',
    title: 'Stakeholder Trust & Transparency',
    shortTitle: 'Explainable AI',
    badge: 'Explainable AI & Governance',
    agency: 'Judges, Civil Society, Regulators & Media',
    icon: Shield,
    image: '/imagery/unet_segmentation.jpg',
    imageCaption: 'Transparent MCDA Matrix & Fay Bounds: Deconstructed 4-pillar attribution ranking and honest uncertainty intervals for courtroom admissibility.',
    sensorTag: 'Explainable MCDA & Fay Bounds (1.65h)',
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    ringColor: 'border-blue-500 bg-blue-500/10 text-blue-700',
    dotBorder: 'border-blue-400 group-hover:border-blue-300',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    tagline: 'Ensuring every attribution decision can be understood, audited, and defended in court without reading code.',
    objectives: [
      { need: 'Explain why vessel A is ranked above vessel B', deliverable: 'Deconstructed 4-pillar MCDA score breakdown (Proximity, Loitering, Risk, Kinematics).' },
      { need: 'Public transparency for citizen awareness & media', deliverable: 'Open-access dashboard exposing chronic offshore pollution to the public.' },
      { need: 'Honest communication of scientific limits', deliverable: 'Explicit "Low Confidence" flag when wind or hydrodynamic data is degraded.' },
      { need: 'Eliminate false precision in maritime reports', deliverable: 'Spill age expressed as physical Fay bounds (e.g. 0.30–3.00h), not unrealistic single numbers.' }
    ],
    metric: 'An operator or magistrate can understand and defend the ranking without reading a line of code',
    note: 'System Credibility Rule: If wind data is unavailable, Ocean 360 explicitly downgrades confidence rather than fabricating high certainty.'
  }
];

const STAKEHOLDERS_14 = [
  {
    code: 'ICG',
    name: 'Indian Coast Guard',
    role: 'Operational Maritime Interception',
    category: 'defense',
    question: 'Where to send ships & patrol aircraft right now?',
    output: 'Current slick coordinates, 48h forecast envelope & suspect vessel intercept vector',
    badge: 'Tactical Command',
    badgeClass: 'bg-amber-100 text-amber-800',
    image: '/imagery/drift_hindcast.jpg'
  },
  {
    code: 'NTRO',
    name: 'National Technical Research Org.',
    role: 'Strategic Intelligence & EEZ Defense',
    category: 'defense',
    question: 'Are there dark vessels or spoofed AIS tracks near the spill?',
    output: 'AIS broadcast gap detection, S-AIS/VIIRS fusion & anomalous loitering flags',
    badge: 'National Security',
    badgeClass: 'bg-indigo-100 text-indigo-800',
    image: '/imagery/sar_sentinel1.jpg'
  },
  {
    code: 'INCOIS',
    name: 'Indian National Centre for Ocean Info.',
    role: 'Operational Oceanography & Forecasting',
    category: 'science',
    question: 'What is the validated initial condition for trajectory runs?',
    output: 'Calibrated slick centroid, contour extent, Fay age bounds, and surface wind vectors',
    badge: 'Ocean Modeling',
    badgeClass: 'bg-sky-100 text-sky-800',
    image: '/imagery/drift_hindcast.jpg'
  },
  {
    code: 'DG Shipping',
    name: 'Directorate General of Shipping / MoPSW',
    role: 'Maritime Regulatory Authority',
    category: 'maritime',
    question: 'Does this vessel have a history of MARPOL Annex I violations?',
    output: 'Comprehensive attribution dossier with vessel registry, flag state, and kinematic anomaly profile',
    badge: 'Port State Control',
    badgeClass: 'bg-teal-100 text-teal-800',
    image: '/imagery/unet_segmentation.jpg'
  },
  {
    code: 'State PCBs',
    name: 'State Pollution Control Boards',
    role: 'Coastal Environmental Monitoring',
    category: 'science',
    question: 'Which coastal beaches and mangrove forests will be impacted?',
    output: 'Shoreline arrival timeline, beaching probability map & eco-vulnerability overlay',
    badge: 'Coastal Impact',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    image: '/imagery/ocean_hero_bg.jpg'
  },
  {
    code: 'Fishermen',
    name: 'Coastal Fishing Communities',
    role: 'Livelihood & Resource Protection',
    category: 'civil',
    question: 'Which fishing grounds are safe, and who will compensate our ruined gear?',
    output: 'Early mobile/SMS hazard broadcast & tamper-proof evidence dossier for compensation claims',
    badge: 'Livelihoods',
    badgeClass: 'bg-rose-100 text-rose-800',
    image: '/imagery/ocean_hero_bg.jpg'
  },
  {
    code: 'Major Ports',
    name: 'Port & Harbor Authorities',
    role: 'Navigational Safety & Anchorage',
    category: 'maritime',
    question: 'What is the operational risk to port approach channels and berths?',
    output: 'Approach lane spill hotspot density maps & anchorage loitering risk index',
    badge: 'Harbor Operations',
    badgeClass: 'bg-slate-100 text-slate-800',
    image: '/imagery/ais_tracking.jpg'
  },
  {
    code: 'Oil Operators',
    name: 'Offshore Oil & Gas Operators',
    role: 'Infrastructure Compliance & Safety',
    category: 'maritime',
    question: 'Is this slick from our offshore platform or an underway passing tanker?',
    output: 'Rig buffer proximity mask, flare detection overlay & kinematic drift directionality analysis',
    badge: 'Asset Protection',
    badgeClass: 'bg-orange-100 text-orange-800',
    image: '/imagery/sar_sentinel1.jpg'
  },
  {
    code: 'Courts',
    name: 'Maritime Admiralty Courts & Tribunals',
    role: 'Legal Prosecution & Adjudication',
    category: 'civil',
    question: 'Is the evidence chain mathematically transparent and admissible?',
    output: 'Deconstructed AHP weighted ranking audit, temporal consistency proof & uncertainty intervals',
    badge: 'Legal Prosecution',
    badgeClass: 'bg-blue-100 text-blue-800',
    image: '/imagery/unet_segmentation.jpg'
  },
  {
    code: 'Researchers',
    name: 'Academic & Marine Science Community',
    role: 'Open-Access Remote Sensing Research',
    category: 'science',
    question: 'Can we access benchmark datasets to validate new ML models?',
    output: 'Open REST API, georeferenced GeoTIFF masks, and labeled Sentinel-1 SAR training sets',
    badge: 'Open Science',
    badgeClass: 'bg-purple-100 text-purple-800',
    image: '/imagery/sar_sentinel1.jpg'
  }
];

export default function Homepage({
  onOpenUpload,
  onOpenDemo,
  onOpenDashboard,
  onOpenPipeline,
  onOpenAccuracy,
  onSelectDemoCase
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePillarId, setActivePillarId] = useState('c1');
  const [hoveredPillarId, setHoveredPillarId] = useState(null);
  const [isAutoOrbit, setIsAutoOrbit] = useState(true);
  const [viewMode, setViewMode] = useState('pillars');
  const [stakeholderCategory, setStakeholderCategory] = useState('all');

  // Auto-orbit through 360° ecosystem dots
  useEffect(() => {
    if (!isAutoOrbit || viewMode !== 'pillars') return;
    const timer = setInterval(() => {
      setActivePillarId((prev) => {
        const idx = CORNERS_360.findIndex((c) => c.id === prev);
        const nextIdx = (idx + 1) % CORNERS_360.length;
        return CORNERS_360[nextIdx].id;
      });
    }, 4800);
    return () => clearInterval(timer);
  }, [isAutoOrbit, viewMode]);

  const stages = [
    {
      id: '01',
      stageNum: 'STEP 01',
      category: 'Satellite Scan',
      title: 'Taking Radar Pictures from Space',
      date: 'Step 1 of 7 · Satellite Capture',
      desc: 'Satellites orbit Earth capturing high-resolution radar snapshots of the ocean. Unlike regular cameras, radar sees clearly through thick clouds, fog, and nighttime darkness to monitor waters 24/7.',
      image: '/imagery/sar_sentinel1.jpg',
      badge: 'Satellite Radar'
    },
    {
      id: '02',
      stageNum: 'STEP 02',
      category: 'Image Cleanup',
      title: 'Filtering Out Noise & Separating Land from Sea',
      date: 'Step 2 of 7 · Preprocessing',
      desc: 'The system cleans up background image static and cuts out islands and coastlines. This ensures the analysis focuses solely on open water and never mistakes dry land for an oil spill.',
      image: '/imagery/drift_hindcast.jpg',
      badge: 'Coastline Masking'
    },
    {
      id: '03',
      stageNum: 'STEP 03',
      category: 'Spill Detection',
      title: 'Spotting Dark Oil Patches on the Ocean Surface',
      date: 'Step 3 of 7 · Oil Detection',
      desc: 'Oil forms a thin, greasy film that flattens small ocean waves. On radar, these calm waters reflect less signal and appear as distinct dark patches. The system spots them automatically and measures their size.',
      image: '/imagery/ais_tracking.jpg',
      badge: 'Slick Spotting'
    },
    {
      id: '04',
      stageNum: 'STEP 04',
      category: 'Shape Analysis',
      title: 'Examining Slick Length, Width, and Trail Patterns',
      date: 'Step 4 of 7 · Pattern Check',
      desc: 'Moving ships leave behind long, slender lines of oil as they travel. We analyze the shape, length, and borders of each dark patch to see whether it matches the telltale trail of a vessel.',
      image: '/imagery/sar_sentinel1.jpg',
      badge: 'Pattern Matching'
    },
    {
      id: '05',
      stageNum: 'STEP 05',
      category: 'Smart AI Check',
      title: 'Using AI to Distinguish Real Oil from False Alarms',
      date: 'Step 5 of 7 · AI Verification',
      desc: 'Natural ocean phenomena like calm wind pockets or floating algae can mimic oil slicks. Our trained AI compares each patch against thousands of known cases to confirm genuine spills with high accuracy.',
      image: '/imagery/drift_hindcast.jpg',
      badge: 'AI Classifier'
    },
    {
      id: '06',
      stageNum: 'STEP 06',
      category: 'Drift Tracking',
      title: 'Rewinding Ocean Currents to Find the Spill Starting Point',
      date: 'Step 6 of 7 · Drift Tracking',
      desc: 'Because ocean currents and winds constantly push oil across the sea, where we spot the slick is rarely where it was dumped. We virtually rewind the currents to pinpoint the exact time and place the spill began.',
      image: '/imagery/ais_tracking.jpg',
      badge: 'Ocean Currents'
    },
    {
      id: '07',
      stageNum: 'STEP 07',
      category: 'Finding the Source',
      title: 'Matching the Spill to Ships That Crossed the Area',
      date: 'Step 7 of 7 · Ship Identification',
      desc: 'We cross-reference ship GPS records (AIS) with the spill’s exact starting point and time. Ships that passed right through the area when the oil was dumped are identified and ranked for investigation.',
      image: '/imagery/sar_sentinel1.jpg',
      badge: 'Vessel Identification'
    }
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stages.length) % stages.length);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans selection:bg-[#E0F2FE] selection:text-[#0369A1] flex flex-col">
      {/* 1. SKYTRUTH HERO SECTION (WITH LOW OPACITY SATELLITE BACKGROUND) */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#F0F9FF] via-white to-slate-50 border-b border-slate-200">
        {/* Serene ocean water backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/imagery/ocean_hero_bg.jpg"
            alt="Deep blue ocean water background"
            className="w-full h-full object-cover opacity-25 contrast-105 saturate-125 scale-105"
          />
          {/* Gentle sunlit ocean gradient wash for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-white/80" />
        </div>

        {/* Hero Content Container - Vertically Centered */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 my-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Prominent, High-Contrast Ocean 360 Branding */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0369A1] text-xs font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
                <span>AI & Satellite Oil Spill Forensics</span>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none font-sans drop-shadow-xs">
                <span className="text-[#0F172A]">Ocean</span>{' '}
                <span className="text-[#0284C7]">360</span>
              </h1>

              <p className="text-lg md:text-xl text-[#334155] leading-relaxed font-sans font-normal max-w-xl">
                The first free, publicly available tool that uses AI and satellite imagery to expose chronic ocean oil pollution and identify potential vessel sources.
              </p>
            </div>

            {/* Right Column: High-Visibility Action Card */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Actions
                </span>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={onOpenDashboard}
                    id="btn-hero-launch-cerulean"
                    className="w-full px-6 py-3.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-base font-bold font-sans tracking-wide flex items-center justify-between transition-all cursor-pointer shadow-md hover:shadow-lg group"
                  >
                    <span>Launch <span className="text-white">Ocean</span> <span className="text-sky-200">360</span></span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={onOpenUpload}
                      id="btn-hero-upload-image"
                      className="px-4 py-3 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-[#0F172A] text-sm font-bold font-sans tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-4 h-4 text-[#0284C7]" />
                      <span>Upload Observation</span>
                    </button>

                    <button
                      onClick={onOpenDemo}
                      id="btn-hero-explore-demo"
                      className="px-4 py-3 rounded-2xl bg-[#D97706] hover:bg-[#C2410C] text-white text-sm font-bold font-sans tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Explore Demo</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100">Sentinel-1 C-SAR</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">ECMWF Wind Drift</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">AIS Forensics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const el = document.getElementById('analysis-services-360');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[#0284C7] hover:text-[#0369A1] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>360° Ecosystem Radar →</span>
                    </button>
                    <button
                      onClick={onOpenPipeline}
                      className="text-slate-600 hover:text-[#0284C7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pipeline Theory →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Guides User Down to 'Why' */}
        <div className="relative z-10 pb-6 flex items-center justify-center">
          <button
            onClick={() => {
              const el = document.getElementById('why-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 text-xs font-mono font-medium text-slate-500 hover:text-[#0284C7] transition-colors cursor-pointer group"
          >
            <span className="text-[11px] tracking-wider uppercase text-slate-400 group-hover:text-[#0284C7]">Explore Why</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] animate-bounce" />
          </button>
        </div>
      </section>

      {/* 2. "WHY OCEAN 360" SECTION (MOVED DOWN BELOW THE FOLD) */}
      <section id="why-section" className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Big "Why" Title with SkyTruth Orange Dot Matrix Graphic */}
          <div className="lg:col-span-4 space-y-6 relative">
            <h2 className="text-7xl md:text-8xl font-serif text-[#0369A1] tracking-tight font-serif">
              Why
            </h2>

            {/* SkyTruth Signature Orange/Amber Dot Grid Pattern */}
            <div className="grid grid-cols-6 gap-3.5 w-48 opacity-90 pt-4">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full ${
                    i % 3 === 0
                      ? 'bg-[#D97706]'
                      : i % 2 === 0
                      ? 'bg-[#F59E0B]'
                      : 'border-2 border-[#D97706] bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Explanatory Copy & Link */}
          <div className="lg:col-span-8 space-y-6 text-base md:text-lg text-[#334155] leading-relaxed font-sans">
            <p>
              Oil pollution at sea is too often unseen and unaddressed. <strong>Ocean 360</strong> changes that. Ocean 360 is a free, open-source platform that automatically detects oil slicks from vessels and offshore oil platforms across the ocean using satellite imagery and AI to expose polluters around the world.
            </p>
            <p>
              Because offshore industrial activity isn't monitored as closely as land-based operations, fossil fuel development and routine pollution are widespread at a critical time for ocean health and climate action. Ocean 360 brings this hidden pollution to light, giving communities, journalists, and policymakers the evidence they need to hold polluters accountable and protect the ocean.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenDashboard}
                className="text-[#0284C7] hover:text-[#0369A1] font-bold text-base flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
              >
                <span>Read more about why we created Ocean 360</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SATELLITE OCEAN IMAGE SHOWCASE (CLEAN CONTAINER ALIGNMENT) */}
      <section className="px-6 md:px-12 py-10 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-[#0F172A] border border-slate-200 shadow-xl group">
          <div className="relative w-full h-[380px] sm:h-[420px] md:h-[480px] overflow-hidden">
            <img
              src="/imagery/sar_sentinel1.jpg"
              alt="Sentinel-1 Satellite Radar Ocean Oil Slick Observation"
              className="w-full h-full object-cover object-center scale-105 opacity-90 contrast-125 transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark gradient overlay for text legibility and clean framing */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/40 to-[#0F172A]/30 flex flex-col justify-between p-6 sm:p-8 md:p-12 pointer-events-none">
              {/* Top Meta Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sentinel-1 SAR C-Band Radar Capture</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-300 text-xs font-mono">
                  <span>Arabian Sea Monitoring Zone · 18.9182°N, 72.7845°E</span>
                </div>
              </div>

              {/* Bottom Content & Call to Action */}
              <div className="space-y-3 pointer-events-auto max-w-2xl">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                  Real-Time Satellite Radar Surveillance
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  Synthetic Aperture Radar (SAR) cuts through thick clouds and darkness to detect ocean surface wave dampening, exposing illegal offshore oil discharges and vessel slicks in real time.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onOpenDashboard}
                    className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold font-sans tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <span>Inspect Slick in Live Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-300 bg-black/50 backdrop-blur-xs px-3.5 py-2 rounded-full border border-white/10">
                    Resolution: 10m · Swath: IW · Pol: VV
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW OCEAN 360 WORKS - 7-STEP DETECTION PIPELINE SLIDER */}
      <section id="pipeline-carousel" className="py-16 bg-[#F8FAFC] border-t border-slate-200 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-serif text-[#0F172A] tracking-tight">
                How Ocean 360 Works
              </h2>
              <p className="text-sm md:text-base text-[#475569]">
                Explore our simple 7-step process from satellite radar capture to finding responsible ships.{' '}
                <button onClick={onOpenPipeline} className="text-[#0284C7] underline font-bold cursor-pointer hover:text-[#0369A1]">
                  Read full scientific pipeline theory & study notes →
                </button>
              </p>
            </div>

            {/* Slider Arrow Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevSlide}
                id="btn-slide-prev"
                className="w-12 h-12 rounded-full border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Previous Step"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextSlide}
                id="btn-slide-next"
                className="w-12 h-12 rounded-full border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Next Step"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Step Card Stack Carousel */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[380px]">
              {/* Left Column (5 cols): Satellite Map Preview */}
              <div className="md:col-span-5 bg-[#0F172A] p-6 flex flex-col justify-between relative overflow-hidden">
                <img
                  src={stages[currentSlide].image}
                  alt={stages[currentSlide].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 contrast-125"
                />
                <div className="relative z-10 space-y-2">
                  <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-mono font-bold tracking-wider uppercase">
                    {stages[currentSlide].badge}
                  </span>
                  <div className="text-xs font-mono text-slate-300 pt-2">
                    {stages[currentSlide].stageNum} OF 07
                  </div>
                </div>

                <div className="relative z-10 pt-8 text-white font-mono text-xs">
                  Coordinates: 18.9182°N, 72.7845°E · Arabian Sea
                </div>
              </div>

              {/* Right Column (7 cols): Card Content */}
              <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>{stages[currentSlide].date}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0F172A] text-white font-bold">
                      {stages[currentSlide].category}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight font-sans">
                    {stages[currentSlide].title}
                  </h3>

                  <p className="text-sm md:text-base text-[#475569] leading-relaxed font-sans">
                    {stages[currentSlide].desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {stages.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-8 bg-[#0284C7]' : 'w-2 bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={onOpenPipeline}
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-sans tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Read Stage Theory & Math</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4.5 REQUIRED ANALYSIS & SERVICES: THE 360° CONNECTED ECOSYSTEM */}
      {/* ============================================================ */}
      {(() => {
        const activePillar = CORNERS_360.find(c => c.id === activePillarId) || CORNERS_360[0];
        const ActiveIcon = activePillar.icon;
        const filteredStakeholders = STAKEHOLDERS_14.filter(
          s => stakeholderCategory === 'all' || s.category === stakeholderCategory
        );

        return (
          <section id="analysis-services-360" className="py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F0F9FF] border-t border-slate-200 px-4 sm:px-8 lg:px-12 w-full">
            <div className="max-w-[1550px] mx-auto space-y-12">
              {/* Header & Mode Switcher */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200/80">
                <div className="space-y-3 max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/20 text-[#0284C7] text-xs font-mono font-bold uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 animate-spin" />
                    <span>Required Analysis & Services · 360° Connected Architecture</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0F172A] tracking-tight">
                    The 360° Stakeholder Ecosystem
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl">
                    Oil spill forensic attribution operates as an interconnected national continuum—linking <strong>environmental defense</strong>, <strong>national maritime intelligence (NTRO)</strong>, <strong>Coast Guard tactical interception</strong>, <strong>regulatory compliance (DG Shipping)</strong>, and <strong>coastal fishing livelihoods</strong> into a single unified loop.
                  </p>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-auto shrink-0 shadow-2xs">
                  <button
                    onClick={() => setViewMode('pillars')}
                    className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      viewMode === 'pillars'
                        ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-[#0284C7]" />
                    <span>360° Strategic Radar (7 Pillars)</span>
                  </button>
                  <button
                    onClick={() => setViewMode('matrix')}
                    className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      viewMode === 'matrix'
                        ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    <Users className="w-4 h-4 text-[#D97706]" />
                    <span>Agency Service Directory (10 Stakeholders)</span>
                  </button>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SUB-VIEW A: 360° STRATEGIC CORNERS (GRAND RADAR & BROAD THEORY) */}
              {/* ============================================================ */}
              {viewMode === 'pillars' && (
                <div className="space-y-12 animate-fade-in">

                  {/* ======================================================= */}
                  {/* 1. THE GRAND 360° CIRCULAR RADAR CONSTELLATION (HERO)   */}
                  {/* ======================================================= */}
                  <div className="bg-[#0B132B] border-2 border-sky-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between space-y-8">
                    {/* Ambient background glows */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Radar Top Control Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                        <div>
                          <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                            <span>360° Orbital Radar Constellation</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                              LIVE INTERACTIVE
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-sans hidden sm:inline">
                            Connecting all 7 forensic strategic pillars into an unbroken loop
                          </span>
                        </div>
                      </div>

                      {/* Controls & Active Callout */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                          <span className="text-slate-400">Active Focus:</span>
                          <span className="font-bold text-sky-300">{activePillar.cornerNum} · {activePillar.shortTitle}</span>
                        </div>

                        <button
                          onClick={() => setIsAutoOrbit(!isAutoOrbit)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                            isAutoOrbit
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20'
                          }`}
                          title={isAutoOrbit ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
                        >
                          {isAutoOrbit ? (
                            <>
                              <Pause className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Auto-Orbit Active (4.8s)</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-slate-300" />
                              <span>Orbit Paused (Click to Scan)</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            const idx = CORNERS_360.findIndex(c => c.id === activePillarId);
                            const nextIdx = (idx + 1) % CORNERS_360.length;
                            setActivePillarId(CORNERS_360[nextIdx].id);
                          }}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
                          title="Rotate to Next Pillar"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Broad Circular Constellation Interactive Viewport */}
                    <div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] aspect-square mx-auto relative my-4 select-none flex items-center justify-center">
                      
                      {/* SVG Layer: Concentric Range Rings, Degree Axes, Perimeter Web & Spoke Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 540 540">
                        <defs>
                          <radialGradient id="broadHubGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
                            <stop offset="65%" stopColor="#0284C7" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
                          </radialGradient>
                          <filter id="broadGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Radar Range Rings */}
                        <circle cx="270" cy="270" r="82" fill="url(#broadHubGlow)" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                        <circle cx="270" cy="270" r="135" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                        <circle cx="270" cy="270" r="195" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
                        <circle cx="270" cy="270" r="255" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 4" opacity="0.15" />

                        {/* Crosshairs with Degree Markings */}
                        <line x1="270" y1="15" x2="270" y2="525" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 4" opacity="0.25" />
                        <line x1="15" y1="270" x2="525" y2="270" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 4" opacity="0.25" />
                        <text x="274" y="24" fill="#38BDF8" fontSize="10" fontFamily="monospace" opacity="0.7">000° N</text>
                        <text x="495" y="266" fill="#38BDF8" fontSize="10" fontFamily="monospace" opacity="0.7">090° E</text>
                        <text x="274" y="520" fill="#38BDF8" fontSize="10" fontFamily="monospace" opacity="0.7">180° S</text>
                        <text x="20" y="266" fill="#38BDF8" fontSize="10" fontFamily="monospace" opacity="0.7">270° W</text>

                        {/* Outer Perimeter Connecting Lines: Closed Loop Web connecting dot i to dot i+1 */}
                        {CORNERS_360.map((_, i) => {
                          const nextI = (i + 1) % CORNERS_360.length;
                          const a1 = (-90 + (i * 360) / 7) * (Math.PI / 180);
                          const a2 = (-90 + (nextI * 360) / 7) * (Math.PI / 180);
                          const x1 = 270 + 195 * Math.cos(a1);
                          const y1 = 270 + 195 * Math.sin(a1);
                          const x2 = 270 + 195 * Math.cos(a2);
                          const y2 = 270 + 195 * Math.sin(a2);
                          return (
                            <line
                              key={`web-link-${i}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#38BDF8"
                              strokeWidth="1.5"
                              strokeDasharray="5 5"
                              opacity="0.35"
                            />
                          );
                        })}

                        {/* Radiating Spoke Lines: From Center (270, 270) to each Orbiting Dot */}
                        {CORNERS_360.map((pillar, i) => {
                          const a = (-90 + (i * 360) / 7) * (Math.PI / 180);
                          const x = 270 + 195 * Math.cos(a);
                          const y = 270 + 195 * Math.sin(a);
                          const isActive = pillar.id === activePillarId;
                          const isHovered = pillar.id === hoveredPillarId;

                          return (
                            <g key={`spoke-group-${pillar.id}`}>
                              <line
                                x1="270"
                                y1="270"
                                x2={x}
                                y2={y}
                                stroke={isActive ? '#38BDF8' : isHovered ? '#7DD3FC' : '#64748B'}
                                strokeWidth={isActive ? '3.5' : isHovered ? '2.5' : '1.2'}
                                strokeDasharray={isActive ? '7 4' : '3 3'}
                                className={isActive ? 'animate-dash-flow' : ''}
                                filter={isActive ? 'url(#broadGlow)' : undefined}
                                opacity={isActive ? '1' : isHovered ? '0.9' : '0.3'}
                              />
                              {isActive && (
                                <>
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="8"
                                    fill="#38BDF8"
                                    className="animate-ping opacity-60"
                                  />
                                  <circle
                                    cx={270 + 96 * Math.cos(a)}
                                    cy={270 + 96 * Math.sin(a)}
                                    r="3.5"
                                    fill="#38BDF8"
                                    className="animate-pulse"
                                  />
                                </>
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      {/* Broad Central Circle Hub (Live Satellite Imagery + Radar Sweep) */}
                      <div
                        onClick={() => {
                          const idx = CORNERS_360.findIndex(c => c.id === activePillarId);
                          const nextIdx = (idx + 1) % CORNERS_360.length;
                          setActivePillarId(CORNERS_360[nextIdx].id);
                        }}
                        className="w-32 h-32 sm:w-38 sm:h-38 md:w-42 md:h-42 rounded-full absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-10 overflow-hidden border-2 border-sky-400 shadow-2xl shadow-sky-500/50 group cursor-pointer"
                        title="Click to cycle next pillar"
                      >
                        {/* Live Active Forensic Image in Hub - Crystal Clear Satellite Lens */}
                        <img
                          src={activePillar.image}
                          alt={activePillar.title}
                          className="w-full h-full object-cover scale-105 contrast-125 brightness-105 transition-all duration-700 group-hover:scale-120"
                        />

                        {/* Radar Sweep Overlay Beam */}
                        <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none opacity-40 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(56,189,248,0.6)_360deg)]" />

                        {/* Center Hub Label Overlay - Subtle bottom pill badge to keep center satellite image 100% visible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 flex flex-col items-center justify-end pb-3 text-center pointer-events-none">
                          <div className="bg-[#0B132B]/90 backdrop-blur-md border border-sky-400/50 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 shadow-lg">
                            <ActiveIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span className="text-[10px] font-mono font-bold text-slate-100 tracking-wider">
                              360° {activePillar.shortNum}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 7 Orbiting Circular Image Nodes (The "Dots") */}
                      {CORNERS_360.map((pillar, i) => {
                        const angleDeg = -90 + (i * 360) / 7;
                        const rad = (angleDeg * Math.PI) / 180;
                        const leftPct = 50 + 36 * Math.cos(rad);
                        const topPct = 50 + 36 * Math.sin(rad);
                        const isSelected = pillar.id === activePillarId;
                        const isHovered = pillar.id === hoveredPillarId;
                        const NodeIcon = pillar.icon;

                        return (
                          <div
                            key={pillar.id}
                            style={{
                              left: `${leftPct}%`,
                              top: `${topPct}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                            className="absolute z-20"
                          >
                            <button
                              onClick={() => {
                                setActivePillarId(pillar.id);
                                setIsAutoOrbit(false);
                              }}
                              onMouseEnter={() => setHoveredPillarId(pillar.id)}
                              onMouseLeave={() => setHoveredPillarId(null)}
                              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 relative group cursor-pointer transition-all duration-300 flex items-center justify-center ${
                                isSelected
                                  ? 'scale-125 ring-4 ring-sky-400 ring-offset-3 ring-offset-[#0B132B] shadow-2xl shadow-sky-400/70 z-30'
                                  : isHovered
                                  ? 'scale-115 ring-2 ring-sky-300 shadow-xl z-30'
                                  : 'hover:scale-108 opacity-90 hover:opacity-100'
                              }`}
                              title={`${pillar.cornerNum}: ${pillar.title}`}
                            >
                              {/* Circular Image Node */}
                              <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white/70 group-hover:border-sky-300 bg-slate-900 shadow-inner">
                                <img
                                  src={pillar.image}
                                  alt={pillar.title}
                                  className={`w-full h-full object-cover transition-transform duration-500 ${
                                    isSelected ? 'scale-130 contrast-125' : 'scale-100 group-hover:scale-115'
                                  }`}
                                />
                                
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

                                {/* Mini Icon in Top */}
                                <div className="absolute top-1.5 inset-x-0 mx-auto w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-sky-300">
                                  <NodeIcon className="w-3 h-3" />
                                </div>

                                {/* Bottom Corner Code Pill */}
                                <div className="absolute bottom-1.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] font-mono font-black text-sky-300 leading-tight">
                                  {pillar.shortNum}
                                </div>
                              </div>

                              {/* Floating Tooltip Card on Hover */}
                              {isHovered && (
                                <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 z-40 bg-[#0F172A] border border-sky-400/70 text-white px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap shadow-2xl pointer-events-none">
                                  <strong className="text-sky-300">{pillar.shortNum}:</strong> {pillar.title}
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Broad Horizontal Navigation Ribbon (All 7 Pillars with Full Names & Agencies) */}
                    <div className="pt-6 border-t border-slate-800/80">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {CORNERS_360.map((pillar) => {
                          const isSelected = pillar.id === activePillarId;
                          const PillarIcon = pillar.icon;
                          return (
                            <button
                              key={pillar.id}
                              onClick={() => {
                                setActivePillarId(pillar.id);
                                setIsAutoOrbit(false);
                              }}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                                isSelected
                                  ? 'bg-sky-500/20 border-sky-400 text-white ring-2 ring-sky-400/40 shadow-lg scale-102'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-sky-300' : 'text-slate-400'}`}>
                                  {pillar.shortNum}
                                </span>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                  isSelected ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-300'
                                }`}>
                                  <PillarIcon className="w-3.5 h-3.5" />
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-bold font-serif leading-snug line-clamp-1 text-white">
                                  {pillar.title}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5 line-clamp-1">
                                  {pillar.shortTitle}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* 2. THE BROAD FORENSIC EVIDENCE & THEORY DOSSIER         */}
                  {/* ======================================================= */}
                  <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-9 relative overflow-hidden">
                    {/* Top Header & Target KPI */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-800">
                            {activePillar.cornerNum}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-sky-50 text-[#0284C7] font-mono text-xs font-semibold">
                            {activePillar.badge}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            · Primary Agency: <strong>{activePillar.agency}</strong>
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[#0F172A] tracking-tight">
                          {activePillar.title}
                        </h3>
                        <p className="text-sm md:text-base text-slate-600 font-sans leading-relaxed">
                          {activePillar.tagline}
                        </p>
                      </div>

                      {/* Success Metric Highlight Pill */}
                      <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-left shrink-0 lg:max-w-xs space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Operational Target KPI</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-950 leading-snug">
                          {activePillar.metric}
                        </p>
                      </div>
                    </div>

                    {/* Broad 2-Column Split: Satellite Image Theater (Left) vs Deep-Dive Theory & Deliverables (Right) */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
                      
                      {/* Left: Broad Satellite & Forensics Image Theater (6 cols) */}
                      <div className="xl:col-span-6 flex flex-col justify-between">
                        <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] border-2 border-slate-200 shadow-md group h-full min-h-[360px] sm:min-h-[420px] flex flex-col justify-between">
                          <img
                            src={activePillar.image}
                            alt={activePillar.title}
                            className="absolute inset-0 w-full h-full object-cover object-center contrast-125 transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Top Badges Overlay */}
                          <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{activePillar.sensorTag}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-slate-300 text-xs font-mono">
                              <span>18.9182°N, 72.7845°E · Arabian Sea Sector</span>
                            </div>
                          </div>

                          {/* Bottom Caption Overlay */}
                          <div className="relative z-10 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-1 max-w-xl">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                                Ingested Physical Evidence Artifact
                              </span>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                                {activePillar.imageCaption}
                              </p>
                            </div>

                            <button
                              onClick={onOpenDashboard}
                              className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-sans flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md"
                            >
                              <span>Inspect Live Map</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Broad Theory, Deliverables & Legal Context (6 cols) */}
                      <div className="xl:col-span-6 flex flex-col justify-between space-y-6">
                        
                        {/* 4 Operational Requirements vs Deliverables */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#0284C7]" />
                            <span>System Objectives & Required Engineering Deliverables</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activePillar.objectives.map((obj, i) => (
                              <div
                                key={i}
                                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-2 hover:bg-slate-100 transition-colors shadow-2xs"
                              >
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                                    Requirement #{i + 1}
                                  </span>
                                  <div className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug">
                                    {obj.need}
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-slate-200/70 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                                    <strong className="text-slate-800">Ocean 360 Delivery:</strong> {obj.deliverable}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Broad Operational & Legal Grounding Bar */}
                        <div className="p-5 rounded-2xl bg-[#0F172A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
                          <div className="flex items-start gap-3.5">
                            <Scale className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                                Operational & Court Admissibility Protocol
                              </span>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                                {activePillar.note}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              onClick={onOpenPipeline}
                              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors cursor-pointer"
                            >
                              Stage Theory
                            </button>
                            <button
                              onClick={onOpenDashboard}
                              className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Open in Dashboard</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SUB-VIEW B: MULTI-STAKEHOLDER MATRIX (10 AGENCIES) */}
              {/* ============================================================ */}
              {viewMode === 'matrix' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'all', label: 'All Stakeholders (10)' },
                      { id: 'defense', label: 'Defense & Maritime Security (ICG, NTRO)' },
                      { id: 'science', label: 'Ocean Science & Environment (INCOIS, PCB, Researchers)' },
                      { id: 'maritime', label: 'Maritime Regulators & Ports (DG Shipping, Ports, Oil Ops)' },
                      { id: 'civil', label: 'Civil Society & Legal (Courts, Fishermen)' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setStakeholderCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          stakeholderCategory === cat.id
                            ? 'bg-[#0284C7] text-white shadow-2xs font-bold'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Stakeholders Cards Grid - Broad Responsive Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {filteredStakeholders.map((stk, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col justify-between space-y-4 group overflow-hidden"
                      >
                        <div className="space-y-3">
                          {/* Forensic Imagery Card Header */}
                          <div className="relative h-28 -mx-5 -mt-5 mb-2 overflow-hidden border-b border-slate-100 bg-[#0F172A]">
                            <img
                              src={stk.image}
                              alt={stk.name}
                              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 contrast-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />
                            <div className="absolute inset-0 p-3.5 flex items-end justify-between pointer-events-none">
                              <span className="text-lg font-black font-serif text-white tracking-wide drop-shadow-md">
                                {stk.code}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shadow-xs ${stk.badgeClass}`}>
                                {stk.badge}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-800 font-sans">
                              {stk.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {stk.role}
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 space-y-1">
                            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider block">
                              What They Need (Operational Question)
                            </span>
                            <p className="text-xs text-amber-950 font-medium italic leading-normal">
                              "{stk.question}"
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 space-y-1">
                            <span className="text-[10px] font-mono font-bold text-[#0284C7] uppercase tracking-wider block">
                              Ocean 360 System Output
                            </span>
                            <p className="text-xs text-slate-700 leading-normal font-sans">
                              {stk.output}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400">
                            Forensic Deliverable
                          </span>
                          <button
                            onClick={onOpenDashboard}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] group-hover:underline cursor-pointer"
                          >
                            <span>Inspect Output</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* 5. EMPIRICAL MODEL ACCURACY & INDUSTRY BENCHMARKS SHOWCASE */}
      <section className="py-20 bg-white border-t border-slate-200 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>TRAINED MODEL BENCHMARKS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F172A] tracking-tight">
                Empirically Proven Accuracy
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Trained on real Sentinel-1 SAR scenes ingested via Alaska Satellite Facility (ASF DAAC). Our multi-stage pipeline beats industry benchmarks across classification, pixel segmentation, and temporal age bounds.
              </p>
            </div>

            <button
              onClick={onOpenAccuracy}
              className="px-6 py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <span>View Full Accuracy Report & Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 hover:border-emerald-300 transition-colors">
              <div className="text-xs font-mono text-slate-500 uppercase font-bold">Classification Accuracy</div>
              <div className="text-4xl font-black font-serif text-[#0F172A]">95.85%</div>
              <p className="text-xs text-slate-600 leading-normal">
                EfficientNet-B0 screening (554 test patches). <strong>+6.45% F1 gain</strong> over standard ResNet-50.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 hover:border-sky-300 transition-colors">
              <div className="text-xs font-mono text-slate-500 uppercase font-bold">Segmentation Dice</div>
              <div className="text-4xl font-black font-serif text-[#0284C7]">0.8828</div>
              <p className="text-xs text-slate-600 leading-normal">
                Custom U-Net (IoU: 0.7926). <strong>+10.86% IoU gain</strong> over standard pure-BCE U-Net.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 hover:border-amber-300 transition-colors">
              <div className="text-xs font-mono text-slate-500 uppercase font-bold">Oil Spill Sensitivity</div>
              <div className="text-4xl font-black font-serif text-[#D97706]">95.65%</div>
              <p className="text-xs text-slate-600 leading-normal">
                176 of 184 genuine slicks detected. Only 8 missed spills across the entire test set.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 hover:border-purple-300 transition-colors">
              <div className="text-xs font-mono text-slate-500 uppercase font-bold">Fay Age Inversion</div>
              <div className="text-4xl font-black font-serif text-purple-700">1.65 h</div>
              <p className="text-xs text-slate-600 leading-normal">
                Median release window (3.00–0.30h band) eliminates 65% of false candidate vessels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OCEAN 360 FOOTER */}
      <footer className="mt-auto bg-[#0F172A] text-slate-300 py-10 px-6 md:px-12 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white font-black text-xs shadow-sm">
              <span className="text-white">O</span><span className="text-cyan-200">360</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight uppercase">OCEAN <span className="text-sky-400">360</span></span>
            <span className="text-slate-400 text-xs font-mono">· SIH26143 AI Satellite Platform</span>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right font-sans space-y-1">
            <p>Powered by Sentinel-1 C-SAR Ingestion & ECMWF Hydrodynamic Drift Simulations.</p>
            <p className="text-[11px] text-slate-500 font-mono">© 2026 Ocean 360 Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
