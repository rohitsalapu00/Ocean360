import React, { useState } from 'react';
import { Layers, ZoomIn, X, Info, Compass, Radio, Ship } from 'lucide-react';

const IMAGES = [
  {
    id: 'sar',
    title: 'Sentinel-1 SAR Satellite Detection',
    badge: 'SAR C-Band Backscatter',
    badgeColor: 'bg-accent-50 text-accent-700 border-accent-200',
    src: '/imagery/sar_sentinel1.jpg',
    description: '10m resolution C-band Synthetic Aperture Radar capture. The oil film dampens capillary ocean surface waves, creating a sharp low-backscatter dark slick signature.',
    metrics: [
      { label: 'Sensor', val: 'Sentinel-1A IW GRDH' },
      { label: 'Polarization', val: 'VV / VH Cross-pol' },
      { label: 'Pixel Res.', val: '10m × 10m' },
      { label: 'Slick Area', val: '4.82 km²' }
    ]
  },
  {
    id: 'hindcast',
    title: 'Reverse Drift Hindcast Simulation',
    badge: 'Lagrangian Advection',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    src: '/imagery/drift_hindcast.jpg',
    description: 'Hydrodynamic particle backtracking combining surface ocean currents and 3% wind drift factor to estimate the spatio-temporal release origin coordinate.',
    metrics: [
      { label: 'Model', val: 'Lagrangian Trajectory' },
      { label: 'Duration', val: '168 Hours (7 Days)' },
      { label: 'Particles', val: '500 Tracked' },
      { label: 'Origin Cl', val: '95% Confidence' }
    ]
  },
  {
    id: 'ais',
    title: 'AIS Vessel Interception & Radar Analysis',
    badge: 'Stage 7 Forensic Matrix',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    src: '/imagery/ais_tracking.jpg',
    description: 'Spatio-temporal intersection analysis matching AIS vessel voyage history against the hindcast origin cone, evaluating speed drops and dwell anomalies.',
    metrics: [
      { label: 'Coverage', val: 'Zone Intersecting' },
      { label: 'Suspects Evaluated', val: '5 Candidate Ships' },
      { label: 'Telemetry', val: 'Speed / Course / Dwell' },
      { label: 'Top Candidate', val: 'Mariner Empress' }
    ]
  }
];

export default function ForensicImageryGallery() {
  const [activeModalImg, setActiveModalImg] = useState(null);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-surface-300">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Forensic Imagery & Radar Intelligence
          </h2>
          <p className="text-xs text-text-secondary">
            Satellite radar backscatter, hydrodynamic drift hindcast modeling, and AIS route convergence exhibits.
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-tertiary bg-surface-100 border border-surface-300 px-2.5 py-1 rounded-md self-start sm:self-auto">
          3 Calibrated Datasets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {IMAGES.map((img) => (
          <div
            key={img.id}
            className="bg-card border border-surface-300 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col group"
          >
            {/* Image Thumbnail with zoom overlay */}
            <div
              onClick={() => setActiveModalImg(img)}
              className="relative aspect-[4/3] bg-surface-100 overflow-hidden cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-card/90 text-text-primary px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md">
                  <ZoomIn className="w-3.5 h-3.5 text-accent" />
                  View Full Resolution
                </span>
              </div>
              <div className="absolute top-2.5 left-2.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shadow-sm ${img.badgeColor}`}>
                  {img.badge}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">
                  {img.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {img.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-surface-200">
                {img.metrics.map((m, i) => (
                  <div key={i} className="bg-surface-50 p-2 rounded-lg border border-surface-200/60">
                    <div className="text-[10px] text-text-tertiary uppercase tracking-wider">{m.label}</div>
                    <div className="text-xs font-medium text-text-primary font-mono truncate">{m.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High-Resolution Modal */}
      {activeModalImg && (
        <div
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-surface-300 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
          >
            <div className="px-5 py-3 border-b border-surface-300 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {activeModalImg.title}
                </h3>
                <span className="text-xs text-text-secondary">
                  {activeModalImg.badge}
                </span>
              </div>
              <button
                onClick={() => setActiveModalImg(null)}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-surface-100 overflow-auto flex items-center justify-center max-h-[70vh]">
              <img
                src={activeModalImg.src}
                alt={activeModalImg.title}
                className="max-h-[68vh] w-auto rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="p-4 border-t border-surface-300 bg-card text-xs text-text-secondary">
              {activeModalImg.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
