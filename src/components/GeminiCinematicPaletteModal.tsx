import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Download,
  Film,
  Camera,
  Layers,
  Sliders,
  Bookmark,
  Sun,
  Moon,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  CinemaGradeParams,
  generateCinemaGradeCubeLut,
  generateCinemaGradeXmp,
} from '../utils/cinematographyGradingMath';
import { downloadFile, ColorRecipe } from '../utils/exporters';

export interface GeminiCinematicPaletteResponse {
  title: string;
  tagline: string;
  genre: string;
  mood: string;
  filmReferences: string[];
  timeOfDay: string;
  kelvin: number;
  tint: number;
  contrast: number;
  saturation: number;
  recommendedHexes: {
    shadows: string;
    midtones: string;
    highlights: string;
    accent: string;
  };
  extendedPalette: {
    hex: string;
    name: string;
    role: string;
  }[];
  resolveCoordinates: {
    lift: { r: number; g: number; b: number; lum: number };
    gamma: { r: number; g: number; b: number; lum: number };
    gain: { r: number; g: number; b: number; lum: number };
  };
  lightingRecipe: {
    key: string;
    fill: string;
    practicals: string;
    ratio: string;
  };
  whyItWorks: string;
  resolveTip: string;
  lightroomTip: string;
  generatedBy?: string;
  keyword?: string;
  errorNote?: string;
}

interface GeminiCinematicPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToGradeWorkspace?: (grade: CinemaGradeParams) => void;
  onSaveToLibrary?: (recipe: ColorRecipe) => void;
}

const INSPIRATION_CHIPS = [
  { label: 'Cyberpunk Rain', query: 'Rain-slicked cyberpunk metropolis with hot neon and deep cobalt shadows' },
  { label: 'A24 Folk Horror', query: 'Pastoral daylight horror with blinding sun, wildflowers, and dread' },
  { label: '70s Sun-Bleached Giallo', query: 'Warm faded 1970s Italian thriller with amber haze and blood red' },
  { label: 'Wes Anderson Pastel', query: 'Whimsical symmetrical storybook with mustard yellow, pink, and mint' },
  { label: 'Nordic Noir Bleak', query: 'Desaturated icy overcast Scandinavian detective drama' },
  { label: 'Wong Kar-wai Neon', query: 'Hong Kong night romantic melancholy with tungsten green and scarlet' },
  { label: 'Villeneuve Dune', query: 'Epic monochromatic desert spice storm with searing sand & bronze' },
  { label: 'Gothic Chamber', query: 'Candlelit 19th-century Victorian vampire salon with obsidian velvet' },
];

