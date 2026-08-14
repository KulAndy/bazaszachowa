declare module "gifenc" {
  export interface GIFEncoder {
    bytes(): Uint8Array;

    finish(): void;

    reset(): void;

    writeFrame(
      index: Uint8Array | Uint8ClampedArray,
      width: number,
      height: number,
      options: GIFFrameOptions,
    ): void;
  }

  export interface GIFFrameOptions {
    delay?: number;
    dispose?: number;
    palette: Palette;
    repeat?: number;
    transparent?: false | number;
    transparentIndex?: number;
  }

  export type Palette = RGB[];

  export type RGB = [number, number, number];

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: Palette,
    options?: Record<string, unknown>,
  ): Uint8Array;

  export function GIFEncoder(): GIFEncoder;

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors?: number,
    options?: Record<string, unknown>,
  ): Palette;
}
