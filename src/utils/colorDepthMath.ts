/**
 * Color Depth & Emotional Intensity Mathematics
 * Calculates tints, shades, tones, and nuanced emotional interpretations
 * as Saturation and Luminance shift for a given base hue.
 */

import { hslToRgb, rgbToHex } from './colorMath';

export type ColorToneType = 'pure' | 'tint' | 'shade' | 'tone' | 'abyssal_dark' | 'ethereal_light';

export interface EmotionDepthProfile {
  title: string;
  intensityLevel: 'Latent' | 'Subdued' | 'Balanced' | 'Heightened' | 'Piercing Peak';
  intensityScore: number; // 0 - 100
  toneType: ColorToneType;
  psychologicalDescription: string;
  cinematicApplication: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

/**
 * Classifies color into Tint, Shade, Tone, or Pure Chroma based on S and L
 */
export function classifyToneType(s: number, l: number): ColorToneType {
  if (l <= 12) return 'abyssal_dark';
  if (l >= 90) return 'ethereal_light';
  if (s >= 75 && l >= 35 && l <= 65) return 'pure';
  if (l > 55 && s < 60) return 'tint';
  if (l < 45 && s >= 25) return 'shade';
  if (s < 35) return 'tone';
  return l >= 50 ? 'tint' : 'shade';
}

/**
 * Calculates emotional intensity score (0-100) based on saturation and contrast to mid-gray.
 * High saturation + moderate luminance = maximum sensory activation.
 */
export function calculateIntensityScore(s: number, l: number): number {
  // Saturation provides raw chromatic arousal (0 to 65 pts)
  const satScore = (s / 100) * 65;
  // Luminance extremity away from pure middle gray or towards extremes adds dynamic tension (0 to 35 pts)
  const lumArousal = (1 - Math.abs(l - 50) / 50) * 35;
  return Math.min(100, Math.max(0, Math.round(satScore + lumArousal)));
}

/**
 * Maps intensity score to tier label
 */
export function getIntensityTier(score: number): EmotionDepthProfile['intensityLevel'] {
  if (score < 25) return 'Latent';
  if (score < 50) return 'Subdued';
  if (score < 75) return 'Balanced';
  if (score < 90) return 'Heightened';
  return 'Piercing Peak';
}

/**
 * Generates an emotionally nuanced profile for any emotion and (H, S, L) coordinate.
 */
export function getEmotionDepthProfile(
  emotionId: string,
  emotionName: string,
  h: number,
  s: number,
  l: number
): EmotionDepthProfile {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const toneType = classifyToneType(s, l);
  const intensityScore = calculateIntensityScore(s, l);
  const intensityLevel = getIntensityTier(intensityScore);

  // Emotional tone generator customized per emotional family
  let title = '';
  let psychologicalDescription = '';
  let cinematicApplication = '';

  const id = emotionId.toLowerCase();

  if (id.includes('sadness') || id.includes('melancholy') || id.includes('isolation')) {
    if (toneType === 'abyssal_dark') {
      title = 'Abyssal Void';
      psychologicalDescription = 'Profound existential weight, motionless detachment, and absolute emotional shutdown.';
      cinematicApplication = 'Underlit silhouettes, oppressive nocturnal shadow roll-off, psychological dread.';
    } else if (toneType === 'ethereal_light' || (l > 75 && s < 30)) {
      title = 'Fragile Melancholy';
      psychologicalDescription = 'Quiet grief, delicate wistfulness, and the gentle afterglow of loss.';
      cinematicApplication = 'Overcast window diffused soft light, memory flashbacks, mourning portraits.';
    } else if (s < 25) {
      title = 'Muted Numbness';
      psychologicalDescription = 'Depleted emotional vitality, chronic apathy, and suppressed mourning.';
      cinematicApplication = 'Desaturated clinical institutional interiors, urban alienation grades.';
    } else if (s >= 75) {
      title = 'Piercing Sorrow';
      psychologicalDescription = 'Acute, visceral heartbreak with active psychic ache and turbulent grief.';
      cinematicApplication = 'High-contrast rain sequences, neon tear reflections, tragic climaxes.';
    } else {
      title = 'Contemplative Solitude';
      psychologicalDescription = 'Introspective longing, calm reflection, and accepted stillness.';
      cinematicApplication = 'Dusk twilight exterior, medium close-ups of lonely characters.';
    }
  } else if (id.includes('joy') || id.includes('bliss') || id.includes('seren')) {
    if (toneType === 'abyssal_dark') {
      title = 'Smoldering Hearth';
      psychologicalDescription = 'Deep subterranean comfort, primal grounding, and ancestral safety.';
      cinematicApplication = 'Low-key firelight in wooden cabins, intimate sanctuary interiors.';
    } else if (s >= 80 && l >= 45 && l <= 65) {
      title = 'Vibrant Euphoria';
      psychologicalDescription = 'Radiant vitality, uninhibited celebration, surging dopamine and kinetic cheer.';
      cinematicApplication = 'Direct golden sun flare, celebratory climaxes, childhood nostalgia.';
    } else if (l >= 75 && s < 45) {
      title = 'Soft Optimism';
      psychologicalDescription = 'Gentle reassurance, tender morning hope, and peaceful awakening.';
      cinematicApplication = 'High-key breakfast light, sheer curtain diffusion, pastoral serenity.';
    } else if (s < 30) {
      title = 'Subdued Contentment';
      psychologicalDescription = 'Quiet satisfaction, rustic harmony, and untroubled leisure.';
      cinematicApplication = 'Muted documentary natural light, warm neutral kitchen grades.';
    } else {
      title = 'Buoyant Warmth';
      psychologicalDescription = 'Enthusiastic presence, inviting sociability, and spirited affection.';
      cinematicApplication = 'Commercial lifestyle lighting, golden hour rim lights on hair.';
    }
  } else if (id.includes('anger') || id.includes('passion') || id.includes('dominant')) {
    if (toneType === 'abyssal_dark') {
      title = 'Smoldering Malice';
      psychologicalDescription = 'Calculated hostility, cold vengeance held under extreme tension.';
      cinematicApplication = 'Deep shadow key-to-fill ratio (>8:1), villain lair low-angle lighting.';
    } else if (s >= 80 && l >= 40 && l <= 60) {
      title = 'Explosive Fury';
      psychologicalDescription = 'Maximal autonomic arousal, adrenaline release, confrontational violence.';
      cinematicApplication = 'Intense practical red emergency flares, frantic action climax cuts.';
    } else if (l >= 70 && s < 40) {
      title = 'Restless Friction';
      psychologicalDescription = 'Irritated anxiety, suppressed impatience, and nervous tension.';
      cinematicApplication = 'Harsh fluorescent hospital lighting with subtle pinkish skin push.';
    } else if (s < 35) {
      title = 'Cold Resentment';
      psychologicalDescription = 'Deep-seated bitterness, chronic grudge, and stubborn pride.';
      cinematicApplication = 'Desaturated courtroom shadows, tense interrogation cross-cutting.';
    } else {
      title = 'Commanding Intensity';
      psychologicalDescription = 'Uncompromising authority, assertive will, and sovereign dominance.';
      cinematicApplication = 'Hero power-stance backlighting, theatrical red carpet spotlights.';
    }
  } else if (id.includes('fear') || id.includes('anxiety') || id.includes('chaotic')) {
    if (toneType === 'abyssal_dark') {
      title = 'Suffocating Dread';
      psychologicalDescription = 'Paralyzing fear of the unknown lurking just beyond perception.';
      cinematicApplication = 'Pitch black negative space, claustrophobic single-source practicals.';
    } else if (s >= 75) {
      title = 'Acute Panic';
      psychologicalDescription = 'Sensory hyper-vigilance, erratic cardiac rhythm, flight-or-fight peak.';
      cinematicApplication = 'Strobe-lit corridors, flickering warning beacons, unhinged canted angles.';
    } else if (s < 30) {
      title = 'Creeping Unease';
      psychologicalDescription = 'Subtle paranoia, unnatural stillness, feeling watched without evidence.';
      cinematicApplication = 'Sickly greenish-gray office lighting, Fincher-esque yellow-green tints.';
    } else {
      title = 'Disorientation';
      psychologicalDescription = 'Loss of equilibrium, unpredictable environmental threat, vertigo.';
      cinematicApplication = 'Split diopter shots with unnatural hue contrast in deep background.';
    }
  } else {
    // Generalised fallback tailored to generic traits (Trust, Intellectual, Nostalgic, etc.)
    if (toneType === 'abyssal_dark') {
      title = `Deep ${emotionName} Shadow`;
      psychologicalDescription = `Dense, solemn manifestations of ${emotionName.toLowerCase()} with heavy emotional gravity.`;
      cinematicApplication = 'Rich shadow densities, noir style negative fill, stoic close-ups.';
    } else if (toneType === 'ethereal_light' || (l > 75 && s < 40)) {
      title = `Subtle ${emotionName} Tint`;
      psychologicalDescription = `Airy, delicate expressions of ${emotionName.toLowerCase()} marked by quiet restraint.`;
      cinematicApplication = 'Soft ambient fill light, ethereal memory sequences, clean commercial grades.';
    } else if (s >= 75) {
      title = `Vivid ${emotionName} Surge`;
      psychologicalDescription = `Unapologetic, concentrated chromatic power embodying pure ${emotionName.toLowerCase()}.`;
      cinematicApplication = 'Stylized music video primaries, high-saturation neon production design.';
    } else if (s < 30) {
      title = `Muted ${emotionName} Tone`;
      psychologicalDescription = `Weathered, understated nuances of ${emotionName.toLowerCase()} balanced with neutral calmness.`;
      cinematicApplication = 'Period piece muted palettes, organic 35mm film stock emulation.';
    } else {
      title = `Harmonic ${emotionName}`;
      psychologicalDescription = `Balanced equilibrium of ${emotionName.toLowerCase()} suitable for enduring comfort.`;
      cinematicApplication = 'Classic three-point lighting, standard 2.39:1 widescreen narrative setups.';
    }
  }

  return {
    title,
    intensityLevel,
    intensityScore,
    toneType,
    psychologicalDescription,
    cinematicApplication,
    hex,
    rgb,
    hsl: { h, s, l },
  };
}

/**
 * Generates an array of discrete shades, tints, and tones along a matrix for visual demonstration.
 */
export function generateDepthMatrix(
  baseHue: number,
  steps: number = 5
): { hex: string; s: number; l: number; label: string }[] {
  const result: { hex: string; s: number; l: number; label: string }[] = [];
  const satSteps = [15, 35, 60, 85, 100];
  const lumSteps = [18, 35, 50, 68, 85];

  for (const l of lumSteps) {
    for (const s of satSteps) {
      const rgb = hslToRgb(baseHue, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      let label = 'Tone';
      if (l > 65) label = 'Tint';
      else if (l < 30) label = 'Shade';
      else if (s > 75) label = 'Pure';

      result.push({ hex, s, l, label });
    }
  }
  return result;
}

/**
 * Presets for jumping directly to psychological intensity archetypes.
 */
export interface DepthPreset {
  id: string;
  label: string;
  tagline: string;
  s: number;
  l: number;
}

export const DEPTH_PRESETS: DepthPreset[] = [
  {
    id: 'muted',
    label: 'Muted & Wistful',
    tagline: 'Desaturated, high-luminance gentle tint',
    s: 22,
    l: 76,
  },
  {
    id: 'abyssal',
    label: 'Abyssal Void',
    tagline: 'Deep, near-black dense psychological shadow',
    s: 65,
    l: 18,
  },
  {
    id: 'neutral_tone',
    label: 'Grounded Tone',
    tagline: 'Subdued everyday tone tempered with slate gray',
    s: 34,
    l: 45,
  },
  {
    id: 'vibrant_peak',
    label: 'Vibrant Euphoria',
    tagline: 'Maximum chromatic saturation & active sensory peak',
    s: 96,
    l: 52,
  },
  {
    id: 'ethereal',
    label: 'Ethereal Dawn',
    tagline: 'Luminous whisper of color dissolved into white',
    s: 38,
    l: 88,
  },
];
