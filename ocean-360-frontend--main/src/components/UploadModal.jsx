import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, FileCode, CheckCircle2, ArrowRight, AlertCircle, Eye } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess, onLoadSample }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    setErrorMsg(null);
    setSelectedFile(file);

    const isJson = file.name.endsWith('.json') || file.type === 'application/json';
    const isImage = file.type.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|tiff|tif|webp)$/i);

    if (isJson) {
      setFileType('json');
      setPreviewUrl(null);
    } else if (isImage) {
      setFileType('image');
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFileType('unknown');
      setPreviewUrl(null);
      setErrorMsg('Supported formats: SAR / Optical Satellite Images (.png, .jpg, .tiff) or Ocean 360 Case JSON files.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (!selectedFile) return;

    if (fileType === 'json') {
      onUploadSuccess(selectedFile);
      onClose();
    } else {
      // For satellite imagery files (PNG/JPG/TIFF), pass file and transition to analysis workflow
      onUploadSuccess(selectedFile);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-slide-up text-[#0F172A]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#0F172A] font-sans">
                Upload Satellite Observation
              </h2>
              <p className="text-xs font-mono text-slate-500">
                SAR Imagery (Sentinel-1 / RADARSAT) or Case Dataset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone Area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
            dragActive
              ? 'border-[#0284C7] bg-sky-50 scale-[1.01]'
              : selectedFile
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-300 hover:border-[#0284C7] bg-[#F8FAFC]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".json,.png,.jpg,.jpeg,.tiff,.tif,application/json,image/*"
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-3 w-full flex flex-col items-center">
              {fileType === 'image' && previewUrl ? (
                <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img src={previewUrl} alt="Satellite Preview" className="w-full h-full object-cover max-h-48" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-[#0284C7] font-bold border border-sky-200">
                    SAR Image Loaded
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <FileCode className="w-6 h-6" />
                </div>
              )}

              <div className="text-center">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{selectedFile.name}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready for analysis
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 font-sans">
                  Drag & drop your satellite image or case JSON file here
                </p>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  or <span className="text-[#0284C7] font-bold underline cursor-pointer">browse computer</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                  Sentinel-1 C-SAR
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                  GeoTIFF / PNG / JPG
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                  Case JSON
                </span>
              </div>
            </>
          )}
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2 font-sans font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            onClick={() => {
              if (onLoadSample) onLoadSample();
              onClose();
            }}
            className="text-xs text-slate-600 hover:text-[#0284C7] underline font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Load Sample Observation</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedFile}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                selectedFile
                  ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Analyze & Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
