import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  rgbToHsl,
  calculateContrastRatio,
  evaluateWcag,
  getHarmonyHues,
  simulateColorBlindness,
  calculateVectorscopeAngle,
} from './colorMath';

test('hexToRgb converts 6-char hex and 3-char hex correctly', () => {
  assert.deepEqual(hexToRgb('#ff0000'), { r: 255, g: 0, b: 0 });
  assert.deepEqual(hexToRgb('#00ff00'), { r: 0, g: 255, b: 0 });
  assert.deepEqual(hexToRgb('#0000ff'), { r: 0, g: 0, b: 255 });
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexToRgb('000'), { r: 0, g: 0, b: 0 });
});

test('rgbToHex converts RGB values to formatted hex strings', () => {
  assert.equal(rgbToHex(255, 0, 0), '#ff0000');
  assert.equal(rgbToHex(0, 255, 0), '#00ff00');
  assert.equal(rgbToHex(0, 0, 0), '#000000');
  assert.equal(rgbToHex(255, 255, 255), '#ffffff');
});

test('hslToRgb and rgbToHsl conversions are consistent', () => {
  const redRgb = hslToRgb(0, 100, 50);
  assert.equal(redRgb.r, 255);
  assert.equal(redRgb.g, 0);
  assert.equal(redRgb.b, 0);

  const redHsl = rgbToHsl(255, 0, 0);
  assert.equal(redHsl.h, 0);
  assert.equal(redHsl.s, 100);
  assert.equal(redHsl.l, 50);
});

test('WCAG contrast ratio computes correctly and detects black/white ratio of 21:1', () => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const ratio = calculateContrastRatio(black, white);
  assert.equal(ratio, 21);

  const rating = evaluateWcag(black, white);
  assert.equal(rating.normalTextAA, true);
  assert.equal(rating.normalTextAAA, true);
});

test('getHarmonyHues generates correct angles for harmonies', () => {
  const comp = getHarmonyHues(30, 'complementary');
  assert.deepEqual(comp, [30, 210]);

  const triadic = getHarmonyHues(0, 'triadic');
  assert.deepEqual(triadic, [0, 120, 240]);

  const tetradic = getHarmonyHues(45, 'tetradic');
  assert.deepEqual(tetradic, [45, 135, 225, 315]);

  const analogous = getHarmonyHues(180, 'analogous');
  assert.deepEqual(analogous, [150, 180, 210]);
});

test('simulateColorBlindness correctly desaturates for achromatopsia', () => {
  const red = { r: 255, g: 0, b: 0 };
  const simulated = simulateColorBlindness(red, 'achromatopsia');
  assert.equal(simulated.r, simulated.g);
  assert.equal(simulated.g, simulated.b);
});

test('calculateVectorscopeAngle computes angle for human skin tone sample close to 135 deg', () => {
  // A typical natural Caucasian/Asian/Melanin skin RGB tone e.g. RGB(215, 150, 115)
  const skinSample = { r: 215, g: 150, b: 115 };
  const result = calculateVectorscopeAngle(skinSample);
  // Human skin tone should fall within +/- 15 degrees of 135° on standard YCbCr vectorscope
  assert.ok(result.distanceToSkinLine <= 20, `Distance ${result.distanceToSkinLine} should be within 20 deg of 135°`);
});
