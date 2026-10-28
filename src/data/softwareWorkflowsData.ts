/**
 * Software-Specific Production Guides for DaVinci Resolve & Adobe Lightroom Classic
 * Detailed step-by-step instructions for dialling in Day, Night, and Day-for-Night color grades.
 */

export interface SoftwareInstruction {
  software: 'davinci_resolve' | 'adobe_lightroom';
  title: string;
  summary: string;
  steps: {
    stepNumber: number;
    panelName: string;
    action: string;
    valuesToSet: string;
    explanation: string;
  }[];
  quickShortcut: string;
  proTip: string;
}

export interface ScenarioSoftwareManual {
  scenarioId: string;
  scenarioName: string;
  davinciGuide: SoftwareInstruction;
  lightroomGuide: SoftwareInstruction;
}

export const SCENARIO_SOFTWARE_MANUALS: Record<string, ScenarioSoftwareManual> = {
  golden_hour_magic: {
    scenarioId: 'golden_hour_magic',
    scenarioName: 'Golden Hour (Magic Hour)',
    davinciGuide: {
      software: 'davinci_resolve',
      title: 'Dialling Golden Hour in DaVinci Resolve Studio',
      summary: 'Build a 4-node serial chain contrasting warm copper highlights against deep cyan sky shadows.',
      steps: [
        {
          stepNumber: 1,
          panelName: 'Color Wheels -> Temp & Tint',
          action: 'Set Kelvin white balance & Duv tint',
          valuesToSet: 'Temp: -800 to -1200 (warm target 3200K) | Tint: +4',
          explanation: 'Bakes in organic sunset radiation without turning whites sickly yellow.',
        },
        {
          stepNumber: 2,
          panelName: 'Primary Wheels -> Lift (Shadows)',
          action: 'Push cyan-teal into shadow floor',
          valuesToSet: 'Wheel Vector: Hue 215° · Sat 15% | Lum: -0.04',
          explanation: 'Simulates cool sky bounce filling shadows opposite the direct warm sun.',
        },
        {
          stepNumber: 3,
          panelName: 'Primary Wheels -> Gamma & Gain',
          action: 'Infuse golden honey into midtones & specular highlights',
          valuesToSet: 'Gamma: Hue 38° · Sat 25% | Gain: Hue 42° · Sat 18% · Lum +0.12',
          explanation: 'Gives actors radiant skin tones and illuminates hair rim contours with sunlight.',
        },
        {
          stepNumber: 4,
          panelName: 'Curves -> Custom S-Curve',
          action: 'Establish filmic roll-off',
          valuesToSet: 'Black (0, 0) lifted to (0, 10) | Highlight soft knee anchor at (85, 88)',
          explanation: 'Prevents digital clipping on direct sun glints and gives velvety matte shadows.',
        },
      ],
      quickShortcut: 'Alt + S (New Serial Node) · Shift + Z (Fit Node Tree to Window)',
      proTip: 'Apply a parallel node with 3D Qualifier on skin tones to ensure the cyan shadow cast does not creep into the shadow side of actors’ faces.',
    },
    lightroomGuide: {
      software: 'adobe_lightroom',
      title: 'Dialling Golden Hour in Adobe Lightroom Classic',
      summary: 'Utilize Color Grading 3-way wheels, Calibration, and radial sun flares.',
      steps: [
        {
          stepNumber: 1,
          panelName: 'Basic Panel',
          action: 'Warm global temperature and soften highlights',
          valuesToSet: 'Temp: +12 to +18 | Highlights: -35 | Shadows: +15 | Contrast: +10',
          explanation: 'Recovers sky detail while warming the overall scene exposure.',
        },
        {
          stepNumber: 2,
          panelName: 'Color Grading Panel -> 3-Way Wheels',
          action: 'Dial in the complementary split',
          valuesToSet: 'Shadows: Hue 215° · Sat 18% | Midtones: Hue 38° · Sat 22% | Highlights: Hue 45° · Sat 28%',
          explanation: 'The classic cinematic split: golden highlights contrasting deep teal shadows.',
        },
        {
          stepNumber: 3,
          panelName: 'Color Mixer / HSL -> Luminance',
          action: 'Enhance skin glow and deepen sky',
          valuesToSet: 'Orange Lum: +14 | Yellow Lum: +10 | Blue Lum: -20',
          explanation: 'Pops human subjects outward while darkening the background sky for depth.',
        },
        {
          stepNumber: 4,
          panelName: 'Calibration Panel (Bottom)',
          action: 'Analog film chemical emulation',
          valuesToSet: 'Red Primary: Hue +5 · Sat +15 | Blue Primary: Hue -10 · Sat +25',
          explanation: 'Transforms flat digital sensors into rich, organic Eastman Kodak colorimetry.',
        },
      ],
      quickShortcut: 'D (Develop Module) · Y (Before/After Split View)',
      proTip: 'Add a Radial Mask in the top-right corner over the sun, increase Feather to 90, drop Dehaze to -15, and set Temp to +20 to create an authentic anamorphic golden lens flare.',
    },
  },
  moonlit_day_for_night: {
    scenarioId: 'moonlit_day_for_night',
    scenarioName: 'Moonlit Night (Atmospheric Blue)',
    davinciGuide: {
      software: 'davinci_resolve',
      title: 'Creating Cinematic Moonlit Night in DaVinci Resolve',
      summary: 'Simulate human scotopic rod vision with cold Prussian blue and protected skin tones.',
      steps: [
        {
          stepNumber: 1,
          panelName: 'Primary Wheels -> Offset (Master)',
          action: 'Drop global scene exposure',
          valuesToSet: 'Offset Wheel: -12 to -18 IRE (equivalent to -2.5 EV stops)',
          explanation: 'Brings daylight values down into the nocturnal perception range.',
        },
        {
          stepNumber: 2,
          panelName: 'Primary Wheels -> Lift (Shadows)',
          action: 'Lift shadow floor with deep Prussian blue',
          valuesToSet: 'Lift: Hue 225° · Sat 28% | Lum: +0.03 to +0.05',
          explanation: 'Purkinje effect: scotopic rod cells see low light as blue-cyan. Never crush night blacks to zero.',
        },
        {
          stepNumber: 3,
          panelName: 'Primary Wheels -> Gamma & Saturation',
          action: 'Cool the midtones and drain daytime color',
          valuesToSet: 'Gamma: Hue 215° · Sat 18% · Lum -0.06 | Global Saturation: 65% - 72%',
          explanation: 'Mimics the eye losing color cone sensitivity in darkness.',
        },
        {
          stepNumber: 4,
          panelName: 'Node Graph -> Parallel Node (Skin Isolation)',
          action: 'Protect actors from turning zombie blue',
          valuesToSet: '3D Qualifier on actor face -> push Hue 35° (Warmth +12) -> blend at 60%',
          explanation: 'Preserves the organic human presence while the entire world around them is nocturnal cyan.',
        },
      ],
      quickShortcut: 'Alt + P (Create Parallel Node) · Shift + H (Highlight Qualifier Mask)',
      proTip: 'In Node 06, add DaVinci Resolve Film Grain (35mm 400T texture at 0.35 opacity) to eliminate digital 8-bit banding in deep night sky gradients.',
    },
    lightroomGuide: {
      software: 'adobe_lightroom',
      title: 'Creating Moonlit Night in Adobe Lightroom Classic',
      summary: 'Convert scenes into atmospheric moonlit drama using exposure drop and cool split toning.',
      steps: [
        {
          stepNumber: 1,
          panelName: 'Basic Panel',
          action: 'Drop exposure and cool color temperature',
          valuesToSet: 'Exposure: -2.20 EV | Temp: 8500K (Slide toward Blue -30) | Tint: -8 (Green)',
          explanation: 'Immediately transforms high-key daytime lighting into twilight dusk.',
        },
        {
          stepNumber: 2,
          panelName: 'Basic Panel -> Saturation & Blacks',
          action: 'Desaturate and soften shadow floor',
          valuesToSet: 'Saturation: -30% | Vibrance: -15% | Blacks: +15 | Whites: -40',
          explanation: 'Clamps specular white points to moonlight levels (65 IRE) and softens black clipping.',
        },
        {
          stepNumber: 3,
          panelName: 'Color Grading Panel',
          action: 'Infuse deep midnight indigo throughout the frame',
          valuesToSet: 'Shadows: Hue 225° · Sat 35% · Lum +5 | Midtones: Hue 210° · Sat 24%',
          explanation: 'Replaces neutral digital gray with romantic atmospheric moonlight.',
        },
        {
          stepNumber: 4,
          panelName: 'Masking -> Select Subject',
          action: 'Recover healthy facial skin warmth',
          valuesToSet: 'Subject Mask: Temp +15 | Saturation +15 | Exposure +0.40',
          explanation: 'Anchors the viewer’s eye on the protagonist while the rest of the frame recedes into darkness.',
        },
      ],
      quickShortcut: 'Shift + M (Radial Mask) · M (Linear Gradient Mask)',
      proTip: 'Use a Linear Gradient mask from the top down over the sky: pull Exposure -0.80 EV and Saturation -20% to eliminate daytime horizon glare.',
    },
  },
  neon_noir_cyberpunk: {
    scenarioId: 'neon_noir_cyberpunk',
    scenarioName: 'Neon Noir (Cyberpunk City)',
    davinciGuide: {
      software: 'davinci_resolve',
      title: 'Building Neon Noir in DaVinci Resolve',
      summary: 'Crushed obsidian blacks contrasted with razor-sharp electric cyan and hot magenta tube flares.',
      steps: [
        {
          stepNumber: 1,
          panelName: 'Curves -> Point Curve',
          action: 'Crush the toe for dense obsidian shadows',
          valuesToSet: 'Drop point (20, 8) to compress shadows | Contrast: 1.45',
          explanation: 'Creates the pitch-black wet asphalt foundation essential for neon reflections.',
        },
        {
          stepNumber: 2,
          panelName: 'Primary Wheels -> Lift & Gain Split',
          action: 'Establish the dual-chroma neon aesthetic',
          valuesToSet: 'Lift: Hue 195° (Electric Cyan) · Sat 25% | Gain: Hue 330° (Hot Magenta) · Sat 35%',
          explanation: 'Separates dark wet surfaces from luminous neon advertising tubes.',
        },
        {
          stepNumber: 3,
          panelName: 'Color Warper or Hue vs Sat Curve',
          action: 'Hyper-saturate primary neon frequencies',
          valuesToSet: 'Boost Cyan and Magenta saturation +40% | Pull yellow/green saturation down -30%',
          explanation: 'Eliminates muddy background colors so only pure cyberpunk neon frequencies pop.',
        },
        {
          stepNumber: 4,
          panelName: 'OpenFX -> Glow / Halation',
          action: 'Add authentic neon bloom on specular sources',
          valuesToSet: 'Shine: 0.65 | Spread: 0.40 | Composite Type: Screen',
          explanation: 'Simulates atmospheric water mist catching specular neon beams on rain-slicked streets.',
        },
      ],
      quickShortcut: 'Ctrl + F (Cinema Viewer Fullscreen) · Alt + L (Layer Mixer Node)',
      proTip: 'Use a Layer Mixer set to "Screen" or "Add" with a qualifier on high specular highlights to isolate neon signs and apply directional anamorphic streaks.',
    },
    lightroomGuide: {
      software: 'adobe_lightroom',
      title: 'Building Neon Noir in Adobe Lightroom Classic',
      summary: 'Dual complementary split toning with high clarity and selective color isolation.',
      steps: [
        {
          stepNumber: 1,
          panelName: 'Basic Panel',
          action: 'Pump contrast and punch clarity',
          valuesToSet: 'Contrast: +45 | Highlights: +25 | Shadows: -30 | Blacks: -20 | Clarity: +25',
          explanation: 'Sharpens reflection edges in wet asphalt and gives metallic punch.',
        },
        {
          stepNumber: 2,
          panelName: 'Color Grading Panel',
          action: 'Dial in the Magenta / Cyan split',
          valuesToSet: 'Shadows: Hue 195° (Cyan) · Sat 35% | Highlights: Hue 325° (Magenta) · Sat 42%',
          explanation: 'The hallmark Blade Runner 2049 color balance.',
        },
        {
          stepNumber: 3,
          panelName: 'Color Mixer / HSL',
          action: 'Purify neon colors and eliminate olive greens',
          valuesToSet: 'Aqua Sat: +40 | Magenta Sat: +50 | Green Sat: -50 | Yellow Sat: -30',
          explanation: 'Strikes out distracting foliage or dirty street sodium to keep the palette strictly dual-tone.',
        },
        {
          stepNumber: 4,
          panelName: 'Effects Panel',
          action: 'Edge vignette to trap neon focus',
          valuesToSet: 'Amount: -30 | Midpoint: 35 | Feather: 80',
          explanation: 'Draws viewer focus straight into the glowing neon street corridor.',
        },
      ],
      quickShortcut: 'K (Adjustment Brush) · V (Toggle Black & White Preview)',
      proTip: 'Paint over bright neon signs with the Adjustment Brush: set Dehaze -15 and Highlights +30 to emulate glowing atmospheric fog around the light fixtures.',
    },
  },
};

