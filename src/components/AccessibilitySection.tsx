import React, { useState, useMemo } from 'react';
import {
  hexToRgb,
  rgbToHex,
  evaluateWcag,
  simulateColorBlindness,
  ColorBlindnessType,
} from '../utils/colorMath';
import { Eye, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { PostProductionSoftwareGuide } from './PostProductionSoftwareGuide';

export const AccessibilitySection: React.FC = () => {
  const [fgHex, setFgHex] = useState<string>('#ffffff');
  const [bgHex, setBgHex] = useState<string>('#0f172a');
  const [selectedSimType, setSelectedSimType] = useState<ColorBlindnessType>('normal');

  // Compute WCAG
  const fgRgb = useMemo(() => hexToRgb(fgHex), [fgHex]);
  const bgRgb = useMemo(() => hexToRgb(bgHex), [bgHex]);

  const rating = useMemo(() => {
    return evaluateWcag(fgRgb, bgRgb);
  }, [fgRgb, bgRgb]);

  // Color blindness descriptions
  const simulationInfo: Record<
    ColorBlindnessType,
    { name: string; description: string; prevalence: string; cones: string }
  > = {
    normal: {
      name: 'Trichromacy (Standard Vision)',
      description: 'Full functioning L (red), M (green), and S (blue) photopigments.',
      prevalence: '92% of global population',
      cones: 'All 3 cone types operational',
    },
    protanopia: {
      name: 'Protanopia (Red-Blind / L-Cone Absent)',
      description: 'L-cones are missing or dysfunctional; red appears dark brown/gray and confuses with green and orange.',
      prevalence: '~1% of males, 0.02% of females',
      cones: 'L-cone (Long wavelength) absent',
    },
    deuteranopia: {
      name: 'Deuteranopia (Green-Blind / M-Cone Absent)',
      description: 'M-cones are absent; the most common form of color blindness. Green and red collapse into yellowish-brown.',
      prevalence: '~6% of males, 0.4% of females',
      cones: 'M-cone (Medium wavelength) absent',
    },
    tritanopia: {
      name: 'Tritanopia (Blue-Blind / S-Cone Absent)',
      description: 'S-cones are missing; blue looks greenish, yellow and pink confuse into lavender/gray.',
      prevalence: '<0.01% (Rare autosomal mutation)',
      cones: 'S-cone (Short wavelength) absent',
    },
    achromatopsia: {
      name: 'Achromatopsia (Monochromacy / Total Color Blindness)',
      description: 'Complete absence of cone function; vision is mediated entirely by rods in shades of gray.',
      prevalence: '1 in 33,000 individuals',
      cones: 'Zero functional cones (pure rod vision)',
    },
  };

  // Test swatch palette for multi-sim comparison
  const samplePalette = [
    { label: 'Signal Red', hex: '#ef4444' },
    { label: 'Warning Amber', hex: '#f59e0b' },
    { label: 'Safety Green', hex: '#10b981' },
    { label: 'Primary Cyan', hex: '#06b6d4' },
    { label: 'Deep Blue', hex: '#3b82f6' },
    { label: 'Vivid Violet', hex: '#8b5cf6' },
  ];

  // Simulated colors for current pair
  const simFg = simulateColorBlindness(fgRgb, selectedSimType);
  const simBg = simulateColorBlindness(bgRgb, selectedSimType);
  const simFgHex = rgbToHex(simFg.r, simFg.g, simFg.b);
  const simBgHex = rgbToHex(simBg.r, simBg.g, simBg.b);
  const simRating = evaluateWcag(simFg, simBg);

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <span>03</span>
          <span aria-hidden="true">·</span>
          <span>Universal Design &amp; Perception Simulator</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Accessibility &amp; Color Blindness Simulator
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed">
          Test real-time optical color vision deficiencies (Protanopia, Deuteranopia, Tritanopia,
          and Achromatopsia), verify rigorous WCAG 2.1 relative luminance contrast ratios, and
          apply industry guidelines for film, photography, and UI interfaces.
        </p>
      </div>

      {/* Vision Condition Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
        {(
          [
            'normal',
            'protanopia',
            'deuteranopia',
            'tritanopia',
            'achromatopsia',
          ] as ColorBlindnessType[]
        ).map(type => (
          <button
            key={type}
            onClick={() => setSelectedSimType(type)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors capitalize ${
              selectedSimType === type
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {type === 'normal' ? 'Normal Vision' : type}
          </button>
        ))}
      </div>

      {/* Vision Type Explainer Callout */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>{simulationInfo[selectedSimType].name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Prevalence: <strong className="text-slate-200">{simulationInfo[selectedSimType].prevalence}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-300">{simulationInfo[selectedSimType].cones}</span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {simulationInfo[selectedSimType].description}
        </p>
      </div>

      {/* Main 2-Column Split: Contrast Engine & Side-by-Side Spectrum Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive WCAG 2.1 Contrast Ratio Checker */}
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WCAG 2.1 Contrast Ratio Engine</span>
            </span>
            <div className="text-xs font-mono font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              {rating.ratio}:1
            </div>
          </div>

          {/* Color Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foreground */}
            <div className="space-y-1.5">
              <label htmlFor="fgColorInput" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Foreground / Text</span>
                <span className="font-mono text-slate-400">{fgHex}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="fgColorInput"
                  type="color"
                  value={fgHex}
                  onChange={e => setFgHex(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={fgHex}
                  onChange={e => setFgHex(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Background */}
            <div className="space-y-1.5">
              <label htmlFor="bgColorInput" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Background Canvas</span>
                <span className="font-mono text-slate-400">{bgHex}</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="bgColorInput"
                  type="color"
                  value={bgHex}
                  onChange={e => setBgHex(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={bgHex}
                  onChange={e => setBgHex(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Presets:</span>
            <button
              onClick={() => { setFgHex('#ffffff'); setBgHex('#090d16'); }}
              className="px-2 py-0.8 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700"
            >
              White on Dark Slate
            </button>
            <button
              onClick={() => { setFgHex('#0f172a'); setBgHex('#f8fafc'); }}
              className="px-2 py-0.8 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700"
            >
              Dark Slate on Clean Paper
            </button>
            <button
              onClick={() => { setFgHex('#fbbf24'); setBgHex('#1e1b4b'); }}
              className="px-2 py-0.8 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700"
            >
              Amber on Midnight Navy
            </button>
            <button
              onClick={() => { setFgHex('#ef4444'); setBgHex('#10b981'); }}
              className="px-2 py-0.8 bg-rose-950 text-rose-300 rounded border border-rose-800"
            >
              Dangerous Red on Green (Bad)
            </button>
          </div>

          {/* Live Render Preview Card */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">
              Live Preview &amp; Simulated Perception ({simulationInfo[selectedSimType].name})
            </span>
            <div
              className="p-5 rounded-xl border border-slate-700 transition-all duration-300 space-y-3"
              style={{ backgroundColor: simBgHex, color: simFgHex }}
            >
              <div className="text-lg font-bold tracking-tight">
                Headline Typography Sample (18pt Bold)
              </div>
              <p className="text-sm leading-relaxed">
                Standard body copy legibility check (15px regular). Human visual recognition
                requires sufficient luminance difference between the text glyphs and their
                background ground to stimulate photoreceptor contrast.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow"
                  style={{
                    backgroundColor: simFgHex,
                    color: simBgHex,
                  }}
                >
                  Interactive CTA Button
                </button>
                <span className="text-xs opacity-80 underline">Secondary Inline Link</span>
              </div>
            </div>
          </div>

          {/* WCAG Compliance Badges Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
            {/* Normal Text AA */}
            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400">Normal Text AA (4.5:1)</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold">
                {rating.normalTextAA ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className={rating.normalTextAA ? 'text-emerald-400' : 'text-rose-400'}>
                  {rating.normalTextAA ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>

            {/* Normal Text AAA */}
            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400">Normal Text AAA (7:1)</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold">
                {rating.normalTextAAA ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className={rating.normalTextAAA ? 'text-emerald-400' : 'text-rose-400'}>
                  {rating.normalTextAAA ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>

            {/* Large Text & UI */}
            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400">Large / UI AA (3:1)</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold">
                {rating.largeTextAA ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className={rating.largeTextAA ? 'text-emerald-400' : 'text-rose-400'}>
                  {rating.largeTextAA ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Condition Swatch Simulator & Film/UI Guidelines */}
        <div className="lg:col-span-6 space-y-6">
          {/* Multi-Condition Real-Time Color Comparison Grid */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Simulated Spectrum Shifts Across Blindness Types</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Machado Matrix Model</span>
            </div>

            <div className="space-y-3">
              {samplePalette.map((sample, idx) => {
                const origRgb = hexToRgb(sample.hex);
                const protanRgb = simulateColorBlindness(origRgb, 'protanopia');
                const deutanRgb = simulateColorBlindness(origRgb, 'deuteranopia');
                const tritanRgb = simulateColorBlindness(origRgb, 'tritanopia');
                const achroRgb = simulateColorBlindness(origRgb, 'achromatopsia');

                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{sample.label}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{sample.hex}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg shadow-inner"
                          style={{ backgroundColor: sample.hex }}
                        />
                        <div className="text-[10px] text-slate-400">Normal</div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg shadow-inner"
                          style={{
                            backgroundColor: rgbToHex(protanRgb.r, protanRgb.g, protanRgb.b),
                          }}
                        />
                        <div className="text-[10px] text-slate-400">Protan</div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg shadow-inner"
                          style={{
                            backgroundColor: rgbToHex(deutanRgb.r, deutanRgb.g, deutanRgb.b),
                          }}
                        />
                        <div className="text-[10px] text-slate-400">Deutan</div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg shadow-inner"
                          style={{
                            backgroundColor: rgbToHex(tritanRgb.r, tritanRgb.g, tritanRgb.b),
                          }}
                        />
                        <div className="text-[10px] text-slate-400">Tritan</div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg shadow-inner"
                          style={{
                            backgroundColor: rgbToHex(achroRgb.r, achroRgb.g, achroRgb.b),
                          }}
                        />
                        <div className="text-[10px] text-slate-400">Achro</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colorblind-Safe Guidelines in UI, Film & Photography */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Universal Accessibility Guidelines for Film &amp; UI</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">1. The Red/Green Prohibition Rule</div>
                <p className="text-slate-400">
                  Never use Red vs Green as the sole differentiator for opposing states (e.g. Stop vs Go, Error vs Success, Protagonist vs Antagonist flares). In both Protanopia and Deuteranopia, Red and Green converge into nearly indistinguishable brownish-yellow.
                </p>
              </div>

              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">2. Dual-Coding &amp; Redundant Signifiers</div>
                <p className="text-slate-400">
                  Always pair chromatic color with an explicit geometric glyph, typographic label, or spatial shape. If color is stripped away entirely, the meaning must remain 100% unambiguous.
                </p>
              </div>

              <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">3. Luminance Contrast Trumps Hue Contrast</div>
                <p className="text-slate-400">
                  Ensure critical elements differ by at least 30-40% in luminance value. Even in complete monochromacy (Achromatopsia), high luminance contrast creates instant edge separation and visual hierarchy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Software Grading & Export Guide for Tested Accessibility Pair */}
      <PostProductionSoftwareGuide
        selectedColor={fgHex}
        colorName="Foreground Target Color"
        secondaryColor={bgHex}
        contextTitle="How to Calibrate High-Contrast Accessible Colors in DaVinci & Lightroom"
      />
    </section>
  );
};
