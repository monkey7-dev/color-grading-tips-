/**
 * Interactive 3-Way Color Wheels Component (Lift, Gamma, Gain, Offset)
 * Emulating DaVinci Resolve color grading controls with polar color discs,
 * master luminance wheels, and Planckian Kelvin/Tint controls.
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ColorWheelVal, polarToRgbOffset, rgbOffsetToPolar } from '../utils/cinematographyGradingMath';
import { Sliders, RotateCcw, ShieldCheck, Thermometer, Sparkles } from 'lucide-react';

interface ThreeWayColorWheelsProps {
  lift: ColorWheelVal;
  gamma: ColorWheelVal;
  gain: ColorWheelVal;
  offsetLum: number;
  kelvin: number;
  tint: number;
  contrast: number;
  saturation: number;
  skinToneProtection: boolean;
  onUpdateLift: (val: ColorWheelVal) => void;
  onUpdateGamma: (val: ColorWheelVal) => void;
  onUpdateGain: (val: ColorWheelVal) => void;
  onUpdateOffsetLum: (val: number) => void;
  onUpdateKelvin: (val: number) => void;
  onUpdateTint: (val: number) => void;
  onUpdateContrast: (val: number) => void;
  onUpdateSaturation: (val: number) => void;
  onToggleSkinToneProtection: () => void;
  onResetAll: () => void;
}

export const ThreeWayColorWheels: React.FC<ThreeWayColorWheelsProps> = ({
  lift,
  gamma,
  gain,
  offsetLum,
  kelvin,
  tint,
  contrast,
  saturation,
  skinToneProtection,
  onUpdateLift,
  onUpdateGamma,
  onUpdateGain,
  onUpdateOffsetLum,
  onUpdateKelvin,
  onUpdateTint,
  onUpdateContrast,
  onUpdateSaturation,
  onToggleSkinToneProtection,
  onResetAll,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 space-y-6 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm md:text-base font-bold text-white tracking-wide">
            DaVinci Resolve Primary 3-Way Color Wheels
          </h4>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Lift (Shadows) · Gamma (Midtones) · Gain (Highlights)
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Skin Tone I-Line Qualifier Protection */}
          <button
            onClick={onToggleSkinToneProtection}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              skinToneProtection
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Locks 135° I-Line skin tone vector so heavy shadow/highlight grades do not discolor actors' faces"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${skinToneProtection ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Skin Line Protection: {skinToneProtection ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onResetAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Reset wheels, temperature, and contrast to neutral"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3-Way Wheels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LIFT (Shadows) */}
        <SingleColorWheel
          title="LIFT (Shadows)"
          subtitle="Toe roll-off (0 – 25 IRE)"
          value={lift}
          accentColor="text-cyan-400"
          accentBorder="border-cyan-500/50"
          puckColor="#06b6d4"
          onChange={onUpdateLift}
          onReset={() => onUpdateLift({ r: 0, g: 0, b: 0, lum: 0 })}
        />

        {/* GAMMA (Midtones) */}
        <SingleColorWheel
          title="GAMMA (Midtones)"
          subtitle="Contrast pivot & exposure (25 – 75 IRE)"
          value={gamma}
          accentColor="text-amber-400"
          accentBorder="border-amber-500/50"
          puckColor="#f59e0b"
          onChange={onUpdateGamma}
          onReset={() => onUpdateGamma({ r: 0, g: 0, b: 0, lum: 0 })}
        />

        {/* GAIN (Highlights) */}
        <SingleColorWheel
          title="GAIN (Highlights)"
          subtitle="Shoulder & white point (75 – 100 IRE)"
          value={gain}
          accentColor="text-rose-400"
          accentBorder="border-rose-500/50"
          puckColor="#f43f5e"
          onChange={onUpdateGain}
          onReset={() => onUpdateGain({ r: 0, g: 0, b: 0, lum: 0 })}
        />
      </div>

      {/* Secondary Cinema Controls Strip: Kelvin, Tint, Contrast, Saturation, Offset */}
      <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Kelvin White Balance */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temp (Kelvin)</span>
            </span>
            <span className="font-mono text-cyan-400 text-[11px] font-bold">{kelvin}K</span>
          </div>
          <input
            type="range"
            min="2200"
            max="9500"
            step="100"
            value={kelvin}
            onChange={e => onUpdateKelvin(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{
              background:
                'linear-gradient(to right, #ff7b00 0%, #ffb449 25%, #ffffff 50%, #99ccff 75%, #4d94ff 100%)',
            }}
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>2200K (Candle)</span>
            <span>5600K</span>
            <span>9500K (Sky)</span>
          </div>
        </div>

        {/* 2. Tint (+/- Green/Magenta) */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tint (Duv)</span>
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-300">
              {tint > 0 ? `+${tint} Mag` : tint < 0 ? `${tint} Grn` : '0 Neutral'}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={tint}
            onChange={e => onUpdateTint(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #10b981 0%, #64748b 50%, #ec4899 100%)',
            }}
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>-50 (Minus Duv)</span>
            <span>0</span>
            <span>+50 (Plus Duv)</span>
          </div>
        </div>

        {/* 3. Contrast Curve S-Pivot */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Film Contrast S-Curve</span>
            <span className="font-mono text-amber-400 text-[11px] font-bold">{contrast.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.7"
            step="0.05"
            value={contrast}
            onChange={e => onUpdateContrast(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>0.7 (Flat Log)</span>
            <span>1.0 (Neutral)</span>
            <span>1.7 (Deep Noir)</span>
          </div>
        </div>

        {/* 4. Saturation */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Chroma Saturation</span>
            <span className="font-mono text-cyan-400 text-[11px] font-bold">
              {Math.round(saturation * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.05"
            value={saturation}
            onChange={e => onUpdateSaturation(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>0% (Monochrome)</span>
            <span>100%</span>
            <span>200% (Vibrant)</span>
          </div>
        </div>

        {/* 5. Master Offset Exposure */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Master Offset Exposure</span>
            <span className="font-mono text-rose-400 text-[11px] font-bold">
              {offsetLum > 0 ? `+${offsetLum}` : offsetLum}
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={offsetLum}
            onChange={e => onUpdateOffsetLum(Number(e.target.value))}
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>-30 (Darken)</span>
            <span>0</span>
            <span>+30 (Brighten)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SingleColorWheelProps {
  title: string;
  subtitle: string;
  value: ColorWheelVal;
  accentColor: string;
  accentBorder: string;
  puckColor: string;
  onChange: (val: ColorWheelVal) => void;
  onReset: () => void;
}

const SingleColorWheel: React.FC<SingleColorWheelProps> = ({
  title,
  subtitle,
  value,
  accentColor,
  accentBorder,
  puckColor,
  onChange,
  onReset,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Compute puck position from RGB offset
  const polar = rgbOffsetToPolar(value.r, value.g, value.b);
  const radiusPx = 48; // half of 96px wheel
  const rad = (polar.angleDeg * Math.PI) / 180;
  const puckX = radiusPx + polar.magnitude * radiusPx * Math.cos(rad);
  const puckY = radiusPx - polar.magnitude * radiusPx * Math.sin(rad);

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!wheelRef.current) return;
      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = -(clientY - centerY); // Invert Y so up is positive

      const dist = Math.hypot(dx, dy);
      const mag = Math.min(1.0, dist / (rect.width / 2));
      let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (deg < 0) deg += 360;

      const offset = polarToRgbOffset(deg, mag * 0.8);
      onChange({
        r: Number(offset.r.toFixed(3)),
        g: Number(offset.g.toFixed(3)),
        b: Number(offset.b.toFixed(3)),
        lum: value.lum,
      });
    },
    [value.lum, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handlePointer(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handlePointer(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handlePointer]);

  return (
    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4 text-center flex flex-col justify-between">
      {/* Title & Reset */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <span className={`text-xs font-bold uppercase tracking-wider ${accentColor}`}>
            {title}
          </span>
          <p className="text-[10px] text-slate-500">{subtitle}</p>
        </div>
        <button
          onClick={onReset}
          className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset wheel balance"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Circular Color Wheel Dial */}
      <div className="relative mx-auto my-1 flex items-center justify-center">
        <div
          ref={wheelRef}
          onMouseDown={handleMouseDown}
          className={`relative w-24 h-24 rounded-full cursor-crosshair shadow-inner border border-slate-700 overflow-hidden select-none touch-none ${accentBorder}`}
          style={{
            background:
              'radial-gradient(circle closest-side, #ffffff 0%, transparent 80%), conic-gradient(from 90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          }}
        >
          {/* Subtle center deadband target */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 rounded-full border border-slate-600/60" />
            <div className="w-px h-full bg-slate-700/40 absolute" />
            <div className="h-px w-full bg-slate-700/40 absolute" />
          </div>

          {/* Interactive Puck */}
          <div
            className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full border-2 border-white shadow-md pointer-events-none transition-transform duration-75"
            style={{
              left: `${puckX}px`,
              top: `${puckY}px`,
              backgroundColor: puckColor,
            }}
          />
        </div>
      </div>

      {/* Coordinate & Vector readout */}
      <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded-lg border border-slate-850">
        <div>
          R: <span className="text-rose-400 font-bold">{value.r >= 0 ? `+${value.r}` : value.r}</span>
        </div>
        <div>
          G: <span className="text-emerald-400 font-bold">{value.g >= 0 ? `+${value.g}` : value.g}</span>
        </div>
        <div>
          B: <span className="text-cyan-400 font-bold">{value.b >= 0 ? `+${value.b}` : value.b}</span>
        </div>
      </div>

      {/* Master Luminance Slider (-50 to +50 IRE) */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono text-slate-300">
          <span className="text-[11px] text-slate-400">Master Lum:</span>
          <span className={accentColor}>{value.lum > 0 ? `+${value.lum}` : value.lum} IRE</span>
        </div>
        <input
          type="range"
          min="-40"
          max="40"
          value={value.lum}
          onChange={e => onChange({ ...value, lum: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};