export const LUT_IMPORT_INSTRUCTIONS = {
  davinci_resolve: [
    '1. Open DaVinci Resolve and navigate to File -> Project Settings (or click the Gear icon in the bottom-right).',
    '2. Go to the "Color Management" tab on the left sidebar.',
    '3. Scroll down to the "Lookup Tables" section and click the button labeled "Open LUT Folder".',
    '4. Copy your downloaded .CUBE file into the LUT directory (or create a custom folder like "Color Matrix Presets").',
    '5. Return to DaVinci Resolve Project Settings and click "Update Lists" so Resolve scans the new file.',
    '6. In your Color Page, right-click on your final output node, hover over "LUT", find your preset, and click to apply!',
  ],
  adobe_lightroom: [
    '1. Open Adobe Lightroom Classic and switch to the "Develop" module (Shortcut: D).',
    '2. In the left sidebar, locate the "Presets" panel and click the "+" icon at the top-right of the panel.',
    '3. Select "Import Develop Profiles and Presets..." from the dropdown menu.',
    '4. Select your downloaded .XMP preset file and click "Import".',
    '5. Your new cinematic preset will immediately appear under the "Color Psychology Matrix Presets" group.',
    '6. Click the preset once to instantly apply the full Lift/Gamma/Gain, temperature, and split-toning calibrations!',
  ],
};

