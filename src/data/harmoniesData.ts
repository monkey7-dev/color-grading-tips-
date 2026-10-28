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
  'split-complementary': {
    type: 'split-complementary',
    title: 'Split-Complementary Harmony',
    tagline: 'High chromatic contrast with reduced tension by flanking the direct complement.',
    geometryDescription: 'Base color paired with the two colors adjacent to its direct complement (offsets: 0°, 150°, 210°).',
    emotionalEffect: 'Delivers high visual vibrancy without the jarring discord or visual fatigue of direct complementation. Nuanced, refined cinematic polish.',
    distributionRecipe: {
      keyPercent: 60,
      keyRole: 'Dominant Base Environment (e.g. Warm Golden Ambient)',
      secondaryPercent: 25,
      secondaryRole: 'Flanking Complement A (e.g. Deep Ocean Navy)',
      accentPercent: 15,
      accentRole: 'Flanking Complement B (e.g. Cyan Rim Light)',
      guide: 'Assign the 60% key to the base hue, using the two flanking hues to sculpt shadow depth and specular accents.',
    },
    caseStudies: [
      {
        film: 'Amélie',
        director: 'Jean-Pierre Jeunet',
        cinematographer: 'Bruno Delbonnel',
        year: 2001,
        paletteNotes: 'Sensual emerald greens and warm golden ambers balanced by delicate ruby red accents throughout Parisian interiors.',
      },
    ],
    defaultHue: 25,
  },
  square: {
    type: 'square',
    title: 'Square Harmony',
    tagline: 'Equidistant 90-degree four-point harmonic balance across the color spectrum.',
    geometryDescription: 'Four colors spaced exactly 90° apart on the color wheel (offsets: 0°, 90°, 180°, 270°).',
    emotionalEffect: 'Dynamic, multidimensional chromatic depth. Conveys grand scale, vibrant complexity, and theatrical balance when weighted properly.',
    distributionRecipe: {
      keyPercent: 50,
      keyRole: 'Atmospheric Bed / Set Dominance',
      secondaryPercent: 25,
      secondaryRole: 'Costume & Key Character Accent',
      accentPercent: 15,
      accentRole: 'Secondary Architecture / Set Dressing',
      guide: 'Never give all 4 colors equal weight. Select 1 dominant hue to anchor 50% of the frame.',
    },
    caseStudies: [
      {
        film: 'Spider-Man: Into the Spider-Verse',
        director: 'Peter Ramsey, Bob Persichetti',
        cinematographer: 'Visual Architecture',
        year: 2018,
        paletteNotes: 'Bold comic-halftone chromatic chords mixing cyan, magenta, yellow, and deep purple across multiversal Brooklyn.',
      },
    ],
    defaultHue: 45,
  },
  'double-split-complementary': {
    type: 'double-split-complementary',
    title: 'Double Split-Complementary',
    tagline: 'Dual complementary pairs with subtle angle separation for sophisticated color grading.',
    geometryDescription: 'Two pairs of split complements creating a rich 4-color chromatic structure (offsets: 0°, 30°, 180°, 210°).',
    emotionalEffect: 'Rich, layered sophistication. Allows complex world-building with both warm and cool sub-currents without visual clutter.',
    distributionRecipe: {
      keyPercent: 50,
      keyRole: 'Primary Environment Hue',
      secondaryPercent: 25,
      secondaryRole: 'Subtle Companion Hue (Close Family)',
      accentPercent: 15,
      accentRole: 'Opposite Split Duo Accents',
      guide: 'Group the two adjacent colors into one cohesive team, and counterweight with the opposite pair as highlights and rim kicks.',
    },
    caseStudies: [
      {
        film: 'La La Land',
        director: 'Damien Chazelle',
        cinematographer: 'Linus Sandgren',
        year: 2016,
        paletteNotes: 'Twilight violet skies, emerald dresses, golden lampposts, and midnight navy cityscapes in seamless harmonic tension.',
      },
    ],
    defaultHue: 210,
  },
  compound: {
    type: 'compound',
    title: 'Compound (Split Analogous)',
    tagline: 'Combination of complementary tension and neighboring analogous smoothness.',
    geometryDescription: 'Base hue, an analogous neighbor, and their complementary reflections across the color wheel.',
    emotionalEffect: 'Balanced visual richness that merges familiar analogous comfort with purposeful drama and edge contrast.',
    distributionRecipe: {
      keyPercent: 55,
      keyRole: 'Master Cinematic Wash',
      secondaryPercent: 30,
      secondaryRole: 'Analogous Neighbor Transition',
      accentPercent: 15,
      accentRole: 'Compound Opposing Kick',
      guide: 'Use the analogous pair to build deep environmental gradient, then punctuate key actions with the opposing compound kick.',
    },
    caseStudies: [
      {
        film: 'Inception',
        director: 'Christopher Nolan',
        cinematographer: 'Wally Pfister',
        year: 2010,
        paletteNotes: 'Architectural gunmetal steel and deep slate blue punctuated by mahogany warmth and crisp champagne highlights.',
      },
    ],
    defaultHue: 195,
  },
  'neutral-plus-accent': {
    type: 'neutral-plus-accent',
    title: 'Neutral + Single Accent',
    tagline: 'Desaturated cinematic world with one solitary high-chroma emotional vector.',
    geometryDescription: 'Desaturated monochromatic or neutral grayscale base with a single isolated saturated hue popping at high contrast.',
    emotionalEffect: 'Hypnotic narrative focus. Instantly directs the viewer’s eye to a single symbolic subject, clue, or psychological anchor.',
    distributionRecipe: {
      keyPercent: 65,
      keyRole: 'Desaturated Neutral Shadow & Midtone Field',
      secondaryPercent: 25,
      secondaryRole: 'Neutral Supporting Luminance & Texture',
      accentPercent: 10,
      accentRole: 'High-Saturation Solitary Accent (Focal Target)',
      guide: 'Keep the 90% neutral field clean of color contamination so the 10% accent hits with maximum emotional impact.',
    },
    caseStudies: [
      {
        film: "Schindler's List",
        director: 'Steven Spielberg',
        cinematographer: 'Janusz Kamiński',
        year: 1993,
        paletteNotes: 'Striking black and white cinematography with the solitary red coat of a young girl commanding unforgettable tragic focus.',
      },
      {
        film: 'Sin City',
        director: 'Robert Rodriguez',
        cinematographer: 'Robert Rodriguez',
        year: 2005,
        paletteNotes: 'High-contrast graphic novel monochrome punctuated by isolated emerald eyes, crimson lips, and yellow skin.',
      },
    ],
    defaultHue: 0,
  },
};

