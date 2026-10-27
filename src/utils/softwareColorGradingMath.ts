/**
 * Universal Post-Production Software Engine for DaVinci Resolve & Adobe Lightroom Classic
 * Dynamically computes exact DaVinci Resolve 3-Way Color Wheels and Adobe Lightroom Classic
 * settings for ANY selected color across the entire application with multiple professional styles.
 */

import { hexToRgb, rgbToHsl } from './colorMath';

export type GradingStyle = 'theatrical' | 'vintage_film' | 'scotopic_night' | 'clean_commercial';

export interface ResolveNodeInstruction {
  nodeNum: number;
  label: string;
  toolType: string;
  setting: string;
  rationale: string;
}

export interface ResolveGradeSettings {
  colorName: string;
  sourceHex: string;
  style: GradingStyle;
  styleLabel: string;
  kelvin: number;
  tint: number;
  lift: { r: number; g: number; b: number; lum: number; hueDeg: number; satPercent: number };
  gamma: { r: number; g: number; b: number; lum: number; hueDeg: number; satPercent: number };
  gain: { r: number; g: number; b: number; lum: number; hueDeg: number; satPercent: number };
  offset: { r: number; g: number; b: number; lum: number };
  logWheels: {
    shadow: { r: number; g: number; b: number; rangeLow: number };
    midtone: { r: number; g: number; b: number };
    highlight: { r: number; g: number; b: number; rangeHigh: number };
  };
  contrast: number;
  pivot: number;
  saturationPercent: number;
  curves: {
    blackPoint: [number, number];
    shadowPivot: [number, number];
    midpoint: [number, number];
    highlightKnee: [number, number];
  };
  hslQualifier: {
    targetHue: string;
    hueCenter: number;
    hueWidth: number;
    satDelta: number;
    lumDelta: number;
  };
  nodePipeline: ResolveNodeInstruction[];
  curvesTip: string;
}

export interface LightroomGradeSettings {
  colorName: string;
  sourceHex: string;
  style: GradingStyle;
  styleLabel: string;
  tempSlider: number; // -100 to +100
  tintSlider: number; // -100 to +100
  exposureDelta: number; // -2.0 to +2.0
  contrastSlider: number; // -100 to +100
  highlightsSlider: number;
  shadowsSlider: number;
  whitesSlider: number;
  blacksSlider: number;
  claritySlider: number;
  vibranceSlider: number;
  colorGrading: {
    shadows: { hue: number; sat: number; lum: number };
    midtones: { hue: number; sat: number; lum: number };
    highlights: { hue: number; sat: number; lum: number };
    blending: number;
    balance: number;
  };
  hslTarget: {
    channel: string;
    hueOffset: number;
    satOffset: number;
    lumOffset: number;
  };
  calibration: {
    redPrimaryHue: number;
    redPrimarySat: number;
    greenPrimaryHue: number;
    greenPrimarySat: number;
    bluePrimaryHue: number;
    bluePrimarySat: number;
  };
  toneCurve: {
    shadows: number;
    darks: number;
    lights: number;
    highlights: number;
  };
  maskingTip: string;
}

export const GRADING_STYLE_OPTIONS: { id: GradingStyle; label: string; description: string; badge: string }[] = [
  {
    id: 'theatrical',
    label: 'Hollywood Theatrical',
    description: 'High micro-contrast, complementary shadow opponent split, protected 135° skin vector, and soft highlight roll-off.',
    badge: 'Standard Hollywood',
  },
  {
    id: 'vintage_film',
    label: '35mm Kodak 2383 Film',
    description: 'Lifted matte black floor (+8 IRE), warm organic shadow tone, compressed highlight knee, and softened digital edge.',
    badge: 'Analog Film Print',
  },
  {
    id: 'scotopic_night',
    label: 'Scotopic Night / Noir',
    description: 'Purkinje rod-vision shift to cool cyan/blue, deep shadow floor (-12 IRE), and isolated warm tungsten practical pop.',
    badge: 'Day-for-Night',
  },
  {
    id: 'clean_commercial',
    label: 'Commercial & Fashion',
    description: 'Crisp neutral white balance, pristine color fidelity, balanced dynamic range, and clean, unshifted neutral shadows.',
    badge: 'High-Fidelity',
  },
];