export interface ResolvePipelineNode {
  order: number;
  label: string;
  tool: string;
  purpose: string;
  settings: string[];
  nodeType: 'serial' | 'parallel' | 'layer';
  watchFor?: string;
}

export interface ResolvePipeline {
  id: string;
  name: string;
  summary: string;
  bestFor: string[];
  colorManagement: {
    mode: string;
    inputColorSpace: string;
    timelineColorSpace: string;
    outputColorSpace: string;
  };
  nodes: ResolvePipelineNode[];
  tips: string[];
}

export interface ResolveToolGuide {
  tool: string;
  whatItDoes: string;
  whenToUse: string;
  tips: string[];
}

export interface LightroomRecipeStep {
  order: number;
  panel: string;
  goal: string;
  settings: string[];
  watchFor?: string;
}

export interface LightroomRecipe {
  id: string;
  name: string;
  summary: string;
  bestFor: string[];
  steps: LightroomRecipeStep[];
  tips: string[];
}

export const DAVINCI_PIPELINES: ResolvePipeline[] = [
  {
    id: 'resolve-cst-log-to-709',
    name: 'Log to Rec.709 with CST (Manual Color Managed)',
    summary: 'A clean, controllable node tree: convert camera log into a wide working space, grade there, then convert to Rec.709 for delivery.',
    bestFor: ['ARRI LogC3/4', 'Sony S-Log3', 'Canon C-Log2/3', 'RED Log3G10', 'Panasonic V-Log'],
    colorManagement: {
      mode: 'DaVinci YRGB with manual CST nodes',
      inputColorSpace: 'Camera log (e.g. ARRI LogC3 / Sony S-Log3 S-Gamut3.Cine)',
      timelineColorSpace: 'DaVinci Wide Gamut / DaVinci Intermediate',
      outputColorSpace: 'Rec.709, Gamma 2.4',
    },
    nodes: [
      {
        order: 1,
        label: 'Noise Reduction (optional)',
        tool: 'Noise Reduction',
        purpose: 'Clean up before any contrast or saturation work so sensor noise is not amplified.',
        settings: ['Temporal NR: 2-3 frames, Threshold 3-5', 'Spatial NR: Mode Faster/Better, light amount'],
        nodeType: 'serial',
        watchFor: 'Over-reduction makes human skin plastic and waxy.',
      },
      {
        order: 2,
        label: 'Input CST',
        tool: 'Color Space Transform (CST)',
        purpose: 'Convert camera log into DaVinci Wide Gamut / DaVinci Intermediate.',
        settings: [
          'Input Color Space: your camera gamut',
          'Input Gamma: your camera log curve',
          'Output Color Space: DaVinci Wide Gamut',
          'Output Gamma: DaVinci Intermediate',
          'Tone Mapping: None (or Luminance Mapping if needed)',
          'Gamut Mapping: Saturation Compression for extreme gamuts',
        ],
        nodeType: 'serial',
        watchFor: 'Wrong input settings are the #1 cause of clipped or inaccurate color rendering.',
      },
      {
        order: 3,
        label: 'Exposure / Balance',
        tool: 'Offset Wheel',
        purpose: 'Set exposure and neutral white balance on a reference gray or skin tone.',
        settings: [
          'Use Offset wheel for overall printer-light balance',
          'Check RGB Parade so R/G/B sit level on neutral areas',
        ],
        nodeType: 'serial',
      },
      {
        order: 4,
        label: 'Contrast & Pivot',
        tool: 'Primary Wheels',
        purpose: 'Establish contrast around a pivot near middle gray.',
        settings: [
          'Contrast 1.1–1.3',
          'Pivot around 0.435 for DaVinci Intermediate',
          'Saturation 50–60 (default), adjust later',
        ],
        nodeType: 'serial',
      },
      {
        order: 5,
        label: 'Skin Tone',
        tool: 'Qualifier / 3D Matte',
        purpose: 'Isolate skin and place it directly on the 123°–135° vectorscope skin line.',
        settings: [
          'HSL qualifier: pick skin; widen Hue slightly and soften with Blur Radius',
          'Use Hue vs Hue to shift skin toward the line',
        ],
        nodeType: 'parallel',
        watchFor: 'Hard qualifier edges cause visible edge haloing or noise chatter.',
      },
      {
        order: 6,
        label: 'Look: Hue vs Hue / Sat',
        tool: 'Hue vs Hue & Hue vs Sat Curves',
        purpose: 'Refine individual color families for the artistic look.',
        settings: [
          'Hue vs Sat: reduce overly saturated greens 10–20%',
          'Hue vs Hue: nudge foliage toward yellow-green or teal as the look requires',
        ],
        nodeType: 'serial',
      },
      {
        order: 7,
        label: 'Look: Color Warper',
        tool: 'Color Warper',
        purpose: 'Apply creative palette shifts with intuitive polar hue/sat handles.',
        settings: [
          'Move shadow-region hue handles toward teal',
          'Move highlight-region handles toward warm orange',
          'Keep skin region anchored and locked',
        ],
        nodeType: 'serial',
      },
      {
        order: 8,
        label: 'Film Texture',
        tool: 'Film Grain & Halation',
        purpose: 'Add organic grain and subtle halation for a true photochemical finish.',
        settings: [
          'Film Grain: choose a 35mm stock preset; keep Strength low (10–25%)',
          'Halation: Threshold high, Radius moderate, red-orange tint',
        ],
        nodeType: 'serial',
        watchFor: 'Excess grain on already compressed footage creates messy macroblocks.',
      },
      {
        order: 9,
        label: 'Output CST',
        tool: 'Color Space Transform (CST)',
        purpose: 'Convert the working space into standard Rec.709 Gamma 2.4 for delivery.',
        settings: [
          'Input Color Space: DaVinci Wide Gamut',
          'Input Gamma: DaVinci Intermediate',
          'Output Color Space: Rec.709',
          'Output Gamma: Gamma 2.4',
          'Tone Mapping: DaVinci / Luminance Mapping for smooth highlight roll-off',
          'Gamut Mapping: Saturation Compression',
        ],
        nodeType: 'serial',
        watchFor: 'Always place the output CST last, after all creative grading nodes.',
      },
    ],
    tips: [
      'Keep technical nodes (CSTs) separated from creative nodes so you can bypass them cleanly to debug.',
      'Name each node clearly; a labeled tree is far easier to hand off to another colorist or VFX artist.',
      'Use shot-level nodes for shot matching/balance and group-level nodes for the overarching show look.',
    ],
  },
  {
    id: 'resolve-teal-orange',
    name: 'Teal & Orange Split-Tone',
    summary: 'A modern blockbuster split-tone that keeps skin natural while pushing shadows cool and highlights warm.',
    bestFor: ['action', 'sci-fi', 'trailers', 'commercials'],
    colorManagement: {
      mode: 'Any; works best after a CST into a wide working space',
      inputColorSpace: 'Rec.709 or camera log after input CST',
      timelineColorSpace: 'DaVinci Wide Gamut / Rec.709',
      outputColorSpace: 'Rec.709, Gamma 2.4',
    },
    nodes: [
      {
        order: 1,
        label: 'Base Balance',
        tool: 'Primary Wheels',
        purpose: 'Neutralize the image first so the split tone is deliberate and repeatable.',
        settings: ['Balance whites and blacks using RGB Parade', 'Set contrast 1.1–1.2'],
        nodeType: 'serial',
      },
      {
        order: 2,
        label: 'Cool Shadows',
        tool: 'Log Wheels',
        purpose: 'Push shadows toward teal/blue-green without staining midtone skin.',
        settings: [
          'Shadow wheel: move toward cyan-teal (about 180–200 degrees), small amount',
          'Midtone wheel: tiny push toward blue to extend the cool range',
        ],
        nodeType: 'serial',
      },
      {
        order: 3,
        label: 'Warm Highlights',
        tool: 'Log Wheels',
        purpose: 'Push highlights toward warm orange for skin catchlights.',
        settings: ['Highlight wheel: move toward orange (about 20–35 degrees), small amount'],
        nodeType: 'serial',
      },
      {
        order: 4,
        label: 'Protect Skin',
        tool: 'Qualifier',
        purpose: 'Isolate skin and reduce the teal/orange influence so faces stay natural.',
        settings: [
          'HSL qualifier on skin; invert to affect background if needed',
          'Use Hue vs Hue to nudge skin onto the 123°–135° vectorscope line',
        ],
        nodeType: 'parallel',
        watchFor: 'Over-warm skin looks like orange plastic or sunburn.',
      },
      {
        order: 5,
        label: 'Background Teal Boost',
        tool: 'Hue vs Hue',
        purpose: 'Shift greens and blues toward teal for separation.',
        settings: [
          'Hue vs Hue: move green toward teal by 10–20 percent',
          'Hue vs Sat: lower saturation of competing greens',
        ],
        nodeType: 'serial',
      },
      {
        order: 6,
        label: 'Contrast Curve',
        tool: 'Curves',
        purpose: 'Add a gentle S-curve to finish the look.',
        settings: ['Custom curve: lower shadows slightly, raise highlights slightly'],
        nodeType: 'serial',
      },
    ],
    tips: [
      'Subtlety matters more than magnitude: nuanced looks age far better than aggressive presets.',
      'Check the vectorscope: skin should stay near the skin line while shadows lean cyan and highlights lean orange.',
    ],
  },
  {
    id: 'resolve-day-for-night',
    name: 'Day-for-Night (Nuit Américaine)',
    summary: 'Turn daylight footage into believable night using exposure reduction, Purkinje blue shift, sky darkening, and practical isolation.',
    bestFor: ['budget night scenes', 'westerns', 'war films', 'VFX plates'],
    colorManagement: {
      mode: 'Any',
      inputColorSpace: 'Rec.709 or camera log after input CST',
      timelineColorSpace: 'DaVinci Wide Gamut',
      outputColorSpace: 'Rec.709, Gamma 2.4',
    },
    nodes: [
      {
        order: 1,
        label: 'Base Balance',
        tool: 'Primary Wheels',
        purpose: 'Clean neutral balance before applying the nocturnal look.',
        settings: ['Balance whites using the RGB Parade'],
        nodeType: 'serial',
      },
      {
        order: 2,
        label: 'Exposure Down',
        tool: 'Primary Wheels',
        purpose: 'Reduce exposure by 2–3 stops equivalent.',
        settings: ['Gain down to about 0.25–0.45', 'Gamma down slightly; protect a little shadow detail'],
        nodeType: 'serial',
      },
      {
        order: 3,
        label: 'Blue Shift',
        tool: 'Primary Wheels',
        purpose: 'Move overall color temperature toward moonlight blue (Purkinje scotopic shift).',
        settings: ['Temperature around 4300–4800K equivalent', 'Shadows and midtones toward blue; keep skin from going gray'],
        nodeType: 'serial',
      },
      {
        order: 4,
        label: 'Desaturate',
        tool: 'Hue vs Sat',
        purpose: 'Human rod vision cannot detect color in the dark; lower saturation 25–40%.',
        settings: ['Global saturation 55–70', 'Keep a small amount of warm color in practical lights'],
        nodeType: 'serial',
      },
      {
        order: 5,
        label: 'Sky Control',
        tool: 'Power Window',
        purpose: 'Darken the sky with a soft gradient so it does not read as daytime.',
        settings: ['Linear window with soft edge from top of frame', 'Lower exposure strongly in the sky region'],
        nodeType: 'parallel',
        watchFor: 'Hard daylight shadows and a bright sky are the biggest tells.',
      },
      {
        order: 6,
        label: 'Highlight Control',
        tool: 'Qualifier',
        purpose: 'Pull down bright ground surfaces so they do not look sun-lit.',
        settings: ['Luma qualifier on highlights; reduce gain and add blue'],
        nodeType: 'parallel',
      },
      {
        order: 7,
        label: 'Practical Lights',
        tool: 'Qualifier & Glow',
        purpose: 'Add warmth and glow to lamps, headlights, or windows to sell the night.',
        settings: ['Qualify bright lights; push warm orange and add Glow'],
        nodeType: 'parallel',
      },
    ],
    tips: [
      'Overcast or backlit footage converts much more convincingly than frontal harsh sunlight.',
      'Lift contrast in the highlights slightly so light fixtures glow against the darker frame.',
    ],
  },
  {
    id: 'resolve-bleach-bypass',
    name: 'Bleach Bypass Look',
    summary: 'High-contrast, desaturated, silvery look with retained highlights, emulating silver retention in photochemical baths.',
    bestFor: ['war films', 'crime', 'dystopian drama'],
    colorManagement: {
      mode: 'Any',
      inputColorSpace: 'Rec.709 or after input CST',
      timelineColorSpace: 'DaVinci Wide Gamut / Rec.709',
      outputColorSpace: 'Rec.709, Gamma 2.4',
    },
    nodes: [
      {
        order: 1,
        label: 'Base Balance',
        tool: 'Primary Wheels',
        purpose: 'Neutral starting point.',
        settings: ['Balance whites and blacks'],
        nodeType: 'serial',
      },
      {
        order: 2,
        label: 'Desaturated Copy',
        tool: 'Primary Wheels',
        purpose: 'Create a desaturated layer for blending.',
        settings: ['Set Saturation to 0 on a parallel/layer node'],
        nodeType: 'layer',
      },
      {
        order: 3,
        label: 'Contrast Boost',
        tool: 'Curves',
        purpose: 'Strong S-curve on the desaturated layer.',
        settings: ['Steepen midtone contrast', 'Set the layer Key Output around 0.4–0.6 to blend'],
        nodeType: 'serial',
        watchFor: 'Pushing blacks too hard crushes facial detail.',
      },
      {
        order: 4,
        label: 'Skin Recovery',
        tool: 'Qualifier',
        purpose: 'Bring back some color in skin so faces are not totally dead.',
        settings: ['HSL qualifier on skin; restore saturation 20–35%'],
        nodeType: 'parallel',
      },
    ],
    tips: ['Add subtle 35mm film grain on node 5 to sell an authentic photochemical feel.'],
  },
];

