// ...existing types...

export type CaptureEffectType = 'normal' | 'shadow' | 'scanner' | 'saturate';

export interface CanvasEffects {
  applyCaptureEffect: (ctx: CanvasRenderingContext2D) => void;
  drawShadowEffect: (ctx: CanvasRenderingContext2D, width: number, height: number, direction: ShadowDirection) => void;
}