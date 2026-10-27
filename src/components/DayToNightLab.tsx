/**
 * Day-to-Night (Nuit Américaine) Color Grading Masterclass Lab
 * An interactive, professional simulator demonstrating the multi-node Hollywood
 * Day-for-Night conversion pipeline with live step-by-step breakdown,
 * Purkinje scotopic rod vision shifts, sky darkening masks, and skin tone protection.
 */

import React, { useState, useMemo } from 'react';
import {
  DayToNightSettings,
  DEFAULT_DAY_TO_NIGHT,
  computeDayToNightLayers,
} from '../utils/dayToNightMath';
import {
  Moon,
  Sun,
  Layers,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  Camera,
  Film,
} from 'lucide-react';

interface DayToNightLabProps {
  onApplyToWheels: (settings: {
    kelvin: number;
    tint: number;
    liftLum: number;
    liftRgb: { r: number; g: number; b: number };
    gammaLum: number;
    gammaRgb: { r: number; g: number; b: number };
    gainLum: number;
    gainRgb: { r: number; g: number; b: number };
    contrast: number;
    saturation: number;
    skinProtection: boolean;
  }) => void;
}

interface PipelineStep {
  step: number;
  title: string;
  shortDesc: string;
  nodeName: string;
  technicalAction: string;
  coloristSecret: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 0,
    title: 'Baseline Camera RAW',
    shortDesc: 'Unprocessed daytime sun',
    nodeName: 'Node 01: Input CST',
    technicalAction: 'Normal daylight exposure (5600K WB), high-key ambient, bright blue sky.',
    coloristSecret: 'Always begin by normalizing camera Log into DaVinci Wide Gamut so exposure changes behave with smooth optical linearity.',
  },
  {
    step: 1,
    title: 'Exposure Drop (-2.6 EV)',
    shortDesc: 'Crush daylight down to night',
    nodeName: 'Node 02: Exposure Offset',
    technicalAction: 'Drop Master Offset by -2.5 to -3 stops. Clamp peak highlight ceiling to 70 IRE.',
    coloristSecret: 'Never crush the deepest shadows to 0 IRE digital black; true night retains a soft ambient floor where shapes linger.',
  },
  {
    step: 2,
    title: 'Purkinje Scotopic Shift',
    shortDesc: 'Cold cyan-indigo rods',
    nodeName: 'Node 03: Primary Wheels Balance',
    technicalAction: 'Shift CCT to 8500K. In Lift, push cyan-blue (Hue 220°). Midtones lean toward cold steel.',
    coloristSecret: 'Human eyes at night rely on rod cells (500nm sensitivity) which perceive low light as blue-cyan. True black night looks flat; scotopic blue creates cinematic depth.',
  },
  {
    step: 3,
    title: 'Sky Darkening Mask',
    shortDesc: 'Eliminate bright daylight sky',
    nodeName: 'Node 04: Graduated Sky Power Window',
    technicalAction: 'Linear gradient window pulling sky luminance down by 75%, shifting blue to deep midnight ink.',
    coloristSecret: 'A bright daytime sky is the #1 tell of fake day-for-night. If shooting in daytime, frame out the horizon or darken the sky with a feather-80 gradient.',
  },
  {
    step: 4,
    title: 'Skin Warmth Recovery',
    shortDesc: 'Prevent zombie-blue faces',
    nodeName: 'Node 05: Parallel Node (Skin Qualifier)',
    technicalAction: 'Isolate human skin tones on 135° I-Line. Retain 70% organic blood hemoglobin warmth.',
    coloristSecret: 'Never turn actors completely blue! In great cinema (e.g. Mad Max: Fury Road night scenes), faces retain warm copper and peach tones while backgrounds plunge into cyan.',
  },
  {
    step: 5,
    title: 'Warm Practical Illumination',
    shortDesc: 'Tungsten opponent contrast',
    nodeName: 'Node 06: Practicals & Glow',
    technicalAction: 'Windows, vehicle lamps, and lanterns boosted with warm 2400K tungsten amber (#f59e0b).',
    coloristSecret: 'Hollywood cinematographers turn practical lights and car headlights ON during daytime shoots so that when exposure is pulled down, they naturally ignite with warmth.',
  },
];