export const DAVINCI_TOOL_GUIDES: ResolveToolGuide[] = [
  {
    tool: 'Hue vs Hue',
    whatItDoes: 'Rotates selected hues toward other hues without altering saturation or luminance.',
    whenToUse: 'Shift foliage toward yellow or teal, move skin onto the skin-tone line, fix off-color brand items.',
    tips: [
      'Use soft curves with wide support points to avoid posterization or banding.',
      'Always sample the target color with the picker directly in the viewer.',
    ],
  },
  {
    tool: 'Hue vs Sat',
    whatItDoes: 'Raises or lowers saturation for a selected hue family.',
    whenToUse: 'Tame oversaturated greens or reds, boost blues in skies, and refine a limited palette.',
    tips: ['Pull rather than push; subtle downward edits look far more natural than hyper-boosting.'],
  },
  {
    tool: 'Hue vs Lum',
    whatItDoes: 'Changes luminance brightness for a selected hue family.',
    whenToUse: 'Darken blue skies, brighten skin tones, or lift foliage without touching the rest of the frame.',
    tips: ['Check noise in the blue channel when darkening blue skies.'],
  },
  {
    tool: 'Color Warper',
    whatItDoes: 'Hue/Sat and Chroma/Luma grid for bending color regions with direct polar handles.',
    whenToUse: 'Fast creative palette work and complex non-linear color relationships.',
    tips: [
      'Lock handles around skin tones before moving neighboring background hues.',
      'Use Chroma-Luma mode to adjust saturation by brightness levels.',
    ],
  },
  {
    tool: 'CST (Color Space Transform)',
    whatItDoes: 'Mathematically converts between color spaces and gamma curves with tone and gamut mapping.',
    whenToUse: 'Move footage between camera log and a working or delivery space.',
    tips: [
      'Match input settings exactly to the camera recording specifications.',
      'Put the output CST at the very end of the node tree.',
    ],
  },
  {
    tool: 'Qualifier',
    whatItDoes: 'Selects an isolated 3D volumetric range of hue, saturation, and luminance.',
    whenToUse: 'Skin tone isolation, sky replacement, foliage control, and highlight recovery.',
    tips: [
      'Soften the matte with Blur Radius and Denoise.',
      'View the matte with Highlight (Shift+H) to check for edge chatter.',
    ],
  },
];

