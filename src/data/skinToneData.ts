/**
 * Natural Human Skin Tones & Vectorscope Standards Dataset
 */

import { RGB } from '../utils/colorMath';

export interface SkinEthnicityPreset {
  id: string;
  name: string;
  region: string;
  fitzpatrickScale: string;
  representativeHex: string;
  representativeRgb: RGB;
  targetIreRange: string;
  vectorscopeAngle: number; // always near 135°
  saturationRange: string;
  melaninCharacteristics: string;
  lightingConsiderations: string;
  colorGradingTip: string;
  sampleCluster: RGB[]; // Realistic pixel cluster for vectorscope scatter
}

export const SKIN_ETHNICITY_PRESETS: SkinEthnicityPreset[] = [
  {
    id: 'caucasian_fair',
    name: 'Light / Fair Complexion',
    region: 'Northern & Eastern European, Celtic, Nordic heritage',
    fitzpatrickScale: 'Type I – II',
    representativeHex: '#F6D2BA',
    representativeRgb: { r: 246, g: 210, b: 186 },
    targetIreRange: '60 – 70 IRE (Highlights peak at 75-80 IRE)',
    vectorscopeAngle: 135.2,
    saturationRange: '20% – 35% Saturation',
    melaninCharacteristics: 'Low eumelanin density with high sub-dermal capillary visibility (pheomelanin). Flushes easily with emotional arousal or exertion into pinkish-red.',
    lightingConsiderations: 'Highly prone to blowing out specular highlights on forehead, bridge of nose, and cheekbones. Requires soft diffusion and careful highlight compression curves.',
    colorGradingTip: 'Keep exposure between 60-70 IRE. Watch out for excess magenta around the nose and ears; use gentle Hue vs Hue to anchor on the 135° line without draining healthy blood flow.',
    sampleCluster: [
      { r: 250, g: 215, b: 190 },
      { r: 246, g: 210, b: 186 },
      { r: 238, g: 200, b: 175 },
      { r: 228, g: 190, b: 165 },
      { r: 218, g: 178, b: 155 },
      { r: 242, g: 205, b: 180 },
      { r: 235, g: 195, b: 170 },
      { r: 225, g: 185, b: 160 },
      { r: 215, g: 175, b: 150 },
      { r: 205, g: 165, b: 140 },
    ],
  },
  {
    id: 'east_asian',
    name: 'Medium-Light / East Asian',
    region: 'Chinese, Japanese, Korean, Mongolian heritage',
    fitzpatrickScale: 'Type III',
    representativeHex: '#E8BE9A',
    representativeRgb: { r: 232, g: 190, b: 154 },
    targetIreRange: '52 – 62 IRE (Highlights peak at 70-75 IRE)',
    vectorscopeAngle: 136.0,
    saturationRange: '25% – 38% Saturation',
    melaninCharacteristics: 'Balanced eumelanin with golden carotene undertones. Smooth micro-surface texture with low facial erythema (blushing) compared to Type I-II.',
    lightingConsiderations: 'Reflects soft ambient lighting beautifully. Under fluorescent or budget LED lights, can pick up an unflattering sickly olive cast that must be countered with +Tint.',
    colorGradingTip: 'Maintain warm golden undertones without letting the vectorscope drift above 140° (into yellow-green jaundiced territory). A small bump in Orange Luminance (+6) creates a porcelain glow.',
    sampleCluster: [
      { r: 238, g: 198, b: 162 },
      { r: 232, g: 190, b: 154 },
      { r: 225, g: 182, b: 146 },
      { r: 218, g: 174, b: 138 },
      { r: 208, g: 164, b: 128 },
      { r: 235, g: 192, b: 156 },
      { r: 222, g: 180, b: 144 },
      { r: 214, g: 170, b: 135 },
      { r: 200, g: 158, b: 124 },
      { r: 190, g: 148, b: 115 },
    ],
  },
  {
    id: 'south_asian',
    name: 'Olive & Warm Bronze / South Asian',
    region: 'Indian, Pakistani, Bangladeshi, Sri Lankan, Nepali heritage',
    fitzpatrickScale: 'Type IV – V',
    representativeHex: '#BA875D',
    representativeRgb: { r: 186, g: 135, b: 93 },
    targetIreRange: '38 – 50 IRE (Highlights peak at 60-68 IRE)',
    vectorscopeAngle: 134.8,
    saturationRange: '30% – 45% Saturation',
    melaninCharacteristics: 'Rich eumelanin density with warm ochre and terracotta undertones. Natural sun protection gives deep, complex layered chroma.',
    lightingConsiderations: 'Skin absorbs more light than fair tones; needs sufficient key light quantity (higher lumens) or larger source area to reveal micro-specular highlights along cheekbones.',
    colorGradingTip: 'Do not over-brighten into an unnatural chalky 70 IRE. Respect the natural 40-50 IRE luminance while boosting Color Boost (+5 to +10) and subtle warm Red Primary Calibration for rich golden depth.',
    sampleCluster: [
      { r: 200, g: 148, b: 104 },
      { r: 186, g: 135, b: 93 },
      { r: 175, g: 124, b: 83 },
      { r: 162, g: 112, b: 72 },
      { r: 148, g: 100, b: 62 },
      { r: 192, g: 140, b: 98 },
      { r: 180, g: 130, b: 88 },
      { r: 168, g: 118, b: 78 },
      { r: 155, g: 106, b: 68 },
      { r: 140, g: 94, b: 58 },
    ],
  },
  {
    id: 'middle_eastern',
    name: 'Amber & Olive / Middle Eastern',
    region: 'Levantine, Persian, Arabian Gulf, North African heritage',
    fitzpatrickScale: 'Type III – IV',
    representativeHex: '#C99469',
    representativeRgb: { r: 201, g: 148, b: 105 },
    targetIreRange: '44 – 54 IRE (Highlights peak at 68-72 IRE)',
    vectorscopeAngle: 135.5,
    saturationRange: '28% – 42% Saturation',
    melaninCharacteristics: 'Rich olive-to-amber tones with natural golden undertones and prominent bone structure definition.',
    lightingConsiderations: 'Responds magnificently to warm golden hour side-light (3200K) and warm tungsten bounce. Shadows retain healthy warm-brown chroma rather than falling into sterile gray.',
    colorGradingTip: 'Preserve the distinctive olive-warm balance. When using teal shadows, be careful not to contaminate the transition zones (midtone falloff) with murky cyan.',
    sampleCluster: [
      { r: 215, g: 160, b: 116 },
      { r: 201, g: 148, b: 105 },
      { r: 190, g: 137, b: 95 },
      { r: 178, g: 126, b: 85 },
      { r: 165, g: 114, b: 75 },
      { r: 208, g: 154, b: 110 },
      { r: 195, g: 142, b: 100 },
      { r: 184, g: 131, b: 90 },
      { r: 172, g: 120, b: 80 },
      { r: 158, g: 108, b: 70 },
    ],
  },
  {
    id: 'latinx_hispanic',
    name: 'Golden Caramel / Latinx & Caribbean',
    region: 'Mestizo, Hispanic, Caribbean, Indigenous American ancestry',
    fitzpatrickScale: 'Type IV',
    representativeHex: '#B87B52',
    representativeRgb: { r: 184, g: 123, b: 82 },
    targetIreRange: '42 – 52 IRE (Highlights peak at 65-70 IRE)',
    vectorscopeAngle: 135.0,
    saturationRange: '32% – 46% Saturation',
    melaninCharacteristics: 'Vibrant caramel-bronze tones with deep warm undertones. Excellent balance of red hemoglobin vitality and golden melanin depth.',
    lightingConsiderations: 'Benefits from wrap-around soft lighting with a warm kicker light to separate hair and shoulders from dark cinematic backgrounds.',
    colorGradingTip: 'Keep the vectorscope scatter line tight against 135°. If shadows get too cold, add a gentle +5 Warm Balance to the Midtone grading wheel in DaVinci Resolve.',
    sampleCluster: [
      { r: 202, g: 138, b: 94 },
      { r: 184, g: 123, b: 82 },
      { r: 172, g: 112, b: 72 },
      { r: 158, g: 100, b: 62 },
      { r: 145, g: 89, b: 53 },
      { r: 192, g: 130, b: 88 },
      { r: 178, g: 118, b: 77 },
      { r: 165, g: 106, b: 67 },
      { r: 152, g: 95, b: 58 },
      { r: 138, g: 84, b: 49 },
    ],
  },
  {
    id: 'african_deep',
    name: 'Rich Dark / African Melanin',
    region: 'Sub-Saharan African, Afro-Caribbean, African-American heritage',
    fitzpatrickScale: 'Type V – VI',
    representativeHex: '#6A432D',
    representativeRgb: { r: 106, g: 67, b: 45 },
    targetIreRange: '20 – 35 IRE (Highlights peak at 50-60 IRE)',
    vectorscopeAngle: 134.6,
    saturationRange: '35% – 55% Saturation',
    melaninCharacteristics: 'Dense eumelanin pigment producing velvety chocolate, deep espresso, and mahogany hues with glorious high-frequency specular sheen.',
    lightingConsiderations: 'DO NOT over-expose to compensate for darkness. The magic of dark skin is rendered through LARGE, SOFT polarized reflections (skylights, giant 12x12 silks, moisturizer sheen) which create gorgeous silver-gold specular highlights.',
    colorGradingTip: 'Preserve deep rich black levels (avoid lifting blacks into milky gray). Use Midtone Detail (+15) and Highlight Soft Clip in DaVinci Resolve to celebrate the specular highlights while keeping the core at 25-35 IRE.',
    sampleCluster: [
      { r: 128, g: 84, b: 58 },
      { r: 116, g: 74, b: 50 },
      { r: 106, g: 67, b: 45 },
      { r: 94, g: 58, b: 38 },
      { r: 82, g: 50, b: 32 },
      { r: 122, g: 79, b: 54 },
      { r: 110, g: 70, b: 47 },
      { r: 100, g: 62, b: 41 },
      { r: 88, g: 54, b: 35 },
      { r: 75, g: 45, b: 28 },
    ],
  },
];

