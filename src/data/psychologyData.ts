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