export const LIGHTROOM_RECIPES: LightroomRecipe[] = [
  {
    id: 'lr-cinematic-teal-orange',
    name: 'Cinematic Teal & Orange',
    summary: 'Warm skin and highlights against cool teal shadows and backgrounds, using Color Grading and HSL.',
    bestFor: ['urban portraits', 'street', 'travel', 'cinematic stills'],
    steps: [
      {
        order: 1,
        panel: 'Basic',
        goal: 'Set a clean, slightly flat base.',
        settings: [
          'Exposure: set for skin',
          'Contrast: +10 to +20',
          'Highlights: -40 to -70',
          'Shadows: +20 to +40',
          'Whites: +10',
          'Blacks: -10 to -20',
        ],
      },
      {
        order: 2,
        panel: 'HSL / Color',
        goal: 'Steer colors toward teal and orange.',
        settings: [
          'Orange: Saturation -5 to -15, Luminance +10',
          'Yellow: Hue toward orange (-10 to -20)',
          'Green: Hue toward teal (+20 to +40), Saturation -20 to -40',
          'Aqua: Saturation +10 to +20, Luminance -10',
          'Blue: Hue toward teal (-10 to -25)',
        ],
        watchFor: 'Moving Orange hue or saturation too far will tint skin unnaturally.',
      },
      {
        order: 3,
        panel: 'Color Grading',
        goal: 'Create split-toning between shadows and highlights.',
        settings: [
          'Shadows: Hue about 190–200, Saturation 20–35',
          'Highlights: Hue about 30–40, Saturation 15–30',
          'Midtones: Hue about 30–40, Saturation 5–10 (optional)',
          'Blending 50–60, Balance slightly toward shadows (-10 to -20)',
        ],
      },
      {
        order: 4,
        panel: 'Calibration',
        goal: 'Fine-tune the primaries for a deeper, more filmic palette.',
        settings: [
          'Red Primary: Hue +5 to +15, Saturation -5 to -10',
          'Green Primary: Hue +10 to +20, Saturation -10 to -20',
          'Blue Primary: Hue -10 to -20, Saturation +10 to +20',
          'Shadows Tint: +5 to +10 toward green or -5 to -10 toward magenta as needed',
        ],
        watchFor: 'Calibration changes affect every color; small adjustments go a long way.',
      },
      {
        order: 5,
        panel: 'Effects',
        goal: 'Add subtle grain and vignette.',
        settings: [
          'Grain Amount 10–20, Size 20–30, Roughness 40–50',
          'Vignette Amount -5 to -15 (optional)',
        ],
      },
    ],
    tips: [
      'Use Masking > Subject to protect skin from background teal shifts.',
      'Compare before and after at 100% zoom to check skin texture and noise floor.',
    ],
  },
  {
    id: 'lr-moody-depth',
    name: 'HSL Depth: Moody Landscape',
    summary: 'Use HSL luminance to carve depth: darken skies and foliage, brighten key subjects.',
    bestFor: ['landscape', 'architecture', 'moody travel'],
    steps: [
      {
        order: 1,
        panel: 'Basic',
        goal: 'Control the dynamic tonal range.',
        settings: [
          'Highlights -50 to -80',
          'Shadows +10 to +30',
          'Texture +10',
          'Dehaze +5 to +15',
        ],
      },
      {
        order: 2,
        panel: 'HSL / Color',
        goal: 'Create layered depth with selective channel luminance.',
        settings: [
          'Blue Luminance: -20 to -40 (deepen sky)',
          'Green Luminance: -15 to -30',
          'Yellow Luminance: +10 to +20 (light foliage)',
          'Orange Luminance: +5 to +15',
        ],
        watchFor: 'Darkening blue too much can introduce noise and banding in skies.',
      },
      {
        order: 3,
        panel: 'Color Grading',
        goal: 'Add subtle cool-to-warm tonal contrast.',
        settings: [
          'Shadows: Hue about 215–225, Saturation 15–25',
          'Highlights: Hue about 40–50, Saturation 10–20',
        ],
      },
      {
        order: 4,
        panel: 'Masking',
        goal: 'Use gradients and subject masks for spatial depth.',
        settings: [
          'Linear Gradient on sky: Exposure -0.3, Dehaze +10',
          'Radial mask on subject: Exposure +0.2',
        ],
      },
    ],
    tips: ['Use luminance rather than saturation to shape depth; it looks significantly more natural.'],
  },
  {
    id: 'lr-film-fade',
    name: 'Faded Film Portrait',
    summary: 'Soft, warm, and slightly faded look inspired by color negative stocks.',
    bestFor: ['portraits', 'weddings', 'lifestyle'],
    steps: [
      {
        order: 1,
        panel: 'Tone Curve',
        goal: 'Lift blacks and soften highlights for a matte feel.',
        settings: [
          'Point Curve: raise black point to about 8–15 of 255',
          'Lower top-right point slightly (about 245–250)',
          'Gentle S-curve in the midtones',
        ],
      },
      {
        order: 2,
        panel: 'Basic',
        goal: 'Warm, bright, soft base.',
        settings: [
          'Temp warmer by +300 to +600 K',
          'Exposure +0.1 to +0.3',
          'Contrast -10 to -20',
          'Highlights -30',
          'Whites -10',
        ],
      },
      {
        order: 3,
        panel: 'HSL / Color',
        goal: 'Pastel, creamy colors.',
        settings: [
          'Red Saturation -5',
          'Orange Luminance +10',
          'Green Saturation -20, Hue toward yellow (-15)',
          'Blue Saturation -15',
        ],
      },
      {
        order: 4,
        panel: 'Color Grading',
        goal: 'Warm highlights, slightly cool or green shadows.',
        settings: [
          'Shadows: Hue about 170–200, Saturation 8–15',
          'Highlights: Hue about 40–50, Saturation 15–25',
          'Blending 60',
        ],
      },
      {
        order: 5,
        panel: 'Effects',
        goal: 'Add film grain.',
        settings: ['Amount 15–25, Size 25–35, Roughness 50'],
      },
    ],
    tips: ['Do not over-fade skin; keep a little contrast in the face so facial features do not wash out.'],
  },
];

