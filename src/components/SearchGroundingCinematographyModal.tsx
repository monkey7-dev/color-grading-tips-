import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  Film,
  Camera,
  X,
  Loader2,
  Bookmark,
  Check,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveUserPalette } from '../services/userColorStorage';
import { generateCubeLut, downloadFile, ColorRecipe } from '../utils/exporters';

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPaletteToWheels?: (swatches: string[]) => void;
}

export const SearchGroundingCinematographyModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
  onApplyPaletteToWheels,
}) => {
  const [query, setQuery] = useState<string>('Dune: Part Two desert spice color grading');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/cinematography-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error('Search failed to complete.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to search cinematography reference.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToFirebase = async () => {
    if (!user) {
      alert('Please sign in with Google to save research palettes to your cloud library.');
      return;
    }
    if (!result) return;

    try {
      const swatches = (result.colorPalette || ['#1e1b18', '#854d0e', '#ca8a04', '#38bdf8', '#f8fafc']).map(
        (hex: string, i: number) => ({
          hex,
          name: `Color ${i + 1}`,
          role: i === 0 ? 'Shadows' : i === 1 ? 'Midtones' : i === 2 ? 'Highlights' : 'Accent',
        })
      );

      await saveUserPalette(user.uid, {
        id: `search_pal_${Date.now()}`,
        title: result.title || `Research: ${query}`,
        tagline: result.summary || `Grounded search analysis for ${query}`,
        genre: 'Cinema Grounding Research',
        mood: 'Grounded Film Reference',
        swatches,
        filmReferences: result.filmReferences || [query],
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      console.error('Error saving palette to Firebase:', err);
    }
  };

  const handleExportLut = () => {
    if (!result) return;
    const swatches = result.colorPalette || ['#1e1b18', '#854d0e', '#ca8a04', '#38bdf8', '#f8fafc'];
    const recipe: ColorRecipe = {
      id: `search_lut_${Date.now()}`,
      name: `Search_${query.replace(/[^a-zA-Z0-9]/g, '_')}`,
      category: 'Search Grounding Film Look',
      harmonyType: 'Google Grounded Film Look',
      swatches: [
        { name: 'Key Shadow Tone', hex: swatches[0] || '#1e1b18' },
        { name: 'Midtone Warmth', hex: swatches[1] || '#854d0e' },
        { name: 'Highlight Rim', hex: swatches[2] || '#ca8a04' },
      ],
      createdAt: new Date().toISOString(),
    };
    const cube = generateCubeLut(recipe);
    downloadFile(new Blob([cube], { type: 'text/plain;charset=utf-8' }), `${recipe.name}.cube`);
  };

  const sampleQueries = [
    'Dune: Part Two Greig Fraser desert palette',
    'Oppenheimer IMAX 65mm Kodak tone curve',
    'The Batman 2022 sodium vapor practicals',
    'Blade Runner 2049 Roger Deakins cyan atmosphere',
    'Poor Things Robbie Ryan color grading',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  Real-World Film Search &amp; Grounding
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground color research with live Google Search data via Gemini 3.8 Flash for modern cinema releases.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search real film, director of photography, or camera sensor look..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Google...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Grounding</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Query Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 shrink-0 mr-1 font-semibold">Suggested:</span>
            {sampleQueries.map(sq => (
              <button
                key={sq}
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 shrink-0 transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Results Container */}
        {result && (
          <div className="space-y-4 bg-slate-950/80 rounded-xl border border-slate-800 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Grounding Source: {result.source}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {result.title || `Cinematography Analysis: ${query}`}
                </h4>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLut}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .CUBE</span>
                </button>

                <button
                  onClick={handleSaveToFirebase}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Saved to Cloud!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save to Firebase</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Text */}
            <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {result.analysisText || result.summary}
            </div>

            {/* Grounding Web Citations & Google Queries */}
            {result.webCitations && result.webCitations.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified Google Search Grounding Sources:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.webCitations.map((citation: any, idx: number) => (
                    <a
                      key={idx}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs flex items-center justify-between group transition-colors"
                    >
                      <span className="truncate text-slate-300 group-hover:text-cyan-300">
                        {citation.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
