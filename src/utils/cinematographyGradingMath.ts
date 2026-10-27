/**
 * Professional Cinematography & Color Grading Mathematical Engine
 * - Correlated Color Temperature (Planckian CCT to RGB)
 * - DaVinci Resolve 3-Way Color Wheels math (Lift, Gamma, Gain, Offset)
 * - 3D LUT (.CUBE) generation for DaVinci Resolve / Premiere Pro
 * - Adobe Lightroom Classic (.XMP) preset generation
 * - Vectorscope Skin Tone Line (135° I-Line) Chromaticity & Scopes Math
 */

export interface ColorWheelVal {
  r: number; // -1.0 to 1.0 (color tint offset)
  g: number;
  b: number;
  lum: number; // -100 to 100 IRE luminance adjustment
}

export interface CinemaGradeParams {
  id: string;
  name: string;
  sceneType: 'day' | 'night' | 'film_stock';
  timeframe: string;
  kelvin: number; // 2000K to 10000K
  tint: number; // -50 (green) to +50 (magenta)
  lift: ColorWheelVal; // Shadows
  gamma: ColorWheelVal; // Midtones
  gain: ColorWheelVal; // Highlights
  offsetLum: number; // -50 to +50 master exposure
  contrast: number; // 0.7 to 1.8 (1.0 = neutral)
  saturation: number; // 0.0 to 2.0 (1.0 = neutral)
  skinToneProtection: boolean; // Protect skin line vector
  recommendedHexes: {
    shadows: string;
    midtones: string;
    highlights: string;
    accent: string;
  };
  whyItWorks: string;
  lightingRecipe: {
    key: string;
    fill: string;
    practicals: string;
    ratio: string;
  };
  resolveTip: string;
}

/**
 * Tanner Helland algorithm for converting Kelvin temperature (1000K - 12000K) to normalized RGB [0..1]
 */
export function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const temp = Math.max(1000, Math.min(12000, kelvin)) / 100;
  let red: number;
  let green: number;
  let blue: number;

  // Red
  if (temp <= 66) {
    red = 255;
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }

  // Green
  if (temp <= 66) {
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  } else {
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    if (green < 0) green = 0;
    if (green > 255) green = 255;
  }

  // Blue
  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = temp - 10;
    blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    if (blue < 0) blue = 0;
    if (blue > 255) blue = 255;
  }

  return {
    r: Math.round(red) / 255,
    g: Math.round(green) / 255,
    b: Math.round(blue) / 255,
  };
}

/**
 * Converts polar coordinates (angle in degrees 0..360, radius 0..1) on a color wheel to RGB tint offset
 */
export function polarToRgbOffset(angleDeg: number, magnitude: number): { r: number; g: number; b: number } {
  const rad = (angleDeg * Math.PI) / 180;
  const mag = Math.max(0, Math.min(1, magnitude));
  
  // Angle 0° is Red, 120° is Green, 240° is Blue
  const r = mag * Math.cos(rad);
  const g = mag * Math.cos(rad - (2 * Math.PI) / 3);
  const b = mag * Math.cos(rad - (4 * Math.PI) / 3);

  return { r, g, b };
}

/**
 * Converts RGB tint offset to polar angle (0..360) and magnitude (0..1)
 */
