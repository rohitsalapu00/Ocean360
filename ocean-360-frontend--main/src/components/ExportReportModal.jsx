import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, FileCode, Download, Printer, CheckCircle2, Shield } from 'lucide-react';
import { generatePdfReport, generateCsvReport, generateJsonReport } from '../reportGenerator';

export default function ExportReportModal({
  isOpen,
  onClose,
  caseData,
  filteredCandidates = [],
  allCandidates = [],
  filters,
  weights
}) {
  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' | 'csv' | 'json'
  const [datasetScope, setDatasetScope] = useState('filtered'); // 'filtered' | 'all'
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !caseData) return null;

  const candidatesToExport = datasetScope === 'filtered' ? filteredCandidates : allCandidates;
  const caseId = caseData.case_id || 'CASE';

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (selectedFormat === 'pdf') {
        generatePdfReport(caseData, candidatesToExport, filters, weights);
      } else if (selectedFormat === 'csv') {
        generateCsvReport(caseData, candidatesToExport);
      } else if (selectedFormat === 'json') {
        generateJsonReport(caseData);
      }
      setIsExporting(false);
      onClose();
    }, 300);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in text-[#0F172A] font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#0F172A]">
                Export Forensic Case Report
              </h2>
              <p className="text-xs font-mono text-slate-500">
                Case ID: <strong className="text-[#0284C7]">{caseId}</strong> · {candidatesToExport.length} candidates
              </p>
              {caseData?.region && (
                <div className="text-[11px] font-sans font-semibold text-[#0284C7] flex items-center gap-1 mt-0.5">
                  <span>📍 Region:</span>
                  <span className="text-slate-800">{caseData.region}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dataset Scope Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Candidates to Include:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDatasetScope('filtered')}
              className={`p-2 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                datasetScope === 'filtered'
                  ? 'bg-sky-50 border-[#0284C7] text-[#0284C7] shadow-xs'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Filtered Candidates ({filteredCandidates.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setDatasetScope('all')}
              className={`p-2 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                datasetScope === 'all'
                  ? 'bg-sky-50 border-[#0284C7] text-[#0284C7] shadow-xs'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>All Candidates ({allCandidates.length})</span>
            </button>
          </div>
        </div>

        {/* Format Selection Cards */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700">Select Export Format:</label>

          {/* Option 1: PDF */}
          <div
            onClick={() => setSelectedFormat('pdf')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
              selectedFormat === 'pdf'
                ? 'border-[#0284C7] bg-sky-50/50 shadow-xs'
                : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">PDF Forensic Briefing Report</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Official maritime briefing document with satellite observations, hindcast drift trajectory, candidate rankings, and forensic evidence justifications. Ready to print or save directly as PDF.
              </p>
            </div>
          </div>

          {/* Option 2: CSV */}
          <div
            onClick={() => setSelectedFormat('csv')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
              selectedFormat === 'csv'
                ? 'border-[#0284C7] bg-sky-50/50 shadow-xs'
                : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">CSV Data Spreadsheet (.csv)</span>
                <span className="text-[10px] font-mono text-slate-500">Excel / GIS</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Tabular summary containing candidate MMSI, ship types, calculated scores, distances, dwell durations, speeds, and evidence strings.
              </p>
            </div>
          </div>

          {/* Option 3: JSON */}
          <div
            onClick={() => setSelectedFormat('json')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
              selectedFormat === 'json'
                ? 'border-[#0284C7] bg-sky-50/50 shadow-xs'
                : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">JSON Case Archive (.json)</span>
                <span className="text-[10px] font-mono text-slate-500">Raw Data</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Complete normalized case JSON file for backend re-import, archival, or API ingestion.
              </p>
            </div>
          </div>
        </div>

        {/* Security / Quality Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
          <Shield className="w-4 h-4 text-[#0284C7] shrink-0" />
          <span>Generates verifiable forensic evidence records with SIH26143 metadata stamps.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold font-sans tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            {selectedFormat === 'pdf' ? (
              <>
                <Printer className="w-4 h-4" />
                <span>{isExporting ? 'Generating PDF…' : 'Generate & Download PDF'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting…' : `Download ${selectedFormat.toUpperCase()}`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
