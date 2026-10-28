/**
 * Comprehensive dataset for Psychology & Emotions Matrix
 */

export interface CulturalMeaning {
  western: string;
  eastern: string;
  middleEastern: string;
}

export interface AssociatedColor {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  role: string;
}

export interface EmotionTraitItem {
  id: string;
  name: string;
  category: 'primary_emotion' | 'psychological_trait' | 'emotional_state';
  categoryLabel: string;
  tagline: string;
  primaryColor: string;
  associatedColors: AssociatedColor[];
  psychologicalTriggers: string[];
  physiologicalResponses: string[];
  culturalVariations: CulturalMeaning;
  cinematicReference: {
    film: string;
    director: string;
    description: string;
  };
  connectedItemIds: string[]; // for the network / graph visualization
}

export const PSYCHOLOGY_ITEMS: EmotionTraitItem[] = [
  // 1. Primary Emotions
  {
    id: 'joy',
    name: 'Joy',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Expansive vitality, radiant warmth, and buoyant optimism.',
    primaryColor: '#F59E0B',
    associatedColors: [
      { name: 'Radiant Amber', hex: '#F59E0B', rgb: 'rgb(245, 158, 11)', hsl: 'hsl(38, 92%, 50%)', role: 'Dominant (Key)' },
      { name: 'Warm Marigold', hex: '#FBBF24', rgb: 'rgb(251, 191, 36)', hsl: 'hsl(43, 96%, 56%)', role: 'Secondary' },
      { name: 'Soft Peach', hex: '#FED7AA', rgb: 'rgb(254, 215, 170)', hsl: 'hsl(32, 98%, 83%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Visual cues of sunlight, flowering spring nature, and warm hearth light',
      'High luminance with low saturation variance promotes psychological safety',
    ],
    physiologicalResponses: [
      'Dopamine and serotonin release in the mesolimbic pathway',
      'Mild vasodilation, drop in resting pulse tension, smiling muscle activation (zygomaticus major)',
    ],
    culturalVariations: {
      western: 'Signifies happiness, optimism, summer warmth, and commercial friendliness.',
      eastern: 'In China, yellow is the sacred imperial color representing nobility, harvest, and supreme center of the earth.',
      middleEastern: 'Represents prosperity, golden desert sun, life, and hospitality.',
    },
    cinematicReference: {
      film: 'Amélie (2001)',
      director: 'Jean-Pierre Jeunet',
      description: 'Lush golden yellows, vibrant warm greens, and rich reds create a whimsical, romantic fairy-tale world.',
    },
    connectedItemIds: ['bliss', 'nostalgic', 'passion', 'serene'],
  },
  {
    id: 'anger',
    name: 'Anger',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Visceral friction, urgent alarm, and confrontational intensity.',
    primaryColor: '#DC2626',
    associatedColors: [
      { name: 'Crimson Fury', hex: '#DC2626', rgb: 'rgb(220, 38, 38)', hsl: 'hsl(0, 72%, 51%)', role: 'Dominant (Key)' },
      { name: 'Blood Vermillion', hex: '#991B1B', rgb: 'rgb(153, 27, 27)', hsl: 'hsl(0, 70%, 35%)', role: 'Secondary' },
      { name: 'Molten Charcoal', hex: '#1C1917', rgb: 'rgb(28, 25, 23)', hsl: 'hsl(24, 10%, 10%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Visual perception of arterial blood, open fire, and warning coloration in apex predators',
      'High-contrast warm saturated fields stimulate threat evaluation networks',
    ],
    physiologicalResponses: [
      'Adrenaline surge, sympathetic nervous system arousal, elevation of systolic blood pressure',
      'Increased heart rate, elevated galvanic skin response, heightened muscle tone',
    ],
    culturalVariations: {
      western: 'Danger, emergency stop, stop signs, passion, aggression, and romantic lust.',
      eastern: 'Good fortune, marriage celebration, joy, warding off demonic spirits (China/Vietnam).',
      middleEastern: 'Courage, danger, self-sacrifice, and martial valor.',
    },
    cinematicReference: {
      film: 'Mad Max: Fury Road (2015)',
      director: 'George Miller',
      description: 'Blazing saturated red flares and molten desert sands symbolize unrelenting fury, combat, and primal survival.',
    },
    connectedItemIds: ['dominance', 'passion', 'chaotic', 'anxiety'],
  },
  {
    id: 'sadness',
    name: 'Sadness',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Quiet introspection, depleted warmth, and emotional withdrawal.',
    primaryColor: '#3B82F6',
    associatedColors: [
      { name: 'Melancholy Slate', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)', hsl: 'hsl(217, 91%, 60%)', role: 'Dominant (Key)' },
      { name: 'Deep Cobalt', hex: '#1E3A8A', rgb: 'rgb(30, 58, 138)', hsl: 'hsl(224, 64%, 33%)', role: 'Secondary' },
      { name: 'Overcast Pewter', hex: '#64748B', rgb: 'rgb(100, 116, 139)', hsl: 'hsl(215, 16%, 47%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Cold rainy skies, absence of solar warmth, empty oceanic horizons',
      'Subdued luminance and desaturated hues mimic twilight and sensory withdrawal',
    ],
    physiologicalResponses: [
      'Suppression of sympathetic tone, slowing of breathing and speech rate',
      'Activation of lacrimal glands, lower body temperature perception',
    ],
    culturalVariations: {
      western: 'The "blues", depression, mourning, winter solemnity, corporate stability.',
      eastern: 'In Korea, blue represents rebirth and spring; in Hinduism, Krishna is depicted in sacred blue.',
      middleEastern: 'Spiritual contemplation, protection against the envious evil eye (Nazār amulet).',
    },
    cinematicReference: {
      film: 'Manchester by the Sea (2016)',
      director: 'Kenneth Lonergan',
      description: 'Sterile overcast Atlantic coastal blues and muted winter grays reflect unresolved grief and emotional numbness.',
    },
    connectedItemIds: ['melancholy', 'isolation', 'vulnerable'],
  },
  {
    id: 'fear',
    name: 'Fear',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Impending dread, disorientation, and hyper-vigilance.',
    primaryColor: '#6D28D9',
    associatedColors: [
      { name: 'Ominous Violet', hex: '#6D28D9', rgb: 'rgb(109, 40, 217)', hsl: 'hsl(263, 69%, 50%)', role: 'Dominant (Key)' },
      { name: 'Abyssal Black', hex: '#0F172A', rgb: 'rgb(15, 23, 42)', hsl: 'hsl(222, 47%, 11%)', role: 'Secondary' },
      { name: 'Sickly Chartreuse', hex: '#84CC16', rgb: 'rgb(132, 204, 22)', hsl: 'hsl(84, 81%, 44%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Unnatural night illumination, poisonous botanical pigments, decaying bio-matter',
      'Extreme contrast between deep shadows and radioactive green-violet accents',
    ],
    physiologicalResponses: [
      'Cortisol elevation, pupillary dilation, peripheral vasoconstriction (cold hands)',
      'Heightened startle reflex, shallow diaphragmatic breathing',
    ],
    culturalVariations: {
      western: 'The supernatural, Gothic horror, witchcraft, and poisonous decay.',
      eastern: 'In Thailand, purple is worn by mourning widows; in Japan, historically reserved for high rank.',
      middleEastern: 'Associated with sorrow, black/deep purple signifies profound loss and solemnity.',
    },
    cinematicReference: {
      film: 'The Ring (2002) / Alien (1979)',
      director: 'Gore Verbinski / Ridley Scott',
      description: 'Uncanny cold green-cyan hues and deep ink shadows evoke deep dread and cosmic horror.',
    },
    connectedItemIds: ['anxiety', 'chaotic', 'isolation'],
  },
  {
    id: 'trust',
    name: 'Trust',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Reliability, structural permanence, and calm assurance.',
    primaryColor: '#0284C7',
    associatedColors: [
      { name: 'Architectural Azure', hex: '#0284C7', rgb: 'rgb(2, 132, 199)', hsl: 'hsl(200, 98%, 39%)', role: 'Dominant (Key)' },
      { name: 'Deep Navy', hex: '#0C4A6E', rgb: 'rgb(12, 74, 110)', hsl: 'hsl(202, 80%, 24%)', role: 'Secondary' },
      { name: 'Crisp Porcelain', hex: '#E0F2FE', rgb: 'rgb(224, 242, 254)', hsl: 'hsl(204, 94%, 94%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Clear unpolluted water, cloudless skies, pristine stone and glass architecture',
      'Medium luminance with low chromatic saturation signals stability and cleanliness',
    ],
    physiologicalResponses: [
      'Slowing of pulse, reduction of cortisol, induction of steady alpha brainwave patterns (8-12 Hz)',
      'Normalized respiration, subjective perception of physical security',
    ],
    culturalVariations: {
      western: 'Financial institutions, medical technology, corporate authority, security.',
      eastern: 'Immortality, peace, celestial harmony.',
      middleEastern: 'Heaven, purity, tranquility, protective talismans.',
    },
    cinematicReference: {
      film: 'Arrival (2016)',
      director: 'Denis Villeneuve',
      description: 'Controlled desaturated slate-blues and atmospheric cool tones establish intellectual restraint and scientific rigor.',
    },
    connectedItemIds: ['intellectual', 'serene', 'vulnerable'],
  },
  {
    id: 'disgust',
    name: 'Disgust',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Repulsion, moral contamination, and biological rejection.',
    primaryColor: '#65A30D',
    associatedColors: [
      { name: 'Bile Olive', hex: '#65A30D', rgb: 'rgb(101, 163, 13)', hsl: 'hsl(85, 78%, 35%)', role: 'Dominant (Key)' },
      { name: 'Rotten Umber', hex: '#713F12', rgb: 'rgb(113, 63, 18)', hsl: 'hsl(28, 73%, 26%)', role: 'Secondary' },
      { name: 'Ooze Mustard', hex: '#A16207', rgb: 'rgb(161, 98, 7)', hsl: 'hsl(35, 92%, 33%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Decomposing organic matter, spoiled milk, toxic molds, infected wounds',
      'Unbalanced yellow-green mixtures with muddy brown undertones',
    ],
    physiologicalResponses: [
      'Activation of the anterior insula, levator labii superioris contraction (curled upper lip)',
      'Salivary secretion shifts, gastrointestinal distress / nausea threshold lowered',
    ],
    culturalVariations: {
      western: 'Rot, sickness, slime, toxicity, repulsive environments.',
      eastern: 'Often associated with low-caste decay or polluted watercourses.',
      middleEastern: 'Associated with uncleanness and bodily contamination.',
    },
    cinematicReference: {
      film: 'Seven (1995)',
      director: 'David Fincher',
      description: 'Sickly jaundiced greens, grime-soaked ambers, and slimy shadows convey pervasive moral and physical decay.',
    },
    connectedItemIds: ['chaotic', 'anxiety'],
  },
  {
    id: 'surprise',
    name: 'Surprise',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Abrupt cognitive shift, startle revelation, and heightened orientation.',
    primaryColor: '#EC4899',
    associatedColors: [
      { name: 'Shock Magenta', hex: '#EC4899', rgb: 'rgb(236, 72, 153)', hsl: 'hsl(330, 81%, 60%)', role: 'Dominant (Key)' },
      { name: 'Electric Cyan', hex: '#06B6D4', rgb: 'rgb(6, 182, 212)', hsl: 'hsl(189, 94%, 43%)', role: 'Secondary' },
      { name: 'Strobe White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', hsl: 'hsl(0, 0%, 100%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Sudden flash of ultra-saturated non-spectral pigment interrupting a neutral visual field',
      'Novelty stimulus bypassing conscious filtering straight to the amygdala',
    ],
    physiologicalResponses: [
      'Frontalis muscle contraction (eyebrows raised), widening of palpebral fissures (eye aperture expands)',
      'Instant inhalation gasp, brief cessation of motor movement',
    ],
    culturalVariations: {
      western: 'Playfulness, neon modernity, pop art shock value, sudden festive bursts.',
      eastern: 'Modern pop culture / youth innovation in Japan and South Korea.',
      middleEastern: 'Rarely used in traditional settings; denotes novelty and modern fashion.',
    },
    cinematicReference: {
      film: 'Spider-Man: Into the Spider-Verse (2018)',
      director: 'Persichetti / Ramsey / Rothman',
      description: 'Electric CMYK chromatic aberrations and neon pinks snap the audience into perceptual alert.',
    },
    connectedItemIds: ['chaotic', 'bliss', 'joy'],
  },
  {
    id: 'anticipation',
    name: 'Anticipation',
    category: 'primary_emotion',
    categoryLabel: 'Primary Emotion',
    tagline: 'Forward momentum, poised expectancy, and impending transition.',
    primaryColor: '#EA580C',
    associatedColors: [
      { name: 'Dawn Tangerine', hex: '#EA580C', rgb: 'rgb(234, 88, 12)', hsl: 'hsl(21, 90%, 48%)', role: 'Dominant (Key)' },
      { name: 'Solar Copper', hex: '#C2410C', rgb: 'rgb(194, 65, 12)', hsl: 'hsl(17, 88%, 40%)', role: 'Secondary' },
      { name: 'Horizon Gold', hex: '#FDE047', rgb: 'rgb(253, 224, 71)', hsl: 'hsl(50, 98%, 64%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Pre-dawn horizon, countdown cues, energetic warm gradients signifying imminent activity',
      'Intermediate warm spectrum (590-620nm) triggers active searching behavior',
    ],
    physiologicalResponses: [
      'Heightened sensory threshold, increased saccadic eye movements',
      'Mild dopamine ramping (the dopamine molecule of anticipation rather than consumption)',
    ],
    culturalVariations: {
      western: 'Youth, autumn harvest, construction, dynamism, sports energy.',
      eastern: 'Transformation and spiritual awakening in Buddhist saffron robes.',
      middleEastern: 'Flames, warmth, desert hospitality, sunset prayers.',
    },
    cinematicReference: {
      film: 'Dune: Part One & Two (2021/2024)',
      director: 'Denis Villeneuve',
      description: 'Atmospheric amber dust and burning horizon hues build relentless tension of destiny and impending holy war.',
    },
    connectedItemIds: ['passion', 'joy', 'dominance'],
  },

  // 2. Psychological Traits
  {
    id: 'dominance',
    name: 'Dominance',
    category: 'psychological_trait',
    categoryLabel: 'Psychological Trait',
    tagline: 'Commanding authority, unyielding weight, and sovereign control.',
    primaryColor: '#881337',
    associatedColors: [
      { name: 'Imperial Maroon', hex: '#881337', rgb: 'rgb(136, 19, 55)', hsl: 'hsl(342, 75%, 30%)', role: 'Dominant (Key)' },
      { name: 'Obsidian Velvet', hex: '#0A0A0A', rgb: 'rgb(10, 10, 10)', hsl: 'hsl(0, 0%, 4%)', role: 'Secondary' },
      { name: 'Polished Brass', hex: '#D97706', rgb: 'rgb(217, 119, 6)', hsl: 'hsl(32, 95%, 44%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'High contrast ratio, deep low-key chiaroscuro, heavy dark foregrounds anchoring the frame',
      'Warm deep red/purple tones historically restricted to emperors and commanders',
    ],
    physiologicalResponses: [
      'Perception of intimidation, elevation in viewer testosterone when holding the gaze',
      'Suppression of casual fidgeting, prolonged auditory focus',
    ],
    culturalVariations: {
      western: 'Monarchy, judicial gravity, boardroom executive power, high luxury.',
      eastern: 'Imperial sovereignty (Forbidden City palace crimson walls and roofs).',
      middleEastern: 'Sovereignty, regal heritage, military fortitude.',
    },
    cinematicReference: {
      film: 'The Godfather (1972)',
      director: 'Francis Ford Coppola',
      description: 'Gordon Willis’s underexposed, top-lit mahogany and deep crimson office exudes sinister patriarch dominance.',
    },
    connectedItemIds: ['anger', 'passion', 'intellectual'],
  },
  {
    id: 'vulnerable',
    name: 'Vulnerable',
    category: 'psychological_trait',
    categoryLabel: 'Psychological Trait',
    tagline: 'Fragile openness, raw exposure, and unarmored sensitivity.',
    primaryColor: '#F472B6',
    associatedColors: [
      { name: 'Pale Rose Quartz', hex: '#F472B6', rgb: 'rgb(244, 114, 182)', hsl: 'hsl(329, 86%, 70%)', role: 'Dominant (Key)' },
      { name: 'Translucent Bone', hex: '#F5F5F4', rgb: 'rgb(245, 245, 244)', hsl: 'hsl(60, 5%, 96%)', role: 'Secondary' },
      { name: 'Bruised Lavender', hex: '#C084FC', rgb: 'rgb(192, 132, 252)', hsl: 'hsl(270, 95%, 75%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Soft diffused high-key lighting, absence of dark shadows, fleshy desaturated pastels',
      'Mimics newborn skin, unhealed scar tissue, and petals stripped of defensive bark',
    ],
    physiologicalResponses: [
      'Oxytocin release in supportive viewers, drop in defensive posturing',
      'Slight lowering of vocal pitch, softened facial expression',
    ],
    culturalVariations: {
      western: 'Delicacy, innocence, childhood, tenderness, intimate disclosure.',
      eastern: 'Cherry blossoms (Sakura) in Japan: ephemeral beauty and transience of human life (Mono no aware).',
      middleEastern: 'Gentleness, modesty, maternal devotion.',
    },
    cinematicReference: {
      film: 'Her (2013)',
      director: 'Spike Jonze',
      description: 'Theodore Twombly’s world of soft salmon, tender rose, and cream tones reflects bare, aching human vulnerability.',
    },
    connectedItemIds: ['sadness', 'serene', 'melancholy'],
  },
  {
    id: 'serene',
    name: 'Serene',
    category: 'psychological_trait',
    categoryLabel: 'Psychological Trait',
    tagline: 'Harmonious stillness, breathable space, and inner equilibrium.',
    primaryColor: '#059669',
    associatedColors: [
      { name: 'Sage Pine', hex: '#059669', rgb: 'rgb(5, 150, 105)', hsl: 'hsl(161, 94%, 30%)', role: 'Dominant (Key)' },
      { name: 'Eucalyptus Mist', hex: '#6EE7B7', rgb: 'rgb(110, 231, 183)', hsl: 'hsl(156, 73%, 67%)', role: 'Secondary' },
      { name: 'River Stone', hex: '#94A3B8', rgb: 'rgb(148, 163, 184)', hsl: 'hsl(215, 20%, 65%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Biophilic green foliage, shaded mountain forests, tranquil still water lakes',
      'The human eye has peak spectral sensitivity around 555nm (green), minimizing lens strain',
    ],
    physiologicalResponses: [
      'Reduction in salivary cortisol and sympathetic nerve activity (Shinrin-yoku forest bathing effect)',
      'Expansion of parasympathetic tone, decrease in heart rate variability stress spikes',
    ],
    culturalVariations: {
      western: 'Environmentalism, healing, peaceful countryside, natural health.',
      eastern: 'Jade in Chinese philosophy represents virtue, purity, and immortal calm.',
      middleEastern: 'The green garden of Paradise (Jannah), peace, and profound faith in Islamic tradition.',
    },
    cinematicReference: {
      film: 'The Tree of Life (2011)',
      director: 'Terrence Malick',
      description: 'Luminous natural back-lit canopy greens and golden sunlight express sublime metaphysical serenity.',
    },
    connectedItemIds: ['trust', 'joy', 'bliss'],
  },
  {
    id: 'chaotic',
    name: 'Chaotic',
    category: 'psychological_trait',
    categoryLabel: 'Psychological Trait',
    tagline: 'Frenetic dissonance, conflicting frequencies, and sensory overload.',
    primaryColor: '#D946EF',
    associatedColors: [
      { name: 'Hyper Neon Fuchsia', hex: '#D946EF', rgb: 'rgb(217, 70, 239)', hsl: 'hsl(292, 84%, 61%)', role: 'Dominant (Key)' },
      { name: 'Radioactive Lime', hex: '#84CC16', rgb: 'rgb(132, 204, 22)', hsl: 'hsl(84, 81%, 44%)', role: 'Secondary' },
      { name: 'Static Cyan', hex: '#06B6D4', rgb: 'rgb(6, 182, 212)', hsl: 'hsl(189, 94%, 43%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Clashing complementary colors without spatial buffer, erratic strobing, visual noise',
      'Violates Gestalt principles of continuity, forcing visual cortex into rapid re-scanning',
    ],
    physiologicalResponses: [
      'Rapid ocular micro-saccades, spike in visual fatigue, mental disequilibrium',
      'Heightened neural excitability in the visual cortex V1 and V4',
    ],
    culturalVariations: {
      western: 'Cyberpunk dystopia, rave culture, mental breakdown, untamed rebellion.',
      eastern: 'Dazzling commercial neon overload of modern Tokyo and Hong Kong night districts.',
      middleEastern: 'Bizarre novelty, disruption of sacred geometry and balance.',
    },
    cinematicReference: {
      film: 'Enter the Void (2009) / Everything Everywhere All at Once (2022)',
      director: 'Gaspar Noé / Daniels',
      description: 'Blinding strobes of neon magenta and clashing acid hues shatter spatial reality into kaleidoscope delirium.',
    },
    connectedItemIds: ['anger', 'fear', 'anxiety'],
  },
  {
    id: 'nostalgic',
    name: 'Nostalgic',
    category: 'psychological_trait',
    categoryLabel: 'Psychological Trait',
    tagline: 'Bittersweet reminiscence, analog patina, and sepia warmth.',
    primaryColor: '#D97706',
    associatedColors: [
      { name: 'Aged Ochre', hex: '#D97706', rgb: 'rgb(217, 119, 6)', hsl: 'hsl(32, 95%, 44%)', role: 'Dominant (Key)' },
      { name: 'Faded Terracotta', hex: '#B45309', rgb: 'rgb(180, 83, 9)', hsl: 'hsl(26, 90%, 37%)', role: 'Secondary' },
      { name: 'Cream Linen', hex: '#FEF3C7', rgb: 'rgb(254, 243, 199)', hsl: 'hsl(48, 96%, 89%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Faded dye photographic prints (Ektachrome / Kodachrome aging), lifted blacks, paper yellowing',
      'Warm low-pass filtered luminance evokes childhood memories and sunset reminiscing',
    ],
    physiologicalResponses: [
      'Activation of memory retrieval centers (hippocampus and precuneus)',
      'Subtle warm sensation in chest (autonomic comforting response)',
    ],
    culturalVariations: {
      western: 'Vintage Americana, 1970s Kodachrome, golden childhood summers.',
      eastern: 'Showa era retro in Japan, nostalgia for ancestral rural courtyard life.',
      middleEastern: 'Ancient heritage, timeless spice bazaars, historical memory.',
    },
    cinematicReference: {
      film: 'The Grand Budapest Hotel (2014)',
      director: 'Wes Anderson',
      description: 'Meticulously crafted pastel pinks, mustard yellows, and vintage ochres construct a nostalgic dream of an idealized past.',
    },
    connectedItemIds: ['joy', 'melancholy', 'serene'],
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    category: 'psychological_trait',
    categoryLabel: 'Psychological Trait',
    tagline: 'Calculated objectivity, surgical clarity, and analytical detachment.',
    primaryColor: '#0E7490',
    associatedColors: [
      { name: 'Prussian Slate', hex: '#0E7490', rgb: 'rgb(14, 116, 144)', hsl: 'hsl(193, 82%, 31%)', role: 'Dominant (Key)' },
      { name: 'Graphite Tungsten', hex: '#334155', rgb: 'rgb(51, 65, 85)', hsl: 'hsl(215, 25%, 27%)', role: 'Secondary' },
      { name: 'Chalk White', hex: '#F8FAFC', rgb: 'rgb(248, 250, 252)', hsl: 'hsl(210, 40%, 98%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Architectural blueprints, scientific monitors, clean geometric graticules and minimal saturation',
      'Elimination of emotional warm biases promotes systemic deductive reasoning',
    ],
    physiologicalResponses: [
      'Suppression of emotional limbics, sustained prefrontal cortex metabolic engagement',
      'Reduced heart rate variability transients during focused problem solving',
    ],
    culturalVariations: {
      western: 'Scientific method, technological innovation, philosophical rigor.',
      eastern: 'Calligraphy ink on rice paper, scholarly meditation, Confucian discipline.',
      middleEastern: 'Islamic golden age scholarship, algebra, astronomical astrolabes.',
    },
    cinematicReference: {
      film: 'Oppenheimer (2023)',
      director: 'Christopher Nolan',
      description: 'Hoyte van Hoytema’s clinical monochromatic tones and cool gunmetal blues isolate the relentless mind of theoretical physics.',
    },
    connectedItemIds: ['trust', 'isolation', 'dominance'],
  },

  // 3. Emotional States
  {
    id: 'anxiety',
    name: 'Anxiety',
    category: 'emotional_state',
    categoryLabel: 'Emotional State',
    tagline: 'Constricted tension, suffocating dread, and erratic pulse.',
    primaryColor: '#E11D48',
    associatedColors: [
      { name: 'Alarm Ruby', hex: '#E11D48', rgb: 'rgb(225, 29, 72)', hsl: 'hsl(347, 77%, 50%)', role: 'Dominant (Key)' },
      { name: 'Feverish Saffron', hex: '#CA8A04', rgb: 'rgb(202, 138, 4)', hsl: 'hsl(41, 96%, 40%)', role: 'Secondary' },
      { name: 'Cold Bruise Indigo', hex: '#312E81', rgb: 'rgb(49, 46, 129)', hsl: 'hsl(242, 47%, 34%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Erratic flickering light, off-axis color grading, sickly yellow-magenta tint cross-processing',
      'Visual uncertainty where eyes cannot establish reliable white balance reference',
    ],
    physiologicalResponses: [
      'Chest tightness, elevated galvanic skin conductance, hyperventilatory tendency',
      'Muscle tremors, gastrointestinal constriction, heightened vigilance to peripheral motion',
    ],
    culturalVariations: {
      western: 'Urban panic, panic attacks, institutional pressure, ticking deadline clocks.',
      eastern: 'Exam pressure, social conformity shame (Taijin kyofusho).',
      middleEastern: 'Instability, impending crisis, civil strife.',
    },
    cinematicReference: {
      film: 'Uncut Gems (2019)',
      director: 'Josh & Benny Safdie',
      description: 'Claustrophobic fluorescent reflections, pulsing neon opals, and sweaty amber jewelry lights amplify relentless panic.',
    },
    connectedItemIds: ['fear', 'anger', 'chaotic'],
  },
  {
    id: 'bliss',
    name: 'Bliss',
    category: 'emotional_state',
    categoryLabel: 'Emotional State',
    tagline: 'Transcendent radiance, oceanic boundary dissolution, and ecstasy.',
    primaryColor: '#F59E0B',
    associatedColors: [
      { name: 'Solar Euphoria', hex: '#FDE047', rgb: 'rgb(253, 224, 71)', hsl: 'hsl(50, 98%, 64%)', role: 'Dominant (Key)' },
      { name: 'Celestial White Gold', hex: '#FEF08A', rgb: 'rgb(254, 240, 138)', hsl: 'hsl(53, 98%, 77%)', role: 'Secondary' },
      { name: 'Warm Opal Pink', hex: '#FBCFE8', rgb: 'rgb(251, 207, 232)', hsl: 'hsl(325, 78%, 90%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Overpowering soft halation, solar flares enveloping subjects, disappearance of harsh edges',
      'High-key saturation bath simulating peak spiritual or sensory ecstasy',
    ],
    physiologicalResponses: [
      'Massive endorphin and anandamide saturation in neuro-receptors',
      'Profound sensation of weightlessness, open posture, deep spontaneous diaphragmatic breath',
    ],
    culturalVariations: {
      western: 'Heavenly transcendence, spiritual enlightenment, summer ecstasy.',
      eastern: 'Moksha and Nirvana; lotus golden illumination in Buddhist icons.',
      middleEastern: 'The divine light (Noor) filling the sacred sanctuary.',
    },
    cinematicReference: {
      film: 'Midsommar (2019)',
      director: 'Ari Aster',
      description: 'Blinding, perpetual Scandinavian daylight with saturated floral pastels turns terrifying cult submission into blissful ecstasy.',
    },
    connectedItemIds: ['joy', 'serene', 'surprise'],
  },
  {
    id: 'melancholy',
    name: 'Melancholy',
    category: 'emotional_state',
    categoryLabel: 'Emotional State',
    tagline: 'Poetic wistfulness, beautiful sorrow, and rain-soaked reflections.',
    primaryColor: '#2563EB',
    associatedColors: [
      { name: 'Nocturne Cobalt', hex: '#2563EB', rgb: 'rgb(37, 99, 235)', hsl: 'hsl(221, 83%, 53%)', role: 'Dominant (Key)' },
      { name: 'Muted Teal Dusk', hex: '#0F766E', rgb: 'rgb(15, 118, 110)', hsl: 'hsl(175, 77%, 26%)', role: 'Secondary' },
      { name: 'Rain-Washed Slate', hex: '#475569', rgb: 'rgb(71, 85, 105)', hsl: 'hsl(215, 19%, 35%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Twilight transitions (civil to nautical twilight), wet asphalt reflecting blue neon, mist',
      'The blue hour spectrum (450-485nm) where the eye switches from photopic to mesopic vision',
    ],
    physiologicalResponses: [
      'Gentle slowdown of cognitive processing, reflective introspection',
      'Lower motor reactivity, gentle reduction in body core temperature perception',
    ],
    culturalVariations: {
      western: 'The romantic concept of "weltschmerz" and Portuguese "saudade".',
      eastern: 'The poignant Japanese feeling of "Mono no aware" (empathy toward things).',
      middleEastern: 'The Istanbul Turkish melancholy concept of "Hüzün" (collective poetic loss).',
    },
    cinematicReference: {
      film: 'In the Mood for Love (2000)',
      director: 'Wong Kar-wai',
      description: 'Christopher Doyle’s drenched emerald greens, muted scarlet cheongsams, and twilight shadows cradle unspoken, unfulfilled longing.',
    },
    connectedItemIds: ['sadness', 'nostalgic', 'vulnerable', 'isolation'],
  },
  {
    id: 'passion',
    name: 'Passion',
    category: 'emotional_state',
    categoryLabel: 'Emotional State',
    tagline: 'Fierce desire, biological drive, and magnetic magnetism.',
    primaryColor: '#BE123C',
    associatedColors: [
      { name: 'Deep Carmine', hex: '#BE123C', rgb: 'rgb(190, 18, 60)', hsl: 'hsl(345, 83%, 41%)', role: 'Dominant (Key)' },
      { name: 'Spiced Amber', hex: '#D97706', rgb: 'rgb(217, 119, 6)', hsl: 'hsl(32, 95%, 44%)', role: 'Secondary' },
      { name: 'Smoldering Plum', hex: '#701A75', rgb: 'rgb(112, 26, 117)', hsl: 'hsl(297, 64%, 28%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Rich wine and carmine velvet, candlelight flickers, human skin flushing with oxygenated blood',
      'Low key with concentrated hot spots of crimson and gold',
    ],
    physiologicalResponses: [
      'Facial flushing (cutaneous vasodilation), pupil dilation, increased respiration rate',
      'Heightened cardiac output, sensory focus on the object of desire',
    ],
    culturalVariations: {
      western: 'Erotic romance, danger, rebellion, intense artistic devotion.',
      eastern: 'Celebration, festive wedding vows, burning passion for family lineage.',
      middleEastern: 'Deep devotion, poetic romance in Persian and Arabic ghazals.',
    },
    cinematicReference: {
      film: 'Moulin Rouge! (2001) / Portrait of a Lady on Fire (2019)',
      director: 'Baz Luhrmann / Céline Sciamma',
      description: 'Searing firelight reds and passionate theatrical scarlets celebrate intense devotion and consuming romantic desire.',
    },
    connectedItemIds: ['anger', 'joy', 'anticipation', 'dominance'],
  },
  {
    id: 'isolation',
    name: 'Isolation',
    category: 'emotional_state',
    categoryLabel: 'Emotional State',
    tagline: 'Vast emptiness, sensory vacuum, and alienation.',
    primaryColor: '#0F766E',
    associatedColors: [
      { name: 'Desolate Cyan', hex: '#0F766E', rgb: 'rgb(15, 118, 110)', hsl: 'hsl(175, 77%, 26%)', role: 'Dominant (Key)' },
      { name: 'Sterile Monolith Gray', hex: '#334155', rgb: 'rgb(51, 65, 85)', hsl: 'hsl(215, 25%, 27%)', role: 'Secondary' },
      { name: 'Cold Nitrogen Blue', hex: '#0284C7', rgb: 'rgb(2, 132, 199)', hsl: 'hsl(200, 98%, 39%)', role: 'Accent' },
    ],
    psychologicalTriggers: [
      'Cavernous architecture, barren tundra or outer space, single small subject in a vast frame',
      'Desaturated cool green-cyan tones stripping organic human warmth from the environment',
    ],
    physiologicalResponses: [
      'Perception of cold ambient room temperature, feeling of physical shrinking',
      'Decrease in dopamine activity, heightened attention to tiny ambient sounds',
    ],
    culturalVariations: {
      western: 'Existential solitude, dystopian corporate estrangement, individualist alienation.',
      eastern: 'Hermit mountain retreat (Zazen seclusion); modern social withdrawal (Hikikomori).',
      middleEastern: 'The desert wilderness testing the soul of the prophet.',
    },
    cinematicReference: {
      film: 'Blade Runner 2049 (2017)',
      director: 'Denis Villeneuve',
      description: 'Roger Deakins’s towering brutalist halls bathed in oppressive cyan fog and radioactive smog frame K’s solitary existential quest.',
    },
    connectedItemIds: ['sadness', 'fear', 'melancholy', 'intellectual'],
  },
];

export interface ColorSpectrumItem {
  id: string;
  name: string;
  hex: string;
  wavelengthNm: string;
  warmth: string;
  positiveAssociations: string;
  negativeAssociations: string;
  culturalMeanings: {
    western: string;
    eastAsia: string;
    southAsia: string;
    middleEast: string;
    latinAmerica: string;
  };
  brandUse: string;
  filmGenres: string;
  cinematicUse: string;
  gradingTips: string;
  pairsWith: string;
}

export const COLOR_PSYCHOLOGY_SPECTRUM: ColorSpectrumItem[] = [
  {
    id: 'red',
    name: 'Red',
    hex: '#EF4444',
    wavelengthNm: '620 – 750 nm',
    warmth: 'Intense Warm',
    positiveAssociations: 'Love, passion, courage, vitality, power, confidence, survival instinct',
    negativeAssociations: 'Danger, anger, violence, aggression, stop/warning, lust, revenge',
    culturalMeanings: {
      western: 'Love, emergency/danger, excitement, passion, heart vitality',
      eastAsia: 'Supreme luck, prosperity, festive celebration, weddings, warding off demons',
      southAsia: 'Purity, fertility, sensuality, traditional bridal color (sindoor & bridal sari)',
      middleEast: 'Caution, evil, danger, passion in ancient Persian poetry',
      latinAmerica: 'Religious fervor (when paired with white), passion, life force',
    },
    brandUse: 'Netflix, Coca-Cola, Target, YouTube, Red Bull, Ferrari',
    filmGenres: 'Action, Psychological Thriller, Horror, Melodrama, Romance',
    cinematicUse: "Draws instant involuntary human eye fixation. In 'The Sixth Sense', red flags proximity to the dead; in 'Her', warm reds evoke tender human vulnerability.",
    gradingTips: 'Digital sensors clip red channels quickly. Keep skin tones anchored near 123-135° on the vectorscope. If red clips, human faces turn into plastic sunburned artifacts.',
    pairsWith: 'Cyan (punchy complementary), Deep Black (noir drama), Warm Gold (regal luxury)',
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#F97316',
    wavelengthNm: '590 – 620 nm',
    warmth: 'Radiant Warm',
    positiveAssociations: 'Warmth, enthusiasm, creativity, adventure, success, vitality, social connection',
    negativeAssociations: 'Cheapness, warning, caution, superficiality, deceit, danger',
    culturalMeanings: {
      western: 'Autumn harvest, Halloween, warmth, caution, highway safety',
      eastAsia: 'Courage, love, good health (China); humility and renunciation (Buddhism robes)',
      southAsia: 'Sacred saffron color; represents fire, supreme purity, and spiritual asceticism',
      middleEast: 'Mourning and loss in select regional traditions',
      latinAmerica: 'Earth, sun, solar deities, vitality, harvest celebrations',
    },
    brandUse: 'Nickelodeon, Fanta, Hermès, Home Depot, Orange Telecom',
    filmGenres: 'Adventure, Sci-Fi Wasteland, Indie Drama, Summer Blockbuster',
    cinematicUse: "Central anchor of the blockbuster 'Teal & Orange' contrast. Dominates scorched earth environments in 'Mad Max: Fury Road' and 'Dune'.",
    gradingTips: 'Orange is the natural vectorscope home of all human skin. Pushing orange luminance brings faces forward. Keep background orange desaturated to let actors pop.',
    pairsWith: 'Teal/Cyan (quintessential Hollywood split), Olive Green (earthy 70s), Crisp White (modern clean)',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#EAB308',
    wavelengthNm: '570 – 590 nm',
    warmth: 'High-Luminance Warm',
    positiveAssociations: 'Happiness, optimism, intellect, solar energy, youth, curiosity',
    negativeAssociations: 'Cowardice, jealousy, madness, sickness, decay, caution, contamination',
    culturalMeanings: {
      western: 'Joy, sunshine, cowardice (yellow-bellied), quarantine tape, hazard warnings',
      eastAsia: 'Imperial majesty (China); historically reserved exclusively for the Emperor',
      southAsia: 'Knowledge, spiritual learning, springtime renewal (Vasant Panchami festival)',
      middleEast: 'Death, mourning, gold prosperity depending on regional context',
      latinAmerica: 'Mourning and death in Mexico (cempasúchil marigolds guiding souls)',
    },
    brandUse: 'McDonald’s, IKEA, Snapchat, National Geographic, Ferrari',
    filmGenres: 'Whimsical Indie, Psychological Horror, Black Comedy, Cyberpunk',
    cinematicUse: "Can signify eccentric joy ('Little Miss Sunshine', Wes Anderson) or psychological rot and madness ('Kill Bill', 'The Shining', David Fincher’s 'Seven').",
    gradingTips: 'Yellow carries the highest perceived eye luminance. A tiny push goes a long way. Check Hue vs Hue to prevent green contamination from making yellow sickly.',
    pairsWith: 'Deep Violet (bold geometric complementary), Navy Blue (intellectual authority), Charcoal Gray',
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#22C55E',
    wavelengthNm: '495 – 570 nm',
    warmth: 'Cool-Neutral',
    positiveAssociations: 'Nature, renewal, biological vitality, wealth, healing, equilibrium',
    negativeAssociations: 'Envy, greed, sickness, poison, radioactive decay, artificial simulation',
    culturalMeanings: {
      western: 'Nature, cash currency, environmentalism, luck (shamrock), jealousy',
      eastAsia: 'Fertility, harmony, new life; in China green hats imply marital betrayal',
      southAsia: 'Nature, harvest, festive hope; sacred color of paradise in Islam',
      middleEast: 'Sacred color of Islam, paradise, fertility, supreme spiritual respect',
      latinAmerica: 'Independence, lush forests, eternal life in pre-Columbian folklore',
    },
    brandUse: 'Starbucks, Whole Foods, Land Rover, Spotify, Animal Planet',
    filmGenres: 'Sci-Fi Dystopia, Fantasy, Eco-Thriller, Psychological Horror',
    cinematicUse: "Induces alienation and synthetic simulation in 'The Matrix', magical ancient life in 'Lord of the Rings', and uncanny obsession in Hitchcock's 'Vertigo'.",
    gradingTips: 'Digital Bayer sensors have twice as many green sensels (RGGB). Green digital noise surfaces first. Desaturate greens in deep shadows to avoid a cheap amateur wash.',
    pairsWith: 'Magenta (surreal complementary), Crimson Red (visceral friction), Slate Blue (Nordic cold)',
  },
  {
    id: 'cyan',
    name: 'Cyan / Aqua',
    hex: '#06B6D4',
    wavelengthNm: '475 – 495 nm',
    warmth: 'Crisp Cool',
    positiveAssociations: 'Clarity, technology, freshness, modern precision, expansive sky, calm',
    negativeAssociations: 'Coldness, clinical sterility, detachment, dystopian artificiality',
    culturalMeanings: {
      western: 'Modern tech, electric future, clean ocean, medical precision',
      eastAsia: 'Youth, springtime renewal, fresh start, clean mountain streams',
      southAsia: 'Divine horizon, clear consciousness',
      middleEast: 'Protective blue beads (Nazar) guarding against the evil eye',
      latinAmerica: 'Clear tropical waters, celestial sky',
    },
    brandUse: 'Twitter/X, Dell, Intel, Zoom, Vimeo, Siemens',
    filmGenres: 'Cyberpunk, Hard Sci-Fi, Maritime Survival, Clinical Thriller',
    cinematicUse: "Dominates modern dystopian noir in 'Blade Runner 2049' and 'Tron: Legacy'. Pulling cyan into shadow toe creates the iconic modern blockbuster look.",
    gradingTips: 'Cyan sits at 284° on the vectorscope. Pushing cyan into the Lift wheel creates deep atmospheric separation while keeping actor skin tones unharmed.',
    pairsWith: 'Orange/Amber (classic blockbuster cross), Neon Pink (synthwave), Deep Inky Black',
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#3B82F6',
    wavelengthNm: '450 – 475 nm',
    warmth: 'Deep Cool',
    positiveAssociations: 'Peace, stability, wisdom, loyalty, infinity, contemplative depth, truth',
    negativeAssociations: 'Melancholy, sadness, coldness, isolation, emotional detachment, grief',
    culturalMeanings: {
      western: 'Trust, corporate stability, law enforcement, sadness (the blues)',
      eastAsia: 'Immortality, calm celestial harmony, scholarly meditation',
      southAsia: 'Lord Krishna (infinite sky), courage, spiritual transcendence',
      middleEast: 'Heaven, purity, spiritual protection from negative forces',
      latinAmerica: 'Mourning in Mexican tradition; divine grace in Catholic Marian art',
    },
    brandUse: 'Meta, Ford, American Express, IBM, PayPal, Boeing',
    filmGenres: 'Film Noir, Psychological Drama, Deep Sea, Cosmic Sci-Fi, Crime',
    cinematicUse: "Simulates scotopic human rod night vision (day-for-night). In 'Moonlight', blue illuminates tender vulnerability and authentic selfhood.",
    gradingTips: 'Blue carries the lowest luminance weight in Rec.709 (0.0722). Boosting blue saturation darkens the tone quickly. Raise blue gamma smoothly to avoid sensor noise.',
    pairsWith: 'Gold/Champagne (celestial majesty), Pure White (clean naval aesthetic), Sunset Violet',
  },
  {
    id: 'purple',
    name: 'Purple / Violet',
    hex: '#A855F7',
    wavelengthNm: '380 – 450 nm',
    warmth: 'Cool-to-Warm Balance',
    positiveAssociations: 'Royalty, luxury, mystery, spirituality, magic, imagination, cosmic wonder',
    negativeAssociations: 'Arrogance, cruelty, mourning, psychological decay, delirium',
    culturalMeanings: {
      western: 'Imperial royalty, Catholic Lent, mystery, military honor (Purple Heart)',
      eastAsia: 'Aristocratic nobility; in Thailand worn by widows in deep mourning',
      southAsia: 'Opulence, spiritual mysticism, third-eye chakra intuition',
      middleEast: 'Virtue, wealth, solemn sorrow depending on historical era',
      latinAmerica: 'Holy Week penitence and mourning in Catholic processions',
    },
    brandUse: 'Cadbury, Hallmark, Twitch, Yahoo, Crown Royal',
    filmGenres: 'Fantasy, Arthouse Surrealism, Superhero, Space Opera, Neo-Noir',
    cinematicUse: "Signals altered reality, spiritual realms, or holographic romance. Featured prominently in 'Blade Runner 2049' (Joi) and 'Black Panther' (Ancestral Plane).",
    gradingTips: 'Purple is a non-spectral neurological blend of red and blue. Adjust red and blue primary wheels individually for finer control than global master tint.',
    pairsWith: 'Warm Gold (imperial glory), Acid Green (exotic alien friction), Silver Chrome',
  },
  {
    id: 'pink',
    name: 'Pink / Magenta',
    hex: '#EC4899',
    wavelengthNm: 'Composite (Red + Violet mix)',
    warmth: 'Warm',
    positiveAssociations: 'Tenderness, romance, playful charm, sweetness, innocence, joy',
    negativeAssociations: 'Superficiality, passivity, fragility, artificial sugariness',
    culturalMeanings: {
      western: 'Femininity, romantic sweetness, breast cancer awareness',
      eastAsia: 'Springtime cherry blossoms (Sakura), youth, fresh vitality',
      southAsia: 'Welcoming hospitality (Jaipur Pink City), festive joy',
      middleEast: 'Confectionery delight, gentle warmth in domestic settings',
      latinAmerica: 'Vibrant folk craft, traditional Mexican festive architecture',
    },
    brandUse: 'Barbie, T-Mobile, Lyft, Victoria’s Secret, Cosmopolitan',
    filmGenres: 'Romantic Comedy, Wes Anderson Auteur, Dark Satire, Fashion Cinema',
    cinematicUse: "Subverts expectations: charming symmetry in 'The Grand Budapest Hotel', yet weaponized and suffocating in 'Barbie' or Jonathan Glazer's 'Under the Skin'.",
    gradingTips: 'Keep pink slightly desaturated for high-fashion editorial polish. Ultra-saturated magenta risks blowing out skin highlight transitions.',
    pairsWith: 'Mint Green (retro pastel chic), Espresso Brown (warm nostalgia), Slate Gray',
  },
  {
    id: 'brown',
    name: 'Brown / Earth',
    hex: '#92400E',
    wavelengthNm: 'Low-Luminance Warm Composite',
    warmth: 'Warm',
    positiveAssociations: 'Earthiness, reliability, endurance, comfort, organic origin, grounded home',
    negativeAssociations: 'Dirt, poverty, monotony, decay, grime, dullness',
    culturalMeanings: {
      western: 'Rustic craftsmanship, wholesome organic simplicity, autumn woods',
      eastAsia: 'Earth element (Wu Xing), harvest, rooted humility',
      southAsia: 'Fertile soil, clay pottery, ascetic connection to the land',
      middleEast: 'Desert sand dunes, bedouin heritage, earth architecture',
      latinAmerica: 'Pre-Columbian terracotta, fertile agricultural heritage',
    },
    brandUse: 'UPS, Carhartt, Hershey’s, Timberland, M&M’s',
    filmGenres: 'Western, Period Drama, Post-Apocalyptic, Historical Epic',
    cinematicUse: "Grounds narratives in tangible tactile reality. Definitive in 'The Revenant', 'No Country for Old Men', and 'Dune'.",
    gradingTips: 'Brown is simply low-luminance orange. Pulling warmth into Gamma while pulling Lift down gives rich mahogany and cedar tones without muddying true blacks.',
    pairsWith: 'Cyan/Sky Blue (earth vs sky horizon), Warm Cream (organic comfort), Burnt Orange',
  },
  {
    id: 'black',
    name: 'Black / Void',
    hex: '#09090B',
    wavelengthNm: 'Absence of Light (0 – 5 IRE)',
    warmth: 'Absolute Neutral',
    positiveAssociations: 'Elegance, sophistication, power, formal authority, mystery, timeless luxury',
    negativeAssociations: 'Death, mourning, absolute void, evil, terror, despair, oblivion',
    culturalMeanings: {
      western: 'Formal black-tie luxury, funerals, Gothic darkness, film noir villains',
      eastAsia: 'Water element, mystery, deep scholarly ink calligraphy, discipline',
      southAsia: 'Protection against the evil eye (Kohl mark), solemnity, renunciation',
      middleEast: 'Solemn rebirth and mourning; traditional abaya attire',
      latinAmerica: 'Mourning, solemn church rites, formal masculine dignity',
    },
    brandUse: 'Apple, Chanel, Prada, Nike, Sony, Rolls-Royce',
    filmGenres: 'Film Noir, Supernatural Horror, Psychological Thriller, High Fashion',
    cinematicUse: "Shapes dynamic range and negative space. Crushing blacks induces visceral claustrophobia; lifting blacks creates nostalgic 70s archival print fog.",
    gradingTips: 'Never blindly crush shadows to absolute 0 IRE in video. Maintain toe detail at 2-5 IRE to prevent legal clipping on broadcast delivery monitors.',
    pairsWith: 'Gold (ultimate luxury), Pure White (stark graphic geometry), Crimson (Gothic drama)',
  },
  {
    id: 'white',
    name: 'White / Light',
    hex: '#F8FAFC',
    wavelengthNm: 'All Visible Wavelengths (90 – 100 IRE)',
    warmth: 'Absolute Neutral',
    positiveAssociations: 'Purity, innocence, truth, cleanliness, peace, divine illumination',
    negativeAssociations: 'Sterility, clinical numbness, sensory isolation, blinding void, ghostliness',
    culturalMeanings: {
      western: 'Purity, brides, angels, medical cleanliness, surrender flag',
      eastAsia: 'Mourning, funerals, ghosts, ancestral veneration (white robes)',
      southAsia: 'Widowhood, spiritual detachment, pure soul liberation',
      middleEast: 'Purity, pilgrimage (Ihram garments during Hajj), peace',
      latinAmerica: 'Baptism, peace, communion, divine light',
    },
    brandUse: 'Tesla, Apple, Dove, WWF, Mini',
    filmGenres: 'Sci-Fi Cleanroom, Survival Wilderness, Afterlife Fantasy, Minimalism',
    cinematicUse: "Conveys sterile psychological control in '2001: A Space Odyssey' or blinding sensory deprivation in snowbound landscapes like 'Fargo'.",
    gradingTips: 'Avoid clipping highlights flat at 100 IRE. Use soft shoulder compression curves to preserve specular skin textures on forehead and nose bridges.',
    pairsWith: 'Every color on the chromatic wheel; especially Charcoal, Indigo, and Raw Timber',
  },
  {
    id: 'gray',
    name: 'Gray / Neutral',
    hex: '#64748B',
    wavelengthNm: 'Balanced Spectral Distribution',
    warmth: 'True Neutral',
    positiveAssociations: 'Balance, intellect, composure, impartiality, timeless understatement',
    negativeAssociations: 'Depression, bureaucratic boredom, indifference, urban grime, gloom',
    culturalMeanings: {
      western: 'Corporate monotony, rainy weather, modern industrial minimalism',
      eastAsia: 'Humility, meditative ink wash painting (Sumi-e), Yin-Yang harmony',
      southAsia: 'Sacred ash (Vibhuti), renunciation of material vanity',
      middleEast: 'Neutrality, ancient desert stone',
      latinAmerica: 'Urban concrete, modesty, stoicism',
    },
    brandUse: 'Mercedes-Benz, Wikipedia, Audi, Grey Goose, New Balance',
    filmGenres: 'Dystopian Bureaucracy, War Chronicle, Procedural Crime, Arthouse',
    cinematicUse: "Empties emotional vitality to emphasize existential exhaustion. Central to David Fincher’s procedural crime offices and 'The Road'.",
    gradingTips: 'Gray is the definitive monitor calibration litmus test. If midtone grays show a green or magenta cast, the color suite is not D65 Rec.709 calibrated.',
    pairsWith: 'Any solitary saturated accent (Neon Cyan, Saffron Yellow, or Crimson) for maximum contrast',
  },
];

export interface EmotionPaletteItem {
  id: string;
  name: string;
  emotion: string;
  tagline: string;
  swatches: string[];
  contrast: number;
  suggestedKelvin: number;
  filmReference: string;
}

export const EMOTION_PALETTES: EmotionPaletteItem[] = [
  {
    id: 'joy',
    name: 'Joy & Euphoric Radiance',
    emotion: 'Joy',
    tagline: 'Sun-drenched warmth, high-key optimism, and golden morning glow.',
    swatches: ['#F59E0B', '#FDE047', '#FEF08A', '#38BDF8', '#FFFFFF'],
    contrast: 1.15,
    suggestedKelvin: 5600,
    filmReference: 'Amélie / Little Miss Sunshine',
  },
  {
    id: 'melancholy',
    name: 'Melancholy & Quiet Grief',
    emotion: 'Sadness',
    tagline: 'Subdued slate blues, muted overcast midtones, and sorrowful intimacy.',
    swatches: ['#1E293B', '#334155', '#64748B', '#94A3B8', '#CBD5E1'],
    contrast: 1.04,
    suggestedKelvin: 7200,
    filmReference: 'Manchester by the Sea / Blue Valentine',
  },
  {
    id: 'terror',
    name: 'Pure Terror & Dread',
    emotion: 'Fear',
    tagline: 'Oppressive inky blackness pierced by radioactive green and blood crimson.',
    swatches: ['#09090B', '#172554', '#022C22', '#14532D', '#7F1D1D'],
    contrast: 1.35,
    suggestedKelvin: 4200,
    filmReference: 'The Shining / Hereditary',
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia & Longing',
    emotion: 'Nostalgia',
    tagline: 'Warm sepia-amber lifted blacks and tender golden hour memories.',
    swatches: ['#451A03', '#78350F', '#D97706', '#FDE68A', '#FEF3C7'],
    contrast: 1.08,
    suggestedKelvin: 3200,
    filmReference: 'Cinema Paradiso / Call Me by Your Name',
  },
  {
    id: 'serenity',
    name: 'Serenity & Quiet Solitude',
    emotion: 'Peace',
    tagline: 'Deep tranquil oceanic blues, sky reflections, and mental stillness.',
    swatches: ['#0C4A6E', '#0284C7', '#38BDF8', '#BAE6FD', '#F0F9FF'],
    contrast: 1.06,
    suggestedKelvin: 6500,
    filmReference: 'Drive My Car / The Big Blue',
  },
  {
    id: 'rage',
    name: 'Rage & Combative Fury',
    emotion: 'Anger',
    tagline: 'High-contrast searing carmine, adrenaline spikes, and scorched earth.',
    swatches: ['#450A0A', '#991B1B', '#DC2626', '#F87171', '#FEF2F2'],
    contrast: 1.38,
    suggestedKelvin: 4800,
    filmReference: 'Mad Max: Fury Road / Taxi Driver',
  },
  {
    id: 'paranoia',
    name: 'Paranoia & Psychological Delusion',
    emotion: 'Anxiety',
    tagline: 'Sickly phosphor greens and bile yellows creating visceral mental unease.',
    swatches: ['#052E16', '#14532D', '#16A34A', '#84CC16', '#FEF08A'],
    contrast: 1.25,
    suggestedKelvin: 5200,
    filmReference: 'The Matrix / Seven / Fight Club',
  },
  {
    id: 'romance',
    name: 'Sensual Romance & Desire',
    emotion: 'Passion',
    tagline: 'Smoldering ruby velvet, warm amber skin glow, and intimate firelight.',
    swatches: ['#4C0519', '#9F1239', '#E11D48', '#FB7185', '#FFF1F2'],
    contrast: 1.12,
    suggestedKelvin: 3000,
    filmReference: 'In the Mood for Love / Portrait of a Lady on Fire',
  },
  {
    id: 'envy',
    name: 'Envy, Rot & Moral Corruption',
    emotion: 'Disgust',
    tagline: 'Greedy emerald shadows, murky jaundiced falloffs, and moral decay.',
    swatches: ['#022C22', '#065F46', '#059669', '#34D399', '#A7F3D0'],
    contrast: 1.18,
    suggestedKelvin: 5800,
    filmReference: 'Parasite / The Talented Mr. Ripley',
  },
  {
    id: 'hope',
    name: 'Hope & Botanical Renewal',
    emotion: 'Renewal',
    tagline: 'Fresh spring green shoots illuminated by dawn gold and tender skies.',
    swatches: ['#064E3B', '#047857', '#10B981', '#6EE7B7', '#FEF3C7'],
    contrast: 1.10,
    suggestedKelvin: 5400,
    filmReference: 'The Shawshank Redemption / Children of Men',
  },
];

