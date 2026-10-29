import React, { useState, useMemo } from 'react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  calculateRelativeLuminance,
} from '../utils/colorMath';
import { COLOR_PSYCHOLOGY_SPECTRUM } from '../data/psychologyData';
import {
  Sliders,
  Copy,
  Check,
  Sparkles,
  Camera,
  Layers,
  Compass,
  Eye,
  Info,
  Download,
} from 'lucide-react';
import {
  generateCubeLut,
  generateLightroomXmp,
  generateAseBuffer,
  downloadFile,
  ColorRecipe,
} from '../utils/exporters';

interface InteractiveColorMixerProps {
  initialHex?: string;
  onSendToHarmonies?: (hex: string) => void;
  onSendToCinematography?: (hex: string) => void;
}

export const InteractiveColorMixer: React.FC<InteractiveColorMixerProps> = ({
  initialHex = '#f59e0b',
  onSendToHarmonies,
  onSendToCinematography,
}) => {
  const [hex, setHex] = useState<string>(initialHex);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Sync color representation across formats
  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const luminance = useMemo(() => calculateRelativeLuminance(rgb), [rgb]);

  // Handle individual RGB channel updates
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(value)));
    const newRgb = { ...rgb, [channel]: clamped };
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // Handle individual HSL channel updates
  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    let clamped = value;
    if (channel === 'h') clamped = ((value % 360) + 360) % 360;
    else clamped = Math.max(0, Math.min(100, value));

    const newHsl = { ...hsl, [channel]: clamped };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // Handle manual Hex typing
  const handleHexInput = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;
    setHex(clean);
  };

  // Copy formatting
  const handleCopy = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Find nearest psychological spectrum profile based on Hue angle and Saturation
  const matchedSpectrum = useMemo(() => {
    if (hsl.s < 14) {
      if (hsl.l < 25) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'black') || COLOR_PSYCHOLOGY_SPECTRUM[0];
      if (hsl.l > 80) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'white') || COLOR_PSYCHOLOGY_SPECTRUM[0];
      return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'gray') || COLOR_PSYCHOLOGY_SPECTRUM[0];
    }

    const h = hsl.h;
    if (h >= 345 || h < 15) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'red');
    if (h >= 15 && h < 45) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'orange');
    if (h >= 45 && h < 70) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'yellow');
    if (h >= 70 && h < 165) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'green');
    if (h >= 165 && h < 195) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'cyan');
    if (h >= 195 && h < 255) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'blue');
    if (h >= 255 && h < 290) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'violet');
    if (h >= 290 && h < 345) return COLOR_PSYCHOLOGY_SPECTRUM.find(s => s.id === 'magenta');
    return COLOR_PSYCHOLOGY_SPECTRUM[0];
  }, [hsl]);

  const textColor = luminance > 0.45 ? '#090d16' : '#ffffff';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>Multi-Format Color Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Hex · RGB · HSL</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-0.5">Interactive Color Mixer</h3>
        </div>

        {/* Quick Format Copy Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleCopy('hex', hex)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-750 text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors"
          >
            {copiedFormat === 'hex' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span>{hex}</span>
          </button>
          <button
            onClick={() => handleCopy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-750 text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors"
          >
            {copiedFormat === 'rgb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span>RGB({rgb.r},{rgb.g},{rgb.b})</span>
          </button>
          <button
            onClick={() => handleCopy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-750 text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors"
          >
            {copiedFormat === 'hsl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span>HSL({hsl.h}°,{hsl.s}%,{hsl.l}%)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls Left, Visual Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders for RGB & HSL */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hex Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Hexadecimal Color</span>
              <span className="font-mono text-slate-400 text-[11px]">#RRGGBB</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hex}
                onChange={e => handleHexInput(e.target.value)}
                maxLength={7}
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 uppercase"
              />
              <input
                type="color"
                value={hex.length === 7 ? hex : '#f59e0b'}
                onChange={e => setHex(e.target.value)}
                className="w-12 h-11 rounded-xl bg-transparent border border-slate-700 cursor-pointer shrink-0"
              />
            </div>
          </div>

          {/* RGB Sliders */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>RGB Channel Sliders (0 – 255)</span>
              <span className="text-[10px] text-slate-500 font-mono">Additive Primaries</span>
            </span>

            {/* Red */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold">Red (R)</span>
                <span className="text-slate-200">{rgb.r}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.r}
                onChange={e => handleRgbChange('r', Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Green */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">Green (G)</span>
                <span className="text-slate-200">{rgb.g}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.g}
                onChange={e => handleRgbChange('g', Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Blue */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">Blue (B)</span>
                <span className="text-slate-200">{rgb.b}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.b}
                onChange={e => handleRgbChange('b', Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>HSL Color Model (Hue · Sat · Lightness)</span>
              <span className="text-[10px] text-slate-500 font-mono">Cylindrical Coordinates</span>
            </span>

            {/* Hue */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">Hue (H)</span>
                <span className="text-slate-200">{hsl.h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={e => handleHslChange('h', Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                }}
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold">Saturation (S)</span>
                <span className="text-slate-200">{hsl.s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={e => handleHslChange('s', Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Lightness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-400 font-bold">Lightness (L)</span>
                <span className="text-slate-200">{hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={e => handleHslChange('l', Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-sky-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Swatch Card & Dynamic Psychology / Cinematography Analysis */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Swatch Display */}
          <div
            className="w-full h-44 rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition-all border border-white/20 relative overflow-hidden"
            style={{ backgroundColor: hex }}
          >
            <div className="flex items-center justify-between" style={{ color: textColor }}>
              <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                Active Swatch
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/20 backdrop-blur-sm">
                Lum {(luminance * 100).toFixed(1)} IRE
              </span>
            </div>

            <div style={{ color: textColor }}>
              <div className="text-2xl font-black font-mono tracking-tight">{hex}</div>
              <div className="text-xs font-medium opacity-90">
                RGB({rgb.r}, {rgb.g}, {rgb.b}) · HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)
              </div>
            </div>
          </div>

          {/* Dynamic Psychology Impact Card */}
          {matchedSpectrum && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Psychological Impact: {matchedSpectrum.name} Family</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  ~{matchedSpectrum.wavelengthNm || 'Achromatic'}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <div>
                  <strong className="text-emerald-400">Emotional Valence:</strong>{' '}
                  <span>{matchedSpectrum.positiveAssociations}</span>
                </div>
                <div>
                  <strong className="text-rose-400">Unconscious Shadow:</strong>{' '}
                  <span>{matchedSpectrum.negativeAssociations}</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Cinematography & Grading Uses Card */}
          {matchedSpectrum && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cinematography &amp; Grading Application</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {matchedSpectrum.warmth}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {matchedSpectrum.gradingTips}
              </p>

              <div className="pt-2 border-t border-slate-850/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Ideal Cinema Genres: <span className="text-slate-200">{matchedSpectrum.filmGenres}</span>
                </span>
              </div>
            </div>
          )}

          {/* Direct Preset Downloadable Options */}
          <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Color Preset</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">DaVinci · Lightroom · Adobe</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  const recipe: ColorRecipe = {
                    id: `mix_${hex.replace('#', '')}`,
                    name: `Custom_${matchedSpectrum ? matchedSpectrum.name : 'Color'}_${hex.replace('#', '')}`,
                    category: 'Interactive Mix',
                    harmonyType: 'Custom Synthesizer',
                    swatches: [
                      { name: 'Mixed Tone', hex },
                      { name: 'Complementary', hex: rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b) },
                    ],
                    createdAt: new Date().toISOString(),
                  };
                  const cube = generateCubeLut(recipe);
                  downloadFile(new Blob([cube], { type: 'text/plain;charset=utf-8' }), `${recipe.name}.cube`);
                }}
                className="py-1.5 px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-[11px] font-semibold text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                title="Download 3D LUT (.CUBE) for DaVinci Resolve & Premiere"
              >
                <Download className="w-3 h-3" />
                <span>.CUBE LUT</span>
              </button>

              <button
                onClick={() => {
                  const recipe: ColorRecipe = {
                    id: `mix_${hex.replace('#', '')}`,
                    name: `Custom_${matchedSpectrum ? matchedSpectrum.name : 'Color'}_${hex.replace('#', '')}`,
                    category: 'Interactive Mix',
                    harmonyType: 'Custom Synthesizer',
                    swatches: [
                      { name: 'Mixed Tone', hex },
                      { name: 'Complementary', hex: rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b) },
                    ],
                    createdAt: new Date().toISOString(),
                  };
                  const xmp = generateLightroomXmp(recipe);
                  downloadFile(new Blob([xmp], { type: 'application/rdf+xml;charset=utf-8' }), `${recipe.name}.xmp`);
                }}
                className="py-1.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-[11px] font-semibold text-amber-300 flex items-center justify-center gap-1 transition-colors"
                title="Download Adobe Lightroom Preset (.XMP)"
              >
                <Download className="w-3 h-3" />
                <span>.XMP Preset</span>
              </button>

              <button
                onClick={() => {
                  const swatches = [
                    { name: 'Key Mixed Tone', hex },
                    { name: 'High Split', hex: rgbToHex(Math.min(255, rgb.r + 30), Math.min(255, rgb.g + 30), Math.min(255, rgb.b + 30)) },
                    { name: 'Low Shadow', hex: rgbToHex(Math.max(0, rgb.r - 40), Math.max(0, rgb.g - 40), Math.max(0, rgb.b - 40)) },
                  ];
                  const ase = generateAseBuffer(`Mix_${hex.replace('#', '')}`, swatches);
                  downloadFile(new Blob([ase.buffer as ArrayBuffer], { type: 'application/octet-stream' }), `Mix_${hex.replace('#', '')}.ase`);
                }}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1 transition-colors"
                title="Download Adobe Swatch Exchange (.ASE) for Photoshop & Illustrator"
              >
                <Download className="w-3 h-3 text-slate-400" />
                <span>.ASE Swatch</span>
              </button>
            </div>
          </div>

          {/* Action Route Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {onSendToHarmonies && (
              <button
                onClick={() => onSendToHarmonies(hex)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Load in Harmonies</span>
              </button>
            )}

            {onSendToCinematography && (
              <button
                onClick={() => onSendToCinematography(hex)}
                className="flex-1 py-2 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Grade in Cinema Studio</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
