import React from 'react';
import {
  Palette,
  Compass,
  Eye,
  Film,
  User,
  BookOpen,
  Camera,
  Box,
  Globe,
  LogIn,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab =
  | 'psychology'
  | 'photo_grader'
  | 'three_cinema'
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
  onOpenGoogleDrive: () => void;
  onOpenInstallGuide: () => void;
  onOpenSearchGrounding?: () => void;
  isDriveConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSavedRecipes,
  savedCount,
  onOpenGoogleDrive,
  onOpenInstallGuide,
  onOpenSearchGrounding,
  isDriveConnected,
}) => {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'psychology', label: 'Psychology', icon: <Palette className="w-4 h-4" /> },
    { id: 'photo_grader', label: 'Photo Grader', icon: <Camera className="w-4 h-4 text-cyan-400" /> },
    { id: 'three_cinema', label: '3D Stage', icon: <Box className="w-4 h-4 text-amber-400" /> },
    { id: 'harmonies', label: 'Harmonies', icon: <Compass className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'cinematography', label: 'Cinematography', icon: <Film className="w-4 h-4" /> },
    { id: 'skintones', label: 'Skin Tones', icon: <User className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/40">
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
          className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60"
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.id || (tab.id === 'photo_grader' && activeTab === 'three_universe');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
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

        {/* Zone 3: Header Actions (Search Grounding, Firebase Auth, Google Drive, Saved) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Google Search Grounding Button */}
          {onOpenSearchGrounding && (
            <button
              onClick={onOpenSearchGrounding}
              aria-label="Search real-world film looks with Google Search grounding"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              title="Google Search Grounded Film References (Gemini 3.8 Flash)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Film Search</span>
            </button>
          )}

          {/* Google Drive Sync Button */}
          <button
            onClick={onOpenGoogleDrive}
            aria-label="Open Google Drive cloud sync"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            title="Google Drive Cloud Sync & LUT Storage"
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm1.72 6.5l3.43 6h9.99l-3.43-6H9.43zm7.42-6.5L13.42 9l3.43 6 6.56-11.5H16.85z" />
            </svg>
            <span className="hidden lg:inline">Drive</span>
            {isDriveConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Saved Recipes Button */}
          <button
            onClick={onOpenSavedRecipes}
            aria-label="Open saved recipes library"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 hover:text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Firebase Google Auth Button */}
          {authLoading ? (
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <div className="flex items-center gap-1.5" title={`Signed in as ${user.email}`}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[90px] truncate">
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Sign Out from Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-sm"
              title="Sign in with Google to sync color recipes to Firebase Firestore"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive nav strip for smaller viewports */}
      <div className="xl:hidden flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id || (tab.id === 'photo_grader' && activeTab === 'three_universe');
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
