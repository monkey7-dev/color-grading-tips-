/**
 * Cinematography Lighting, DaVinci Resolve & Lightroom Color Grading Masterclass Data
 */

export interface LightingSituation {
  id: string;
  name: string;
  kelvinRange: string;
  kelvinDefault: number;
  timeframe: string;
  characteristics: string[];
  whiteBalanceAdvice: string;
  cinematicFilmExample: string;
  lightingRecipe: {
    keyLight: string;
    fillRatio: string;
    shadowQuality: string;
    diffusionRecommendation: string;
  };
  criTlciImpact: string;
  colorSwatchHex: string;
}

export const LIGHTING_SITUATIONS: LightingSituation[] = [
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    kelvinRange: '3000K – 4000K',
    kelvinDefault: 3400,
    timeframe: 'First hour after sunrise & last hour before sunset',
    characteristics: [
      'Low solar altitude (<10° above horizon) passing through dense atmosphere (Rayleigh scattering)',
      'Rich amber, gilded gold, and soft copper directional side-lighting',
      'Elongated, soft-edged shadows with warm ambient sky fill',
      'High natural rim lighting on hair and shoulder contours',
    ],
    whiteBalanceAdvice: 'Set camera WB to 5600K (Daylight) to deliberately capture and celebrate the rich golden amber warmth. Setting WB to 3400K will artificially cool down the magic into clinical white.',
    cinematicFilmExample: 'Days of Heaven (1978, Néstor Almendros) & The Tree of Life (2011, Emmanuel Lubezki)',
    lightingRecipe: {
      keyLight: 'Low-angle sun as natural backlight or 3/4 side key',
      fillRatio: '1:4 or 1:8 subtle sky fill with unbleached muslin or gold beadboard bounce',
      shadowQuality: 'Long, cinematic, soft penumbra',
      diffusionRecommendation: '1/8 or 1/4 Black Pro-Mist / Hollywood Black Magic to bloom golden highlights',
    },
    criTlciImpact: 'Full-spectrum continuous daylight blackbody radiator (CRI 100, TLCI 100). Zero phosphor spikes.',
    colorSwatchHex: '#F59E0B',
  },
  {
    id: 'blue_hour',
    name: 'Blue Hour (L\'Heure Bleue)',
    kelvinRange: '7000K – 10,000K',
    kelvinDefault: 8500,
    timeframe: '20 to 40 minutes post-sunset during nautical & civil twilight',
    characteristics: [
      'Solar disc below horizon; Chappuis ozone absorption filters out yellow/orange, leaving deep indigo & cobalt sky',
      'Omnidirectional, shadowless, painterly ambient illumination',
      'Stunning natural contrast when mixed with warm practical city street lamps (2700K)',
      'Fast-falling exposure requiring high sensor sensitivity or wide apertures (T1.5 - T2.0)',
    ],
    whiteBalanceAdvice: 'Balance camera at 4500K-5000K to preserve the poetic twilight blue while keeping practical street lights warmly amber. Avoid balancing at 9000K which turns the frame sickly warm.',
    cinematicFilmExample: 'Sicario (2015, Roger Deakins - border raid twilight) & Midnight in Paris (2011, Darius Khondji)',
    lightingRecipe: {
      keyLight: 'Sky dome ambient fill augmented by tungsten/sodium vapor practicals',
      fillRatio: '1:1 to 1:2 wrap-around soft ambient',
      shadowQuality: 'Almost non-existent direct shadow; gentle micro-falloff',
      diffusionRecommendation: 'Clean lenses; low flare filters to maintain high micro-contrast against deep twilight',
    },
    criTlciImpact: 'Pure diffused atmospheric sky light with high CRI but steep blue/UV energy peak.',
    colorSwatchHex: '#2563EB',
  },
  {
    id: 'overcast',
    name: 'Overcast / Soft Diffusion',
    kelvinRange: '6000K – 7000K',
    kelvinDefault: 6500,
    timeframe: 'Dense cloud cover, marine layer, or high fog',
    characteristics: [
      'Cloud ceiling acts as a colossal infinite softbox diffusing direct sunlight',
      'Low overall scene contrast ratio, eliminating blown specular highlights and harsh shadows',
      'True colors and micro-textures of skin, clothing, and architecture emerge faithfully',
      'Slight cool blue-gray ambient bias across the scene',
    ],
    whiteBalanceAdvice: 'Set camera WB to Cloudy (6500K) or Kelvin 6200K to inject healthy skin warmth and neutralize cool overcast dullness.',
    cinematicFilmExample: 'The Revenant (2015, Emmanuel Lubezki - natural wilderness light) & Skyfall (2012, Roger Deakins)',
    lightingRecipe: {
      keyLight: 'Directional soft overhead cloud light sculpted with negative fill (solid black flags on one side)',
      fillRatio: '1:1.5; use 8x8 or 12x12 Solid Black Floppies to create shape and drama',
      shadowQuality: 'Subtle, wrap-around gradients under chin and cheekbones',
      diffusionRecommendation: 'None needed on camera; nature is already heavily diffused',
    },
    criTlciImpact: 'Natural daylight filtered through water vapor; continuous spectrum, CRI 99+.',
    colorSwatchHex: '#64748B',
  },
  {
    id: 'midday_sun',
    name: 'Midday High Sun',
    kelvinRange: '5200K – 5800K',
    kelvinDefault: 5500,
    timeframe: '11:00 AM to 2:00 PM under direct unclouded sun',
    characteristics: [
      'Vertical top-down angle creating steep downward shadows (raccoon eyes under brow, black nose shadows)',
      'Extreme dynamic range (>14 stops) easily exceeding standard camera sensor limits',
      'Hot specular highlights on foreheads, hair, and metallic surfaces',
      'Saturated, neutral white daylight temperature',
    ],
    whiteBalanceAdvice: 'Set camera WB to Daylight (5600K). To preserve skin texture, use an overhead 8x8 or 12x12 Silk/Grid Cloth diffusion scrim overhead, or shoot in open shade with white bounce.',
    cinematicFilmExample: 'Lawrence of Arabia (1962, Freddie Young) & Dune (2021, Greig Fraser)',
    lightingRecipe: {
      keyLight: 'Direct overhead sun softened through 1/2 Silent Grid Cloth overhead scrim',
      fillRatio: '1:3 using beadboard or silver lamé bounce underneath to fill eye sockets',
      shadowQuality: 'Hard, short, vertical knife-edge shadows',
      diffusionRecommendation: 'Polarizer filter to cut atmospheric haze and glare, plus True ND 1.2-1.8',
    },
    criTlciImpact: 'Standard D55 daylight reference; perfect continuous spectrum CRI 100.',
    colorSwatchHex: '#E2E8F0',
  },
  {
    id: 'tungsten_vs_fluorescent',
    name: 'Artificial: Tungsten (2700K) vs Fluorescent / LED',
    kelvinRange: '2700K vs 4500K–5600K (+Green/Magenta Tint)',
    kelvinDefault: 3200,
    timeframe: 'Interior architectural, commercial sets, practical office lighting',
    characteristics: [
      'Tungsten incandescent bulbs emit smooth thermal blackbody radiation at 2700K-3200K with deep red/orange richness',
      'Standard commercial fluorescent & budget LEDs emit disjointed, spiky spectra with notorious +Green phosphor spikes (duv > 0.005)',
      'Spiky green cast discolors human skin hemoglobin into sickly yellow/olive tone',
      'Requires precise Minus-Green (Magenta) gel filtration or HSL curve compensation',
    ],
    whiteBalanceAdvice: 'For mixed practical sets: White balance on subject skin key light. Add 1/8 to 1/4 Minus Green (+Tint) in camera or grading if shooting under cheap overhead LED/tubes.',
    cinematicFilmExample: 'Fight Club (1999, Jeff Cronenweth - sickly green fluorescent basement) & Taxi Driver (1976, Michael Chapman)',
    lightingRecipe: {
      keyLight: 'Tungsten Fresnel (e.g. ARRI 650W) through 216 Diffusion, or high-CRI bi-color LED (Aputure/ARRI Skypanel)',
      fillRatio: 'Variable; maintain negative fill to isolate unwanted ceiling bounce',
      shadowQuality: 'Controlled theatrical edge or feathered softbox wash',
      diffusionRecommendation: 'Minus Green gels (Lee 247/248) wrapped around low-CRI industrial fixtures',
    },
    criTlciImpact: 'Tungsten has CRI 100. Cheap fluorescent/LED often have CRI < 80, TLCI < 70 with severe R9 (saturated red) deficiency.',
    colorSwatchHex: '#EA580C',
  },
];

