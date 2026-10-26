/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LandscapeGradeParameters {
  moodId: string;
  name: string;
  description: string;
  skyGradient: [string, string];
  distantMountainColor: string;
  midMountainColor: string;
  foregroundTerrainColor: string;
  foliageColor: string;
  ambientLightColor: string;
  shadowTint: string;
  highlightTint: string;
  contrast: number; // 0.5 to 1.8
  saturation: number; // 0 to 2.0
  aerialHaze: number; // 0 to 1.0 (Rayleigh scattering)
  colorTemperatureK: number;
}

export interface FocalObjectConfig {
  id: string;
  label: string;
  baseColor: string; // e.g. '#e11d48'
  category: string;
  description: string;
  psychologicalFocusNote: string;
}

export interface FocalGradeAdjustments {
  subjectSaturationBoost: number; // 0.5 to 2.5
  subjectLuminanceBoost: number; // -30 to +40
  backgroundDesaturation: number; // 0.0 (no desat) to 0.85 (heavy desat)
  powerWindowRadius: number; // 10% to 100%
  vignetteStrength: number; // 0 to 1.0
  aerialDepthIntensity: number; // 0 to 1.0
}

/**
 * Blend a base color with atmospheric haze color based on distance depth factor (0 = near, 1 = far)
 */
export function blendAtmosphericHaze(
  baseHex: string,
  hazeHex: string,
  depthDistance: number,
  hazeFactor: number
): string {
  const c1 = hexToRgb(baseHex);
  const c2 = hexToRgb(hazeHex);
  if (!c1 || !c2) return baseHex;

  // Exponential atmospheric scattering approximation (Beer-Lambert law)
  const blendRatio = Math.min(1, Math.max(0, (1 - Math.exp(-depthDistance * 1.8)) * hazeFactor));

  const r = Math.round(c1.r * (1 - blendRatio) + c2.r * blendRatio);
  const g = Math.round(c1.g * (1 - blendRatio) + c2.g * blendRatio);
  const b = Math.round(c1.b * (1 - blendRatio) + c2.b * blendRatio);

  return rgbToHex(r, g, b);
}

/**
 * Calculates chromatic pop (contrast delta) between focal object color and ambient landscape background
 */
export function calculateFocalContrastRatio(
  objectHex: string,
  backgroundHex: string
): {
  luminanceContrast: number;
  hueAngleDelta: number;
  chromaticSeparation: number;
  visualGazeScore: number; // 0 to 100
} {
  const oRgb = hexToRgb(objectHex) || { r: 255, g: 0, b: 0 };
  const bRgb = hexToRgb(backgroundHex) || { r: 50, g: 70, b: 80 };

  const oHsl = rgbToHsl(oRgb.r, oRgb.g, oRgb.b);
  const bHsl = rgbToHsl(bRgb.r, bRgb.g, bRgb.b);

  // Hue delta 0 to 180 degrees
  let hueDelta = Math.abs(oHsl.h - bHsl.h);
  if (hueDelta > 180) hueDelta = 360 - hueDelta;

  const oLum = (0.299 * oRgb.r + 0.587 * oRgb.g + 0.114 * oRgb.b) / 255;
  const bLum = (0.299 * bRgb.r + 0.587 * bRgb.g + 0.114 * bRgb.b) / 255;

  const lumContrast = Math.abs(oLum - bLum);
  const satDiff = Math.abs(oHsl.s - bHsl.s);

  // Chromatic separation combines hue complementarity (opponent color axis) and saturation
  // Warm hues (red/orange/yellow: 330-60 deg) against cool hues (green/cyan/blue: 150-250 deg) trigger strong human pre-attentive pop-out
  const isWarmObject = (oHsl.h >= 330 || oHsl.h <= 65);
  const isCoolBg = (bHsl.h >= 140 && bHsl.h <= 260);
  const warmCoolBonus = (isWarmObject && isCoolBg) ? 0.25 : 0;

  const chromaticSeparation = Math.min(1, (hueDelta / 180) * 0.65 + satDiff * 0.35 + warmCoolBonus);

  // Scaled for realistic photographic dynamic ranges where 0.20+ luminance delta is very strong in landscapes
  const normalizedLumScore = Math.min(1, lumContrast * 3.0);
  const visualGazeScore = Math.min(
    100,
    Math.round(chromaticSeparation * 60 + normalizedLumScore * 30 + oHsl.s * 10)
  );

  return {
    luminanceContrast: parseFloat(lumContrast.toFixed(2)),
    hueAngleDelta: Math.round(hueDelta),
    chromaticSeparation: parseFloat(chromaticSeparation.toFixed(2)),
    visualGazeScore,
  };
}

/**
 * Apply selective saturation qualification and luminance boost to an object color
 */
export function gradeFocalObjectColor(
  baseHex: string,
  saturationMultiplier: number,
  luminanceBoostPercent: number
): string {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return baseHex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const newSat = Math.max(0, Math.min(1, hsl.s * saturationMultiplier));
  const newLum = Math.max(0, Math.min(1, hsl.l + luminanceBoostPercent / 100));

  const newRgb = hslToRgb(hsl.h, newSat, newLum);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust landscape layer color by mood saturation and background desaturation
 */
export function gradeLandscapeLayerColor(
  baseHex: string,
  moodSaturation: number,
  bgDesaturation: number
): string {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return baseHex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const effectiveSat = Math.max(0, Math.min(1, hsl.s * moodSaturation * (1 - bgDesaturation)));

  const newRgb = hslToRgb(hsl.h, effectiveSat, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Helpers
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h = h * 60;
  }

  return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r1 = 0, g1 = 0, b1 = 0;
  if (h >= 0 && h < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (h >= 60 && h < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (h >= 120 && h < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (h >= 180 && h < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (h >= 240 && h < 300) {
    r1 = x; g1 = 0; b1 = c;
  } else {
    r1 = c; g1 = 0; b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
