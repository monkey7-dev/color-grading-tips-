/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LandscapeGradeParameters,
  FocalObjectConfig,
  blendAtmosphericHaze,
  calculateFocalContrastRatio,
  gradeFocalObjectColor,
  gradeLandscapeLayerColor,
} from '../utils/landscapeGradingMath';
import {
  Mountain,
  Eye,
  Sliders,
  Sun,
  Flame,
  CloudFog,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const LANDSCAPE_MOODS: LandscapeGradeParameters[] = [
  {
    moodId: 'sublime_golden',
    name: 'Golden Hour Sublime',
    description: 'Ethereal wonder & mythic scale. Radiant low-sun warmth, luminous amber highlights, soft cyan-slate shadow wrap.',
    skyGradient: ['#ff8838', '#ffd480'],
    distantMountainColor: '#475569',
    midMountainColor: '#334155',
    foregroundTerrainColor: '#1e293b',
    foliageColor: '#2b3b28',
    ambientLightColor: '#ffba66',
    shadowTint: '#1e2d3d',
    highlightTint: '#ffe8b3',
    contrast: 1.15,
    saturation: 1.2,
    aerialHaze: 0.65,
    colorTemperatureK: 3400,
  },
  {
    moodId: 'nordic_noir',
    name: 'Nordic Noir / Bleak Isolation',
    description: 'Existential solitude, cold detachment & raw elemental drama. Desaturated slate greens, steel cyan shadows, lifted foggy highlights.',
    skyGradient: ['#475569', '#94a3b8'],
    distantMountainColor: '#64748b',
    midMountainColor: '#334155',
    foregroundTerrainColor: '#0f172a',
    foliageColor: '#1e2e28',
    ambientLightColor: '#93c5fd',
    shadowTint: '#0f1c24',
    highlightTint: '#cbd5e1',
    contrast: 1.35,
    saturation: 0.68,
    aerialHaze: 0.85,
    colorTemperatureK: 7200,
  },
  {
    moodId: 'highland_mist',
    name: 'Highland Emerald Mist',
    description: 'Moody Celtic legend & untamed grandeur. Deep moss emeralds, stormy charcoal clouds, fleeting sunbeam highlight breaks.',
    skyGradient: ['#1e293b', '#64748b'],
    distantMountainColor: '#334155',
    midMountainColor: '#1e293b',
    foregroundTerrainColor: '#0b1914',
    foliageColor: '#1b4332',
    ambientLightColor: '#86efac',
    shadowTint: '#081c15',
    highlightTint: '#fef08a',
    contrast: 1.25,
    saturation: 0.95,
    aerialHaze: 0.72,
    colorTemperatureK: 5400,
  },
  {
    moodId: 'arid_western',
    name: 'Sun-Baked Mojave / Arid Canyon',
    description: 'Primal heat, unforgiving grit & desert expanse. Terracotta rusts, bleached sandstone, searing horizon haze, deep crushed shadows.',
    skyGradient: ['#ea580c', '#fdba74'],
    distantMountainColor: '#7c2d12',
    midMountainColor: '#9a3412',
    foregroundTerrainColor: '#431407',
    foliageColor: '#713f12',
    ambientLightColor: '#fb923c',
    shadowTint: '#2a0d05',
    highlightTint: '#fed7aa',
    contrast: 1.4,
    saturation: 1.15,
    aerialHaze: 0.45,
    colorTemperatureK: 4600,
  },
  {
    moodId: 'blue_hour_alpen',
    name: 'Twilight Blue Hour & Alpenglow',
    description: 'Serene silent majesty. Deep royal cobalt sky, luminescent rose-magenta mountain crests, still reflective foreground waters.',
    skyGradient: ['#0f172a', '#1e3a8a'],
    distantMountainColor: '#312e81',
    midMountainColor: '#1e1b4b',
    foregroundTerrainColor: '#0f172a',
    foliageColor: '#0f2922',
    ambientLightColor: '#f43f5e',
    shadowTint: '#0c1222',
    highlightTint: '#fda4af',
    contrast: 1.1,
    saturation: 1.1,
    aerialHaze: 0.5,
    colorTemperatureK: 9500,
  },
];

export const FOCAL_OBJECTS: FocalObjectConfig[] = [
  {
    id: 'red_refuge',
    label: 'Alpine Red Refuge Hut',
    baseColor: '#e11d48', // Vibrant crimson
    category: 'Architecture / Shelter',
    description: 'A crimson wooden shelter perched high on a granite ridge.',
    psychologicalFocusNote: 'Red possesses the longest visual wavelength (~650nm), triggering instinctual human focal fixation against cool green foliage and slate rock.',
  },
  {
    id: 'orange_climber',
    label: 'Orange Expedition Explorer',
    baseColor: '#f97316', // High-vis neon orange
    category: 'Human Subject / Scale',
    description: 'A lone hiker in a mountaineering jacket standing before vast peaks.',
    psychologicalFocusNote: 'Provides instant scale and narrative pathos. Orange forms a direct complementary opposition with blue atmospheric distance.',
  },
  {
    id: 'yellow_beacon',
    label: 'Golden Watchtower / Beacon',
    baseColor: '#eab308', // Radiant sunlit gold
    category: 'Beacon / Hope',
    description: 'A weathered stone watchtower illuminated by a solitary shaft of sunlight.',
    psychologicalFocusNote: 'Yellow represents peak human eye photopic sensitivity (~555nm). Viewers instinctively interpret it as the destination or sanctuary.',
  },
  {
    id: 'glacial_pool',
    label: 'Glacial Turquoise Tarn',
    baseColor: '#06b6d4', // Vivid cyan-turquoise
    category: 'Water / Natural Jewel',
    description: 'An alpine mineral lake glowing with jewel-like cyan reflections.',
    psychologicalFocusNote: 'Creates high chromatic contrast when surrounded by warm arid earth, golden grass, or deep dark evergreen terrain.',
  },
  {
    id: 'golden_aspen',
    label: 'Solitary Autumn Golden Aspen',
    baseColor: '#f59e0b', // Radiant amber gold
    category: 'Foliage / Transience',
    description: 'A single brilliant yellow-gold tree resisting the shadows of a dark conifer forest.',
    psychologicalFocusNote: 'Symbolizes temporal fragility and resilience. Color separation separates individual living forms from monolithic background masses.',
  },
];

export const LandscapeGradingStudio: React.FC = () => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('sublime_golden');
  const [selectedFocalId, setSelectedFocalId] = useState<string>('red_refuge');

  // Interactive Grade Sliders
  const [subjectPop, setSubjectPop] = useState<number>(1.4); // 0.8 to 2.2
  const [subjectLum, setSubjectLum] = useState<number>(12); // -20 to +30
  const [bgDesaturation, setBgDesaturation] = useState<number>(0.35); // 0.0 to 0.8
  const [aerialHazeScale, setAerialHazeScale] = useState<number>(1.0); // 0.2 to 1.8
  const [spotlightIntensity, setSpotlightIntensity] = useState<number>(0.55); // 0.0 to 1.0
  const [vignetteStrength, setVignetteStrength] = useState<number>(0.45); // 0.0 to 0.9
  const [compareSplit, setCompareSplit] = useState<number>(100); // 0 to 100% (100 = full graded)

  const activeMood = useMemo(
    () => LANDSCAPE_MOODS.find(m => m.moodId === selectedMoodId) || LANDSCAPE_MOODS[0],
    [selectedMoodId]
  );

  const activeFocal = useMemo(
    () => FOCAL_OBJECTS.find(f => f.id === selectedFocalId) || FOCAL_OBJECTS[0],
    [selectedFocalId]
  );

  // Compute live graded colors for the landscape layers
  const gradedLayers = useMemo(() => {
    const hazeColor = activeMood.skyGradient[1];
    const effectiveHaze = activeMood.aerialHaze * aerialHazeScale;

    // Distant mountain (far: depth factor 0.9)
    const rawFar = gradeLandscapeLayerColor(
      activeMood.distantMountainColor,
      activeMood.saturation,
      bgDesaturation * 0.7
    );
    const farMountain = blendAtmosphericHaze(rawFar, hazeColor, 0.9, effectiveHaze);

    // Midground mountain (mid: depth factor 0.5)
    const rawMid = gradeLandscapeLayerColor(
      activeMood.midMountainColor,
      activeMood.saturation,
      bgDesaturation * 0.8
    );
    const midMountain = blendAtmosphericHaze(rawMid, hazeColor, 0.5, effectiveHaze);

    // Foreground terrain (near: depth factor 0.15)
    const foreground = gradeLandscapeLayerColor(
      activeMood.foregroundTerrainColor,
      activeMood.saturation,
      bgDesaturation
    );

    // Foreground foliage
    const foliage = gradeLandscapeLayerColor(
      activeMood.foliageColor,
      activeMood.saturation,
      bgDesaturation * 0.9
    );

    // Focal Hero Object with selective pop and luminance
    const focalColor = gradeFocalObjectColor(activeFocal.baseColor, subjectPop, subjectLum);

    return {
      sky0: activeMood.skyGradient[0],
      sky1: activeMood.skyGradient[1],
      farMountain,
      midMountain,
      foreground,
      foliage,
      focalColor,
    };
  }, [activeMood, activeFocal, subjectPop, subjectLum, bgDesaturation, aerialHazeScale]);

  // Compute live analytical gaze & contrast metrics
  const gazeMetrics = useMemo(() => {
    return calculateFocalContrastRatio(gradedLayers.focalColor, gradedLayers.midMountain);
  }, [gradedLayers, activeFocal]);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Mountain className="w-4 h-4" />
            <span>Interactive Landscape Grading &amp; Focal Isolation Studio</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
            Landscape Drama, Atmospheric Depth &amp; Focal Color Isolation
          </h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-1">
            Experiment with cinematic landscape color grading presets, atmospheric Rayleigh haze,
            and chromatic isolation techniques to command the viewer’s eye toward hero subjects.
          </p>
        </div>

        {/* Live Gaze Impact Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-mono text-slate-400">Eye-Tracking Saliency</span>
            <span
              className={`text-2xl font-black font-mono ${
                gazeMetrics.visualGazeScore > 75
                  ? 'text-emerald-400'
                  : gazeMetrics.visualGazeScore > 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {gazeMetrics.visualGazeScore}
              <span className="text-xs font-normal text-slate-500">/100</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-[11px] text-slate-300">
            <div>
              Hue Separation:{' '}
              <span className="text-cyan-400 font-mono font-bold">
                {gazeMetrics.hueAngleDelta}°
              </span>
            </div>
            <div>
              Lum Delta:{' '}
              <span className="text-amber-400 font-mono font-bold">
                {Math.round(gazeMetrics.luminanceContrast * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selector Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Select Landscape Dramatic Mood:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LANDSCAPE_MOODS.map(mood => {
            const isSelected = mood.moodId === selectedMoodId;
            return (
              <button
                key={mood.moodId}
                onClick={() => setSelectedMoodId(mood.moodId)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'border-amber-400/80 bg-amber-500/10 shadow-lg shadow-amber-950/20'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{mood.name}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: mood.ambientLightColor }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{mood.colorTemperatureK}K</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focal Subject Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>2. Select Hero Focal Object (Subject to Direct Viewer Attention):</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {FOCAL_OBJECTS.map(focal => {
            const isSelected = focal.id === selectedFocalId;
            return (
              <button
                key={focal.id}
                onClick={() => setSelectedFocalId(focal.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-cyan-400/80 bg-cyan-500/10 shadow-lg shadow-cyan-950/20'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 shadow-sm border border-white/30"
                  style={{ backgroundColor: focal.baseColor }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{focal.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{focal.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Visual Display: Layered Landscape Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Multi-Layered Landscape Engine</span>
          </span>
          <div className="flex items-center gap-2">
            <span>Before / After Split:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={compareSplit}
              onChange={e => setCompareSplit(parseFloat(e.target.value))}
              className="w-24 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-[11px] text-amber-300 w-8">{compareSplit}%</span>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[340px] sm:h-[400px]">
          {/* Layered SVG Landscape */}
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Sky Gradient */}
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={gradedLayers.sky0} />
                <stop offset="100%" stopColor={gradedLayers.sky1} />
              </linearGradient>

              {/* Atmospheric Depth Mist Filter */}
              <linearGradient id="hazeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={gradedLayers.sky1} stopOpacity="0.8" />
                <stop offset="100%" stopColor={gradedLayers.sky1} stopOpacity="0.0" />
              </linearGradient>

              {/* Power Window Radial Spotlight on Focal Subject (Coordinates: 620, 360) */}
              <radialGradient id="powerWindowSpot" cx="62%" cy="60%" r="35%">
                <stop offset="0%" stopColor={activeMood.ambientLightColor} stopOpacity={spotlightIntensity * 0.75} />
                <stop offset="60%" stopColor={activeMood.ambientLightColor} stopOpacity={spotlightIntensity * 0.25} />
                <stop offset="100%" stopColor={activeMood.ambientLightColor} stopOpacity="0" />
              </radialGradient>

              {/* Sun/Light Glint */}
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="40%" stopColor={activeMood.highlightTint} stopOpacity="0.5" />
                <stop offset="100%" stopColor={activeMood.skyGradient[0]} stopOpacity="0" />
              </radialGradient>

              {/* Vignette Shadow Mask */}
              <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="65%">
                <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity={vignetteStrength} />
              </radialGradient>

              {/* Clip path for Before/After split */}
              <clipPath id="splitClip">
                <rect x="0" y="0" width={compareSplit * 10} height="600" />
              </clipPath>
            </defs>

            {/* UNGRADED RAW BACKGROUND (revealed when split slider is dragged) */}
            <g>
              <rect width="1000" height="600" fill="#475569" />
              {/* Neutral mountain layer 1 */}
              <path d="M0 240 L180 180 L350 260 L500 160 L680 230 L850 140 L1000 220 L1000 600 L0 600 Z" fill="#64748b" />
              {/* Neutral mountain layer 2 */}
              <path d="M0 320 L220 270 L420 340 L580 280 L760 350 L1000 300 L1000 600 L0 600 Z" fill="#475569" />
              {/* Neutral foreground */}
              <path d="M0 430 Q280 400 550 440 T1000 420 L1000 600 L0 600 Z" fill="#334155" />
            </g>

            {/* FULLY GRADED LAYER (Clipped by split slider) */}
            <g clipPath="url(#splitClip)">
              {/* Layer 1: Atmospheric Sky & Sun */}
              <rect width="1000" height="600" fill="url(#skyGrad)" />
              <circle cx="280" cy="140" r="120" fill="url(#sunGlow)" />
              <circle cx="280" cy="140" r="28" fill="#ffffff" opacity="0.85" />

              {/* Layer 2: Distant High Alpine Peaks (Heavily affected by Aerial Perspective) */}
              <path
                d="M0 260 L140 170 L260 210 L380 130 L530 220 L680 150 L840 230 L940 160 L1000 200 L1000 600 L0 600 Z"
                fill={gradedLayers.farMountain}
              />
              {/* Peak snow highlights */}
              <polygon points="380,130 355,165 405,165" fill={activeMood.highlightTint} opacity="0.65" />
              <polygon points="680,150 655,185 705,185" fill={activeMood.highlightTint} opacity="0.65" />
              <polygon points="140,170 120,200 160,200" fill={activeMood.highlightTint} opacity="0.55" />

              {/* Aerial Haze Strata between far and mid peaks */}
              <rect x="0" y="200" width="1000" height="90" fill="url(#hazeGrad)" opacity={activeMood.aerialHaze * 0.75} />

              {/* Layer 3: Midground Ridges & Escarpments */}
              <path
                d="M0 340 L160 300 L340 370 L520 290 L710 360 L870 310 L1000 350 L1000 600 L0 600 Z"
                fill={gradedLayers.midMountain}
              />

              {/* Layer 4: Foreground Rolling Ridge & Pine Forests */}
              <path
                d="M0 450 Q240 400 480 440 T1000 410 L1000 600 L0 600 Z"
                fill={gradedLayers.foreground}
              />

              {/* Evergreen Pines in Foreground */}
              <g fill={gradedLayers.foliage}>
                <polygon points="90,430 80,480 100,480" />
                <polygon points="120,410 108,470 132,470" />
                <polygon points="150,425 140,475 160,475" />
                <polygon points="320,440 305,510 335,510" />
                <polygon points="350,430 338,495 362,495" />
                <polygon points="780,430 765,500 795,500" />
                <polygon points="820,415 805,485 835,485" />
                <polygon points="860,425 845,495 875,495" />
                <polygon points="900,440 888,510 912,510" />
              </g>

              {/* Alpine Glacial Tarn Reflection Lake */}
              <path
                d="M260 480 Q450 460 680 490 T950 540 L1000 600 L200 600 Z"
                fill={gradedLayers.midMountain}
                opacity="0.8"
              />
              <path
                d="M280 490 Q470 475 660 500 T920 545 L980 600 L240 600 Z"
                fill={gradedLayers.sky1}
                opacity="0.35"
              />

              {/* Directional Sunbeam / Power Window Spotlight onto Subject */}
              <circle cx="620" cy="360" r="280" fill="url(#powerWindowSpot)" />

              {/* HERO FOCAL SUBJECT (Placed at Rule-of-Thirds Golden Point: x=620, y=360) */}
              <g transform="translate(620, 360)">
                {selectedFocalId === 'red_refuge' && (
                  <g>
                    {/* Shadow underneath */}
                    <ellipse cx="0" cy="16" rx="28" ry="7" fill="#000000" opacity="0.5" />
                    {/* Cabin walls */}
                    <rect x="-18" y="-10" width="36" height="24" rx="2" fill={gradedLayers.focalColor} />
                    {/* Dark roof */}
                    <polygon points="-22,-10 0,-26 22,-10" fill="#1e293b" />
                    {/* Chimney */}
                    <rect x="8" y="-22" width="5" height="10" fill="#334155" />
                    {/* Luminous Warm Window */}
                    <rect x="-6" y="-4" width="12" height="10" rx="1" fill="#fef08a" />
                  </g>
                )}

                {selectedFocalId === 'orange_climber' && (
                  <g>
                    {/* Shadow */}
                    <ellipse cx="0" cy="18" rx="14" ry="4" fill="#000000" opacity="0.45" />
                    {/* Legs/Pants */}
                    <rect x="-5" y="4" width="4" height="14" fill="#1e293b" />
                    <rect x="1" y="4" width="4" height="14" fill="#1e293b" />
                    {/* Backpack */}
                    <ellipse cx="-7" cy="-2" rx="5" ry="9" fill="#0284c7" />
                    {/* Orange Jacket (Hero Subject) */}
                    <rect x="-6" y="-8" width="12" height="14" rx="3" fill={gradedLayers.focalColor} />
                    {/* Hood/Head */}
                    <circle cx="0" cy="-14" r="5" fill="#fbcfe8" />
                    <circle cx="0" cy="-14" r="6" fill={gradedLayers.focalColor} opacity="0.4" />
                    {/* Trekking Pole */}
                    <line x1="8" y1="-5" x2="12" y2="18" stroke="#cbd5e1" strokeWidth="1.5" />
                  </g>
                )}

                {selectedFocalId === 'yellow_beacon' && (
                  <g>
                    {/* Shadow */}
                    <ellipse cx="0" cy="20" rx="22" ry="6" fill="#000000" opacity="0.5" />
                    {/* Tower stone base */}
                    <polygon points="-14,20 -10,-15 10,-15 14,20" fill="#334155" />
                    {/* Beacon cupola */}
                    <rect x="-12" y="-30" width="24" height="15" rx="2" fill={gradedLayers.focalColor} />
                    {/* Light beam out */}
                    <polygon points="-2,-22 -80,-50 -60,-10 -2,-22" fill="#fef08a" opacity="0.45" />
                    <circle cx="0" cy="-22" r="5" fill="#ffffff" />
                  </g>
                )}

                {selectedFocalId === 'glacial_pool' && (
                  <g>
                    {/* Rock rim */}
                    <ellipse cx="0" cy="0" rx="46" ry="22" fill="#1e293b" />
                    {/* Turquoise Mineral Water */}
                    <ellipse cx="0" cy="0" rx="40" ry="18" fill={gradedLayers.focalColor} />
                    {/* Reflection glint */}
                    <ellipse cx="-10" cy="-4" rx="20" ry="6" fill="#ffffff" opacity="0.6" />
                  </g>
                )}

                {selectedFocalId === 'golden_aspen' && (
                  <g>
                    {/* Tree trunk */}
                    <rect x="-2" y="-4" width="4" height="24" fill="#3f2e21" />
                    {/* Foliage cloud layers */}
                    <circle cx="0" cy="-20" r="20" fill={gradedLayers.focalColor} />
                    <circle cx="-12" cy="-15" r="14" fill={gradedLayers.focalColor} opacity="0.9" />
                    <circle cx="12" cy="-15" r="14" fill={gradedLayers.focalColor} opacity="0.9" />
                    <circle cx="0" cy="-28" r="12" fill="#fef08a" opacity="0.8" />
                  </g>
                )}

                {/* Target Reticle Indicator */}
                <circle cx="0" cy="0" r="32" fill="none" stroke={gradedLayers.focalColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
              </g>

              {/* Peripheral Cinematic Vignette Mask */}
              <rect width="1000" height="600" fill="url(#vignetteGrad)" pointerEvents="none" />
            </g>

            {/* Split Comparison Divider Line */}
            {compareSplit < 100 && compareSplit > 0 && (
              <g>
                <line
                  x1={compareSplit * 10}
                  y1="0"
                  x2={compareSplit * 10}
                  y2="600"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx={compareSplit * 10} cy="300" r="16" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={compareSplit * 10}
                  y="304"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  VS
                </text>
              </g>
            )}
          </svg>

          {/* Floating HUD Labels */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-white flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeMood.highlightTint }}
            />
            <span className="font-bold">{activeMood.name}</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-cyan-400">{activeMood.colorTemperatureK}K</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            Focal Target: <span className="text-amber-400 font-bold">{activeFocal.label}</span>
          </div>

          <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800/80">
            {compareSplit < 100 ? 'Left: Camera RAW Flat | Right: Graded Drama' : 'Cinematic Grade Active'}
          </div>
        </div>
      </div>

      {/* Interactive Colorist Sliders: Focal Isolation & Drama Tuning */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        {/* Slider 1: Subject Chromatic Pop */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Subject Chromatic Pop</span>
            </span>
            <span className="font-mono text-cyan-400 text-[11px]">{subjectPop.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.2"
            step="0.05"
            value={subjectPop}
            onChange={e => setSubjectPop(parseFloat(e.target.value))}
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Multiplies saturation of the hero object (selective HSL qualification).
          </p>
        </div>

        {/* Slider 2: Background Desaturation */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Background Subjugation</span>
            </span>
            <span className="font-mono text-indigo-400 text-[11px]">
              {Math.round(bgDesaturation * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.75"
            step="0.05"
            value={bgDesaturation}
            onChange={e => setBgDesaturation(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Drains distracting color from distant trees and rocks to isolate the subject.
          </p>
        </div>

        {/* Slider 3: Aerial Depth / Rayleigh Haze */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <CloudFog className="w-3.5 h-3.5 text-cyan-400" />
              <span>Atmospheric Depth Haze</span>
            </span>
            <span className="font-mono text-cyan-400 text-[11px]">
              {(aerialHazeScale * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.8"
            step="0.1"
            value={aerialHazeScale}
            onChange={e => setAerialHazeScale(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Rayleigh scattering: lifts black levels and cools distant mountain ranges.
          </p>
        </div>

        {/* Slider 4: Power Window Spotlight Mask */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Power Window Light Pool</span>
            </span>
            <span className="font-mono text-amber-400 text-[11px]">
              {Math.round(spotlightIntensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={spotlightIntensity}
            onChange={e => setSpotlightIntensity(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Simulates directional sunlight breaking through clouds right onto the subject.
          </p>
        </div>

        {/* Slider 5: Subject Luminance Boost */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subject Luminance Delta</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">
              {subjectLum > 0 ? `+${subjectLum}%` : `${subjectLum}%`}
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="30"
            step="1"
            value={subjectLum}
            onChange={e => setSubjectLum(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Raises subject exposure without clipping surrounding landscape highlights.
          </p>
        </div>

        {/* Slider 6: Peripheral Edge Vignette */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              <span>Peripheral Vignette Falloff</span>
            </span>
            <span className="font-mono text-rose-400 text-[11px]">
              {Math.round(vignetteStrength * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.85"
            step="0.05"
            value={vignetteStrength}
            onChange={e => setVignetteStrength(parseFloat(e.target.value))}
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Darkens canvas perimeter to trap human peripheral vision inside the frame.
          </p>
        </div>
      </div>

      {/* Technical Colorist Breakdown & Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* DaVinci Resolve Node Tree Recipe */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>DaVinci Resolve Landscape Node Architecture</span>
            </span>
            <span className="font-mono text-[10px] text-cyan-400">5-Node Serial/Parallel Pipeline</span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 shrink-0">
                Node 01
              </span>
              <div>
                <strong className="text-white">Exposure &amp; CST:</strong> Convert camera RAW to DaVinci Wide Gamut / Intermediate. Balance highlight recovery on clouds.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 shrink-0">
                Node 02
              </span>
              <div>
                <strong className="text-white">Atmospheric Depth (Aerial Perspective):</strong> Lift Gamma shadow wheel with cool tint ({activeMood.shadowTint}) to simulate Rayleigh distance scattering.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 shrink-0">
                Node 03
              </span>
              <div>
                <strong className="text-white">Focal Object HSL Qualifier:</strong> Sample {activeFocal.label}. Soften matte edge. Push Saturation +{Math.round((subjectPop - 1) * 100)}% and Gain +{subjectLum}%.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 shrink-0">
                Node 04
              </span>
              <div>
                <strong className="text-white">Background Outside Node:</strong> Invert qualifier mask. Pull Saturation down by {Math.round(bgDesaturation * 100)}% to subjugate background greens/slate.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 shrink-0">
                Node 05
              </span>
              <div>
                <strong className="text-white">Power Window Vignette &amp; God Ray:</strong> Circular power window over subject with high softness (65). Gentle gain lift (+0.12).
              </div>
            </div>
          </div>
        </div>

        {/* Lightroom Classic Calibration & Masking Recipe */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Adobe Lightroom Classic Landscape Recipe</span>
            </span>
            <span className="font-mono text-[10px] text-amber-400">HSL &amp; AI Masking</span>
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-400 shrink-0">
                Step 1
              </span>
              <div>
                <strong className="text-white">Calibration Tab:</strong> Blue Primary Saturation to +35 to enrich warm/cool separation. Shift Tint towards {activeMood.colorTemperatureK > 6000 ? 'Cool Magenta' : 'Warm Gold'}.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-400 shrink-0">
                Step 2
              </span>
              <div>
                <strong className="text-white">Color Mixer (Targeting Object):</strong> Select {activeFocal.category}. Boost Saturation (+30) and Luminance (+15).
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-400 shrink-0">
                Step 3
              </span>
              <div>
                <strong className="text-white">Background Foliage Subjugation:</strong> Green Hue shifted +15 (toward olive), Saturation -{Math.round(bgDesaturation * 80)}, Luminance -10.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-400 shrink-0">
                Step 4
              </span>
              <div>
                <strong className="text-white">Radial Gradient on Subject:</strong> Feather 75. Exposure +0.40, Dehaze -10 (adds subtle glowing bloom).
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-400 shrink-0">
                Step 5
              </span>
              <div>
                <strong className="text-white">Effects Vignette:</strong> Amount -{Math.round(vignetteStrength * 60)}, Midpoint 40, Feather 85 to anchor the gaze.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Psychology Note on Focal Color Isolation */}
      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex items-start gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300">
            Psychological Mechanism of Focal Color Isolation:
          </span>
          <p className="text-slate-300 leading-relaxed">
            {activeFocal.psychologicalFocusNote} In expansive landscapes, without a chromatic or
            luminance anchor, the human visual cortex undergoes saccadic drift—wandering aimlessly
            across horizons. By establishing an opponent-color focal point (e.g., warm crimson/orange
            against cool teal mountains), you create an immediate pre-attentive sensory hierarchy,
            giving the scene emotional narrative, depth, and scale.
          </p>
        </div>
      </div>
    </div>
  );
};
