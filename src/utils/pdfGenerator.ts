import { jsPDF } from 'jspdf';
import { CardSettings, GridInfo } from '../types';

export interface GeneratePdfOptions {
  imageRecto: string | null;
  imageVerso: string | null;
  settings: CardSettings;
  grid: GridInfo;
}

export async function generateA4Pdf({
  imageRecto,
  imageVerso,
  settings,
  grid,
}: GeneratePdfOptions): Promise<void> {
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  const { cols, rows, offsetX, offsetY } = grid;
  const disabledSlotsSet = new Set(settings.disabledSlots || []);

  // ────────────────────────────────────────────────
  // PAGE 1: RECTO
  // ────────────────────────────────────────────────
  if (imageRecto) {
    const renderableRecto = await prepareProcessedImage(
      imageRecto,
      settings.width,
      settings.height,
      settings.rotationRecto || 0,
      settings.fitModeRecto || 'contain'
    );
    const formatRecto = renderableRecto.includes('image/png') ? 'PNG' : 'JPEG';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const slotIndex = r * cols + c;
        if (disabledSlotsSet.has(slotIndex)) continue;

        const x = offsetX + c * (settings.width + settings.spacingX);
        const y = offsetY + r * (settings.height + settings.spacingY);

        pdf.addImage(renderableRecto, formatRecto, x, y, settings.width, settings.height);

        // Crop Marks
        if (settings.showCropMarks) {
          drawCropMarks(pdf, x, y, settings.width, settings.height);
        }
      }
    }
  }

  // ────────────────────────────────────────────────
  // PAGE 2: VERSO (Duplex Auto-Aligned)
  // ────────────────────────────────────────────────
  if (imageVerso) {
    if (imageRecto) {
      pdf.addPage('a4', 'portrait');
    }

    const renderableVerso = await prepareProcessedImage(
      imageVerso,
      settings.width,
      settings.height,
      settings.rotationVerso || 0,
      settings.fitModeVerso || 'contain'
    );
    const formatVerso = renderableVerso.includes('image/png') ? 'PNG' : 'JPEG';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const slotIndex = r * cols + c;
        if (disabledSlotsSet.has(slotIndex)) continue;

        // Horizontally mirror the column index so duplex (recto/verso) print matches back-to-back
        const mirroredCol = cols - 1 - c;
        const x = offsetX + mirroredCol * (settings.width + settings.spacingX);
        const y = offsetY + r * (settings.height + settings.spacingY);

        pdf.addImage(renderableVerso, formatVerso, x, y, settings.width, settings.height);

        // Crop Marks on Verso
        if (settings.showCropMarks) {
          drawCropMarks(pdf, x, y, settings.width, settings.height);
        }
      }
    }
  }

  const pagesCount = (imageRecto ? 1 : 0) + (imageVerso ? 1 : 0);
  const filename = `planche-express-A4-recto-verso-${settings.width}x${settings.height}mm-${pagesCount}pages.pdf`;
  pdf.save(filename);
}

/**
 * Draws precision vector crop marks around a card slot.
 */
function drawCropMarks(pdf: jsPDF, x: number, y: number, w: number, h: number) {
  pdf.setDrawColor(120, 120, 120);
  pdf.setLineWidth(0.15);

  const m = 3;
  const gap = 0.6;

  // Top-left
  pdf.line(x, y - gap - m, x, y - gap);
  pdf.line(x - gap - m, y, x - gap, y);

  // Top-right
  pdf.line(x + w, y - gap - m, x + w, y - gap);
  pdf.line(x + w + gap, y, x + w + gap + m, y);

  // Bottom-left
  pdf.line(x, y + h + gap, x, y + h + gap + m);
  pdf.line(x - gap - m, y + h, x - gap, y + h);

  // Bottom-right
  pdf.line(x + w, y + h + gap, x + w, y + h + gap + m);
  pdf.line(x + w + gap, y + h, x + w + gap + m, y + h);
}

/**
 * Prepares image on a 4x High-DPI Canvas to handle rotation (0/90/180/270deg) and fitMode (contain vs cover) without distortion.
 */
function prepareProcessedImage(
  src: string,
  targetWidthMm: number,
  targetHeightMm: number,
  rotationDeg: number,
  fitMode: 'cover' | 'contain' | 'fill'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = 4; // High DPI 4x scale
      const targetPxW = Math.round(targetWidthMm * 10 * scale);
      const targetPxH = Math.round(targetHeightMm * 10 * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetPxW;
      canvas.height = targetPxH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(src);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill white background for card image base
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetPxW, targetPxH);

      ctx.save();
      // Move to center for rotation
      ctx.translate(targetPxW / 2, targetPxH / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);

      // Determine width & height after rotation
      const isRotated90or270 = rotationDeg === 90 || rotationDeg === 270;
      const drawnBoundW = isRotated90or270 ? targetPxH : targetPxW;
      const drawnBoundH = isRotated90or270 ? targetPxW : targetPxH;

      let drawW = drawnBoundW;
      let drawH = drawnBoundH;

      if (fitMode === 'contain') {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const boundRatio = drawnBoundW / drawnBoundH;
        if (imgRatio > boundRatio) {
          drawW = drawnBoundW;
          drawH = drawnBoundW / imgRatio;
        } else {
          drawH = drawnBoundH;
          drawW = drawnBoundH * imgRatio;
        }
      } else if (fitMode === 'cover') {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const boundRatio = drawnBoundW / drawnBoundH;
        if (imgRatio > boundRatio) {
          drawH = drawnBoundH;
          drawW = drawnBoundH * imgRatio;
        } else {
          drawW = drawnBoundW;
          drawH = drawnBoundW / imgRatio;
        }
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      resolve(canvas.toDataURL('image/png', 0.95));
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}
