import React, { useState } from 'react';
import {
  ACADEMIC_RESOURCES,
  GOETHE_VS_NEWTON,
  ALBERS_PRINCIPLES,
  ReferenceResource,
} from '../data/libraryData';
import {
  BookOpen,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sliders,
  Scale,
  Sparkles,
  Eye,
} from 'lucide-react';

export const LibrarySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  // Josef Albers Interactive Simultaneous Contrast Simulator state
  const [albersInnerColor, setAlbersInnerColor] = useState<string>('#94a3b8'); // middle gray
  const [albersBgMode, setAlbersBgMode] = useState<'value' | 'hue'>('value');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'perception', label: 'Color Perception & Science' },
    { id: 'cinematography', label: 'Cinematography & Grading' },
    { id: 'accessibility', label: 'Accessibility Standards' },
    { id: 'lighting', label: 'Lighting Thermodynamics' },
  ];

  const filteredResources = ACADEMIC_RESOURCES.filter(res => {
    const matchesCat = activeCategory === 'all' || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const copyCitation = (res: ReferenceResource) => {
    const citation = `${res.author}. "${res.title}." ${res.publication}. Available online at: ${res.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitationId(res.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
          <span>06</span>
          <span aria-hidden="true">·</span>
          <span>Seminal Treatises, Research &amp; Scholarly Citations</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          The Academic &amp; Reference Library
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
          Interactive historical demonstrations of Josef Albers’ simultaneous contrast, Goethe’s
          perceptual phenomenology versus Newton’s physical optics, and curated links to official
          documentation.
        </p>
      </div>

      {/* Part 1: Josef Albers "Interaction of Color" Interactive Simulator */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Eye className="w-4 h-4" />
              <span>Josef Albers (Yale University, 1963)</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Simultaneous Contrast &amp; Color Subtraction Visualizer
            </h3>
            <p className="text-xs text-slate-400">
              "In visual perception a color is almost never seen as it really is — as it physically is.
              Color deceives continually."
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setAlbersBgMode('value')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                albersBgMode === 'value'
                  ? 'bg-slate-800 text-white font-semibold ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Light vs. Dark Ground
            </button>
            <button
              onClick={() => setAlbersBgMode('hue')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                albersBgMode === 'hue'
                  ? 'bg-slate-800 text-white font-semibold ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warm vs. Cool Field
            </button>
          </div>
        </div>

        {/* The Two Plates Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
          {/* Plate A */}
          <div
            className="h-56 rounded-2xl flex items-center justify-center relative shadow-inner transition-colors duration-500"
            style={{
              backgroundColor: albersBgMode === 'value' ? '#090d16' : '#eab308',
            }}
          >
            <div
              className="w-20 h-20 rounded-xl shadow-2xl transition-all duration-300"
              style={{ backgroundColor: albersInnerColor }}
            />
            <span className="absolute bottom-3 left-4 text-[10px] uppercase font-mono tracking-wider text-slate-400/80 bg-black/40 px-2 py-0.5 rounded">
              {albersBgMode === 'value' ? 'Black Ground (#090D16)' : 'Yellow Ground (580nm)'}
            </span>
          </div>

          {/* Plate B */}
          <div
            className="h-56 rounded-2xl flex items-center justify-center relative shadow-inner transition-colors duration-500"
            style={{
              backgroundColor: albersBgMode === 'value' ? '#f8fafc' : '#2563eb',
            }}
          >
            <div
              className="w-20 h-20 rounded-xl shadow-2xl transition-all duration-300"
              style={{ backgroundColor: albersInnerColor }}
            />
            <span className="absolute bottom-3 left-4 text-[10px] uppercase font-mono tracking-wider text-slate-400/80 bg-black/40 px-2 py-0.5 rounded">
              {albersBgMode === 'value' ? 'White Ground (#F8FAFC)' : 'Blue Ground (465nm)'}
            </span>
          </div>
        </div>

        {/* Reveal / Proof Bar */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200">Test Your Brain:</span>
            <span className="text-slate-400">
              The two inner squares above have the <strong className="text-white">exact same hexadecimal code ({albersInnerColor})</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={albersInnerColor}
              onChange={e => setAlbersInnerColor(e.target.value)}
              className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
              title="Change inner square color"
            />
            <span className="text-[11px] font-mono text-cyan-300">{albersInnerColor}</span>
          </div>
        </div>

        {/* Albers 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {ALBERS_PRINCIPLES.map((pr, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/60 space-y-2 text-xs"
            >
              <div className="font-bold text-white text-sm">{pr.title}</div>
              <p className="text-amber-300/90 font-medium text-[11px]">{pr.tagline}</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">{pr.explanation}</p>
              <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-850">
                <strong className="text-slate-300">Practical Application:</strong> {pr.practicalImplication}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Goethe vs. Newton Historical Comparative Matrix */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
              <Scale className="w-4 h-4" />
              <span>Optics vs. Phenomenology</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Goethe’s Theory of Colours (1810) vs. Newton’s Opticks (1704)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">
            Epistemological Debate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4 w-1/4">Philosophical Dimension</th>
                <th className="py-3 px-4 w-1/3 text-cyan-400 font-bold">Sir Isaac Newton (Opticks, 1704)</th>
                <th className="py-3 px-4 w-1/3 text-amber-400 font-bold">Johann Wolfgang von Goethe (1810)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {GOETHE_VS_NEWTON.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white align-top">
                    {row.dimension}
                    <div className="text-[10px] font-normal text-slate-500 mt-1 italic">
                      Modern synthesis: {row.modernConsensus}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 align-top leading-relaxed bg-cyan-950/10">
                    {row.newtonView}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 align-top leading-relaxed bg-amber-950/10">
                    {row.goetheView}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 3: Curated Technical Reference Hub & Citations */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Curated Reference Library &amp; Direct Links</span>
            </h3>
            <p className="text-xs text-slate-400">
              Authoritative texts, W3C standards, DaVinci Resolve colorist guides, and research archives.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter citations by keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-800 text-white font-semibold shadow-sm ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reference Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-750 transition-colors shadow"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {res.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500">{res.publication}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{res.title}</h4>
                <div className="text-xs text-slate-400 font-medium">By {res.author}</div>
                <p className="text-xs text-slate-300/90 leading-relaxed pt-1">
                  {res.keyTakeaway}
                </p>
              </div>

              {/* Actions: Open link + copy citation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-850 text-xs">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium underline"
                >
                  <span>{res.urlLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => copyCitation(res)}
                  className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors text-[11px]"
                  title="Copy formatted citation"
                >
                  {copiedCitationId === res.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Citation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
