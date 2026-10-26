/**
 * Skin tone analysis, Vectorscope coordinate mapping, and Cinematic Color Grading Recommendations
 */

import { RGB, calculateVectorscopeAngle } from './colorMath';

export interface SkinSamplePoint {
  r: number;
  g: number;
  b: number;
  x: number; // Vectorscope normalized X (-1 to 1)
  y: number; // Vectorscope normalized Y (-1 to 1)
  angleDeg: number;
  distanceToSkinLine: number;
}

export interface SkinAnalysisResult {
  sampleCount: number;
  points: SkinSamplePoint[];
  averageRgb: RGB;
  medianAngle: number;
  skinLineDeviation: number; // Angle - 135 (negative = reddish/magenta, positive = yellowish/greenish)
  averageIre: number; // 0 to 100 estimated IRE
  saturationPercent: number;
  skinCategoryEstimate: string;
  recommendations: GradingRecommendation;
}

export type LightingCondition =
  | 'golden_hour'
  | 'blue_hour'
  | 'midday'
  | 'overcast'
  | 'tungsten'
  | 'fluorescent_led';

export type DesiredAesthetic =
  | 'natural_broadcast'
  | 'teal_and_orange'
  | 'nordic_noir'
  | 'vintage_kodak'
  | 'bleach_bypass';

export interface GradingRecommendation {
  summary: string;
  vectorscopeStatus: string;
  davinciWorkflow: {
    node1: string;
    node2: string;
    node3: string;
    node4: string;
    node5: string;
  };
  lightroomCorrections: {
    temperatureTint: string;
    hslAdjustment: string;
    colorGradingWheel: string;
    calibrationTip: string;
  };
  keyPrecautions: string[];
}

/**
 * Checks if an RGB pixel is within realistic human melanin chromaticity
 */
export function isSkinPixel(r: number, g: number, b: number): boolean {
  // Bounding box in RGB
  if (r < 60 || g < 40 || b < 20) return false;
  if (r <= g || r <= b) return false; // In all skin tones, red is the dominant channel
  if (Math.abs(r - g) < 15) return false;

  // YCbCr test
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  // Normalized Cb and Cr in 0-255 scale
  const cb = 128 - 37.797 * normR - 74.203 * normG + 112.0 * normB;
  const cr = 128 + 112.0 * normR - 93.786 * normG - 18.214 * normB;

  // Kovac & Peer skin chromaticity bounding box
  return cb >= 75 && cb <= 135 && cr >= 130 && cr <= 178;
}

/**
 * Maps RGB to normalized Vectorscope coordinates (X, Y in [-1, 1])
 * Vectorscope convention:
 * X corresponds to Cb (blue/yellow axis)
 * Y corresponds to Cr (red/cyan axis, inverted for SVG display if needed)
 */
export function mapRgbToVectorscopeXY(r: number, g: number, b: number): { x: number; y: number } {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const cb = -0.168736 * normR - 0.331264 * normG + 0.5 * normB;
  const cr = 0.5 * normR - 0.418688 * normG - 0.081312 * normB;

  // Scale for vectorscope radius (max radius is roughly ~0.5)
  const scale = 2.0;
  return {
    x: Math.max(-1, Math.min(1, cb * scale)),
    y: Math.max(-1, Math.min(1, -cr * scale)), // negative because SVG Y increases downward
  };
}

/**
 * Analyze an array of RGB samples extracted from image or preset
 */
