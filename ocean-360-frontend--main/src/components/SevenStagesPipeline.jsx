import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  Wind,
  Compass,
  MapPin,
  Ship,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';

export const SEVEN_STAGES = [
  {
    stage: 1,
    title: 'SAR Satellite Data Ingestion',
    shortName: 'SAR Ingestion',
    icon: Satellite,
    tag: 'Satellite Data',
    status: 'Completed',
    summary: 'Ingestion of Sentinel-1 C-Band Level-1 GRDH radar imagery with radiometric calibration, speckle filtering, and terrain correction.',
    inputs: 'Sentinel-1A/B IW GRDH radar scenes',
    outputs: 'Calibrated backscatter sigma-0 amplitude map',
    metric: '10m x 10m pixel resolution'
  },
  {
    stage: 2,
    title: 'Oil Slick Detection & Segmentation',
    shortName: 'Slick Mask',
    icon: Layers,
    tag: 'Computer Vision',
    status: 'Completed',
    summary: 'Segmentation of low-backscatter anomalies caused by oil dampening ocean capillary waves, isolating slick polygon and centroid.',
    inputs: 'Calibrated SAR backscatter matrix',
    outputs: 'Slick polygon, total area (km²), geometric centroid',
    metric: '4.82 km² polygon area'
  },
  {
    stage: 3,
    title: 'Metocean Environmental Forcing',
    shortName: 'Metocean Winds/Currents',
    icon: Wind,
    tag: 'Hydrodynamics',
    status: 'Completed',
    summary: 'Spatio-temporal integration of ECMWF surface wind fields (U10, V10) and HYCOM surface ocean current vectors across incident coordinates.',
    inputs: 'ECMWF ERA5 winds & HYCOM ocean current models',
    outputs: 'Hydrodynamic vector drift forcing fields',
    metric: 'Hourly vector time series'
  },
  {
    stage: 4,
    title: 'Backward Lagrangian Drift Hindcast',
    shortName: 'Reverse Drift',
    icon: Compass,
    tag: 'Trajectory Model',
    status: 'Completed',
    summary: 'Backward-in-time Lagrangian particle advection combining 100% surface currents, 3% wind leeway, and turbulent diffusion.',
    inputs: 'Slick centroid, reverse time horizon',
    outputs: 'Reverse drift particle trajectories (T+0h to T-168h)',
    metric: '500 stochastic particles'
  },
  {
    stage: 5,
    title: 'Release Origin & Temporal Window',
    shortName: 'Spill Origin',
    icon: MapPin,
    tag: 'Geospatial Origin',
    status: 'Completed',
    summary: 'Identification of estimated release origin coordinate [lat, lon], discharge timestamp, and 95% confidence dispersion ellipse.',
    inputs: 'Converged particle hindcast clusters',
    outputs: 'Spill origin coordinate, release timestamp, confidence cone',
    metric: '95% confidence ellipse'
  },
  {
    stage: 6,
    title: 'AIS Vessel Corridor Extraction',
    shortName: 'AIS Mining',
    icon: Ship,
    tag: 'Maritime AIS',
    status: 'Completed',
    summary: 'Extraction and interpolation of terrestrial/satellite AIS vessel voyage tracks traversing the hindcast origin corridor during the release window.',
    inputs: 'Raw regional AIS broadcast logs (MMSI, SOG, COG, Lat/Lon)',
    outputs: 'Reconstructed vessel tracks and velocity profiles',
    metric: '5 candidate tracks extracted'
  },
  {
    stage: 7,
    title: 'Candidate Scoring & Culprit Attribution',
    shortName: 'Attribution & Ranking',
    icon: ShieldCheck,
    tag: 'Interactive Stage 7',
    status: 'Active (In-Browser)',
    summary: 'Multi-criteria decision matrix scoring candidates based on proximity, dwell time, speed slowdown anomalies, trajectory path, and ship classification.',
    inputs: 'AIS candidate tracks, origin cone, Stage-7 weights',
    outputs: 'Ranked candidate vessels with forensic justification',
    metric: 'Sub-second real-time re-ranking'
  }
];

export default function SevenStagesPipeline({ compact = false, onSelectStage }) {
  const [selectedStage, setSelectedStage] = useState(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent-50 border border-accent-200 flex items-center justify-center text-accent">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">
            7-Stage Forensic Investigation Pipeline
          </h3>
          <span className="text-[11px] font-mono text-text-tertiary bg-surface-100 border border-surface-300 px-2 py-0.5 rounded-full">
            SIH26143 Standard
          </span>
        </div>
        <span className="text-xs text-text-secondary">
          Stages 1–6: Automated Ingestion & Modeling · Stage 7: Client-Side Interactive Attribution
        </span>
      </div>

      {/* Grid of 7 Stages */}
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-7' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-7'} gap-3`}>
        {SEVEN_STAGES.map((stg) => {
          const Icon = stg.icon;
          const isStage7 = stg.stage === 7;
          return (
            <div
              key={stg.stage}
              onClick={() => setSelectedStage(stg)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isStage7
                  ? 'bg-accent-50/40 border-accent-200 hover:border-accent hover:shadow-card-hover'
                  : 'bg-card border-surface-300 hover:border-surface-400 hover:shadow-card-hover'
              }`}
            >
              <div>
                {/* Stage Number & Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                      isStage7
                        ? 'bg-accent text-white'
                        : 'bg-surface-100 text-text-secondary group-hover:bg-accent-50 group-hover:text-accent transition-colors'
                    }`}
                  >
                    {stg.stage}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      isStage7
                        ? 'bg-accent-100 text-accent-700 border-accent-200'
                        : 'bg-surface-50 text-text-tertiary border-surface-200'
                    }`}
                  >
                    {stg.tag}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xs font-semibold text-text-primary mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                  {stg.title}
                </h4>

                {/* Summary */}
                <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-3">
                  {stg.summary}
                </p>
              </div>

              {/* Footer Metric */}
              <div className="mt-3 pt-2 border-t border-surface-200 flex items-center justify-between text-[10px]">
                <span className="text-text-tertiary truncate">{stg.metric}</span>
                <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Modal */}
      {selectedStage && (
        <div
          onClick={() => setSelectedStage(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-surface-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-slide-up"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-surface-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-50 border border-accent-200 flex items-center justify-center text-accent">
                  <selectedStage.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-accent uppercase tracking-wider">
                    Stage {selectedStage.stage} of 7
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {selectedStage.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-xs text-text-secondary leading-relaxed">
              {selectedStage.summary}
            </p>

            <div className="bg-surface-50 border border-surface-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-text-primary">Pipeline Inputs: </span>
                <span className="text-text-secondary">{selectedStage.inputs}</span>
              </div>
              <div>
                <span className="font-semibold text-text-primary">Pipeline Outputs: </span>
                <span className="text-text-secondary">{selectedStage.outputs}</span>
              </div>
              <div>
                <span className="font-semibold text-text-primary">Evaluation Benchmark: </span>
                <span className="text-accent font-mono font-medium">{selectedStage.metric}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-200">
              <span className="text-[11px] text-text-tertiary">
                Status: <strong className="text-accent">{selectedStage.status}</strong>
              </span>
              <button
                onClick={() => setSelectedStage(null)}
                className="h-8 px-4 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
