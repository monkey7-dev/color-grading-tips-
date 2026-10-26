/**
 * Data for Color Harmonies Engine, geometry, emotional effects, 60-30-10 recipes, and cinematic case studies
 */

import { HarmonyType } from '../utils/colorMath';

export interface HarmonyInfo {
  type: HarmonyType;
  title: string;
  tagline: string;
  geometryDescription: string;
  emotionalEffect: string;
  distributionRecipe: {
    keyPercent: number;
    keyRole: string;
    secondaryPercent: number;
    secondaryRole: string;
    accentPercent: number;
    accentRole: string;
    guide: string;
  };
  caseStudies: {
    film: string;
    director: string;
    cinematographer: string;
    year: number;
    paletteNotes: string;
    imageUrl?: string;
  }[];
  defaultHue: number;
}

export const HARMONIES_CATALOG: Record<HarmonyType, HarmonyInfo> = {
  monochromatic: {
    type: 'monochromatic',
    title: 'Monochromatic Harmony',
    tagline: 'Single hue variations across value, saturation, and luminance.',
    geometryDescription: 'Points aligned along the exact same radial spoke (0° angle separation), shifting strictly in saturation radius and lightness core.',
    emotionalEffect: 'Creates supreme tonal unity, claustrophobic psychological focus, deep immersion, and atmospheric purity. Without competing hues, value and texture command all visual hierarchy.',
    distributionRecipe: {
      keyPercent: 60,
      keyRole: 'Midtone Environment / Dominant Tone (Low/Medium Saturation)',
      secondaryPercent: 30,
      secondaryRole: 'Deep Shadows / Structural Silhouettes (Dark Value)',
      accentPercent: 10,
      accentRole: 'High-Luminance Specular Peak or Pure Saturation Glow',
      guide: 'Use 60% base wash for atmosphere, 30% shadow anchoring to prevent washed-out frames, and 10% luminous highlight.',
    },
    caseStudies: [
      {
        film: 'The Matrix',
        director: 'The Wachowskis',
        cinematographer: 'Bill Pope',
        year: 1999,
        paletteNotes: 'A pervasive monochromatic digital green tint was baked into every shadow, midtone, and highlight inside the simulated Matrix to create an uneasy, unnatural digital cage.',
      },
      {
        film: 'The Grand Budapest Hotel',
        director: 'Wes Anderson',
        cinematographer: 'Robert Yeoman',
        year: 2014,
        paletteNotes: 'Meticulous pastel pink and dusty rose monochromatic spaces inside the pastry shop and hotel lobby symbolize romanticized, preserved memory.',
      },
    ],
    defaultHue: 145, // Matrix Green
  },
  complementary: {
    type: 'complementary',
    title: 'Complementary Harmony',
    tagline: 'Opposing poles of the color wheel with maximum optical tension.',
    geometryDescription: 'Two colors situated directly opposite each other on the color circle at a 180° diameter chord.',
    emotionalEffect: 'Generates maximum simultaneous chromatic contrast, dynamic friction, and kinetic visual energy. When placed adjacent, complementary hues amplify each other’s perceived saturation; when mixed, they cancel into neutral gray.',
    distributionRecipe: {
      keyPercent: 60,
      keyRole: 'Dominant Background / Ambient Fill (Usually Cool: Teal, Cobalt, or Slate)',
      secondaryPercent: 30,
      secondaryRole: 'Key Subject & Flesh Tones (Warm: Amber, Orange, Terracotta)',
      accentPercent: 10,
      accentRole: 'High-Impact Specular Flare or Neon Signage',
      guide: 'Never balance complementary colors 50/50—that creates visual vibration and eye strain. Always let one color dominate (60%) while the other acts as the counterweight (30-40%).',
    },
    caseStudies: [
      {
        film: 'Blade Runner 2049',
        director: 'Denis Villeneuve',
        cinematographer: 'Roger Deakins',
        year: 2017,
        paletteNotes: 'The legendary clash between suffocating cyan rainy cityscapes and blistering irradiated orange radioactive dust storms of Las Vegas.',
      },
      {
        film: 'Amélie',
        director: 'Jean-Pierre Jeunet',
        cinematographer: 'Bruno Delbonnel',
        year: 2001,
        paletteNotes: 'Iconic saturated red-and-green complementary palette inspired by painter Juarez Machado, framing Parisian quirkiness with fairy-tale whimsy.',
      },
      {
        film: 'Mad Max: Fury Road',
        director: 'George Miller',
        cinematographer: 'John Seale',
        year: 2015,
        paletteNotes: 'Day-for-night cobalt blue shadows juxtaposed against blinding yellow-orange desert firestorms at 200% hyper-saturation.',
      },
    ],
    defaultHue: 28, // Warm Orange (opposing Teal 208°)
  },
  triadic: {
    type: 'triadic',
    title: 'Triadic Harmony',
    tagline: 'Equilateral chromatic triangle delivering vibrant, balanced diversity.',
    geometryDescription: 'Three colors spaced equidistant at 120° intervals around the 360° color wheel.',
    emotionalEffect: 'Creates a rich, buoyant, lively visual universe that feels full and balanced without the harsh confrontational tension of strict complementary opposites. Highly favored in comic adaptations and heroic cinema.',
    distributionRecipe: {
      keyPercent: 60,
      keyRole: 'Primary Ground / World Foundation (e.g. Cerulean Blue sky/walls)',
      secondaryPercent: 30,
      secondaryRole: 'Costuming & Key Set Architecture (e.g. Crimson Red robes)',
      accentPercent: 10,
      accentRole: 'Focal Highlights & Props (e.g. Golden Amber relic / eyes)',
      guide: 'Tame triadic schemes by desaturating two of the three vertices and letting the third vertex carry the high chroma punch.',
    },
    caseStudies: [
      {
        film: 'Superman / Marvel Cinematic Universe',
        director: 'Richard Donner / Various',
        cinematographer: 'Geoffrey Unsworth',
        year: 1978,
        paletteNotes: 'Classic Red, Blue, and Yellow primary triadic triad signifying pure archetypal heroism, optimism, and legendary stature.',
      },
      {
        film: 'La La Land',
        director: 'Damien Chazelle',
        cinematographer: 'Linus Sandgren',
        year: 2016,
        paletteNotes: 'Technicolor-inspired primary triadic dresses (canary yellow, royal blue, and crimson) dancing across twilight Los Angeles purples.',
      },
    ],
    defaultHue: 215, // Azure Blue (opposing Amber 35° & Magenta 335°)
  },
  tetradic: {
    type: 'tetradic',
    title: 'Double Complementary (Tetradic)',
    tagline: 'Two pairs of complementary colors forming a rectangular or square chord.',
    geometryDescription: 'Four colors arranged in two complementary pairs, spaced at 90° intervals (square) or rectangular chords across the wheel.',
    emotionalEffect: 'The most complex and luxuriant of all color schemes. Evokes rich theatricality, opulent extravagance, and multi-layered worlds. Demands disciplined balance to prevent visual anarchy.',
    distributionRecipe: {
      keyPercent: 60,
      keyRole: 'Dominant Environmental Field (Deep Midnight or Earthy Wash)',
      secondaryPercent: 25,
      secondaryRole: 'Secondary Architecture & Large Prop Accents',
      accentPercent: 15,
      accentRole: 'Two complementary punch points (e.g. 10% Gold trim + 5% Violet neon)',
      guide: 'Carefully select one dominant color to lead. If all four colors have equal saturation, the scene will look chaotic and undisciplined.',
    },
    caseStudies: [
      {
        film: 'The Fall',
        director: 'Tarsem Singh',
        cinematographer: 'Colin Watkinson',
        year: 2006,
        paletteNotes: 'Exotic architectural tableaus featuring royal blue, saffron yellow, forest green, and terracotta orange in breathtaking global locations.',
      },
      {
        film: 'Blade Runner',
        director: 'Ridley Scott',
        cinematographer: 'Jordan Cronenweth',
        year: 1982,
        paletteNotes: 'Deep cyan-black smog pierced by multi-color neon billboards in amber, magenta, and emerald across dystopian rain-slick streets.',
      },
    ],
    defaultHue: 200,
  },
  analogous: {
    type: 'analogous',
    title: 'Analogous Harmony',
    tagline: 'Adjacent color family members sharing a close, organic chromatic kinship.',
    geometryDescription: 'Three adjacent colors sitting within a 60° to 90° arc on the color wheel (typically separated by 30° steps).',
    emotionalEffect: 'Produces a profoundly natural, soothing, organic flow mirroring natural phenomena (sunsets, forest canopies, ocean depths). Offers serene visual comfort and poetic continuity.',
    distributionRecipe: {
      keyPercent: 60,
      keyRole: 'Central Parent Hue (e.g., Deep Forest Green)',
      secondaryPercent: 30,
      secondaryRole: 'Neighboring Transition Hue (e.g., Cool Teal or Warm Olive)',
      accentPercent: 10,
      accentRole: 'Outer Neighbor Spark (e.g., Golden Chartreuse or Seafoam highlight)',
      guide: 'Ensure sufficient contrast in value (lightness) between your analogous colors so subjects do not blur together into a muddy soup.',
    },
    caseStudies: [
      {
        film: 'Her',
        director: 'Spike Jonze',
        cinematographer: 'Hoyte van Hoytema',
        year: 2013,
        paletteNotes: 'Warm analogous spectrum of soft peach, coral red, and tender tangerine—with blue almost completely banned from the production design—symbolizing yearning and human intimacy.',
      },
      {
        film: 'Moonrise Kingdom',
        director: 'Wes Anderson',
        cinematographer: 'Robert Yeoman',
        year: 2012,
        paletteNotes: 'Analogous earthy khaki, olive green, and mustard yellows reflecting the wild summer innocence of 1960s New England scouting adventures.',
      },
    ],
    defaultHue: 35, // Warm Amber-Orange
  },
};