export interface DavinciNodeGuide {
  id: string;
  name: string;
  category: 'primary' | 'curves' | 'advanced';
  purpose: string;
  technicalMechanism: string;
  coloristSecret: string;
}

export const DAVINCI_NODE_WORKFLOWS: DavinciNodeGuide[] = [
  {
    id: 'lift_gamma_gain',
    name: 'Primary Wheels (Lift, Gamma, Gain, Offset)',
    category: 'primary',
    purpose: 'Core tonal foundation and luminance distribution across three overlapping tonal regions.',
    technicalMechanism: 'Lift anchors black point (0-20 IRE) with smooth parabolic roll-off toward midtones. Gamma shifts the midtone contrast pivot (20-75 IRE). Gain scales the highlight headroom (75-100 IRE). Offset moves all channels uniformly across the entire curve.',
    coloristSecret: 'Always adjust Exposure and Contrast first in Offset or HDR wheels before touching Lift/Gain to preserve sensor color linearity and avoid chromatic distortion.',
  },
  {
    id: 'cst_transform',
    name: 'Color Space Transform (CST)',
    category: 'advanced',
    purpose: 'Transforms camera-native Log gamuts (ARRI LogC, Sony S-Log3, REDWideGamut) to unified working and delivery gamuts.',
    technicalMechanism: 'Applies 3x3 chromaticity adaptation matrices and transfer function curves (e.g. Tone Mapping with DaVinci / Luminance Mapping) to accurately normalize raw sensor physics into Rec.709 / Gamma 2.4 without clipping.',
    coloristSecret: 'Sandwich your creative grading nodes between an Input CST (Camera Log -> DWG/Intermediate) and an Output CST (DWG/Intermediate -> Rec.709 Gamma 2.4). All grading tools behave far more musically in wide gamut space.',
  },
  {
    id: 'hue_vs_hue',
    name: 'Hue vs Hue Curve',
    category: 'curves',
    purpose: 'Isolates and shifts a targeted color hue without touching any other color families.',
    technicalMechanism: 'Samples the pixel hue angle along the 360° chromatic circle and applies a rotational offset curve.',
    coloristSecret: 'To create deep filmic foliage: sample the yellow-green foliage on the curve and nudge it slightly clockwise toward deep organic forest green (away from acidic neon yellow).',
  },
  {
    id: 'hue_vs_sat',
    name: 'Hue vs Saturation Curve',
    category: 'curves',
    purpose: 'Selective saturation control based on specific color identity.',
    technicalMechanism: 'Applies radial saturation multipliers only to chosen hue sectors, leaving the rest of the gamut intact.',
    coloristSecret: 'Clean up dirty backgrounds by dipping the yellow/green saturation by 25% while maintaining full saturation on orange/red (skin tones and key wardrobe).',
  },
  {
    id: 'hue_vs_lum',
    name: 'Hue vs Luminance Curve',
    category: 'curves',
    purpose: 'Alters the brightness of specific colors without affecting their hue or saturation.',
    technicalMechanism: 'Scales the Y component of the color model based on the hue angle.',
    coloristSecret: 'Simulate an expensive optical circular polarizer: drop the Luminance of the Blue hue sector on Hue vs Lum. Deep indigo skies will emerge instantly without crushing shadows.',
  },
  {
    id: 'color_warper',
    name: 'Color Warper (2D Chromatic Mesh)',
    category: 'advanced',
    purpose: 'Simultaneous 2D control of hue and saturation on a polar or Cartesian coordinate mesh.',
    technicalMechanism: 'Distorts a grid of color nodes with bezier interpolation, allowing smooth non-linear warping of color vectors.',
    coloristSecret: 'Lock the inner ring nodes (preserving neutral grays and skin tones) while gently pulling the outer cyan and amber nodes outward for clean, non-clipping cinematic split-toning.',
  },
  {
    id: 'teal_orange_split',
    name: 'Teal & Orange Split-Toning Node Architecture',
    category: 'advanced',
    purpose: 'The definitive blockbuster color palette: cool cyan/teal shadows contrasting warm amber/bronze skin tones.',
    technicalMechanism: 'Utilizes a Parallel Node or Layer Mixer: Node A isolates skin via 3D Qualifier on the 135° vectorscope vector. Node B pushes cyan/teal into Lift and Gamma. The mixer composites skin cleanly on top of the stylized teal shadows.',
    coloristSecret: 'Never push teal directly into the master Primary wheels without qualifying or masking skin tones! Unqualified teal turns human skin into zombie green and destroys audience empathy.',
  },
];

