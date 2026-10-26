import React, { useState } from 'react';
import { ColorRecipe, generateAseBuffer, generateCubeLut, generateLightroomXmp, downloadFile } from '../utils/exporters';
import { X, Trash2, Download, Compass, Plus, Bookmark, Folder } from 'lucide-react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: ColorRecipe[];
  onDeleteRecipe: (id: string) => void;
  onLoadRecipe: (recipe: ColorRecipe) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onDeleteRecipe,
  onLoadRecipe,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(recipes.map(r => r.category)))];

  const filtered = recipes.filter(r => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.harmonyType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const exportAse = (recipe: ColorRecipe) => {
    const buffer = generateAseBuffer(recipe.name, recipe.swatches);
    const blob = new Blob([buffer as unknown as BlobPart], { type: 'application/octet-stream' });
    downloadFile(blob, `${recipe.name.toLowerCase().replace(/\s+/g, '_')}.ase`);
  };

  const exportCube = (recipe: ColorRecipe) => {
    const cube = generateCubeLut(recipe);
    const blob = new Blob([cube], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, `${recipe.name.toLowerCase().replace(/\s+/g, '_')}_3dlut.cube`);
  };

  const exportXmp = (recipe: ColorRecipe) => {
    const xmp = generateLightroomXmp(recipe);
    const blob = new Blob([xmp], { type: 'application/rdf+xml;charset=utf-8' });
    downloadFile(blob, `${recipe.name.toLowerCase().replace(/\s+/g, '_')}_preset.xmp`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Saved Harmony Recipes &amp; Look Library</h3>
              <p className="text-xs text-slate-400">Export as Adobe .ASE, DaVinci .CUBE 3D LUT, or Lightroom .XMP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950/40">
          <input
            type="text"
            placeholder="Search saved recipes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />

          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Cards List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Folder className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No saved recipes found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate and customize palettes in Section 2, then click "Save to Library" to build your custom look collection.
              </p>
            </div>
          ) : (
            filtered.map(recipe => (
              <div
                key={recipe.id}
                className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-750 transition-colors"
              >
                {/* Details & Palette bar */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm truncate">{recipe.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {recipe.category}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {recipe.harmonyType}
                    </span>
                  </div>

                  {/* Swatches strip */}
                  <div className="flex items-center gap-1.5 h-6">
                    {recipe.swatches.map((sw, i) => (
                      <div
                        key={i}
                        className="h-full rounded-md shadow flex-1 group relative cursor-pointer"
                        style={{ backgroundColor: sw.hex }}
                        title={`${sw.name}: ${sw.hex}`}
                      />
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">
                    {recipe.swatches.map(s => `${s.name}: ${s.hex}`).join(' · ')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onLoadRecipe(recipe);
                      onClose();
                    }}
                    className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5"
                    title="Load into Color Wheel"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Load</span>
                  </button>

                  <button
                    onClick={() => exportAse(recipe)}
                    className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs"
                    title="Export .ASE (Photoshop/Illustrator)"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                  </button>

                  <button
                    onClick={() => exportCube(recipe)}
                    className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs"
                    title="Export .CUBE (DaVinci Resolve / Premiere 3D LUT)"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => exportXmp(recipe)}
                    className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs"
                    title="Export .XMP (Lightroom Classic)"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onDeleteRecipe(recipe.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-xs"
                    title="Delete recipe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>{recipes.length} saved recipes in your local matrix</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
