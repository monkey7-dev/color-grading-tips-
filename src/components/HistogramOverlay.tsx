import React from 'react';
import { HistogramData } from '../utils/photoAnalysisMath';

interface HistogramOverlayProps {
  histogram: HistogramData;
  className?: string;
}

export const HistogramOverlay: React.FC<HistogramOverlayProps> = ({ histogram, className }) => {
  const buckets = histogram.luminance.length;
  const height = 60;
  
  return (
    <div className={`relative bg-slate-950/80 rounded-lg border border-slate-800 p-2 ${className}`}>
      <div className="text-[9px] text-slate-400 mb-1 font-mono uppercase tracking-wider flex justify-between">
        <span>Tonal Distribution (Luminance)</span>
        <span>0 - 100 IRE</span>
      </div>
      <div className="relative w-full h-12 flex items-end gap-[1px]">
        {histogram.luminance.map((val, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-500/50"
            style={{ height: `${Math.max(2, val * 100)}%` }}
          />
        ))}
        {/* RGB Channels Overlay */}
        <div className="absolute inset-0 flex items-end gap-[1px] opacity-40">
           {histogram.r.map((val, i) => (
            <div key={`r-${i}`} className="flex-1 bg-red-500" style={{ height: `${val * 100}%` }} />
           ))}
        </div>
        <div className="absolute inset-0 flex items-end gap-[1px] opacity-40">
           {histogram.g.map((val, i) => (
            <div key={`g-${i}`} className="flex-1 bg-green-500" style={{ height: `${val * 100}%` }} />
           ))}
        </div>
        <div className="absolute inset-0 flex items-end gap-[1px] opacity-40">
           {histogram.b.map((val, i) => (
            <div key={`b-${i}`} className="flex-1 bg-blue-500" style={{ height: `${val * 100}%` }} />
           ))}
        </div>
      </div>
    </div>
  );
};
