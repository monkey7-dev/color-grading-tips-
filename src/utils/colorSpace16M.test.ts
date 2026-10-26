import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOTAL_TRUECOLOR_COUNT,
  calculateVolumeColorCount,
  sampleColorsFromBounds,
  EMOTION_COLOR_VOLUMES,
} from './colorSpace16M';

test('TOTAL_TRUECOLOR_COUNT is exactly 16,777,216 colors (2^24)', () => {
  assert.equal(TOTAL_TRUECOLOR_COUNT, 16777216);
});

test('calculateVolumeColorCount returns valid color subsets within true bounds', () => {
  const joyVolume = calculateVolumeColorCount({
    hueMin: 30,
    hueMax: 70,
    satMin: 50,
    satMax: 100,
    lumMin: 40,
    lumMax: 90,
  });

  // 40° hue span with 50% sat and 50% lum represents ~300k to 600k colors out of 16.7M
  assert.ok(joyVolume > 200000 && joyVolume < 800000);
});

test('sampleColorsFromBounds returns valid hex color strings', () => {
  const bounds = {
    hueMin: 120,
    hueMax: 170,
    satMin: 30,
    satMax: 80,
    lumMin: 25,
    lumMax: 65,
  };
  const swatches = sampleColorsFromBounds(bounds, 5);
  assert.equal(swatches.length, 5);
  swatches.forEach(hex => {
    assert.match(hex, /^#[0-9a-f]{6}$/i);
  });
});

test('EMOTION_COLOR_VOLUMES provides rich coverage for key emotional states', () => {
  assert.ok(EMOTION_COLOR_VOLUMES.length >= 8);
  const totalCoveredPct = EMOTION_COLOR_VOLUMES.reduce((acc, v) => acc + v.percentageOfAllColors, 0);
  // Total emotional coverage across spectrum
  assert.ok(totalCoveredPct > 50);
});
