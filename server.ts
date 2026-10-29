import express from 'express';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Curated cinematic fallbacks in case API key is missing or service unreachable
function getCuratedCinematicFallback(keyword: string) {
  const kw = keyword.toLowerCase();
  
  if (kw.includes('horror') || kw.includes('eerie') || kw.includes('spooky') || kw.includes('dread')) {
    return {
      title: 'A24 Autumn Folk Horror',
      tagline: 'Unsettling pastoral sunshine concealing ancient primal dread.',
      genre: 'Psychological Folk Horror',
      mood: 'Uncanny, Ritualistic, Sun-Drenched Isolation',
      filmReferences: ['Midsommar', 'The Witch', 'The Wicker Man'],
      timeOfDay: 'High Summer Daylight',
      kelvin: 5200,
      tint: 4,
      contrast: 1.15,
      saturation: 1.25,
      recommendedHexes: {
        shadows: '#181b15',
        midtones: '#9b7e46',
        highlights: '#fef3c7',
        accent: '#e11d48',
      },
      extendedPalette: [
        { hex: '#181b15', name: 'Meadow Shadow', role: 'Subtle green-charcoal shadows' },
        { hex: '#5b8a58', name: 'Pastoral Flora', role: 'Sunlit wild grass foliage' },
        { hex: '#fde047', name: 'Golden Sunbeam', role: 'Overexposed canopy sunlight' },
        { hex: '#fef3c7', name: 'Linen White', role: 'Bleached ritual garments' },
        { hex: '#e11d48', name: 'Crimson Offering', role: 'Visceral blood floral accent' },
      ],
      resolveCoordinates: {
        lift: { r: -0.05, g: 0.04, b: -0.02, lum: 2 },
        gamma: { r: 0.12, g: 0.08, b: -0.06, lum: 4 },
        gain: { r: 0.18, g: 0.12, b: -0.04, lum: 8 },
      },
      lightingRecipe: {
        key: 'Blinding overhead midsummer sun diffused with 12x12 1/4 silk',
        fill: 'Ultra-wide silver bounce board for minimal negative shadows',
        practicals: 'Flower wreaths, white birch wood, bonfires',
        ratio: '1:1.5 intentionally low contrast to prevent traditional dark horror tropes',
      },
      whyItWorks:
        'Subverts the traditional dark horror paradigm by setting terror in broad, unforgiving daylight. Saturated yellows and vivid meadow greens create visual beauty while subtle olive-tinged shadows evoke biological rot.',
      resolveTip:
        'Lift your black point (Lift Lum +2) to mimic overexposed slide film. Keep highlights warm (gain pushed toward 45° amber) while slightly pulling saturation on human skin to keep actors looking pale.',
      lightroomTip:
        'In Color Grading, add soft gold to Highlights and mild moss-green to Shadows. Boost vibrance +15 while pulling clarity down -5 for a blooming dream-nightmare feel.',
    };
  }

  if (kw.includes('sci-fi') || kw.includes('cyber') || kw.includes('neon') || kw.includes('futur')) {
    return {
      title: 'Neon Cyberpunk Drizzle',
      tagline: 'High-density chromatic conflict across rain-slicked midnight asphalt.',
      genre: 'Neo-Noir Cyberpunk',
      mood: 'Dystopian Solitude, Electric Paranoia, Technological Awe',
      filmReferences: ['Blade Runner 2049', 'Akira', 'Ghost in the Shell'],
      timeOfDay: 'Midnight Rain City',
      kelvin: 4200,
      tint: 18,
      contrast: 1.45,
      saturation: 1.35,
      recommendedHexes: {
        shadows: '#05070e',
        midtones: '#00f0ff',
        highlights: '#ff007f',
        accent: '#ffd700',
      },
      extendedPalette: [
        { hex: '#05070e', name: 'Wet Obsidian', role: 'Crushed asphalt black baseline' },
        { hex: '#0a2540', name: 'Cobalt Atmospheric Fog', role: 'Cool background smog wrap' },
        { hex: '#00f0ff', name: 'Cyan Hologram', role: 'Electric neon signage reflection' },
        { hex: '#ff007f', name: 'Laser Magenta', role: 'Searing practical storefront key' },
        { hex: '#ffd700', name: 'Sodium Hazard', role: 'Warning light rim and eye catchlight' },
      ],
      resolveCoordinates: {
        lift: { r: -0.25, g: 0.06, b: 0.28, lum: -14 },
        gamma: { r: -0.12, g: 0.18, b: 0.15, lum: -2 },
        gain: { r: 0.38, g: -0.15, b: 0.22, lum: 16 },
      },
      lightingRecipe: {
        key: 'Color-tunable RGB LED tubes (Astera Titan) hidden behind practical pillars',
        fill: 'Reflections from wet asphalt wetted down by water truck',
        practicals: 'Neon storefronts, vehicle headlights, LED billboards',
        ratio: '1:10 extreme contrast with razor-sharp specular borders',
      },
      whyItWorks:
        'Exploits opponent color theory to the maximum. Deep cyan fog provides the receding matrix, while saturated magenta neon and amber streetlights pierce through the mist, creating instant 3D volume.',
      resolveTip:
        'Always isolate human skin tones on an independent parallel node! Lock the skin vector on the 135° I-Line so actors do not take on radioactive magenta or zombie teal.',
      lightroomTip:
        'Under Color Grading, push Shadows heavily into Cyan (210°) and Highlights into Hot Pink (330°). In Tone Curve, deepen blacks to 5 while lifting midtone contrast.',
    };
  }

  // Universal Default Cinematic Look
  return {
    title: `Cinematic ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Aesthetic`,
    tagline: `Atmospheric color orchestration designed for evocative cinematic storytelling.`,
    genre: 'Cinematic Drama',
    mood: 'Contemplative, Nuanced, Visually Engaging',
    filmReferences: ['Sicario', 'Arrival', 'No Country for Old Men'],
    timeOfDay: 'Golden Hour / Twilight',
    kelvin: 4800,
    tint: 2,
    contrast: 1.25,
    saturation: 1.10,
    recommendedHexes: {
      shadows: '#0e1724',
      midtones: '#9e704a',
      highlights: '#fde68a',
      accent: '#0284c7',
    },
    extendedPalette: [
      { hex: '#0e1724', name: 'Shadow Depth', role: 'Subtractive cyan-slate density' },
      { hex: '#2b394a', name: 'Ambient Tone', role: 'Environmental shadow wrap' },
      { hex: '#9e704a', name: 'Skin Midtone', role: 'Organic golden skin foundation' },
      { hex: '#fde68a', name: 'Specular Sunlight', role: 'Warm edge rim and eye catchlight' },
      { hex: '#0284c7', name: 'Atmospheric Cyan', role: 'Opponent sky and horizon contrast' },
    ],
    resolveCoordinates: {
      lift: { r: -0.15, g: 0.02, b: 0.18, lum: -6 },
      gamma: { r: 0.12, g: 0.05, b: -0.08, lum: 2 },
      gain: { r: 0.18, g: 0.10, b: -0.06, lum: 8 },
    },
    lightingRecipe: {
      key: 'Directional 3/4 backlight with 5600K daylight through diffusion',
      fill: 'Negative fill flags to sculpt cheekbones and jawline',
      practicals: 'Warm tungsten accent lamp (2800K) in background',
      ratio: '1:4 balanced filmic ratio',
    },
    whyItWorks:
      'Creates rich visual separation by keeping shadows cool and subtractive while preserving rich, glowing warmth on faces and specular points.',
    resolveTip:
      'Set timeline color space to DaVinci Wide Gamut. Pull Lift toward cyan (Hue 210°) and Gain toward golden amber (Hue 45°).',
    lightroomTip:
      'In Color Grading, tint shadows with Hue 215° (Teal) at 20% saturation and Highlights with Hue 45° (Gold) at 35% saturation.',
  };
}

