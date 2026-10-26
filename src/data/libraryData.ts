/**
 * Academic & Reference Library Data: Josef Albers, Goethe vs. Newton, and Direct Citations
 */

export interface ReferenceResource {
  id: string;
  title: string;
  author: string;
  category: 'perception' | 'cinematography' | 'accessibility' | 'lighting' | 'skin_tone';
  keyTakeaway: string;
  url: string;
  urlLabel: string;
  publication: string;
}

export const ACADEMIC_RESOURCES: ReferenceResource[] = [
  {
    id: 'albers_interaction',
    title: 'Interaction of Color',
    author: 'Josef Albers',
    category: 'perception',
    keyTakeaway: 'Demonstrates that color is the most relative medium in art; one color can look completely different depending on its surrounding background (Simultaneous Contrast and Subtraction of Color). One color evokes innumerable readings.',
    url: 'https://archive.org/details/interactionofcol0000albe',
    urlLabel: 'Read on Archive.org',
    publication: 'Yale University Press (1963)',
  },
  {
    id: 'goethe_colours',
    title: 'Theory of Colours (Zur Farbenlehre)',
    author: 'Johann Wolfgang von Goethe',
    category: 'perception',
    keyTakeaway: 'Pioneer work on human psychological perception of color vs. pure physics. Discovered physiological after-images, colored shadows, and human psychological emotional responses to polar warm vs cool hues.',
    url: 'https://www.gutenberg.org/ebooks/50572',
    urlLabel: 'Read on Project Gutenberg',
    publication: 'J. Murray, London (Original 1810 / English 1840)',
  },
  {
    id: 'w3c_wcag',
    title: 'W3C Web Content Accessibility Guidelines (WCAG 2.1 - Color Contrast)',
    author: 'World Wide Web Consortium (W3C)',
    category: 'accessibility',
    keyTakeaway: 'Specifies the mathematical relative luminance standards: minimum 4.5:1 for standard text (AA), 7:1 (AAA), and 3:1 for large text and UI components. Essential for universal web legibility.',
    url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    urlLabel: 'W3C Contrast Guidelines',
    publication: 'W3C Recommendation',
  },
  {
    id: 'coblis_simulator',
    title: 'Color Blindness Simulator & Perception Guide',
    author: 'Coblis / Colblindor',
    category: 'accessibility',
    keyTakeaway: 'Mathematical matrices modeling anomalous trichromacy and dichromacy (Protanopia L-cone, Deuteranopia M-cone, Tritanopia S-cone, and Achromatopsia rod monochromacy) based on Brettel & Machado models.',
    url: 'https://www.color-blindness.com/coblis-color-blindness-simulator/',
    urlLabel: 'Coblis Perception Guide',
    publication: 'Colblindor Technical Standards',
  },
  {
    id: 'dave_morrow_color',
    title: 'Comprehensive Color Theory in Photography & HSL Guide',
    author: 'Dave Morrow Photography',
    category: 'cinematography',
    keyTakeaway: 'Masterguide translating classical color wheel harmonies (complementary, analogous, triadic) directly into RAW landscape and cinematic camera workflows using HSL color isolation.',
    url: 'https://www.davemorrowphotography.com/color-theory-photography',
    urlLabel: 'Dave Morrow Color Theory Guide',
    publication: 'Dave Morrow Photography Masterclass',
  },
  {
    id: 'on1_color_temp',
    title: 'Understanding Color Temperature & Kelvin Lighting in Photography',
    author: 'ON1 Photo Research',
    category: 'lighting',
    keyTakeaway: 'Detailed breakdown of the Kelvin thermodynamic temperature scale from candlelight (1800K) to deep blue hour sky (10,000K), demonstrating how mixed lighting destroys or enhances scene depth.',
    url: 'https://www.on1.com/blog/understanding-color-temperature-in-photography/',
    urlLabel: 'ON1 Lighting Breakdown',
    publication: 'ON1 Educational Series',
  },
  {
    id: 'davinci_resolve_guide',
    title: 'Official DaVinci Resolve Colorist Guide & Training',
    author: 'Blackmagic Design Certified Training',
    category: 'cinematography',
    keyTakeaway: 'The industry-standard manual for node-based color grading, Color Space Transform (CST), 3D Qualifiers, Log exposure curves, and broadcast legal scopes.',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve/training',
    urlLabel: 'Blackmagic Training Materials',
    publication: 'Blackmagic Design Official Manuals',
  },
  {
    id: 'itten_art_of_color',
    title: 'The Art of Color: The Subjective Experience and Objective Rationale of Color',
    author: 'Johannes Itten (Bauhaus)',
    category: 'perception',
    keyTakeaway: 'Seminal Bauhaus color masterwork establishing the Seven Color Contrasts: Hue, Light-Dark, Cold-Warm, Complementary, Simultaneous, Saturation, and Extension/Proportion (60/30/10 spatial distribution).',
    url: 'https://monoskop.org/images/4/46/Itten_Johannes_The_Art_of_Color.pdf',
    urlLabel: 'Bauhaus Color Treatise',
    publication: 'Reinhold Publishing (1961)',
  },
  {
    id: 'hullfish_color_correction',
    title: 'The Art and Technique of Digital Color Correction',
    author: 'Steve Hullfish',
    category: 'cinematography',
    keyTakeaway: 'Authoritative cinema colorist manual breaking down primary and secondary grading, matching shots across scenes, vectorscope 135° skin tone alignment, and visual storytelling under changing illumination.',
    url: 'https://www.taylorfrancis.com/books/mono/10.4324/9780240817996/art-technique-digital-color-correction-steve-hullfish',
    urlLabel: 'Focal Press Guide',
    publication: 'Focal Press / Routledge (2012)',
  },
  {
    id: 'van_hurkman_handbook',
    title: 'Color Correction Handbook: Professional Techniques for Video and Cinema (2nd Edition)',
    author: 'Alexis Van Hurkman',
    category: 'cinematography',
    keyTakeaway: 'The definitive bible of digital grading. Explains node structures, CST color management, perceptual contrast perception, gamut remapping, and isolating human subjects from background landscapes.',
    url: 'https://www.peachpit.com/store/color-correction-handbook-professional-techniques-for-9780321929662',
    urlLabel: 'Peachpit Press Handbook',
    publication: 'Peachpit Press (2014)',
  },
];

