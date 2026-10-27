import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveSoftwareGradingFromColor } from './softwareColorGradingMath';

test('deriveSoftwareGradingFromColor produces warm settings for Amber #F59E0B', () => {
  const result = deriveSoftwareGradingFromColor('#F59E0B', 'Amber Joy');
  assert.equal(result.resolve.colorName, 'Amber Joy');
  assert.ok(result.resolve.kelvin < 4500, 'Amber should calculate warm Kelvin below 4500K');
  assert.ok(result.lightroom.tempSlider > 0, 'Amber should have warm positive temp in Lightroom');
  assert.equal(result.resolve.hslQualifier.targetHue, 'Orange');
  assert.equal(result.lightroom.hslTarget.channel, 'Orange');
  assert.equal(result.resolve.nodePipeline.length, 5, 'Should generate 5-node pipeline');
});

test('deriveSoftwareGradingFromColor produces cool settings for Sky Blue #0EA5E9', () => {
  const result = deriveSoftwareGradingFromColor('#0EA5E9', 'Serenity Cyan');
  assert.ok(result.resolve.kelvin > 6500, 'Sky blue should calculate cool Kelvin above 6500K');
  assert.ok(result.lightroom.tempSlider < 0, 'Sky blue should have cool negative temp in Lightroom');
  assert.equal(result.resolve.hslQualifier.targetHue, 'Aqua / Cyan');
});

test('deriveSoftwareGradingFromColor handles pure white and pure black gracefully', () => {
  const whiteResult = deriveSoftwareGradingFromColor('#FFFFFF', 'Pure White');
  assert.ok(whiteResult.resolve.contrast >= 1.0);

  const blackResult = deriveSoftwareGradingFromColor('#000000', 'Pitch Black');
  assert.ok(blackResult.resolve.lift.lum <= 0);
});

test('deriveSoftwareGradingFromColor handles vintage_film style with lifted matte blacks', () => {
  const result = deriveSoftwareGradingFromColor('#3B82F6', 'Vintage Sky', undefined, 'vintage_film');
  assert.equal(result.resolve.style, 'vintage_film');
  assert.ok(result.resolve.lift.lum > 0, 'Vintage film should have lifted matte blacks in Resolve');
  assert.ok(result.lightroom.blacksSlider > 0, 'Vintage film should have positive blacks in Lightroom');
});

test('deriveSoftwareGradingFromColor handles scotopic_night style with deep shadows and cool Kelvin', () => {
  const result = deriveSoftwareGradingFromColor('#EAB308', 'Night Lantern', undefined, 'scotopic_night');
  assert.equal(result.resolve.style, 'scotopic_night');
  assert.ok(result.resolve.kelvin >= 7800, 'Scotopic night should shift Kelvin high (cool)');
  assert.ok(result.resolve.lift.lum < 0, 'Scotopic night should crush shadow floor');
  assert.ok(result.lightroom.exposureDelta < 0, 'Scotopic night should drop exposure in Lightroom');
});
