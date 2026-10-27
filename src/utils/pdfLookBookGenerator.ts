/**
 * PDF Colorist Look Book & Production Cheat Sheet Generator
 * Uses jsPDF to create high-resolution, vector-crisp PDF documents
 * containing complete DaVinci Resolve & Adobe Lightroom Classic grading specifications,
 * swatches, and on-set lighting recipes.
 */

import { jsPDF } from 'jspdf';
import { hexToRgb } from './colorMath';
import { ResolveGradeSettings, LightroomGradeSettings } from './softwareColorGradingMath';

export interface LookBookPdfData {
  title: string;
  category: string;
  timeframe?: string;
  description?: string;
  primaryHex: string;
  secondaryHex?: string;
  swatches?: { name: string; hex: string }[];
  resolve: ResolveGradeSettings;
  lightroom: LightroomGradeSettings;
  lightingRecipe?: {
    key: string;
    fill: string;
    practicals: string;
    ratio: string;
  };
}

/**
 * Builds and returns a jsPDF instance configured with a dark/cinematic look sheet
 */
export function generateLookBookPdf(data: LookBookPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Background dark theme fill
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top header accent line
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 0, pageWidth, 4, 'F');

  let y = 14;

  // Header branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 182, 212);
  doc.text('COLOR MATRIX · HOLLYWOOD POST-PRODUCTION LOOK SHEET', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, y, { align: 'right' });

  y += 7;

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(data.title, margin, y);

  y += 5;

  // Category and Metadata Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const subtitle = `${data.category}  |  ${data.resolve.kelvin}K CCT  |  Contrast: ${data.resolve.contrast.toFixed(2)}x  |  Sat: ${data.resolve.saturationPercent}%`;
  doc.text(subtitle, margin, y);

  y += 8;

  // Swatches Visual Bar
  const swatchesToDraw = data.swatches && data.swatches.length > 0
    ? data.swatches
    : [
        { name: 'Midtones (Key)', hex: data.primaryHex },
        { name: 'Shadows (Lift)', hex: data.secondaryHex || '#0a192f' },
        { name: 'Highlights (Gain)', hex: '#fef3c7' },
        { name: 'Accent Vector', hex: '#38bdf8' },
      ];

  const swatchWidth = (pageWidth - margin * 2 - (swatchesToDraw.length - 1) * 3) / swatchesToDraw.length;
  const swatchHeight = 18;

  swatchesToDraw.forEach((sw, idx) => {
    const sx = margin + idx * (swatchWidth + 3);
    const rgb = hexToRgb(sw.hex);

    // Color box
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.roundedRect(sx, y, swatchWidth, swatchHeight, 2, 2, 'F');

    // Label underneath
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(sw.name, sx + 2, y + swatchHeight + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(sw.hex.toUpperCase(), sx + 2, y + swatchHeight + 7.5);
  });

  y += swatchHeight + 13;

  // Section 1: DaVinci Resolve Studio Workflow Box
  doc.setFillColor(10, 15, 26);
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 182, 212); // cyan
  doc.text('DAVINCI RESOLVE STUDIO · PRIMARY WHEELS & NODE SPECIFICATION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);

  // DaVinci 3-Wheel Columns
  const colW = (pageWidth - margin * 2 - 8) / 3;

  // Col 1: Lift
  let cy = y + 12;
  doc.setFont('helvetica', 'bold');
  doc.text('1. LIFT (SHADOWS)', margin + 4, cy);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`R: ${data.resolve.lift.r > 0 ? '+' : ''}${data.resolve.lift.r}`, margin + 4, cy + 4);
  doc.text(`G: ${data.resolve.lift.g > 0 ? '+' : ''}${data.resolve.lift.g}`, margin + 4, cy + 7.5);
  doc.text(`B: ${data.resolve.lift.b > 0 ? '+' : ''}${data.resolve.lift.b}`, margin + 4, cy + 11);
  doc.text(`Master Lum: ${data.resolve.lift.lum} IRE`, margin + 4, cy + 14.5);
  doc.text(`Target Hue: ${data.resolve.lift.hueDeg}°`, margin + 4, cy + 18);

  // Col 2: Gamma
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 158, 11); // amber
  doc.text('2. GAMMA (MIDTONES)', margin + 4 + colW, cy);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`R: ${data.resolve.gamma.r > 0 ? '+' : ''}${data.resolve.gamma.r}`, margin + 4 + colW, cy + 4);
  doc.text(`G: ${data.resolve.gamma.g > 0 ? '+' : ''}${data.resolve.gamma.g}`, margin + 4 + colW, cy + 7.5);
  doc.text(`B: ${data.resolve.gamma.b > 0 ? '+' : ''}${data.resolve.gamma.b}`, margin + 4 + colW, cy + 11);
  doc.text(`Master Lum: ${data.resolve.gamma.lum} IRE`, margin + 4 + colW, cy + 14.5);
  doc.text(`Target Hue: ${data.resolve.gamma.hueDeg}°`, margin + 4 + colW, cy + 18);

  // Col 3: Gain
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 63, 94); // rose
  doc.text('3. GAIN (HIGHLIGHTS)', margin + 4 + colW * 2, cy);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`R: ${data.resolve.gain.r > 0 ? '+' : ''}${data.resolve.gain.r}`, margin + 4 + colW * 2, cy + 4);
  doc.text(`G: ${data.resolve.gain.g > 0 ? '+' : ''}${data.resolve.gain.g}`, margin + 4 + colW * 2, cy + 7.5);
  doc.text(`B: ${data.resolve.gain.b > 0 ? '+' : ''}${data.resolve.gain.b}`, margin + 4 + colW * 2, cy + 11);
  doc.text(`Master Lum: ${data.resolve.gain.lum} IRE`, margin + 4 + colW * 2, cy + 14.5);
  doc.text(`Target Hue: ${data.resolve.gain.hueDeg}°`, margin + 4 + colW * 2, cy + 18);

  // Bottom resolve summary line
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `White Balance: ${data.resolve.kelvin}K   |   Tint: ${data.resolve.tint}   |   Hue vs Sat Target: ${data.resolve.hslQualifier.targetHue} (+${data.resolve.hslQualifier.satDelta}%)`,
    margin + 4,
    y + 43
  );

  y += 53;

  // Section 2: Adobe Lightroom Classic Develop Panel Box
  doc.setFillColor(10, 15, 26);
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11); // amber
  doc.text('ADOBE LIGHTROOM CLASSIC · DEVELOP MODULE & COLOR GRADING', margin + 4, y + 6);

  let ly = y + 12;

  // Basic Panel Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('BASIC PANEL', margin + 4, ly);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Temp: ${data.lightroom.tempSlider > 0 ? '+' : ''}${data.lightroom.tempSlider}`, margin + 4, ly + 4);
  doc.text(`Tint: ${data.lightroom.tintSlider > 0 ? '+' : ''}${data.lightroom.tintSlider}`, margin + 4, ly + 7.5);
  doc.text(`Contrast: +${data.lightroom.contrastSlider}`, margin + 4, ly + 11);
  doc.text(`Highlights: ${data.lightroom.highlightsSlider}`, margin + 4, ly + 14.5);
  doc.text(`Shadows: +${data.lightroom.shadowsSlider}`, margin + 4, ly + 18);

  // Color Grading (3-Way Split Toning) Column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('COLOR GRADING (3-WAY)', margin + 4 + colW, ly);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Shadows: Hue ${data.lightroom.colorGrading.shadows.hue}° · Sat ${data.lightroom.colorGrading.shadows.sat}%`, margin + 4 + colW, ly + 4);
  doc.text(`Midtones: Hue ${data.lightroom.colorGrading.midtones.hue}° · Sat ${data.lightroom.colorGrading.midtones.sat}%`, margin + 4 + colW, ly + 7.5);
  doc.text(`Highlights: Hue ${data.lightroom.colorGrading.highlights.hue}° · Sat ${data.lightroom.colorGrading.highlights.sat}%`, margin + 4 + colW, ly + 11);
  doc.text(`Balance: +${data.lightroom.colorGrading.balance} toward highlights`, margin + 4 + colW, ly + 14.5);
  doc.text(`Lum Shift: ${data.lightroom.colorGrading.midtones.lum}`, margin + 4 + colW, ly + 18);

  // Color Mixer / HSL Column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('COLOR MIXER (HSL) & CALIBRATION', margin + 4 + colW * 2, ly);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Channel: ${data.lightroom.hslTarget.channel}`, margin + 4 + colW * 2, ly + 4);
  doc.text(`Saturation: +${data.lightroom.hslTarget.satOffset}`, margin + 4 + colW * 2, ly + 7.5);
  doc.text(`Luminance: +${data.lightroom.hslTarget.lumOffset}`, margin + 4 + colW * 2, ly + 11);
  doc.text(`Blue Primary Sat: +${data.lightroom.calibration.bluePrimarySat}`, margin + 4 + colW * 2, ly + 14.5);
  doc.text(`Red Primary Sat: +${data.lightroom.calibration.redPrimarySat}`, margin + 4 + colW * 2, ly + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Recommendation: Use AI Masking on subjects to protect facial skin tones on the 135° I-Line.`,
    margin + 4,
    y + 43
  );

  y += 53;

  // Section 3: Physical Lighting Recipe (if available)
  if (data.lightingRecipe) {
    doc.setFillColor(10, 15, 26);
    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(52, 211, 153); // emerald
    doc.text('ON-SET PHYSICAL LIGHTING RECIPE & CINEMATOGRAPHY RATIOS', margin + 4, y + 6);

    let ry = y + 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    doc.text(`Key Light: ${data.lightingRecipe.key}`, margin + 4, ry);
    doc.text(`Fill & Bounce: ${data.lightingRecipe.fill}`, margin + 4, ry + 4.5);
    doc.text(`Practicals & Accents: ${data.lightingRecipe.practicals}`, margin + 4, ry + 9);
    doc.text(`Contrast Ratio: ${data.lightingRecipe.ratio}`, margin + 4, ry + 13.5);

    y += 39;
  }

  // Footer Disclaimer & Software Compatibility
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    'Compatible with DaVinci Resolve Studio 17/18/19, Premiere Pro, Final Cut Pro (.CUBE), and Adobe Lightroom Classic (.XMP)',
    margin,
    pageHeight - 8
  );
  doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 8, { align: 'right' });

  return doc;
}

/**
 * Convenience helper to download the generated Look Book PDF
 */
export function downloadLookBookPdf(data: LookBookPdfData, filename?: string) {
  const doc = generateLookBookPdf(data);
  const name = filename || `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lookbook.pdf`;
  doc.save(name);
}
