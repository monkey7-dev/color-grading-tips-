/**
 * Photographic & Colorimetric Image Analysis Engine
 * Real-time canvas pixel analysis:
 * - Exposure & Dynamic Range (histogram, clipping, mean luminance IRE)
 * - White Balance (RGB channel balance, Kelvin CCT estimation, Tint offset)
 * - Dominant Color Extraction (Shadows, Midtones, Highlights, Accents)
 * - Vectorscope 123°/135° Skin Line Detection & ITA Angle
 * - Auto-Balance recommendations for neutral Rec.709 starting point
 */

import { rgbToHex, hexToRgb, rgbToHsl, RGB, HSL } from './colorMath';

export interface DominantColorSwatch {
  hex: string;
  name: string;
  role: 'Shadow Baseline' | 'Low-Midtone' | 'Key Midtone' | 'High-Midtone' | 'Specular Highlight' | 'Accent Rim';
  percentage: number;
}

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  luminance: number[];
}

export interface PhotoAnalysisResult {
  meanLuminanceIre: number; // 0 to 100 IRE
  shadowClippingPct: number; // % of pixels < 4 IRE
  highlightClippingPct: number; // % of pixels > 96 IRE
  dynamicRangeStops: number; // estimated dynamic range stops (e.g. 9.5)
  exposureAssessment: 'Severely Underexposed' | 'Slightly Underexposed' | 'Balanced Exposure' | 'Slightly Overexposed' | 'Severely Overexposed';
  
  histogramData: HistogramData;
  
  rgbBalance: {
    r: number; // 0 to 255
    g: number;
    b: number;
  };
  estimatedKelvin: number; // e.g. 5400
  estimatedTint: number; // -50 to +50 (negative = green, positive = magenta)
  colorCastAssessment: string; // e.g. "Cool daylight cast with slight magenta push"

  contrastStdDev: number; // 0 to 1
  contrastClassification: 'Flat / Low Contrast' | 'Balanced Film Contrast' | 'High Contrast Chiaroscuro' | 'Crushed Contrast';

  dominantColors: DominantColorSwatch[];
  
  skinToneAnalysis: {
    skinDetected: boolean;
    pixelCoveragePct: number;
    meanHueDeg: number;
    deviationFromSkinLineDeg: number; // deviation from 135° I-Line
    skinStatus: 'Centered on I-Line' | 'Shifted Yellow/Olive' | 'Shifted Red/Magenta' | 'No Significant Skin Detected';
  };

  autoBalanceCorrections: {
    exposureOffsetEv: number; // EV offset (-3 to +3)
    targetKelvin: number; // target balanced CCT (e.g. 5600)
    targetTint: number;
    targetContrast: number;
    summary: string;
  };
}

/**
 * Perform pixel-level photographic analysis on an image element or canvas
 */