export interface LightroomTrick {
  title: string;
  sliderPanel: string;
  action: string;
  result: string;
}

export interface SubjectLandscapeRecipe {
  id: string;
  environment: string;
  keyChallenge: string;
  hueShifts: string;
  luminanceAdjustments: string;
  contrastGrading: string;
  splitToningRecipe: string;
  proTip: string;
}

export const SUBJECT_LANDSCAPE_RECIPES: SubjectLandscapeRecipe[] = [
  {
    id: 'forests_woodlands',
    environment: 'Forests & Lush Woodlands',
    keyChallenge: 'Over-saturated, muddy greens destroying shadow depth and flattening canopy details.',
    hueShifts: 'Move Yellows toward Orange (+15); move Greens toward Aqua (+10) to eliminate toxic neon tint.',
    luminanceAdjustments: 'Drop Green luminance (-20) to deepen forest density; boost Yellow luminance (+15) for backlit sunlit leaves.',
    contrastGrading: 'Use low global contrast with high midtone clarity (+15) to preserve trunk and moss texture.',
    splitToningRecipe: 'Inject subtle cool Cyan (Hue 205°, Sat 8%) into deep canopy shadows to simulate sky-bounce illumination.',
    proTip: 'Sample harsh neon greens in DaVinci Hue vs Sat and pull the control point downward to desaturate peak foliage to natural timber tone.',
  },
  {
    id: 'deserts_canyons',
    environment: 'Deserts & Arid Canyons',
    keyChallenge: 'Monotonous brown/red hues flattening sandstone terrain shape and destroying atmospheric separation.',
    hueShifts: 'Push Oranges toward Red (+10); push Yellows toward Gold (-10) to create dimensional chromatic relief.',
    luminanceAdjustments: 'Elevate orange luminance (+10) on sunlit crests; drop red luminance (-15) in canyon crevices.',
    contrastGrading: 'High contrast with protected highlights (soft knee roll-off) to avoid clipping bleached sandstone.',
    splitToningRecipe: 'Inject cool Blue/Purple into deep shadow slots (Hue 240°, Sat 12%) to create artificial depth with sky light reflection.',
    proTip: 'Always check your RGB histogram when boosting sunset canyon saturation. Avoid clipping red channel into flat neon paint by using Vibrance over Saturation.',
  },
  {
    id: 'fog_alpine_mist',
    environment: 'Fog & Alpine Mist',
    keyChallenge: 'Flat, low-contrast scenes losing tonal structure and appearing dirty or noisy.',
    hueShifts: 'Keep global hue shifts strictly neutral or slightly cold cyan (+5 toward Blue).',
    luminanceAdjustments: 'Lift blacks to (0, 15) on Tone Curve for high-key matte serenity; compress midtone span.',
    contrastGrading: 'Negative dehaze (-10) with local linear gradient on horizon, Dehaze -10, Color Temp +300K, Tint +5 Magenta.',
    splitToningRecipe: 'High-key monochromatic cool grading: Highlights Hue 210° (Sat 6%), Shadows Hue 225° (Sat 10%).',
    proTip: 'High-key monochromatic mist conveys isolation, ethereal serenity, and dreamlike depth through progressive atmospheric fading.',
  },
];

