/**
 * Professional Real-Time Colorist Scopes (Vectorscope & RGB Parade)
 * Simulating DaVinci Resolve & Baselight hardware scopes with
 * 135° Skin Tone I-Line, Rec.709 color targets, and IRE luminance scales.
 */

import React, { useState } from 'react';
import { ColorWheelVal, rgbOffsetToPolar, kelvinToRgb } from '../utils/cinematographyGradingMath';
import { Activity, Disc, BarChart2 } from 'lucide-react';

interface CinemaScopesProps {
  lift: ColorWheelVal;
  gamma: ColorWheelVal;
  gain: ColorWheelVal;
  offsetLum: number;
  contrast: number;
  saturation: number;
  kelvin: number;
  tint: number;
}

export const CinemaScopes: React.FC<CinemaScopesProps> = ({
  lift,
  gamma,
  gain,
  offsetLum,
  contrast,
  saturation,
  kelvin,
  tint,
}) => {
  const [activeScope, setActiveScope] = useState<'both' | 'vectorscope' | 'parade'>('both');

  // Compute polar offsets for vectorscope trace
  const liftPolar = rgbOffsetToPolar(lift.r, lift.g, lift.b);
  const gammaPolar = rgbOffsetToPolar(gamma.r, gamma.g, gamma.b);
  const gainPolar = rgbOffsetToPolar(gain.r, gain.g, gain.b);

  // Kelvin chromatic shift on vectorscope
  const kRgb = kelvinToRgb(kelvin);
  const kShiftX = (kRgb.b - kRgb.r) * 22; // Warm shifts left/down, Cool shifts right/up
  const kShiftY = (kRgb.r * 0.5 - kRgb.b * 0.5) * 18 - (tint / 50) * 10;

  // Center is (100, 100), Radius is 80
  const cx = 100;
  const cy = 100;
  const scale = 50 * saturation;

  const toXY = (deg: number, mag: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + mag * scale * Math.cos(rad) + kShiftX,
      y: cy - mag * scale * Math.sin(rad) + kShiftY,
    };
  };

  const liftXY = toXY(liftPolar.angleDeg, liftPolar.magnitude);
  const gammaXY = toXY(gammaPolar.angleDeg, gammaPolar.magnitude);
  const gainXY = toXY(gainPolar.angleDeg, gainPolar.magnitude);

  // RGB Parade channel calculations (0 - 100 IRE mapped to SVG heights)
  const getChannelIRE = (channelRgbDelta: number, lumIRE: number, kelvinFactor: number) => {
    const baseBlack = Math.max(0, Math.min(35, 5 + lumIRE * 0.35 + channelRgbDelta * 15));
    const baseMid = Math.max(
      10,
      Math.min(85, 45 + offsetLum * 0.5 + lumIRE * 0.2 + (kelvinFactor - 1) * 20)
    );
    const baseWhite = Math.max(
      60,
      Math.min(100, 88 + gain.lum * 0.3 + channelRgbDelta * 18 + (contrast - 1) * 20)
    );
    return { black: baseBlack, mid: baseMid, white: baseWhite };
  };

  const redParade = getChannelIRE(gain.r + lift.r, lift.lum, kRgb.r / 0.85);
  const greenParade = getChannelIRE(gain.g + lift.g, gamma.lum, kRgb.g / 0.85);
  const blueParade = getChannelIRE(gain.b + lift.b, gain.lum, kRgb.b / 0.85);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      {/* Scopes Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            Real-Time Video Scopes (Grade Diagnostic)
          </h4>
        </div>

        {/* Scope View Switcher */}
        <div className="flex items-center gap-1 text-[11px] bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveScope('both')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeScope === 'both' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Dual Scopes
          </button>
          <button
            onClick={() => setActiveScope('vectorscope')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeScope === 'vectorscope' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <Disc className="w-3 h-3 text-emerald-400" />
            <span>Vectorscope</span>
          </button>
          <button
            onClick={() => setActiveScope('parade')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeScope === 'parade' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <BarChart2 className="w-3 h-3 text-cyan-400" />
            <span>RGB Parade</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VECTORSCOPE */}
        {(activeScope === 'both' || activeScope === 'vectorscope') && (
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5" />
                <span>Vectorscope (75% Rec.709 Graticule)</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                <span className="w-2 h-0.5 bg-amber-400 inline-block" />
                <span>135° Skin Line (I-Line)</span>
              </span>
            </div>

            <div className="relative aspect-square max-w-[240px] mx-auto bg-slate-950 rounded-full border border-slate-800 p-2 shadow-inner">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Outer graticule ring */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 3" />
                <circle cx="100" cy="100" r="30" fill="none" stroke="#1e293b" strokeWidth="0.8" />

                {/* Crosshairs */}
                <line x1="10" y1="100" x2="190" y2="100" stroke="#334155" strokeWidth="0.8" />
                <line x1="100" y1="10" x2="100" y2="190" stroke="#334155" strokeWidth="0.8" />

                {/* 135° Skin Tone Line (I-Line) */}
                <line
                  x1="100"
                  y1="100"
                  x2="35"
                  y2="35"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                />
                <text x="24" y="30" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  SKIN (I)
                </text>

                {/* Rec.709 Color Target Boxes (R, Mg, B, Cy, G, Yl) */}
                {/* Red (approx 105° on vectorscope) */}
                <rect x="75" y="24" width="8" height="8" fill="none" stroke="#ef4444" strokeWidth="1" />
                <text x="86" y="31" fill="#ef4444" fontSize="7" fontFamily="monospace">R</text>

                {/* Magenta (approx 45°) */}
                <rect x="145" y="42" width="8" height="8" fill="none" stroke="#ec4899" strokeWidth="1" />
                <text x="156" y="49" fill="#ec4899" fontSize="7" fontFamily="monospace">Mg</text>

                {/* Blue (approx 345°) */}
                <rect x="160" y="105" width="8" height="8" fill="none" stroke="#3b82f6" strokeWidth="1" />
                <text x="170" y="112" fill="#3b82f6" fontSize="7" fontFamily="monospace">B</text>

                {/* Cyan (approx 285°) */}
                <rect x="110" y="165" width="8" height="8" fill="none" stroke="#06b6d4" strokeWidth="1" />
                <text x="120" y="172" fill="#06b6d4" fontSize="7" fontFamily="monospace">Cy</text>

                {/* Green (approx 225°) */}
                <rect x="35" y="145" width="8" height="8" fill="none" stroke="#10b981" strokeWidth="1" />
                <text x="24" y="152" fill="#10b981" fontSize="7" fontFamily="monospace">G</text>

                {/* Yellow (approx 165°) */}
                <rect x="25" y="80" width="8" height="8" fill="none" stroke="#eab308" strokeWidth="1" />
                <text x="15" y="87" fill="#eab308" fontSize="7" fontFamily="monospace">Yl</text>

                {/* DYNAMIC CHROMINANCE TRACE (Radar Phosphor Cloud) */}
                {/* Center baseline fog */}
                <ellipse cx={cx + kShiftX} cy={cy + kShiftY} rx="16" ry="14" fill="#10b981" opacity="0.18" />

                {/* Lift Trace (Shadow Tint) */}
                <circle cx={liftXY.x} cy={liftXY.y} r="10" fill="#06b6d4" opacity="0.4" />
                <circle cx={liftXY.x} cy={liftXY.y} r="3" fill="#06b6d4" />
                <line x1={cx} y1={cy} x2={liftXY.x} y2={liftXY.y} stroke="#06b6d4" strokeWidth="1" opacity="0.5" />

                {/* Gamma Trace (Midtone Tint) */}
                <circle cx={gammaXY.x} cy={gammaXY.y} r="12" fill="#f59e0b" opacity="0.4" />
                <circle cx={gammaXY.x} cy={gammaXY.y} r="3" fill="#f59e0b" />
                <line x1={cx} y1={cy} x2={gammaXY.x} y2={gammaXY.y} stroke="#f59e0b" strokeWidth="1" opacity="0.5" />

                {/* Gain Trace (Highlight Tint) */}
                <circle cx={gainXY.x} cy={gainXY.y} r="14" fill="#f43f5e" opacity="0.4" />
                <circle cx={gainXY.x} cy={gainXY.y} r="3" fill="#f43f5e" />
                <line x1={cx} y1={cy} x2={gainXY.x} y2={gainXY.y} stroke="#f43f5e" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              Trace: <span className="text-cyan-400">Lift (Shadow)</span> ·{' '}
              <span className="text-amber-400">Gamma (Mid)</span> ·{' '}
              <span className="text-rose-400">Gain (High)</span>
            </div>
          </div>
        )}

        {/* RGB PARADE */}
        {(activeScope === 'both' || activeScope === 'parade') && (
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>RGB Parade (IRE Luminance Scale)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Toe (0-20) · Mid (50) · Shoulder (90-100)
              </span>
            </div>

            <div className="h-[200px] w-full bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-between gap-2 relative">
              {/* Horizontal IRE Graticule Lines */}
              <div className="absolute inset-x-2 top-[10%] h-px bg-slate-800/80" title="100 IRE (Peak White)" />
              <div className="absolute inset-x-2 top-[20%] h-px bg-slate-800/60 stroke-dashed" title="90 IRE (Shoulder)" />
              <div className="absolute inset-x-2 top-[50%] h-px bg-slate-800/80" title="50 IRE (Midtones)" />
              <div className="absolute inset-x-2 bottom-[20%] h-px bg-slate-800/60" title="20 IRE (Shadows)" />
              <div className="absolute inset-x-2 bottom-[5%] h-px bg-slate-800/80" title="0 IRE (Black Point)" />

              {/* IRE Axis Labels */}
              <div className="absolute right-1 inset-y-1 flex flex-col justify-between text-[8px] font-mono text-slate-600 pointer-events-none">
                <span>100</span>
                <span>90</span>
                <span>50</span>
                <span>20</span>
                <span>0</span>
              </div>

              {/* RED CHANNEL */}
              <div className="flex-1 h-full rounded bg-red-950/20 border border-red-900/30 flex flex-col justify-end p-1 relative overflow-hidden">
                <span className="text-[9px] font-mono font-bold text-red-400 absolute top-1 left-1">
                  RED
                </span>
                {/* Waveform trace bar representation */}
                <div
                  className="w-full bg-gradient-to-t from-red-600/20 via-red-500/50 to-red-400/80 rounded transition-all duration-150"
                  style={{
                    height: `${Math.min(98, redParade.white)}%`,
                    opacity: 0.85,
                  }}
                />
                <div
                  className="absolute bottom-0 inset-x-0 bg-red-500/70 h-1"
                  style={{ bottom: `${redParade.black}%` }}
                />
              </div>

              {/* GREEN CHANNEL */}
              <div className="flex-1 h-full rounded bg-emerald-950/20 border border-emerald-900/30 flex flex-col justify-end p-1 relative overflow-hidden">
                <span className="text-[9px] font-mono font-bold text-emerald-400 absolute top-1 left-1">
                  GREEN
                </span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-600/20 via-emerald-500/50 to-emerald-400/80 rounded transition-all duration-150"
                  style={{
                    height: `${Math.min(98, greenParade.white)}%`,
                    opacity: 0.85,
                  }}
                />
                <div
                  className="absolute bottom-0 inset-x-0 bg-emerald-500/70 h-1"
                  style={{ bottom: `${greenParade.black}%` }}
                />
              </div>

              {/* BLUE CHANNEL */}
              <div className="flex-1 h-full rounded bg-blue-950/20 border border-blue-900/30 flex flex-col justify-end p-1 relative overflow-hidden">
                <span className="text-[9px] font-mono font-bold text-blue-400 absolute top-1 left-1">
                  BLUE
                </span>
                <div
                  className="w-full bg-gradient-to-t from-blue-600/20 via-blue-500/50 to-blue-400/80 rounded transition-all duration-150"
                  style={{
                    height: `${Math.min(98, blueParade.white)}%`,
                    opacity: 0.85,
                  }}
                />
                <div
                  className="absolute bottom-0 inset-x-0 bg-blue-500/70 h-1"
                  style={{ bottom: `${blueParade.black}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>Channel Balance:</span>
              <span className="text-white">
                R: {Math.round(redParade.white)} | G: {Math.round(greenParade.white)} | B:{' '}
                {Math.round(blueParade.white)} IRE
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