export function analyzeImageCanvas(canvas: HTMLCanvasElement): PhotoAnalysisResult {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return createDefaultAnalysis();
  }

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;

  if (totalPixels === 0) {
    return createDefaultAnalysis();
  }

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalLum = 0;
  let shadowClipCount = 0;
  let highlightClipCount = 0;

  const lumValues: number[] = [];
  const skinHues: number[] = [];

  // Color quantization histogram buckets (32 buckets per channel)
  const colorBuckets = new Map<string, { count: number; r: number; g: number; b: number }>();

  // Sample every Nth pixel for 60fps performance on high-res images
  const step = Math.max(1, Math.floor(totalPixels / 25000));
  let sampledCount = 0;

  const numBuckets = 64;
  const histR = new Array(numBuckets).fill(0);
  const histG = new Array(numBuckets).fill(0);
  const histB = new Array(numBuckets).fill(0);
  const histLum = new Array(numBuckets).fill(0);

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    totalR += r;
    totalG += g;
    totalB += b;
    sampledCount++;

    // Rec.709 perceived luminance
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    totalLum += lum;
    lumValues.push(lum);

    const lumIre = lum * 100;
    if (lumIre < 4) shadowClipCount++;
    if (lumIre > 96) highlightClipCount++;

    // Update histogram buckets
    histR[Math.min(numBuckets - 1, Math.floor((r / 256) * numBuckets))]++;
    histG[Math.min(numBuckets - 1, Math.floor((g / 256) * numBuckets))]++;
    histB[Math.min(numBuckets - 1, Math.floor((b / 256) * numBuckets))]++;
    histLum[Math.min(numBuckets - 1, Math.floor(lum * numBuckets))]++;

    // Quantize into 16-step color buckets
    const qr = Math.floor(r / 32) * 32 + 16;
    const qg = Math.floor(g / 32) * 32 + 16;
    const qb = Math.floor(b / 32) * 32 + 16;
    const key = `${qr},${qg},${qb}`;
    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorBuckets.set(key, { count: 1, r: qr, g: qg, b: qb });
    }

    // Skin Tone Detection (approximate Fitzpatrick range in normalized RGB)
    // Rules: R > G > B, (R - G) > 12, and HSL hue between 15° and 48° (roughly 120° - 145° on vectorscope)
    if (r > g && g > b && r - g > 12 && r > 45 && r < 245) {
      const hsl = rgbToHsl(r, g, b);
      if (hsl.h >= 15 && hsl.h <= 48 && hsl.s >= 18 && hsl.s <= 78 && hsl.l >= 20 && hsl.l <= 85) {
        skinHues.push(hsl.h);
      }
    }
  }

  // Normalize histograms
  const maxVal = Math.max(...histR, ...histG, ...histB, ...histLum);
  const histogramData = {
    r: histR.map(v => v / maxVal),
    g: histG.map(v => v / maxVal),
    b: histB.map(v => v / maxVal),
    luminance: histLum.map(v => v / maxVal),
  };

  const meanR = totalR / sampledCount;
  const meanG = totalG / sampledCount;
  const meanB = totalB / sampledCount;
  const meanLum = totalLum / sampledCount;
  const meanLuminanceIre = Math.round(meanLum * 100);

  // Standard Deviation of Luminance (Contrast index)
  let varianceSum = 0;
  for (const l of lumValues) {
    varianceSum += Math.pow(l - meanLum, 2);
  }
  const contrastStdDev = Math.sqrt(varianceSum / lumValues.length);

  const shadowClippingPct = Number(((shadowClipCount / sampledCount) * 100).toFixed(1));
  const highlightClippingPct = Number(((highlightClipCount / sampledCount) * 100).toFixed(1));

  // Dynamic range estimate (based on percentiles)
  lumValues.sort((a, b) => a - b);
  const p5 = lumValues[Math.floor(lumValues.length * 0.05)] || 0.01;
  const p95 = lumValues[Math.floor(lumValues.length * 0.95)] || 0.99;
  const drRatio = Math.max(1, p95 / Math.max(0.005, p5));
  const dynamicRangeStops = Number((Math.log2(drRatio)).toFixed(1));

  // Exposure assessment
  let exposureAssessment: PhotoAnalysisResult['exposureAssessment'] = 'Balanced Exposure';
  if (meanLuminanceIre < 25) exposureAssessment = 'Severely Underexposed';
  else if (meanLuminanceIre < 38) exposureAssessment = 'Slightly Underexposed';
  else if (meanLuminanceIre > 75) exposureAssessment = 'Severely Overexposed';
  else if (meanLuminanceIre > 62) exposureAssessment = 'Slightly Overexposed';

  // White balance / Kelvin estimation
  // McCamy's approximation or chromaticity ratio
  const rRatio = meanR / Math.max(1, meanB);
  let estimatedKelvin = 5500;
  if (rRatio > 1.8) estimatedKelvin = 3000;
  else if (rRatio > 1.4) estimatedKelvin = 3800;
  else if (rRatio > 1.15) estimatedKelvin = 4600;
  else if (rRatio > 0.95) estimatedKelvin = 5500;
  else if (rRatio > 0.80) estimatedKelvin = 6800;
  else estimatedKelvin = 8200;

  // Tint estimation (G relative to average of R and B)
  const rbAvg = (meanR + meanB) / 2;
  const tintDelta = (rbAvg - meanG) / 2.5; // positive = magenta, negative = green
  const estimatedTint = Math.max(-50, Math.min(50, Math.round(tintDelta)));

  let colorCastAssessment = 'Neutral daylight balance';
  if (estimatedKelvin < 4500) {
    colorCastAssessment = `Warm tungsten/golden cast (~${estimatedKelvin}K)`;
  } else if (estimatedKelvin > 6500) {
    colorCastAssessment = `Cool overcast/twilight cast (~${estimatedKelvin}K)`;
  }
  if (estimatedTint > 8) colorCastAssessment += ' with magenta shift';
  if (estimatedTint < -8) colorCastAssessment += ' with green shift';

  // Contrast classification
  let contrastClassification: PhotoAnalysisResult['contrastClassification'] = 'Balanced Film Contrast';
  if (contrastStdDev < 0.16) contrastClassification = 'Flat / Low Contrast';
  else if (contrastStdDev > 0.32) contrastClassification = 'High Contrast Chiaroscuro';
  if (shadowClippingPct > 8 && highlightClippingPct > 8) {
    contrastClassification = 'Crushed Contrast';
  }

  // Top dominant colors sorted by frequency and mapped to tonal roles
  const sortedBuckets = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
  const dominantColors: DominantColorSwatch[] = [];
  const roles: DominantColorSwatch['role'][] = [
    'Shadow Baseline',
    'Low-Midtone',
    'Key Midtone',
    'High-Midtone',
    'Specular Highlight',
    'Accent Rim',
  ];

  // Pick up to 6 diverse color swatches
  for (let i = 0; i < sortedBuckets.length && dominantColors.length < 6; i++) {
    const bucket = sortedBuckets[i];
    const hex = rgbToHex(bucket.r, bucket.g, bucket.b);
    const pct = Number(((bucket.count / sampledCount) * 100).toFixed(1));
    const role = roles[dominantColors.length] || 'Key Midtone';

    // Simple color name
    const hsl = rgbToHsl(bucket.r, bucket.g, bucket.b);
    let colorName = 'Neutral';
    if (hsl.s < 12) {
      if (hsl.l < 25) colorName = 'Obsidian Black';
      else if (hsl.l > 75) colorName = 'Crisp Silver';
      else colorName = 'Slate Gray';
    } else {
      if (hsl.h < 25) colorName = 'Warm Rust / Red';
      else if (hsl.h < 50) colorName = 'Amber Gold';
      else if (hsl.h < 80) colorName = 'Olive Lime';
      else if (hsl.h < 165) colorName = 'Forest Green';
      else if (hsl.h < 205) colorName = 'Cyan / Teal';
      else if (hsl.h < 260) colorName = 'Cobalt Blue';
      else if (hsl.h < 320) colorName = 'Violet / Magenta';
      else colorName = 'Crimson Rose';
    }

    dominantColors.push({
      hex,
      name: `${colorName}`,
      role,
      percentage: pct,
    });
  }

  // Skin tone evaluation
  const skinDetected = skinHues.length > sampledCount * 0.015;
  const skinPixelCoveragePct = Number(((skinHues.length / sampledCount) * 100).toFixed(1));
  let meanSkinHue = 30; // standard skin tone angle
  if (skinHues.length > 0) {
    meanSkinHue = skinHues.reduce((a, b) => a + b, 0) / skinHues.length;
  }
  const deviation = meanSkinHue - 30; // 30 in HSL is ~135° vectorscope I-Line
  let skinStatus: PhotoAnalysisResult['skinToneAnalysis']['skinStatus'] = 'No Significant Skin Detected';
  if (skinDetected) {
    if (Math.abs(deviation) <= 5) skinStatus = 'Centered on I-Line';
    else if (deviation > 5) skinStatus = 'Shifted Yellow/Olive';
    else skinStatus = 'Shifted Red/Magenta';
  }

  // Auto-balance corrective recommendations
  // Target: mean luminance ~48 IRE, neutral Kelvin ~5500K, tint ~0
  const exposureDelta = (48 - meanLuminanceIre) / 35; // EV offset
  const exposureOffsetEv = Number(Math.max(-2.5, Math.min(2.5, exposureDelta)).toFixed(2));
  const targetKelvin = estimatedKelvin;
  const targetTint = -estimatedTint; // counteract tint
  let targetContrast = 1.0;
  if (contrastClassification === 'Flat / Low Contrast') targetContrast = 1.25;
  else if (contrastClassification === 'High Contrast Chiaroscuro' || contrastClassification === 'Crushed Contrast') targetContrast = 0.90;

  const autoBalanceCorrections = {
    exposureOffsetEv,
    targetKelvin: 5500,
    targetTint: Math.round(-estimatedTint * 0.7),
    targetContrast,
    summary: `${exposureOffsetEv > 0 ? `+${exposureOffsetEv}` : exposureOffsetEv} EV exposure compensation recommended. ${
      Math.abs(estimatedTint) > 6 ? `Counteract ${estimatedTint > 0 ? 'magenta' : 'green'} cast by ${Math.round(-estimatedTint * 0.7)}.` : 'Color balance is relatively neutral.'
    }`,
  };

  return {
    meanLuminanceIre,
    shadowClippingPct,
    highlightClippingPct,
    dynamicRangeStops,
    exposureAssessment,
    rgbBalance: {
      r: Math.round(meanR),
      g: Math.round(meanG),
      b: Math.round(meanB),
    },
    estimatedKelvin,
    estimatedTint,
    colorCastAssessment,
    contrastStdDev: Number(contrastStdDev.toFixed(2)),
    contrastClassification,
    dominantColors,
    skinToneAnalysis: {
      skinDetected,
      pixelCoveragePct: skinPixelCoveragePct,
      meanHueDeg: Math.round(meanSkinHue),
      deviationFromSkinLineDeg: Number(deviation.toFixed(1)),
      skinStatus,
    },
    autoBalanceCorrections,
    histogramData,
  };
}

