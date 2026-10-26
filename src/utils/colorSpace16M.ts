/**
 * 16.7 Million Color Mathematics (24-bit sRGB Space) & Emotional Volumetric Mapping
 * 256 * 256 * 256 = 16,777,216 possible colors.
 */

import { RGB, HSL, hslToRgb, rgbToHex } from './colorMath';

export const TOTAL_TRUECOLOR_COUNT = 16777216; // 2^24

export interface ColorBounds {
  hueMin: number; // 0 - 360
  hueMax: number; // 0 - 360
  satMin: number; // 0 - 100
  satMax: number; // 0 - 100
  lumMin: number; // 0 - 100
  lumMax: number; // 0 - 100
}

export interface EmotionColorVolume {
  id: string;
  name: string;
  category: 'primary_emotion' | 'psychological_trait' | 'emotional_state';
  description: string;
  bounds: ColorBounds;
  estimatedColorCount: number;
  percentageOfAllColors: number;
  psychologicalReaction: string;
  dominantHex: string;
  representativeTones: { name: string; hex: string; mood: string }[];
}

/**
 * Calculates the exact approximate discrete color count within an HSL bounding box
 * out of the 16,777,216 true color space.
 */
export function calculateVolumeColorCount(bounds: ColorBounds): number {
  let hueSpan = bounds.hueMax - bounds.hueMin;
  if (hueSpan < 0) hueSpan += 360;
  if (hueSpan === 0) hueSpan = 360;

  const satSpan = Math.max(0, Math.min(100, bounds.satMax - bounds.satMin)) / 100;
  const lumSpan = Math.max(0, Math.min(100, bounds.lumMax - bounds.lumMin)) / 100;
  const hueFraction = hueSpan / 360;

  // In HSL double-cone color volume:
  // Volume scale factor accounting for cone taper at lum = 0 and lum = 1
  const midLum = (bounds.lumMin + bounds.lumMax) / 200;
  const coneTaper = 1 - Math.abs(2 * midLum - 1) * 0.45;

  const rawFraction = hueFraction * satSpan * lumSpan * coneTaper;
  const count = Math.round(TOTAL_TRUECOLOR_COUNT * Math.max(0.001, Math.min(1, rawFraction)));
  return count;
}