// API endpoint for Gemini-powered cinematic palette recommendations
app.post('/api/gemini/cinematic-palette', async (req, res) => {
  try {
    const { keyword, sceneType } = req.body;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return res.status(400).json({ error: 'Please provide a movie mood or genre keyword.' });
    }

    const cleanKeyword = keyword.trim();

    // If API key is not configured, supply high-quality curated procedural response
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Using curated cinematic engine fallback.');
      const fallback = getCuratedCinematicFallback(cleanKeyword);
      return res.json({
        ...fallback,
        generatedBy: 'curated_fallback',
        keyword: cleanKeyword,
      });
    }

    const promptText = `Generate an industry-grade cinematic color grading palette and lighting masterclass recommendation for a film with the mood/genre: "${cleanKeyword}"${sceneType ? ` set during: ${sceneType}` : ''}.
Ensure the hex colors form an authentic, professional cinema look (with subtractive shadow density, rich midtones, specular highlights, and rim accent). Provide realistic DaVinci Resolve Lift/Gamma/Gain color wheel values and practical physical lighting advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You are an elite Hollywood Director of Photography (ASC) and master digital intermediate (DI) colorist. Generate precise, authentic cinematic color palettes and DaVinci Resolve grading recommendations. Output strictly valid JSON conforming to the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Evocative name of the cinematic look' },
            tagline: { type: Type.STRING, description: 'A concise 1-sentence mood & visual logline' },
            genre: { type: Type.STRING, description: 'Film genre or stylistic movement' },
            mood: { type: Type.STRING, description: 'Emotional keywords describing psychological impact' },
            filmReferences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 4 notable films that embody this aesthetic',
            },
            timeOfDay: { type: Type.STRING, description: 'e.g. Day, Night, Twilight, Golden Hour, Interior' },
            kelvin: { type: Type.INTEGER, description: 'Correlated Color Temperature (2000 to 10000)' },
            tint: { type: Type.INTEGER, description: 'Green/Magenta tint shift (-50 to +50)' },
            contrast: { type: Type.NUMBER, description: 'Contrast multiplier (0.8 to 1.7)' },
            saturation: { type: Type.NUMBER, description: 'Saturation multiplier (0.0 to 1.8)' },
            recommendedHexes: {
              type: Type.OBJECT,
              properties: {
                shadows: { type: Type.STRING, description: 'Lift / Shadow color hex (e.g. #0a1424)' },
                midtones: { type: Type.STRING, description: 'Gamma / Midtone color hex (e.g. #c07840)' },
                highlights: { type: Type.STRING, description: 'Gain / Highlight color hex (e.g. #fde047)' },
                accent: { type: Type.STRING, description: 'Practical rim / accent color hex (e.g. #06b6d4)' },
              },
              required: ['shadows', 'midtones', 'highlights', 'accent'],
            },
            extendedPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING },
                  role: { type: Type.STRING, description: 'Role in scene (e.g. Key Actor Skin, Ambient Fog, Neon practical)' },
                },
                required: ['hex', 'name', 'role'],
              },
              description: '5 nuanced swatches building the complete cinematic scene harmony',
            },
            resolveCoordinates: {
              type: Type.OBJECT,
              properties: {
                lift: {
                  type: Type.OBJECT,
                  properties: {
                    r: { type: Type.NUMBER, description: 'Red offset -1.0 to 1.0' },
                    g: { type: Type.NUMBER, description: 'Green offset -1.0 to 1.0' },
                    b: { type: Type.NUMBER, description: 'Blue offset -1.0 to 1.0' },
                    lum: { type: Type.NUMBER, description: 'Luminance IRE -20 to 20' },
                  },
                  required: ['r', 'g', 'b', 'lum'],
                },
                gamma: {
                  type: Type.OBJECT,
                  properties: {
                    r: { type: Type.NUMBER, description: 'Red offset -1.0 to 1.0' },
                    g: { type: Type.NUMBER, description: 'Green offset -1.0 to 1.0' },
                    b: { type: Type.NUMBER, description: 'Blue offset -1.0 to 1.0' },
                    lum: { type: Type.NUMBER, description: 'Luminance IRE -20 to 20' },
                  },
                  required: ['r', 'g', 'b', 'lum'],
                },
                gain: {
                  type: Type.OBJECT,
                  properties: {
                    r: { type: Type.NUMBER, description: 'Red offset -1.0 to 1.0' },
                    g: { type: Type.NUMBER, description: 'Green offset -1.0 to 1.0' },
                    b: { type: Type.NUMBER, description: 'Blue offset -1.0 to 1.0' },
                    lum: { type: Type.NUMBER, description: 'Luminance IRE -20 to 20' },
                  },
                  required: ['r', 'g', 'b', 'lum'],
                },
              },
              required: ['lift', 'gamma', 'gain'],
            },
            lightingRecipe: {
              type: Type.OBJECT,
              properties: {
                key: { type: Type.STRING, description: 'Physical key light fixture and angle' },
                fill: { type: Type.STRING, description: 'Fill light or negative fill strategy' },
                practicals: { type: Type.STRING, description: 'In-frame practical fixtures and accent rims' },
                ratio: { type: Type.STRING, description: 'Key-to-fill contrast ratio (e.g. 1:4, 1:8)' },
              },
              required: ['key', 'fill', 'practicals', 'ratio'],
            },
            whyItWorks: { type: Type.STRING, description: 'Detailed color theory & psychological explanation' },
            resolveTip: { type: Type.STRING, description: 'DaVinci Resolve node workflow pro-tip' },
            lightroomTip: { type: Type.STRING, description: 'Lightroom Color Grading wheel and Tone Curve pro-tip' },
          },
          required: [
            'title',
            'tagline',
            'genre',
            'mood',
            'filmReferences',
            'timeOfDay',
            'kelvin',
            'tint',
            'contrast',
            'saturation',
            'recommendedHexes',
            'extendedPalette',
            'resolveCoordinates',
            'lightingRecipe',
            'whyItWorks',
            'resolveTip',
            'lightroomTip',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      generatedBy: 'gemini-3.8-flash',
      keyword: cleanKeyword,
    });
  } catch (error: any) {
    console.error('Error generating cinematic palette with Gemini:', error);
    // Fallback gracefully so the UI continues working
    const fallback = getCuratedCinematicFallback(req.body.keyword || 'Cinematic Drama');
    return res.json({
      ...fallback,
      generatedBy: 'curated_fallback_after_error',
      keyword: req.body.keyword || 'Cinematic Drama',
      errorNote: error?.message || 'Server error, falling back to curated color science recipe.',
    });
  }
});

// Google Search Grounding Cinematography & Film Look Research Endpoint
app.post('/api/gemini/cinematography-search', async (req, res) => {
  const { query: searchQuery } = req.body;

  if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
    return res.status(400).json({ error: 'Please provide a cinematography search query.' });
  }

  const cleanQuery = searchQuery.trim();

  // If no API key, return curated industry research
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      query: cleanQuery,
      source: 'curated_cinema_research',
      title: `Cinematography Analysis: "${cleanQuery}"`,
      summary: `Industry reference analysis for "${cleanQuery}". Professional productions employ calibrated optical Cooke/ARRI glass, negative fill lighting ratios, and subtractive color contrast in DaVinci Resolve.`,
      filmReferences: ['Dune: Part Two (2024)', 'Oppenheimer (2023)', 'The Batman (2022)'],
      colorPalette: ['#1e1b18', '#854d0e', '#ca8a04', '#38bdf8', '#f8fafc'],
      webCitations: [
        { title: 'American Cinematographer Society (ASC) Archive', url: 'https://theasc.com' },
        { title: 'British Cinematographer DI Workflows', url: 'https://britishcinematographer.co.uk' },
      ],
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Perform an authoritative cinematography research analysis for the film, director of photography, or camera sensor aesthetic: "${cleanQuery}".
Provide:
1. Core visual color palette (5 evocative hex codes for Shadows, Midtones, Highlights, and Practical accents)
2. Director of Photography and camera sensor / lens choice
3. Lighting ratio and physical color temperature (Kelvin)
4. DaVinci Resolve color grading techniques and Kodak/Fuji film stock emulation recommendations.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are a senior Hollywood film archivist and ASC color scientist. Ground your findings with Google Search to deliver real-world, accurate film analysis.',
      },
    });

    const groundingMeta = response.candidates?.[0]?.groundingMetadata;
    const webSearchQueries = groundingMeta?.webSearchQueries || [];
    const searchChunks = (groundingMeta?.groundingChunks || []).map((chunk: any) => ({
      title: chunk.web?.title || 'Film Source',
      url: chunk.web?.uri || 'https://theasc.com',
    }));

    return res.json({
      query: cleanQuery,
      source: 'google_search_grounding',
      model: 'gemini-3.8-flash',
      analysisText: response.text,
      webSearchQueries,
      webCitations: searchChunks.slice(0, 5),
    });
  } catch (error: any) {
    console.warn('Search Grounding error, using curated research fallback:', error?.message);
    return res.json({
      query: cleanQuery,
      source: 'curated_fallback_after_rate_limit',
      title: `Cinematography Reference: "${cleanQuery}"`,
      summary: `Comprehensive colorimetry breakdown for "${cleanQuery}". Contemporary digital intermediate workflows utilize Rec.709 / ACEScct color spaces with soft highlight shoulder compression and skin tone vector tracking at 135°.`,
      filmReferences: ['Dune: Part Two (Greig Fraser)', 'Blade Runner 2049 (Roger Deakins)', 'Poor Things (Robbie Ryan)'],
      colorPalette: ['#0f172a', '#78350f', '#d97706', '#38bdf8', '#f1f5f9'],
      webCitations: [
        { title: 'American Cinematographer - ASC Masterclass', url: 'https://theasc.com' },
        { title: 'DaVinci Resolve Colorist Reference Manual', url: 'https://www.blackmagicdesign.com' },
      ],
      notice: 'Served via curated Hollywood reference database.',
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get(
      '*',
      rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }),
      (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      },
    );
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Color Grading & Cinematography Suite server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
