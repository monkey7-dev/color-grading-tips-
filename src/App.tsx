/**
 * The Ultimate Color Psychology & Cinematography Matrix
 * An interactive masterclass exploring color psychology, cinematic harmonies,
 * accessibility simulation, DaVinci Resolve workflows, natural skin tone precision,
 * 3D Studio Lighting Stages, and academic color theory.
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { PsychologySection } from './components/PsychologySection';
import { HarmoniesSection } from './components/HarmoniesSection';
import { AccessibilitySection } from './components/AccessibilitySection';
import { CinematographySection } from './components/CinematographySection';
import { SkinToneSection } from './components/SkinToneSection';
import { LibrarySection } from './components/LibrarySection';
import { PhotoColorGradingStudio } from './components/PhotoColorGradingStudio';
import { ThreeCinemaStage } from './components/ThreeCinemaStage';
import { RecipeModal } from './components/RecipeModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { InstallModal } from './components/InstallModal';
import { SearchGroundingCinematographyModal } from './components/SearchGroundingCinematographyModal';
import { initAuth } from './services/googleDriveAuth';
import { ColorRecipe } from './utils/exporters';
import { hexToRgb, rgbToHsl } from './utils/colorMath';
import { useAuth } from './context/AuthContext';
import { getUserPalettes, saveUserPalette } from './services/userColorStorage';

const INITIAL_RECIPES: ColorRecipe[] = [
  {
    id: 'seed-1',
    name: 'Blade Runner 2049 (Teal & Amber)',
    category: 'Sci-Fi / Cyberpunk',
    harmonyType: 'complementary',
    swatches: [
      { name: 'Key Cyan Fog', hex: '#00b4d8' },
      { name: 'Irradiated Sand', hex: '#ff8a00' },
      { name: 'Specular Neon', hex: '#ffe600' },
    ],
    description: 'Opposing complementary clash between industrial cyan smog and radioactive amber desert storms.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    name: 'Amélie (Parisian Whimsy)',
    category: 'Cinematic Grade',
    harmonyType: 'complementary',
    swatches: [
      { name: 'Montmartre Olive', hex: '#16a34a' },
      { name: 'Crimson Velvet', hex: '#dc2626' },
      { name: 'Golden Honey', hex: '#fbbf24' },
    ],
    description: 'High-chroma red and green complementary warmth inspired by painter Juarez Machado.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    name: 'The Matrix (Digital Code Green)',
    category: 'Sci-Fi / Cyberpunk',
    harmonyType: 'monochromatic',
    swatches: [
      { name: 'Phosphor Matrix Green', hex: '#10b981' },
      { name: 'Shadow Terminal', hex: '#064e3b' },
      { name: 'Cathode Peak', hex: '#6ee7b7' },
    ],
    description: 'Unnatural monochromatic green tint baked into shadows and highlights inside the simulated reality.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-4',
    name: 'Her (Tender Analogous Salmon)',
    category: 'Vintage / Analog Film',
    harmonyType: 'analogous',
    swatches: [
      { name: 'Salmon Coral', hex: '#fb7185' },
      { name: 'Warm Tangerine', hex: '#f97316' },
      { name: 'Soft Peach Highlight', hex: '#fde047' },
    ],
    description: 'Intimate analogous warmth exploring human connection and vulnerability, with blue banned from set.',
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('psychology');
  const [currentBaseHue, setCurrentBaseHue] = useState<number>(38);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState<boolean>(false);
  const [isGoogleDriveModalOpen, setIsGoogleDriveModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isSearchGroundingModalOpen, setIsSearchGroundingModalOpen] = useState<boolean>(false);
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);

  const { user } = useAuth();

  // Check Drive auth connection state
  useEffect(() => {
    const unsub = initAuth(
      () => setIsDriveConnected(true),
      () => setIsDriveConnected(false)
    );
    return () => unsub();
  }, []);

  // Saved recipes state with localStorage
  const [savedRecipes, setSavedRecipes] = useState<ColorRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('cm_saved_recipes');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_RECIPES;
  });

  // Sync with Firestore when user logs in
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    getUserPalettes(user.uid)
      .then(firestorePalettes => {
        if (!isMounted || !firestorePalettes.length) return;
        setSavedRecipes(prev => {
          const map = new Map<string, ColorRecipe>();
          prev.forEach(r => map.set(r.id, r));
          firestorePalettes.forEach(fp => {
            map.set(fp.id, {
              id: fp.id,
              name: fp.title,
              category: fp.genre || 'Cloud Saved',
              harmonyType: fp.mood || 'Palette',
              swatches: (fp.swatches || []).map(s => ({ name: s.role || s.name || 'Tone', hex: s.hex })),
              description: fp.tagline,
              createdAt: fp.createdAt ? new Date().toISOString() : new Date().toISOString(),
            });
          });
          return Array.from(map.values());
        });
      })
      .catch(err => {
        console.warn('Could not retrieve cloud palettes from Firestore:', err?.message);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('cm_saved_recipes', JSON.stringify(savedRecipes));
    } catch {
      // ignore
    }
  }, [savedRecipes]);

  // Load color from psychology or swatches directly into harmonies wheel
  const handleLoadColorIntoWheel = (hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setCurrentBaseHue(hsl.h);
    setActiveTab('harmonies');
  };

  const handleSaveRecipe = (recipe: ColorRecipe) => {
    setSavedRecipes(prev => [recipe, ...prev.filter(r => r.id !== recipe.id)]);
    // If logged in, also persist to Firestore
    if (user) {
      saveUserPalette(user.uid, {
        id: recipe.id,
        title: recipe.name,
        tagline: recipe.description || recipe.harmonyType,
        genre: recipe.category,
        mood: recipe.harmonyType,
        swatches: recipe.swatches.map(s => ({ hex: s.hex, name: s.name, role: s.name })),
      }).catch(err => console.warn('Could not auto-sync recipe to Firestore:', err?.message));
    }
  };

  const handleDeleteRecipe = (id: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleLoadRecipe = (recipe: ColorRecipe) => {
    if (recipe.swatches && recipe.swatches[0]) {
      const rgb = hexToRgb(recipe.swatches[0].hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setCurrentBaseHue(hsl.h);
      setActiveTab('harmonies');
    }
    setSavedRecipes(prev => [recipe, ...prev.filter(r => r.id !== recipe.id)]);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Universal Header with Navigation, Firebase Auth, and Drive */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSavedRecipes={() => setIsRecipeModalOpen(true)}
        savedCount={savedRecipes.length}
        onOpenGoogleDrive={() => setIsGoogleDriveModalOpen(true)}
        onOpenInstallGuide={() => setIsInstallModalOpen(true)}
        onOpenSearchGrounding={() => setIsSearchGroundingModalOpen(true)}
        isDriveConnected={isDriveConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 md:py-10">
        {activeTab === 'psychology' && (
          <PsychologySection onLoadIntoWheel={handleLoadColorIntoWheel} />
        )}

        {(activeTab === 'photo_grader' || activeTab === 'three_universe') && (
          <PhotoColorGradingStudio />
        )}

        {activeTab === 'three_cinema' && <ThreeCinemaStage />}

        {activeTab === 'harmonies' && (
          <HarmoniesSection
            currentBaseHue={currentBaseHue}
            setCurrentBaseHue={setCurrentBaseHue}
            onSaveRecipe={handleSaveRecipe}
          />
        )}

        {activeTab === 'accessibility' && <AccessibilitySection />}

        {activeTab === 'cinematography' && <CinematographySection />}

        {activeTab === 'skintones' && <SkinToneSection />}

        {activeTab === 'library' && <LibrarySection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-8 px-4 lg:px-8 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">The Ultimate Color Psychology &amp; Cinematography Matrix</span>
            <span aria-hidden="true">·</span>
            <span>Based on Rec.709, WCAG 2.1, and Josef Albers Foundations</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 flex-wrap">
            <button onClick={() => setActiveTab('psychology')} className="hover:text-white transition-colors">
              Psychology
            </button>
            <button onClick={() => setActiveTab('photo_grader')} className="hover:text-white transition-colors text-cyan-400">
              Photo Grader
            </button>
            <button onClick={() => setActiveTab('three_cinema')} className="hover:text-white transition-colors text-amber-400 font-semibold">
              3D Cinema Stage
            </button>
            <button onClick={() => setActiveTab('harmonies')} className="hover:text-white transition-colors">
              Harmonies
            </button>
            <button onClick={() => setActiveTab('accessibility')} className="hover:text-white transition-colors">
              Accessibility
            </button>
            <button onClick={() => setActiveTab('cinematography')} className="hover:text-white transition-colors">
              Cinematography
            </button>
            <button onClick={() => setActiveTab('skintones')} className="hover:text-white transition-colors">
              Skin Tones
            </button>
            <button onClick={() => setActiveTab('library')} className="hover:text-white transition-colors">
              Library
            </button>
          </div>
        </div>
      </footer>

      {/* Saved Recipes Modal */}
      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipes={savedRecipes}
        onDeleteRecipe={handleDeleteRecipe}
        onLoadRecipe={handleLoadRecipe}
      />

      {/* Google Drive Cloud Sync Modal */}
      <GoogleDriveModal
        isOpen={isGoogleDriveModalOpen}
        onClose={() => setIsGoogleDriveModalOpen(false)}
        recipes={savedRecipes}
        onLoadRecipeIntoApp={handleLoadRecipe}
      />

      {/* App Install Guide Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Google Search Grounding Cinematography Modal */}
      <SearchGroundingCinematographyModal
        isOpen={isSearchGroundingModalOpen}
        onClose={() => setIsSearchGroundingModalOpen(false)}
        onApplyPaletteToWheels={swatches => {
          if (swatches && swatches[0]) {
            handleLoadColorIntoWheel(swatches[0]);
          }
        }}
      />
    </div>
  );
}