export const SKIN_LINE_STANDARDS = {
  appDefaultDeg: 135,
  broadcastILineDeg: 123,
  toleranceDeg: 8,
  rec709BarsPercent: 75,
};

export const VECTORSCOPE_TARGETS = {
  R: 104,
  Mg: 61,
  B: 347,
  Cy: 284,
  G: 241,
  Yl: 167,
};

export interface SkinGradingRule {
  number: number;
  title: string;
  rule: string;
  whyItMatters: string;
  resolveAction: string;
}

export const SKIN_GRADING_RULES: SkinGradingRule[] = [
  {
    number: 1,
    title: 'The Invariant Vectorscope Skin Line',
    rule: 'All human skin tones—regardless of race, ethnicity, or melanin depth—fall along the exact same angle on the vectorscope (~123° Broadcast / 135° Wheel).',
    whyItMatters: 'Human skin pigmentation varies by melanin density and hemoglobin flush, but the hue angle remains virtually identical because human blood and melanin share identical chemical absorption wavelengths.',
    resolveAction: 'Isolate skin with the Qualifier pipette. Check vectorscope graticule; rotate Hue vs Hue until the scatter trace aligns squarely within the ±8° tolerance band along the I-Line.',
  },
  {
    number: 2,
    title: 'Respect Melanin Luminance Levels (Do Not Over-Expose)',
    rule: 'Do not attempt to push deep skin tones (Types V-VI) up to fair skin luminance (60-70 IRE). Fair skin sits at 55-70 IRE; olive at 40-55 IRE; deep African skin at 20-35 IRE.',
    whyItMatters: 'Artificially brightening deep skin destroys contrast, turns rich espresso into pasty chalky gray, and induces noise artifacts.',
    resolveAction: 'Set base exposure to honor the natural IRE tier. Sculpt with broad soft specular key reflections rather than boosting master gain.',
  },
  {
    number: 3,
    title: 'Specular Sheen Defines Dark Skin',
    rule: 'Dark skin is sculpted primarily by polarized specular reflections (the sheen of skin oils, moisturizer, and large light sources), not diffuse reflection.',
    whyItMatters: 'High melanin absorbs diffuse light. A large 12x12 diffusion frame or soft skylight will create breathtaking silver-gold cheekbone highlights that define facial anatomy.',
    resolveAction: 'In Resolve, use Highlight Soft Clip and subtle Midtone Detail (+10 to +15) on a parallel node to enhance specular texture without blowing out.',
  },
  {
    number: 4,
    title: 'Protect Midtone Falloff from Cyan Contamination',
    rule: 'In teal-and-orange grades, cold shadows often bleed into the skin edge/terminator (the shadow transition on the neck and cheek).',
    whyItMatters: 'Cyan in shadow falloff makes actors look zombie-like, hypothermic, or poisoned.',
    resolveAction: 'In the Lift wheel or Hue vs Sat curve, desaturate cyan/green shadows below 20 IRE, or use an inverted 3D Qualifier to mask skin out of the cool shadow node.',
  },
  {
    number: 5,
    title: 'Targeted Hue vs Hue Over Global Temperature Shifts',
    rule: 'Never try to fix an actor’s sickly skin tone using the master White Balance / Tint controls if the background is already correctly balanced.',
    whyItMatters: 'Master temperature/tint alters the entire frame, shifting whites, skies, and shadows simultaneously.',
    resolveAction: 'Use the Hue vs Hue curve in Resolve. Sample the yellowish skin tone (around 50°) and nudge it toward red (around 35°) to restore natural blood warmth without touching walls or clothing.',
  },
  {
    number: 6,
    title: 'Preserve Sub-Surface Scattering & Micro-Flushes',
    rule: 'Ears, fingertips, nostrils, and lips have thinner epidermal layers with concentrated capillary networks that naturally glow with more red/magenta than foreheads or cheeks.',
    whyItMatters: 'Aggressive skin smoothing or uniform color qualification flattens faces into plastic mannequins.',
    resolveAction: 'Keep qualification soft (High Softness 15-25 on the qualifier). Avoid harsh masks that strip ear glow.',
  },
  {
    number: 7,
    title: 'Grade Skin on a Parallel or Upstream Protected Node',
    rule: 'Always isolate and correct skin either upstream of your creative LUT/look or on a dedicated parallel node that preserves skin fidelity.',
    whyItMatters: 'Heavy creative looks (bleach bypass, matrix green, cross-process) destroy human skin plausibility unless skin is protected on a parallel branch.',
    resolveAction: 'Build a Parallel Node Mixer in Resolve: Branch A handles background/environment creative look; Branch B qualifies skin and blends it back with Key Output Gain ~0.7-0.85.',
  },
];

