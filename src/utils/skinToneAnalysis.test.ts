import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isSkinPixel,
  mapRgbToVectorscopeXY,
  analyzeSkinSamples,
} from './skinToneAnalysis';

test('isSkinPixel identifies authentic skin tones across ethnicities', () => {
  // Fair skin
  assert.equal(isSkinPixel(230, 180, 150), true);
  // East Asian skin
  assert.equal(isSkinPixel(215, 175, 130), true);
  // Dark African melanin
  assert.equal(isSkinPixel(110, 70, 50), true);

  // Non-skin colors (pure green, pure blue, white, gray)
  assert.equal(isSkinPixel(0, 255, 0), false);
  assert.equal(isSkinPixel(0, 0, 255), false);
  assert.equal(isSkinPixel(128, 128, 128), false);
});

test('mapRgbToVectorscopeXY produces coordinates bounded within circle', () => {
  const coord = mapRgbToVectorscopeXY(210, 150, 120);
  assert.ok(coord.x >= -1 && coord.x <= 1);
  assert.ok(coord.y >= -1 && coord.y <= 1);
  const dist = Math.sqrt(coord.x * coord.x + coord.y * coord.y);
  assert.ok(dist <= 1.42);
});

test('analyzeSkinSamples produces complete grading recommendations and categories', () => {
  const samples = [
    { r: 215, g: 155, b: 120 },
    { r: 210, g: 150, b: 118 },
    { r: 220, g: 160, b: 125 },
  ];

  const analysis = analyzeSkinSamples(samples, 'golden_hour', 'teal_and_orange');

  assert.equal(analysis.sampleCount, 3);
  assert.ok(analysis.medianAngle > 120 && analysis.medianAngle < 150);
  assert.ok(analysis.averageIre > 40 && analysis.averageIre < 80);
  assert.ok(analysis.recommendations.davinciWorkflow.node1.length > 0);
  assert.ok(analysis.recommendations.davinciWorkflow.node3.length > 0);
  assert.ok(analysis.recommendations.lightroomCorrections.hslAdjustment.length > 0);
});
