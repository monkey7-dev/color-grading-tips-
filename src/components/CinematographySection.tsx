/**
 * Cinematography & Color Grading Masterclass Suite
 * Reconstructed into an interactive, professional-grade workstation for cinematographers
 * and colorists with Day vs Night recommendation engine, live 3-way color wheels,
 * vectorscope & RGB parade scopes, live cinema canvas with split comparison,
 * and direct 3D LUT (.CUBE) & Lightroom (.XMP) exporters.
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  DAY_CINEMA_GRADES,
  NIGHT_CINEMA_GRADES,
  FILM_STOCK_GRADES,
  STYLIZED_CINEMA_GRADES,
  ALL_RECOMMENDED_GRADES,
} from '../data/cinemaGradesData';
import {
  DAVINCI_NODE_WORKFLOWS,
  LIGHTROOM_WORKFLOWS,
  SUBJECT_LANDSCAPE_RECIPES,
} from '../data/cinematographyData';
import {
  CinemaGradeParams,
  ColorWheelVal,
  generateCinemaGradeCubeLut,
  generateCinemaGradeXmp,
  kelvinToRgb,
} from '../utils/cinematographyGradingMath';
import { downloadFile, ColorRecipe } from '../utils/exporters';
import { ThreeWayColorWheels } from './ThreeWayColorWheels';
import { CinemaScopes } from './CinemaScopes';
import { LandscapeGradingStudio } from './LandscapeGradingStudio';
import { DayToNightLab } from './DayToNightLab';
import { SoftwareGradingGuideModal } from './SoftwareGradingGuideModal';
import { PostProductionSoftwareGuide } from './PostProductionSoftwareGuide';
import { GeminiCinematicPaletteModal } from './GeminiCinematicPaletteModal';
import { SCENARIO_SOFTWARE_MANUALS } from '../data/softwareWorkflowsData';
import {
  Sun,
  Moon,
  Film,
  Camera,
  Download,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  Layers,
  Upload,
  Eye,
  Mountain,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  AlertTriangle,
} from 'lucide-react';

type WorkflowMode = 'day' | 'night' | 'day_to_night' | 'film_stock' | 'stylized' | 'landscape';

interface CinemaSampleFrame {
  id: string;
  name: string;
  timeOfDay: 'day' | 'night';
  description: string;
  svgType: 'day_mountain' | 'day_portrait' | 'night_city' | 'night_coastal' | 'interior_candle';
}

const SAMPLE_FRAMES: CinemaSampleFrame[] = [
  {
    id: 'day_mountain',
    name: 'Day Alpine Exterior',
    timeOfDay: 'day',
    description: 'Vast dynamic range with sky, mountains, and forest terrain',
    svgType: 'day_mountain',
  },
  {
    id: 'day_portrait',
    name: 'Golden Hour Portrait',
    timeOfDay: 'day',
    description: 'Actor skin tones illuminated by low-angle golden sunlight',
    svgType: 'day_portrait',
  },
  {
    id: 'night_city',
    name: 'Night Rain City (Neon)',
    timeOfDay: 'night',
    description: 'Wet asphalt reflections, neon signs, and deep dark alleyways',
    svgType: 'night_city',
  },
  {
    id: 'night_coastal',
    name: 'Moonlit Coastal Twilight',
    timeOfDay: 'night',
    description: 'Day-for-night scotopic rod vision with cool ocean reflections',
    svgType: 'night_coastal',
  },
  {
    id: 'interior_candle',
    name: 'Candlelight Chamber',
    timeOfDay: 'night',
    description: 'Intimate thermal blackbody radiation with warm face glow',
    svgType: 'interior_candle',
  },
];

export const CinematographySection: React.FC = () => {
  // Workflow mode: Day scenes vs Night scenes vs Film Stocks vs Landscape Depth
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('day');

  // Currently selected recommended grade scenario
  const [selectedGradeId, setSelectedGradeId] = useState<string>('golden_hour_magic');

  // Active Interactive 3-Way Color Wheels State
  const [activeLift, setActiveLift] = useState<ColorWheelVal>({
    r: -0.15,
    g: 0.05,
    b: 0.22,
    lum: -4,
  });
  const [activeGamma, setActiveGamma] = useState<ColorWheelVal>({
    r: 0.28,
    g: 0.12,
    b: -0.18,
    lum: 5,
  });
  const [activeGain, setActiveGain] = useState<ColorWheelVal>({
    r: 0.35,
    g: 0.18,
    b: -0.22,
    lum: 12,
  });
  const [activeOffsetLum, setActiveOffsetLum] = useState<number>(0);
  const [activeKelvin, setActiveKelvin] = useState<number>(3200);
  const [activeTint, setActiveTint] = useState<number>(4);
  const [activeContrast, setActiveContrast] = useState<number>(1.18);
  const [activeSaturation, setActiveSaturation] = useState<number>(1.22);
  const [skinToneProtection, setSkinToneProtection] = useState<boolean>(true);

  // Active Sample Frame
  const [selectedFrameId, setSelectedFrameId] = useState<string>('day_portrait');
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Split view before/after slider (0 to 100%)
  const [splitPosition, setSplitPosition] = useState<number>(50);

  // UI feedback states
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedResolveCoords, setCopiedResolveCoords] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [activeNodeFilter, setActiveNodeFilter] = useState<'all' | 'primary' | 'curves' | 'advanced'>('all');
  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState<boolean>(false);
  const [inlineSoftwareTab, setInlineSoftwareTab] = useState<'davinci' | 'lightroom'>('davinci');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);

  // Active recommended scenario object
  const activeScenario: CinemaGradeParams = useMemo(() => {
    return (
      ALL_RECOMMENDED_GRADES.find(g => g.id === selectedGradeId) || ALL_RECOMMENDED_GRADES[0]
    );
  }, [selectedGradeId]);

  // Handle switching workflow tab
  const handleSelectWorkflow = (mode: WorkflowMode) => {
    setWorkflowMode(mode);
    if (mode === 'day') {
      const first = DAY_CINEMA_GRADES[0];
      handleApplyGrade(first);
      setSelectedFrameId('day_portrait');
    } else if (mode === 'night') {
      const first = NIGHT_CINEMA_GRADES[0];
      handleApplyGrade(first);
      setSelectedFrameId('night_city');
    } else if (mode === 'film_stock') {
      const first = FILM_STOCK_GRADES[0];
      handleApplyGrade(first);
    }
  };

  // Day-to-Night Lab apply callback
  const handleApplyDayToNightToWheels = (applied: {
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
  }) => {
    setActiveKelvin(applied.kelvin);
    setActiveTint(applied.tint);
    setActiveLift({ ...applied.liftRgb, lum: applied.liftLum });
    setActiveGamma({ ...applied.gammaRgb, lum: applied.gammaLum });
    setActiveGain({ ...applied.gainRgb, lum: applied.gainLum });
    setActiveContrast(applied.contrast);
    setActiveSaturation(applied.saturation);
    setSkinToneProtection(applied.skinProtection);
    setSelectedFrameId('night_coastal');
    setWorkflowMode('night');
  };

  // 1-Click Apply recommended grade into the interactive wheels and canvas
  const handleApplyGrade = (grade: CinemaGradeParams) => {
    setSelectedGradeId(grade.id);
    setActiveLift({ ...grade.lift });
    setActiveGamma({ ...grade.gamma });
    setActiveGain({ ...grade.gain });
    setActiveOffsetLum(grade.offsetLum);
    setActiveKelvin(grade.kelvin);
    setActiveTint(grade.tint);
    setActiveContrast(grade.contrast);
    setActiveSaturation(grade.saturation);
    setSkinToneProtection(grade.skinToneProtection);
  };

  // Reset all wheels to neutral Rec.709
  const handleResetWheels = () => {
    setActiveLift({ r: 0, g: 0, b: 0, lum: 0 });
    setActiveGamma({ r: 0, g: 0, b: 0, lum: 0 });
    setActiveGain({ r: 0, g: 0, b: 0, lum: 0 });
    setActiveOffsetLum(0);
    setActiveKelvin(5500);
    setActiveTint(0);
    setActiveContrast(1.0);
    setActiveSaturation(1.0);
    setSkinToneProtection(true);
  };

  // Build current parameters package
  const currentGradeParams: CinemaGradeParams = useMemo(() => {
    return {
      id: `custom_${Date.now()}`,
      name: `${activeScenario.name} (Graded)`,
      sceneType: activeScenario.sceneType,
      timeframe: activeScenario.timeframe,
      kelvin: activeKelvin,
      tint: activeTint,
      lift: activeLift,
      gamma: activeGamma,
      gain: activeGain,
      offsetLum: activeOffsetLum,
      contrast: activeContrast,
      saturation: activeSaturation,
      skinToneProtection,
      recommendedHexes: activeScenario.recommendedHexes,
      whyItWorks: activeScenario.whyItWorks,
      lightingRecipe: activeScenario.lightingRecipe,
      resolveTip: activeScenario.resolveTip,
    };
  }, [
    activeScenario,
    activeKelvin,
    activeTint,
    activeLift,
    activeGamma,
    activeGain,
    activeOffsetLum,
    activeContrast,
    activeSaturation,
    skinToneProtection,
  ]);

  // Export as 3D LUT (.CUBE)
  const handleExportCube = () => {
    const cubeString = generateCinemaGradeCubeLut(currentGradeParams);
    const blob = new Blob([cubeString], { type: 'text/plain;charset=utf-8' });
    const filename = `${currentGradeParams.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lut.cube`;
    downloadFile(blob, filename);
  };

  // Export as Lightroom Preset (.XMP)
  const handleExportXmp = () => {
    const xmpString = generateCinemaGradeXmp(currentGradeParams);
    const blob = new Blob([xmpString], { type: 'application/rdf+xml;charset=utf-8' });
    const filename = `${currentGradeParams.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_preset.xmp`;
    downloadFile(blob, filename);
  };

  // Copy DaVinci Resolve wheel values to clipboard
  const handleCopyResolveValues = () => {
    const text = `DaVinci Resolve Grade Settings:
Scene: ${activeScenario.name} (${activeScenario.sceneType.toUpperCase()})
White Balance (CCT): ${activeKelvin}K | Tint: ${activeTint}
Lift (Shadows): R=${activeLift.r > 0 ? '+' : ''}${activeLift.r}, G=${activeLift.g > 0 ? '+' : ''}${activeLift.g}, B=${activeLift.b > 0 ? '+' : ''}${activeLift.b} | Lum=${activeLift.lum} IRE
Gamma (Midtones): R=${activeGamma.r > 0 ? '+' : ''}${activeGamma.r}, G=${activeGamma.g > 0 ? '+' : ''}${activeGamma.g}, B=${activeGamma.b > 0 ? '+' : ''}${activeGamma.b} | Lum=${activeGamma.lum} IRE
Gain (Highlights): R=${activeGain.r > 0 ? '+' : ''}${activeGain.r}, G=${activeGain.g > 0 ? '+' : ''}${activeGain.g}, B=${activeGain.b > 0 ? '+' : ''}${activeGain.b} | Lum=${activeGain.lum} IRE
Offset Master: ${activeOffsetLum} | Contrast: ${activeContrast.toFixed(2)} | Saturation: ${Math.round(activeSaturation * 100)}%
Target Palette: Shadows=${activeScenario.recommendedHexes.shadows}, Midtones=${activeScenario.recommendedHexes.midtones}, Highlights=${activeScenario.recommendedHexes.highlights}`;

    navigator.clipboard.writeText(text);
    setCopiedResolveCoords(true);
    setTimeout(() => setCopiedResolveCoords(false), 2500);
  };

  // Copy individual hex color code
  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Save current look into local library recipes
  const handleSaveToLookLibrary = () => {
    const newRecipe: ColorRecipe = {
      id: `cinema_${Date.now()}`,
      name: `${activeScenario.name} (${activeScenario.sceneType.toUpperCase()})`,
      category: 'Cinematography Grade',
      harmonyType: 'cinematic',
      swatches: [
        { name: 'Shadows (Lift)', hex: activeScenario.recommendedHexes.shadows },
        { name: 'Midtones (Gamma)', hex: activeScenario.recommendedHexes.midtones },
        { name: 'Highlights (Gain)', hex: activeScenario.recommendedHexes.highlights },
        { name: 'Accent Vector', hex: activeScenario.recommendedHexes.accent },
      ],
      description: `${activeKelvin}K CCT · Contrast ${activeContrast.toFixed(2)}x · ${activeScenario.whyItWorks.slice(0, 120)}...`,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('cm_saved_recipes');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('cm_saved_recipes', JSON.stringify([newRecipe, ...list]));
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } catch {
      // fallback
    }
  };

  // Custom frame file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Compute live SVG Color Matrix coefficients for the live video canvas
  const liveFilterMatrix = useMemo(() => {
    // Planckian Kelvin shift
    const kRgb = kelvinToRgb(activeKelvin);
    const kR = kRgb.r / 0.85;
    const kG = (kRgb.g / 0.85) * (1 - (activeTint / 100) * 0.15);
    const kB = (kRgb.b / 0.85) * (1 + (activeTint / 100) * 0.15);

    // Saturation luminance coefficients
    const sat = activeSaturation;
    const rw = 0.2126 * (1 - sat);
    const gw = 0.7152 * (1 - sat);
    const bw = 0.0722 * (1 - sat);

    // Diagonal matrix with Lift/Gain bias
    const mR = (rw + sat) * kR * (1 + activeGain.r * 0.4);
    const mG = (gw + sat) * kG * (1 + activeGain.g * 0.4);
    const mB = (bw + sat) * kB * (1 + activeGain.b * 0.4);

    // Offsets for Lift and master offset
    const offR = activeLift.r * 0.25 + (activeLift.lum + activeOffsetLum) / 250;
    const offG = activeLift.g * 0.25 + (activeLift.lum + activeOffsetLum) / 250;
    const offB = activeLift.b * 0.25 + (activeLift.lum + activeOffsetLum) / 250;

    return `
      ${mR.toFixed(3)} ${gw.toFixed(3)} ${bw.toFixed(3)} 0 ${offR.toFixed(3)}
      ${rw.toFixed(3)} ${mG.toFixed(3)} ${bw.toFixed(3)} 0 ${offG.toFixed(3)}
      ${rw.toFixed(3)} ${gw.toFixed(3)} ${mB.toFixed(3)} 0 ${offB.toFixed(3)}
      0 0 0 1 0
    `;
  }, [activeKelvin, activeTint, activeSaturation, activeGain, activeLift, activeOffsetLum]);

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Top Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
          <span>04</span>
          <span aria-hidden="true">·</span>
          <span>Hollywood Color Grading, Camera Science &amp; Lighting Workflows</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Cinematography &amp; Color Grading Suite
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed mt-1">
              A practical, interactive grading environment for cinematographers and colorists.
              Explore industry-proven color palettes for <strong>Day vs. Night scenes</strong>,
              simulate real-time 3-way color wheels, inspect live video scopes, and export production-ready
              3D LUTs (.CUBE) and Lightroom presets.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={() => setIsGeminiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md shadow-cyan-950/40 flex items-center gap-1.5 transition-all ring-1 ring-white/20"
              title="Generate cinematic color palettes from any movie mood or genre using Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>AI Mood &amp; Genre Palette (Gemini)</span>
            </button>

            <button
              onClick={handleExportCube}
              className="px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/80 shadow-md flex items-center gap-1.5 transition-colors"
              title="Download 17x17x17 3D LUT for DaVinci Resolve, Premiere Pro, Final Cut"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .CUBE LUT</span>
            </button>

            <button
              onClick={handleExportXmp}
              className="px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-800/80 shadow-md flex items-center gap-1.5 transition-colors"
              title="Download Adobe Lightroom Classic / Camera Raw .XMP Preset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .XMP</span>
            </button>

            <button
              onClick={() => setIsSoftwareModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-800/80 shadow-md flex items-center gap-1.5 transition-colors"
              title="Step-by-step guides for DaVinci Resolve & Adobe Lightroom"
            >
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              <span>Software Guide (Resolve / Lightroom)</span>
            </button>

            <button
              onClick={handleSaveToLookLibrary}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow flex items-center gap-1.5 transition-colors"
              title="Save current grade recipe into local library &amp; cloud backup"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Saved to Library!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save Look</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Workflow Mode Switcher */}
      <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1.5 overflow-x-auto shadow-lg">
        <button
          onClick={() => handleSelectWorkflow('day')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            workflowMode === 'day'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Day Scenes (5 Looks)</span>
        </button>

        <button
          onClick={() => handleSelectWorkflow('night')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            workflowMode === 'night'
              ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-md ring-1 ring-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Moon className="w-4 h-4 text-cyan-400" />
          <span>Night Scenes (5 Looks)</span>
        </button>

        <button
          onClick={() => setWorkflowMode('day_to_night')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            workflowMode === 'day_to_night'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-md ring-1 ring-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Day-to-Night Lab (Nuit Américaine)</span>
        </button>

        <button
          onClick={() => handleSelectWorkflow('film_stock')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            workflowMode === 'film_stock'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md ring-1 ring-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Film className="w-4 h-4 text-rose-400" />
          <span>Film Stocks (Kodak/Fuji)</span>
        </button>

        <button
          onClick={() => setWorkflowMode('landscape')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            workflowMode === 'landscape'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span>Atmospheric Depth Studio</span>
        </button>
      </div>

      {/* Gemini AI Mood & Genre Quick Generator Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shrink-0 mt-0.5 shadow-md shadow-cyan-900/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                Gemini AI Cinematic Palette Studio
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate custom Hollywood color palettes, DaVinci Resolve Lift/Gamma/Gain wheel coordinates, and physical lighting recipes from any movie mood, genre keyword, or director aesthetic (e.g. <em>"Cyberpunk rain"</em>, <em>"A24 folk horror"</em>, <em>"70s sun-bleached giallo"</em>).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsGeminiModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all shrink-0 self-start md:self-auto ring-1 ring-white/20"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Generate with Gemini AI</span>
        </button>
      </div>

      {/* IF LANDSCAPE STUDIO TAB IS ACTIVE */}
      {workflowMode === 'landscape' ? (
        <LandscapeGradingStudio />
      ) : workflowMode === 'day_to_night' ? (
        <DayToNightLab onApplyToWheels={handleApplyDayToNightToWheels} />
      ) : (
        <>
          {/* SCENARIO RECOMMENDATIONS STRIP */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {workflowMode === 'day' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : workflowMode === 'night' ? (
                  <Moon className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Film className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {workflowMode === 'day'
                    ? 'Recommended Color Palettes for Day Lighting'
                    : workflowMode === 'night'
                    ? 'Recommended Color Palettes for Night & Low-Light Lighting'
                    : 'Legendary Photochemical Film Stock Emulations'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Click a preset to inspect &amp; apply
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(workflowMode === 'day'
                ? DAY_CINEMA_GRADES
                : workflowMode === 'night'
                ? NIGHT_CINEMA_GRADES
                : FILM_STOCK_GRADES
              ).map(grade => {
                const isSelected = grade.id === selectedGradeId;
                return (
                  <button
                    key={grade.id}
                    onClick={() => handleApplyGrade(grade)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-slate-800 border-slate-700 shadow-xl ring-2 ring-cyan-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">{grade.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{grade.kelvin}K</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{grade.timeframe}</div>
                    </div>

                    {/* 4-Swatch Palette Preview */}
                    <div className="flex items-center gap-1 h-5 rounded-md overflow-hidden p-0.5 bg-slate-950/60 border border-slate-800">
                      <div
                        className="h-full flex-1 rounded-sm"
                        style={{ backgroundColor: grade.recommendedHexes.shadows }}
                        title={`Shadows (Lift): ${grade.recommendedHexes.shadows}`}
                      />
                      <div
                        className="h-full flex-1 rounded-sm"
                        style={{ backgroundColor: grade.recommendedHexes.midtones }}
                        title={`Midtones (Gamma): ${grade.recommendedHexes.midtones}`}
                      />
                      <div
                        className="h-full flex-1 rounded-sm"
                        style={{ backgroundColor: grade.recommendedHexes.highlights }}
                        title={`Highlights (Gain): ${grade.recommendedHexes.highlights}`}
                      />
                      <div
                        className="h-full flex-1 rounded-sm"
                        style={{ backgroundColor: grade.recommendedHexes.accent }}
                        title={`Accent: ${grade.recommendedHexes.accent}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Scenario Deep-Dive Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-7 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                    <span className="capitalize">{activeScenario.sceneType} Scene Masterclass</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{activeScenario.timeframe}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-cyan-400">{activeScenario.kelvin}K CCT</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                    {activeScenario.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <button
                    onClick={() => handleApplyGrade(activeScenario)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply to 3-Way Wheels</span>
                  </button>

                  <button
                    onClick={handleCopyResolveValues}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                    title="Copy DaVinci Resolve Lift/Gamma/Gain numbers for your color session"
                  >
                    {copiedResolveCoords ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Coordinates</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Exact Recommended Color Swatches with Click-to-Copy */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Exact Color Targets for this Lighting Condition</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Shadows (Lift) */}
                  <div
                    onClick={() => handleCopyHex(activeScenario.recommendedHexes.shadows)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: activeScenario.recommendedHexes.shadows }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Lift (Shadows)</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-cyan-400">
                        {activeScenario.recommendedHexes.shadows}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === activeScenario.recommendedHexes.shadows ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>

                  {/* Midtones (Gamma) */}
                  <div
                    onClick={() => handleCopyHex(activeScenario.recommendedHexes.midtones)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: activeScenario.recommendedHexes.midtones }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Gamma (Midtones)</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-amber-400">
                        {activeScenario.recommendedHexes.midtones}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === activeScenario.recommendedHexes.midtones ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>

                  {/* Highlights (Gain) */}
                  <div
                    onClick={() => handleCopyHex(activeScenario.recommendedHexes.highlights)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: activeScenario.recommendedHexes.highlights }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Gain (Highlights)</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-rose-400">
                        {activeScenario.recommendedHexes.highlights}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === activeScenario.recommendedHexes.highlights ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>

                  {/* Accent Vector */}
                  <div
                    onClick={() => handleCopyHex(activeScenario.recommendedHexes.accent)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: activeScenario.recommendedHexes.accent }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Accent / Rim Vector</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-emerald-400">
                        {activeScenario.recommendedHexes.accent}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === activeScenario.recommendedHexes.accent ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rationale & Lighting Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Why This Grade Works (Color Science & Psychology) */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Why This Grade Works (Color Science &amp; Psychology)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{activeScenario.whyItWorks}</p>
                  <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-850">
                    <strong className="text-cyan-300">DaVinci Colorist Tip:</strong> {activeScenario.resolveTip}
                  </div>
                </div>

                {/* On-Set Physical Lighting Recipe */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>On-Set Physical Lighting Recipe &amp; Ratios</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300 text-[11px]">
                    <div>
                      <strong className="text-slate-100">Key Light:</strong>{' '}
                      {activeScenario.lightingRecipe.key}
                    </div>
                    <div>
                      <strong className="text-slate-100">Fill &amp; Bounce:</strong>{' '}
                      {activeScenario.lightingRecipe.fill}
                    </div>
                    <div>
                      <strong className="text-slate-100">Practicals &amp; Accents:</strong>{' '}
                      {activeScenario.lightingRecipe.practicals}
                    </div>
                    <div>
                      <strong className="text-slate-100">Key-to-Fill Contrast Ratio:</strong>{' '}
                      <span className="text-amber-400 font-mono font-bold">
                        {activeScenario.lightingRecipe.ratio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photochemical Film Stock Specifications (when film stock is selected) */}
              {activeScenario.filmStockInfo && (
                <div className="bg-slate-950/80 rounded-xl border border-rose-950/50 p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-rose-400" />
                      <span className="font-bold text-white text-sm">
                        Photochemical Emulation Architecture ({activeScenario.filmStockInfo.manufacturer} {activeScenario.filmStockInfo.format})
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-rose-300">
                      ISO {activeScenario.filmStockInfo.iso} · {activeScenario.filmStockInfo.balance}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Dynamic Range &amp; Grain</span>
                      <p className="text-white font-medium">~{activeScenario.filmStockInfo.approxDynamicRangeStops} Stops Latitude</p>
                      <p className="text-[11px] text-slate-400">Grain Profile: <span className="text-slate-200 capitalize">{activeScenario.filmStockInfo.grain}</span></p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Shadow &amp; Highlight Tinting</span>
                      <p className="text-cyan-300 text-[11px]">{activeScenario.filmStockInfo.shadowTint}</p>
                      <p className="text-amber-300 text-[11px]">{activeScenario.filmStockInfo.highlightTint}</p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Skin Tone Rendering</span>
                      <p className="text-slate-200 text-[11px] leading-relaxed">{activeScenario.filmStockInfo.skinRendering}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-850 text-[11px]">
                    <div className="text-slate-400">
                      <strong className="text-white">Best For:</strong> {activeScenario.filmStockInfo.bestFor.join(' · ')}
                    </div>
                    <div className="text-slate-500 font-mono text-[10px]">
                      {activeScenario.filmStockInfo.availabilityNote}
                    </div>
                  </div>
                </div>
              )}

              {/* Use Cases & Colorist Cautions (when present) */}
              {(activeScenario.useCases || activeScenario.cautions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {activeScenario.useCases && (
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                      <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Recommended Cinema Genres &amp; Narrative Arcs</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {activeScenario.useCases.join(' · ')}
                      </p>
                    </div>
                  )}

                  {activeScenario.cautions && (
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-amber-950/40 space-y-1.5">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Colorist Caution &amp; Quality Watchout</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {activeScenario.cautions.join(' · ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Software Recreation Guide (DaVinci Resolve & Lightroom) */}
              <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-5 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white text-sm">
                      How to Recreate This Grade in Post-Production
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        onClick={() => setInlineSoftwareTab('davinci')}
                        className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                          inlineSoftwareTab === 'davinci'
                            ? 'bg-slate-800 text-cyan-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Film className="w-3 h-3 text-cyan-400" />
                        <span>DaVinci Resolve</span>
                      </button>
                      <button
                        onClick={() => setInlineSoftwareTab('lightroom')}
                        className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                          inlineSoftwareTab === 'lightroom'
                            ? 'bg-slate-800 text-amber-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Camera className="w-3 h-3 text-amber-400" />
                        <span>Adobe Lightroom</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setIsSoftwareModalOpen(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      Full Manual &amp; LUT Install Guide →
                    </button>
                  </div>
                </div>

                {inlineSoftwareTab === 'davinci' ? (
                  <div className="space-y-3">
                    <div className="text-slate-300 leading-relaxed">
                      To dial in <strong className="text-white">{activeScenario.name}</strong> on your DaVinci Resolve color page:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-cyan-400 font-bold">1. Lift (Shadows)</span>
                        <p className="text-slate-300">
                          R: {activeScenario.lift.r > 0 ? `+${activeScenario.lift.r}` : activeScenario.lift.r} · G: {activeScenario.lift.g > 0 ? `+${activeScenario.lift.g}` : activeScenario.lift.g} · B: {activeScenario.lift.b > 0 ? `+${activeScenario.lift.b}` : activeScenario.lift.b}
                        </p>
                        <span className="text-[10px] text-slate-500">Lum: {activeScenario.lift.lum} IRE (Shadow Toe)</span>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-amber-400 font-bold">2. Gamma (Midtones)</span>
                        <p className="text-slate-300">
                          R: {activeScenario.gamma.r > 0 ? `+${activeScenario.gamma.r}` : activeScenario.gamma.r} · G: {activeScenario.gamma.g > 0 ? `+${activeScenario.gamma.g}` : activeScenario.gamma.g} · B: {activeScenario.gamma.b > 0 ? `+${activeScenario.gamma.b}` : activeScenario.gamma.b}
                        </p>
                        <span className="text-[10px] text-slate-500">Lum: {activeScenario.gamma.lum} IRE (Midtone Pivot)</span>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-rose-400 font-bold">3. Gain (Highlights)</span>
                        <p className="text-slate-300">
                          R: {activeScenario.gain.r > 0 ? `+${activeScenario.gain.r}` : activeScenario.gain.r} · G: {activeScenario.gain.g > 0 ? `+${activeScenario.gain.g}` : activeScenario.gain.g} · B: {activeScenario.gain.b > 0 ? `+${activeScenario.gain.b}` : activeScenario.gain.b}
                        </p>
                        <span className="text-[10px] text-slate-500">Lum: {activeScenario.gain.lum} IRE (Shoulder)</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        White Balance: <strong className="text-white">{activeScenario.kelvin}K</strong> | Contrast: <strong className="text-amber-400">{activeScenario.contrast.toFixed(2)}</strong> | Sat: <strong className="text-cyan-400">{Math.round(activeScenario.saturation * 100)}%</strong>
                      </div>
                      <button
                        onClick={handleCopyResolveValues}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedResolveCoords ? 'Copied to Clipboard!' : 'Copy Resolve Numbers'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-slate-300 leading-relaxed">
                      To recreate <strong className="text-white">{activeScenario.name}</strong> in Adobe Lightroom Classic:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-cyan-400 font-bold">1. Color Grading (Shadows)</span>
                        <p className="text-slate-300">
                          Hue: 215° · Sat: 18% · Lum: {activeScenario.lift.lum}
                        </p>
                        <span className="text-[10px] text-slate-500">Injects cool ambient sky fill</span>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-amber-400 font-bold">2. Color Grading (Midtones)</span>
                        <p className="text-slate-300">
                          Hue: 38° · Sat: 22% · Lum: {activeScenario.gamma.lum}
                        </p>
                        <span className="text-[10px] text-slate-500">Preserves organic skin luminance</span>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-rose-400 font-bold">3. Color Grading (Highlights)</span>
                        <p className="text-slate-300">
                          Hue: 45° · Sat: 26% · Lum: {activeScenario.gain.lum}
                        </p>
                        <span className="text-[10px] text-slate-500">Gilded sunbeam specular wrap</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        Basic Panel: Temp <strong className="text-white">{activeScenario.kelvin > 6000 ? '+15 (Cool)' : '-12 (Warm)'}</strong> | Contrast <strong className="text-amber-400">+{Math.round((activeScenario.contrast - 1) * 50)}</strong>
                      </div>
                      <button
                        onClick={handleExportXmp}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download .XMP Preset for Lightroom</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LIVE CINEMA VIEWER (Before / After Split Canvas) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Live Interactive Cinema Viewport (Real-Time SVG Matrix Grade)</span>
              </div>

              {/* Sample Frame Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Sample Frame:</span>
                <select
                  value={selectedFrameId}
                  onChange={e => {
                    setSelectedFrameId(e.target.value);
                    setCustomImageSrc(null);
                  }}
                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  {SAMPLE_FRAMES.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.timeOfDay.toUpperCase()})
                    </option>
                  ))}
                </select>

                {/* Custom Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-colors"
                  title="Upload your own camera RAW export or movie still to test grade"
                >
                  <Upload className="w-3 h-3 text-cyan-400" />
                  <span>Upload Still</span>
                </button>
              </div>
            </div>

            {/* Split Comparison Slider & Viewport */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-[340px] sm:h-[420px] select-none">
              {/* SVG FILTER DEFINITIONS */}
              <svg className="absolute w-0 h-0 pointer-events-none">
                <filter id="liveCinemaGradeFilter">
                  <feColorMatrix type="matrix" values={liveFilterMatrix} />
                  <feComponentTransfer>
                    {/* Contrast curve adjustment */}
                    <feFuncR
                      type="linear"
                      slope={activeContrast}
                      intercept={-(activeContrast - 1) * 0.45}
                    />
                    <feFuncG
                      type="linear"
                      slope={activeContrast}
                      intercept={-(activeContrast - 1) * 0.45}
                    />
                    <feFuncB
                      type="linear"
                      slope={activeContrast}
                      intercept={-(activeContrast - 1) * 0.45}
                    />
                  </feComponentTransfer>
                </filter>
              </svg>

              {/* BASE LAYER: UNGRADED CAMERA RAW LOG (Flat baseline) */}
              <div className="absolute inset-0 w-full h-full">
                {customImageSrc ? (
                  <img
                    src={customImageSrc}
                    alt="Ungraded raw still"
                    className="w-full h-full object-cover filter contrast-75 brightness-105 saturate-75"
                  />
                ) : (
                  <RenderSimulatedFrame frameType={selectedFrameId} isGraded={false} />
                )}
              </div>

              {/* OVERLAY LAYER: FULLY GRADED (Clipped by split wipe position) */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
              >
                {customImageSrc ? (
                  <img
                    src={customImageSrc}
                    alt="Graded cinema still"
                    className="w-full h-full object-cover"
                    style={{ filter: 'url(#liveCinemaGradeFilter)' }}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ filter: 'url(#liveCinemaGradeFilter)' }}
                  >
                    <RenderSimulatedFrame frameType={selectedFrameId} isGraded={true} />
                  </div>
                )}
              </div>

              {/* SPLIT WIPE DIVIDER LINE & HANDLE */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl pointer-events-none"
                style={{ left: `${splitPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-mono font-bold text-white">
                  VS
                </div>
              </div>

              {/* Interactive Transparent Scrub Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={splitPosition}
                onChange={e => setSplitPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Before and after split wipe comparison slider"
              />

              {/* HUD LABELS */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-white flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="font-semibold text-slate-300">Left: Camera RAW Flat</span>
              </div>

              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-white flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold text-cyan-300">Right: Graded Cinema ({activeScenario.name})</span>
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-mono pointer-events-none">
                Split Wipe: {splitPosition}% | Drag anywhere to compare
              </div>
            </div>
          </div>

          {/* INTERACTIVE 3-WAY COLOR WHEELS & SECONDARY CONTROLS */}
          <ThreeWayColorWheels
            lift={activeLift}
            gamma={activeGamma}
            gain={activeGain}
            offsetLum={activeOffsetLum}
            kelvin={activeKelvin}
            tint={activeTint}
            contrast={activeContrast}
            saturation={activeSaturation}
            skinToneProtection={skinToneProtection}
            onUpdateLift={setActiveLift}
            onUpdateGamma={setActiveGamma}
            onUpdateGain={setActiveGain}
            onUpdateOffsetLum={setActiveOffsetLum}
            onUpdateKelvin={setActiveKelvin}
            onUpdateTint={setActiveTint}
            onUpdateContrast={setActiveContrast}
            onUpdateSaturation={setActiveSaturation}
            onToggleSkinToneProtection={() => setSkinToneProtection(!skinToneProtection)}
            onResetAll={handleResetWheels}
          />

          {/* REAL-TIME VIDEO SCOPES (Vectorscope & RGB Parade) */}
          <CinemaScopes
            lift={activeLift}
            gamma={activeGamma}
            gain={activeGain}
            offsetLum={activeOffsetLum}
            contrast={activeContrast}
            saturation={activeSaturation}
            kelvin={activeKelvin}
            tint={activeTint}
          />

          {/* DAVINCI RESOLVE NODE PIPELINE ARCHITECTURE CHEAT SHEET */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>DaVinci Resolve Node Pipeline Architecture (Production Reference)</span>
              </span>

              {/* Node category filter */}
              <div className="flex items-center gap-1 text-[11px] bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveNodeFilter('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeNodeFilter === 'all'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  All Nodes
                </button>
                <button
                  onClick={() => setActiveNodeFilter('primary')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeNodeFilter === 'primary'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setActiveNodeFilter('curves')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeNodeFilter === 'curves'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  Curves
                </button>
                <button
                  onClick={() => setActiveNodeFilter('advanced')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeNodeFilter === 'advanced'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeNodeFilter === 'all'
                ? DAVINCI_NODE_WORKFLOWS
                : DAVINCI_NODE_WORKFLOWS.filter(n => n.category === activeNodeFilter)
              ).map(node => (
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
                    <strong className="text-amber-400 not-italic">Colorist Secret:</strong>{' '}
                    {node.coloristSecret}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADOBE LIGHTROOM CLASSIC COLOR CALIBRATIONS CHEAT SHEET */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
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

          {/* DYNAMIC REACTIVE SOFTWARE GUIDE & EXPORTER FOR ACTIVE SCENARIO */}
          <PostProductionSoftwareGuide
            selectedColor={activeScenario.recommendedHexes.midtones || '#f59e0b'}
            colorName={activeScenario.name}
            secondaryColor={activeScenario.recommendedHexes.shadows || '#0a192f'}
            contextTitle={`How to Create "${activeScenario.name}" in DaVinci Resolve & Lightroom`}
          />
        </>
      )}

      {/* Software Reproduction Manual Modal */}
      <SoftwareGradingGuideModal
        isOpen={isSoftwareModalOpen}
        onClose={() => setIsSoftwareModalOpen(false)}
        activeScenarioId={activeScenario.id}
      />

      {/* Gemini AI Cinematic Palette Studio Modal */}
      <GeminiCinematicPaletteModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        onApplyToGradeWorkspace={handleApplyGrade}
        onSaveToLibrary={newRecipe => {
          try {
            const stored = localStorage.getItem('cm_saved_recipes');
            const list = stored ? JSON.parse(stored) : [];
            localStorage.setItem('cm_saved_recipes', JSON.stringify([newRecipe, ...list]));
            setSavedFeedback(true);
            setTimeout(() => setSavedFeedback(false), 2500);
          } catch {
            // fallback
          }
        }}
      />
    </section>
  );
};

/**
 * High-fidelity vector simulated cinema frames (Landscape, Portrait, City Night, etc.)
 */
const RenderSimulatedFrame: React.FC<{ frameType: string; isGraded: boolean }> = ({
  frameType,
  isGraded,
}) => {
  if (frameType === 'day_portrait') {
    return (
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb03b" />
            <stop offset="50%" stopColor="#ffd285" />
            <stop offset="100%" stopColor="#4a7c59" />
          </linearGradient>
          <radialGradient id="sunRim" cx="70%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ff9f1c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Golden Hour Background */}
        <rect width="1000" height="600" fill="url(#pSky)" />
        <circle cx="720" cy="180" r="160" fill="url(#sunRim)" />

        {/* Distant Hills */}
        <path d="M0 380 Q300 320 600 360 T1000 340 L1000 600 L0 600 Z" fill="#2d3748" opacity="0.6" />
        <path d="M0 430 Q400 390 750 440 T1000 420 L1000 600 L0 600 Z" fill="#1a202c" />

        {/* ACTOR PORTRAIT (Centered Close-up with Golden Hair Rim) */}
        <g transform="translate(480, 260)">
          {/* Shoulders / Wardrobe */}
          <path d="M-140 260 C-120 160 -80 140 0 140 C80 140 120 160 140 260 Z" fill="#1e293b" />
          {/* Collar shirt */}
          <polygon points="-40,140 0,200 40,140 0,160" fill="#334155" />

          {/* Neck */}
          <rect x="-24" y="80" width="48" height="70" rx="6" fill="#d97757" />
          {/* Neck shadow falloff */}
          <path d="M-24 80 L24 80 L24 120 Z" fill="#8c3a27" opacity="0.4" />

          {/* Head & Face */}
          <ellipse cx="0" cy="50" rx="65" ry="85" fill="#e8987a" />
          {/* Facial Shadow (Key-to-Fill contouring) */}
          <path d="M-20 -30 Q-65 40 -15 130 L-65 50 Z" fill="#aa5035" opacity="0.35" />

          {/* Eyes, Nose, Lips */}
          <circle cx="-22" cy="40" r="5" fill="#2d150b" />
          <circle cx="26" cy="40" r="5" fill="#2d150b" />
          {/* Catchlight */}
          <circle cx="-20" cy="38" r="1.5" fill="#ffffff" />
          <circle cx="28" cy="38" r="1.5" fill="#ffffff" />
          <path d="M0 45 L5 70 L-5 75 Z" fill="#994025" opacity="0.5" />
          <path d="M-18 95 Q2 106 22 95" stroke="#772015" strokeWidth="3" fill="none" />

          {/* Hair */}
          <path
            d="M-70 40 C-80 -40 -40 -60 0 -60 C40 -60 80 -40 70 40 C60 10 50 -20 0 -20 C-50 -20 -60 10 -70 40 Z"
            fill="#3f1d0b"
          />

          {/* Solar Rim Light on Hair (Golden Hour Accent) */}
          <path
            d="M0 -62 C42 -62 82 -42 72 40 C75 10 65 -15 20 -45 Z"
            fill="#ffd166"
            opacity="0.9"
          />
        </g>
      </svg>
    );
  }

  if (frameType === 'night_city') {
    return (
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark Midnight Sky */}
        <rect width="1000" height="600" fill="#050811" />

        {/* City Skyline Silhouettes */}
        <rect x="60" y="160" width="90" height="260" fill="#090f1d" />
        <rect x="180" y="110" width="110" height="310" fill="#0d1527" />
        <rect x="320" y="200" width="80" height="220" fill="#090f1d" />
        <rect x="580" y="140" width="130" height="280" fill="#0b1322" />
        <rect x="740" y="80" width="100" height="340" fill="#0d1629" />
        <rect x="870" y="190" width="90" height="230" fill="#090f1d" />

        {/* Cyan & Magenta Neon Signs */}
        <rect x="200" y="140" width="70" height="18" rx="2" fill="#00f0ff" opacity="0.9" />
        <rect x="610" y="170" width="60" height="14" rx="2" fill="#ff007f" opacity="0.9" />
        <rect x="760" y="120" width="50" height="70" rx="3" fill="#ffe600" opacity="0.8" />

        {/* Wet Rain-Slicked Asphalt Road with Mirror Reflections */}
        <polygon points="0,420 1000,420 1000,600 0,600" fill="#070a12" />

        {/* Wet road reflection pools */}
        <ellipse cx="235" cy="500" rx="45" ry="120" fill="#00f0ff" opacity="0.35" />
        <ellipse cx="640" cy="510" rx="40" ry="110" fill="#ff007f" opacity="0.35" />
        <ellipse cx="785" cy="490" rx="30" ry="90" fill="#ffe600" opacity="0.25" />

        {/* Streetlight with Amber Cone */}
        <line x1="480" y1="280" x2="480" y2="440" stroke="#334155" strokeWidth="4" />
        <polygon points="460,300 500,300 560,460 400,460" fill="#f59e0b" opacity="0.15" />
        <circle cx="480" cy="295" r="10" fill="#ffedd5" />
      </svg>
    );
  }

  if (frameType === 'interior_candle') {
    return (
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark Room Walls */}
        <rect width="1000" height="600" fill="#0a0503" />

        {/* Candle Glow Pool */}
        <radialGradient id="candleRadial" cx="340" cy="340" r="320">
          <stop offset="0%" stopColor="#fed766" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#ea580c" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#7c2d12" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0a0503" stopOpacity="0" />
        </radialGradient>
        <rect width="1000" height="600" fill="url(#candleRadial)" />

        {/* Table & Candlestick */}
        <rect x="180" y="440" width="640" height="160" fill="#1c0f09" />
        <rect x="335" y="360" width="10" height="80" fill="#d97706" />

        {/* Flame */}
        <ellipse cx="340" cy="345" rx="7" ry="14" fill="#ffffff" />
        <ellipse cx="340" cy="345" rx="14" ry="22" fill="#f59e0b" opacity="0.75" />

        {/* Seated Subject Contoured by Candlelight */}
        <g transform="translate(560, 260)">
          {/* Shadow on back of head */}
          <ellipse cx="0" cy="50" rx="70" ry="90" fill="#1f0f08" />
          {/* Warm face lighted edge */}
          <path d="M-60 0 C-40 0 -20 20 -20 70 C-20 120 -50 140 -60 140 Z" fill="#d97706" />
          <circle cx="-35" cy="45" r="3" fill="#ffffff" />
        </g>
      </svg>
    );
  }

  // Default: Day Alpine Exterior
  return (
    <svg
      viewBox="0 0 1000 600"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <linearGradient id="mSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#bae6fd" />
      </linearGradient>
      <rect width="1000" height="600" fill="url(#mSky)" />
      <circle cx="820" cy="120" r="50" fill="#fffbeb" />

      {/* Far mountains */}
      <path d="M0 260 L200 170 L380 240 L560 140 L720 230 L880 150 L1000 200 L1000 600 L0 600 Z" fill="#64748b" />
      {/* Snow caps */}
      <polygon points="560,140 535,175 585,175" fill="#f8fafc" />
      <polygon points="200,170 180,200 220,200" fill="#f8fafc" />
      <polygon points="880,150 860,180 900,180" fill="#f8fafc" />

      {/* Midground */}
      <path d="M0 340 L180 290 L380 360 L600 280 L790 350 L1000 300 L1000 600 L0 600 Z" fill="#334155" />

      {/* Foreground */}
      <path d="M0 450 Q300 400 600 440 T1000 410 L1000 600 L0 600 Z" fill="#1e293b" />
      <polygon points="120,410 105,480 135,480" fill="#1e3a2b" />
      <polygon points="150,420 138,475 162,475" fill="#1e3a2b" />
      <polygon points="780,420 765,490 795,490" fill="#1e3a2b" />
    </svg>
  );
};
