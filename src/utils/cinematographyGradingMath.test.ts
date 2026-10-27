import test from 'node:test';
import assert from 'node:assert/strict';
import {
  kelvinToRgb,
  polarToRgbOffset,
  rgbOffsetToPolar,
  isSkinTonePixel,
  gradePixelRgb,
  generateCinemaGradeCubeLut,
  generateCinemaGradeXmp,
  CinemaGradeParams,
} from './cinematographyGradingMath';

test('kelvinToRgb handles warm tungsten and cold twilight extremes', () => {
  const warm = kelvinToRgb(2700);
  assert.ok(warm.r > warm.b, 'Tungsten 2700K should have more red than blue');
  assert.ok(warm.r >= 0.9, 'Tungsten 2700K red should be near peak');

  const neutral = kelvinToRgb(6500);
  assert.ok(Math.abs(neutral.r - neutral.b) < 0.2, '6500K daylight should be relatively balanced');

  const cold = kelvinToRgb(9500);
  assert.ok(cold.b > cold.r, '9500K blue hour should have higher blue than red');
});

test('polarToRgbOffset and rgbOffsetToPolar are symmetrical and bounded', () => {
  // Test pure red (0°)
  const redOffset = polarToRgbOffset(0, 0.8);
  assert.ok(redOffset.r > redOffset.g);
  assert.ok(redOffset.r > redOffset.b);

  const polar = rgbOffsetToPolar(redOffset.r, redOffset.g, redOffset.b);
  assert.ok(Math.abs(polar.angleDeg - 0) <= 5 || Math.abs(polar.angleDeg - 360) <= 5);
  assert.ok(polar.magnitude > 0.5);
});

test('isSkinTonePixel correctly identifies Caucasian/Asian/Black skin tone chromatic range', () => {
  // Fair skin tone RGB approx #e8beac -> (0.91, 0.74, 0.67)
  assert.equal(isSkinTonePixel(0.91, 0.74, 0.67), true, 'Should detect fair skin');
  
  // Rich deep melanin skin tone RGB approx #6e473b -> (0.43, 0.28, 0.23)
  assert.equal(isSkinTonePixel(0.43, 0.28, 0.23), true, 'Should detect deep skin tone');

  // Pure blue sky RGB (0.2, 0.5, 0.9)
  assert.equal(isSkinTonePixel(0.2, 0.5, 0.9), false, 'Should reject blue sky');

  // Forest foliage RGB (0.1, 0.4, 0.15)
  assert.equal(isSkinTonePixel(0.1, 0.4, 0.15), false, 'Should reject foliage green');
});

test('gradePixelRgb applies lift to shadows and gain to highlights', () => {
  const darkPixel = { r: 0.1, g: 0.1, b: 0.1 };
  const lightPixel = { r: 0.9, g: 0.9, b: 0.9 };

  const gradeParams = {
    lift: { r: 0.3, g: 0, b: -0.2, lum: 5 }, // Warm reddish shadow lift
    gamma: { r: 0, g: 0, b: 0, lum: 0 },
    gain: { r: -0.2, g: 0, b: 0.3, lum: 5 }, // Cool blue highlight gain
    offsetLum: 0,
    kelvin: 5500,
    tint: 0,
    contrast: 1.0,
    saturation: 1.0,
    skinToneProtection: false,
  };

  const gradedDark = gradePixelRgb(darkPixel.r, darkPixel.g, darkPixel.b, gradeParams);
  // Red in shadows should be boosted more than blue
  assert.ok(gradedDark.r > gradedDark.b, 'Shadows should have red bias from Lift');

  const gradedLight = gradePixelRgb(lightPixel.r, lightPixel.g, lightPixel.b, gradeParams);
  // Blue in highlights should be boosted more than red
  assert.ok(gradedLight.b > gradedLight.r, 'Highlights should have blue bias from Gain');
});

test('generateCinemaGradeCubeLut generates valid CUBE 3D LUT format', () => {
  const sampleParams: CinemaGradeParams = {
    id: 'test_grade',
    name: 'Teal Orange Test',
    sceneType: 'day',
    timeframe: 'Daylight',
    kelvin: 5600,
    tint: 0,
    lift: { r: -0.2, g: 0.1, b: 0.3, lum: -5 },
    gamma: { r: 0.1, g: 0.05, b: -0.1, lum: 2 },
    gain: { r: 0.25, g: 0.1, b: -0.2, lum: 8 },
    offsetLum: 0,
    contrast: 1.15,
    saturation: 1.1,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#0e2433',
      midtones: '#c97a3e',
      highlights: '#ffdfa0',
      accent: '#00e5ff',
    },
    whyItWorks: 'Test rationale',
    lightingRecipe: {
      key: 'Sun',
      fill: 'Sky',
      practicals: 'None',
      ratio: '1:4',
    },
    resolveTip: 'Test secret',
  };

  const cubeOutput = generateCinemaGradeCubeLut(sampleParams);
  assert.ok(cubeOutput.includes('TITLE "Teal Orange Test (DAY)"'));
  assert.ok(cubeOutput.includes('LUT_3D_SIZE 17'));
  assert.ok(cubeOutput.includes('DOMAIN_MIN 0.0 0.0 0.0'));
  assert.ok(cubeOutput.includes('DOMAIN_MAX 1.0 1.0 1.0'));
  
  // Total data lines should be 17^3 = 4913 lines
  const dataLines = cubeOutput.split('\n').filter(line => /^[0-9]\.[0-9]+ [0-9]\.[0-9]+ [0-9]\.[0-9]+/.test(line));
  assert.equal(dataLines.length, 17 * 17 * 17);
});

test('generateCinemaGradeXmp produces valid Adobe XMP preset', () => {
  const sampleParams: CinemaGradeParams = {
    id: 'night_noir',
    name: 'Neon Noir Night',
    sceneType: 'night',
    timeframe: 'Midnight',
    kelvin: 4000,
    tint: 15,
    lift: { r: -0.25, g: 0.05, b: 0.35, lum: -10 },
    gamma: { r: 0.0, g: -0.1, b: 0.2, lum: -4 },
    gain: { r: 0.35, g: -0.1, b: 0.2, lum: 12 },
    offsetLum: -5,
    contrast: 1.35,
    saturation: 1.25,
    skinToneProtection: true,
    recommendedHexes: {
      shadows: '#080c14',
      midtones: '#00d2d3',
      highlights: '#ff007f',
      accent: '#54a0ff',
    },
    whyItWorks: 'Cyberpunk night mood with high contrast',
    lightingRecipe: {
      key: 'Neon signs',
      fill: 'Wet asphalt bounce',
      practicals: 'Storefront tubes',
      ratio: '1:8',
    },
    resolveTip: 'Preserve skin qualifier',
  };

  const xmp = generateCinemaGradeXmp(sampleParams);
  assert.ok(xmp.includes('<x:xmpmeta'));
  assert.ok(xmp.includes('crs:Name="Neon Noir Night"'));
  assert.ok(xmp.includes('crs:SplitToningShadowHue='));
  assert.ok(xmp.includes('crs:HasSettings="True"'));
});
