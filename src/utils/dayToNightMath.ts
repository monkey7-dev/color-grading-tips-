/**
 * Day-to-Night (Nuit Américaine) Color Grading Mathematical Engine
 * Simulating the multi-node Hollywood day-for-night transformation:
 * - Exposure reduction (stops to linear scale)
 * - Scotopic Purkinje cyan-blue shift
 * - Sky luminance suppression
 * - Skin tone warmth preservation on the 135° vectorscope vector
 * - Practical light warmth injection (2700K tungsten opponent contrast)
 */

export interface DayToNightSettings {
  exposureDropEv: number; // -1.0 to -4.0 stops (default -2.5)
  moonlightKelvin: number; // 6500K to 10000K (default 8500K)
  scotopicDesaturation: number; // 0.4 to 0.9 (default 0.68)
  skyDarkening: number; // 0.0 to 1.0 (default 0.85)
  shadowBlueLift: number; // 0.0 to 1.0 (default 0.75)
  skinWarmthRetention: number; // 0.0 to 1.0 (default 0.70)
  practicalWarmth: number; // 0.0 to 1.0 (default 0.80)
}

export const DEFAULT_DAY_TO_NIGHT: DayToNightSettings = {
  exposureDropEv: -2.6,
  moonlightKelvin: 8500,
  scotopicDesaturation: 0.68,
  skyDarkening: 0.85,
  shadowBlueLift: 0.75,
  skinWarmthRetention: 0.70,
  practicalWarmth: 0.80,
};

/**
 * Computes the linear exposure multiplier from EV stops: 2^(EV)
 */
export function evToLinearMultiplier(ev: number): number {
  return Math.pow(2, ev);
}

/**
 * Computes graded Day-to-Night layer colors for interactive canvas simulation
 */
export function computeDayToNightLayers(
  settings: DayToNightSettings,
  stepProgress: number // 0 to 5 (0: raw day, 5: full cinema night)
) {
  // Normalize step factor [0..1]
  const p = Math.max(0, Math.min(1, stepProgress / 5));

  // 1. Exposure factor
  const expMult = 1.0 + (evToLinearMultiplier(settings.exposureDropEv) - 1.0) * Math.min(1, p * 1.4);

  // 2. Sky transformation (Bright azure day -> Deep nocturnal indigo/black)
  // Day sky: #38bdf8 -> Night sky: #060d1a
  const skyTop = interpolateHex('#38bdf8', '#050a14', Math.min(1, p * 1.25 * settings.skyDarkening));
  const skyBottom = interpolateHex('#bae6fd', '#0d1829', Math.min(1, p * 1.15 * settings.skyDarkening));

  // 3. Mountains / Far Terrain
  // Day: #64748b -> Night: #0e1a29 (deep scotopic blue)
  const farMountain = interpolateHex(
    '#64748b',
    '#0c1726',
    Math.min(1, p * 1.1)
  );

  // 4. Midground / Architecture
  // Day: #334155 -> Night: #070e17
  const midground = interpolateHex(
    '#334155',
    '#070e18',
    Math.min(1, p * 1.2)
  );

  // 5. Terrain & Grass
  // Day: #1e3a2b -> Night: #05120d (desaturated spruce green/charcoal)
  const terrain = interpolateHex(
    '#1e3a2b',
    '#05120c',
    Math.min(1, p * 1.15)
  );

  // 6. Actor Skin Tone (Warm golden skin -> Preserved healthy warmth against cool ambient)
  // Fair day skin: #e8987a -> Night skin: #b0705a (retains hemoglobin warmth with slight exposure drop)
  const nightSkinTarget = settings.skinWarmthRetention > 0.5 ? '#b8755c' : '#55687d'; // Zombie blue if no retention!
  const actorSkin = interpolateHex(
    '#e8987a',
    nightSkinTarget,
    Math.min(1, p * 0.9)
  );

  // 7. Practical Window / Lantern
  // Day: dim glass #cbd5e1 -> Night: glowing 2400K tungsten gold #ffb703
  const practicalLight = interpolateHex(
    '#cbd5e1',
    '#f59e0b',
    Math.max(0, (p - 0.5) * 2) * settings.practicalWarmth
  );

  // 8. Moonlight Rim Light (Cold silvery-blue highlight)
  const moonRim = interpolateHex(
    '#fffbeb',
    '#93c5fd',
    Math.min(1, p * 1.2)
  );

  return {
    skyTop,
    skyBottom,
    farMountain,
    midground,
    terrain,
    actorSkin,
    practicalLight,
    moonRim,
    exposureFactor: expMult,
  };
}

/**
 * Linearly interpolates two hex colors
 */
export function interpolateHex(hex1: string, hex2: string, t: number): string {
  const clampT = Math.max(0, Math.min(1, t));
  const c1 = parseHexRgb(hex1);
  const c2 = parseHexRgb(hex2);

  const r = Math.round(c1.r + (c2.r - c1.r) * clampT);
  const g = Math.round(c1.g + (c2.g - c1.g) * clampT);
  const b = Math.round(c1.b + (c2.b - c1.b) * clampT);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function parseHexRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
  };
}
