export interface CardSettings {
  width: number;
  height: number;
  margin: number;
  spacing: number;
  showCropMarks: boolean;
  maxCards: number;
}

export interface GridInfo {
  cols: number;
  rows: number;
  totalWidth: number;
  totalHeight: number;
  offsetX: number;
  offsetY: number;
}