export const XMP_KEYS_DICTIONARY = {
  base: [
    { key: 'crs:Temperature', label: 'Temp', range: [2000, 50000], type: 'number', notes: 'Kelvin' },
    { key: 'crs:Tint', label: 'Tint', range: [-150, 150], type: 'number' },
    { key: 'crs:Exposure2012', label: 'Exposure', range: [-5, 5], type: 'number' },
    { key: 'crs:Contrast2012', label: 'Contrast', range: [-100, 100], type: 'number' },
    { key: 'crs:Highlights2012', label: 'Highlights', range: [-100, 100], type: 'number' },
    { key: 'crs:Shadows2012', label: 'Shadows', range: [-100, 100], type: 'number' },
    { key: 'crs:Whites2012', label: 'Whites', range: [-100, 100], type: 'number' },
    { key: 'crs:Blacks2012', label: 'Blacks', range: [-100, 100], type: 'number' },
    { key: 'crs:Texture', label: 'Texture', range: [-100, 100], type: 'number' },
    { key: 'crs:Clarity2012', label: 'Clarity', range: [-100, 100], type: 'number' },
    { key: 'crs:Dehaze', label: 'Dehaze', range: [-100, 100], type: 'number' },
    { key: 'crs:Vibrance', label: 'Vibrance', range: [-100, 100], type: 'number' },
    { key: 'crs:Saturation', label: 'Saturation', range: [-100, 100], type: 'number' },
    { key: 'crs:GrainAmount', label: 'Grain Amount', range: [0, 100], type: 'number' },
    { key: 'crs:GrainSize', label: 'Grain Size', range: [0, 100], type: 'number' },
    { key: 'crs:GrainFrequency', label: 'Grain Roughness', range: [0, 100], type: 'number' },
    { key: 'crs:PostCropVignetteAmount', label: 'Vignette Amount', range: [-100, 100], type: 'number' },
  ],
  calibration: [
    { key: 'crs:ShadowTint', label: 'Shadows Tint', range: [-100, 100], type: 'number' },
    { key: 'crs:RedHue', label: 'Red Primary Hue', range: [-100, 100], type: 'number' },
    { key: 'crs:RedSaturation', label: 'Red Primary Saturation', range: [-100, 100], type: 'number' },
    { key: 'crs:GreenHue', label: 'Green Primary Hue', range: [-100, 100], type: 'number' },
    { key: 'crs:GreenSaturation', label: 'Green Primary Saturation', range: [-100, 100], type: 'number' },
    { key: 'crs:BlueHue', label: 'Blue Primary Hue', range: [-100, 100], type: 'number' },
    { key: 'crs:BlueSaturation', label: 'Blue Primary Saturation', range: [-100, 100], type: 'number' },
  ],
  colorGrading: [
    { key: 'crs:ColorGradeShadowHue', label: 'Shadows Hue', range: [0, 360], type: 'number' },
    { key: 'crs:ColorGradeShadowSat', label: 'Shadows Saturation', range: [0, 100], type: 'number' },
    { key: 'crs:ColorGradeShadowLum', label: 'Shadows Luminance', range: [-100, 100], type: 'number' },
    { key: 'crs:ColorGradeMidtoneHue', label: 'Midtones Hue', range: [0, 360], type: 'number' },
    { key: 'crs:ColorGradeMidtoneSat', label: 'Midtones Saturation', range: [0, 100], type: 'number' },
    { key: 'crs:ColorGradeMidtoneLum', label: 'Midtones Luminance', range: [-100, 100], type: 'number' },
    { key: 'crs:ColorGradeHighlightHue', label: 'Highlights Hue', range: [0, 360], type: 'number' },
    { key: 'crs:ColorGradeHighlightSat', label: 'Highlights Saturation', range: [0, 100], type: 'number' },
    { key: 'crs:ColorGradeHighlightLum', label: 'Highlights Luminance', range: [-100, 100], type: 'number' },
    { key: 'crs:ColorGradeBlending', label: 'Blending', range: [0, 100], type: 'number' },
  ],
};

