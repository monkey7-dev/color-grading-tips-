import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evToLinearMultiplier,
  interpolateHex,
  computeDayToNightLayers,
  DEFAULT_DAY_TO_NIGHT,
} from './dayToNightMath';

test('evToLinearMultiplier halves for each negative stop', () => {
  assert.equal(evToLinearMultiplier(0), 1.0);
  assert.equal(evToLinearMultiplier(-1), 0.5);
  assert.equal(evToLinearMultiplier(-2), 0.25);
  assert.equal(evToLinearMultiplier(-3), 0.125);
});

test('interpolateHex correctly blends colors at 0, 0.5, and 1.0', () => {
  const white = '#ffffff';
  const black = '#000000';
  assert.equal(interpolateHex(white, black, 0), '#ffffff');
  assert.equal(interpolateHex(white, black, 1), '#000000');
  
  const mid = interpolateHex(white, black, 0.5);
  assert.ok(mid.toLowerCase() === '#808080' || mid.toLowerCase() === '#7f7f7f');
});

test('computeDayToNightLayers transforms day into night across progressive steps', () => {
  // Step 0: Raw day
  const day = computeDayToNightLayers(DEFAULT_DAY_TO_NIGHT, 0);
  assert.equal(day.skyTop, '#38bdf8', 'Step 0 sky should remain day azure');
  assert.equal(day.exposureFactor, 1.0, 'Step 0 exposure should be neutral 1.0');

  // Step 5: Full cinema night
  const night = computeDayToNightLayers(DEFAULT_DAY_TO_NIGHT, 5);
  assert.ok(night.exposureFactor < 0.35, 'Night exposure should be reduced drastically');
  assert.ok(night.skyTop.startsWith('#0'), 'Night sky should be dark near-black/indigo');
  assert.ok(night.practicalLight.startsWith('#f') || night.practicalLight.startsWith('#e'), 'Window practical should glow warm amber');
});
