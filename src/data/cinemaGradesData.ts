/**
 * Professional Day & Night Cinematography Color Grading Recommendations & Presets
 * Formulated with exact DaVinci Resolve Lift/Gamma/Gain coordinates, Kelvin CCT, and color science rationale.
 */

import { CinemaGradeParams } from '../utils/cinematographyGradingMath';

export const DAY_CINEMA_GRADES: CinemaGradeParams[] = [
  {
    id: 'golden_hour_magic',
    name: 'Golden Hour (Magic Hour)',
    sceneType: 'day',
    timeframe: 'Sunrise / Sunset (Low Sun <10°)',
    kelvin: 3200,
    tint: 4,
    lift: { r: -0.15, g: 0.05, b: 0.22, lum: -4 }, // Complementary cyan-slate shadows
    gamma: { r: 0.28, g: 0.12, b: -0.18, lum: 5 }, // Radiant honey-copper midtones
    gain: { r: 0.35, g: 0.18, b: -0.22, lum: 12 }, // Gilded amber specular highlights
    offsetLum: 0,
    contrast: 1.18,
    saturation: 1.22,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#0a192f',
      midtones: '#c27835',
      highlights: '#fde047',
      accent: '#ff9f1c',
    },
    whyItWorks:
      'Low-angle solar rays traverse 10x the atmospheric path, filtering high-energy blue wavelengths via Rayleigh scattering. Contrasting warm golden-copper skin tones against cool cyan-slate shadows creates a natural complementary split that evokes nostalgia, romance, and dramatic beauty.',
    lightingRecipe: {
      key: 'Direct low-angle sun placed as 3/4 backlight or edge rim',
      fill: 'Unbleached muslin bounce or gold beadboard providing 1:4 fill',
      practicals: 'Warm window glows or fire accents',
      ratio: '1:4 to 1:6 Key-to-Fill for cinematic contouring',
    },
    resolveTip:
      'Set camera white balance to 5600K on set to bake in the golden warmth. In DaVinci Resolve, keep Lift gently pushed toward cyan (215°) to prevent dark shadows from feeling yellow and muddy.',
  },
  {
    id: 'high_noon_crisp',
    name: 'High Noon (Crisp Naturalist)',
    sceneType: 'day',
    timeframe: '11:00 AM – 2:00 PM (Direct Overhead Sun)',
    kelvin: 5600,
    tint: 0,
    lift: { r: -0.05, g: 0.0, b: 0.08, lum: -8 }, // Clean dark slate toe
    gamma: { r: 0.02, g: 0.01, b: -0.02, lum: -2 }, // Balanced natural skin
    gain: { r: 0.08, g: 0.04, b: -0.05, lum: 6 }, // Controlled specular sun roll-off
    offsetLum: 0,
    contrast: 1.25,
    saturation: 1.05,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#17202a',
      midtones: '#718096',
      highlights: '#fffdf5',
      accent: '#0284c7',
    },
    whyItWorks:
      'High noon presents extreme dynamic range (>14 stops). The grade uses a soft highlight knee curve to prevent harsh white clipping while cooling the shadows with subtle sky-bounce blue to replicate real outdoor eye adaptation.',
    lightingRecipe: {
      key: 'Overhead sun diffused through 8x8 or 12x12 1/2 Silent Grid scrim',
      fill: 'White foam core bounce below eyeline to lift harsh brow shadows',
      practicals: 'Natural horizon reflections',
      ratio: '1:3 Key-to-Fill with negative fill flags on sides for jawline shape',
    },
    resolveTip:
      'Use DaVinci Resolve HDR Highlight Roll-off (Soft Clip at 92 IRE). Never clip red/green specular highlights to pure white; retain a faint warm ivory glow.',
  },
  {
    id: 'overcast_nordic',
    name: 'Overcast & Fog (Nordic Mood)',
    sceneType: 'day',
    timeframe: 'Heavy Cloud Cover / Marine Fog',
    kelvin: 6500,
    tint: -4,
    lift: { r: -0.08, g: 0.02, b: 0.05, lum: 4 }, // Lifted velvety charcoal matte
    gamma: { r: -0.05, g: 0.04, b: 0.02, lum: 0 }, // Desaturated muted slate-moss
    gain: { r: -0.06, g: -0.02, b: 0.12, lum: -4 }, // Diffused silvery cloud canopy
    offsetLum: -2,
    contrast: 1.08,
    saturation: 0.82,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#1a232a',
      midtones: '#475569',
      highlights: '#cbd5e1',
      accent: '#38bdf8',
    },
    whyItWorks:
      'The cloud canopy operates as an infinite softbox. By desaturating the palette by ~18% and lifting the black toe slightly into a filmic matte, human faces and architecture gain serious dramatic weight, melancholy, and realism.',
    lightingRecipe: {
      key: 'Natural top daylight sculpted with 12x12 Solid Black Floppies for negative fill',
      fill: 'Diffused ambient sky',
      practicals: 'Soft interior practical lamps (2800K) for high-contrast eye catchlights',
      ratio: '1:1.5; contrast must be sculpted by removing light (negative fill)',
    },
    resolveTip:
      'Apply a gentle S-Curve with lifted black point (0 -> 12 IRE) on Node 02. In Hue vs Sat, pull green and yellow down by 25% to eliminate distracting bright lawn grass.',
  },
  {
    id: 'desert_bleached',
    name: 'Sun-Bleached Desert (Western Grit)',
    sceneType: 'day',
    timeframe: 'Arid Midday / Canyon Expanse',
    kelvin: 4600,
    tint: 8,
    lift: { r: 0.15, g: -0.05, b: -0.15, lum: -10 }, // Crushed terracotta rust shadows
    gamma: { r: 0.18, g: 0.08, b: -0.16, lum: 3 }, // Weathered sand & baked earth
    gain: { r: 0.22, g: 0.14, b: -0.18, lum: 14 }, // Searing bleached horizon
    offsetLum: 2,
    contrast: 1.35,
    saturation: 1.15,
    skinToneProtection: false,
    recommendedHexes: {
      shadows: '#2a1208',
      midtones: '#a26738',
      highlights: '#fef08a',
      accent: '#ea580c',
    },
    whyItWorks:
      'Instills a visceral psychological feeling of searing dry heat. Crushing the deepest shadows while washing midtones with warm amber-terracotta mimics physiological dazzle and heat exhaustion.',
    lightingRecipe: {
      key: 'Harsh side-angled daylight without diffusion',
      fill: 'Hard silver bounce reflector',
      practicals: 'Heat shimmers & dust particles in air',
      ratio: '1:6 hard directional contrast',
    },
    resolveTip:
      'In Color Warper or Hue vs Lum, drop Blue luminance by 40% to make the sky a deep cobalt-tan while letting sandstone rock faces sear with luminous clarity.',
  },
  {
    id: 'day_interior_window',
    name: 'Day Interior (Window Chiaroscuro)',
    sceneType: 'day',
    timeframe: 'Interior Room with North Window Light',
    kelvin: 5200,
    tint: 2,
    lift: { r: -0.12, g: -0.04, b: 0.14, lum: -12 }, // Deep room shadows
    gamma: { r: 0.08, g: 0.04, b: -0.06, lum: -2 }, // Soft ambient falloff
    gain: { r: 0.18, g: 0.12, b: -0.08, lum: 10 }, // Soft window wrap highlight
    offsetLum: -4,
    contrast: 1.28,
    saturation: 1.08,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#0b111e',
      midtones: '#57534e',
      highlights: '#fffbeb',
      accent: '#f59e0b',
    },
    whyItWorks:
      'Creates rich painterly depth inspired by Dutch masters like Vermeer. The bright window key creates a luminous contour on the subject while the room interior falls gracefully into velvety dark silence.',
    lightingRecipe: {
      key: 'Large aperture window diffused with 1/2 Grid Cloth or sheer white curtain',
      fill: 'Negative fill solid black floppy right next to off-camera cheek',
      practicals: 'Tungsten desk lamp 2700K in deep background for depth',
      ratio: '1:8 high dramatic contrast',
    },
    resolveTip:
      'Use a soft elliptical Power Window centered on the subject with feather 75. Pull down background exposure outside the window by -0.8 EV to keep viewer focus locked on the subject.',
  },
];

