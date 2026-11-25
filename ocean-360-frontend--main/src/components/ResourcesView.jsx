import React, { useState, useMemo } from 'react';
import {
  BookOpen, ExternalLink, Search, Filter, Layers, Database,
  Ship, Cpu, Wind, ShieldCheck, CheckCircle2, ChevronRight,
  Sparkles, ArrowUpRight, Compass, Code2, FileText, Globe,
  ArrowRight, Download, Activity, BarChart2
} from 'lucide-react';

export default function ResourcesView({
  onOpenDashboard,
  onOpenPipeline,
  onOpenAccuracy,
  onOpenHome,
  onSelectDemoCase
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');

  const STAGES_FILTER = [
    { id: 'all', label: 'All Resources' },
    { id: 'research', label: 'Peer-Reviewed Research' },
    { id: 's1', label: '1. SAR Ingestion & Calibration' },
    { id: 's2', label: '2. Deep Learning (U-Net & CNN)' },
    { id: 's3', label: '3. False Alarm & Shape' },
    { id: 's4', label: '4. Ocean Drift (CMEMS/ERA5)' },
    { id: 's5', label: '5. AIS Dataset Engineering' },
    { id: 's6', label: '6. MCDA Attribution' },
    { id: 's7', label: '7. Tactical UI & Forensics' },
  ];

  const RESOURCES_DATA = [
    // Peer-Reviewed Research Foundations
    {
      id: 'res-paper-1',
      stage: 'research',
      stageName: 'Academic Research · DL Pipeline',
      name: 'Trujillo-Acatitla et al. (2024)',
      type: 'Peer-Reviewed Journal Article',
      provider: 'Marine Pollution Bulletin · Elsevier',
      link: 'https://doi.org/10.1016/j.marpolbul.2024.116549',
      tag: 'DOI: 10.1016/j.marpolbul.2024.116549',
      description: 'Marine oil spill detection and segmentation in SAR data with two steps Deep Learning framework. Proposes a dual-stage framework coupling patch classification with high-resolution semantic segmentation.',
      usage: 'Direct foundation for our EfficientNet-B0 screening + U-Net segmentation + Sentinel-1 SAR detection pipeline.'
    },
    {
      id: 'res-paper-2',
      stage: 'research',
      stageName: 'Academic Research · Look-Alike Rejection',
      name: 'Li et al. (2023)',
      type: 'Peer-Reviewed Journal Article',
      provider: 'Remote Sensing of Environment · Elsevier',
      link: 'https://doi.org/10.1016/J.RSE.2023.113872',
      tag: 'DOI: 10.1016/J.RSE.2023.113872',
      description: 'A self-evolving deep learning algorithm for automatic oil spill detection in Sentinel-1 SAR images. Focuses on low-wind areas, biogenic look-alikes, and adaptive threshold calibration.',
      usage: 'Supports our automated SAR detection logic and robust handling of complex oil-spill look-alikes across varying wind regimes.'
    },
    {
      id: 'res-paper-3',
      stage: 'research',
      stageName: 'Academic Research · CNN Benchmarking',
      name: 'Kalogirou et al. (2025)',
      type: 'ISPRS Archives · Peer-Reviewed Proceeding',
      provider: 'ISPRS Archives · Copernicus Publications',
      link: 'https://doi.org/10.5194/isprs-archives-XLVIII-G-2025-757-2025',
      tag: 'DOI: 10.5194/isprs-archives-XLVIII-G-2025-757-2025',
      description: 'Oil Spill Detection using Convolutional Neural Networks and Sentinel-1 SAR Imagery. Benchmarks deep CNN classifiers on Sentinel-1 C-SAR backscatter profiles.',
      usage: 'Recent research directly combining CNN classification architectures with Sentinel-1 SAR imagery, used as our comparative baseline.'
    },
    {
      id: 'res-paper-4',
      stage: 'research',
      stageName: 'Academic Research · Arabian Region & ViTs',
      name: 'Alkhalifa et al. (2025)',
      type: 'ISPRS Annals · Peer-Reviewed Proceeding',
      provider: 'ISPRS Annals · Copernicus Publications',
      link: 'https://doi.org/10.5194/isprs-annals-X-G-2025-57-2025',
      tag: 'DOI: 10.5194/isprs-annals-X-G-2025-57-2025',
      description: 'Leveraging SARs and Advanced Deep Learning Techniques for Oil Spill Detection in UAE. Explores high-temperature, calm-sea tropical waters and Vision Transformers.',
      usage: 'Directly relevant to our Arabian Sea and Persian Gulf surveillance zones; guides our false-alarm rejection in low-wind tropical maritime corridors.'
    },

    // Stage 1: SAR Preprocessing & Ingestion
    {
      id: 'res-s1-asf',
      stage: 's1',
      stageName: 'Stage 1 · SAR Data Ingestion',
      name: 'Alaska Satellite Facility (ASF DAAC) & Vertex Portal',
      type: 'Primary SAR Satellite Repository & API',
      provider: 'NASA Alaska Satellite Facility (ASF) / Univ. of Alaska Fairbanks',
      link: 'https://asf.alaska.edu/',
      tag: 'Wget Script & API Ingestion',
      description: 'NASA Distributed Active Archive Center (DAAC) archiving synthetic aperture radar data. Provides bulk automated retrieval of Sentinel-1 C-SAR IW GRD and SLC products via automated wget scripts and the Python asf_search API.',
      usage: 'Used to wget and batch-download the original raw Sentinel-1 SAR imagery archives for our training, cross-validation, and operational testing sets.'
    },
    {
      id: 'res-s1-1',
      stage: 's1',
      stageName: 'Stage 1 · SAR Calibration',
      name: 'Sentinel-1 Level-1 GRD SAR Imagery',
      type: 'Primary Satellite Data',
      provider: 'ESA Copernicus Open Access Hub / CDSE',
      link: 'https://dataspace.copernicus.eu/',
      tag: 'Copernicus CDSE',
      description: 'C-band (5.405 GHz) synthetic aperture radar data in Interferometric Wide (IW) swath mode with VV + VH polarizations, unaffected by marine cloud cover or darkness.',
      usage: 'Raw amplitude input calibrated to normalized radar cross section σ⁰ in decibels (dB), providing high-contrast dark patch detection on ocean capillary waves.'
    },
    {
      id: 'res-s1-2',
      stage: 's1',
      stageName: 'Stage 1 · SAR Calibration',
      name: 'ESA SNAP (Sentinel Application Platform) & GPT Toolbox',
      type: 'Geospatial Radar Pipeline',
      provider: 'European Space Agency (ESA)',
      link: 'https://step.esa.int/main/toolboxes/snap/',
      tag: 'Software / Engine',
      description: 'Open source desktop and command line graph processing tool (GPT) for precise Sentinel-1 orbit state vector application, radiometric calibration, and Range-Doppler terrain correction.',
      usage: 'Executes automated batch calibration from digital numbers (DN) to radar backscatter σ⁰ and speckle reduction.'
    },
    {
      id: 'res-s1-3',
      stage: 's1',
      stageName: 'Stage 1 · SAR Calibration',
      name: 'Enhanced Lee Speckle Filter (Lee 1980 / 1986)',
      type: 'Statistical Algorithm',
      provider: 'IEEE Geoscience & Remote Sensing Society',
      link: 'https://ieeexplore.ieee.org/document/4157400',
      tag: 'Speckle Suppression',
      description: 'Adaptive spatial speckle filtering algorithm based on local statistical variance within a 5x5 or 7x7 sliding kernel to reduce multiplicative coherent noise.',
      usage: 'Smooths sea clutter while strictly preserving dark slick edges and fine elongated trailing tail filaments.'
    },

    // Stage 2: Deep Learning & Semantic Segmentation
    {
      id: 'res-s2-1',
      stage: 's2',
      stageName: 'Stage 2 · AI Segmentation',
      name: 'U-Net: Convolutional Networks for Biomedical & Satellite Segmentation',
      type: 'Deep Learning Model',
      provider: 'Olaf Ronneberger et al. (MICCAI / Springer)',
      link: 'https://arxiv.org/abs/1505.04597',
      tag: 'Neural Architecture',
      description: 'Encoder-decoder CNN architecture with skip connections that pass high-resolution spatial feature maps across contraction and expansion paths.',
      usage: 'Generates pixel-wise probability masks for dark water patches, resolving both macro slick bodies and thin dispersing sheen tails.'
    },
    {
      id: 'res-s2-2',
      stage: 's2',
      stageName: 'Stage 2 · AI Segmentation',
      name: 'PyTorch Deep Learning Framework',
      type: 'ML Framework',
      provider: 'PyTorch Foundation / Linux Foundation',
      link: 'https://pytorch.org/',
      tag: 'Framework',
      description: 'Open-source scientific machine learning library with GPU tensor acceleration, autograd computation, and dynamic neural network graphs.',
      usage: 'Used to train and infer our lightweight 2D U-Net segmentation network with mixed BCE + Dice loss optimization.'
    },
    {
      id: 'res-s2-3',
      stage: 's2',
      stageName: 'Stage 2 · AI Segmentation',
      name: 'MBLab Marine Oil Spill Benchmark Dataset',
      type: 'Labeled Benchmark Dataset',
      provider: 'Kousheng et al. / Remote Sensing',
      link: 'https://github.com/Kousheng/OilSpillDetection',
      tag: 'Benchmark Dataset',
      description: 'Curated dataset of SAR imagery patches labeled with oil spills, look-alikes (low wind areas, algal blooms), and land masks.',
      usage: 'Supervised training corpus ensuring high generalization across varying sea surface wind regimes and incidence angles.'
    },

    // Stage 3: False Alarm Rejection & Geometry
    {
      id: 'res-s3-1',
      stage: 's3',
      stageName: 'Stage 3 · False Alarm Filter',
      name: 'GSHHG (Global Self-consistent, Hierarchical, High-resolution Shoreline)',
      type: 'Geographic Vector Dataset',
      provider: 'NOAA NCEI & University of Hawaii',
      link: 'https://www.ngdc.noaa.gov/mgg/shorelines/',
      tag: 'Cartographic Baseline',
      description: 'High-resolution global shoreline vector database combining World Vector Shoreline and CIA World DataBank II.',
      usage: 'Provides an exact 500m coastal buffer mask to filter out mudflats, sandbanks, shallow reef shadows, and harbor clutter.'
    },
    {
      id: 'res-s3-2',
      stage: 's3',
      stageName: 'Stage 3 · False Alarm Filter',
      name: 'Copernicus Sentinel-1 Ocean Wind Field Inversion (OWI)',
      type: 'Atmospheric Satellite Dataset',
      provider: 'ESA / Copernicus Marine',
      link: 'https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar/applications/ocean-wind',
      tag: 'Wind Speed Verification',
      description: 'Sea surface wind vector estimates derived directly from C-band backscatter using CMOD5.N geophysical model functions.',
      usage: 'Discards false alarms in low-wind calm sea zones (< 2.5 m/s) where water naturally appears dark without capillary waves.'
    },
    {
      id: 'res-s3-3',
      stage: 's3',
      stageName: 'Stage 3 · False Alarm Filter',
      name: 'OpenCV & Shapely Geospatial Morphology',
      type: 'Computer Vision & Geometry Engine',
      provider: 'OpenCV.org / Shapely PyPI',
      link: 'https://shapely.readthedocs.io/',
      tag: 'Morphology Library',
      description: 'High-performance polygon boundary extraction, Hu invariant moments, convexity defect detection, and oriented bounding boxes.',
      usage: 'Calculates slick physical descriptors: Area (km²), Perimeter (km), Aspect Ratio, Major Axis Orientation, and Thickness Gradient.'
    },

    // Stage 4: Ocean Drift Trajectory Inversion
    {
      id: 'res-s4-1',
      stage: 's4',
      stageName: 'Stage 4 · Ocean Drift Inversion',
      name: 'CMEMS Global Ocean Physics Reanalysis (GLORYS12V1)',
      type: 'Hydrodynamic Ocean Current Model',
      provider: 'Mercator Ocean / Copernicus Marine Environment Monitoring Service',
      link: 'https://marine.copernicus.eu/',
      tag: 'Ocean Currents Data',
      description: 'Daily and hourly ocean surface current velocities (eastward `uo` and northward `vo` in m/s) at 1/12° (~8 km) spatial resolution.',
      usage: 'Supplies high-fidelity surface hydrodynamic advection vectors for computing backward trajectory drift equations.'
    },
    {
      id: 'res-s4-2',
      stage: 's4',
      stageName: 'Stage 4 · Ocean Drift Inversion',
      name: 'ECMWF ERA5 Reanalysis 10m Atmospheric Winds',
      type: 'Global Atmospheric Dataset',
      provider: 'European Centre for Medium-Range Weather Forecasts (ECMWF)',
      link: 'https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5',
      tag: 'Surface Wind Vectors',
      description: 'Global hourly atmospheric reanalysis providing 10m zonal (u10) and meridional (v10) surface wind components at 0.25° grid resolution.',
      usage: 'Supplies wind vectors to calculate direct surface wind drag (leeway drift: order of 2–3% of wind velocity with 15° Coriolis deflection).'
    },
    {
      id: 'res-s4-3',
      stage: 's4',
      stageName: 'Stage 4 · Ocean Drift Inversion',
      name: 'OpenDrift Marine Particle Trajectory Framework',
      type: 'Lagrangian Numerical Drift Engine',
      provider: 'Norwegian Meteorological Institute (Dagestad et al.)',
      link: 'https://opendrift.github.io/',
      tag: 'Trajectory Engine',
      description: 'Open-source Python framework for modeling the trajectories and weathering of oil, search & rescue targets, and plastic particles in the ocean.',
      usage: 'Inverted Runge-Kutta 4th Order (RK4) integration stepping backwards in negative time from satellite pass time T₀ to T₀ - 48h to delineate the Release Source Window.'
    },

    // Stage 5: AIS Maritime Dataset Engineering
    {
      id: 'res-s5-1',
      stage: 's5',
      stageName: 'Stage 5 · AIS Dataset Engineering',
      name: 'US NOAA MarineCadastre AIS Broadcast Archive',
      type: 'Official Historical AIS Dataset',
      provider: 'US NOAA Office for Coastal Management & Bureau of Ocean Energy Management (BOEM)',
      link: 'https://marinecadastre.gov/ais/',
      tag: 'Primary AIS Repository',
      description: 'Nationwide and open-ocean vessel traffic data collected from U.S. Coast Guard Nationwide Automatic Identification System (NAIS) receivers.',
      usage: 'Supplies ground-truth vessel kinematic messages: MMSI, IMO, Timestamp (UTC), Latitude, Longitude, SOG (Knots), COG, True Heading, and IMO Vessel Class.'
    },
    {
      id: 'res-s5-4',
      stage: 's5',
      stageName: 'Stage 5 · AIS Dataset Engineering',
      name: 'MovingPandas Trajectory Analysis Library',
      type: 'Spatio-Temporal Analysis Library',
      provider: 'Anita Graser et al. / GeoPython',
      link: 'https://movingpandas.readthedocs.io/',
      tag: 'Trajectory Mining',
      description: 'Python library built on GeoPandas for analyzing movement trajectories, computing spatial stop-detection, and measuring temporal proximity.',
      usage: 'Executes trajectory segmentation, speed anomaly calculation, and spatial distance-to-slick calculations across all nearby vessels.'
    },

    // Stage 6: Multi-Criteria Decision Analysis (MCDA)
    {
      id: 'res-s6-1',
      stage: 's6',
      stageName: 'Stage 6 · Suspect Attribution',
      name: 'Analytic Hierarchy Process (AHP) & Weighted Sum Model (WSM)',
      type: 'Decision Theory / Mathematical Model',
      provider: 'Thomas L. Saaty / Decision Sciences',
      link: 'https://en.wikipedia.org/wiki/Analytic_hierarchy_process',
      tag: 'Mathematical Decision Model',
      description: 'Multi-criteria decision analysis framework for synthesizing qualitative expert rules into mathematically normalized ranking vectors.',
      usage: 'Combines 4 distinct forensic signals: 35% Trajectory Proximity, 25% Loitering/Dwell Time, 20% Vessel Risk Type, and 20% Speed/AIS Anomaly into a 0–100 Forensic Score.'
    },
    {
      id: 'res-s6-2',
      stage: 's6',
      stageName: 'Stage 6 · Suspect Attribution',
      name: 'SciPy Spatial KD-Tree & Distance Computations',
      type: 'Computational Geometry',
      provider: 'SciPy Developers',
      link: 'https://docs.scipy.org/doc/scipy/reference/spatial.html',
      tag: 'Spatial Indexing',
      description: 'Fast nearest-neighbor lookups using 2D and 3D spatial KD-Trees with Haversine distance metrics.',
      usage: 'Finds the closest point of approach (CPA) between vessel waypoints and the backward drift cone in sub-millisecond time.'
    },

    // Stage 7: Tactical Frontend & Dashboard
    {
      id: 'res-s7-1',
      stage: 's7',
      stageName: 'Stage 7 · Tactical Dashboard',
      name: 'Leaflet.js & CARTO Dark Matter Maritime Canvas',
      type: 'Interactive Cartographic Engine',
      provider: 'LeafletJS / CARTO Basemaps',
      link: 'https://leafletjs.com/',
      tag: 'Interactive Map Engine',
      description: 'High-performance interactive web mapping library configured with CARTO Dark Matter and OpenSeaMap nautical overlays.',
      usage: 'Renders satellite SAR bounding footprints, classified slick polygon contours, backward drift cones, vessel trajectories, and clickable suspect pins.'
    }
  ];

  // Filtering Logic
  const filteredResources = useMemo(() => {
    return RESOURCES_DATA.filter((item) => {
      const matchStage = selectedStage === 'all' || item.stage === selectedStage;
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.usage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStage && matchSearch;
    });
  }, [selectedStage, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-24">
      {/* Top Header Breadcrumb & Title */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0284C7] uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Forensic Directory & Knowledge Base · SIH26143</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-[#0F172A]">
                Resources, Datasets & Source Links
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-3xl leading-relaxed">
                Official source repositories, satellite data APIs, open-access machine learning benchmarks, and data pipelines used across all stages of Ocean 360.
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAccuracy}
                className="px-4 py-2 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-xs md:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>Improved Accuracy & Benchmarks</span>
              </button>
              <button
                onClick={onOpenPipeline}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs md:text-sm flex items-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <Layers className="w-4 h-4 text-[#0284C7]" />
                <span>View Pipeline Theory</span>
              </button>
              <button
                onClick={onOpenDashboard}
                className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs md:text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* ============================================================ */}
        {/* INTERACTIVE DIRECTORY: STAGE-BY-STAGE RESOURCES */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A]">
                Stage-by-Stage Forensic Catalog
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Explore tools, APIs, and theoretical baselines categorized by pipeline stage.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, APIs, models…"
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {STAGES_FILTER.map((stage) => {
              const isActive = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0284C7] text-white shadow-2xs font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>

          {/* Resources Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                      {res.stageName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] text-[10px] font-mono font-semibold">
                      {res.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-serif text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                      {res.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {res.provider}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider block">
                      How Ocean 360 Uses It
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      {res.usage}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {res.type}
                  </span>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] group-hover:underline cursor-pointer"
                  >
                    <span>Official Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No resources found</h3>
              <p className="text-xs text-slate-400">
                No resources matched your search query "{searchQuery}". Try selecting a different filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedStage('all'); }}
                className="px-3 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* BOTTOM CTA CALLOUT */}
        {/* ============================================================ */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0F172A] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-lg md:text-xl font-serif font-bold text-white">
              Ready to verify the pipeline against real incident data?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch our tactical briefing dashboard to view real Sentinel-1 SAR observations, interact with backward ocean drift vectors, and test suspect vessel MCDA filtering.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenPipeline}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm cursor-pointer transition-all"
            >
              Study 7 Stages
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <span>Launch Tactical Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