export function analyzeSkinSamples(
  samples: RGB[],
  lighting: LightingCondition = 'golden_hour',
  aesthetic: DesiredAesthetic = 'teal_and_orange'
): SkinAnalysisResult {
  if (samples.length === 0) {
    // Default fallback to a healthy standard skin tone
    samples = [{ r: 210, g: 155, b: 125 }];
  }

  const validPoints: SkinSamplePoint[] = [];
  let sumR = 0, sumG = 0, sumB = 0;

  for (const s of samples) {
    sumR += s.r;
    sumG += s.g;
    sumB += s.b;

    const xy = mapRgbToVectorscopeXY(s.r, s.g, s.b);
    const { angleDeg, distanceToSkinLine } = calculateVectorscopeAngle(s);

    validPoints.push({
      r: s.r,
      g: s.g,
      b: s.b,
      x: xy.x,
      y: xy.y,
      angleDeg,
      distanceToSkinLine,
    });
  }

  const count = samples.length;
  const avgRgb: RGB = {
    r: Math.round(sumR / count),
    g: Math.round(sumG / count),
    b: Math.round(sumB / count),
  };

  // Median angle
  const sortedAngles = [...validPoints.map(p => p.angleDeg)].sort((a, b) => a - b);
  const medianAngle = sortedAngles[Math.floor(sortedAngles.length / 2)] || 135;
  const skinLineDeviation = Math.round((medianAngle - 135) * 10) / 10;

  // Approximate IRE (Rec.709 Luminance * 100)
  const normY = (0.2126 * avgRgb.r + 0.7152 * avgRgb.g + 0.0722 * avgRgb.b) / 255;
  const averageIre = Math.round(normY * 100);

  // Saturation
  const max = Math.max(avgRgb.r, avgRgb.g, avgRgb.b);
  const min = Math.min(avgRgb.r, avgRgb.g, avgRgb.b);
  const saturationPercent = max === 0 ? 0 : Math.round(((max - min) / max) * 100);

  // Estimate skin melanin tier
  let skinCategoryEstimate = 'Medium / Olive Complexion';
  if (averageIre >= 65) {
    skinCategoryEstimate = 'Light / Fair (Fitzpatrick I-II)';
  } else if (averageIre >= 52) {
    skinCategoryEstimate = 'Medium-Light / East Asian (Fitzpatrick III)';
  } else if (averageIre >= 40) {
    skinCategoryEstimate = 'Olive / South Asian / Latinx (Fitzpatrick IV)';
  } else if (averageIre >= 28) {
    skinCategoryEstimate = 'Deep / Middle Eastern / Latinx (Fitzpatrick V)';
  } else {
    skinCategoryEstimate = 'Rich Dark / African Melanin (Fitzpatrick VI)';
  }

  const recommendations = generateGradingRecommendations(
    medianAngle,
    skinLineDeviation,
    averageIre,
    lighting,
    aesthetic
  );

  return {
    sampleCount: count,
    points: validPoints,
    averageRgb: avgRgb,
    medianAngle,
    skinLineDeviation,
    averageIre,
    saturationPercent,
    skinCategoryEstimate,
    recommendations,
  };
}