export const NIGHT_CINEMA_GRADES: CinemaGradeParams[] = [
  {
    id: 'moonlit_day_for_night',
    name: 'Moonlit Night (Atmospheric Blue)',
    sceneType: 'night',
    timeframe: 'Midnight / Moonlit Exterior',
    kelvin: 8500,
    tint: -8,
    lift: { r: -0.22, g: 0.02, b: 0.35, lum: 4 }, // Prussian royal blue lifted toe
    gamma: { r: -0.16, g: -0.02, b: 0.24, lum: -6 }, // Cobalt scotopic midtones
    gain: { r: -0.12, g: 0.04, b: 0.28, lum: -8 }, // Silvery specular moonlight rim
    offsetLum: -14,
    contrast: 1.15,
    saturation: 0.72,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#081226',
      midtones: '#1e3a5f',
      highlights: '#93c5fd',
      accent: '#67e8f9',
    },
    whyItWorks:
      'Human scotopic vision in moonlight relies on rod photoreceptors (the Purkinje effect), perceiving low-light environments as monochromatic blue-cyan. True black night looks flat and dead on screen; colorists lift the shadow floor with deep Prussian indigo so silhouettes and textures remain visible.',
    lightingRecipe: {
      key: 'Hard high 3/4 backlight (HMI or Daylight LED at 6000K) simulating moon edge',
      fill: 'Ultra-soft low-intensity cyan ambient fill bounced into large muslin',
      practicals: 'Warm cabin window or flashlight beam (3000K) for dramatic opponent contrast',
      ratio: '1:8 or 1:12 extreme backlight-to-ambient ratio',
    },
    resolveTip:
      'Never crush night blacks to absolute zero. Lift the Lift Master wheel by +0.03 and inject Hue 225° (Blue-Cyan). Desaturate global Saturation to 72% to simulate human night vision.',
  },
  {
    id: 'neon_noir_cyberpunk',
    name: 'Neon Noir (Cyberpunk City)',
    sceneType: 'night',
    timeframe: 'Rain-Slicked Midnight Streets',
    kelvin: 4200,
    tint: 18,
    lift: { r: -0.25, g: 0.06, b: 0.28, lum: -14 }, // Obsidian shadows with teal base
    gamma: { r: -0.12, g: 0.18, b: 0.15, lum: -2 }, // Vibrant electric teal rain reflections
    gain: { r: 0.38, g: -0.15, b: 0.22, lum: 16 }, // Searing hot magenta/pink neon glow
    offsetLum: -6,
    contrast: 1.45,
    saturation: 1.35,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#05070e',
      midtones: '#00f0ff',
      highlights: '#ff007f',
      accent: '#ffd700',
    },
    whyItWorks:
      'The modern cinema staple popularized by Blade Runner 2049 and John Wick. Pitch-black wet pavements reflect dual saturated complimentary vectors: hot magenta/crimson neon against electric cyan/teal fog.',
    lightingRecipe: {
      key: 'Color-tunable RGB tube lights (Astera Titan) hidden behind practical architectural pillars',
      fill: 'Reflections from wet asphalt wet-down by water truck',
      practicals: 'Exposed neon signage, holographic displays, taillights',
      ratio: '1:10 extreme contrast with razor-sharp neon edges',
    },
    resolveTip:
      'Always qualify human skin tones on an isolated parallel node! Lock the skin tone vector on the 135° I-Line so the actor’s face does not turn toxic neon magenta or zombie teal.',
  },
  {
    id: 'candlelight_chamber',
    name: 'Candlelight & Hearth (Warm Intimacy)',
    sceneType: 'night',
    timeframe: 'Interior Darkened Chamber / Firelight',
    kelvin: 2200,
    tint: 12,
    lift: { r: 0.14, g: -0.04, b: -0.18, lum: -18 }, // Deep espresso velvet dark
    gamma: { r: 0.32, g: 0.12, b: -0.24, lum: 2 }, // Rich honey-amber skin & timber
    gain: { r: 0.42, g: 0.24, b: -0.32, lum: 14 }, // Luminous incandescent flame core
    offsetLum: -8,
    contrast: 1.32,
    saturation: 1.18,
    skinToneProtection: false,
    recommendedHexes: {
      shadows: '#140804',
      midtones: '#a14c12',
      highlights: '#fed766',
      accent: '#ea580c',
    },
    whyItWorks:
      'Emulates the historic masterpiece Barry Lyndon. Thermal blackbody radiation at 2000K emits purely in red and amber wavelengths. The deep room shadows absorb all light while human skin glows with hypnotic, golden life.',
    lightingRecipe: {
      key: 'Real multi-wick candles augmented by dim flicker-generator LED bulbs wrapped in unbleached muslin',
      fill: 'Zero fill; allow shadows to wrap completely around the face',
      practicals: 'Candelabras & open fireplaces in shot',
      ratio: '1:16 or deeper chiaroscuro',
    },
    resolveTip:
      'In DaVinci Resolve Primary Wheels, pull Gain and Gamma heavily toward Orange-Red (Hue 35°). Soften the black floor so shadow falloff feels like soft velvet rather than digital noise.',
  },
  {
    id: 'sodium_vapor_street',
    name: 'Sodium Vapor (Gritty Urban Noir)',
    sceneType: 'night',
    timeframe: 'Industrial Alley / City Streetlights',
    kelvin: 3400,
    tint: -12,
    lift: { r: -0.15, g: 0.05, b: 0.18, lum: -10 }, // Cold industrial cyan-charcoal
    gamma: { r: 0.22, g: 0.08, b: -0.15, lum: -4 }, // Nostalgic amber-orange street light
    gain: { r: 0.28, g: 0.18, b: -0.12, lum: 8 }, // High-pressure sodium lamp flare
    offsetLum: -6,
    contrast: 1.38,
    saturation: 1.12,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#08171e',
      midtones: '#d97706',
      highlights: '#fef08a',
      accent: '#06b6d4',
    },
    whyItWorks:
      'High-pressure sodium street lamps produce a distinct 2100K-2800K yellow-orange monochromatic cast. By grading shadows with a cool teal offset, you achieve David Fincher-style gritty psychological tension (*Zodiac*, *Se7en*).',
    lightingRecipe: {
      key: 'Overhead amber sodium vapor lamp or bi-color LED gelled with Full CTO + 1/4 Plus Green',
      fill: 'Deep shadow negative fill with black floppies',
      practicals: 'Flickering sodium tubes, halogen car headlights',
      ratio: '1:8 street contrast',
    },
    resolveTip:
      'Use Hue vs Saturation curve to pin the amber sodium wavelength while keeping background street trees desaturated so yellow vegetation does not compete with skin tones.',
  },
  {
    id: 'midnight_forest_mist',
    name: 'Midnight Forest & Mist (Eerie Twilight)',
    sceneType: 'night',
    timeframe: 'Remote Wilderness Night & Fog',
    kelvin: 7600,
    tint: -14,
    lift: { r: -0.18, g: 0.08, b: 0.16, lum: 2 }, // Deep spruce green-black
    gamma: { r: -0.12, g: 0.12, b: 0.08, lum: -8 }, // Misty teal-slate canopy
    gain: { r: -0.05, g: 0.15, b: 0.22, lum: -6 }, // Silvery starlight fog diffusion
    offsetLum: -16,
    contrast: 1.12,
    saturation: 0.78,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#051610',
      midtones: '#13352c',
      highlights: '#99f6e4',
      accent: '#2dd4bf',
    },
    whyItWorks:
      'Conveys supernatural dread, wilderness solitude, and eerie quiet. Blending cold cyan with an earthy spruce-green undertone creates visceral tension while misty fog breaks specular edges.',
    lightingRecipe: {
      key: 'Massive diffused overhead condor crane with high-output daylight LED arrays (Arri Skypanel 360)',
      fill: 'Atmospheric water-based hazer filling tree canopy',
      practicals: 'Campfire or lantern providing solitary warm eye focus',
      ratio: '1:10 cold ambient wrap',
    },
    resolveTip:
      'Lift shadows slightly (+0.02) to retain silhouette tree branches against fog. Pull Tint slightly toward Green (-14) to emulate atmospheric mineral haze.',
  },
];

