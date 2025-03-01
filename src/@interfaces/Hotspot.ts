export interface Hotspot {
  draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  onClick: () => void;
}
