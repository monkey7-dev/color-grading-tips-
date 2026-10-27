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
