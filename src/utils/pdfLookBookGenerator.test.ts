import test from 'node:test';
import assert from 'node:assert/strict';
import { generateLookBookPdf, LookBookPdfData } from './pdfLookBookGenerator';
import { deriveSoftwareGradingFromColor } from './softwareColorGradingMath';

test('generateLookBookPdf produces valid jsPDF document instance', () => {
  const { resolve, lightroom } = deriveSoftwareGradingFromColor('#F59E0B', 'Amber Joy');

  const sampleData: LookBookPdfData = {
    title: 'Golden Hour Sublime',
    category: 'Day Scene / Sunset',
    primaryHex: '#F59E0B',
    secondaryHex: '#0A192F',
    resolve,
    lightroom,
    lightingRecipe: {
      key: 'Low sun',
      fill: 'Gold beadboard',
      practicals: 'Lantern',
      ratio: '1:4',
    },
  };

  const doc = generateLookBookPdf(sampleData);
  assert.ok(doc, 'Should return a jsPDF instance');
  const pdfOutput = doc.output();
  assert.ok(pdfOutput.length > 500, 'PDF output should contain binary/text PDF data');
  assert.ok(pdfOutput.includes('%PDF-'), 'Output should have valid PDF header');
});