export interface CinematicHarmonyPalette {
  id: string;
  name: string;
  scheme: HarmonyType;
  baseHue: number;
  swatches: string[];
  description: string;
  bestFor: string;
}

export const CINEMATIC_HARMONY_PALETTES: CinematicHarmonyPalette[] = [
  {
    id: 'teal-orange',
    name: 'Teal & Orange Blockbuster',
    scheme: 'complementary',
    baseHue: 25,
    swatches: ['#0E2A36', '#1E4E5F', '#D97706', '#F59E0B', '#FDE68A'],
    description: 'The definitive modern action palette. Cool cyan-teal shadows make warm orange actor skin tones pop with maximum visual separation.',
    bestFor: 'Action, Sci-Fi, Summer Blockbusters, Thrillers',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour Warmth',
    scheme: 'analogous',
    baseHue: 38,
    swatches: ['#2E1805', '#78350F', '#B45309', '#F59E0B', '#FEF3C7'],
    description: 'Warm low-sun magic hour radiance. Analogous amber, honey, and caramel hues evoke deep nostalgia and intimacy.',
    bestFor: 'Romantic Drama, Coming-of-Age, Sunsets, Nostalgia',
  },
  {
    id: 'moonlit',
    name: 'Moonlit Twilight (Scotopic)',
    scheme: 'monochromatic',
    baseHue: 220,
    swatches: ['#050C1A', '#0F2547', '#1E40AF', '#60A5FA', '#E0F2FE'],
    description: 'Naturalistic night vision simulating human rod cells. Cool sapphire shadows with desaturated silver-cyan highlights.',
    bestFor: 'Nocturnal Thrillers, Mysteries, Ocean Twilight, Horror',
  },
  {
    id: 'neon-noir',
    name: 'Cyberpunk Neon Noir',
    scheme: 'triadic',
    baseHue: 320,
    swatches: ['#09090B', '#1E1B4B', '#06B6D4', '#EC4899', '#F43F5E'],
    description: 'Electric dystopian contrast: deep inky wet pavement reflecting blazing cyan neon, electric magenta, and crimson tail-lights.',
    bestFor: 'Cyberpunk, Neo-Noir, Crime Thrillers, Night Club Scenes',
  },
  {
    id: 'faded-memory',
    name: 'Faded Memory 70s',
    scheme: 'analogous',
    baseHue: 40,
    swatches: ['#292524', '#57534E', '#A8A29E', '#E7E5E4', '#FEF9C3'],
    description: 'Lifted warm blacks, creamy yellowed highlights, and gentle pastel saturation reminiscent of aged 16mm archival print.',
    bestFor: 'Period Pieces, Flashbacks, Autobiographical Dramas',
  },
  {
    id: 'toxic-green',
    name: 'Dystopian Matrix Green',
    scheme: 'monochromatic',
    baseHue: 145,
    swatches: ['#052E16', '#14532D', '#16A34A', '#84CC16', '#ECFDF5'],
    description: 'Slightly sickly phosphor green cast over midtones and shadows, inducing subconscious anxiety and artificial alienation.',
    bestFor: 'Sci-Fi Simulation, Cyber Thrillers, Toxic Industrial Environments',
  },
  {
    id: 'arctic',
    name: 'Arctic Glacial Frost',
    scheme: 'analogous',
    baseHue: 195,
    swatches: ['#082F49', '#0369A1', '#38BDF8', '#BAE6FD', '#F0F9FF'],
    description: 'Crisp glacial cyan and ice-blue with high-key specular snow highlights. Imparts immediate sensory cold and isolation.',
    bestFor: 'Survival Films, Mountain Expeditions, Sci-Fi Lab Cleanrooms',
  },
  {
    id: 'desert',
    name: 'Desert Scorched Earth',
    scheme: 'split-complementary',
    baseHue: 28,
    swatches: ['#451A03', '#9A3412', '#EA580C', '#FDBA74', '#FFF7ED'],
    description: 'Baked terracotta, sun-bleached ochre, and blinding white sunlight with deep amber shadow density.',
    bestFor: 'Westerns, Post-Apocalyptic Wastelands, Survival Dramas',
  },
  {
    id: 'pastel-story',
    name: 'Pastel Storybook Symmetry',
    scheme: 'compound',
    baseHue: 340,
    swatches: ['#831843', '#DB2777', '#F472B6', '#FBCFE8', '#FFF1F2'],
    description: 'Soft pastel pinks, muted powder corals, and delicate cream tones inspired by Wes Anderson and fantasy fairy tales.',
    bestFor: 'Whimsical Comedy, Stylized Arthouse, Fashion Films',
  },
  {
    id: 'royal',
    name: 'Royal Opulence (Gold & Violet)',
    scheme: 'complementary',
    baseHue: 275,
    swatches: ['#2E1065', '#581C87', '#9333EA', '#D97706', '#FDE68A'],
    description: 'Regal velvet purple shadowed against glowing candelabra gold and imperial brass highlights.',
    bestFor: 'Historical Epics, Royalty, Grand Opera, Fantasy Thrones',
  },
  {
    id: 'forest',
    name: 'Deep Forest Canopy',
    scheme: 'analogous',
    baseHue: 110,
    swatches: ['#052E16', '#166534', '#15803D', '#65A30D', '#ECFCCB'],
    description: 'Lush moss green, deep pine shadow, and golden dappled sun rays filtering through dense ancient tree foliage.',
    bestFor: 'Nature Documentaries, Medieval Fantasy, Wilderness Survival',
  },
  {
    id: 'sunset-bruise',
    name: 'Bruised Twilight Horizon',
    scheme: 'double-split-complementary',
    baseHue: 290,
    swatches: ['#18181B', '#4C1D95', '#BE185D', '#F97316', '#FEF08A'],
    description: 'Intense atmospheric transition: bruised deep indigo and violet fading into burning magenta and fiery gold sunset horizon.',
    bestFor: 'Arthouse Dramas, Emotional Climaxes, Neon Neo-Westerns',
  },
];

