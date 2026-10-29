import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Upload,
  Camera,
  Sun,
  Moon,
  Film,
  Sparkles,
  Sliders,
  RotateCcw,
  Download,
  Copy,
  Check,
  Bookmark,
  Layers,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import {
  analyzeImageCanvas,
  PhotoAnalysisResult,
  DominantColorSwatch,
} from '../utils/photoAnalysisMath';
import {
  DAY_CINEMA_GRADES,
  NIGHT_CINEMA_GRADES,
  FILM_STOCK_GRADES,
  STYLIZED_CINEMA_GRADES,
  ALL_RECOMMENDED_GRADES,
} from '../data/cinemaGradesData';
import {
  CinemaGradeParams,
  ColorWheelVal,
  generateCinemaGradeCubeLut,
  generateCinemaGradeXmp,
  kelvinToRgb,
} from '../utils/cinematographyGradingMath';
import { ThreeWayColorWheels } from './ThreeWayColorWheels';
import { CinemaScopes } from './CinemaScopes';
import { HistogramOverlay } from './HistogramOverlay';
import { downloadFile, ColorRecipe, generateAseBuffer } from '../utils/exporters';
import { PostProductionSoftwareGuide } from './PostProductionSoftwareGuide';

interface SamplePresetPhoto {
  id: string;
  name: string;
  timeOfDay: 'day' | 'night' | 'interior';
  description: string;
  svgGenerator: () => string; // returns data URL of high-res SVG canvas
}

