import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SKIN_ETHNICITY_PRESETS,
  SkinEthnicityPreset,
} from '../data/skinToneData';
import {
  analyzeSkinSamples,
  LightingCondition,
  DesiredAesthetic,
  isSkinPixel,
  SkinAnalysisResult,
} from '../utils/skinToneAnalysis';
import { RGB, rgbToHex } from '../utils/colorMath';
import {
  Upload,
  User,
  Sliders,
  AlertCircle,
  Layers,
  Sparkles,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { PostProductionSoftwareGuide } from './PostProductionSoftwareGuide';

export const SkinToneSection: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('caucasian_fair');
  const [selectedLighting, setSelectedLighting] = useState<LightingCondition>('golden_hour');
  const [selectedAesthetic, setSelectedAesthetic] = useState<DesiredAesthetic>('teal_and_orange');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [customPixelSamples, setCustomPixelSamples] = useState<RGB[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset: SkinEthnicityPreset =
    SKIN_ETHNICITY_PRESETS.find(p => p.id === selectedPresetId) || SKIN_ETHNICITY_PRESETS[0];

  // Active samples to analyze: custom image or preset cluster
  const activeSamples: RGB[] = customPixelSamples || selectedPreset.sampleCluster;

  // Analysis result
  const analysis: SkinAnalysisResult = useMemo(() => {
    return analyzeSkinSamples(activeSamples, selectedLighting, selectedAesthetic);
  }, [activeSamples, selectedLighting, selectedAesthetic]);

  // Handle image upload and client-side pixel extraction
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        // Sample image onto a downscaled canvas
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsAnalyzing(false);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample skin pixels
        const detectedSkin: RGB[] = [];
        // Step with stride to sample ~300-600 representative pixels
        const stride = 4 * 4; // every 4th pixel
        for (let i = 0; i < data.length; i += stride) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (isSkinPixel(r, g, b)) {
            detectedSkin.push({ r, g, b });
          }
        }

        if (detectedSkin.length > 0) {
          // Keep up to 400 points
          const sampled = detectedSkin.filter((_, idx) => idx % Math.max(1, Math.floor(detectedSkin.length / 350)) === 0);
          setCustomPixelSamples(sampled);
          setUploadedImageUrl(event.target?.result as string);
        } else {
          // If no pure skin pixel detected (e.g. cartoon), sample general warm pixels
          alert('Could not detect distinct human skin tones in this image. Falling back to preset skin analysis.');
        }
        setIsAnalyzing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResetToPreset = (preset: SkinEthnicityPreset) => {
    setSelectedPresetId(preset.id);
    setUploadedImageUrl(null);
    setCustomPixelSamples(null);
  };

  // Vectorscope SVG dimensions
  const scopeSize = 280;
  const scopeCenter = scopeSize / 2;
  const scopeRadius = (scopeSize / 2) - 18;

  // 135° Skin Tone Line end coordinate on vectorscope
  // Standard Rec.709 skin tone vector sits at 135° (or 10:30 on the clock)
  const skinLineRad = (135 * Math.PI) / 180;
  const skinLineX = scopeCenter + Math.cos(skinLineRad) * (scopeRadius * 0.95);
  const skinLineY = scopeCenter - Math.sin(skinLineRad) * (scopeRadius * 0.95);

  // Color targets on vectorscope (Red, Magenta, Blue, Cyan, Green, Yellow)
  const targets = [
    { label: 'R', angle: 104, color: '#ef4444' },
    { label: 'Mg', angle: 61, color: '#ec4899' },
    { label: 'B', angle: 347, color: '#3b82f6' },
    { label: 'Cy', angle: 284, color: '#06b6d4' },
    { label: 'G', angle: 241, color: '#10b981' },
    { label: 'Yl', angle: 167, color: '#eab308' },
  ];

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <span>05</span>
          <span aria-hidden="true">·</span>
          <span>Melanin Science, Scopes &amp; Ethnicity Precision</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Natural Human Skin Tones &amp; Vectorscope Analyzer
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
          Upload an image or select representative melanin profiles to analyze skin tones against
          the broadcast standard 135° Vectorscope Skin Tone Line. Receive customized DaVinci
          Resolve node trees and Lightroom corrections tailored to your lighting conditions.
        </p>
      </div>

      {/* Ethnicity & Image Input Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-300">
            Select Melanin Spectrum Preset or Upload Image:
          </span>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Portrait Photo</span>
            </button>
            {uploadedImageUrl && (
              <button
                onClick={() => handleResetToPreset(selectedPreset)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
                title="Reset to ethnicity preset"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Melanin Ethnicity Swatch Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SKIN_ETHNICITY_PRESETS.map(preset => {
            const isSelected = selectedPresetId === preset.id && !uploadedImageUrl;
            return (
              <button
                key={preset.id}
                onClick={() => handleResetToPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-slate-800 border-slate-700 shadow-md ring-1 ring-slate-600'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-4 h-4 rounded-full shadow"
                    style={{ backgroundColor: preset.representativeHex }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">{preset.fitzpatrickScale}</span>
                </div>
                <div>
                  <div className="font-semibold text-xs text-white truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{preset.targetIreRange.split(' ')[0]} IRE</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Interactive Vectorscope & Grading Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Authentic Broadcast Vectorscope (SVG) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Broadcast Vectorscope (Rec.709)</span>
            </span>
            <div className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              I-Line: 135°
            </div>
          </div>

          {/* Vectorscope Display */}
          <div className="flex justify-center select-none py-1">
            <svg
              width={scopeSize}
              height={scopeSize}
              className="rounded-full bg-slate-950 border-2 border-slate-800 shadow-2xl"
            >
              {/* Polar Grid Rings */}
              <circle
                cx={scopeCenter}
                cy={scopeCenter}
                r={scopeRadius * 0.25}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
              <circle
                cx={scopeCenter}
                cy={scopeCenter}
                r={scopeRadius * 0.5}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
              <circle
                cx={scopeCenter}
                cy={scopeCenter}
                r={scopeRadius * 0.75}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
              <circle
                cx={scopeCenter}
                cy={scopeCenter}
                r={scopeRadius}
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Crosshairs */}
              <line
                x1={scopeCenter - scopeRadius}
                y1={scopeCenter}
                x2={scopeCenter + scopeRadius}
                y2={scopeCenter}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <line
                x1={scopeCenter}
                y1={scopeCenter - scopeRadius}
                x2={scopeCenter}
                y2={scopeCenter + scopeRadius}
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* Color Target Boxes (R, Mg, B, Cy, G, Yl) */}
              {targets.map(t => {
                const rad = (t.angle * Math.PI) / 180;
                const dist = scopeRadius * 0.75;
                const tx = scopeCenter + Math.cos(rad) * dist;
                const ty = scopeCenter - Math.sin(rad) * dist;

                return (
                  <g key={t.label} transform={`translate(${tx}, ${ty})`}>
                    <rect
                      x="-7"
                      y="-7"
                      width="14"
                      height="14"
                      fill="none"
                      stroke={t.color}
                      strokeWidth="1.2"
                      opacity="0.7"
                    />
                    <text
                      dy="3.5"
                      textAnchor="middle"
                      className="text-[8px] font-mono font-bold fill-slate-400 select-none"
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}

              {/* THE SACRED 135° SKIN TONE LINE (I-LINE) */}
              <line
                x1={scopeCenter}
                y1={scopeCenter}
                x2={skinLineX}
                y2={skinLineY}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                opacity={0.95}
              />
              <text
                x={skinLineX - 4}
                y={skinLineY - 4}
                textAnchor="end"
                className="text-[9px] font-mono font-bold fill-amber-400"
              >
                Skin Line (135°)
              </text>

              {/* Scatter Plot Points of Real Analyzed Skin Samples */}
              {analysis.points.map((pt, idx) => {
                const px = scopeCenter + pt.x * (scopeRadius * 0.85);
                const py = scopeCenter + pt.y * (scopeRadius * 0.85);
                return (
                  <circle
                    key={idx}
                    cx={px}
                    cy={py}
                    r={2.2}
                    fill={`rgb(${pt.r}, ${pt.g}, ${pt.b})`}
                    opacity={0.85}
                  />
                );
              })}

              {/* Median Skin Vector Indicator */}
              {(() => {
                const medianRad = (analysis.medianAngle * Math.PI) / 180;
                const medX = scopeCenter + Math.cos(medianRad) * (scopeRadius * 0.65);
                const medY = scopeCenter - Math.sin(medianRad) * (scopeRadius * 0.65);

                return (
                  <g>
                    <line
                      x1={scopeCenter}
                      y1={scopeCenter}
                      x2={medX}
                      y2={medY}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={medX}
                      cy={medY}
                      r={4.5}
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Scopes Telemetry Readout */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Median Angle</span>
              <div className="font-bold text-white text-sm mt-0.5 font-mono">
                {analysis.medianAngle}°
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Skin Deviation</span>
              <div
                className={`font-bold text-sm mt-0.5 font-mono ${
                  Math.abs(analysis.skinLineDeviation) <= 3
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {analysis.skinLineDeviation > 0
                  ? `+${analysis.skinLineDeviation}° Yl`
                  : `${analysis.skinLineDeviation}° Mg`}
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Luminance</span>
              <div className="font-bold text-cyan-300 text-sm mt-0.5 font-mono">
                {analysis.averageIre} IRE
              </div>
            </div>
          </div>

          {/* Skin Rule of Thumb */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">The Universal Biological Constant:</strong> Regardless of
            ethnicity or race, human blood hemoglobin places natural skin color along the exact
            same 135° vectorscope line. Melanin levels primarily modulate <em>Luminance (IRE)</em>{' '}
            and <em>Saturation</em>, not the fundamental hue angle.
          </div>
        </div>

        {/* Right Column: Contextual Color Grading Recommendations */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-7 space-y-6 shadow-xl">
            {/* Aesthetic & Lighting Configuration Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-800 pb-5">
              {/* Lighting Condition */}
              <div className="space-y-1.5">
                <label htmlFor="lightingConditionSelect" className="text-xs font-semibold text-slate-300">
                  Current / Shooting Lighting:
                </label>
                <select
                  id="lightingConditionSelect"
                  value={selectedLighting}
                  onChange={e => setSelectedLighting(e.target.value as LightingCondition)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="golden_hour">Golden Hour (3000K-3800K)</option>
                  <option value="blue_hour">Blue Hour / Twilight (7000K-10000K)</option>
                  <option value="midday">Midday Direct Overhead Sun (5500K)</option>
                  <option value="overcast">Overcast / High Diffusion (6500K)</option>
                  <option value="tungsten">Tungsten Incandescent (2700K-3200K)</option>
                  <option value="fluorescent_led">Mixed Industrial LED / Fluorescent (+Green Spike)</option>
                </select>
              </div>

              {/* Desired Aesthetic */}
              <div className="space-y-1.5">
                <label htmlFor="desiredAestheticSelect" className="text-xs font-semibold text-slate-300">
                  Desired Color Grade Aesthetic:
                </label>
                <select
                  id="desiredAestheticSelect"
                  value={selectedAesthetic}
                  onChange={e => setSelectedAesthetic(e.target.value as DesiredAesthetic)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="natural_broadcast">Natural Broadcast Accuracy</option>
                  <option value="teal_and_orange">Cinematic Teal &amp; Orange (Blockbuster)</option>
                  <option value="nordic_noir">Moody Nordic Noir / Desaturated</option>
                  <option value="vintage_kodak">Warm Vintage Kodak 2383 Film Print</option>
                  <option value="bleach_bypass">Bleach Bypass / High Dynamic Punch</option>
                </select>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Detected Complexion: {analysis.skinCategoryEstimate}</span>
                </span>
                <span className="font-mono text-cyan-300">
                  Samples: {analysis.sampleCount} px
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">{analysis.recommendations.summary}</p>
            </div>

            {/* DaVinci Resolve 5-Node Architecture Recipe */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>DaVinci Resolve Node-by-Node Skin Protection Recipe</span>
              </span>

              <div className="space-y-2 text-xs">
                {Object.entries(analysis.recommendations.davinciWorkflow).map(([nodeKey, instruction]) => (
                  <div
                    key={nodeKey}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/70 text-slate-300 leading-relaxed"
                  >
                    <span className="font-mono text-cyan-400 font-semibold mr-1.5">
                      {instruction.split(']')[0]}]
                    </span>
                    <span>{instruction.split(']')[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Adobe Lightroom Adjustments & Precautions */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Lightroom Classic Precise Corrections</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-white">White Balance &amp; Tint</div>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {analysis.recommendations.lightroomCorrections.temperatureTint}
                  </p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-white">HSL Sliders (Orange &amp; Red)</div>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {analysis.recommendations.lightroomCorrections.hslAdjustment}
                  </p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-white">3-Way Color Grading Wheels</div>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {analysis.recommendations.lightroomCorrections.colorGradingWheel}
                  </p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-white">Calibration Tab Secret</div>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {analysis.recommendations.lightroomCorrections.calibrationTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Precautions */}
            {analysis.recommendations.keyPrecautions.length > 0 && (
              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Colorist Warnings &amp; Exposure Hazards</span>
                </div>
                <ul className="list-disc list-inside text-amber-200/80 space-y-1">
                  {analysis.recommendations.keyPrecautions.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Software Grading & Export Guide for Analyzed Skin Tone */}
      <PostProductionSoftwareGuide
        selectedColor={rgbToHex(analysis.averageRgb.r, analysis.averageRgb.g, analysis.averageRgb.b)}
        colorName={`${selectedPreset.name} Skin Tone`}
        secondaryColor="#0c1626"
        contextTitle={`How to Grade & Protect "${selectedPreset.name}" on the 135° I-Line`}
      />
    </section>
  );
};
