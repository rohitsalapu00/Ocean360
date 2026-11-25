import React from 'react';
import { Info } from 'lucide-react';

export default function Banner() {
  return (
    <div className="bg-surface-50 border-b border-surface-300 text-text-secondary text-xs px-5 py-2 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2 max-w-4xl truncate">
        <Info className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
        <span className="truncate">
          Prototype case file — candidate scoring, not legal proof. No live satellite/AIS feed.
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-[11px] text-text-tertiary shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
        <span>Stage-7 Scoring</span>
      </div>
    </div>
  );
}