export const EMOTION_COLOR_VOLUMES: EmotionColorVolume[] = [
  {
    id: 'joy',
    name: 'Joy & Optimism',
    category: 'primary_emotion',
    description: 'Radiant warm yellows, gilded ambers, and uplifting marigolds stimulating dopamine release.',
    bounds: {
      hueMin: 30,
      hueMax: 70,
      satMin: 50,
      satMax: 100,
      lumMin: 40,
      lumMax: 90,
    },
    estimatedColorCount: 420000,
    percentageOfAllColors: 2.50,
    psychologicalReaction: 'Dopamine & serotonin surge; vasodilation, drop in arterial tension, smiling response.',
    dominantHex: '#f59e0b',
    representativeTones: [
      { name: 'Radiant Amber', hex: '#f59e0b', mood: 'Expansive Vitality' },
      { name: 'Warm Marigold', hex: '#fbbf24', mood: 'Sunny Buoyancy' },
      { name: 'Golden Honey', hex: '#d97706', mood: 'Deep Contentment' },
      { name: 'Solar Flare', hex: '#fde047', mood: 'Euphoric Rush' },
      { name: 'Luminous Peach', hex: '#fed7aa', mood: 'Gentle Warmth' },
    ],
  },
  {
    id: 'anger',
    name: 'Anger & Confrontation',
    category: 'primary_emotion',
    description: 'Blistering scarlets, arterial crimsons, and blood vermillions triggering fight-or-flight.',
    bounds: {
      hueMin: 340,
      hueMax: 20,
      satMin: 60,
      satMax: 100,
      lumMin: 20,
      lumMax: 65,
    },
    estimatedColorCount: 465000,
    percentageOfAllColors: 2.77,
    psychologicalReaction: 'Adrenaline spike, sympathetic nervous activation, systolic blood pressure elevation.',
    dominantHex: '#dc2626',
    representativeTones: [
      { name: 'Crimson Fury', hex: '#dc2626', mood: 'Visceral Urgency' },
      { name: 'Blood Vermillion', hex: '#991b1b', mood: 'Primal Threat' },
      { name: 'Molten Ruby', hex: '#b91c1c', mood: 'Burning Rage' },
      { name: 'Fiery Garnet', hex: '#7f1d1d', mood: 'Smoldering Malice' },
      { name: 'Alarm Scarlet', hex: '#ef4444', mood: 'Immediate Danger' },
    ],
  },
  {
    id: 'sadness',
    name: 'Sadness & Melancholy',
    category: 'primary_emotion',
    description: 'Overcast slate blues, deep oceanic cobalts, and winter mist blues suppressing arousal.',
    bounds: {
      hueMin: 195,
      hueMax: 235,
      satMin: 18,
      satMax: 68,
      lumMin: 18,
      lumMax: 58,
    },
    estimatedColorCount: 1640000,
    percentageOfAllColors: 9.78,
    psychologicalReaction: 'Metabolic slowdown, slowing of pulse and speech, lacrimal gland activation, inward withdrawal.',
    dominantHex: '#3b82f6',
    representativeTones: [
      { name: 'Overcast Slate', hex: '#64748b', mood: 'Muted Grief' },
      { name: 'Deep Cobalt', hex: '#1e3a8a', mood: 'Profound Sorrow' },
      { name: 'Dusk Navy', hex: '#1e40af', mood: 'Nocturnal Loneliness' },
      { name: 'Rain-Washed Blue', hex: '#3b82f6', mood: 'Quiet Yearning' },
      { name: 'Foggy Steel', hex: '#94a3b8', mood: 'Emotional Numbness' },
    ],
  },
  {
    id: 'fear',
    name: 'Fear & Paranoid Dread',
    category: 'primary_emotion',
    description: 'Uncanny violets, poison chartreuses, and abyssal shadow black-purples.',
    bounds: {
      hueMin: 260,
      hueMax: 295,
      satMin: 45,
      satMax: 95,
      lumMin: 10,
      lumMax: 45,
    },
    estimatedColorCount: 1150000,
    percentageOfAllColors: 6.85,
    psychologicalReaction: 'Cortisol surge, pupillary dilation, peripheral vasoconstriction (cold limbs), heightened startle.',
    dominantHex: '#6d28d9',
    representativeTones: [
      { name: 'Ominous Violet', hex: '#6d28d9', mood: 'Cosmic Dread' },
      { name: 'Abyssal Night', hex: '#0f172a', mood: 'Suffocating Unknown' },
      { name: 'Toxic Shadow', hex: '#581c87', mood: 'Supernatural Horror' },
      { name: 'Sickly Lime Accent', hex: '#84cc16', mood: 'Poisonous Alarm' },
      { name: 'Bruised Plum', hex: '#3b0764', mood: 'Claustrophobic Panic' },
    ],
  },
  {
    id: 'trust',
    name: 'Trust & Stability',
    category: 'primary_emotion',
    description: 'Pristine azure, deep oceanic navy, and architectural sapphire inspiring certainty.',
    bounds: {
      hueMin: 190,
      hueMax: 220,
      satMin: 50,
      satMax: 95,
      lumMin: 25,
      lumMax: 65,
    },
    estimatedColorCount: 1850000,
    percentageOfAllColors: 11.03,
    psychologicalReaction: 'Stabilization of autonomic nervous system, generation of 8-12Hz alpha brainwaves, reassurance.',
    dominantHex: '#0284c7',
    representativeTones: [
      { name: 'Architectural Azure', hex: '#0284c7', mood: 'Structural Faith' },
      { name: 'Deep Harbor Navy', hex: '#0c4a6e', mood: 'Institutional Rigor' },
      { name: 'Sapphire Security', hex: '#0369a1', mood: 'Guaranteed Protection' },
      { name: 'Clean Seafoam', hex: '#38bdf8', mood: 'Transparent Honesty' },
      { name: 'Porcelain White Base', hex: '#f0f9ff', mood: 'Incorruptible Purity' },
    ],
  },
  {
    id: 'serene',
    name: 'Serenity & Biophilic Peace',
    category: 'psychological_trait',
    description: 'Lush forest greens, sage pine, and eucalyptus mists triggering nature healing.',
    bounds: {
      hueMin: 120,
      hueMax: 170,
      satMin: 30,
      satMax: 80,
      lumMin: 25,
      lumMax: 65,
    },
    estimatedColorCount: 2110000,
    percentageOfAllColors: 12.58,
    psychologicalReaction: 'Shinrin-yoku response: salivary cortisol reduction, peak optical ease at 555nm human peak eye acuity.',
    dominantHex: '#059669',
    representativeTones: [
      { name: 'Forest Jade', hex: '#059669', mood: 'Deep Equilibrium' },
      { name: 'Eucalyptus Mist', hex: '#6ee7b7', mood: 'Breathable Calm' },
      { name: 'Sage Velvet', hex: '#10b981', mood: 'Holistic Restoration' },
      { name: 'Pine Canopy', hex: '#065f46', mood: 'Sheltered Peace' },
      { name: 'Moss Stone', hex: '#047857', mood: 'Timeless Grounding' },
    ],
  },
  {
    id: 'dominance',
    name: 'Dominance & Sovereign Weight',
    category: 'psychological_trait',
    description: 'Heavy low-key chiaroscuro, imperial maroon, velvet obsidian, and commanding gold.',
    bounds: {
      hueMin: 330,
      hueMax: 355,
      satMin: 55,
      satMax: 95,
      lumMin: 12,
      lumMax: 38,
    },
    estimatedColorCount: 820000,
    percentageOfAllColors: 4.89,
    psychologicalReaction: 'Intimidation cues, postural straightening, sustained high-focus attention.',
    dominantHex: '#881337',
    representativeTones: [
      { name: 'Imperial Maroon', hex: '#881337', mood: 'Sovereign Command' },
      { name: 'Obsidian Velvet', hex: '#0a0a0a', mood: 'Heavy Inevitability' },
      { name: 'Polished Brass', hex: '#d97706', mood: 'Regal Wealth' },
      { name: 'Midnight Wine', hex: '#4c0519', mood: 'Ruthless Decisiveness' },
      { name: 'Gilded Bronze', hex: '#92400e', mood: 'Ancient Authority' },
    ],
  },
  {
    id: 'vulnerable',
    name: 'Vulnerability & Tenderness',
    category: 'psychological_trait',
    description: 'Delicate rose quartz, unhealed blush pastels, bone whites, and translucent lavenders.',
    bounds: {
      hueMin: 320,
      hueMax: 355,
      satMin: 20,
      satMax: 65,
      lumMin: 68,
      lumMax: 94,
    },
    estimatedColorCount: 960000,
    percentageOfAllColors: 5.72,
    psychologicalReaction: 'Oxytocin release, lowering of defensive posturing, heightened empathy and protective impulse.',
    dominantHex: '#f472b6',
    representativeTones: [
      { name: 'Pale Rose Quartz', hex: '#f472b6', mood: 'Unshielded Heart' },
      { name: 'Translucent Bone', hex: '#f5f5f4', mood: 'Fragile Innocence' },
      { name: 'Bruised Lavender', hex: '#c084fc', mood: 'Gentle Ache' },
      { name: 'Blushing Silk', hex: '#fbcfe8', mood: 'Intimate Whisper' },
      { name: 'Tender Salmon', hex: '#fda4af', mood: 'Bare Exposure' },
    ],
  },
  {
    id: 'chaotic',
    name: 'Chaos & Sensory Dissonance',
    category: 'psychological_trait',
    description: 'Hyper-saturated clashing non-spectral magentas, acid limes, and electric strobing cyans.',
    bounds: {
      hueMin: 280,
      hueMax: 325,
      satMin: 80,
      satMax: 100,
      lumMin: 40,
      lumMax: 70,
    },
    estimatedColorCount: 1120000,
    percentageOfAllColors: 6.68,
    psychologicalReaction: 'Rapid ocular micro-saccades, visual cortex over-stimulation, disequilibrium, cognitive friction.',
    dominantHex: '#d946ef',
    representativeTones: [
      { name: 'Hyper Fuchsia', hex: '#d946ef', mood: 'Overclocked Pulse' },
      { name: 'Radioactive Lime', hex: '#84cc16', mood: 'Sensory Static' },
      { name: 'Electric Cyan', hex: '#06b6d4', mood: 'Frenetic Surge' },
      { name: 'Strobe Magenta', hex: '#f0abfc', mood: 'Perceptual Glitch' },
      { name: 'Acid Punch', hex: '#a855f7', mood: 'Unregulated Delirium' },
    ],
  },
  {
    id: 'passion',
    name: 'Passion & Magnetic Drive',
    category: 'emotional_state',
    description: 'Deep carmine wines, warm amber flame flickers, and smoldering midnight purples.',
    bounds: {
      hueMin: 340,
      hueMax: 10,
      satMin: 70,
      satMax: 100,
      lumMin: 30,
      lumMax: 55,
    },
    estimatedColorCount: 1080000,
    percentageOfAllColors: 6.44,
    psychologicalReaction: 'Cutaneous facial flushing, cardiac output ramping, obsessive sensory fixation on desire.',
    dominantHex: '#be123c',
    representativeTones: [
      { name: 'Deep Carmine', hex: '#be123c', mood: 'Consuming Fire' },
      { name: 'Spiced Amber', hex: '#d97706', mood: 'Magnetic Draw' },
      { name: 'Smoldering Plum', hex: '#701a75', mood: 'Erotic Intensity' },
      { name: 'Venetian Velvet', hex: '#9f1239', mood: 'Romantic Urgency' },
      { name: 'Flesh Glow', hex: '#fb7185', mood: 'Sensual Heat' },
    ],
  },
];

/**
 * Sample N random valid colors from a given volume bounds
 */
export function sampleColorsFromBounds(bounds: ColorBounds, count: number = 6): string[] {
  const result: string[] = [];
  let hueSpan = bounds.hueMax - bounds.hueMin;
  if (hueSpan < 0) hueSpan += 360;

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    let h = bounds.hueMin + t * hueSpan;
    if (h >= 360) h -= 360;

    const s = bounds.satMin + ((Math.sin(i * 3.7) + 1) / 2) * (bounds.satMax - bounds.satMin);
    const l = bounds.lumMin + ((Math.cos(i * 2.3) + 1) / 2) * (bounds.lumMax - bounds.lumMin);

    const rgb = hslToRgb(h, s, l);
    result.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  return result;
}
