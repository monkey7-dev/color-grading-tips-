/**
 * 3D Cinematic Lighting & Color Grading Stage (Three.js)
 * Implements Studio PBR Lighting, ACESFilmicToneMapping, RoomEnvironment with PMREMGenerator,
 * an 11-part procedural Hollywood Cinema Camera Rig with Macbeth Color Chart,
 * dynamic procedural vectorscope OLED monitor texture, damped 60fps camera,
 * and compact floating viewport controls.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Sun,
  Moon,
  Sparkles,
  Download,
  Bookmark,
  RotateCcw,
  Sliders,
  Camera,
  Layers,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { kelvinToRgb, ColorWheelVal } from '../utils/cinematographyGradingMath';
import { generateCubeLut, downloadFile, ColorRecipe } from '../utils/exporters';
import { useAuth } from '../context/AuthContext';
import { saveUserGrade } from '../services/userColorStorage';

export const ThreeCinemaStage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { user } = useAuth();

  // 3-Point Studio Lighting Parameters
  const [keyKelvin, setKeyKelvin] = useState<number>(3200); // 3200K Tungsten or 5600K Daylight
  const [keyIntensity, setKeyIntensity] = useState<number>(3.5);
  const [fillIntensity, setFillIntensity] = useState<number>(0.8);
  const [rimIntensity, setRimIntensity] = useState<number>(2.0);
  const [practicalColor, setPracticalColor] = useState<string>('#06b6d4'); // Cyan neon practical
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Cinema Grade Color Wheel Modifiers applied to 3D Stage
  const [gradeLift, setGradeLift] = useState<ColorWheelVal>({ r: 0, g: 0, b: 0, lum: 0 });
  const [gradeGamma, setGradeGamma] = useState<ColorWheelVal>({ r: 0, g: 0, b: 0, lum: 0 });
  const [gradeGain, setGradeGain] = useState<ColorWheelVal>({ r: 0, g: 0, b: 0, lum: 0 });
  const [exposure, setExposure] = useState<number>(1.0);

  // UI Dock state
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [activePresetName, setActivePresetName] = useState<string>('Tungsten Noir (3200K)');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // References for mutable 3D scene elements
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const rimLightRef = useRef<THREE.SpotLight | null>(null);
  const practicalLightRef = useRef<THREE.PointLight | null>(null);
  const practicalMeshRef = useRef<THREE.Mesh | null>(null);
  const cameraGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const monitorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monitorTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Helper to create procedural radial contact shadow texture
  const createContactShadowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.5)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Helper to create procedural carbon fiber bump canvas texture
  const createCarbonFiberTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#0f172a';
      for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
          if ((x + y) % 16 === 0) {
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  };

  // Build the 11-part procedural Hollywood Cinema Camera Rig
  const buildProceduralCinemaRig = () => {
    const rigGroup = new THREE.Group();
    const carbonTex = createCarbonFiberTexture();

    // 1. Carbon-Fiber Pedestal & Pneumatic Column
    const pedestalBaseGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.15, 32);
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.25,
      bumpMap: carbonTex,
      bumpScale: 0.02,
    });
    const pedestalBase = new THREE.Mesh(pedestalBaseGeo, darkMetalMat);
    pedestalBase.position.y = 0.075;
    pedestalBase.castShadow = true;
    pedestalBase.receiveShadow = true;
    rigGroup.add(pedestalBase);

    const columnGeo = new THREE.CylinderGeometry(0.12, 0.14, 1.1, 24);
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.9,
      roughness: 0.2,
    });
    const column = new THREE.Mesh(columnGeo, columnMat);
    column.position.y = 0.7;
    column.castShadow = true;
    rigGroup.add(column);

    // 2. Fluid Pan/Tilt Head with brass leveling ring
    const fluidHeadGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.22, 24);
    const fluidHeadMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.15,
    });
    const fluidHead = new THREE.Mesh(fluidHeadGeo, fluidHeadMat);
    fluidHead.position.y = 1.35;
    fluidHead.castShadow = true;
    rigGroup.add(fluidHead);

    const brassRingGeo = new THREE.TorusGeometry(0.22, 0.02, 16, 32);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.95,
      roughness: 0.15,
    });
    const brassRing = new THREE.Mesh(brassRingGeo, brassMat);
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = 1.35;
    rigGroup.add(brassRing);

    // 3. Main Camera Body (ARRI / RED Cinema Cage)
    const cameraBodyGeo = new THREE.BoxGeometry(0.55, 0.48, 0.75);
    const cameraCageMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.7,
      roughness: 0.35,
    });
    const cameraBody = new THREE.Mesh(cameraBodyGeo, cameraCageMat);
    cameraBody.position.set(0, 1.7, 0);
    cameraBody.castShadow = true;
    rigGroup.add(cameraBody);

    // Side I/O and Dial accents
    const dialGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.9, roughness: 0.2 });
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.rotation.z = Math.PI / 2;
    dial.position.set(0.29, 1.75, 0.1);
    rigGroup.add(dial);

    // 4. Top Cheese Handle & NATO Rail
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.95, -0.2),
      new THREE.Vector3(0, 2.12, -0.15),
      new THREE.Vector3(0, 2.12, 0.15),
      new THREE.Vector3(0, 1.95, 0.2),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.03, 12, false);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.3 });
    const topHandle = new THREE.Mesh(handleGeo, handleMat);
    topHandle.castShadow = true;
    rigGroup.add(topHandle);

    // 5. Optical Cinema Lens Barrel (35mm Anamorphic Prime)
    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, 1.7, 0.55);

    const barrelBaseGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.35, 32);
    const lensBarrelMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9, roughness: 0.2 });
    const barrelBase = new THREE.Mesh(barrelBaseGeo, lensBarrelMat);
    barrelBase.rotation.x = Math.PI / 2;
    barrelBase.castShadow = true;
    lensGroup.add(barrelBase);

    // Geared Focus & Iris Rings
    const gearRingGeo = new THREE.TorusGeometry(0.21, 0.015, 8, 36);
    const gearRingMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.95, roughness: 0.1 });
    const gearRing1 = new THREE.Mesh(gearRingGeo, gearRingMat);
    gearRing1.position.z = -0.05;
    lensGroup.add(gearRing1);

    const gearRing2 = new THREE.Mesh(gearRingGeo, gearRingMat);
    gearRing2.position.z = 0.08;
    lensGroup.add(gearRing2);

    // 6. Front Coated Anamorphic Glass Element
    const glassGeo = new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.88,
      thickness: 0.2,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const frontGlass = new THREE.Mesh(glassGeo, glassMat);
    frontGlass.rotation.x = Math.PI / 2;
    frontGlass.position.z = 0.18;
    lensGroup.add(frontGlass);
    rigGroup.add(lensGroup);

    // 7. Carbon Fiber Matte Box with Top & Side Flags
    const matteBoxGeo = new THREE.BoxGeometry(0.65, 0.5, 0.2);
    const matteBoxMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.6, roughness: 0.5 });
    const matteBox = new THREE.Mesh(matteBoxGeo, matteBoxMat);
    matteBox.position.set(0, 1.7, 0.82);
    matteBox.castShadow = true;
    rigGroup.add(matteBox);

    const topFlagGeo = new THREE.BoxGeometry(0.68, 0.02, 0.35);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.8, roughness: 0.4 });
    const topFlag = new THREE.Mesh(topFlagGeo, flagMat);
    topFlag.position.set(0, 1.96, 0.92);
    topFlag.rotation.x = -0.25;
    rigGroup.add(topFlag);

    // 8. Director's OLED Monitor with Dynamic Live Vectorscope Canvas Texture
    const monitorCanvas = document.createElement('canvas');
    monitorCanvas.width = 256;
    monitorCanvas.height = 160;
    monitorCanvasRef.current = monitorCanvas;

    const monitorTex = new THREE.CanvasTexture(monitorCanvas);
    monitorTextureRef.current = monitorTex;

    const monitorFrameGeo = new THREE.BoxGeometry(0.42, 0.28, 0.04);
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, darkMetalMat);
    monitorFrame.position.set(-0.35, 2.05, 0.1);
    monitorFrame.rotation.y = Math.PI / 5;

    const screenGeo = new THREE.PlaneGeometry(0.38, 0.24);
    const screenMat = new THREE.MeshBasicMaterial({ map: monitorTex });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.025;
    monitorFrame.add(screenMesh);
    rigGroup.add(monitorFrame);

    // 9. V-Mount Cinema Brick Battery
    const batteryGeo = new THREE.BoxGeometry(0.42, 0.36, 0.22);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.6 });
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.position.set(0, 1.68, -0.48);
    battery.castShadow = true;
    rigGroup.add(battery);

    // Battery LED indicators
    const ledGeo = new THREE.SphereGeometry(0.015, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const led1 = new THREE.Mesh(ledGeo, ledMat);
    led1.position.set(0.22, 1.78, -0.45);
    rigGroup.add(led1);

    // 10. Soft Radial Contact Shadow Disc at Floor (y = 0.01)
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    rigGroup.add(contactShadow);

    // 11. Macbeth ColorChecker Chart (24 Calibrated Color Patches) on Aluminum Stand
    const chartGroup = new THREE.Group();
    chartGroup.position.set(1.2, 0.85, 0.3);
    chartGroup.rotation.y = -Math.PI / 6;

    const standGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = -0.42;
    chartGroup.add(stand);

    const chartBackGeo = new THREE.BoxGeometry(0.65, 0.45, 0.02);
    const chartBackMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
    const chartBack = new THREE.Mesh(chartBackGeo, chartBackMat);
    chartGroup.add(chartBack);

    // 24 standard color checker swatches
    const macbethColors = [
      0x735244, 0xc29682, 0x627a9d, 0x576c43, 0x8580b1, 0x67bdaa,
      0xd67e2c, 0x505ba6, 0xc15a63, 0x5e3c6c, 0x9dbc40, 0xe0a32e,
      0x383d96, 0x469449, 0xaf363c, 0xe7c71f, 0xbb5695, 0x0885a1,
      0xf3f3f2, 0xc8c8c8, 0xa0a0a0, 0x7a7a79, 0x555555, 0x343434,
    ];

    const patchW = 0.088;
    const patchH = 0.085;
    const startX = -0.22;
    const startY = 0.13;

    macbethColors.forEach((hex, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const patchGeo = new THREE.PlaneGeometry(patchW * 0.9, patchH * 0.9);
      const patchMat = new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.85,
        metalness: 0.05,
      });
      const patchMesh = new THREE.Mesh(patchGeo, patchMat);
      patchMesh.position.set(startX + col * patchW, startY - row * patchH, 0.012);
      chartGroup.add(patchMesh);
    });

    rigGroup.add(chartGroup);

    return rigGroup;
  };

  // Draw procedural vectorscope display on monitor canvas
  const updateMonitorTexture = (time: number) => {
    const canvas = monitorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark slate monitor background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 256, 160);

    // Header bar
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('REC 24fps · 4K DCI · PRORES 4444', 10, 18);

    // Grid crosshairs
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(128, 25); ctx.lineTo(128, 145);
    ctx.moveTo(20, 85); ctx.lineTo(236, 85);
    ctx.stroke();

    // Vectorscope chromatic circular reticle
    ctx.beginPath();
    ctx.arc(128, 85, 45, 0, Math.PI * 2);
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // 135° Skin tone line
    ctx.beginPath();
    ctx.moveTo(128, 85);
    const rad = (135 * Math.PI) / 180;
    ctx.lineTo(128 + Math.cos(rad) * 45, 85 - Math.sin(rad) * 45);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Active color trace simulation reacting to time and lighting
    ctx.fillStyle = practicalColor;
    const pulse = Math.sin(time * 3) * 8;
    ctx.beginPath();
    ctx.arc(128 + 12 + pulse, 85 - 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // False color IRE bar on bottom
    ctx.fillStyle = '#10b981';
    ctx.fillRect(10, 148, 60, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(72, 148, 80, 6);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(154, 148, 40, 6);

    if (monitorTextureRef.current) {
      monitorTextureRef.current.needsUpdate = true;
    }
  };

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    // 1. Scene with matching dark cinema suite fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.035);

    // 2. Camera with 45° FOV
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 2.2, 3.8);

    // 3. WebGL Renderer with ACESFilmicToneMapping
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Studio RoomEnvironment via PMREMGenerator for realistic PBR reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envRoom = new RoomEnvironment();
    const envTexture = pmrem.fromScene(envRoom).texture;
    scene.environment = envTexture;

    // 5. Studio Floor Grid
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(16, 32, 0x1e293b, 0x0f172a);
    grid.position.y = 0.002;
    scene.add(grid);

    // 6. Assemble the 11-part Cinema Camera Rig
    const cinemaRig = buildProceduralCinemaRig();
    cameraGroupRef.current = cinemaRig;
    scene.add(cinemaRig);

    // 7. Studio 3-Point Lighting Rig
    // Warm Key Light (Directional with tight shadow frustum)
    const keyRgb = kelvinToRgb(keyKelvin);
    const keyLight = new THREE.DirectionalLight(
      new THREE.Color(keyRgb.r / 255, keyRgb.g / 255, keyRgb.b / 255),
      keyIntensity
    );
    keyLight.position.set(4, 5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Cool Hemisphere Light (Fill light with sky/ground contrast)
    const hemiLight = new THREE.HemisphereLight(0x2563eb, 0x090d16, fillIntensity);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // High-Contrast Rim / Hair Light
    const rimLight = new THREE.SpotLight(0xffffff, rimIntensity, 12, Math.PI / 4, 0.4, 1.2);
    rimLight.position.set(-3.5, 4.5, -4);
    rimLight.target = cinemaRig;
    rimLight.castShadow = true;
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // In-Frame Practical Light (Neon Glow Tube / Orb)
    const practicalGroup = new THREE.Group();
    practicalGroup.position.set(-1.8, 1.2, 0.5);

    const practicalLight = new THREE.PointLight(new THREE.Color(practicalColor), 2.5, 6, 1.5);
    practicalGroup.add(practicalLight);
    practicalLightRef.current = practicalLight;

    const bulbGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: practicalColor });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    practicalGroup.add(bulbMesh);
    practicalMeshRef.current = bulbMesh;

    scene.add(practicalGroup);

    // 8. Damped Camera OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.5, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not dip below studio floor
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // 9. Lossless 60fps Animation Loop with Delta-Time Exponential Damping
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth auto-orbit rotation when enabled
      if (isRotating && cameraGroupRef.current) {
        cameraGroupRef.current.rotation.y += 0.005;
      }

      // Update vectorscope OLED texture
      updateMonitorTexture(now * 0.001);

      controls.update();
      renderer.render(scene, camera);
    };

    animate(performance.now());

    // 10. Responsive Resizing
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      pmrem.dispose();
      envRoom.dispose();
      renderer.dispose();
    };
  }, []);

  // Sync Lighting Props into Three.js Scene
  useEffect(() => {
    if (keyLightRef.current) {
      const rgb = kelvinToRgb(keyKelvin);
      keyLightRef.current.color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
      keyLightRef.current.intensity = keyIntensity;
    }
  }, [keyKelvin, keyIntensity]);

  useEffect(() => {
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = fillIntensity;
    }
  }, [fillIntensity]);

  useEffect(() => {
    if (rimLightRef.current) {
      rimLightRef.current.intensity = rimIntensity;
    }
  }, [rimIntensity]);

  useEffect(() => {
    if (practicalLightRef.current && practicalMeshRef.current) {
      practicalLightRef.current.color.set(practicalColor);
      (practicalMeshRef.current.material as THREE.MeshBasicMaterial).color.set(practicalColor);
    }
  }, [practicalColor]);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = exposure;
    }
  }, [exposure]);

  // Camera Presets
  const handleSetCameraView = (view: 'three_quarters' | 'front_glass' | 'color_chart' | 'over_shoulder') => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;
    if (view === 'three_quarters') {
      ctrl.object.position.set(3.2, 2.2, 3.8);
      ctrl.target.set(0, 1.5, 0);
    } else if (view === 'front_glass') {
      ctrl.object.position.set(0, 1.7, 2.3);
      ctrl.target.set(0, 1.7, 0.55);
    } else if (view === 'color_chart') {
      ctrl.object.position.set(1.9, 1.2, 1.2);
      ctrl.target.set(1.2, 0.85, 0.3);
    } else if (view === 'over_shoulder') {
      ctrl.object.position.set(-1.1, 2.3, -0.6);
      ctrl.target.set(0, 1.7, 0.8);
    }
    ctrl.update();
  };

  // Preset Cinematic Lighting Recipes
  const applyLightingPreset = (preset: {
    name: string;
    kelvin: number;
    key: number;
    fill: number;
    rim: number;
    practical: string;
    exposure: number;
  }) => {
    setActivePresetName(preset.name);
    setKeyKelvin(preset.kelvin);
    setKeyIntensity(preset.key);
    setFillIntensity(preset.fill);
    setRimIntensity(preset.rim);
    setPracticalColor(preset.practical);
    setExposure(preset.exposure);
  };

  // Save 3D Stage Grade to Firebase
  const handleSaveToFirebase = async () => {
    if (!user) {
      alert('Please sign in with Google to save custom 3D stage grades to your cloud profile.');
      return;
    }

    try {
      await saveUserGrade(user.uid, {
        id: `3d_stage_${Date.now()}`,
        name: `3D Stage - ${activePresetName}`,
        category: '3D Stage Lighting',
        sceneType: keyKelvin <= 3500 ? 'interior_tungsten' : 'daylight_5600k',
        kelvin: keyKelvin,
        tint: 0,
        contrast: 1.15,
        saturation: 1.1,
        lift: gradeLift,
        gamma: gradeGamma,
        gain: gradeGain,
        offsetLum: 0,
        swatches: {
          shadows: '#090d16',
          midtones: '#78350f',
          highlights: '#fef3c7',
          accent: practicalColor,
        },
        notes: `3-Point Studio Lighting: Key ${keyKelvin}K @ ${keyIntensity}x, Fill ${fillIntensity}x, Rim ${rimIntensity}x`,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      console.error('Failed to save to Firebase:', err);
    }
  };

  // Export 3D LUT
  const handleExportLut = () => {
    const recipe: ColorRecipe = {
      id: `3d_stage_${Date.now()}`,
      name: `3D_Lighting_${activePresetName.replace(/[^a-zA-Z0-9]/g, '_')}`,
      category: '3D Studio Lighting',
      harmonyType: '3-Point Physical Cinema Lighting',
      swatches: [
        { name: 'Key Tungsten/Daylight', hex: '#f59e0b' },
        { name: 'Fill Ambient Blue', hex: '#2563eb' },
        { name: 'Practical Accent', hex: practicalColor },
      ],
      createdAt: new Date().toISOString(),
    };
    const cube = generateCubeLut(recipe);
    downloadFile(new Blob([cube], { type: 'text/plain;charset=utf-8' }), `${recipe.name}.cube`);
  };

  return (
    <div className="relative w-full h-[720px] rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-2xl select-none">
      {/* Three.js WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Top Overlay Badge & Quick Status */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-white shadow-xl backdrop-blur-none">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>3D Cinematic Lighting Stage</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase">PBR · ACES · 60fps</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <span className="text-slate-400">Current Rig:</span>
          <span className="text-white font-mono font-semibold">{activePresetName}</span>
        </div>
      </div>

      {/* Camera View Switcher Buttons (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => handleSetCameraView('three_quarters')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition-colors"
          title="Hero 3/4 Studio View"
        >
          Studio View
        </button>
        <button
          onClick={() => handleSetCameraView('front_glass')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition-colors"
          title="Front Anamorphic Optical Element"
        >
          Lens Macro
        </button>
        <button
          onClick={() => handleSetCameraView('color_chart')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition-colors"
          title="Macbeth 24-Color Checker"
        >
          Color Checker
        </button>
        <button
          onClick={() => handleSetCameraView('over_shoulder')}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition-colors"
          title="Director's OLED Vectorscope Monitor"
        >
          OLED Scope
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-lg border text-xs transition-colors ${
            isRotating
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
              : 'bg-slate-900/90 text-slate-400 border-slate-800'
          }`}
          title="Toggle Turntable Rotation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Viewport-First Floating Controls Dock (Bottom Right, <= 15% footprint, solid rgba surface) */}
      <div className="absolute bottom-4 right-4 z-10 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl pointer-events-auto overflow-hidden">
        {/* Dock Header */}
        <div
          onClick={() => setDockCollapsed(!dockCollapsed)}
          className="px-4 py-2.5 bg-slate-850/90 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>3-Point Lighting &amp; Grade Dock</span>
          </div>
          <button className="text-slate-400 hover:text-white">
            {dockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Dock Body */}
        {!dockCollapsed && (
          <div className="p-4 space-y-3.5 text-xs">
            {/* Quick Cinema Lighting Presets */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Lighting Presets:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() =>
                    applyLightingPreset({
                      name: 'Tungsten Noir (3200K)',
                      kelvin: 3200,
                      key: 3.8,
                      fill: 0.5,
                      rim: 2.5,
                      practical: '#06b6d4',
                      exposure: 1.0,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold text-left truncate transition-colors"
                >
                  Tungsten Noir
                </button>
                <button
                  onClick={() =>
                    applyLightingPreset({
                      name: 'Daylight High-Key (5600K)',
                      kelvin: 5600,
                      key: 4.2,
                      fill: 1.4,
                      rim: 1.2,
                      practical: '#f59e0b',
                      exposure: 1.15,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold text-left truncate transition-colors"
                >
                  Daylight 5600K
                </button>
                <button
                  onClick={() =>
                    applyLightingPreset({
                      name: 'Cyberpunk Neon Duel',
                      kelvin: 4500,
                      key: 2.5,
                      fill: 0.6,
                      rim: 3.8,
                      practical: '#ec4899',
                      exposure: 1.05,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold text-left truncate transition-colors"
                >
                  Cyberpunk Neon
                </button>
                <button
                  onClick={() =>
                    applyLightingPreset({
                      name: 'Golden Hour Sunset (2800K)',
                      kelvin: 2800,
                      key: 4.5,
                      fill: 0.7,
                      rim: 3.0,
                      practical: '#ea580c',
                      exposure: 1.1,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold text-left truncate transition-colors"
                >
                  Golden Hour
                </button>
              </div>
            </div>

            {/* Key Light Kelvin & Power Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  Key Temperature
                </span>
                <span className="font-mono text-amber-300 font-bold">{keyKelvin}K</span>
              </div>
              <input
                type="range"
                min="2400"
                max="8500"
                step="100"
                value={keyKelvin}
                onChange={e => setKeyKelvin(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Key Intensity & Fill Ratio */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Key Intensity</span>
                  <span className="font-mono text-white">{keyIntensity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.2"
                  value={keyIntensity}
                  onChange={e => setKeyIntensity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Fill (Hemi)</span>
                  <span className="font-mono text-white">{fillIntensity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.5"
                  step="0.1"
                  value={fillIntensity}
                  onChange={e => setFillIntensity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-blue-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Practical Neon Accent Color Picker */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-300 text-[11px] font-semibold">Practical Neon Light:</span>
              <div className="flex items-center gap-1.5">
                {['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#a855f7'].map(color => (
                  <button
                    key={color}
                    onClick={() => setPracticalColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      practicalColor === color ? 'scale-125 border-white ring-2 ring-cyan-500/50' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Export & Save Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleExportLut}
                className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-[11px] font-bold text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                title="Export DaVinci Resolve .CUBE LUT from 3D Lighting Setup"
              >
                <Download className="w-3 h-3" />
                <span>Export .CUBE</span>
              </button>

              <button
                onClick={handleSaveToFirebase}
                className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-[11px] font-bold text-indigo-300 flex items-center justify-center gap-1 transition-colors"
                title="Save 3D Studio Stage to Firebase Cloud Profile"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3 h-3" />
                    <span>Save Look</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:flex items-center gap-3 text-[11px] text-slate-400 pointer-events-none">
        <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          Left Click + Drag: Rotate Camera
        </span>
        <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          Scroll: Zoom
        </span>
        <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          Right Click + Drag: Pan
        </span>
      </div>
    </div>
  );
};
