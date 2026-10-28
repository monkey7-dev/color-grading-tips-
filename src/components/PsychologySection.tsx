import React, { useState } from 'react';
import {
  PSYCHOLOGY_ITEMS,
  EmotionTraitItem,
  COLOR_PSYCHOLOGY_SPECTRUM,
  ColorSpectrumItem,
  EMOTION_PALETTES,
  EmotionPaletteItem,
} from '../data/psychologyData';
import { PsychologyGraph } from './PsychologyGraph';
import { ColorDepthExplorer } from './ColorDepthExplorer';
import { PostProductionSoftwareGuide } from './PostProductionSoftwareGuide';
import {
  Check,
  Copy,
  Film,
  HeartPulse,
  Brain,
  Globe,
  Compass,
  Sliders,
  Palette,
  Sparkles,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';

interface PsychologySectionProps {
  onLoadIntoWheel: (hex: string) => void;
}

export const PsychologySection: React.FC<PsychologySectionProps> = ({ onLoadIntoWheel }) => {
  const [activeTab, setActiveTab] = useState<'spectrum' | 'palettes' | 'graph'>('spectrum');
  const [selectedSpectrumId, setSelectedSpectrumId] = useState<string>('red');
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('joy');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'primary_emotion' | 'psychological_trait' | 'emotional_state'
  >('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('joy');
  const [culturalLens, setCulturalLens] = useState<'western' | 'eastern' | 'middleEastern'>('western');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const selectedSpectrum =
    COLOR_PSYCHOLOGY_SPECTRUM.find(c => c.id === selectedSpectrumId) || COLOR_PSYCHOLOGY_SPECTRUM[0];

  const selectedEmotionPalette =
    EMOTION_PALETTES.find(p => p.id === selectedPaletteId) || EMOTION_PALETTES[0];

  const selectedItem =
    PSYCHOLOGY_ITEMS.find(item => item.id === selectedItemId) || PSYCHOLOGY_ITEMS[0];

  const filteredItems =
    selectedCategory === 'all'
      ? PSYCHOLOGY_ITEMS
      : PSYCHOLOGY_ITEMS.filter(item => item.category === selectedCategory);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Active color for software guide and depth explorer
  const activeGuideColor =
    activeTab === 'spectrum'
      ? selectedSpectrum.hex
      : activeTab === 'palettes'
      ? selectedEmotionPalette.swatches[0]
      : selectedItem.primaryColor;

  const activeGuideName =
    activeTab === 'spectrum'
      ? `${selectedSpectrum.name} (${selectedSpectrum.wavelengthNm})`
      : activeTab === 'palettes'
      ? selectedEmotionPalette.name
      : selectedItem.name;

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <span>01</span>
          <span aria-hidden="true">·</span>
          <span>Neuroscience, Perception &amp; Semiotics</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Psychology &amp; Emotions Matrix
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
          Explore the profound somatic triggers, subconscious physiological responses, and
          divergent cultural semiotics evoked by specific color frequencies in human consciousness.
        </p>
      </div>

      {/* Primary Psychology View Switcher */}
      <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1.5 overflow-x-auto shadow-lg">
        <button
          onClick={() => setActiveTab('spectrum')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'spectrum'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md ring-1 ring-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Palette className="w-4 h-4 text-rose-400" />
          <span>12 Spectral Colors (Physics &amp; Semiotics)</span>
        </button>

        <button
          onClick={() => setActiveTab('palettes')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'palettes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md ring-1 ring-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>10 Curated Emotion Palettes</span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'graph'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md ring-1 ring-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Relational Constellation Graph</span>
        </button>
      </div>

      {/* TAB 1: 12 SPECTRAL COLORS MASTERCLASS */}
      {activeTab === 'spectrum' && (
        <div className="space-y-6">
          {/* 12-Color Selector Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {COLOR_PSYCHOLOGY_SPECTRUM.map(color => {
              const isSelected = selectedSpectrumId === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedSpectrumId(color.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-slate-700 shadow-md ring-2 ring-cyan-500/50'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 text-slate-300'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow shrink-0 border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0 truncate">
                    <div className="text-xs font-bold text-white truncate">{color.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{color.wavelengthNm}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Spectral Color Deep-Dive Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-cyan-400">{selectedSpectrum.wavelengthNm}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize text-amber-400">{selectedSpectrum.warmth}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-300">{selectedSpectrum.hex}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <span>{selectedSpectrum.name}</span>
                  <span
                    className="w-5 h-5 rounded-full inline-block shadow-md border border-white/20"
                    style={{ backgroundColor: selectedSpectrum.hex }}
                  />
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <button
                  onClick={() => copyToClipboard(selectedSpectrum.hex)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedHex === selectedSpectrum.hex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Hex</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onLoadIntoWheel(selectedSpectrum.hex)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Load Into Wheel</span>
                </button>
              </div>
            </div>

            {/* Positive vs Negative Psychological Associations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-emerald-950/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Positive Psychological Associations</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedSpectrum.positiveAssociations}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-rose-950/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <HeartPulse className="w-4 h-4" />
                  <span>Negative Psychological Associations &amp; Biases</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedSpectrum.negativeAssociations}
                </p>
              </div>
            </div>

            {/* Cultural Meanings Matrix across 5 Regions */}
            <div className="p-5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Globe className="w-4 h-4" />
                <span>Global Cultural Semiotics Matrix (5 Continental Traditions)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-850 space-y-1">
                  <span className="font-bold text-white text-[11px]">Western</span>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed">{selectedSpectrum.culturalMeanings.western}</p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-850 space-y-1">
                  <span className="font-bold text-white text-[11px]">East Asia</span>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed">{selectedSpectrum.culturalMeanings.eastAsia}</p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-850 space-y-1">
                  <span className="font-bold text-white text-[11px]">South Asia</span>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed">{selectedSpectrum.culturalMeanings.southAsia}</p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-850 space-y-1">
                  <span className="font-bold text-white text-[11px]">Middle East</span>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed">{selectedSpectrum.culturalMeanings.middleEast}</p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-850 space-y-1">
                  <span className="font-bold text-white text-[11px]">Latin America</span>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed">{selectedSpectrum.culturalMeanings.latinAmerica}</p>
                </div>
              </div>
            </div>

            {/* Cinematic Storytelling & Colorist Grading Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>Cinematic Narrative Applications</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedSpectrum.cinematicUse}
                </p>
                <div className="pt-2 text-[10.5px] text-slate-400 border-t border-slate-850">
                  <strong className="text-white">Notable Film Genres:</strong> {selectedSpectrum.filmGenres}
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-cyan-950/40 space-y-2">
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Colorist Masterclass Grading Tips</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedSpectrum.gradingTips}
                </p>
                <div className="pt-2 text-[10.5px] text-slate-400 border-t border-slate-850">
                  <strong className="text-white">Pairs Perfectly With:</strong> {selectedSpectrum.pairsWith}
                </div>
              </div>
            </div>

            {/* Brand Application Note */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400">
                <strong className="text-white">Iconic Brand Implementations:</strong> {selectedSpectrum.brandUse}
              </span>
              <span className="text-cyan-400 font-mono text-[10px]">
                Target Wavelength: {selectedSpectrum.wavelengthNm}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 10 CURATED EMOTION PALETTES */}
      {activeTab === 'palettes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {EMOTION_PALETTES.map(palette => {
              const isSelected = selectedPaletteId === palette.id;
              return (
                <div
                  key={palette.id}
                  onClick={() => setSelectedPaletteId(palette.id)}
                  className={`p-4 rounded-xl border text-left transition-all space-y-3 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500/60 shadow-xl ring-2 ring-amber-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-850 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{palette.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{palette.suggestedKelvin}K</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {palette.tagline}
                    </p>
                  </div>

                  {/* 5-Swatch Bar */}
                  <div className="flex h-5 rounded-md overflow-hidden p-0.5 bg-slate-950 border border-slate-800 gap-0.5">
                    {palette.swatches.map((hex, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full rounded-sm"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-850 text-[10px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Contrast: <strong className="text-white">{palette.contrast}x</strong></span>
                      <span className="text-slate-400 truncate max-w-[110px]">{palette.filmReference.split('/')[0]}</span>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onLoadIntoWheel(palette.swatches[0]);
                      }}
                      className="w-full py-1 text-center bg-slate-950 hover:bg-slate-800 text-amber-300 font-semibold rounded border border-slate-800 transition-colors"
                    >
                      Load into Wheels
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Emotion Palette Deep-Dive Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <span>Emotion: {selectedEmotionPalette.emotion}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-cyan-400">{selectedEmotionPalette.suggestedKelvin}K Suggested White Balance</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-300">{selectedEmotionPalette.contrast}x Contrast</span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedEmotionPalette.name}
                </h3>
                <p className="text-sm text-slate-300 mt-1">{selectedEmotionPalette.tagline}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onLoadIntoWheel(selectedEmotionPalette.swatches[0])}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Load Into Wheels</span>
                </button>
              </div>
            </div>

            {/* 5 Swatches with Click to Copy */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Exact Recommended Palette Swatches (Shadows to Highlights)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {selectedEmotionPalette.swatches.map((hex, idx) => (
                  <div
                    key={idx}
                    onClick={() => copyToClipboard(hex)}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-mono text-slate-400">
                        {idx === 0 ? 'Shadow' : idx === 1 ? 'Toe' : idx === 2 ? 'Midtone' : idx === 3 ? 'High' : 'Peak'}
                      </div>
                      <div className="font-mono text-xs text-white font-bold group-hover:text-amber-400 truncate">
                        {hex}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {copiedHex === hex ? 'Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                <strong className="text-white">Cinematic Masterclass Reference:</strong> {selectedEmotionPalette.filmReference}
              </span>
              <span className="text-cyan-400 font-mono">
                Recommended Contrast Multiplier: {selectedEmotionPalette.contrast}x
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RELATIONAL CONSTELLATION GRAPH */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">Relational Constellation Graph</span>
                <span aria-hidden="true">·</span>
                <span>Forces, chromatic clustering &amp; emotional kinships</span>
              </div>

              {/* Cultural Lens Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs self-start">
                <span className="px-2 text-slate-500 font-medium text-[11px]">Cultural Lens:</span>
                <button
                  onClick={() => setCulturalLens('western')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    culturalLens === 'western'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Western
                </button>
                <button
                  onClick={() => setCulturalLens('eastern')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    culturalLens === 'eastern'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Eastern
                </button>
                <button
                  onClick={() => setCulturalLens('middleEastern')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    culturalLens === 'middleEastern'
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Middle Eastern
                </button>
              </div>
            </div>

            <PsychologyGraph
              items={PSYCHOLOGY_ITEMS}
              selectedItem={selectedItem}
              onSelectItem={item => setSelectedItemId(item.id)}
              culturalView={culturalLens}
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Categories ({PSYCHOLOGY_ITEMS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('primary_emotion')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'primary_emotion'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Primary Emotions (8)
            </button>
            <button
              onClick={() => setSelectedCategory('psychological_trait')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'psychological_trait'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Psychological Traits (6)
            </button>
            <button
              onClick={() => setSelectedCategory('emotional_state')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'emotional_state'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Emotional States (5)
            </button>
          </div>

          {/* Main 2-Column Split: Item Selector List & Deep Dive Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sub-Categories List */}
            <div className="lg:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredItems.map(item => {
                const isSelected = item.id === selectedItemId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-850 border-slate-700 shadow-md ring-1 ring-slate-600/50'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850/60 hover:border-slate-750 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full shrink-0 shadow-inner"
                        style={{ backgroundColor: item.primaryColor }}
                      />
                      <div className="truncate">
                        <div className="font-semibold text-sm text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({item.categoryLabel})
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate">{item.tagline}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Deep-Dive Detail View */}
            <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
              {/* Header of selected item */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="capitalize">{selectedItem.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300">{selectedItem.associatedColors[0].hex}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span>{selectedItem.name}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block shadow-md"
                      style={{ backgroundColor: selectedItem.primaryColor }}
                    />
                  </h3>
                  <p className="text-sm text-slate-300">{selectedItem.tagline}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                  <button
                    onClick={() => {
                      const el = document.getElementById('color-depth-explorer');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Depth &amp; Tones</span>
                  </button>

                  <button
                    onClick={() => onLoadIntoWheel(selectedItem.associatedColors[0].hex)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Load Into Wheel</span>
                  </button>
                </div>
              </div>

              {/* Associated Swatches Bar */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Associated Chromatic Palette (60/30/10 Distribution)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedItem.associatedColors.map((swatch, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{swatch.name}</span>
                        <span className="text-[10px] text-slate-400">{swatch.role}</span>
                      </div>
                      <div
                        className="h-10 rounded-lg shadow-inner flex items-center justify-end pr-2"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        <button
                          onClick={() => copyToClipboard(swatch.hex)}
                          className="p-1 bg-black/50 hover:bg-black/75 rounded text-white transition-colors"
                          title="Copy Hex Code"
                        >
                          {copiedHex === swatch.hex ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>{swatch.hex}</span>
                        <span className="text-[10px] text-slate-500">{swatch.hsl}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychological Triggers & Physiological Responses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Triggers */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Brain className="w-4 h-4" />
                    <span>Psychological &amp; Subconscious Triggers</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                    {selectedItem.psychologicalTriggers.map((trig, idx) => (
                      <li key={idx}>{trig}</li>
                    ))}
                  </ul>
                </div>

                {/* Physiological Responses */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                    <HeartPulse className="w-4 h-4" />
                    <span>Physiological &amp; Somatic Responses</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                    {selectedItem.physiologicalResponses.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cultural Variations Matrix */}
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/70 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <Globe className="w-4 h-4" />
                  <span>Cultural Context Variations &amp; Semiotics</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200">Western Semiotics</div>
                    <p className="text-slate-400 leading-relaxed">
                      {selectedItem.culturalVariations.western}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200">Eastern Semiotics</div>
                    <p className="text-slate-400 leading-relaxed">
                      {selectedItem.culturalVariations.eastern}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200">Middle Eastern Semiotics</div>
                    <p className="text-slate-400 leading-relaxed">
                      {selectedItem.culturalVariations.middleEastern}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cinematic Reference Card */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50 flex items-start gap-3.5">
                <Film className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-slate-200">
                    Cinematic Masterclass Reference: {selectedItem.cinematicReference.film}
                  </div>
                  <div className="text-slate-400">
                    Director: {selectedItem.cinematicReference.director}
                  </div>
                  <p className="text-slate-300 italic">
                    "{selectedItem.cinematicReference.description}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Color Depth Explorer (Luminance & Saturation Tone Shift) */}
      <div id="color-depth-explorer" className="pt-4 scroll-mt-20">
        <ColorDepthExplorer
          selectedItem={selectedItem}
          onLoadIntoWheel={onLoadIntoWheel}
        />
      </div>

      {/* Post-Production Software Guide (DaVinci Resolve & Lightroom) */}
      <PostProductionSoftwareGuide
        selectedColor={activeGuideColor}
        colorName={activeGuideName}
        secondaryColor={selectedItem.associatedColors[1]?.hex || '#0f172a'}
        contextTitle={`How to Grade & Master "${activeGuideName}" in DaVinci Resolve & Lightroom`}
      />
    </section>
  );
};
