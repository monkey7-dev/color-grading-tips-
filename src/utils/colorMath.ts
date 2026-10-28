/**
 * Color math and accessibility calculations for Color Psychology & Cinematography Matrix
 */

export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export type HarmonyType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'square'
  | 'double-split-complementary'
  | 'compound'
  | 'neutral-plus-accent';

export type ColorBlindnessType =
  | 'normal'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const normH = ((h % 360) + 360) % 360;
  const normS = Math.max(0, Math.min(100, s)) / 100;
  const normL = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * normL - 1)) * normS;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = normL - c / 2;

  let r1 = 0, g1 = 0, b1 = 0;
  if (normH < 60) {
    r1 = c; g1 = x; b1 = 0;
  } else if (normH < 120) {
    r1 = x; g1 = c; b1 = 0;
  } else if (normH < 180) {
    r1 = 0; g1 = c; b1 = x;
  } else if (normH < 240) {
    r1 = 0; g1 = x; b1 = c;
  } else if (normH < 300) {
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

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === normR) {
      h = ((normG - normB) / delta) % 6;
    } else if (max === normG) {
      h = (normB - normR) / delta + 2;
    } else {
      h = (normR - normG) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Relative luminance calculation per WCAG 2.1
 */
export function calculateRelativeLuminance(rgb: RGB): number {
  const [sR, sG, sB] = [rgb.r, rgb.g, rgb.b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Contrast ratio per WCAG 2.1: (L1 + 0.05) / (L2 + 0.05)
 */
export function calculateContrastRatio(color1: RGB, color2: RGB): number {
  const lum1 = calculateRelativeLuminance(color1);
  const lum2 = calculateRelativeLuminance(color2);
  const l1 = Math.max(lum1, lum2);
  const l2 = Math.min(lum1, lum2);
  return Number(((l1 + 0.05) / (l2 + 0.05)).toFixed(2));
}

export interface WcagRating {
  ratio: number;
  normalTextAA: boolean; // >= 4.5
  normalTextAAA: boolean; // >= 7.0
  largeTextAA: boolean; // >= 3.0
  largeTextAAA: boolean; // >= 4.5
  uiComponentsAA: boolean; // >= 3.0
}

export function evaluateWcag(color1: RGB, color2: RGB): WcagRating {
  const ratio = calculateContrastRatio(color1, color2);
  return {
    ratio,
    normalTextAA: ratio >= 4.5,
    normalTextAAA: ratio >= 7.0,
    largeTextAA: ratio >= 3.0,
    largeTextAAA: ratio >= 4.5,
    uiComponentsAA: ratio >= 3.0,
  };
}

/**
 * Compute harmony hue angles from base hue
 */
export function getHarmonyHues(baseHue: number, type: HarmonyType): number[] {
  const norm = ((baseHue % 360) + 360) % 360;
  switch (type) {
    case 'monochromatic':
    case 'neutral-plus-accent':
      return [norm];
    case 'complementary':
      return [norm, (norm + 180) % 360];
    case 'split-complementary':
      return [norm, (norm + 150) % 360, (norm + 210) % 360];
    case 'triadic':
      return [norm, (norm + 120) % 360, (norm + 240) % 360];
    case 'tetradic':
      return [norm, (norm + 60) % 360, (norm + 180) % 360, (norm + 240) % 360];
    case 'square':
      return [norm, (norm + 90) % 360, (norm + 180) % 360, (norm + 270) % 360];
    case 'double-split-complementary':
    case 'compound':
      return [norm, (norm + 30) % 360, (norm + 180) % 360, (norm + 210) % 360];
    case 'analogous':
      return [((norm - 30) + 360) % 360, norm, (norm + 30) % 360];
    default:
      return [norm];
  }
}

/**
 * Simulate Color Blindness (Machado et al. / Brettel matrices)
 */
export function simulateColorBlindness(rgb: RGB, type: ColorBlindnessType): RGB {
  if (type === 'normal') return rgb;

  const r = rgb.r;
  const g = rgb.g;
  const b = rgb.b;

  let simR = r;
  let simG = g;
  let simB = b;

  if (type === 'protanopia') {
    // Red-blind (L-cone absent)
    simR = 0.56667 * r + 0.43333 * g + 0.0 * b;
    simG = 0.55833 * r + 0.44167 * g + 0.0 * b;
    simB = 0.0 * r + 0.24167 * g + 0.75833 * b;
  } else if (type === 'deuteranopia') {
    // Green-blind (M-cone absent)
    simR = 0.625 * r + 0.375 * g + 0.0 * b;
    simG = 0.7 * r + 0.3 * g + 0.0 * b;
    simB = 0.0 * r + 0.3 * g + 0.7 * b;
  } else if (type === 'tritanopia') {
    // Blue-blind (S-cone absent)
    simR = 0.95 * r + 0.05 * g + 0.0 * b;
    simG = 0.0 * r + 0.43333 * g + 0.56667 * b;
    simB = 0.0 * r + 0.475 * g + 0.525 * b;
  } else if (type === 'achromatopsia') {
    // Complete monochromacy
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    simR = gray;
    simG = gray;
    simB = gray;
  }

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return {
    r: clamp(simR),
    g: clamp(simG),
    b: clamp(simB),
  };
}

/**
 * Calculates Vectorscope Angle for skin tone analysis.
 * In broadcast video (Rec.709 / YUV / YCbCr):
 * Cb (U) = -0.168736*R - 0.331264*G + 0.5*B
 * Cr (V) =  0.5*R - 0.418688*G - 0.081312*B
 * The standard skin tone line on a vectorscope sits at roughly ~135° (or 10:30 on the clock face).
 */
export function calculateVectorscopeAngle(rgb: RGB): { angleDeg: number; distanceToSkinLine: number; saturation: number } {
  const normR = rgb.r / 255;
  const normG = rgb.g / 255;
  const normB = rgb.b / 255;

  const cb = -0.168736 * normR - 0.331264 * normG + 0.5 * normB;
  const cr = 0.5 * normR - 0.418688 * normG - 0.081312 * normB;

  let angleRad = Math.atan2(cr, cb);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  // Typical skin tone line standard is approximately 135° (between Red and Yellow, pointing to ~135°)
  const skinLineTarget = 135;
  const diff = Math.abs(angleDeg - skinLineTarget);
  const distanceToSkinLine = Math.min(diff, 360 - diff);

  const saturation = Math.min(100, Math.round(Math.sqrt(cb * cb + cr * cr) * 200));

  return {
    angleDeg: Math.round(angleDeg * 10) / 10,
    distanceToSkinLine: Math.round(distanceToSkinLine * 10) / 10,
    saturation,
  };
}