/**
 * Derives comprehensive DaVinci Resolve & Lightroom settings dynamically from ANY color hex
 */
export function deriveSoftwareGradingFromColor(
  hex: string,
  colorName: string = 'Selected Color',
  secondaryHex?: string,
  style: GradingStyle = 'theatrical'
): { resolve: ResolveGradeSettings; lightroom: LightroomGradeSettings } {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // If secondary color provided, use it; otherwise compute complementary shadow tone
  const compHue = (hsl.h + 180) % 360;

  // Correlated Color Temperature calculation
  let kelvin = 5600;
  let tempLightroom = 0;
  if (hsl.h >= 15 && hsl.h <= 70) {
    kelvin = Math.round(3000 + (hsl.h / 70) * 1500); // 3000K - 4500K
    tempLightroom = Math.round(15 + (1 - hsl.h / 70) * 25);
  } else if (hsl.h > 70 && hsl.h < 170) {
    kelvin = 5400;
    tempLightroom = 0;
  } else if (hsl.h >= 170 && hsl.h <= 260) {
    kelvin = Math.round(7000 + ((hsl.h - 170) / 90) * 2200); // 7000K - 9200K
    tempLightroom = Math.round(-15 - ((hsl.h - 170) / 90) * 25);
  } else {
    kelvin = 4200;
    tempLightroom = 10;
  }

  // Tint calculation
  let tintDuv = 0;
  if (hsl.h >= 80 && hsl.h <= 160) {
    tintDuv = -15; // Green bias
  } else if (hsl.h >= 280 && hsl.h <= 340) {
    tintDuv = 20; // Magenta bias
  }

  // Base vectors
  const gammaHueRad = (hsl.h * Math.PI) / 180;
  let gammaMag = (hsl.s / 100) * 0.45;
  let liftHue = compHue;
  let liftMag = 0.25;
  let liftLum = Math.round(-4 + (hsl.l < 30 ? -8 : 0));
  let gammaLum = Math.round((hsl.l - 50) * 0.3);
  let gainLum = Math.round(8 + (hsl.l > 60 ? 8 : 0));
  let contrast = Number((1.15 + (hsl.s / 100) * 0.2).toFixed(2));
  let saturationPercent = Math.round(hsl.s * 1.1);

  // Style-specific modulations
  let blackPoint: [number, number] = [0, 8];
  let shadowPivot: [number, number] = [25, 20];
  let midpoint: [number, number] = [50, 52];
  let highlightKnee: [number, number] = [85, 88];

  let whitesSlider = 0;
  let blacksSlider = 0;
  let claritySlider = 0;
  let vibranceSlider = 10;
  let lrHighlights = -20;
  let lrShadows = +15;
  let lrExposure = Number(((hsl.l - 50) / 100).toFixed(2));
  let lrShadowsHue = compHue;
  let lrShadowsSat = 20;
  let lrShadowsLum = -5;
  let lrMidtonesHue = hsl.h;
  let lrMidtonesSat = Math.round(hsl.s * 0.35);
  let lrMidtonesLum = gammaLum;
  let lrHighlightsHue = hsl.h;
  let lrHighlightsSat = Math.round(hsl.s * 0.25);
  let lrHighlightsLum = gainLum;
  let lrBlending = 50;
  let lrBalance = +5;

  let calRedHue = 0;
  let calRedSat = +15;
  let calGreenHue = 0;
  let calGreenSat = 0;
  let calBlueHue = 0;
  let calBlueSat = +20;

  let logShadowRange = 0.333;
  let logHighlightRange = 0.650;

  let curvesTip = `In Resolve Custom Curves, place an anchor at (50, 50). Pull (25, 20) down slightly and push (75, 80) up for rich filmic roll-off.`;
  let maskingTip = `Create a Soft Linear Gradient from bottom-left to top-right with Exposure -0.3 EV to subtly guide viewer eye to key subjects.`;

  if (style === 'vintage_film') {
    // 35mm Kodak 2383 emulation
    liftLum = +6; // Lifted matte blacks
    gainLum = -4; // Soft shoulder compression
    contrast = 1.10;
    saturationPercent = Math.max(70, Math.round(saturationPercent * 0.88));
    blackPoint = [0, 14];
    shadowPivot = [28, 25];
    midpoint = [50, 49];
    highlightKnee = [85, 82];

    whitesSlider = -15;
    blacksSlider = +18;
    claritySlider = -8; // Halation / bloom
    vibranceSlider = +5;
    lrHighlights = -35;
    lrShadows = +10;
    lrBalance = -10;
    calRedHue = -5;
    calRedSat = +25;
    calGreenHue = +10;
    calBlueHue = -5;
    calBlueSat = -10;

    curvesTip = `Kodak 2383 emulation: Raise black floor point to Y=12 on Master curve to create iconic velvety matte shadows. In Green curve, pull highlights down 3% to suppress harsh digital fluorescents.`;
    maskingTip = `Add a soft radial center mask with +0.2 EV and -10 Clarity to emulate classic Cooke vintage spherical lens center illumination.`;
  } else if (style === 'scotopic_night') {
    // Scotopic Night / Noir
    kelvin = Math.max(kelvin, 7800);
    tempLightroom = Math.min(tempLightroom, -35);
    liftHue = 222; // Prussian nocturnal blue
    liftMag = 0.38;
    liftLum = -12; // Deep crushed shadows
    gammaLum = -8;
    gainLum = -5;
    contrast = 1.35;
    saturationPercent = Math.max(50, Math.round(saturationPercent * 0.75));
    blackPoint = [0, 2];
    shadowPivot = [25, 14];
    midpoint = [50, 42];
    highlightKnee = [85, 84];

    lrExposure = -1.25;
    whitesSlider = -10;
    blacksSlider = -25;
    claritySlider = +12;
    lrHighlights = -15;
    lrShadows = -30;
    lrShadowsHue = 225;
    lrShadowsSat = 35;
    lrShadowsLum = -15;
    lrHighlightsHue = 38; // Tungsten practical opponent
    lrHighlightsSat = 25;
    lrHighlightsLum = +5;
    lrBalance = -20;
    calBlueSat = +30;

    curvesTip = `Night Scotopic Grade: Steep S-curve pulling shadows deep into negative territory. In Blue curve, lift shadows to Y=18 to simulate rod vision (Purkinje shift).`;
    maskingTip = `Invert a Graduated Linear Mask on the top 40% of the frame (Sky) and drop exposure -2.2 EV with Highlights -60 to simulate realistic nocturnal sky falloff.`;
  } else if (style === 'clean_commercial') {
    // Commercial & Fashion
    kelvin = 5600;
    tintDuv = 0;
    tempLightroom = 0;
    liftLum = 0;
    gammaLum = +4;
    gainLum = +10;
    contrast = 1.20;
    saturationPercent = 105;
    blackPoint = [0, 4];
    shadowPivot = [25, 23];
    midpoint = [50, 52];
    highlightKnee = [85, 88];

    whitesSlider = +10;
    blacksSlider = -5;
    claritySlider = +5;
    vibranceSlider = +15;
    lrHighlights = -10;
    lrShadows = +20;
    lrBalance = 0;
    calRedSat = +10;
    calBlueSat = +15;

    curvesTip = `Commercial Master Curve: Gentle modern S-curve with crisp white extension. Keep individual RGB curves locked for 100% colorimetric neutrality.`;
    maskingTip = `Use Subject Detection mask to add +0.25 EV and +10 Texture exclusively to the primary subject, retaining crisp separation from background.`;
  }

  // Calculate RGB coordinates for Lift, Gamma, Gain
  const liftHueRad = (liftHue * Math.PI) / 180;
  const liftR = Number((liftMag * Math.cos(liftHueRad)).toFixed(3));
  const liftG = Number((liftMag * Math.cos(liftHueRad - (2 * Math.PI) / 3)).toFixed(3));
  const liftB = Number((liftMag * Math.cos(liftHueRad - (4 * Math.PI) / 3)).toFixed(3));

  const gammaR = Number((gammaMag * Math.cos(gammaHueRad)).toFixed(3));
  const gammaG = Number((gammaMag * Math.cos(gammaHueRad - (2 * Math.PI) / 3)).toFixed(3));
  const gammaB = Number((gammaMag * Math.cos(gammaHueRad - (4 * Math.PI) / 3)).toFixed(3));

  const gainMag = (hsl.s / 100) * 0.3;
  const gainR = Number((gainMag * Math.cos(gammaHueRad)).toFixed(3));
  const gainG = Number((gainMag * Math.cos(gammaHueRad - (2 * Math.PI) / 3)).toFixed(3));
  const gainB = Number((gainMag * Math.cos(gammaHueRad - (4 * Math.PI) / 3)).toFixed(3));

  const channelName = getHslChannelName(hsl.h);
  const styleLabel = GRADING_STYLE_OPTIONS.find(s => s.id === style)?.label || 'Hollywood Theatrical';

  // 5-Node Hollywood Serial Pipeline
  const nodePipeline: ResolveNodeInstruction[] = [
    {
      nodeNum: 1,
      label: 'Exposure & White Balance',
      toolType: 'Camera RAW / Primaries Offset',
      setting: `Kelvin: ${kelvin}K · Tint: ${tintDuv > 0 ? '+' : ''}${tintDuv} · Offset Lum: ${style === 'scotopic_night' ? '-15' : '0'} IRE`,
      rationale: 'Establishes colorimetric neutrality and sets sensor dynamic range boundaries before any creative coloring.',
    },
    {
      nodeNum: 2,
      label: 'Contrast & Pivot S-Curve',
      toolType: 'Custom Curves & Master Contrast',
      setting: `Contrast: ${contrast.toFixed(2)}x · Pivot: 0.435 · Black: (${blackPoint[0]}, ${blackPoint[1]}) · White: (${highlightKnee[0]}, ${highlightKnee[1]})`,
      rationale: 'Shapes luminance density and tonal distribution, establishing specular highlights and shadow floor.',
    },
    {
      nodeNum: 3,
      label: 'Look & Color Split',
      toolType: '3-Way Primaries & Log Wheels',
      setting: `Gamma: ${hsl.h}° (Midtones) · Lift: ${liftHue}° (Shadows) · Gain Lum: ${gainLum > 0 ? '+' : ''}${gainLum} IRE`,
      rationale: 'Injects the core artistic color harmony, balancing midtones against opposing opponent shadow floor.',
    },
    {
      nodeNum: 4,
      label: 'Secondary HSL Isolation & Skin',
      toolType: 'Hue vs Sat & 3D Qualifier',
      setting: `Target Channel: ${channelName} (Center: ${hsl.h}°) · Saturation Delta: +25% · 135° I-Line Protected`,
      rationale: 'Enriches dominant color saturation while qualifying human skin tones to prevent zombie discoloration.',
    },
    {
      nodeNum: 5,
      label: 'Output Transform & Texture',
      toolType: 'Film Grain / Halation / CST',
      setting: style === 'vintage_film' ? 'Film Grain 35mm (Size: 0.35, Roughness: 0.42) · Halation: Warm 650nm' : 'Soft Highlight Roll-off Knee (Rec.709 OETF)',
      rationale: 'Ensures delivery broadcast compliance and adds organic physical optical characteristics.',
    },
  ];

  const resolve: ResolveGradeSettings = {
    colorName,
    sourceHex: hex,
    style,
    styleLabel,
    kelvin,
    tint: tintDuv,
    lift: {
      r: liftR,
      g: liftG,
      b: liftB,
      lum: liftLum,
      hueDeg: liftHue,
      satPercent: Math.round(liftMag * 100),
    },
    gamma: {
      r: gammaR,
      g: gammaG,
      b: gammaB,
      lum: gammaLum,
      hueDeg: hsl.h,
      satPercent: Math.round(gammaMag * 100),
    },
    gain: {
      r: gainR,
      g: gainG,
      b: gainB,
      lum: gainLum,
      hueDeg: hsl.h,
      satPercent: Math.round(gainMag * 100),
    },
    offset: {
      r: 0,
      g: 0,
      b: 0,
      lum: style === 'scotopic_night' ? -15 : 0,
    },
    logWheels: {
      shadow: { r: liftR * 0.8, g: liftG * 0.8, b: liftB * 0.8, rangeLow: logShadowRange },
      midtone: { r: gammaR, g: gammaG, b: gammaB },
      highlight: { r: gainR * 0.6, g: gainG * 0.6, b: gainB * 0.6, rangeHigh: logHighlightRange },
    },
    contrast,
    pivot: 0.435,
    saturationPercent,
    curves: {
      blackPoint,
      shadowPivot,
      midpoint,
      highlightKnee,
    },
    hslQualifier: {
      targetHue: channelName,
      hueCenter: hsl.h,
      hueWidth: 25,
      satDelta: +25,
      lumDelta: +10,
    },
    nodePipeline,
    curvesTip,
  };

  const lightroom: LightroomGradeSettings = {
    colorName,
    sourceHex: hex,
    style,
    styleLabel,
    tempSlider: tempLightroom,
    tintSlider: tintDuv,
    exposureDelta: lrExposure,
    contrastSlider: Math.round((contrast - 1.0) * 50),
    highlightsSlider: lrHighlights,
    shadowsSlider: lrShadows,
    whitesSlider,
    blacksSlider,
    claritySlider,
    vibranceSlider,
    colorGrading: {
      shadows: { hue: lrShadowsHue, sat: lrShadowsSat, lum: lrShadowsLum },
      midtones: { hue: lrMidtonesHue, sat: lrMidtonesSat, lum: lrMidtonesLum },
      highlights: { hue: lrHighlightsHue, sat: lrHighlightsSat, lum: lrHighlightsLum },
      blending: lrBlending,
      balance: lrBalance,
    },
    hslTarget: {
      channel: channelName,
      hueOffset: 0,
      satOffset: +25,
      lumOffset: +15,
    },
    calibration: {
      redPrimaryHue: calRedHue,
      redPrimarySat: calRedSat,
      greenPrimaryHue: calGreenHue,
      greenPrimarySat: calGreenSat,
      bluePrimaryHue: calBlueHue,
      bluePrimarySat: calBlueSat,
    },
    toneCurve: {
      shadows: style === 'vintage_film' ? +12 : style === 'scotopic_night' ? -18 : -6,
      darks: style === 'vintage_film' ? +8 : style === 'scotopic_night' ? -12 : -4,
      lights: +8,
      highlights: style === 'vintage_film' ? -15 : +10,
    },
    maskingTip,
  };

  return { resolve, lightroom };
}

function getHslChannelName(h: number): string {
  if (h >= 345 || h < 15) return 'Red';
  if (h >= 15 && h < 45) return 'Orange';
  if (h >= 45 && h < 70) return 'Yellow';
  if (h >= 70 && h < 160) return 'Green';
  if (h >= 160 && h < 200) return 'Aqua / Cyan';
  if (h >= 200 && h < 260) return 'Blue';
  if (h >= 260 && h < 315) return 'Purple';
  return 'Magenta';
}
