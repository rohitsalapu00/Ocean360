import React, { useRef, useState } from 'react';
import { Upload, FileCode, Play, ShieldCheck, Sparkles } from 'lucide-react';
import SevenStagesPipeline from './SevenStagesPipeline';

export default function EmptyState({ onFileUpload, onLoadSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) onFileUpload(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-[1700px] mx-auto w-full animate-fade-in space-y-10">
      {/* Centered Upload / Drag-and-Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`max-w-xl w-full p-8 md:p-9 rounded-2xl border-2 transition-all text-center flex flex-col items-center space-y-6 ${
          isDragging
            ? 'border-accent bg-accent-50/40 scale-[1.01]'
            : 'border-dashed border-surface-300 bg-card shadow-card hover:border-surface-400'
        }`}
      >
        {/* Clean Icon */}
        <div className="w-12 h-12 rounded-2xl bg-surface-50 border border-surface-300 flex items-center justify-center text-accent">
          <Upload className="w-6 h-6" />
        </div>

        {/* Short Title & Single-Sentence Explanation */}
        <div className="space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-50 border border-accent-200 text-accent text-[11px] font-medium">
            <Sparkles className="w-3 h-3" />
            <span>SIH26143 Forensic Platform</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">
            Oil Spill Forensic Briefing
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Upload a <code className="text-accent font-mono text-xs bg-accent-50 px-1.5 py-0.5 rounded border border-accent-200">case_full.json</code> file to reconstruct the oil slick hindcast origin and evaluate candidate culprit vessels.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => { if (e.target.files?.[0]) onFileUpload(e.target.files[0]); e.target.value = ''; }}
          accept=".json,application/json"
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={() => fileInputRef.current?.click()}
            id="btn-empty-upload"
            className="h-10 px-5 rounded-lg bg-accent hover:bg-accent-600 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload case JSON</span>
          </button>
          <button
            onClick={onLoadSample}
            id="btn-empty-load-sample"
            className="h-10 px-5 rounded-lg bg-card hover:bg-surface-50 text-text-primary font-medium text-xs border border-surface-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-accent" />
            <span>Load sample (/sample_case_full.json)</span>
          </button>
        </div>

        {/* Browser Security Note */}
        <div className="pt-4 border-t border-surface-200 w-full flex items-center justify-center gap-2 text-[11px] text-text-tertiary">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>100% In-Browser. No server upload. Data remains local.</span>
        </div>
      </div>

      {/* ALL 7 STAGES CLEARLY DISPLAYED ON HOME SCREEN */}
      <div className="w-full bg-card border border-surface-300 rounded-2xl p-5 md:p-6 shadow-card">
        <SevenStagesPipeline />
      </div>
    </div>
  );
}