export const GeminiCinematicPaletteModal: React.FC<GeminiCinematicPaletteModalProps> = ({
  isOpen,
  onClose,
  onApplyToGradeWorkspace,
  onSaveToLibrary,
}) => {
  const [keyword, setKeyword] = useState<string>('');
  const [sceneType, setSceneType] = useState<string>('auto');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeminiCinematicPaletteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Interaction feedback states
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedResolveCoords, setCopiedResolveCoords] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = async (queryText?: string) => {
    const textToSubmit = queryText || keyword;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/cinematic-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: textToSubmit.trim(),
          sceneType: sceneType === 'auto' ? undefined : sceneType,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data: GeminiCinematicPaletteResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Error generating palette:', err);
      setError(err?.message || 'Failed to generate palette. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChip = (chip: { label: string; query: string }) => {
    setKeyword(chip.query);
    handleGenerate(chip.query);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Convert Gemini Result into CinemaGradeParams
  const toCinemaGradeParams = (data: GeminiCinematicPaletteResponse): CinemaGradeParams => {
    return {
      id: `gemini_${Date.now()}`,
      name: data.title,
      sceneType: data.timeOfDay.toLowerCase().includes('night') ? 'night' : 'day',
      timeframe: `${data.genre} · ${data.timeOfDay}`,
      kelvin: data.kelvin || 5200,
      tint: data.tint || 0,
      lift: {
        r: data.resolveCoordinates?.lift?.r ?? 0,
        g: data.resolveCoordinates?.lift?.g ?? 0,
        b: data.resolveCoordinates?.lift?.b ?? 0,
        lum: data.resolveCoordinates?.lift?.lum ?? 0,
      },
      gamma: {
        r: data.resolveCoordinates?.gamma?.r ?? 0,
        g: data.resolveCoordinates?.gamma?.g ?? 0,
        b: data.resolveCoordinates?.gamma?.b ?? 0,
        lum: data.resolveCoordinates?.gamma?.lum ?? 0,
      },
      gain: {
        r: data.resolveCoordinates?.gain?.r ?? 0,
        g: data.resolveCoordinates?.gain?.g ?? 0,
        b: data.resolveCoordinates?.gain?.b ?? 0,
        lum: data.resolveCoordinates?.gain?.lum ?? 0,
      },
      offsetLum: 0,
      contrast: data.contrast || 1.25,
      saturation: data.saturation || 1.1,
      skinToneProtection: true,
      recommendedHexes: {
        shadows: data.recommendedHexes.shadows,
        midtones: data.recommendedHexes.midtones,
        highlights: data.recommendedHexes.highlights,
        accent: data.recommendedHexes.accent,
      },
      whyItWorks: data.whyItWorks,
      lightingRecipe: {
        key: data.lightingRecipe.key,
        fill: data.lightingRecipe.fill,
        practicals: data.lightingRecipe.practicals,
        ratio: data.lightingRecipe.ratio,
      },
      resolveTip: data.resolveTip,
      useCases: data.filmReferences,
      tags: ['Gemini AI', data.genre, data.mood],
    };
  };

  const handleApplyToWorkspace = () => {
    if (!result) return;
    const grade = toCinemaGradeParams(result);
    if (onApplyToGradeWorkspace) {
      onApplyToGradeWorkspace(grade);
    }
    onClose();
  };

  const handleExportCube = () => {
    if (!result) return;
    const grade = toCinemaGradeParams(result);
    const cubeString = generateCinemaGradeCubeLut(grade);
    const blob = new Blob([cubeString], { type: 'text/plain;charset=utf-8' });
    const filename = `${result.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_gemini_lut.cube`;
    downloadFile(blob, filename);
  };

  const handleExportXmp = () => {
    if (!result) return;
    const grade = toCinemaGradeParams(result);
    const xmpString = generateCinemaGradeXmp(grade);
    const blob = new Blob([xmpString], { type: 'application/rdf+xml;charset=utf-8' });
    const filename = `${result.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_gemini_preset.xmp`;
    downloadFile(blob, filename);
  };

  const handleCopyResolveValues = () => {
    if (!result) return;
    const lift = result.resolveCoordinates.lift;
    const gamma = result.resolveCoordinates.gamma;
    const gain = result.resolveCoordinates.gain;

    const text = `DaVinci Resolve Grade Settings (Generated by Gemini):
Look: ${result.title} (${result.genre})
White Balance (CCT): ${result.kelvin}K | Tint: ${result.tint}
Lift (Shadows): R=${lift.r > 0 ? '+' : ''}${lift.r}, G=${lift.g > 0 ? '+' : ''}${lift.g}, B=${lift.b > 0 ? '+' : ''}${lift.b} | Lum=${lift.lum} IRE
Gamma (Midtones): R=${gamma.r > 0 ? '+' : ''}${gamma.r}, G=${gamma.g > 0 ? '+' : ''}${gamma.g}, B=${gamma.b > 0 ? '+' : ''}${gamma.b} | Lum=${gamma.lum} IRE
Gain (Highlights): R=${gain.r > 0 ? '+' : ''}${gain.r}, G=${gain.g > 0 ? '+' : ''}${gain.g}, B=${gain.b > 0 ? '+' : ''}${gain.b} | Lum=${gain.lum} IRE
Contrast: ${result.contrast.toFixed(2)} | Saturation: ${Math.round(result.saturation * 100)}%
Colorist Pro-Tip: ${result.resolveTip}`;

    navigator.clipboard.writeText(text);
    setCopiedResolveCoords(true);
    setTimeout(() => setCopiedResolveCoords(false), 2500);
  };

  const handleSaveToLookLibrary = () => {
    if (!result) return;
    const newRecipe: ColorRecipe = {
      id: `gemini_${Date.now()}`,
      name: `${result.title} (Gemini AI Look)`,
      category: result.genre || 'Cinematic Grade',
      harmonyType: 'cinematic',
      swatches: [
        { name: 'Lift (Shadows)', hex: result.recommendedHexes.shadows },
        { name: 'Gamma (Midtones)', hex: result.recommendedHexes.midtones },
        { name: 'Gain (Highlights)', hex: result.recommendedHexes.highlights },
        { name: 'Accent / Rim', hex: result.recommendedHexes.accent },
        ...result.extendedPalette.slice(0, 2).map(s => ({ name: s.name, hex: s.hex })),
      ],
      description: `${result.tagline} · ${result.kelvin}K · Contrast ${result.contrast}x`,
      createdAt: new Date().toISOString(),
    };

    if (onSaveToLibrary) {
      onSaveToLibrary(newRecipe);
    } else {
      try {
        const stored = localStorage.getItem('cm_saved_recipes');
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem('cm_saved_recipes', JSON.stringify([newRecipe, ...list]));
      } catch {
        // fallback
      }
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gemini-palette-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="gemini-palette-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Gemini Cinematic Palette Studio
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate professional Hollywood color palettes, DaVinci Resolve wheel coordinates &amp; lighting recipes from any movie mood or genre.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Prompt & Controls Area */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
            <div className="space-y-2">
              <label htmlFor="mood-input" className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Describe Movie Mood, Genre, or Narrative Atmosphere</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="mood-input"
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleGenerate();
                  }}
                  placeholder="e.g., Blade Runner 2049 rainy neon alleyway, Wes Anderson desert sunset, 1970s cold war espionage..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />

                <select
                  value={sceneType}
                  onChange={e => setSceneType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="auto">Auto / Any Lighting</option>
                  <option value="Daytime Exterior">Daytime Exterior</option>
                  <option value="Night Exterior">Night Exterior</option>
                  <option value="Golden Hour">Golden Hour</option>
                  <option value="Blue Hour / Twilight">Blue Hour / Twilight</option>
                  <option value="Interior Chamber">Interior Chamber</option>
                  <option value="Overcast / Mist">Overcast / Mist</option>
                </select>

                <button
                  onClick={() => handleGenerate()}
                  disabled={loading || !keyword.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all shrink-0"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Colorist AI Reasoning...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Palette</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Or click an iconic cinematic mood starter:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INSPIRATION_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => handleSelectChip(chip)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Generation Notice:</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Generated Result Presentation */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Card */}
              <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <span>{result.genre}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400">{result.timeOfDay}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-amber-300">{result.kelvin}K CCT</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300">Tint {result.tint > 0 ? `+${result.tint}` : result.tint}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mt-1">{result.title}</h4>
                    <p className="text-xs text-slate-300 italic mt-0.5">{result.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                    <button
                      onClick={handleApplyToWorkspace}
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      title="Load these exact wheels & Kelvin into the live Cinematography studio"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply to Wheels &amp; Scopes</span>
                    </button>

                    <button
                      onClick={handleSaveToLookLibrary}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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

                {/* Film References & Mood Keywords */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                      Notable Film References:
                    </span>
                    {result.filmReferences.map(film => (
                      <span
                        key={film}
                        className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-750 text-slate-200 text-xs font-medium"
                      >
                        {film}
                      </span>
                    ))}
                  </div>

                  <div className="text-slate-400 text-xs">
                    <strong className="text-slate-200">Mood:</strong> {result.mood}
                  </div>
                </div>
              </div>

              {/* 4-Tonal Target Colors (Lift/Gamma/Gain/Rim) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Exact 4-Tonal Targets (Lift / Gamma / Gain / Rim)</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Click swatch to copy hex</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Shadows (Lift) */}
                  <div
                    onClick={() => handleCopyHex(result.recommendedHexes.shadows)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: result.recommendedHexes.shadows }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Lift (Shadows)</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-cyan-400">
                        {result.recommendedHexes.shadows}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === result.recommendedHexes.shadows ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>

                  {/* Midtones (Gamma) */}
                  <div
                    onClick={() => handleCopyHex(result.recommendedHexes.midtones)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: result.recommendedHexes.midtones }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Gamma (Midtones)</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-amber-400">
                        {result.recommendedHexes.midtones}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === result.recommendedHexes.midtones ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>

                  {/* Highlights (Gain) */}
                  <div
                    onClick={() => handleCopyHex(result.recommendedHexes.highlights)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: result.recommendedHexes.highlights }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Gain (Highlights)</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-rose-400">
                        {result.recommendedHexes.highlights}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === result.recommendedHexes.highlights ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>

                  {/* Accent Vector */}
                  <div
                    onClick={() => handleCopyHex(result.recommendedHexes.accent)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: result.recommendedHexes.accent }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Accent / Rim</div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-emerald-400">
                        {result.recommendedHexes.accent}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === result.recommendedHexes.accent ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Swatch Extended Atmosphere Palette */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>5-Swatch Extended Atmospheric Scene Palette</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {result.extendedPalette.map(swatch => (
                    <div
                      key={swatch.hex + swatch.name}
                      onClick={() => handleCopyHex(swatch.hex)}
                      className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between cursor-pointer hover:border-slate-700 transition-colors group"
                    >
                      <div
                        className="w-full h-12 rounded-lg shadow-inner border border-white/10 mb-2"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-white truncate">{swatch.name}</div>
                        <div className="font-mono text-[10px] text-slate-400 group-hover:text-cyan-400">
                          {swatch.hex}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight truncate">
                          {swatch.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Science Rationale & Lighting Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Why This Grade Works */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Why This Grade Works (Color Science &amp; Psychology)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{result.whyItWorks}</p>
                </div>

                {/* Physical Lighting Recipe */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Physical On-Set Lighting Recipe &amp; Ratios</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>
                      <strong className="text-white">Key Light:</strong> {result.lightingRecipe.key}
                    </div>
                    <div>
                      <strong className="text-white">Fill &amp; Bounce:</strong> {result.lightingRecipe.fill}
                    </div>
                    <div>
                      <strong className="text-white">Practicals:</strong> {result.lightingRecipe.practicals}
                    </div>
                    <div>
                      <strong className="text-white">Key-to-Fill Contrast:</strong>{' '}
                      <span className="text-amber-400 font-mono font-bold">
                        {result.lightingRecipe.ratio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DaVinci Resolve & Lightroom Technical Recreation Settings */}
              <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">DaVinci Resolve Primary Wheel Coordinates</span>
                  </div>
                  <button
                    onClick={handleCopyResolveValues}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    {copiedResolveCoords ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied Coordinates!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Coordinates</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3 Wheel Readings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Lift (Shadows)</span>
                    <div className="font-mono text-xs text-white">
                      R: {result.resolveCoordinates.lift.r > 0 ? '+' : ''}{result.resolveCoordinates.lift.r} · G: {result.resolveCoordinates.lift.g > 0 ? '+' : ''}{result.resolveCoordinates.lift.g} · B: {result.resolveCoordinates.lift.b > 0 ? '+' : ''}{result.resolveCoordinates.lift.b}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Lum: {result.resolveCoordinates.lift.lum} IRE</div>
                  </div>

                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Gamma (Midtones)</span>
                    <div className="font-mono text-xs text-white">
                      R: {result.resolveCoordinates.gamma.r > 0 ? '+' : ''}{result.resolveCoordinates.gamma.r} · G: {result.resolveCoordinates.gamma.g > 0 ? '+' : ''}{result.resolveCoordinates.gamma.g} · B: {result.resolveCoordinates.gamma.b > 0 ? '+' : ''}{result.resolveCoordinates.gamma.b}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Lum: {result.resolveCoordinates.gamma.lum} IRE</div>
                  </div>

                  <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Gain (Highlights)</span>
                    <div className="font-mono text-xs text-white">
                      R: {result.resolveCoordinates.gain.r > 0 ? '+' : ''}{result.resolveCoordinates.gain.r} · G: {result.resolveCoordinates.gain.g > 0 ? '+' : ''}{result.resolveCoordinates.gain.g} · B: {result.resolveCoordinates.gain.b > 0 ? '+' : ''}{result.resolveCoordinates.gain.b}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Lum: {result.resolveCoordinates.gain.lum} IRE</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                  <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                    <strong className="text-cyan-300">DaVinci Node Workflow:</strong> {result.resolveTip}
                  </div>
                  <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                    <strong className="text-amber-300">Adobe Lightroom Recipe:</strong> {result.lightroomTip}
                  </div>
                </div>
              </div>

              {/* Direct Exporter Action Bar */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Export this look for production post-processing:
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportCube}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-800 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .CUBE LUT</span>
                  </button>

                  <button
                    onClick={handleExportXmp}
                    className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 border border-amber-800 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .XMP Preset</span>
                  </button>

                  <button
                    onClick={handleApplyToWorkspace}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply Look to Wheels</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready · Powered by Google Gemini 3.8 Flash</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
