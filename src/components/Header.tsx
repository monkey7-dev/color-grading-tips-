import React from 'react';
import { Palette, Compass, Eye, Film, User, BookOpen, Box } from 'lucide-react';

export type ActiveTab =
  | 'psychology'
  | 'three_universe'
  | 'harmonies'
  | 'accessibility'
  | 'cinematography'
  | 'skintones'
  | 'library';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSavedRecipes: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSavedRecipes,
  savedCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'psychology', label: 'Psychology', icon: <Palette className="w-4 h-4" /> },
    { id: 'three_universe', label: '3D Universe', icon: <Box className="w-4 h-4 text-cyan-400" /> },
    { id: 'harmonies', label: 'Harmonies', icon: <Compass className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'cinematography', label: 'Cinematography', icon: <Film className="w-4 h-4" /> },
    { id: 'skintones', label: 'Skin Tones', icon: <User className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-rose-400">
                CM
              </span>
            </div>
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Color Matrix
          </span>
        </div>

        {/* Zone 2: Navigation Links (single line, clean buttons with active states) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60"
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSavedRecipes}
            aria-label="Open saved recipes library"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-750 hover:text-white border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved Recipes</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono font-semibold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
