import React, { useState } from 'react';
import {
  LIGHTING_SITUATIONS,
  DAVINCI_NODE_WORKFLOWS,
  LIGHTROOM_WORKFLOWS,
  SUBJECT_LANDSCAPE_RECIPES,
  LightingSituation,
} from '../data/cinematographyData';
import {
  Sun,
  Moon,
  Cloud,
  Lightbulb,
  Sliders,
  Layers,
  Sparkles,
  Camera,
  Film,
  Mountain,
} from 'lucide-react';
import { LandscapeGradingStudio } from './LandscapeGradingStudio';

export const CinematographySection: React.FC = () => {
  const [selectedSituationId, setSelectedSituationId] = useState<string>('golden_hour');
  const [kelvinSlider, setKelvinSlider] = useState<number>(3400);

  // DaVinci Lift Gamma Gain Interactive State
  const [lift, setLift] = useState<number>(0); // -50 to 50
  const [gamma, setGamma] = useState<number>(0); // -50 to 50
  const [gain, setGain] = useState<number>(0); // -50 to 50
  const [selectedNodeCategory, setSelectedNodeCategory] = useState<'all' | 'primary' | 'curves' | 'advanced'>('all');

  const selectedSituation: LightingSituation =
    LIGHTING_SITUATIONS.find(s => s.id === selectedSituationId) || LIGHTING_SITUATIONS[0];

  const filteredNodes =
    selectedNodeCategory === 'all'
      ? DAVINCI_NODE_WORKFLOWS
      : DAVINCI_NODE_WORKFLOWS.filter(n => n.category === selectedNodeCategory);

  // Approximate Kelvin color temperature to hex for visual slider
  const getKelvinColor = (k: number): string => {
    if (k < 3000) return '#ff8c00';
    if (k < 4000) return '#ffa733';
    if (k < 5000) return '#ffd299';
    if (k < 6000) return '#ffffff';
    if (k < 7500) return '#cce5ff';
    if (k < 9000) return '#99ccff';
    return '#66b2ff';
  };

  const handleSelectSituation = (sit: LightingSituation) => {
    setSelectedSituationId(sit.id);
    setKelvinSlider(sit.kelvinDefault);
  };

  const resetWheels = () => {
    setLift(0);
    setGamma(0);
    setGain(0);
  };

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
          <span>04</span>
          <span aria-hidden="true">·</span>
          <span>Camera Physics, Waveforms &amp; Post-Production</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Cinematography &amp; Grading Masterclass
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive cheat sheets and interactive simulators for natural and artificial
          lighting situations, Blackmagic DaVinci Resolve node trees, and Adobe Lightroom Classic
          color grading calibrations.
        </p>
      </div>

      {/* Part 1: Photography by Situation, Location, & Light */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Photography by Situation, Location &amp; Kelvin Lighting</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            Blackbody Radiation Thermodynamics
          </span>
        </div>

        {/* Lighting Situation Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LIGHTING_SITUATIONS.map(sit => {
            const isSelected = sit.id === selectedSituationId;
            return (
              <button
                key={sit.id}
                onClick={() => handleSelectSituation(sit)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-slate-800 border-slate-700 shadow-md ring-1 ring-slate-600'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: sit.colorSwatchHex }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">{sit.kelvinRange}</span>
                </div>
                <div>
                  <div className="font-semibold text-xs text-white truncate">{sit.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{sit.timeframe}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Kelvin Thermometer Bar */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Kelvin Temperature Spectrum Simulator:</span>
              <span className="font-mono text-cyan-400">{kelvinSlider}K</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Correlated Color Temperature (CCT)
            </span>
          </div>

          <input
            type="range"
            min="2000"
            max="10000"
            step="100"
            value={kelvinSlider}
            onChange={e => setKelvinSlider(Number(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            style={{
              background:
                'linear-gradient(to right, #ff6600 0%, #ffa500 20%, #ffe0b2 40%, #ffffff 55%, #cce5ff 75%, #66b2ff 100%)',
            }}
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>2000K (Candle)</span>
            <span>3200K (Tungsten)</span>
            <span>5500K (Daylight Sun)</span>
            <span>6500K (Overcast)</span>
            <span>10,000K (Deep Twilight Blue)</span>
          </div>
        </div>

        {/* Selected Situation Deep Dive Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <span>{selectedSituation.timeframe}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{selectedSituation.kelvinRange}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">{selectedSituation.name}</h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 self-start sm:self-auto">
              Spectral Quality: {selectedSituation.criTlciImpact.split('.')[0]}
            </div>
          </div>

          {/* Characteristics & White Balance Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/70 space-y-2">
              <div className="font-semibold text-xs text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Optical Characteristics &amp; Solar Physics</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                {selectedSituation.characteristics.map((char, idx) => (
                  <li key={idx}>{char}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/70 space-y-2">
              <div className="font-semibold text-xs text-white flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Camera White Balance Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSituation.whiteBalanceAdvice}
              </p>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-850">
                <strong className="text-slate-300">Cinematic Case Study:</strong>{' '}
                {selectedSituation.cinematicFilmExample}
              </div>
            </div>
          </div>

          {/* Cinematic Lighting Recipe Grid */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              On-Set Cinematic Lighting Recipe &amp; Ratios
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Key Light</span>
                <p className="text-slate-200 font-medium mt-1">{selectedSituation.lightingRecipe.keyLight}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Key-to-Fill Ratio</span>
                <p className="text-slate-200 font-medium mt-1">{selectedSituation.lightingRecipe.fillRatio}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Shadow Quality</span>
                <p className="text-slate-200 font-medium mt-1">{selectedSituation.lightingRecipe.shadowQuality}</p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Diffusion &amp; Filtration</span>
                <p className="text-slate-200 font-medium mt-1">{selectedSituation.lightingRecipe.diffusionRecommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1.5: Landscape Dramatic Grading & Focal Isolation Studio */}
      <LandscapeGradingStudio />

      {/* Part 2: DaVinci Resolve Lift/Gamma/Gain Interactive Simulator & Node Graph */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-cyan-400" />
            <span>DaVinci Resolve Lift / Gamma / Gain &amp; Curves Simulator</span>
          </span>
          <button
            onClick={resetWheels}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
          >
            Reset Wheels
          </button>
        </div>

        {/* Lift Gamma Gain 3-Wheel Interactive Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
          {/* Lift Wheel */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Lift (Shadows)</span>
              <p className="text-[11px] text-slate-400">Controls black point and toe roll-off (0-20 IRE)</p>
            </div>
            {/* Visual Dial simulation */}
            <div className="relative w-28 h-28 mx-auto rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-900/80 shadow-inner">
              <div
                className="w-4 h-4 rounded-full bg-cyan-400 shadow-md transition-all duration-75"
                style={{
                  transform: `translate(${lift * 0.7}px, ${-lift * 0.7}px)`,
                }}
              />
              <span className="absolute bottom-2 text-[10px] font-mono text-slate-500">LIFT</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Value:</span>
                <span className="text-cyan-400">{lift > 0 ? `+${lift}` : lift}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={lift}
                onChange={e => setLift(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          {/* Gamma Wheel */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Gamma (Midtones)</span>
              <p className="text-[11px] text-slate-400">Pivots midtone exposure and contrast (20-75 IRE)</p>
            </div>
            <div className="relative w-28 h-28 mx-auto rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-900/80 shadow-inner">
              <div
                className="w-4 h-4 rounded-full bg-amber-400 shadow-md transition-all duration-75"
                style={{
                  transform: `translate(${gamma * 0.7}px, ${-gamma * 0.7}px)`,
                }}
              />
              <span className="absolute bottom-2 text-[10px] font-mono text-slate-500">GAMMA</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Value:</span>
                <span className="text-amber-400">{gamma > 0 ? `+${gamma}` : gamma}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={gamma}
                onChange={e => setGamma(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Gain Wheel */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Gain (Highlights)</span>
              <p className="text-[11px] text-slate-400">Scales white point headroom (75-100 IRE)</p>
            </div>
            <div className="relative w-28 h-28 mx-auto rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-900/80 shadow-inner">
              <div
                className="w-4 h-4 rounded-full bg-rose-400 shadow-md transition-all duration-75"
                style={{
                  transform: `translate(${gain * 0.7}px, ${-gain * 0.7}px)`,
                }}
              />
              <span className="absolute bottom-2 text-[10px] font-mono text-slate-500">GAIN</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Value:</span>
                <span className="text-rose-400">{gain > 0 ? `+${gain}` : gain}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={gain}
                onChange={e => setGain(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-400"
              />
            </div>
          </div>
        </div>

        {/* DaVinci Resolve Node Workflows Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>DaVinci Resolve Node Pipeline Architecture</span>
            </span>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-[11px] bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedNodeCategory('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedNodeCategory === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                All Tools
              </button>
              <button
                onClick={() => setSelectedNodeCategory('primary')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedNodeCategory === 'primary' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => setSelectedNodeCategory('curves')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedNodeCategory === 'curves' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Curves
              </button>
              <button
                onClick={() => setSelectedNodeCategory('advanced')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedNodeCategory === 'advanced' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Advanced
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-2.5 text-xs shadow"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">{node.name}</span>
                  <span className="capitalize px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-400">
                    {node.category}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{node.purpose}</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {node.technicalMechanism}
                </p>
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-850 text-amber-300/90 text-[11px] italic">
                  <strong className="text-amber-400 not-italic">Colorist Secret:</strong> {node.coloristSecret}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 3: Adobe Lightroom Classic Calibrations */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Adobe Lightroom Classic Professional Grading Techniques</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LIGHTROOM_WORKFLOWS.map((trick, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-2.5 text-xs shadow"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">{trick.title}</span>
                  <span className="text-[10px] font-mono text-amber-400">{trick.sliderPanel}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-lg font-mono text-cyan-300 text-[11px]">
                  {trick.action}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-slate-200">Result:</strong> {trick.result}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part 4: Subject-Specific Field Landscape Recipes */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mountain className="w-4 h-4 text-emerald-400" />
              <span>Subject-Specific Landscape Recipes (Field Practice &amp; Post-Production)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {SUBJECT_LANDSCAPE_RECIPES.map(recipe => (
              <div
                key={recipe.id}
                className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-3 text-xs shadow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm">{recipe.environment}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Field Recipe</span>
                  </div>
                  <div className="text-[11px] text-rose-300/90 bg-rose-950/30 p-2 rounded border border-rose-900/30">
                    <strong>Challenge:</strong> {recipe.keyChallenge}
                  </div>
                  <div className="space-y-1.5 text-slate-300 text-[11px]">
                    <div>
                      <strong className="text-white">Hue Shift:</strong> {recipe.hueShifts}
                    </div>
                    <div>
                      <strong className="text-white">Luminance:</strong> {recipe.luminanceAdjustments}
                    </div>
                    <div>
                      <strong className="text-white">Contrast:</strong> {recipe.contrastGrading}
                    </div>
                    <div>
                      <strong className="text-white">Split Tone:</strong> {recipe.splitToningRecipe}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850 text-amber-300/90 text-[11px] italic mt-2">
                  <strong className="text-amber-400 not-italic">Pro-Tip:</strong> {recipe.proTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