export const PhotoColorGradingStudio: React.FC = () => {
  // Image & Canvas state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('sample_scene.jpg');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);

  // Before/After split position (0 to 100%)
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // Live Grade parameters
  const [activeKelvin, setActiveKelvin] = useState<number>(5500);
  const [activeTint, setActiveTint] = useState<number>(0);
  const [activeExposureEv, setActiveExposureEv] = useState<number>(0);
  const [activeContrast, setActiveContrast] = useState<number>(1.15);
  const [activeSaturation, setActiveSaturation] = useState<number>(1.05);
  const [skinProtection, setSkinProtection] = useState<boolean>(true);

  // 3-Way Color Wheels
  const [activeLift, setActiveLift] = useState<ColorWheelVal>({ r: 0, g: 0, b: 0, lum: 0 });
  const [activeGamma, setActiveGamma] = useState<ColorWheelVal>({ r: 0, g: 0, b: 0, lum: 0 });
  const [activeGain, setActiveGain] = useState<ColorWheelVal>({ r: 0, g: 0, b: 0, lum: 0 });

  // Selected preset / look from Color Matrix
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kodak_vision3_500t');
  const [presetCategory, setPresetCategory] = useState<'smart' | 'film_stock' | 'day' | 'night' | 'stylized'>('smart');
  const [filmBrandFilter, setFilmBrandFilter] = useState<'All' | 'Kodak' | 'Fujifilm' | 'CineStill' | 'Ilford'>('All');

  // UI feedback states
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedResolve, setCopiedResolve] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Generate default sample photo on mount if none uploaded
  useEffect(() => {
    loadPreloadedSample('day_portrait');
  }, []);

  // Preloaded sample generator using SVG rendered to data URI
  const loadPreloadedSample = (type: 'day_portrait' | 'night_city' | 'alpine_landscape' | 'desert_warm') => {
    let svgContent = '';
    let sampleName = '';

    if (type === 'day_portrait') {
      sampleName = 'Golden_Hour_Portrait.jpg';
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a7c59"/><stop offset="100%" stop-color="#2d3748"/></linearGradient>
          <radialGradient id="sun" cx="75%" cy="25%" r="50%"><stop offset="0%" stop-color="#ffeed1" stop-opacity="0.9"/><stop offset="50%" stop-color="#ff9f1c" stop-opacity="0.4"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#bg)"/>
        <circle cx="900" cy="200" r="280" fill="url(#sun)"/>
        <path d="M0 500 Q400 420 800 480 T1200 450 L1200 800 L0 800 Z" fill="#1a202c"/>
        <g transform="translate(600, 360)">
          <path d="M-180 340 C-150 200 -100 160 0 160 C100 160 150 200 180 340 Z" fill="#334155"/>
          <rect x="-35" y="100" width="70" height="90" rx="8" fill="#d97757"/>
          <ellipse cx="0" cy="60" rx="85" ry="110" fill="#e8987a"/>
          <path d="M-25 -40 Q-80 50 -20 160 L-80 60 Z" fill="#aa5035" opacity="0.35"/>
          <circle cx="-30" cy="50" r="6" fill="#2d150b"/><circle cx="35" cy="50" r="6" fill="#2d150b"/>
          <circle cx="-28" cy="48" r="2" fill="#ffffff"/><circle cx="37" cy="48" r="2" fill="#ffffff"/>
          <path d="M-90 50 C-100 -50 -50 -80 0 -80 C50 -80 100 -50 90 50 C80 10 60 -30 0 -30 C-60 -30 -80 10 -90 50 Z" fill="#3f1d0b"/>
          <path d="M0 -82 C55 -82 105 -52 92 50 C95 10 85 -20 25 -60 Z" fill="#ffd166" opacity="0.95"/>
        </g>
      </svg>`;
    } else if (type === 'night_city') {
      sampleName = 'Rainy_Neon_City.jpg';
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <rect width="1200" height="800" fill="#050811"/>
        <rect x="80" y="200" width="120" height="380" fill="#090f1d"/>
        <rect x="240" y="140" width="140" height="440" fill="#0d1527"/>
        <rect x="420" y="260" width="100" height="320" fill="#090f1d"/>
        <rect x="740" y="180" width="170" height="400" fill="#0b1322"/>
        <rect x="950" y="100" width="130" height="480" fill="#0d1629"/>
        <rect x="260" y="180" width="100" height="24" rx="3" fill="#00f0ff" opacity="0.9"/>
        <rect x="780" y="220" width="80" height="20" rx="3" fill="#ff007f" opacity="0.9"/>
        <polygon points="0,580 1200,580 1200,800 0,800" fill="#070a12"/>
        <ellipse cx="310" cy="680" rx="60" ry="160" fill="#00f0ff" opacity="0.35"/>
        <ellipse cx="820" cy="700" rx="55" ry="150" fill="#ff007f" opacity="0.35"/>
      </svg>`;
    } else if (type === 'alpine_landscape') {
      sampleName = 'Alpine_Overcast_Lake.jpg';
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#cbd5e1"/></linearGradient></defs>
        <rect width="1200" height="800" fill="url(#sky)"/>
        <path d="M0 380 L260 230 L500 340 L740 180 L960 310 L1200 240 L1200 800 L0 800 Z" fill="#475569"/>
        <polygon points="740,180 705,230 775,230" fill="#f8fafc"/>
        <polygon points="260,230 235,270 285,270" fill="#f8fafc"/>
        <path d="M0 480 L240 420 L520 500 L820 400 L1200 450 L1200 800 L0 800 Z" fill="#1e293b"/>
        <rect x="0" y="580" width="1200" height="220" fill="#1b2a32"/>
      </svg>`;
    } else {
      sampleName = 'Desert_Canyon_Heat.jpg';
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#fef08a"/></linearGradient></defs>
        <rect width="1200" height="800" fill="url(#dsky)"/>
        <circle cx="600" cy="180" r="90" fill="#fffbeb"/>
        <path d="M0 340 L300 260 L650 360 L950 240 L1200 320 L1200 800 L0 800 Z" fill="#92400e"/>
        <path d="M0 460 Q400 400 800 470 T1200 440 L1200 800 L0 800 Z" fill="#b45309"/>
        <polygon points="0,580 1200,560 1200,800 0,800" fill="#78350f"/>
      </svg>`;
    }

    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    setImageFileName(sampleName);
    loadImageAndAnalyze(dataUrl);
  };

  // Load image into canvas and run pixel analysis
  const loadImageAndAnalyze = (src: string) => {
    setIsAnalyzing(true);
    setImageSrc(src);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = hiddenCanvasRef.current || document.createElement('canvas');
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const result = analyzeImageCanvas(canvas);
        setAnalysisResult(result);

        // Auto-initialize balance values to image's baseline
        setActiveKelvin(result.estimatedKelvin);
        setActiveTint(result.estimatedTint);
      }
      setIsAnalyzing(false);
    };
    img.onerror = () => {
      setIsAnalyzing(false);
    };
    img.src = src;
  };

  // Upload user file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          loadImageAndAnalyze(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1-Click Auto-Balance Exposure
  const handleAutoBalanceExposure = () => {
    if (!analysisResult) return;
    setActiveExposureEv(analysisResult.autoBalanceCorrections.exposureOffsetEv);
  };

  // 1-Click Auto-Neutralize White Balance
  const handleAutoNeutralizeWb = () => {
    if (!analysisResult) return;
    setActiveKelvin(5500);
    setActiveTint(analysisResult.autoBalanceCorrections.targetTint);
  };

  // 1-Click Full Balancing
  const handleFullBalance = () => {
    if (!analysisResult) return;
    setActiveExposureEv(analysisResult.autoBalanceCorrections.exposureOffsetEv);
    setActiveKelvin(5500);
    setActiveTint(analysisResult.autoBalanceCorrections.targetTint);
    setActiveContrast(analysisResult.autoBalanceCorrections.targetContrast);
  };

  // Reset Grade to Neutral
  const handleResetGrade = () => {
    setActiveExposureEv(0);
    setActiveKelvin(5500);
    setActiveTint(0);
    setActiveContrast(1.0);
    setActiveSaturation(1.0);
    setActiveLift({ r: 0, g: 0, b: 0, lum: 0 });
    setActiveGamma({ r: 0, g: 0, b: 0, lum: 0 });
    setActiveGain({ r: 0, g: 0, b: 0, lum: 0 });
  };

  // Apply a preset from Color Matrix
  const handleApplyPreset = (grade: CinemaGradeParams) => {
    setSelectedPresetId(grade.id);
    setActiveKelvin(grade.kelvin);
    setActiveTint(grade.tint);
    setActiveContrast(grade.contrast);
    setActiveSaturation(grade.saturation);
    setActiveLift({ ...grade.lift });
    setActiveGamma({ ...grade.gamma });
    setActiveGain({ ...grade.gain });
    setSkinProtection(grade.skinToneProtection);
  };

  // Smart recommended presets based on image analysis
  const smartRecommendedPresets = useMemo(() => {
    if (!analysisResult) return ALL_RECOMMENDED_GRADES.slice(0, 6);

    const isNight = analysisResult.meanLuminanceIre < 35 || analysisResult.estimatedKelvin > 7000;
    const isWarmDay = analysisResult.estimatedKelvin < 4800 && analysisResult.meanLuminanceIre >= 40;

    if (isNight) {
      return [
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'cinestill_800t'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'kodak_vision3_500t'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'neon_noir_cyberpunk'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'moonlit_day_for_night'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'cold_nordic_thriller'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'classic_film_noir'),
      ].filter(Boolean) as CinemaGradeParams[];
    } else if (isWarmDay) {
      return [
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'golden_hour_magic'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'kodak_portra_400'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'kodak_gold_200'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'blockbuster_teal_orange'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'wes_pastel_storybook'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'faded_70s_super8'),
      ].filter(Boolean) as CinemaGradeParams[];
    } else {
      // Balanced / Overcast
      return [
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'kodak_vision3_250d'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'kodak_portra_160'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'fuji_pro_400h'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'fuji_velvia_50'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'overcast_nordic'),
        ALL_RECOMMENDED_GRADES.find(g => g.id === 'bleach_bypass_silver'),
      ].filter(Boolean) as CinemaGradeParams[];
    }
  }, [analysisResult]);

  // Current active preset object
  const activePreset = useMemo(() => {
    return ALL_RECOMMENDED_GRADES.find(g => g.id === selectedPresetId) || ALL_RECOMMENDED_GRADES[0];
  }, [selectedPresetId]);

  // Handle Split drag
  const handleSplitPointerDown = (e: React.PointerEvent) => {
    setIsDraggingSplit(true);
    updateSplit(e.clientX);
  };

  const updateSplit = (clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPos(pct);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingSplit) {
        updateSplit(e.clientX);
      }
    };
    const handlePointerUp = () => {
      if (isDraggingSplit) {
        setIsDraggingSplit(false);
      }
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingSplit]);

  // Live SVG Color Matrix for interactive viewport
  const liveFilterMatrix = useMemo(() => {
    // Planckian Kelvin shift
    const kRgb = kelvinToRgb(activeKelvin);
    const kR = kRgb.r / 0.85;
    const kG = (kRgb.g / 0.85) * (1 - (activeTint / 100) * 0.15);
    const kB = (kRgb.b / 0.85) * (1 + (activeTint / 100) * 0.15);

    // Exposure EV multiplier
    const evMult = Math.pow(2, activeExposureEv);

    // Saturation luminance weights
    const sat = activeSaturation;
    const rw = 0.2126 * (1 - sat);
    const gw = 0.7152 * (1 - sat);
    const bw = 0.0722 * (1 - sat);

    // Matrix with Gain, Exposure, and White Balance
    const mR = (rw + sat) * kR * (1 + activeGain.r * 0.35) * evMult;
    const mG = (gw + sat) * kG * (1 + activeGain.g * 0.35) * evMult;
    const mB = (bw + sat) * kB * (1 + activeGain.b * 0.35) * evMult;

    // Offsets for Lift and Contrast
    const offR = activeLift.r * 0.22 + (activeLift.lum / 250);
    const offG = activeLift.g * 0.22 + (activeLift.lum / 250);
    const offB = activeLift.b * 0.22 + (activeLift.lum / 250);

    return `
      ${mR.toFixed(3)} ${gw.toFixed(3)} ${bw.toFixed(3)} 0 ${offR.toFixed(3)}
      ${rw.toFixed(3)} ${mG.toFixed(3)} ${bw.toFixed(3)} 0 ${offG.toFixed(3)}
      ${rw.toFixed(3)} ${gw.toFixed(3)} ${mB.toFixed(3)} 0 ${offB.toFixed(3)}
      0 0 0 1 0
    `;
  }, [activeKelvin, activeTint, activeExposureEv, activeSaturation, activeGain, activeLift]);

  // Export Graded Image as High-Resolution PNG
  const handleExportGradedImage = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original
      ctx.drawImage(img, 0, 0);

      // Apply pixel grade
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const kRgb = kelvinToRgb(activeKelvin);
      const kR = kRgb.r / 0.85;
      const kG = (kRgb.g / 0.85) * (1 - (activeTint / 100) * 0.15);
      const kB = (kRgb.b / 0.85) * (1 + (activeTint / 100) * 0.15);
      const evMult = Math.pow(2, activeExposureEv);

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] / 255;
        let g = data[i + 1] / 255;
        let b = data[i + 2] / 255;

        // White balance & exposure
        r = r * kR * evMult;
        g = g * kG * evMult;
        b = b * kB * evMult;

        // 3-Way Lift/Gamma/Gain
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const shadowWeight = Math.pow(Math.max(0, 1 - lum), 1.6);
        const highlightWeight = Math.pow(lum, 1.4);

        r += activeLift.r * 0.25 * shadowWeight + activeGain.r * 0.3 * highlightWeight;
        g += activeLift.g * 0.25 * shadowWeight + activeGain.g * 0.3 * highlightWeight;
        b += activeLift.b * 0.25 * shadowWeight + activeGain.b * 0.3 * highlightWeight;

        // Contrast
        r = 0.45 + (r - 0.45) * activeContrast;
        g = 0.45 + (g - 0.45) * activeContrast;
        b = 0.45 + (b - 0.45) * activeContrast;

        // Saturation
        const finalLum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = finalLum + (r - finalLum) * activeSaturation;
        g = finalLum + (g - finalLum) * activeSaturation;
        b = finalLum + (b - finalLum) * activeSaturation;

        data[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
        data[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
        data[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob(blob => {
        if (blob) {
          const filename = `graded_${imageFileName.replace(/\.[^/.]+$/, '')}.png`;
          downloadFile(blob, filename);
        }
      }, 'image/png');
    };
    img.src = imageSrc;
  };

  // Current grade params package
  const currentGradeParams: CinemaGradeParams = useMemo(() => {
    return {
      id: `photo_grade_${Date.now()}`,
      name: `${activePreset.name} (Custom Photo Grade)`,
      sceneType: activePreset.sceneType,
      timeframe: imageFileName,
      kelvin: activeKelvin,
      tint: activeTint,
      lift: activeLift,
      gamma: activeGamma,
      gain: activeGain,
      offsetLum: Math.round(activeExposureEv * 15),
      contrast: activeContrast,
      saturation: activeSaturation,
      skinToneProtection: skinProtection,
      recommendedHexes: activePreset.recommendedHexes,
      whyItWorks: activePreset.whyItWorks,
      lightingRecipe: activePreset.lightingRecipe,
      resolveTip: activePreset.resolveTip,
    };
  }, [
    activePreset,
    imageFileName,
    activeKelvin,
    activeTint,
    activeLift,
    activeGamma,
    activeGain,
    activeExposureEv,
    activeContrast,
    activeSaturation,
    skinProtection,
  ]);

  // Export .CUBE LUT
  const handleExportCube = () => {
    const cube = generateCinemaGradeCubeLut(currentGradeParams);
    const blob = new Blob([cube], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, `${imageFileName.replace(/\.[^/.]+$/, '')}_photo_grade.cube`);
  };

  // Export .XMP Preset
  const handleExportXmp = () => {
    const xmp = generateCinemaGradeXmp(currentGradeParams);
    const blob = new Blob([xmp], { type: 'application/rdf+xml;charset=utf-8' });
    downloadFile(blob, `${imageFileName.replace(/\.[^/.]+$/, '')}_photo_grade.xmp`);
  };

  // Preset-specific quick download options (for any cinema grade or film stock)
  const handleDownloadPresetCube = (grade: CinemaGradeParams) => {
    const cube = generateCinemaGradeCubeLut(grade);
    const blob = new Blob([cube], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, `${grade.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_LUT.cube`);
  };

  const handleDownloadPresetXmp = (grade: CinemaGradeParams) => {
    const xmp = generateCinemaGradeXmp(grade);
    const blob = new Blob([xmp], { type: 'application/rdf+xml;charset=utf-8' });
    downloadFile(blob, `${grade.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Lightroom.xmp`);
  };

  const handleDownloadPresetAse = (grade: CinemaGradeParams) => {
    const swatches = [
      { name: `${grade.name} Shadows`, hex: grade.recommendedHexes.shadows },
      { name: `${grade.name} Midtones`, hex: grade.recommendedHexes.midtones },
      { name: `${grade.name} Highlights`, hex: grade.recommendedHexes.highlights },
      { name: `${grade.name} Accent`, hex: grade.recommendedHexes.accent },
    ];
    const ase = generateAseBuffer(grade.name, swatches);
    const blob = new Blob([ase.buffer as ArrayBuffer], { type: 'application/octet-stream' });
    downloadFile(blob, `${grade.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.ase`);
  };

  // Copy DaVinci Resolve Coordinates
  const handleCopyResolveCoords = () => {
    const text = `DaVinci Resolve Grade Settings for "${imageFileName}":
White Balance: ${activeKelvin}K | Tint: ${activeTint}
Exposure Offset: ${activeExposureEv > 0 ? `+${activeExposureEv}` : activeExposureEv} EV
Lift: R=${activeLift.r}, G=${activeLift.g}, B=${activeLift.b} | Lum=${activeLift.lum} IRE
Gamma: R=${activeGamma.r}, G=${activeGamma.g}, B=${activeGamma.b} | Lum=${activeGamma.lum} IRE
Gain: R=${activeGain.r}, G=${activeGain.g}, B=${activeGain.b} | Lum=${activeGain.lum} IRE
Contrast: ${activeContrast.toFixed(2)} | Saturation: ${Math.round(activeSaturation * 100)}%`;

    navigator.clipboard.writeText(text);
    setCopiedResolve(true);
    setTimeout(() => setCopiedResolve(false), 2000);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Hidden processing canvas */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <Camera className="w-4 h-4" />
          <span>Intelligent Photo Analysis &amp; Cinematic Color Grading Studio</span>
          <span aria-hidden="true">·</span>
          <span>Powered by Full Color Matrix Data</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Photo Color Grading &amp; Balancing Lab
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-3xl leading-relaxed mt-1">
              Upload any photograph to analyze its dynamic range, exposure IRE, white balance, and skin tones.
              Neutralize color casts with 1-click auto-balance, and apply industry-standard Hollywood film stock and
              genre presets from the complete Color Matrix.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-950 flex items-center gap-2 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
            </button>

            <button
              onClick={handleExportGradedImage}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow flex items-center gap-1.5 transition-colors"
              title="Download full-resolution graded photograph"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Graded Photo</span>
            </button>

            <button
              onClick={handleExportCube}
              className="px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800 shadow flex items-center gap-1.5 transition-colors"
              title="Export 3D LUT (.CUBE) for DaVinci Resolve or Premiere"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .CUBE</span>
            </button>

            <button
              onClick={handleExportXmp}
              className="px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900 border border-amber-800 shadow flex items-center gap-1.5 transition-colors"
              title="Export Adobe Lightroom Classic .XMP Preset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .XMP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preloaded Sample Photos Switcher Bar */}
      <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Test With Cinema Stills:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadPreloadedSample('day_portrait')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Golden Hour Portrait</span>
          </button>
          <button
            onClick={() => loadPreloadedSample('night_city')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Midnight Neon City</span>
          </button>
          <button
            onClick={() => loadPreloadedSample('alpine_landscape')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Alpine Overcast Lake</span>
          </button>
          <button
            onClick={() => loadPreloadedSample('desert_warm')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Sun className="w-3.5 h-3.5 text-orange-400" />
            <span>Desert Canyon Heat</span>
          </button>
        </div>
      </div>

      {/* Main Dual-View Workspace: Interactive Split Canvas on Left, Diagnostics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Before/After Graded Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">Before vs. Graded Split Comparison</span>
                <span className="text-[11px] font-mono text-slate-400">({imageFileName})</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-slate-400">Left: Original</span>
                <span className="text-cyan-400 font-bold">Right: Graded ({activePreset.name})</span>
              </div>
            </div>

            {/* Split Screen Container */}
            <div
              ref={splitContainerRef}
              onPointerDown={handleSplitPointerDown}
              className="relative w-full aspect-[16/10] bg-black rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-800 shadow-inner group"
            >
              {imageSrc ? (
                <>
                  {/* Under layer: Graded Image with live SVG Matrix */}
                  <div className="absolute inset-0 w-full h-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <filter id="photoGradeFilter">
                        <feColorMatrix type="matrix" values={liveFilterMatrix} />
                      </filter>
                      <image
                        href={imageSrc}
                        width="100"
                        height="100"
                        preserveAspectRatio="xMidYMid meet"
                        filter="url(#photoGradeFilter)"
                      />
                    </svg>
                  </div>

                  {/* Over layer: Original Image (clipped by split percentage) */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${splitPos}%` }}
                  >
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: splitContainerRef.current
                          ? `${splitContainerRef.current.clientWidth}px`
                          : '100%',
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt="Original Uncorrected"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Split Divider Line & Draggable Handle */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white font-mono">
                      ↔
                    </div>
                  </div>

                  {/* Corner Badges */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-slate-300 pointer-events-none">
                    BEFORE (RAW)
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-cyan-950/80 backdrop-blur-sm text-[10px] font-mono text-cyan-300 border border-cyan-800 pointer-events-none">
                    GRADED ({activeKelvin}K · C:{activeContrast}x)
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <Camera className="w-8 h-8 opacity-40" />
                  <span className="text-xs">Select or upload a photo to start grading</span>
                </div>
              )}
            </div>

            {/* Viewport Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                  <button
                    onClick={() => setSplitPos(0)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${splitPos === 0 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setSplitPos(50)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${splitPos === 50 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Split
                  </button>
                  <button
                    onClick={() => setSplitPos(100)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${splitPos === 100 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    After
                  </button>
                </div>
                <span className="hidden sm:inline mx-1">|</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPos}
                  onChange={e => setSplitPos(Number(e.target.value))}
                  className="hidden sm:block w-32 h-1.5 rounded-lg appearance-none bg-slate-800 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFullBalance}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Automatically neutralize color cast, balance exposure to 48 IRE, and optimize contrast"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1-Click Auto-Balance</span>
                </button>

                <button
                  onClick={handleResetGrade}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Neutral</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Video Scopes (Vectorscope & RGB Parade) */}
          <CinemaScopes
            lift={activeLift}
            gamma={activeGamma}
            gain={activeGain}
            offsetLum={Math.round(activeExposureEv * 10)}
            kelvin={activeKelvin}
            tint={activeTint}
            contrast={activeContrast}
            saturation={activeSaturation}
          />
        </div>

        {/* Right: Technical Photo Diagnostics & Colorimetric Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {analysisResult ? (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Photographic Health &amp; Analysis</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  ~{analysisResult.dynamicRangeStops} Stops Lat.
                </span>
              </div>

              {/* Exposure Meter Card */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase text-[10px]">Exposure &amp; Luminance</span>
                  <span className={`font-bold text-[11px] ${
                    analysisResult.exposureAssessment === 'Balanced Exposure'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}>
                    {analysisResult.exposureAssessment}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Mean Luminance:</span>
                    <span className="text-white font-bold">{analysisResult.meanLuminanceIre} IRE</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400"
                      style={{ width: `${analysisResult.meanLuminanceIre}%` }}
                    />
                  </div>
                </div>

                {/* Tonal Histogram Overlay */}
                <HistogramOverlay histogram={analysisResult.histogramData} />


                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                  <div>Shadow Clip: {analysisResult.shadowClippingPct}%</div>
                  <div>Highlight Clip: {analysisResult.highlightClippingPct}%</div>
                </div>
              </div>

              {/* White Balance & Cast Card */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase text-[10px]">White Balance &amp; CCT</span>
                  <span className="font-mono text-cyan-300 text-[11px]">
                    ~{analysisResult.estimatedKelvin}K
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {analysisResult.colorCastAssessment}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-850">
                  <span>Tint Shift: {analysisResult.estimatedTint > 0 ? `+${analysisResult.estimatedTint} (Magenta)` : `${analysisResult.estimatedTint} (Green)`}</span>
                  <button
                    onClick={handleAutoNeutralizeWb}
                    className="text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    Neutralize WB
                  </button>
                </div>
              </div>

              {/* Extracted Dominant Palette */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase text-[10px]">Extracted Scene Palette</span>
                  <span className="text-[10px] text-slate-500 font-mono">Click to copy</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {analysisResult.dominantColors.map(swatch => (
                    <div
                      key={swatch.hex + swatch.name}
                      onClick={() => handleCopyHex(swatch.hex)}
                      className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors group"
                    >
                      <div
                        className="w-full h-7 rounded shadow-inner mb-1.5 border border-white/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div className="font-bold text-[10px] text-white truncate">{swatch.name}</div>
                      <div className="font-mono text-[9px] text-slate-400 group-hover:text-cyan-400">
                        {swatch.hex}
                      </div>
                      <div className="text-[8px] text-slate-500 truncate">{swatch.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skin Tone Evaluation */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase text-[10px]">Skin Tone Vectorscope Check</span>
                  <span className={`font-bold text-[10px] ${
                    analysisResult.skinToneAnalysis.skinStatus === 'Centered on I-Line'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}>
                    {analysisResult.skinToneAnalysis.skinStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {analysisResult.skinToneAnalysis.skinDetected
                    ? `Skin pixels occupy ~${analysisResult.skinToneAnalysis.pixelCoveragePct}% of the frame, deviating by ${analysisResult.skinToneAnalysis.deviationFromSkinLineDeg}° from the Hollywood 135° I-Line standard.`
                    : 'No prominent human skin tones detected in this scene composition.'}
                </p>
              </div>

              {/* Auto-Balance Recommendation Note */}
              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/50 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  <span>Colorist Recommendation</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {analysisResult.autoBalanceCorrections.summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center text-slate-400 text-xs">
              Loading image metrics...
            </div>
          )}
        </div>
      </div>

      {/* Interactive Grading Sliders & Wheels Bar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Live Color Grading Controls &amp; 3-Way Wheels</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={skinProtection}
                onChange={e => setSkinProtection(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Protect Skin Tone I-Line (135°)</span>
            </label>
          </div>
        </div>

        {/* Global Primary Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
          {/* Exposure EV */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Exposure EV</span>
              <span className="text-white font-bold">{activeExposureEv > 0 ? `+${activeExposureEv}` : activeExposureEv} EV</span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              value={activeExposureEv}
              onChange={e => setActiveExposureEv(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* White Balance CCT */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Temperature</span>
              <span className="text-amber-300 font-bold">{activeKelvin}K</span>
            </div>
            <input
              type="range"
              min="2400"
              max="9500"
              step="50"
              value={activeKelvin}
              onChange={e => setActiveKelvin(Number(e.target.value))}
              className="w-full h-1.5 rounded appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #f59e0b 0%, #ffffff 50%, #38bdf8 100%)',
              }}
            />
          </div>

          {/* Tint */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Tint (G/M)</span>
              <span className="text-slate-200 font-bold">{activeTint > 0 ? `+${activeTint}` : activeTint}</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              value={activeTint}
              onChange={e => setActiveTint(Number(e.target.value))}
              className="w-full h-1.5 rounded appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #10b981 0%, #ffffff 50%, #ec4899 100%)',
              }}
            />
          </div>

          {/* Contrast */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Contrast</span>
              <span className="text-white font-bold">{activeContrast.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.7"
              step="0.02"
              value={activeContrast}
              onChange={e => setActiveContrast(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Saturation</span>
              <span className="text-white font-bold">{Math.round(activeSaturation * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={activeSaturation}
              onChange={e => setActiveSaturation(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-rose-400 cursor-pointer"
            />
          </div>
        </div>

        {/* 3-Way Color Wheels Component */}
        <ThreeWayColorWheels
          lift={activeLift}
          gamma={activeGamma}
          gain={activeGain}
          offsetLum={Math.round(activeExposureEv * 15)}
          kelvin={activeKelvin}
          tint={activeTint}
          contrast={activeContrast}
          saturation={activeSaturation}
          skinToneProtection={skinProtection}
          onUpdateLift={setActiveLift}
          onUpdateGamma={setActiveGamma}
          onUpdateGain={setActiveGain}
          onUpdateOffsetLum={val => setActiveExposureEv(Number((val / 15).toFixed(2)))}
          onUpdateKelvin={setActiveKelvin}
          onUpdateTint={setActiveTint}
          onUpdateContrast={setActiveContrast}
          onUpdateSaturation={setActiveSaturation}
          onToggleSkinToneProtection={() => setSkinProtection(prev => !prev)}
          onResetAll={handleResetGrade}
        />
      </div>

      {/* Preset Recommendations Strip (From Complete Color Matrix Data) */}
      <div className="space-y-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Hollywood Cinematic Preset Library (From Color Matrix)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any industry-grade photochemical film stock, genre look, or day/night palette to apply instantly.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setPresetCategory('smart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                presetCategory === 'smart'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Smart Matches (AI)
            </button>
            <button
              onClick={() => setPresetCategory('film_stock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                presetCategory === 'film_stock'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Film Stocks (16)
            </button>
            <button
              onClick={() => setPresetCategory('day')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                presetCategory === 'day'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Day Looks (5)
            </button>
            <button
              onClick={() => setPresetCategory('night')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                presetCategory === 'night'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Night Looks (5)
            </button>
            <button
              onClick={() => setPresetCategory('stylized')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                presetCategory === 'stylized'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Stylized &amp; Genre (7)
            </button>
          </div>
        </div>

        {/* Film Stock Brand Filter (when film stock tab is selected) */}
        {presetCategory === 'film_stock' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
              Emulation Brand:
            </span>
            {(['All', 'Kodak', 'Fujifilm', 'CineStill', 'Ilford'] as const).map(brand => {
              const count = brand === 'All' ? FILM_STOCK_GRADES.length : FILM_STOCK_GRADES.filter(f => f.filmStockInfo?.manufacturer === brand).length;
              return (
                <button
                  key={brand}
                  onClick={() => setFilmBrandFilter(brand)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filmBrandFilter === brand
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {brand} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {(presetCategory === 'smart'
            ? smartRecommendedPresets
            : presetCategory === 'day'
            ? DAY_CINEMA_GRADES
            : presetCategory === 'night'
            ? NIGHT_CINEMA_GRADES
            : presetCategory === 'stylized'
            ? STYLIZED_CINEMA_GRADES
            : filmBrandFilter === 'All'
            ? FILM_STOCK_GRADES
            : FILM_STOCK_GRADES.filter(g => g.filmStockInfo?.manufacturer === filmBrandFilter)
          ).map(grade => {
            const isSelected = grade.id === selectedPresetId;
            return (
              <div
                key={grade.id}
                onClick={() => handleApplyPreset(grade)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 cursor-pointer group ${
                  isSelected
                    ? 'bg-slate-800 border-slate-650 shadow-lg ring-2 ring-cyan-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="truncate">{grade.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span className="truncate">{grade.sceneType.toUpperCase()}</span>
                    <span className="font-mono text-cyan-400">{grade.kelvin}K</span>
                  </div>
                </div>

                {/* 4 Swatches */}
                <div className="flex items-center gap-1 h-4 rounded overflow-hidden p-0.5 bg-slate-900 border border-slate-800">
                  <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: grade.recommendedHexes.shadows }} />
                  <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: grade.recommendedHexes.midtones }} />
                  <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: grade.recommendedHexes.highlights }} />
                  <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: grade.recommendedHexes.accent }} />
                </div>

                {/* Preset Quick Download Options */}
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[10px]">
                  <span className="text-slate-500 font-mono">Preset:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDownloadPresetCube(grade);
                      }}
                      className="px-1.5 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-semibold flex items-center gap-0.5 transition-colors"
                      title={`Download ${grade.name} .CUBE 3D LUT for DaVinci Resolve`}
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>LUT</span>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDownloadPresetXmp(grade);
                      }}
                      className="px-1.5 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 font-semibold flex items-center gap-0.5 transition-colors"
                      title={`Download ${grade.name} .XMP Preset for Adobe Lightroom`}
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>XMP</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Preset Deep Dive & Colorist Manual */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <span className="capitalize">{activePreset.sceneType} Grade Masterclass</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-white">{activePreset.name}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-amber-300">{activePreset.kelvin}K</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {activePreset.whyItWorks}
            </p>
          </div>

          {/* Downloadable Preset Options Bar */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            <button
              onClick={() => handleDownloadPresetCube(activePreset)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download 3D LUT (.CUBE) for DaVinci Resolve & Premiere"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .CUBE LUT</span>
            </button>

            <button
              onClick={() => handleDownloadPresetXmp(activePreset)}
              className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download Lightroom Preset (.XMP)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .XMP Preset</span>
            </button>

            <button
              onClick={() => handleDownloadPresetAse(activePreset)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download Adobe Swatch Exchange (.ASE) for Photoshop"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download .ASE</span>
            </button>

            <button
              onClick={handleCopyResolveCoords}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedResolve ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Coordinates</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resolve and Lightroom Technical Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-cyan-300">DaVinci Resolve Node Tip:</strong>
            <p className="text-slate-300 leading-relaxed">{activePreset.resolveTip}</p>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-amber-300">On-Set Physical Lighting Recipe:</strong>
            <p className="text-slate-300 leading-relaxed">
              Key: {activePreset.lightingRecipe.key} · Fill: {activePreset.lightingRecipe.fill} · Contrast: {activePreset.lightingRecipe.ratio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
