import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAseBuffer, generateCubeLut, generateLightroomXmp, ColorRecipe } from './exporters';

test('generateAseBuffer generates valid ASE binary header and swatches', () => {
  const swatches = [
    { name: 'Key Cyan', hex: '#00d2ff' },
    { name: 'Secondary Coral', hex: '#ff5e62' },
  ];
  const buffer = generateAseBuffer('Cyberpunk Duo', swatches);

  // Check 'ASEF' magic bytes
  assert.equal(buffer[0], 0x41); // 'A'
  assert.equal(buffer[1], 0x53); // 'S'
  assert.equal(buffer[2], 0x45); // 'E'
  assert.equal(buffer[3], 0x46); // 'F'

  // Major version 1, minor 0
  assert.equal(buffer[4], 0);
  assert.equal(buffer[5], 1);

  // Total buffer length should be non-empty and greater than 40 bytes
  assert.ok(buffer.byteLength > 40);
});

test('generateCubeLut produces valid .CUBE 3D LUT string header and rows', () => {
  const recipe: ColorRecipe = {
    id: 'test-recipe-1',
    name: 'Teal & Orange Grade',
    category: 'Cinematic',
    harmonyType: 'complementary',
    swatches: [
      { name: 'Key Orange', hex: '#ff8a00' },
      { name: 'Secondary Teal', hex: '#00b4d8' },
    ],
    createdAt: new Date().toISOString(),
  };

  const cube = generateCubeLut(recipe);
  assert.ok(cube.includes('TITLE "Teal & Orange Grade (Cinematic)"'));
  assert.ok(cube.includes('LUT_3D_SIZE 17'));
  assert.ok(cube.includes('DOMAIN_MAX 1.0 1.0 1.0'));

  // 17^3 = 4913 points
  const lines = cube.trim().split('\n');
  assert.ok(lines.length > 4910);
});

test('generateLightroomXmp generates valid XML containing color grading parameters', () => {
  const recipe: ColorRecipe = {
    id: 'test-xmp-1',
    name: 'Vintage Desert',
    category: 'Film Look',
    harmonyType: 'analogous',
    swatches: [
      { name: 'Warm Amber', hex: '#d97706' },
      { name: 'Terracotta', hex: '#b45309' },
      { name: 'Desert Gold', hex: '#f59e0b' },
    ],
    createdAt: new Date().toISOString(),
  };

  const xmp = generateLightroomXmp(recipe);
  assert.ok(xmp.includes('<x:xmpmeta'));
  assert.ok(xmp.includes('crs:Name="Vintage Desert"'));
  assert.ok(xmp.includes('crs:SplitToningShadowHue='));
  assert.ok(xmp.includes('crs:SplitToningHighlightHue='));
  assert.ok(xmp.includes('crs:ColorGradeMidtoneHue='));
});
