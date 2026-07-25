export type Orientation = 'portrait' | 'landscape';

export type FitMode = 'cover' | 'contain' | 'fill';

export type AlignX = 'center' | 'left' | 'right' | 'custom';
export type AlignY = 'center' | 'top' | 'bottom' | 'custom';

export interface CardSettings {
  presetId: string;
  width: number;       // in mm
  height: number;      // in mm
  margin: number;      // in mm
  spacingX: number;    // in mm
  spacingY: number;    // in mm
  orientation: Orientation;
  showCropMarks: boolean;
  showRegistrationMarks: boolean;
  showNumbers: boolean;
  centerGrid: boolean;
  alignX: AlignX;
  alignY: AlignY;
  manualOffsetX: number;
  manualOffsetY: number;
  disabledSlots: number[];
  fitModeRecto: FitMode;
  rotationRecto: number;     // 0, 90, 180, 270 degrees
  fitModeVerso: FitMode;
  rotationVerso: number;     // 0, 90, 180, 270 degrees
}

export interface GridInfo {
  cols: number;
  rows: number;
  totalWidth: number;
  totalHeight: number;
  offsetX: number;
  offsetY: number;
  pageWidth: number;
  pageHeight: number;
  coveragePercent: number;
  activeCount: number;
}

export interface PresetCard {
  id: string;
  name: string;
  description: string;
  width: number;   // in mm
  height: number;  // in mm
  category: 'standard' | 'creative' | 'mini' | 'custom';
}

export interface DemoCardSample {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  dataUrlRecto: string;
  dataUrlVerso: string;
}