function generateGradingRecommendations(
  medianAngle: number,
  deviation: number,
  ire: number,
  lighting: LightingCondition,
  aesthetic: DesiredAesthetic
): GradingRecommendation {
  let vectorscopeStatus = 'Aligned with 135° standard';
  if (deviation > 5) {
    vectorscopeStatus = `Skewed ${deviation}° Yellow/Green (too warm/jaundiced)`;
  } else if (deviation < -5) {
    vectorscopeStatus = `Skewed ${Math.abs(deviation)}° Magenta/Red (hyperemic/sunburnt)`;
  }

  // Precaution notes based on lighting
  const precautions: string[] = [];
  if (lighting === 'golden_hour') {
    precautions.push('Golden hour adds heavy yellow (3200K); do not over-correct skin into magenta to compensate for ambient warmth.');
  } else if (lighting === 'fluorescent_led') {
    precautions.push('Spiky green fluorescent spike detected; use Hue vs Hue curve around green (120°) or Magenta Tint (+8 to +14) to eliminate sickly skin cast.');
  } else if (lighting === 'blue_hour') {
    precautions.push('Blue hour ambient will push skin towards magenta/blue. Keep skin masked or warm with Lift/Gamma while preserving blue environment.');
  } else if (lighting === 'midday') {
    precautions.push('Harsh overhead sun blows out forehead and nose highlights (exceeding 85 IRE). Pull Gamma down and apply highlight soft clip.');
  } else {
    precautions.push('Tungsten lighting produces strong orange casts; balance shadows to neutral blue-gray while anchoring face tones.');
  }

  if (ire > 78) {
    precautions.push(`Luminance (${ire} IRE) is dangerously close to clipping skin highlights. Target 60-70 IRE for natural texture.`);
  } else if (ire < 20) {
    precautions.push(`Luminance (${ire} IRE) is buried in shadow noise. Lift Gamma or clean black level with node noise reduction.`);
  }

  // DaVinci Resolve Workflow
  const davinciWorkflow = {
    node1: 'Node 01 [Input Balance]: White balance & Exposure normalization. Set neutral gray on gray card or background eye sclera.',
    node2: 'Node 02 [CST Transform]: Transform camera native log (e.g., ARRI LogC3, Sony S-Log3) to intermediate DaVinci Wide Gamut / Intermediate.',
    node3: deviation > 3
      ? `Node 03 [Skin Qualification]: 3D Qualifier on skin. Use Hue vs Hue curve to pull Yellow down -${Math.min(8, Math.round(deviation))}° toward 135° skin line.`
      : deviation < -3
      ? `Node 03 [Skin Qualification]: 3D Qualifier on skin. Use Hue vs Hue curve to nudge Red/Magenta +${Math.min(8, Math.round(Math.abs(deviation)))}° toward 135° skin line.`
      : 'Node 03 [Skin Tone Lock]: Skin is centered on 135° I-Line. Invert key or route to Parallel Node to isolate background from foreground skin.',
    node4: aesthetic === 'teal_and_orange'
      ? 'Node 04 [Parallel Grade]: In background node, push Cyan/Teal into Shadows (Lift) and Midtones (Gamma). Keep skin protected on parallel branch.'
      : aesthetic === 'nordic_noir'
      ? 'Node 04 [Parallel Grade]: Desaturate overall scene to 65%. Cool down shadows with subtle slate-blue Gain. Keep skin layer warmly isolated.'
      : aesthetic === 'vintage_kodak'
      ? 'Node 04 [Film Emulation]: Apply Kodak 2383 print stock D65 LUT. Soften highlight roll-off with Custom Curve.'
      : 'Node 04 [Primary Grade]: Subtle S-curve for contrast, maintaining faithful color fidelity and broadcast legal levels (0-100 IRE).',
    node5: 'Node 05 [Output CST & Grain]: Output Transform to Rec.709 Gamma 2.4. Add subtle 35mm film grain (size 0.45, roughness 0.35) for organic texture.',
  };

  // Lightroom Corrections
  const lightroomCorrections = {
    temperatureTint: lighting === 'golden_hour'
      ? 'Temp -4, Tint +2 (maintain sunset mood without muddying facial highlights)'
      : lighting === 'fluorescent_led'
      ? 'Temp +2, Tint +9 (compensates for dangerous green fluorescent phosphor spike)'
      : 'Temp 0, Tint +1 (balanced skin neutrality)',
    hslAdjustment: deviation > 3
      ? 'Orange Hue: -3 to -5, Yellow Saturation: -10, Orange Luminance: +8'
      : deviation < -3
      ? 'Red Hue: +5 to +8, Orange Saturation: -4, Red Luminance: +6'
      : 'Orange Hue: 0, Orange Saturation: +2, Orange Luminance: +5 (healthy glow)',
    colorGradingWheel: aesthetic === 'teal_and_orange'
      ? 'Shadows: Hue 215° (Teal), Sat 22 | Highlights: Hue 38° (Warm Amber), Sat 16 | Balance: +15'
      : aesthetic === 'nordic_noir'
      ? 'Shadows: Hue 205° (Steel Blue), Sat 18 | Midtones: Hue 220°, Sat 10 | Highlights: Neutral'
      : 'Shadows: Neutral/Subtle Cool (Hue 220°, Sat 6) | Highlights: Subtle Warm (Hue 45°, Sat 8)',
    calibrationTip: 'Calibration Tab: Red Primary Hue +5 to warm up skin; Blue Primary Saturation +15 to increase separation between skin and background.',
  };

  return {
    summary: `Analyzed skin is at ${medianAngle}° on vectorscope (${vectorscopeStatus}) with luminance at ${ire} IRE. Best paired with ${aesthetic.replace(/_/g, ' ')} under ${lighting.replace(/_/g, ' ')}.`,
    vectorscopeStatus,
    davinciWorkflow,
    lightroomCorrections,
    keyPrecautions: precautions,
  };
}
