import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyToneType,
  calculateIntensityScore,
  getIntensityTier,
  getEmotionDepthProfile,
  generateDepthMatrix,
  DEPTH_PRESETS,
} from './colorDepthMath';

test('classifyToneType categorizes tints, shades, tones, and pure colors correctly', () => {
  assert.equal(classifyToneType(80, 8), 'abyssal_dark');
  assert.equal(classifyToneType(20, 95), 'ethereal_light');
  assert.equal(classifyToneType(90, 50), 'pure');
  assert.equal(classifyToneType(40, 70), 'tint');
  assert.equal(classifyToneType(60, 30), 'shade');
  assert.equal(classifyToneType(20, 50), 'tone');
});

test('calculateIntensityScore and getIntensityTier reflect chromatic arousal', () => {
  // Pure vivid color: High S (95%), Mid L (50%) -> should score close to 95-100
  const peakScore = calculateIntensityScore(95, 50);
  assert.ok(peakScore >= 85);
  assert.equal(getIntensityTier(peakScore), 'Piercing Peak');

  // Muted desaturated color: Low S (15%), High L (80%) -> should be Subdued or Latent
  const subduedScore = calculateIntensityScore(15, 80);
  assert.ok(subduedScore < 40);
  assert.ok(getIntensityTier(subduedScore) === 'Subdued' || getIntensityTier(subduedScore) === 'Latent');
});

test('getEmotionDepthProfile provides tailored psychological nuance for sadness', () => {
  const blueHue = 215;

  // Muted Sadness (low sat, high lum)
  const mutedSadness = getEmotionDepthProfile('sadness', 'Sadness', blueHue, 20, 78);
  assert.equal(mutedSadness.title, 'Fragile Melancholy');
  assert.ok(mutedSadness.psychologicalDescription.includes('grief'));

  // Piercing Sorrow (high sat, mid lum)
  const piercingSadness = getEmotionDepthProfile('sadness', 'Sadness', blueHue, 90, 50);
  assert.equal(piercingSadness.title, 'Piercing Sorrow');
  assert.equal(piercingSadness.intensityLevel, 'Piercing Peak');
});

test('getEmotionDepthProfile provides tailored psychological nuance for joy', () => {
  const yellowHue = 48;

  // Vibrant Euphoria (high sat, mid lum)
  const euphoria = getEmotionDepthProfile('joy', 'Joy', yellowHue, 95, 52);
  assert.equal(euphoria.title, 'Vibrant Euphoria');
  assert.ok(euphoria.psychologicalDescription.includes('dopamine'));

  // Soft Optimism (low sat, high lum)
  const softHope = getEmotionDepthProfile('joy', 'Joy', yellowHue, 30, 80);
  assert.equal(softHope.title, 'Soft Optimism');
});

test('generateDepthMatrix produces regular 25-cell gamut sample grid', () => {
  const matrix = generateDepthMatrix(210);
  assert.equal(matrix.length, 25);
  for (const cell of matrix) {
    assert.ok(cell.hex.startsWith('#'));
    assert.ok(['Tint', 'Shade', 'Tone', 'Pure'].includes(cell.label));
  }
});

test('DEPTH_PRESETS contain standard archetype coordinates', () => {
  assert.ok(DEPTH_PRESETS.length >= 4);
  const vibrant = DEPTH_PRESETS.find(p => p.id === 'vibrant_peak');
  assert.ok(vibrant && vibrant.s > 80);
});
