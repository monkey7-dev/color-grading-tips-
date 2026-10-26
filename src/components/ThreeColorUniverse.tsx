import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  EMOTION_COLOR_VOLUMES,
  TOTAL_TRUECOLOR_COUNT,
  EmotionColorVolume,
  calculateVolumeColorCount,
  sampleColorsFromBounds,
} from '../utils/colorSpace16M';
import { hslToRgb, rgbToHex } from '../utils/colorMath';
import {
  Box,
  Layers,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Sparkles,
  Info,
  Maximize2,
} from 'lucide-react';

export type ColorSpaceMode = 'cube' | 'cylinder' | 'sphere';
export type CameraPreset = 'perspective' | 'top' | 'macro';

// Scratch math helpers outside loop (Zero GC)
const _vec3 = new THREE.Vector3();
const _color = new THREE.Color();
const _matrix = new THREE.Matrix4();
const _scale = new THREE.Vector3();
const _dummy = new THREE.Object3D();

export const ThreeColorUniverse: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('joy');
  const [colorSpaceMode, setColorSpaceMode] = useState<ColorSpaceMode>('cylinder');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [activeDockTab, setActiveDockTab] = useState<'emotions' | 'slicer' | 'spaces' | 'camera'>('emotions');

  // Custom Volumetric Slicer State
  const [customHueMin, setCustomHueMin] = useState<number>(30);
  const [customHueMax, setCustomHueMax] = useState<number>(70);
  const [customSatMin, setCustomSatMin] = useState<number>(50);
  const [customSatMax, setCustomSatMax] = useState<number>(100);
  const [customLumMin, setCustomLumMin] = useState<number>(40);
  const [customLumMax, setCustomLumMax] = useState<number>(90);

  const selectedEmotion = useMemo(() => {
    return EMOTION_COLOR_VOLUMES.find(e => e.id === selectedEmotionId) || EMOTION_COLOR_VOLUMES[0];
  }, [selectedEmotionId]);

  // Compute live color count for custom slicer
  const customColorCount = useMemo(() => {
    return calculateVolumeColorCount({
      hueMin: customHueMin,
      hueMax: customHueMax,
      satMin: customSatMin,
      satMax: customSatMax,
      lumMin: customLumMin,
      lumMax: customLumMax,
    });
  }, [customHueMin, customHueMax, customSatMin, customSatMax, customLumMin, customLumMax]);

  // Refs for Three.js state communication
  const stateRef = useRef({
    selectedEmotion,
    colorSpaceMode,
    customBounds: {
      hueMin: customHueMin,
      hueMax: customHueMax,
      satMin: customSatMin,
      satMax: customSatMax,
      lumMin: customLumMin,
      lumMax: customLumMax,
    },
    useCustomSlicer: activeDockTab === 'slicer',
    cameraTargetPreset: 'perspective' as CameraPreset,
  });

  // Sync stateRef
  useEffect(() => {
    stateRef.current.selectedEmotion = selectedEmotion;
    stateRef.current.colorSpaceMode = colorSpaceMode;
    stateRef.current.customBounds = {
      hueMin: customHueMin,
      hueMax: customHueMax,
      satMin: customSatMin,
      satMax: customSatMax,
      lumMin: customLumMin,
      lumMax: customLumMax,
    };
    stateRef.current.useCustomSlicer = activeDockTab === 'slicer';
  }, [selectedEmotion, colorSpaceMode, customHueMin, customHueMax, customSatMin, customSatMax, customLumMin, customLumMax, activeDockTab]);

  // Three.js Mount
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 80);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.FogExp2(0x070b12, 0.022);

    // Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 9.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    scene.add(new THREE.HemisphereLight(0x7dd3fc, 0x090d16, 1.2));

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 10, 6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-6, 4, -6);
    scene.add(rimLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 3;
    controls.maxDistance = 18;
    controls.target.set(0, 1.2, 0);

    // --- COMPOSITE 3-12 PART PROCEDURAL HERO MODEL ---
    // The "Cinematic Optical Prism & Emotion Resonator"
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 0);

    // Part 1: Heavy Beveled Pedestal Base (gunmetal titanium)
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.25, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const pedestal = new THREE.Mesh(baseGeo, baseMat);
    pedestal.position.y = 0.125;
    pedestal.receiveShadow = !isSoftwareGl;
    heroGroup.add(pedestal);

    // Part 2: Support Struts
    const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
    const strutMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.15,
    });
    const strutLeft = new THREE.Mesh(strutGeo, strutMat);
    strutLeft.position.set(-0.85, 0.85, 0);
    const strutRight = new THREE.Mesh(strutGeo, strutMat);
    strutRight.position.set(0.85, 0.85, 0);
    heroGroup.add(strutLeft);
    heroGroup.add(strutRight);

    // Part 3: Gyroscopic Outer Gimbal Ring (Gold/Brass)
    const ringGeoA = new THREE.TorusGeometry(1.0, 0.045, 16, 48);
    const ringMatA = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ringA = new THREE.Mesh(ringGeoA, ringMatA);
    ringA.position.y = 1.45;
    heroGroup.add(ringA);

    // Part 4: Gyroscopic Inner Gimbal Ring (Cyan steel)
    const ringGeoB = new THREE.TorusGeometry(0.82, 0.04, 16, 48);
    const ringMatB = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ringB = new THREE.Mesh(ringGeoB, ringMatB);
    ringB.position.y = 1.45;
    ringB.rotation.x = Math.PI / 2;
    heroGroup.add(ringB);

    // Part 5: Optical Faceted Crystal Prism (Quartz Glass)
    const prismGeo = new THREE.OctahedronGeometry(0.55, 0);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.6 : 1.0,
      ior: 1.6,
      thickness: 1.2,
      clearcoat: 1.0,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.y = 1.45;
    heroGroup.add(prism);

    // Part 6: Core Chromatic Emitter Sphere (Glowing heart)
    const emitterGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const emitterMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.position.y = 1.45;
    heroGroup.add(emitter);

    // Part 7: Lens Aperture Engraved Ring
    const apertureGeo = new THREE.RingGeometry(0.5, 0.65, 32);
    const apertureMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const aperture = new THREE.Mesh(apertureGeo, apertureMat);
    aperture.position.y = 0.27;
    aperture.rotation.x = -Math.PI / 2;
    heroGroup.add(aperture);

    // Part 8: Radial Contact Ground Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    heroGroup.add(shadowPlane);

    scene.add(heroGroup);

    // --- 16.7 MILLION COLOR POINT SWARM (INSTANCED MESH) ---
    // 2,400 discrete particles spanning the complete 16.7M gamut
    const nodeCount = 2400;
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const instancedMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Precalculate particle color representations across RGB & HSL
    interface ParticleData {
      h: number;
      s: number;
      l: number;
      rgb: { r: number; g: number; b: number };
      cubePos: THREE.Vector3;
      cylPos: THREE.Vector3;
      spherePos: THREE.Vector3;
    }

    const particles: ParticleData[] = [];
    // Distribute particles across the chromatic gamut
    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const w = Math.random();

      // HSL representation
      const h = u * 360;
      const s = 20 + v * 80; // avoid pure black/white mud
      const l = 15 + w * 70;
      const rgb = hslToRgb(h, s, l);

      // 1. RGB Cube coordinates (-1.5 to 1.5)
      const cubePos = new THREE.Vector3(
        (rgb.r / 255 - 0.5) * 3.4,
        (rgb.g / 255 - 0.5) * 3.4 + 1.8,
        (rgb.b / 255 - 0.5) * 3.4
      );

      // 2. HSL Cylinder coordinates
      const rad = (h * Math.PI) / 180;
      const cylRadius = (s / 100) * 2.2;
      const cylPos = new THREE.Vector3(
        Math.cos(rad) * cylRadius,
        (l / 100) * 3.2 + 0.3,
        Math.sin(rad) * cylRadius
      );

      // 3. Spherical coordinates
      const phi = (l / 100) * Math.PI; // 0 to PI
      const theta = rad;
      const sphRadius = (s / 100) * 2.2;
      const spherePos = new THREE.Vector3(
        sphRadius * Math.sin(phi) * Math.cos(theta),
        sphRadius * Math.cos(phi) + 1.8,
        sphRadius * Math.sin(phi) * Math.sin(theta)
      );

      particles.push({
        h,
        s,
        l,
        rgb,
        cubePos,
        cylPos,
        spherePos,
      });

      // Set initial color
      _color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
      instancedMesh.setColorAt(i, _color);
    }

    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }
    scene.add(instancedMesh);

    // Animation & State Loop
    let frameId = 0;
    const timer = new THREE.Timer();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    // Function to check if particle is inside current bounds
    function isInsideBounds(p: ParticleData, b: { hueMin: number; hueMax: number; satMin: number; satMax: number; lumMin: number; lumMax: number }): boolean {
      let inHue = false;
      if (b.hueMin <= b.hueMax) {
        inHue = p.h >= b.hueMin && p.h <= b.hueMax;
      } else {
        // Wraps around 360° (e.g. Red 340° to 20°)
        inHue = p.h >= b.hueMin || p.h <= b.hueMax;
      }
      const inSat = p.s >= b.satMin && p.s <= b.satMax;
      const inLum = p.l >= b.lumMin && p.l <= b.lumMax;
      return inHue && inSat && inLum;
    }

    function tick() {
      timer.update();
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      // Rotate prism and gyroscopes
      ringA.rotation.z = elapsed * 0.4;
      ringB.rotation.x = elapsed * 0.55;
      prism.rotation.y = elapsed * 0.7;
      prism.rotation.x = Math.sin(elapsed * 0.5) * 0.3;

      // Update core emitter color to match active emotion
      const activeHex = stateRef.current.selectedEmotion.dominantHex;
      _color.set(activeHex);
      emitterMat.color.copy(_color);
      emitterMat.emissive.copy(_color);
      emitterMat.emissiveIntensity = 2.0 + Math.sin(elapsed * 3) * 0.5;

      // Particle positions & scale updates
      const mode = stateRef.current.colorSpaceMode;
      const bounds = stateRef.current.useCustomSlicer
        ? stateRef.current.customBounds
        : stateRef.current.selectedEmotion.bounds;

      for (let i = 0; i < nodeCount; i++) {
        const p = particles[i];
        let targetPos = p.cylPos;
        if (mode === 'cube') targetPos = p.cubePos;
        if (mode === 'sphere') targetPos = p.spherePos;

        // Check if particle falls in active emotional subspace
        const matchesEmotion = isInsideBounds(p, bounds);

        _dummy.position.copy(targetPos);
        // Gently pulse matching emotion nodes
        const nodeScale = matchesEmotion ? 1.4 + Math.sin(elapsed * 4 + i) * 0.25 : 0.45;
        _dummy.scale.setScalar(nodeScale);
        _dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, _dummy.matrix);

        // Color intensity
        if (matchesEmotion) {
          _color.setRGB(p.rgb.r / 255, p.rgb.g / 255, p.rgb.b / 255);
        } else {
          // Dim non-matching particles into faint gray dust
          _color.setRGB(0.12, 0.16, 0.22);
        }
        instancedMesh.setColorAt(i, _color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }

      if (!isSoftwareGl) {
        controls.update();
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (window.innerHeight - 80);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      strutGeo.dispose();
      strutMat.dispose();
      ringGeoA.dispose();
      ringMatA.dispose();
      ringGeoB.dispose();
      ringMatB.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      emitterGeo.dispose();
      emitterMat.dispose();
      apertureGeo.dispose();
      apertureMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      instancedMesh.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-130px)] min-h-[620px] rounded-3xl overflow-hidden bg-[#070b12] border border-slate-800 shadow-2xl flex flex-col select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Spec & Telemetry HUD Overlay (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 pointer-events-none">
        <div className="bg-[#0b1329]/90 px-4 py-2 rounded-xl border border-slate-800 shadow-xl flex items-center gap-3">
          <div
            className="w-3.5 h-3.5 rounded-full shadow-lg animate-pulse"
            style={{ backgroundColor: selectedEmotion.dominantHex }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                16.7M TrueColor Universe
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                2^24 Gamut (16,777,216)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Active: <strong className="text-white">{selectedEmotion.name}</strong> ·{' '}
              <span className="font-mono text-amber-400">
                {activeDockTab === 'slicer'
                  ? `${customColorCount.toLocaleString()} Colors (${((customColorCount / TOTAL_TRUECOLOR_COUNT) * 100).toFixed(2)}%)`
                  : `${selectedEmotion.estimatedColorCount.toLocaleString()} Colors (${selectedEmotion.percentageOfAllColors}%)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Quick Hint */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 pointer-events-none text-[11px] text-slate-400 bg-[#0b1329]/80 px-3 py-1.5 rounded-lg border border-slate-800">
        <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Orbit: Drag · Zoom: Scroll · Pan: Right-Click</span>
      </div>

      {/* --- COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion <=15% height) --- */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[94vw] max-w-4xl transition-all duration-300 ${
          isControlsCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        <div className="bg-[#0b1329]/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Dock Header Bar with Collapse Toggle & Navigation Tabs */}
          <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveDockTab('emotions')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeDockTab === 'emotions'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Emotion Volumes</span>
              </button>

              <button
                onClick={() => setActiveDockTab('slicer')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeDockTab === 'slicer'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>16.7M Volumetric Slicer</span>
              </button>

              <button
                onClick={() => setActiveDockTab('spaces')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeDockTab === 'spaces'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                <span>3D Coordinate Space</span>
              </button>
            </div>

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsControlsCollapsed(prev => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-700/80 transition-colors shrink-0 ml-2"
              title="Toggle HUD Visibility (Hotkey H)"
            >
              {isControlsCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px]">Show Controls</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Hide Dock</span>
                </>
              )}
            </button>
          </div>

          {/* Dock Content Body */}
          <div className="p-4 overflow-x-auto max-h-48">
            {/* Tab 1: Emotions Selector */}
            {activeDockTab === 'emotions' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    Select Psychological Reaction to Map its Color Subspace:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Somatic: {selectedEmotion.psychologicalReaction}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {EMOTION_COLOR_VOLUMES.map(item => {
                    const isSelected = item.id === selectedEmotionId;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedEmotionId(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-slate-800 border-slate-600 shadow-md ring-1 ring-slate-500'
                            : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow"
                          style={{ backgroundColor: item.dominantHex }}
                        />
                        <div className="truncate min-w-0">
                          <div className="font-bold text-xs text-white truncate">{item.name}</div>
                          <div className="text-[10px] font-mono text-cyan-400">
                            {(item.estimatedColorCount / 1000).toFixed(0)}k colors ({item.percentageOfAllColors}%)
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: 16.7M Volumetric Slicer */}
            {activeDockTab === 'slicer' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Custom Gamut Slicer:</span>
                    <span className="font-mono text-amber-400 text-sm">
                      {customColorCount.toLocaleString()} Colors
                    </span>
                    <span className="text-slate-400">
                      ({((customColorCount / TOTAL_TRUECOLOR_COUNT) * 100).toFixed(2)}% of 16,777,216 TrueColor Space)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Isolates precise hue, saturation, and luminance vectors
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Hue Span */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span>Hue Angle Range:</span>
                      <span className="text-cyan-400">{customHueMin}° – {customHueMax}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="359"
                        value={customHueMin}
                        onChange={e => setCustomHueMin(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                      <input
                        type="range"
                        min="0"
                        max="359"
                        value={customHueMax}
                        onChange={e => setCustomHueMax(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Saturation Span */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span>Saturation Range:</span>
                      <span className="text-cyan-400">{customSatMin}% – {customSatMax}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customSatMin}
                        onChange={e => setCustomSatMin(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customSatMax}
                        onChange={e => setCustomSatMax(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Luminance Span */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span>Luminance Range:</span>
                      <span className="text-cyan-400">{customLumMin}% – {customLumMax}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customLumMin}
                        onChange={e => setCustomLumMin(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customLumMax}
                        onChange={e => setCustomLumMax(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Coordinate Space Selector */}
            {activeDockTab === 'spaces' && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300">
                  Select 3D Geometric Representation of the 16.7M Color Manifold:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => setColorSpaceMode('cylinder')}
                    className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                      colorSpaceMode === 'cylinder'
                        ? 'bg-slate-800 border-slate-600 shadow-md ring-1 ring-slate-500'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>HSL Cylindrical Manifold</span>
                      <span className="text-[10px] font-mono text-cyan-400">Angle / Rad / Y</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Standard artistic double-cone: Hue revolves 360°, Saturation expands radially, Luminance ascends vertically.
                    </p>
                  </button>

                  <button
                    onClick={() => setColorSpaceMode('cube')}
                    className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                      colorSpaceMode === 'cube'
                        ? 'bg-slate-800 border-slate-600 shadow-md ring-1 ring-slate-500'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>RGB Cartesian Cube</span>
                      <span className="text-[10px] font-mono text-cyan-400">(X:R, Y:G, Z:B)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Raw physical video matrix: Orthogonal XYZ axes representing 8-bit Red, Green, and Blue channel intensities.
                    </p>
                  </button>

                  <button
                    onClick={() => setColorSpaceMode('sphere')}
                    className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                      colorSpaceMode === 'sphere'
                        ? 'bg-slate-800 border-slate-600 shadow-md ring-1 ring-slate-500'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>Spherical Munsell Volume</span>
                      <span className="text-[10px] font-mono text-cyan-400">Polar Chroma</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Perceptual psychophysical globe: Polar poles for White/Black with high-chroma equator crust.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