export const FILM_STOCK_GRADES: CinemaGradeParams[] = [
  {
    id: 'kodak_vision_2383',
    name: 'Kodak 2383 Print Film',
    sceneType: 'film_stock',
    timeframe: 'Hollywood 35mm Feature Standard',
    kelvin: 5200,
    tint: 2,
    lift: { r: -0.18, g: -0.02, b: 0.22, lum: -6 }, // Subtractive cyan-blue shadow density
    gamma: { r: 0.14, g: 0.06, b: -0.12, lum: 2 }, // Rich warm skin tone preservation
    gain: { r: 0.16, g: 0.10, b: -0.08, lum: 8 }, // Creamy rolled-off highlight shoulder
    offsetLum: 0,
    contrast: 1.28,
    saturation: 1.15,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#0e1d2c',
      midtones: '#b87333',
      highlights: '#fff3d6',
      accent: '#0284c7',
    },
    whyItWorks:
      'The legendary film print stock used on thousands of Hollywood films. It features thick subtractive color density in shadows, creamy golden highlight roll-off, and glowing skin tone halation.',
    lightingRecipe: {
      key: 'Large soft sources (12x12 Chimera or Ultra-Bounce)',
      fill: 'Gentle ambient wrap with 1:3 ratio',
      practicals: 'Tungsten lamps with real glass lenses',
      ratio: '1:3 to 1:4 filmic ratio',
    },
    resolveTip:
      'In DaVinci Resolve, apply the Kodak 2383 D55/D60 LUT as your last node, and grade underneath it in DaVinci Wide Gamut / Intermediate color space.',
  },
  {
    id: 'fujifilm_eterna',
    name: 'Fujifilm Eterna 8543',
    sceneType: 'film_stock',
    timeframe: 'Art-House & Intimate Drama',
    kelvin: 5800,
    tint: -3,
    lift: { r: -0.08, g: 0.04, b: 0.10, lum: 2 }, // Gentle muted green-slate toe
    gamma: { r: 0.02, g: 0.02, b: -0.04, lum: -2 }, // Soft pastel midtones
    gain: { r: -0.04, g: 0.02, b: 0.06, lum: 4 }, // Silvery gentle highlight compression
    offsetLum: 0,
    contrast: 1.12,
    saturation: 0.88,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#182424',
      midtones: '#64748b',
      highlights: '#e2e8f0',
      accent: '#34d399',
    },
    whyItWorks:
      'Celebrated for its soft pastel palette, gentle contrast knee, and organic earth tones. Unlike Kodak which pushes punchy contrast, Fuji Eterna delivers subtle poetry and flattering skin tones.',
    lightingRecipe: {
      key: 'Diffused window light or soft book lights',
      fill: 'High fill ratio (1:2) to preserve shadow detail',
      practicals: 'Muted architectural lighting',
      ratio: '1:2 soft low-contrast lighting',
    },
    resolveTip:
      'Reduce global saturation to 88% and gently roll off highlight saturation. Excellent for intimate character studies, European cinema, and period drama.',
  },
  {
    id: 'bleach_bypass_silver',
    name: 'Silver Bleach Bypass (ENR Process)',
    sceneType: 'film_stock',
    timeframe: 'Gritty War & Dystopian Thriller',
    kelvin: 5600,
    tint: -6,
    lift: { r: -0.05, g: 0.0, b: 0.05, lum: -16 }, // Deep crushed obsidian blacks
    gamma: { r: -0.08, g: 0.02, b: 0.04, lum: -8 }, // Desaturated metallic midtones
    gain: { r: 0.08, g: 0.06, b: 0.02, lum: 16 }, // Searing silvery highlight bite
    offsetLum: 0,
    contrast: 1.55,
    saturation: 0.65,
    skinToneProtection: false,
    recommendedHexes: {
      shadows: '#08090b',
      midtones: '#3f4752',
      highlights: '#f1f5f9',
      accent: '#94a3b8',
    },
    whyItWorks:
      'Skipping the bleach bath during photochemical development leaves metallic silver emulsion in the film. The result is brutal contrast, crushed blacks, extreme grain texture, and desaturated, visceral grit (*Saving Private Ryan*, *Se7en*).',
    lightingRecipe: {
      key: 'Hard directional side lighting',
      fill: 'No fill or heavy negative fill',
      practicals: 'Industrial bare bulbs',
      ratio: '1:10 harsh contrast',
    },
    resolveTip:
      'In DaVinci Resolve: Duplicate your image node in parallel, set Composite Mode to Overlay or Soft Light, desaturate to black & white, and blend at 50% opacity.',
  },
];

export const ALL_RECOMMENDED_GRADES = [
  ...DAY_CINEMA_GRADES,
  ...NIGHT_CINEMA_GRADES,
  ...FILM_STOCK_GRADES,
];
