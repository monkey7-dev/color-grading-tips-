import React from 'react';
import { Palette, Compass, Eye, Film, User, BookOpen, Box, BarChart3 } from 'lucide-react';

export type ActiveTab =
  | 'psychology'
  | 'three_universe'
  | 'harmonies'
  | 'accessibility'
  | 'cinematography'
  | 'skintones'
  | 'library'
  | 'insights';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSavedRecipes: () => void;
  savedCount: number;
  onOpenGoogleDrive: () => void;
  onOpenInstallGuide: () => void;
  isDriveConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSavedRecipes,
  savedCount,
  onOpenGoogleDrive,
  onOpenInstallGuide,
  isDriveConnected,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'psychology', label: 'Psychology', icon: <Palette className="w-4 h-4" /> },
    { id: 'three_universe', label: '3D Universe', icon: <Box className="w-4 h-4 text-cyan-400" /> },
    { id: 'harmonies', label: 'Harmonies', icon: <Compass className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'cinematography', label: 'Cinematography', icon: <Film className="w-4 h-4" /> },
    { id: 'skintones', label: 'Skin Tones', icon: <User className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenGoogleDrive}
            aria-label="Open Google Drive cloud sync"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/70 rounded-lg transition-colors"
            title="Google Drive Cloud Sync & LUT Storage"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm1.72 6.5l3.43 6h9.99l-3.43-6H9.43zm7.42-6.5L13.42 9l3.43 6 6.56-11.5H16.85z" />
            </svg>
            <span className="hidden sm:inline">Drive</span>
            {isDriveConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={onOpenInstallGuide}
            aria-label="How to install app"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
            title="How to install as Desktop or Mobile app"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Install App</span>
          </button>

          <button
            onClick={onOpenSavedRecipes}
            aria-label="Open saved recipes library"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-750 hover:text-white border border-slate-700/80 rounded-lg transition-colors"
            title="Saved recipe collection"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved Recipes</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono font-semibold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

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

export default Header;
