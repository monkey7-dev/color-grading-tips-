import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  blendAtmosphericHaze,
  calculateFocalContrastRatio,
  gradeFocalObjectColor,
  gradeLandscapeLayerColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
} from './landscapeGradingMath.js';

describe('landscapeGradingMath', () => {
  it('converts hex to rgb and back accurately', () => {
    const rgb = hexToRgb('#ff8800');
    assert.deepStrictEqual(rgb, { r: 255, g: 136, b: 0 });
    const hex = rgbToHex(255, 136, 0);
    assert.strictEqual(hex.toLowerCase(), '#ff8800');
  });

  it('converts rgb to hsl and back accurately', () => {
    const hsl = rgbToHsl(255, 0, 0);
    assert.strictEqual(hsl.h, 0);
    assert.strictEqual(hsl.s, 1);
    assert.strictEqual(hsl.l, 0.5);

    const backRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    assert.deepStrictEqual(backRgb, { r: 255, g: 0, b: 0 });
  });

  it('blends atmospheric haze correctly with depth', () => {
    const baseColor = '#1e293b'; // dark slate
    const hazeColor = '#bae6fd'; // sky light cyan
    
    // At depth 0 (foreground), color should remain base
    const near = blendAtmosphericHaze(baseColor, hazeColor, 0, 0.8);
    assert.strictEqual(near.toLowerCase(), baseColor.toLowerCase());

    // At deep distance, color should shift toward haze
    const far = blendAtmosphericHaze(baseColor, hazeColor, 1.0, 0.9);
    const farRgb = hexToRgb(far)!;
    const baseRgb = hexToRgb(baseColor)!;
    assert.ok(farRgb.b > baseRgb.b, 'Far layer blue channel should increase due to aerial haze');
  });

  it('computes focal contrast ratio between subject and background', () => {
    // Red cabin vs dark teal forest
    const redCabin = '#e11d48';
    const tealForest = '#0f383b';

    const metrics = calculateFocalContrastRatio(redCabin, tealForest);
    assert.ok(metrics.hueAngleDelta > 100, 'Should have high complementary hue angle delta');
    assert.ok(metrics.visualGazeScore > 60, 'Focal pop score should be high for red on dark teal');
  });

  it('grades focal object with saturation boost and luminance', () => {
    const baseRed = '#b91c1c';
    const boosted = gradeFocalObjectColor(baseRed, 1.4, 10);
    const baseRgb = hexToRgb(baseRed)!;
    const boostedRgb = hexToRgb(boosted)!;

    assert.ok(boostedRgb.r >= baseRgb.r, 'Boosted color should have higher red luminance');
  });

  it('grades landscape background with desaturation', () => {
    const foliage = '#22c55e'; // vibrant green
    const desaturated = gradeLandscapeLayerColor(foliage, 1.0, 0.6); // 60% bg desat
    const desatRgb = hexToRgb(desaturated)!;
    const desatHsl = rgbToHsl(desatRgb.r, desatRgb.g, desatRgb.b);

    assert.ok(desatHsl.s < 0.5, 'Desaturated foliage should have reduced saturation');
  });
});
