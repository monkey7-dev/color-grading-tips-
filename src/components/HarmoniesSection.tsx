import React, { useState, useRef, useMemo } from 'react';
import {
  HarmonyType,
  getHarmonyHues,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  hexToRgb,
} from '../utils/colorMath';
import { HARMONIES_CATALOG, HarmonyInfo } from '../data/harmoniesData';
import {
  generateAseBuffer,
  generateCubeLut,
  generateLightroomXmp,
  downloadFile,
  ColorRecipe,
} from '../utils/exporters';
import {
  Download,
  BookmarkPlus,
  Copy,
  Check,
  Clapperboard,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface HarmoniesSectionProps {
  currentBaseHue: number;
  setCurrentBaseHue: (hue: number) => void;
  onSaveRecipe: (recipe: ColorRecipe) => void;
}

export const HarmoniesSection: React.FC<HarmoniesSectionProps> = ({
  currentBaseHue,
  setCurrentBaseHue,
  onSaveRecipe,
}) => {
  const [selectedHarmonyType, setSelectedHarmonyType] = useState<HarmonyType>('complementary');
  const [saturation, setSaturation] = useState<number>(85);
  const [lightness, setLightness] = useState<number>(50);
  const [recipeName, setRecipeName] = useState<string>('Cinematic Harmony Grade');
  const [recipeCategory, setRecipeCategory] = useState<string>('Cinematic Grade');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const wheelSvgRef = useRef<SVGSVGElement>(null);

  const harmonyInfo: HarmonyInfo = HARMONIES_CATALOG[selectedHarmonyType];

  // Calculate swatch colors based on selected harmony and base hue
  const harmonyHues = useMemo(() => {
    return getHarmonyHues(currentBaseHue, selectedHarmonyType);
  }, [currentBaseHue, selectedHarmonyType]);

  const swatches = useMemo(() => {
    if (selectedHarmonyType === 'monochromatic') {
      const base = currentBaseHue;
      return [
        {
          name: 'Key Dominant (60%)',
          hex: rgbToHex(...Object.values(hslToRgb(base, saturation, lightness)) as [number, number, number]),
          role: '60% Dominant Base',
          percent: 60,
        },
        {
          name: 'Shadow Shade (30%)',
          hex: rgbToHex(...Object.values(hslToRgb(base, Math.max(20, saturation - 20), Math.max(15, lightness - 25))) as [number, number, number]),
          role: '30% Shadow Density',
          percent: 30,
        },
        {
          name: 'Specular Accent (10%)',
          hex: rgbToHex(...Object.values(hslToRgb(base, Math.min(100, saturation + 15), Math.min(88, lightness + 30))) as [number, number, number]),
          role: '10% Highlight Bloom',
          percent: 10,
        },
      ];
    }

    if (selectedHarmonyType === 'complementary') {
      const h0 = harmonyHues[0];
      const h1 = harmonyHues[1];
      return [
        {
          name: 'Key Hue (60%)',
          hex: rgbToHex(...Object.values(hslToRgb(h0, saturation, lightness)) as [number, number, number]),
          role: '60% Environment / Key',
          percent: 60,
        },
        {
          name: 'Complement (30%)',
          hex: rgbToHex(...Object.values(hslToRgb(h1, saturation, lightness)) as [number, number, number]),
          role: '30% Secondary Counterweight',
          percent: 30,
        },
        {
          name: 'Specular Accent (10%)',
          hex: rgbToHex(...Object.values(hslToRgb(h0, 100, Math.min(90, lightness + 25))) as [number, number, number]),
          role: '10% High-Chroma Peak',
          percent: 10,
        },
      ];
    }

    if (selectedHarmonyType === 'triadic') {
      return harmonyHues.map((h, i) => {
        const percent = i === 0 ? 60 : i === 1 ? 30 : 10;
        return {
          name: `Triad Point ${i + 1} (${percent}%)`,
          hex: rgbToHex(...Object.values(hslToRgb(h, saturation, lightness)) as [number, number, number]),
          role: i === 0 ? '60% Key Base' : i === 1 ? '30% Secondary' : '10% Accent',
          percent,
        };
      });
    }

    if (selectedHarmonyType === 'tetradic') {
      return harmonyHues.map((h, i) => {
        const percent = i === 0 ? 50 : i === 1 ? 25 : i === 2 ? 15 : 10;
        return {
          name: `Tetrad Quad ${i + 1} (${percent}%)`,
          hex: rgbToHex(...Object.values(hslToRgb(h, saturation, lightness)) as [number, number, number]),
          role: `${percent}% Chord Component`,
          percent,
        };
      });
    }

    // Analogous
    return harmonyHues.map((h, i) => {
      const percent = i === 1 ? 60 : i === 0 ? 30 : 10;
      return {
        name: i === 1 ? 'Analogous Center (60%)' : i === 0 ? 'Flank A (30%)' : 'Flank B (10%)',
        hex: rgbToHex(...Object.values(hslToRgb(h, saturation, lightness)) as [number, number, number]),
        role: `${percent}% Kinship Tone`,
        percent,
      };
    });
  }, [currentBaseHue, selectedHarmonyType, harmonyHues, saturation, lightness]);

  // Color wheel interaction
  const handleWheelPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!wheelSvgRef.current) return;
    const rect = wheelSvgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // 0° at top (12 o'clock)
    setCurrentBaseHue(Math.round(angle));
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    handleWheelPointer(e);
  };

  // Build recipe object
  const currentRecipe: ColorRecipe = {
    id: `recipe-${Date.now()}`,
    name: recipeName || `${harmonyInfo.title} Recipe`,
    category: recipeCategory || 'Cinematic Grade',
    harmonyType: selectedHarmonyType,
    swatches: swatches.map(s => ({ name: s.name, hex: s.hex })),
    description: harmonyInfo.emotionalEffect,
    createdAt: new Date().toISOString(),
  };

  // Export handlers
  const handleExportAse = () => {
    setIsExporting(true);
    const buffer = generateAseBuffer(currentRecipe.name, currentRecipe.swatches);
    const blob = new Blob([buffer as unknown as BlobPart], { type: 'application/octet-stream' });
    downloadFile(blob, `${currentRecipe.name.toLowerCase().replace(/\s+/g, '_')}.ase`);
    setTimeout(() => setIsExporting(false), 500);
  };

  const handleExportCube = () => {
    setIsExporting(true);
    const cubeContent = generateCubeLut(currentRecipe);
    const blob = new Blob([cubeContent], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, `${currentRecipe.name.toLowerCase().replace(/\s+/g, '_')}_3dlut.cube`);
    setTimeout(() => setIsExporting(false), 500);
  };

  const handleExportXmp = () => {
    setIsExporting(true);
    const xmpContent = generateLightroomXmp(currentRecipe);
    const blob = new Blob([xmpContent], { type: 'application/rdf+xml;charset=utf-8' });
    downloadFile(blob, `${currentRecipe.name.toLowerCase().replace(/\s+/g, '_')}_preset.xmp`);
    setTimeout(() => setIsExporting(false), 500);
  };

  const handleSaveToBook = () => {
    onSaveRecipe(currentRecipe);
    setCopiedType('saved');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedType(hex);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // SVG Geometry on Wheel
  const wheelRadius = 110;
  const wheelCenter = 135;

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <span>02</span>
          <span aria-hidden="true">·</span>
          <span>Color Theory &amp; Geometric Formulations</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Color Harmonies Engine &amp; Recipe Generator
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
          Interactive chromatic wheel simulator with real-time geometric chords, 60/30/10 scene
          distribution recipes, film case studies, and instant export to Adobe .ASE swatches,
          DaVinci Resolve 3D LUTs, and Lightroom .XMP presets.
        </p>
      </div>

      {/* Harmony Type Selector Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
        {(
          [
            'monochromatic',
            'complementary',
            'triadic',
            'tetradic',
            'analogous',
          ] as HarmonyType[]
        ).map(type => (
          <button
            key={type}
            onClick={() => setSelectedHarmonyType(type)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors capitalize ${
              selectedHarmonyType === type
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {HARMONIES_CATALOG[type].title.replace(' Harmony', '')}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Color Wheel & Harmony Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Embedded SVG Color Wheel & Controls */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white">Interactive Chromatic Wheel</span>
            <span className="text-xs font-mono text-cyan-400">
              Base Hue: {currentBaseHue}°
            </span>
          </div>

          {/* SVG Color Wheel */}
          <div className="flex justify-center select-none py-2">
            <svg
              ref={wheelSvgRef}
              width={wheelCenter * 2}
              height={wheelCenter * 2}
              className="cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={e => {
                if (e.buttons === 1) handleWheelPointer(e);
              }}
            >
              <defs>
                {/* 12 segment conical rainbow simulation using conic gradient in foreignObject */}
                <radialGradient id="wheelCenterFade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#090d16" stopOpacity="0.95" />
                  <stop offset="65%" stopColor="#090d16" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#090d16" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Conic Rainbow Ring */}
              <foreignObject
                x={wheelCenter - wheelRadius}
                y={wheelCenter - wheelRadius}
                width={wheelRadius * 2}
                height={wheelRadius * 2}
                className="rounded-full overflow-hidden"
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg at 50% 50%, 
                      #ff0000 0deg, 
                      #ff8800 30deg, 
                      #ffff00 60deg, 
                      #88ff00 90deg, 
                      #00ff00 120deg, 
                      #00ff88 150deg, 
                      #00ffff 180deg, 
                      #0088ff 210deg, 
                      #0000ff 240deg, 
                      #8800ff 270deg, 
                      #ff00ff 300deg, 
                      #ff0088 330deg, 
                      #ff0000 360deg)`,
                  }}
                />
              </foreignObject>

              {/* Radial inner overlay for saturation/lightness feel */}
              <circle
                cx={wheelCenter}
                cy={wheelCenter}
                r={wheelRadius}
                fill="url(#wheelCenterFade)"
                pointerEvents="none"
              />

              {/* Center Hub */}
              <circle
                cx={wheelCenter}
                cy={wheelCenter}
                r={wheelRadius * 0.45}
                fill="#090d16"
                stroke="#1e293b"
                strokeWidth="2"
                pointerEvents="none"
              />

              {/* Center Swatch Display */}
              <circle
                cx={wheelCenter}
                cy={wheelCenter}
                r={wheelRadius * 0.3}
                fill={swatches[0]?.hex || '#ff8800'}
                stroke="#ffffff"
                strokeWidth="1.5"
                pointerEvents="none"
              />

              {/* Harmony Geometry Chords / Lines */}
              {harmonyHues.length > 1 && (
                <polygon
                  points={harmonyHues
                    .map(h => {
                      const rad = ((h - 90) * Math.PI) / 180;
                      const x = wheelCenter + Math.cos(rad) * (wheelRadius - 12);
                      const y = wheelCenter + Math.sin(rad) * (wheelRadius - 12);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity={0.8}
                  pointerEvents="none"
                />
              )}

              {/* Markers for Harmony Hues */}
              {harmonyHues.map((h, idx) => {
                const rad = ((h - 90) * Math.PI) / 180;
                const markerR = wheelRadius - 12;
                const x = wheelCenter + Math.cos(rad) * markerR;
                const y = wheelCenter + Math.sin(rad) * markerR;
                const isBase = idx === 0;

                return (
                  <g key={idx} transform={`translate(${x}, ${y})`} pointerEvents="none">
                    <circle
                      r={isBase ? 9 : 7}
                      fill={isBase ? '#ffffff' : '#090d16'}
                      stroke={isBase ? '#090d16' : '#ffffff'}
                      strokeWidth="2"
                      className="shadow-lg"
                    />
                    <circle
                      r={isBase ? 4 : 3}
                      fill={isBase ? '#090d16' : '#ffffff'}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Sliders: Base Hue, Saturation, Lightness */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Hue Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Base Hue Angle</span>
                <span className="font-mono text-cyan-400">{currentBaseHue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={currentBaseHue}
                onChange={e => setCurrentBaseHue(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background:
                    'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                }}
              />
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Saturation</span>
                <span className="font-mono text-cyan-400">{saturation}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={saturation}
                onChange={e => setSaturation(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Lightness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Luminance / Lightness</span>
                <span className="font-mono text-cyan-400">{lightness}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                value={lightness}
                onChange={e => setLightness(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Definition, 60/30/10 Recipe & Live Cinematic Scene Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Harmony Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-7 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{harmonyInfo.title}</h3>
                <p className="text-xs text-slate-400">{harmonyInfo.tagline}</p>
              </div>
              <div className="text-xs bg-slate-800/80 text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-700/80 font-mono">
                Geometry: {harmonyInfo.geometryDescription.split('.')[0]}
              </div>
            </div>

            {/* Emotional Effect */}
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
              <div className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Emotional Effect &amp; Psychological Interaction</span>
              </div>
              <p>{harmonyInfo.emotionalEffect}</p>
            </div>

            {/* 60-30-10 Distribution Recipe Swatches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Practical Scene Recipe: Exact 60/30/10 Distribution
                </span>
                <span className="text-[11px] text-slate-400">Click swatch to copy hex</span>
              </div>

              {/* Color Bar */}
              <div className="h-6 rounded-lg overflow-hidden flex shadow-inner">
                {swatches.map((sw, i) => (
                  <div
                    key={i}
                    style={{ width: `${sw.percent}%`, backgroundColor: sw.hex }}
                    className="h-full transition-all duration-300 relative group cursor-pointer"
                    onClick={() => copyHex(sw.hex)}
                    title={`${sw.name}: ${sw.hex}`}
                  />
                ))}
              </div>

              {/* Swatch detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {swatches.map((sw, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sw.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{sw.percent}%</span>
                    </div>
                    <div
                      className="h-8 rounded-lg shadow-inner flex items-center justify-end pr-2"
                      style={{ backgroundColor: sw.hex }}
                    >
                      <button
                        onClick={() => copyHex(sw.hex)}
                        className="p-1 bg-black/50 hover:bg-black/75 rounded text-white transition-colors"
                        title="Copy hex code"
                      >
                        {copiedType === sw.hex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>{sw.hex}</span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[90px]">
                        {sw.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Rule of Thumb: {harmonyInfo.distributionRecipe.guide}
              </p>
            </div>

            {/* Live Cinematic Mockup Frame Preview */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-amber-400" />
                  <span>Cinematic Scene Rendering Simulator</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Aspect: 2.39:1 Anamorphic
                </span>
              </div>

              {/* Stylized Film Still Mockup using the actual dynamic palette */}
              <div
                className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl flex flex-col justify-between p-4"
                style={{
                  background: `linear-gradient(135deg, ${swatches[0]?.hex || '#0f172a'} 0%, ${
                    swatches[1]?.hex || '#1e293b'
                  } 75%, #05070c 100%)`,
                }}
              >
                {/* Cinematic Letterbox Mask Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

                {/* Simulated Subject Silhouette & Accent Flare */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-white/70">
                    Scene Simulation · 60% Key / 30% Fill / 10% Accent
                  </div>
                  <div
                    className="w-3 h-3 rounded-full blur-xs shadow-lg animate-pulse"
                    style={{ backgroundColor: swatches[swatches.length - 1]?.hex || '#ffffff' }}
                  />
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div className="space-y-1">
                    <div
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: swatches[swatches.length - 1]?.hex || '#f59e0b' }}
                    >
                      {currentRecipe.name}
                    </div>
                    <div className="text-[11px] text-slate-200/90 font-medium max-w-sm">
                      Atmospheric depth anchored by {swatches[0]?.name} with contrasting {swatches[1]?.name}.
                    </div>
                  </div>

                  {/* Dynamic Color Chips in the bottom corner */}
                  <div className="flex items-center gap-1.5 p-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                    {swatches.map((sw, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-md shadow"
                        style={{ backgroundColor: sw.hex }}
                        title={`${sw.name}: ${sw.hex}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Case Studies */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                Cinematic &amp; Photographic Case Studies
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {harmonyInfo.caseStudies.map((cs, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1"
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{cs.film}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({cs.year})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Dir: {cs.director} · DP: {cs.cinematographer}
                    </div>
                    <p className="text-[11px] text-slate-300/90 pt-1 leading-relaxed">
                      {cs.paletteNotes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Save & Export Controls Bar */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 pt-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <label htmlFor="recipeNameInput" className="text-xs font-semibold text-slate-300">
                    Recipe Name &amp; Category
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="recipeNameInput"
                      type="text"
                      value={recipeName}
                      onChange={e => setRecipeName(e.target.value)}
                      placeholder="e.g. Blade Runner Neon Teal"
                      className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 flex-1"
                    />
                    <select
                      value={recipeCategory}
                      onChange={e => setRecipeCategory(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Cinematic Grade">Cinematic Grade</option>
                      <option value="Sci-Fi / Cyberpunk">Sci-Fi / Cyberpunk</option>
                      <option value="Vintage / Analog Film">Vintage / Analog Film</option>
                      <option value="Moody Noir">Moody Noir</option>
                      <option value="High-Key Commercial">High-Key Commercial</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveToBook}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap self-end shadow-sm"
                >
                  {copiedType === 'saved' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recipe Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Save to Library</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Export Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Direct Exports:</span>
                <button
                  onClick={handleExportAse}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                  title="Export Adobe Swatch Exchange for Photoshop / Illustrator"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>.ASE Swatches</span>
                </button>

                <button
                  onClick={handleExportCube}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                  title="Export 3D Look-Up Table for DaVinci Resolve & Premiere Pro"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>.CUBE 3D LUT</span>
                </button>

                <button
                  onClick={handleExportXmp}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                  title="Export Lightroom Classic & ACR preset file"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>.XMP Preset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