export const DayToNightLab: React.FC<DayToNightLabProps> = ({ onApplyToWheels }) => {
  // Current pipeline progression step (0 to 5)
  const [activeStep, setActiveStep] = useState<number>(5);

  // Split view before / after slider (0 to 100%)
  const [splitSlider, setSplitSlider] = useState<number>(50);

  // Interactive parameter sliders
  const [settings, setSettings] = useState<DayToNightSettings>(DEFAULT_DAY_TO_NIGHT);

  // Compute live SVG layer colors
  const layers = useMemo(() => {
    return computeDayToNightLayers(settings, activeStep);
  }, [settings, activeStep]);

  const currentStepInfo = PIPELINE_STEPS[activeStep];

  const handleApplyToWheels = () => {
    onApplyToWheels({
      kelvin: settings.moonlightKelvin,
      tint: -8,
      liftLum: 4,
      liftRgb: { r: -0.22, g: 0.02, b: 0.35 },
      gammaLum: -6,
      gammaRgb: { r: -0.16, g: -0.02, b: 0.24 },
      gainLum: -8,
      gainRgb: { r: -0.12, g: 0.04, b: 0.28 },
      contrast: 1.25,
      saturation: settings.scotopicDesaturation,
      skinProtection: settings.skinWarmthRetention > 0.5,
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Moon className="w-4 h-4" />
            <span>Hollywood Technique · Nuit Américaine</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
            Day-to-Night (Day-for-Night) Color Grading Studio
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
            How Hollywood transforms broad daylight footage into convincing, high-budget cinematic night.
            Explore the 5-node pipeline: exposure pull-down, Purkinje scotopic blue shift, sky darkening,
            skin tone protection, and tungsten practical contrast.
          </p>
        </div>

        <button
          onClick={handleApplyToWheels}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Day-to-Night into 3-Way Wheels</span>
        </button>
      </div>

      {/* 6-Step Pipeline Progression Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Step-by-Step Hollywood Node Pipeline (Click each step to watch the transformation):</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PIPELINE_STEPS.map(s => {
            const isCurrent = s.step === activeStep;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1 ${
                  isCurrent
                    ? 'bg-slate-800 border-cyan-500/80 shadow-lg ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300">
                    Step 0{s.step}
                  </span>
                  {s.step <= activeStep && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </div>
                <div className="font-bold text-xs text-white truncate">{s.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{s.shortDesc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Day-for-Night Split Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Day vs. Night Split Comparison (Drag to compare):</span>
          </span>
          <span className="font-mono text-cyan-300 text-[11px]">
            Split: {splitSlider}% | {activeStep === 0 ? 'Daylight RAW' : activeStep === 5 ? 'Master Cinema Night' : `Step ${activeStep} Applied`}
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[340px] sm:h-[400px] select-none">
          {/* Layered SVG Scene */}
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Day Sky Gradient */}
              <linearGradient id="daySkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>

              {/* Night Sky Gradient */}
              <linearGradient id="nightSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={layers.skyTop} />
                <stop offset="100%" stopColor={layers.skyBottom} />
              </linearGradient>

              {/* Clip path for split slider */}
              <clipPath id="d2nSplitClip">
                <rect x={splitSlider * 10} y="0" width={1000 - splitSlider * 10} height="600" />
              </clipPath>
            </defs>

            {/* LEFT SIDE: UNTOUCHED DAYTIME SUNSHINE */}
            <g>
              {/* Day Sky & Sun */}
              <rect width="1000" height="600" fill="url(#daySkyGrad)" />
              <circle cx="780" cy="120" r="50" fill="#fffbeb" />
              <circle cx="780" cy="120" r="70" fill="#fef08a" opacity="0.3" />

              {/* Far Mountain */}
              <path d="M0 260 L200 170 L380 240 L560 140 L720 230 L880 150 L1000 200 L1000 600 L0 600 Z" fill="#64748b" />
              <polygon points="560,140 535,175 585,175" fill="#f8fafc" />

              {/* Midground Terrain & Farmhouse */}
              <path d="M0 340 L180 290 L380 360 L600 280 L790 350 L1000 300 L1000 600 L0 600 Z" fill="#334155" />

              {/* Farmhouse Architecture */}
              <rect x="220" y="320" width="140" height="100" fill="#475569" />
              <polygon points="210,320 290,260 370,320" fill="#1e293b" />
              {/* Daytime Window (Dark glass reflection) */}
              <rect x="260" y="345" width="45" height="40" fill="#94a3b8" />

              {/* Foreground Rolling Field */}
              <path d="M0 430 Q300 390 600 440 T1000 410 L1000 600 L0 600 Z" fill="#1e3a2b" />

              {/* Human Subject (Actor standing in field) */}
              <g transform="translate(680, 360)">
                <ellipse cx="0" cy="80" rx="30" ry="10" fill="#0f172a" opacity="0.4" />
                <path d="M-25 70 L-10 140 L10 140 L25 70 Z" fill="#1e293b" />
                <rect x="-24" y="0" width="48" height="70" rx="4" fill="#334155" />
                <circle cx="0" cy="-22" r="18" fill="#e8987a" />
                <path d="M-18 -32 C-20 -45 20 -45 18 -32 Z" fill="#3f1d0b" />
              </g>
            </g>

            {/* RIGHT SIDE: GRADED CINEMATIC NIGHT (Clipped by split slider) */}
            <g clipPath="url(#d2nSplitClip)">
              {/* Night Sky & Moon */}
              <rect width="1000" height="600" fill="url(#nightSkyGrad)" />
              {/* Moon positioned where sun was */}
              <circle cx="780" cy="120" r="32" fill="#ffffff" />
              <circle cx="780" cy="120" r="48" fill="#93c5fd" opacity="0.25" />

              {/* Far Mountain (Scotopic Blue) */}
              <path d="M0 260 L200 170 L380 240 L560 140 L720 230 L880 150 L1000 200 L1000 600 L0 600 Z" fill={layers.farMountain} />

              {/* Midground Terrain & Farmhouse */}
              <path d="M0 340 L180 290 L380 360 L600 280 L790 350 L1000 300 L1000 600 L0 600 Z" fill={layers.midground} />

              {/* Farmhouse Architecture in Deep Shadow */}
              <rect x="220" y="320" width="140" height="100" fill="#08101a" />
              <polygon points="210,320 290,260 370,320" fill="#04080e" />

              {/* Illuminated Warm Window Practical (Tungsten Opponent Contrast!) */}
              <rect x="260" y="345" width="45" height="40" fill={layers.practicalLight} />
              {/* Warm light spill out onto ground */}
              <polygon points="260,385 305,385 360,480 200,480" fill={layers.practicalLight} opacity={activeStep >= 5 ? 0.35 : 0.05} />

              {/* Foreground Rolling Field in Night Ambience */}
              <path d="M0 430 Q300 390 600 440 T1000 410 L1000 600 L0 600 Z" fill={layers.terrain} />

              {/* Actor with Preserved Healthy Skin & Moonlit Rim */}
              <g transform="translate(680, 360)">
                <ellipse cx="0" cy="80" rx="30" ry="10" fill="#000000" opacity="0.7" />
                <path d="M-25 70 L-10 140 L10 140 L25 70 Z" fill="#08101a" />
                <rect x="-24" y="0" width="48" height="70" rx="4" fill="#0c1826" />
                {/* Preserved organic face warmth */}
                <circle cx="0" cy="-22" r="18" fill={layers.actorSkin} />
                <path d="M-18 -32 C-20 -45 20 -45 18 -32 Z" fill="#0a0503" />
                {/* Moonlit Silvery Edge Rim */}
                <path d="M8 -38 C18 -30 20 -15 15 -5" stroke={layers.moonRim} strokeWidth="3" fill="none" opacity="0.8" />
              </g>
            </g>

            {/* Split Divider Line */}
            <line
              x1={splitSlider * 10}
              y1="0"
              x2={splitSlider * 10}
              y2="600"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx={splitSlider * 10} cy="300" r="16" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
            <text
              x={splitSlider * 10}
              y="304"
              fill="#ffffff"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="bold"
            >
              VS
            </text>
          </svg>

          {/* Interactive Scrub Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={splitSlider}
            onChange={e => setSplitSlider(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Split slider"
          />

          {/* HUD Badge */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-white flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-300">Left: Daytime Sunshine</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-white flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-cyan-300">Right: Converted Cinematic Night</span>
          </div>
        </div>
      </div>

      {/* Deep-Dive into Current Pipeline Step */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs">
              {currentStepInfo.nodeName}
            </span>
            <span className="text-white font-bold text-sm">{currentStepInfo.title}</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Step {activeStep + 1} of 6
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <strong className="text-white">Technical Colorist Action:</strong>
            <p className="text-slate-300 leading-relaxed">{currentStepInfo.technicalAction}</p>
          </div>
          <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-850">
            <strong className="text-amber-400">Industry Colorist Secret:</strong>
            <p className="text-slate-300 italic leading-relaxed">{currentStepInfo.coloristSecret}</p>
          </div>
        </div>
      </div>

      {/* Interactive Tuning Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        {/* Slider 1: Exposure Pull-Down (EV) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exposure Reduction</span>
            </span>
            <span className="font-mono text-cyan-400 text-[11px]">
              {settings.exposureDropEv.toFixed(1)} EV
            </span>
          </div>
          <input
            type="range"
            min="-4.0"
            max="-1.0"
            step="0.1"
            value={settings.exposureDropEv}
            onChange={e =>
              setSettings({ ...settings, exposureDropEv: parseFloat(e.target.value) })
            }
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Pulls overall scene luminance down by 2 to 4 f-stops.
          </p>
        </div>

        {/* Slider 2: Moonlight Kelvin CCT */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Moonlight Coldness</span>
            </span>
            <span className="font-mono text-blue-400 text-[11px] font-bold">
              {settings.moonlightKelvin}K
            </span>
          </div>
          <input
            type="range"
            min="6500"
            max="10000"
            step="100"
            value={settings.moonlightKelvin}
            onChange={e =>
              setSettings({ ...settings, moonlightKelvin: parseInt(e.target.value, 10) })
            }
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Simulates scotopic Purkinje rod vision spectrum.
          </p>
        </div>

        {/* Slider 3: Skin Warmth Retention */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Skin Warmth Retention</span>
            </span>
            <span className="font-mono text-amber-400 text-[11px]">
              {Math.round(settings.skinWarmthRetention * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={settings.skinWarmthRetention}
            onChange={e =>
              setSettings({ ...settings, skinWarmthRetention: parseFloat(e.target.value) })
            }
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Protects actors' face hemoglobin from zombie-blue cast.
          </p>
        </div>

        {/* Slider 4: Practical Light Warmth */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Tungsten Practical Pop</span>
            </span>
            <span className="font-mono text-rose-400 text-[11px]">
              {Math.round(settings.practicalWarmth * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={settings.practicalWarmth}
            onChange={e =>
              setSettings({ ...settings, practicalWarmth: parseFloat(e.target.value) })
            }
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Window &amp; lantern 2400K opponent warmth.
          </p>
        </div>
      </div>

      {/* On-Set Shooting Rules for Day-for-Night */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-400" />
          <span>The 4 On-Set Cinematography Rules for Flawless Day-for-Night</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400">1. Backlight with the Sun</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Position the actors so the direct daytime sun is behind them. It turns harsh daylight into a natural, brilliant moonlight rim on hair and shoulders.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400">2. Turn Practicals ON in Daylight</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Always turn car headlights, streetlights, and interior house lamps ON during the daytime shoot. When exposure is pulled down in color grading, they automatically become luminous night practicals.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400">3. Frame Out the Horizon Sky</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Bright blue day skies immediately ruin the illusion. Tilt down, shoot against foliage, hills, or canyon walls, or use a graduated ND 1.2 filter to knock down the sky.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400">4. Shoot in Overcast or Open Shade</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Hard downward noon shadows look bizarre at night. Soft overcast cloud diffusion mimics nocturnal ambient starlight far more faithfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