export const LIGHTROOM_WORKFLOWS: LightroomTrick[] = [
  {
    title: 'Camera Calibration Primary Shifts (Rich Depth Base)',
    sliderPanel: 'Calibration (Bottom Panel)',
    action: 'Red Primary: Sat +15, Hue +5. Blue Primary: Sat +20, Hue -10. Green Primary: Sat +10.',
    result: 'Creates rich cinematic base depth. Transforms digital sensors into organic film stock, deepens blues toward cyan, and separates subjects from muddy backgrounds.',
  },
  {
    title: 'Spatial Depth Creation via HSL Luminance',
    sliderPanel: 'HSL / Color -> Luminance',
    action: 'Lower background blue luminance (-15 to -20). Boost foreground yellow/orange luminance (+10 to +15).',
    result: 'Forces atmospheric aerial perspective: cool background elements recede backward while warm foreground rocks and trees pop outward toward the viewer.',
  },
  {
    title: 'Color Grading Split Toning Balance',
    sliderPanel: 'Color Grading (Shadows & Highlights)',
    action: 'Shadows: Hue 220° (Cool Blue), Sat 15%. Highlights: Hue 40° (Warm Gold), Sat 12%. Balance: +10 toward highlights.',
    result: 'Creates classic natural light balance: cool sky bounce fills shadows while golden direct sun lights highlights.',
  },
  {
    title: 'Targeted Skin Tone Glow (HSL / Color Panel)',
    sliderPanel: 'HSL / Color -> Luminance & Saturation',
    action: 'Orange Luminance: +8 to +16. Orange Saturation: -2 to -6. Red Luminance: +4.',
    result: 'Naturally illuminates human skin without brightening the entire scene or creating hot spots. The slight saturation dip prevents the skin from looking sunburnt.',
  },
  {
    title: 'Atmospheric Masking & Depth Isolation',
    sliderPanel: 'Masking -> Linear Gradient / Radial Mask',
    action: 'Linear Gradient on sky/distance: Dehaze -10, Color Temperature +300K, Tint +5 Magenta.',
    result: 'Simulates physical Rayleigh and Mie atmospheric scattering, adding authentic distance haze and softening harsh digital horizon edges.',
  },
  {
    title: 'Tone Curve Matte Shadow Lift (S-Curve with Lifted Black Point)',
    sliderPanel: 'Point Curve',
    action: 'Place point at (0, 0) and lift it to (0, 15). Drop shadow point (25, 20). Add gentle highlight boost at (75, 80).',
    result: 'Fades deep digital blacks into velvety filmic matte, emulating cinema print emulsion while preserving midtone punch and sharpness.',
  },
];