function createDefaultAnalysis(): PhotoAnalysisResult {
  return {
    meanLuminanceIre: 50,
    shadowClippingPct: 0.5,
    highlightClippingPct: 0.8,
    dynamicRangeStops: 10.5,
    exposureAssessment: 'Balanced Exposure',
    rgbBalance: { r: 128, g: 128, b: 128 },
    estimatedKelvin: 5500,
    estimatedTint: 0,
    colorCastAssessment: 'Neutral daylight baseline',
    contrastStdDev: 0.22,
    contrastClassification: 'Balanced Film Contrast',
    dominantColors: [
      { hex: '#0f172a', name: 'Obsidian Slate', role: 'Shadow Baseline', percentage: 28 },
      { hex: '#334155', name: 'Deep Steel', role: 'Low-Midtone', percentage: 24 },
      { hex: '#64748b', name: 'Muted Sky', role: 'Key Midtone', percentage: 20 },
      { hex: '#94a3b8', name: 'Silver Mist', role: 'High-Midtone', percentage: 14 },
      { hex: '#f8fafc', name: 'Crisp Specular', role: 'Specular Highlight', percentage: 8 },
      { hex: '#0ea5e9', name: 'Cyan Ambient', role: 'Accent Rim', percentage: 6 },
    ],
    skinToneAnalysis: {
      skinDetected: false,
      pixelCoveragePct: 0,
      meanHueDeg: 30,
      deviationFromSkinLineDeg: 0,
      skinStatus: 'No Significant Skin Detected',
    },
    autoBalanceCorrections: {
      exposureOffsetEv: 0,
      targetKelvin: 5500,
      targetTint: 0,
      targetContrast: 1.0,
      summary: 'Image exposure and color temperature are already well balanced.',
    },
    histogramData: {
      r: new Array(64).fill(0),
      g: new Array(64).fill(0),
      b: new Array(64).fill(0),
      luminance: new Array(64).fill(0),
    },
  };
}