export interface GoetheNewtonPoint {
  dimension: string;
  newtonView: string;
  goetheView: string;
  modernConsensus: string;
}

export const GOETHE_VS_NEWTON: GoetheNewtonPoint[] = [
  {
    dimension: 'Nature of Light',
    newtonView: 'Homogeneous white light is an objective compound mixture of distinct refrangible rays of varying wavelengths (physical optics).',
    goetheView: 'Light is the simplest, most indivisible primordial entity (Urphänomen); color is not inside light, but born at the boundary where Light interacts with Darkness.',
    modernConsensus: 'Newton solved the physical electromagnetic wave-particle reality; Goethe discovered the physiological and perceptual psychology of the human eye and brain.',
  },
  {
    dimension: 'Darkness / Shadows',
    newtonView: 'Darkness is purely passive: the mathematical absence of radiant photons ($E = 0$).',
    goetheView: 'Darkness is an active, polar participant. Colored shadows (e.g. blue shadows under yellow candlelight) prove that darkness stimulates opposing chromatic responses.',
    modernConsensus: 'Goethe was right about human retinal perception: when the eye is stimulated by yellow light, receptive field lateral inhibition actively generates blue chromatic sensations in adjacent unlit shadows.',
  },
  {
    dimension: 'Color Circle & Complements',
    newtonView: 'Seven spectral rainbow colors arranged mathematically by musical intervals; complementary colors physically mix into neutral white light.',
    goetheView: 'Symmetrical 6-color psychological circle (Red, Yellow, Green, Cyan, Blue, Magenta). Staring at red produces an involuntary green after-image on the retina.',
    modernConsensus: 'Goethe’s opponent-process theory (red-green, blue-yellow, black-white) directly predicted modern neuroscience (Ewald Hering & Hurvich-Jameson retinal ganglion cell architecture).',
  },
  {
    dimension: 'Emotional / Psychological Impact',
    newtonView: 'Disregarded subjective human emotion as irrelevant to objective physical optics and mechanical prisms.',
    goetheView: 'Colors possess innate sensuous-moral qualities: warm colors (yellow, orange, red) arouse energetic, aspirational, joyous states; cold colors (blue, indigo) induce restless, yearning, melancholic introspection.',
    modernConsensus: 'Modern color psychology, cinema art direction, and UI design rely extensively on Goethe’s empirical observations of human emotional resonance.',
  },
];

export interface AlbersPrinciple {
  title: string;
  tagline: string;
  explanation: string;
  practicalImplication: string;
}

export const ALBERS_PRINCIPLES: AlbersPrinciple[] = [
  {
    title: 'Simultaneous Contrast',
    tagline: 'A color looks darker on a light ground, and lighter on a dark ground.',
    explanation: 'The retina uses lateral inhibition: photoreceptors that receive strong stimulation suppress the sensitivity of neighboring cells. Consequently, an identical medium-gray square placed on a black background appears luminous and silvery, while on a pure white background it appears murky and dim.',
    practicalImplication: 'In cinematography and UI design, you do not need to make an element brighter to make it pop—you can simply darken its surrounding background.',
  },
  {
    title: 'Color Subtraction & Hue Shifting',
    tagline: 'A background subtracts its own hue from colors placed inside it.',
    explanation: 'When a neutral or tinted swatch sits within a highly saturated color field, the background forces the inner swatch to shift towards the background’s complementary color. A warm gray square surrounded by intense yellow will appear distinctly cool violet-blue.',
    practicalImplication: 'When color grading skin tones against a heavily stylized teal/cyan background, the audience’s visual system will automatically push the skin tone warmer and more saturated than it actually is on the scopes.',
  },
  {
    title: 'Relative Luminance & Vanishing Boundaries',
    tagline: 'Colors of equal luminance lose their edge definition regardless of hue difference.',
    explanation: 'The human visual cortex processes form and motion primarily through the magnocellular pathway (which detects luminance contrast, not hue). If two radically different hues (e.g. vibrant red and vibrant cyan) share identical luminance, their boundary vibrates or vanishes into perceptual ambiguity.',
    practicalImplication: 'Crucial for accessibility: never rely on hue alone for UI boundaries, buttons, or typography. Without sufficient luminance delta (WCAG 4.5:1), text dissolves into optical vibration.',
  },
];
