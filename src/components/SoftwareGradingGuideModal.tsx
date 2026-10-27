/**
 * Software-Specific Color Grading Guide Modal
 * Comprehensive production tutorials for creating Day, Night, and Day-for-Night grades
 * in DaVinci Resolve Studio and Adobe Lightroom Classic.
 */

import React, { useState } from 'react';
import {
  SCENARIO_SOFTWARE_MANUALS,
  LUT_IMPORT_INSTRUCTIONS,
} from '../data/softwareWorkflowsData';
import {
  X,
  Film,
  Camera,
  Layers,
  Sliders,
  Download,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  FileCode,
  FolderOpen,
} from 'lucide-react';

interface SoftwareGradingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId?: string;
}

export const SoftwareGradingGuideModal: React.FC<SoftwareGradingGuideModalProps> = ({
  isOpen,
  onClose,
  activeScenarioId = 'golden_hour_magic',
}) => {
  const [activeSoftware, setActiveSoftware] = useState<'davinci' | 'lightroom' | 'import_lut'>('davinci');
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(activeScenarioId);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentManual =
    SCENARIO_SOFTWARE_MANUALS[selectedScenarioKey] ||
    SCENARIO_SOFTWARE_MANUALS['golden_hour_magic'];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                How to Create &amp; Apply These Colors in Software
              </h3>
              <p className="text-xs text-slate-400">
                Official step-by-step colorist workflows for Blackmagic DaVinci Resolve &amp; Adobe Lightroom Classic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close software manual"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Software Navigation Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSoftware('davinci')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeSoftware === 'davinci'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>DaVinci Resolve Studio</span>
            </button>

            <button
              onClick={() => setActiveSoftware('lightroom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeSoftware === 'lightroom'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Adobe Lightroom Classic</span>
            </button>

            <button
              onClick={() => setActiveSoftware('import_lut')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeSoftware === 'import_lut'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>How to Import .CUBE &amp; .XMP</span>
            </button>
          </div>

          {/* Scenario Selector if not on Import LUT tab */}
          {activeSoftware !== 'import_lut' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Target Scenario:</span>
              <select
                value={selectedScenarioKey}
                onChange={e => setSelectedScenarioKey(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
              >
                <option value="golden_hour_magic">Golden Hour (Day Scene)</option>
                <option value="moonlit_day_for_night">Moonlit Night (Night Scene)</option>
                <option value="neon_noir_cyberpunk">Neon Noir (Cyberpunk Night)</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: DAVINCI RESOLVE */}
          {activeSoftware === 'davinci' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">
                    {currentManual.davinciGuide.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                    DaVinci Resolve Studio 18 / 19
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentManual.davinciGuide.summary}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  <strong>Recommended Keyboard Shortcuts:</strong>{' '}
                  <span className="text-cyan-300">{currentManual.davinciGuide.quickShortcut}</span>
                </div>
              </div>

              {/* Step by step cards */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sequential Node Pipeline &amp; Panel Adjustments:</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentManual.davinciGuide.steps.map(s => (
                    <div
                      key={s.stepNumber}
                      className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px]">
                            {s.stepNumber}
                          </span>
                          <span className="font-bold text-white">{s.action}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">{s.panelName}</span>
                      </div>

                      <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-[11px]">
                        {s.valuesToSet}
                      </div>

                      <p className="text-slate-400 text-[11px] leading-relaxed">{s.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Colorist Secret Box */}
              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/40 text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-amber-300">Hollywood Colorist Secret:</span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentManual.davinciGuide.proTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADOBE LIGHTROOM CLASSIC */}
          {activeSoftware === 'lightroom' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">
                    {currentManual.lightroomGuide.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60">
                    Adobe Lightroom Classic &amp; Camera Raw
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentManual.lightroomGuide.summary}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  <strong>Recommended Keyboard Shortcuts:</strong>{' '}
                  <span className="text-amber-300">{currentManual.lightroomGuide.quickShortcut}</span>
                </div>
              </div>

              {/* Step by step cards */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lightroom Develop Panels &amp; Slider Values:</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentManual.lightroomGuide.steps.map(s => (
                    <div
                      key={s.stepNumber}
                      className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">
                            {s.stepNumber}
                          </span>
                          <span className="font-bold text-white">{s.action}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400">{s.panelName}</span>
                      </div>

                      <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-amber-300 text-[11px]">
                        {s.valuesToSet}
                      </div>

                      <p className="text-slate-400 text-[11px] leading-relaxed">{s.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Colorist Secret Box */}
              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/40 text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-amber-300">Lightroom Pro Calibration Tip:</span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentManual.lightroomGuide.proTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPORTING .CUBE & .XMP */}
          {activeSoftware === 'import_lut' && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* DaVinci Import Box */}
                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                    <Film className="w-4 h-4 text-cyan-400" />
                    <span>How to Install .CUBE LUTs in DaVinci Resolve</span>
                  </div>
                  <ol className="space-y-2 text-slate-300 list-none">
                    {LUT_IMPORT_INSTRUCTIONS.davinci_resolve.map((step, idx) => (
                      <li key={idx} className="leading-relaxed flex items-start gap-2">
                        <span className="text-cyan-400 font-mono font-bold mt-0.5">0{idx + 1}.</span>
                        <span>{step.slice(3)}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="pt-2 border-t border-slate-850">
                    <button
                      onClick={() =>
                        handleCopy(
                          LUT_IMPORT_INSTRUCTIONS.davinci_resolve.join('\n'),
                          'davinci_guide'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-mono text-[11px]"
                    >
                      {copiedText === 'davinci_guide' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied DaVinci Guide!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy DaVinci Steps</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lightroom Import Box */}
                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>How to Install .XMP Presets in Adobe Lightroom</span>
                  </div>
                  <ol className="space-y-2 text-slate-300 list-none">
                    {LUT_IMPORT_INSTRUCTIONS.adobe_lightroom.map((step, idx) => (
                      <li key={idx} className="leading-relaxed flex items-start gap-2">
                        <span className="text-amber-400 font-mono font-bold mt-0.5">0{idx + 1}.</span>
                        <span>{step.slice(3)}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="pt-2 border-t border-slate-850">
                    <button
                      onClick={() =>
                        handleCopy(
                          LUT_IMPORT_INSTRUCTIONS.adobe_lightroom.join('\n'),
                          'lightroom_guide'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-mono text-[11px]"
                    >
                      {copiedText === 'lightroom_guide' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Lightroom Guide!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Lightroom Steps</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Compatible with DaVinci Resolve 16/17/18/19, Premiere Pro, Final Cut, and Lightroom Classic</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