export function rgbOffsetToPolar(r: number, g: number, b: number): { angleDeg: number; magnitude: number } {
  // 2D projection onto chromatic plane
  const x = r - 0.5 * (g + b);
  const y = (Math.sqrt(3) / 2) * (g - b);
  const mag = Math.min(1, Math.sqrt(x * x + y * y));
  let deg = (Math.atan2(y, x) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return { angleDeg: Math.round(deg), magnitude: Number(mag.toFixed(3)) };
}

/**
 * Checks if an RGB color falls near the 135° vectorscope skin tone line (I-Line)
 */
export function isSkinTonePixel(r: number, g: number, b: number): boolean {
  // YCbCr transformation
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 0.5 * r - 0.418688 * g - 0.081312 * b;

  // Standard Vectorscope locus: Cb is X axis, Cr is Y axis
  // Skin tone line (I-Line) falls at angle ~120° to 155° in upper-left quadrant (Cb < 0, Cr > 0)
  const angle = (Math.atan2(cr, cb) * 180) / Math.PI;
  const isSkinAngle = angle >= 110 && angle <= 165;
  const hasChroma = Math.hypot(cb, cr) > 0.03;
  const hasSkinLum = y >= 0.12 && y <= 0.95;

  return isSkinAngle && hasChroma && hasSkinLum;
}

/**
 * Core mathematical transform applying Lift, Gamma, Gain, Kelvin, Contrast, and Saturation to an RGB pixel [0..1]
 */
export function gradePixelRgb(
  r: number,
  g: number,
  b: number,
  params: {
    lift: ColorWheelVal;
    gamma: ColorWheelVal;
    gain: ColorWheelVal;
    offsetLum: number;
    kelvin: number;
    tint: number;
    contrast: number;
    saturation: number;
    skinToneProtection?: boolean;
  }
): { r: number; g: number; b: number } {
  // 1. Check skin tone if protection is enabled
  const isSkin = params.skinToneProtection && isSkinTonePixel(r, g, b);
  const skinProtectionWeight = isSkin ? 0.65 : 0.0; // Preserve 65% of original skin warmth

  // 2. White Balance / Kelvin adaptation
  // Reference daylight is 5500K
  const kRef = kelvinToRgb(5500);
  const kTarget = kelvinToRgb(params.kelvin);
  const kFactorR = kTarget.r / kRef.r;
  const kFactorG = (kTarget.g / kRef.g) * (1 - (params.tint / 100) * 0.2);
  const kFactorB = (kTarget.b / kRef.b) * (1 + (params.tint / 100) * 0.2);

  let pr = r * kFactorR;
  let pg = g * kFactorG;
  let pb = b * kFactorB;

  // 3. Offset Master Exposure
  const off = params.offsetLum / 100;
  pr += off;
  pg += off;
  pb += off;

  // Clamp non-negatives
  pr = Math.max(0, pr);
  pg = Math.max(0, pg);
  pb = Math.max(0, pb);

  // 4. Lift, Gamma, Gain
  // Lift influences shadows (1 - y)
  // Gain scales highlights (y)
  // Gamma pivots midtones via power curve
  const y = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;
  const shadowWeight = Math.pow(Math.max(0, 1 - y), 1.8);
  const highlightWeight = Math.pow(Math.min(1, y), 1.5);
  const midtoneWeight = Math.max(0, 1 - Math.abs(y - 0.5) * 2);

  // Apply tint offsets
  const liftMult = 0.4 * (1 - skinProtectionWeight);
  const gammaMult = 0.35 * (1 - skinProtectionWeight);
  const gainMult = 0.45;

  pr += params.lift.r * liftMult * shadowWeight + (params.lift.lum / 100) * shadowWeight;
  pg += params.lift.g * liftMult * shadowWeight + (params.lift.lum / 100) * shadowWeight;
  pb += params.lift.b * liftMult * shadowWeight + (params.lift.lum / 100) * shadowWeight;

  pr += params.gamma.r * gammaMult * midtoneWeight + (params.gamma.lum / 100) * midtoneWeight;
  pg += params.gamma.g * gammaMult * midtoneWeight + (params.gamma.lum / 100) * midtoneWeight;
  pb += params.gamma.b * gammaMult * midtoneWeight + (params.gamma.lum / 100) * midtoneWeight;

  pr += params.gain.r * gainMult * highlightWeight + (params.gain.lum / 100) * highlightWeight;
  pg += params.gain.g * gainMult * highlightWeight + (params.gain.lum / 100) * highlightWeight;
  pb += params.gain.b * gainMult * highlightWeight + (params.gain.lum / 100) * highlightWeight;

  // 5. Contrast S-Curve around pivot 0.45
  const pivot = 0.45;
  const c = params.contrast;
  pr = pivot + Math.sign(pr - pivot) * Math.pow(Math.abs(pr - pivot), 1 / c);
  pg = pivot + Math.sign(pg - pivot) * Math.pow(Math.abs(pg - pivot), 1 / c);
  pb = pivot + Math.sign(pb - pivot) * Math.pow(Math.abs(pb - pivot), 1 / c);

  // 6. Saturation
  const lum = 0.2126 * pr + 0.7152 * pg + 0.0722 * pb;
  const sat = params.saturation;
  pr = lum + (pr - lum) * sat;
  pg = lum + (pg - lum) * sat;
  pb = lum + (pb - lum) * sat;

  // 7. Blend back skin tone protection if applicable
  if (skinProtectionWeight > 0) {
    pr = pr * (1 - skinProtectionWeight) + r * skinProtectionWeight;
    pg = pg * (1 - skinProtectionWeight) + g * skinProtectionWeight;
    pb = pb * (1 - skinProtectionWeight) + b * skinProtectionWeight;
  }

  return {
    r: Math.max(0, Math.min(1, pr)),
    g: Math.max(0, Math.min(1, pg)),
    b: Math.max(0, Math.min(1, pb)),
  };
}

/**
 * Builds an industry-standard 17x17x17 .CUBE 3D LUT string
 * Ready for import into DaVinci Resolve, Adobe Premiere Pro, Final Cut Pro, or Photoshop
 */
export function generateCinemaGradeCubeLut(params: CinemaGradeParams): string {
  const size = 17;
  const lines: string[] = [];

  lines.push(`# DaVinci Resolve & Premiere Pro 3D LUT`);
  lines.push(`# Generated by The Ultimate Color Psychology & Cinematography Matrix`);
  lines.push(`TITLE "${params.name} (${params.sceneType.toUpperCase()})"`);
  lines.push(`LUT_3D_SIZE ${size}`);
  lines.push(`DOMAIN_MIN 0.0 0.0 0.0`);
  lines.push(`DOMAIN_MAX 1.0 1.0 1.0`);
  lines.push('');

  // B outer loop, G middle, R inner per standard .cube specification
  for (let b = 0; b < size; b++) {
    const normB = b / (size - 1);
    for (let g = 0; g < size; g++) {
      const normG = g / (size - 1);
      for (let r = 0; r < size; r++) {
        const normR = r / (size - 1);

        const graded = gradePixelRgb(normR, normG, normB, {
          lift: params.lift,
          gamma: params.gamma,
          gain: params.gain,
          offsetLum: params.offsetLum,
          kelvin: params.kelvin,
          tint: params.tint,
          contrast: params.contrast,
          saturation: params.saturation,
          skinToneProtection: params.skinToneProtection,
        });

        lines.push(`${graded.r.toFixed(6)} ${graded.g.toFixed(6)} ${graded.b.toFixed(6)}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Generates an Adobe Lightroom Classic / Camera Raw .XMP preset
 */
export function generateCinemaGradeXmp(params: CinemaGradeParams): string {
  const liftPolar = rgbOffsetToPolar(params.lift.r, params.lift.g, params.lift.b);
  const gammaPolar = rgbOffsetToPolar(params.gamma.r, params.gamma.g, params.gamma.b);
  const gainPolar = rgbOffsetToPolar(params.gain.r, params.gain.g, params.gain.b);

  const shadowHue = liftPolar.angleDeg;
  const shadowSat = Math.round(liftPolar.magnitude * 50);
  const midtoneHue = gammaPolar.angleDeg;
  const midtoneSat = Math.round(gammaPolar.magnitude * 50);
  const highlightHue = gainPolar.angleDeg;
  const highlightSat = Math.round(gainPolar.magnitude * 50);

  // Temperature offset (-100 to +100 in Lightroom scale)
  const tempOffset = Math.round(((params.kelvin - 5500) / 4500) * 50);
  const contrastOffset = Math.round((params.contrast - 1.0) * 50);
  const satOffset = Math.round((params.saturation - 1.0) * 50);

  return `<?xml version="1.0" encoding="UTF-8"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 7.0-c000 1.000000, 2026/01/01">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
    crs:PresetType="Normal"
    crs:UUID="${params.id}"
    crs:SupportsAmount="True"
    crs:SupportsColor="True"
    crs:Name="${escapeXml(params.name)}"
    crs:Group="Cinema Masterclass - ${params.sceneType.toUpperCase()}"
    crs:Description="${escapeXml(params.whyItWorks)}"
    crs:Temperature="${tempOffset}"
    crs:Tint="${Math.round(params.tint)}"
    crs:Contrast2012="${contrastOffset}"
    crs:Saturation="${satOffset}"
    crs:SplitToningShadowHue="${shadowHue}"
    crs:SplitToningShadowSaturation="${shadowSat}"
    crs:SplitToningHighlightHue="${highlightHue}"
    crs:SplitToningHighlightSaturation="${highlightSat}"
    crs:ColorGradeMidtoneHue="${midtoneHue}"
    crs:ColorGradeMidtoneSat="${midtoneSat}"
    crs:ColorGradeShadowLum="${Math.round(params.lift.lum)}"
    crs:ColorGradeMidtoneLum="${Math.round(params.gamma.lum)}"
    crs:ColorGradeHighlightLum="${Math.round(params.gain.lum)}"
    crs:ColorGradeBlending="50"
    crs:HasSettings="True">
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
