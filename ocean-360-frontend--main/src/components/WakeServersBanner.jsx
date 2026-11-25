import React, { useState } from 'react';
import { Server, CheckCircle2, RefreshCw, X } from 'lucide-react';

export default function WakeServersBanner() {
  const [isWaking, setIsWaking] = useState(false);
  const [isWoken, setIsWoken] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWake = () => {
    setIsWaking(true);
    setTimeout(() => {
      setIsWaking(false);
      setIsWoken(true);
      setTimeout(() => setIsModalOpen(false), 1200);
    }, 1500);
  };

  return (
    <>
      {/* Floating Bottom Center Banner matching Screenshots 1, 2, 3, 4, 5 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="bg-[#121B2B]/95 backdrop-blur-md border border-[#213A5E] shadow-2xl rounded-full px-5 py-2 flex items-center gap-3 text-xs text-slate-200">
          <span className="font-medium text-slate-300">
            Frontend Preview Only. Please wake servers to enable backend functionality.
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            id="btn-wake-servers"
            className="px-3 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-xs font-semibold font-mono tracking-wide transition-colors cursor-pointer"
          >
            {isWoken ? 'Servers Online' : 'Wake up servers'}
          </button>
        </div>
      </div>

      {/* Wake Servers Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1321] border border-[#16263D] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#16263D]">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono">
                  OCEAN SENTINEL BACKEND CLUSTER
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Connect or wake up the backend processing microservices for Sentinel-1 SAR ingestion, ECMWF drift hydrodynamic simulation, and live AIS decoders.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-[#060B14] border border-[#16263D]">
                <span className="text-slate-400">SAR Ingestion Pipeline:</span>
                <span className={isWoken ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isWoken ? 'READY (PORT 8001)' : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#060B14] border border-[#16263D]">
                <span className="text-slate-400">Metocean Hydrodynamic Engine:</span>
                <span className={isWoken ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isWoken ? 'READY (PORT 8002)' : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#060B14] border border-[#16263D]">
                <span className="text-slate-400">AIS Correlator & Attribution:</span>
                <span className={isWoken ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isWoken ? 'READY (PORT 8003)' : 'STANDBY'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-sans"
              >
                Cancel
              </button>
              <button
                onClick={handleWake}
                disabled={isWaking || isWoken}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                {isWaking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Waking Services...</span>
                  </>
                ) : isWoken ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cluster Online</span>
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5" />
                    <span>Initiate Cluster Wake</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
