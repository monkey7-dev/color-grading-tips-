import React, { useState, useEffect, useRef } from 'react';
import {
  EmotionDepthProfile,
  getEmotionDepthProfile,
  DEPTH_PRESETS,
  DepthPreset,
} from '../utils/colorDepthMath';
import { hexToRgb, rgbToHsl } from '../utils/colorMath';
import { EmotionTraitItem } from '../data/psychologyData';
import {
  Sliders,
  Sparkles,
  Zap,
  Copy,
  Check,
  Compass,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ColorDepthExplorerProps {
  selectedItem: EmotionTraitItem;
  onLoadIntoWheel: (hex: string) => void;
}

export const ColorDepthExplorer: React.FC<ColorDepthExplorerProps> = ({
  selectedItem,
  onLoadIntoWheel,
}) => {
  // Extract initial base hue from the selected emotion's primary color
  const initialRgb = hexToRgb(selectedItem.primaryColor) || { r: 250, g: 204, b: 21 };
  const initialHsl = rgbToHsl(initialRgb.r, initialRgb.g, initialRgb.b);

  const [baseHue, setBaseHue] = useState<number>(initialHsl.h);
  const [saturation, setSaturation] = useState<number>(75);
  const [luminance, setLuminance] = useState<number>(55);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // When selectedItem changes from outside, sync baseHue
  useEffect(() => {
    const rgb = hexToRgb(selectedItem.primaryColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setBaseHue(hsl.h);
    }
  }, [selectedItem.id, selectedItem.primaryColor]);

  // Compute live emotional depth profile
  const profile: EmotionDepthProfile = getEmotionDepthProfile(
    selectedItem.id,
    selectedItem.name,
    baseHue,
    saturation,
    luminance
  );

  // Render the 2D Saturation x Luminance continuous manifold canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Fast HSL to RGB helper for canvas pixel rendering
    for (let py = 0; py < height; py++) {
      // Y axis: Luminance from 100% (top) to 0% (bottom)
      const l = 1 - py / height;
      for (let px = 0; px < width; px++) {
        // X axis: Saturation from 0% (left) to 100% (right)
        const s = px / width;

        // Convert HSL (0-1) to RGB (0-255)
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const hNorm = baseHue / 360;

        const hueToRgb = (t: number) => {
          let tc = t;
          if (tc < 0) tc += 1;
          if (tc > 1) tc -= 1;
          if (tc < 1 / 6) return p + (q - p) * 6 * tc;
          if (tc < 1 / 2) return q;
          if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
          return p;
        };

        const r = Math.round(hueToRgb(hNorm + 1 / 3) * 255);
        const g = Math.round(hueToRgb(hNorm) * 255);
        const b = Math.round(hueToRgb(hNorm - 1 / 3) * 255);

        const index = (py * width + px) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [baseHue]);

  // Handle click/drag on 2D manifold
  const handleCanvasInteraction = (
    e: React.MouseEvent<HTMLCanvasElement> | MouseEvent
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const l = Math.round((1 - y / rect.height) * 100);

    setSaturation(s);
    setLuminance(l);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    handleCanvasInteraction(e);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current) {
        handleCanvasInteraction(moveEvent);
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const applyPreset = (preset: DepthPreset) => {
    setSaturation(preset.s);
    setLuminance(preset.l);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Tone label badge styling
  const toneLabel =
    profile.toneType === 'abyssal_dark'
      ? 'Abyssal Dark'
      : profile.toneType === 'ethereal_light'
      ? 'Ethereal Tint'
      : profile.toneType === 'pure'
      ? 'Pure Vivid Chroma'
      : profile.toneType === 'tint'
      ? 'High-Luminance Tint'
      : profile.toneType === 'shade'
      ? 'Low-Luminance Shade'
      : 'Neutral Tone';

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow matching the active color */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: profile.hex }}
      />

      {/* Explorer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Sliders className="w-4 h-4" />
            <span>Interactive Color Depth &amp; Emotional Intensity Explorer</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <span>{selectedItem.name} Continuum:</span>
            <span className="text-amber-400 font-serif italic text-lg md:text-xl">
              "{profile.title}"
            </span>
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
            A single base hue ({baseHue}°) encompasses{' '}
            <span className="font-semibold text-slate-200">10,201 discrete 8-bit shades, tints, and tones</span>.
            Slide luminance and saturation to explore how emotional meaning transforms from fragile wistfulness to radiant ecstasy.
          </p>
        </div>

        {/* Emotion Base Hue Indicator */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
          <div
            className="w-8 h-8 rounded-lg shadow-inner ring-1 ring-white/10 shrink-0"
            style={{ backgroundColor: profile.hex }}
          />
          <div className="text-xs">
            <div className="font-mono font-bold text-white">{profile.hex}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              H:{baseHue}° S:{saturation}% L:{luminance}%
            </div>
          </div>
        </div>
      </div>

      {/* Archetype Quick-Select Inflection Points */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Emotional Inflection Archetypes:
          </span>
          <span className="text-[11px] text-slate-500">
            Click to snap coordinates
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {DEPTH_PRESETS.map(preset => {
            const isCurrent =
              Math.abs(saturation - preset.s) < 8 && Math.abs(luminance - preset.l) < 8;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-800 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-xs font-semibold text-white truncate">
                  {preset.label}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.tagline}
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-1">
                  S:{preset.s}% · L:{preset.l}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Explorer: 2D Manifold Canvas & Sliders / Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive 2D Chromatic Map */}
        <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800/90 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              2D Tone / Shade / Tint Manifold
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              X=Sat · Y=Lum
            </span>
          </div>

          {/* Interactive Canvas Surface with Reticle */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-700/80 cursor-crosshair group select-none">
            <canvas
              ref={canvasRef}
              width={240}
              height={180}
              onMouseDown={handleMouseDown}
              className="w-full h-full object-cover"
            />
            {/* Interactive Reticle Target */}
            <div
              className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-lg pointer-events-none transition-transform group-active:scale-125"
              style={{
                left: `${saturation}%`,
                top: `${100 - luminance}%`,
                backgroundColor: profile.hex,
                boxShadow: '0 0 8px rgba(0,0,0,0.8), 0 0 4px white',
              }}
            />
            {/* Quadrant Legend Labels */}
            <div className="absolute top-1.5 left-2 text-[9px] font-semibold text-white/70 bg-black/40 px-1 rounded pointer-events-none">
              High Tints (+White)
            </div>
            <div className="absolute top-1.5 right-2 text-[9px] font-semibold text-white/70 bg-black/40 px-1 rounded pointer-events-none">
              Vivid Peaks
            </div>
            <div className="absolute bottom-1.5 left-2 text-[9px] font-semibold text-white/70 bg-black/40 px-1 rounded pointer-events-none">
              Muted Ash Tones
            </div>
            <div className="absolute bottom-1.5 right-2 text-[9px] font-semibold text-white/70 bg-black/40 px-1 rounded pointer-events-none">
              Abyssal Shades (+Black)
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Drag crosshair anywhere across the plane</span>
            <span className="text-amber-400 font-mono font-medium">{profile.hex}</span>
          </div>
        </div>

        {/* Right Column: Precise Sliders & Psychological Profile */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Sliders Container */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Luminance Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Luminance (Shade vs. Tint):
                </span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {luminance}%{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    ({luminance < 35 ? 'Deep Shade' : luminance > 65 ? 'Bright Tint' : 'Midtone'})
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={luminance}
                onChange={e => setLuminance(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000000 0%, hsl(${baseHue}, ${saturation}%, 50%) 50%, #ffffff 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% Pitch Black</span>
                <span>50% Optical Mid</span>
                <span>100% Pure White</span>
              </div>
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Saturation (Muted Tone vs. Vivid Chroma):
                </span>
                <span className="font-mono text-rose-400 font-semibold">
                  {saturation}%{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    ({saturation < 30 ? 'Achromatic Tone' : saturation > 75 ? 'Pure Chroma' : 'Moderate Saturation'})
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={e => setSaturation(Number(e.target.value))}
                className="w-full accent-rose-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${baseHue}, 0%, ${luminance}%), hsl(${baseHue}, 100%, ${luminance}%))`,
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% Slate Gray Tone</span>
                <span>50% Balanced Tone</span>
                <span>100% Saturated Peak</span>
              </div>
            </div>
          </div>

          {/* Dynamic Psychological Analysis Card */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {toneLabel}
                </span>
                <span className="text-xs font-semibold text-white">
                  Intensity: <span className="text-amber-400">{profile.intensityLevel}</span>
                </span>
              </div>

              {/* Intensity Gauge Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  Arousal: {profile.intensityScore}/100
                </span>
                <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${profile.intensityScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Psychological Nuance: </strong>
              {profile.psychologicalDescription}
            </p>

            {/* Cinematography Application */}
            <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Cinematography &amp; Grading: </strong>
                {profile.cinematicApplication}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 gap-3">
              <button
                onClick={() => copyToClipboard(profile.hex)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
              >
                {copiedHex === profile.hex ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Hex ({profile.hex})</span>
              </button>

              <button
                onClick={() => onLoadIntoWheel(profile.hex)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Load This Shade Into Harmonies</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
