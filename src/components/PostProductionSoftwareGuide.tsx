/**
 * Universal Post-Production Software Guide Component
 * Automatically adapts to ANY selected color in any section or page of the application,
 * generating exact DaVinci Resolve Studio and Adobe Lightroom Classic color grading settings,
 * 3D LUTs (.CUBE), and Lightroom presets (.XMP) across 4 professional grading styles.
 */

import React, { useState, useMemo } from 'react';
import {
  deriveSoftwareGradingFromColor,
  GradingStyle,
  GRADING_STYLE_OPTIONS,
  ResolveGradeSettings,
  LightroomGradeSettings,
} from '../utils/softwareColorGradingMath';
import { downloadFile, ColorRecipe, generateCubeLut, generateLightroomXmp, generateAseBuffer } from '../utils/exporters';
import { downloadLookBookPdf } from '../utils/pdfLookBookGenerator';
import {
  Film,
  Camera,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Palette,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';

interface PostProductionSoftwareGuideProps {
  selectedColor: string; // Current active color hex in the section/page
  colorName?: string;
  secondaryColor?: string;
  contextTitle?: string;
  defaultExpanded?: boolean;
}

export const PostProductionSoftwareGuide: React.FC<PostProductionSoftwareGuideProps> = ({
  selectedColor,
  colorName = 'Selected Color',
  secondaryColor,
  contextTitle,
  defaultExpanded = true,
}) => {
  const [activeTab, setActiveTab] = useState<'davinci' | 'lightroom' | 'export'>('davinci');
  const [selectedStyle, setSelectedStyle] = useState<GradingStyle>('theatrical');
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [copiedResolve, setCopiedResolve] = useState<boolean>(false);
  const [copiedLightroom, setCopiedLightroom] = useState<boolean>(false);
  const [copiedNodeIndex, setCopiedNodeIndex] = useState<number | null>(null);

  // Derive dynamic software values from the selected color and active style
  const { resolve, lightroom } = useMemo(() => {
    return deriveSoftwareGradingFromColor(selectedColor, colorName, secondaryColor, selectedStyle);
  }, [selectedColor, colorName, secondaryColor, selectedStyle]);

  // Export dynamically generated 3D LUT (.CUBE) for this exact selected color and style
  const handleExportCube = () => {
    const dummyRecipe: ColorRecipe = {
      id: `recipe_${Date.now()}`,
      name: `${colorName} (${resolve.styleLabel})`,
      category: 'Software Preset',
      harmonyType: 'cinematic',
      swatches: [
        { name: 'Midtones (Key)', hex: selectedColor },
        { name: 'Shadows (Opponent)', hex: secondaryColor || '#0a192f' },
        { name: 'Highlights (Sheen)', hex: '#fffbeb' },
      ],
      createdAt: new Date().toISOString(),
    };
    const cube = generateCubeLut(dummyRecipe);
    const blob = new Blob([cube], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, `${colorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${selectedStyle}_3dlut.cube`);
  };

  // Export dynamically generated Lightroom Preset (.XMP)
  const handleExportXmp = () => {
    const dummyRecipe: ColorRecipe = {
      id: `xmp_${Date.now()}`,
      name: `${colorName} (${lightroom.styleLabel})`,
      category: 'Software Preset',
      harmonyType: 'cinematic',
      swatches: [
        { name: 'Key', hex: selectedColor },
        { name: 'Shadows', hex: secondaryColor || '#0a192f' },
        { name: 'Highlights', hex: '#fffbeb' },
      ],
      createdAt: new Date().toISOString(),
    };
    const xmp = generateLightroomXmp(dummyRecipe);
    const blob = new Blob([xmp], { type: 'application/rdf+xml;charset=utf-8' });
    downloadFile(blob, `${colorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${selectedStyle}.xmp`);
  };

  // Export Production Look Book PDF
  const handleExportPdf = () => {
    downloadLookBookPdf({
      title: `${colorName} Look Book`,
      category: `${resolve.styleLabel} Grading Sheet`,
      primaryHex: selectedColor,
      secondaryHex: secondaryColor,
      swatches: [
        { name: 'Midtones (Key)', hex: selectedColor },
        { name: 'Shadows (Opponent)', hex: secondaryColor || '#0a192f' },
        { name: 'Highlights (Sheen)', hex: '#fffbeb' },
      ],
      resolve,
      lightroom,
      lightingRecipe: {
        key: selectedStyle === 'scotopic_night' ? 'Tungsten 2800K lantern / neon sign accent' : 'Key light filtered through 1/2 Grid Cloth',
        fill: selectedStyle === 'scotopic_night' ? 'Cool 7500K moonlight bounce off ultrabounce' : 'Subtle ambient fill with beadboard',
        practicals: 'Tungsten 2700K practical halogen lamps',
        ratio: selectedStyle === 'scotopic_night' ? '1:8 High-Contrast Noir Ratio' : '1:4 Cinematic Ratio',
      },
    });
  };

  // Export Adobe Swatch Exchange (.ASE)
  const handleExportAse = () => {
    const swatches = [
      { name: `${colorName} Key`, hex: selectedColor },
      { name: 'Opponent Shadow', hex: secondaryColor || '#0a192f' },
      { name: 'Highlight Sheen', hex: '#fffbeb' },
    ];
    const buffer = generateAseBuffer(colorName, swatches);
    const blob = new Blob([buffer as unknown as BlobPart], { type: 'application/octet-stream' });
    downloadFile(blob, `${colorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ase`);
  };

  // Export JSON Recipe
  const handleExportJson = () => {
    const data = {
      colorName,
      sourceHex: selectedColor,
      style: selectedStyle,
      resolve,
      lightroom,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadFile(blob, `${colorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_grade.json`);
  };

  // Copy DaVinci numbers to clipboard
  const handleCopyResolve = () => {
    const text = `DaVinci Resolve Grade Settings for ${colorName} (${selectedColor}) [Style: ${resolve.styleLabel}]:
White Balance: ${resolve.kelvin}K | Tint: ${resolve.tint > 0 ? '+' : ''}${resolve.tint} | Offset Lum: ${resolve.offset.lum} IRE
Lift (Shadows): R=${resolve.lift.r > 0 ? '+' : ''}${resolve.lift.r}, G=${resolve.lift.g > 0 ? '+' : ''}${resolve.lift.g}, B=${resolve.lift.b > 0 ? '+' : ''}${resolve.lift.b} | Lum=${resolve.lift.lum} IRE
Gamma (Midtones): R=${resolve.gamma.r > 0 ? '+' : ''}${resolve.gamma.r}, G=${resolve.gamma.g > 0 ? '+' : ''}${resolve.gamma.g}, B=${resolve.gamma.b > 0 ? '+' : ''}${resolve.gamma.b} | Lum=${resolve.gamma.lum} IRE
Gain (Highlights): R=${resolve.gain.r > 0 ? '+' : ''}${resolve.gain.r}, G=${resolve.gain.g > 0 ? '+' : ''}${resolve.gain.g}, B=${resolve.gain.b > 0 ? '+' : ''}${resolve.gain.b} | Lum=${resolve.gain.lum} IRE
Log Wheels: Low Range Cutoff ${resolve.logWheels.shadow.rangeLow} | High Range Cutoff ${resolve.logWheels.highlight.rangeHigh}
Contrast: ${resolve.contrast.toFixed(2)} | Pivot: ${resolve.pivot} | Saturation: ${resolve.saturationPercent}%
Hue vs Sat Target: ${resolve.hslQualifier.targetHue} (+${resolve.hslQualifier.satDelta}%)
Curves Tip: ${resolve.curvesTip}`;

    navigator.clipboard.writeText(text);
    setCopiedResolve(true);
    setTimeout(() => setCopiedResolve(false), 2500);
  };

  // Copy Lightroom numbers to clipboard
  const handleCopyLightroom = () => {
    const text = `Adobe Lightroom Classic Settings for ${colorName} (${selectedColor}) [Style: ${lightroom.styleLabel}]:
Basic Panel:
- Temperature: ${lightroom.tempSlider > 0 ? '+' : ''}${lightroom.tempSlider}
- Tint: ${lightroom.tintSlider > 0 ? '+' : ''}${lightroom.tintSlider}
- Exposure: ${lightroom.exposureDelta > 0 ? '+' : ''}${lightroom.exposureDelta} EV
- Contrast: +${lightroom.contrastSlider}
- Highlights: ${lightroom.highlightsSlider} | Shadows: ${lightroom.shadowsSlider > 0 ? '+' : ''}${lightroom.shadowsSlider}
- Whites: ${lightroom.whitesSlider > 0 ? '+' : ''}${lightroom.whitesSlider} | Blacks: ${lightroom.blacksSlider > 0 ? '+' : ''}${lightroom.blacksSlider}
- Clarity: ${lightroom.claritySlider > 0 ? '+' : ''}${lightroom.claritySlider} | Vibrance: +${lightroom.vibranceSlider}
Color Grading (3-Way Split Toning):
- Shadows: Hue ${lightroom.colorGrading.shadows.hue}° · Sat ${lightroom.colorGrading.shadows.sat}% · Lum ${lightroom.colorGrading.shadows.lum}
- Midtones: Hue ${lightroom.colorGrading.midtones.hue}° · Sat ${lightroom.colorGrading.midtones.sat}% · Lum ${lightroom.colorGrading.midtones.lum}
- Highlights: Hue ${lightroom.colorGrading.highlights.hue}° · Sat ${lightroom.colorGrading.highlights.sat}% · Lum ${lightroom.colorGrading.highlights.lum}
- Blending: ${lightroom.colorGrading.blending} | Balance: ${lightroom.colorGrading.balance > 0 ? '+' : ''}${lightroom.colorGrading.balance}
Color Mixer (HSL):
- Channel: ${lightroom.hslTarget.channel} (Saturation: +${lightroom.hslTarget.satOffset}, Luminance: +${lightroom.hslTarget.lumOffset})
Calibration:
- Red Primary: Hue ${lightroom.calibration.redPrimaryHue}, Sat +${lightroom.calibration.redPrimarySat}
- Blue Primary: Hue ${lightroom.calibration.bluePrimaryHue}, Sat +${lightroom.calibration.bluePrimarySat}
Masking Tip: ${lightroom.maskingTip}`;

    navigator.clipboard.writeText(text);
    setCopiedLightroom(true);
    setTimeout(() => setCopiedLightroom(false), 2500);
  };

  // Copy individual node instruction
  const handleCopyNode = (index: number, node: ResolveGradeSettings['nodePipeline'][0]) => {
    const text = `DaVinci Resolve Node ${node.nodeNum} (${node.label}):\nTool: ${node.toolType}\nSetting: ${node.setting}\nRationale: ${node.rationale}`;
    navigator.clipboard.writeText(text);
    setCopiedNodeIndex(index);
    setTimeout(() => setCopiedNodeIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6 space-y-4 shadow-xl text-xs mt-6">
      {/* Title Bar & Collapsible Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-md shadow border border-white/30 shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {contextTitle || `How to Create "${colorName}" in DaVinci Resolve & Lightroom`}
              </span>
              <span className="font-mono text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                {selectedColor.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive post-production recreation guide dynamically mapped to your selected color
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Software Mode Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('davinci');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'davinci'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>DaVinci Resolve</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('lightroom');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'lightroom'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Adobe Lightroom</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('export');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'export'
                  ? 'bg-slate-800 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Downloads</span>
            </button>
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors border border-slate-700"
            title={isExpanded ? 'Collapse guide' : 'Expand guide'}
            aria-label={isExpanded ? 'Collapse post-production guide' : 'Expand post-production guide'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Style / Aesthetic Selector Buttons */}
      {isExpanded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-300">Grading Intent / Style:</span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5">
            {GRADING_STYLE_OPTIONS.map(opt => {
              const isActive = selectedStyle === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedStyle(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all text-left sm:text-center ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                  title={opt.description}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="space-y-4 pt-1 animate-fade-in">
          {/* TAB 1: DAVINCI RESOLVE */}
          {activeTab === 'davinci' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                <p className="text-[11px] leading-relaxed">
                  In DaVinci Resolve’s <strong>Color Page</strong>, configure your Primary Wheels, Log Wheels, and S-Curves for{' '}
                  <strong className="text-white">{resolve.styleLabel}</strong>:
                </p>
                <button
                  onClick={handleCopyResolve}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors shrink-0 text-xs self-start sm:self-auto"
                >
                  {copiedResolve ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Resolve Values!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy All Resolve Values</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3-Way Primary Wheels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Lift (Shadows) */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                      1. Lift (Shadows)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">0 – 25 IRE</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>
                      R: <span className="text-white font-bold">{resolve.lift.r > 0 ? `+${resolve.lift.r}` : resolve.lift.r}</span>
                    </div>
                    <div>
                      G: <span className="text-white font-bold">{resolve.lift.g > 0 ? `+${resolve.lift.g}` : resolve.lift.g}</span>
                    </div>
                    <div>
                      B: <span className="text-white font-bold">{resolve.lift.b > 0 ? `+${resolve.lift.b}` : resolve.lift.b}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-850 pt-1">
                    Master Lum: <strong className="text-cyan-400 font-mono">{resolve.lift.lum} IRE</strong>
                    <br />
                    Hue Angle: <span className="text-slate-300 font-mono">{resolve.lift.hueDeg}° (Opponent)</span>
                  </div>
                </div>

                {/* Gamma (Midtones) */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      2. Gamma (Midtones)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">25 – 75 IRE</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>
                      R: <span className="text-white font-bold">{resolve.gamma.r > 0 ? `+${resolve.gamma.r}` : resolve.gamma.r}</span>
                    </div>
                    <div>
                      G: <span className="text-white font-bold">{resolve.gamma.g > 0 ? `+${resolve.gamma.g}` : resolve.gamma.g}</span>
                    </div>
                    <div>
                      B: <span className="text-white font-bold">{resolve.gamma.b > 0 ? `+${resolve.gamma.b}` : resolve.gamma.b}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-850 pt-1">
                    Master Lum: <strong className="text-amber-400 font-mono">{resolve.gamma.lum} IRE</strong>
                    <br />
                    Key Vector: <span className="text-slate-300 font-mono">{resolve.gamma.hueDeg}° (Target)</span>
                  </div>
                </div>

                {/* Gain (Highlights) */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">
                      3. Gain (Highlights)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">75 – 100 IRE</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>
                      R: <span className="text-white font-bold">{resolve.gain.r > 0 ? `+${resolve.gain.r}` : resolve.gain.r}</span>
                    </div>
                    <div>
                      G: <span className="text-white font-bold">{resolve.gain.g > 0 ? `+${resolve.gain.g}` : resolve.gain.g}</span>
                    </div>
                    <div>
                      B: <span className="text-white font-bold">{resolve.gain.b > 0 ? `+${resolve.gain.b}` : resolve.gain.b}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-850 pt-1">
                    Master Lum: <strong className="text-rose-400 font-mono">{resolve.gain.lum} IRE</strong>
                    <br />
                    Sheen Sat: <span className="text-slate-300 font-mono">{resolve.gain.satPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Log Wheels & Precision Range Row */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>DaVinci Log Wheels Mode (Precision Zone Grading)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Tonal Zone Isolations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div>
                    <span className="text-slate-400">Shadow Log Range:</span>{' '}
                    <strong className="text-white font-mono">{resolve.logWheels.shadow.rangeLow}</strong> (Low cutoff)
                  </div>
                  <div>
                    <span className="text-slate-400">Highlight Log Range:</span>{' '}
                    <strong className="text-white font-mono">{resolve.logWheels.highlight.rangeHigh}</strong> (High cutoff)
                  </div>
                  <div>
                    <span className="text-slate-400">Contrast Pivot:</span>{' '}
                    <strong className="text-amber-400 font-mono">{resolve.pivot}</strong> (Midtone anchor)
                  </div>
                </div>
              </div>

              {/* White Balance & S-Curve Values */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400">White Balance CCT:</span>{' '}
                  <strong className="text-white font-mono">{resolve.kelvin}K</strong>
                </div>
                <div>
                  <span className="text-slate-400">Tint (Duv offset):</span>{' '}
                  <strong className="text-white font-mono">
                    {resolve.tint > 0 ? `+${resolve.tint} (Magenta)` : resolve.tint < 0 ? `${resolve.tint} (Green)` : '0 (Neutral)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Film Contrast S-Curve:</span>{' '}
                  <strong className="text-amber-400 font-mono">{resolve.contrast.toFixed(2)}x</strong>
                </div>
              </div>

              {/* 5-Node Hollywood Serial Pipeline Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recommended 5-Node Hollywood Pipeline for this Grade</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Node Tree Architecture</span>
                </div>

                <div className="space-y-1.5">
                  {resolve.nodePipeline.map((node, idx) => (
                    <div
                      key={node.nodeNum}
                      className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-[10px] flex items-center justify-center">
                            N{node.nodeNum}
                          </span>
                          <span className="font-bold text-white text-xs">{node.label}</span>
                          <span className="text-[10px] font-mono text-slate-400">[{node.toolType}]</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-mono pl-7">{node.setting}</p>
                        <p className="text-[10px] text-slate-400 pl-7">{node.rationale}</p>
                      </div>

                      <button
                        onClick={() => handleCopyNode(idx, node)}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] flex items-center gap-1 self-start sm:self-auto shrink-0 transition-colors"
                        title="Copy node instructions"
                      >
                        {copiedNodeIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copy Node</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curves Tip */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-slate-300 flex items-start gap-2 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300">Curve Tip:</strong> {resolve.curvesTip}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADOBE LIGHTROOM */}
          {activeTab === 'lightroom' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                <p className="text-[11px] leading-relaxed">
                  In Adobe Lightroom Classic’s <strong>Develop Module (Shortcut D)</strong>, apply these sliders for{' '}
                  <strong className="text-white">{lightroom.styleLabel}</strong>:
                </p>
                <button
                  onClick={handleCopyLightroom}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors shrink-0 text-xs self-start sm:self-auto"
                >
                  {copiedLightroom ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Lightroom Values!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy All Lightroom Settings</span>
                    </>
                  )}
                </button>
              </div>

              {/* Basic, Color Grading, and Calibration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Basic Panel Sliders */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block border-b border-slate-850 pb-1.5">
                    1. Basic Panel
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Temp:</span>
                      <strong className="text-white">{lightroom.tempSlider > 0 ? `+${lightroom.tempSlider}` : lightroom.tempSlider}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tint:</span>
                      <strong className="text-white">{lightroom.tintSlider > 0 ? `+${lightroom.tintSlider}` : lightroom.tintSlider}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Exposure:</span>
                      <strong className="text-cyan-400">{lightroom.exposureDelta > 0 ? `+${lightroom.exposureDelta}` : lightroom.exposureDelta} EV</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Contrast:</span>
                      <strong className="text-amber-400">+{lightroom.contrastSlider}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Highlights:</span>
                      <strong className="text-slate-400">{lightroom.highlightsSlider}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Shadows:</span>
                      <strong className="text-slate-300">{lightroom.shadowsSlider > 0 ? `+${lightroom.shadowsSlider}` : lightroom.shadowsSlider}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Whites / Blacks:</span>
                      <strong className="text-slate-300">{lightroom.whitesSlider} / {lightroom.blacksSlider}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Clarity / Vibrance:</span>
                      <strong className="text-slate-300">{lightroom.claritySlider} / +{lightroom.vibranceSlider}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Color Grading Wheels */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block border-b border-slate-850 pb-1.5">
                    2. Color Grading (3-Way)
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                    <div>
                      <span className="text-cyan-400">Shadows:</span> Hue {lightroom.colorGrading.shadows.hue}° · Sat {lightroom.colorGrading.shadows.sat}% · Lum {lightroom.colorGrading.shadows.lum}
                    </div>
                    <div>
                      <span className="text-amber-400">Midtones:</span> Hue {lightroom.colorGrading.midtones.hue}° · Sat {lightroom.colorGrading.midtones.sat}% · Lum {lightroom.colorGrading.midtones.lum}
                    </div>
                    <div>
                      <span className="text-rose-400">Highlights:</span> Hue {lightroom.colorGrading.highlights.hue}° · Sat {lightroom.colorGrading.highlights.sat}% · Lum {lightroom.colorGrading.highlights.lum}
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-850">
                      Blending: {lightroom.colorGrading.blending} · Balance: {lightroom.colorGrading.balance > 0 ? `+${lightroom.colorGrading.balance}` : lightroom.colorGrading.balance}
                    </div>
                  </div>
                </div>

                {/* 3. Color Mixer / Calibration */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block border-b border-slate-850 pb-1.5">
                    3. HSL &amp; Calibration
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div>
                      Target Channel: <strong className="text-cyan-300">{lightroom.hslTarget.channel}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Saturation:</span>
                      <strong className="text-white">+{lightroom.hslTarget.satOffset}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Luminance:</span>
                      <strong className="text-white">+{lightroom.hslTarget.lumOffset}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-850 space-y-0.5">
                      <div>Red Primary Sat: +{lightroom.calibration.redPrimarySat}</div>
                      <div>Blue Primary Sat: +{lightroom.calibration.bluePrimarySat}</div>
                      <div>Tone Curve Darks: {lightroom.toneCurve.darks > 0 ? `+${lightroom.toneCurve.darks}` : lightroom.toneCurve.darks}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Masking Recommendation Tip */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 text-slate-300 flex items-start gap-2 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Masking &amp; Lighting Tip:</strong> {lightroom.maskingTip}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOADABLE FORMATS (PDF, CUBE, XMP, ASE, JSON) */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Download production-ready color calibration files for <strong className="text-white">{colorName}</strong> (<span className="font-mono text-cyan-300 font-bold">{selectedColor}</span>):
                </p>
                <span className="text-[10px] font-mono text-slate-400">
                  5 Downloadable Formats Available
                </span>
              </div>

              {/* Featured: PDF Production Look Book */}
              <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-slate-950/80 to-indigo-950/40 rounded-xl border border-cyan-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">
                      FEATURED
                    </span>
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Production Look Book &amp; Lighting Sheet (.PDF)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 max-w-xl">
                    High-resolution printable PDF cheat sheet containing complete DaVinci Resolve 3-Way coordinates, 5-node pipeline, Adobe Lightroom calibrations, color swatches, and on-set lighting ratios.
                  </p>
                </div>

                <button
                  onClick={handleExportPdf}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow transition-colors shrink-0 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .PDF Look Book</span>
                </button>
              </div>

              {/* 4 Format Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. 3D LUT Card */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      <span>DaVinci 3D LUT (.CUBE)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      17x17x17 3D table for Resolve, Premiere, and Final Cut Pro.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCube}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .CUBE</span>
                  </button>
                </div>

                {/* 2. Lightroom Preset Card */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lightroom Preset (.XMP)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Camera Raw develop preset with split-toning and HSL.
                    </p>
                  </div>
                  <button
                    onClick={handleExportXmp}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .XMP</span>
                  </button>
                </div>

                {/* 3. Swatches (.ASE) */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <Palette className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Adobe Swatches (.ASE)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Binary swatch palette for Photoshop, Illustrator, and InDesign.
                    </p>
                  </div>
                  <button
                    onClick={handleExportAse}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .ASE</span>
                  </button>
                </div>

                {/* 4. JSON Recipe Card */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      <span>JSON Grade Recipe</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Complete machine-readable coordinates for pipeline scripts.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJson}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