export const EXPORT_FORMATS_TECHNICAL = [
  {
    id: 'cube',
    extension: '.cube',
    name: '3D LUT (Cube)',
    description: 'Text-based 3D lookup table: a grid of RGB output values for sampled RGB inputs.',
    worksIn: ['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro', 'OBS', 'monitors & cameras'],
    notes: [
      'Common sizes: 17, 33 and 65 points per axis. 17 is fast/realtime, 33 is production standard.',
      'Declare input range with DOMAIN_MIN/DOMAIN_MAX and size with LUT_3D_SIZE.',
      'Cube data is ordered with red changing fastest, then green, then blue.',
    ],
  },
  {
    id: 'xmp',
    extension: '.xmp',
    name: 'Lightroom / Camera Raw Preset',
    description: 'XML preset that stores develop settings (crs: keys) for Lightroom Classic and Adobe Camera Raw.',
    worksIn: ['Lightroom Classic', 'Lightroom CC', 'Adobe Camera Raw (Photoshop)'],
    notes: [
      'Color Grading keys require recent Lightroom versions; split-toning keys cover legacy versions.',
      'Stored in user Presets directory.',
    ],
  },
  {
    id: 'ase',
    extension: '.ase',
    name: 'Adobe Swatch Exchange',
    description: 'Binary swatch format for sharing named color palettes across Adobe apps.',
    worksIn: ['Photoshop', 'Illustrator', 'InDesign', 'Affinity Designer'],
    notes: ['Stores exact float RGB coordinates with swatch name labels.'],
  },
  {
    id: 'pdf',
    extension: '.pdf',
    name: 'PDF Lookbook & Cheat Sheet',
    description: 'A printable vector document with swatches, wheel coordinates, Lightroom values, and lighting ratios.',
    worksIn: ['Any PDF viewer, tablet, on-set monitor'],
    notes: ['Includes exact numerical settings for instant colorist reproduction on set.'],
  },
];
