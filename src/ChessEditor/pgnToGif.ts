import { Chess } from "chess.js";
import { GIFEncoder } from "gifenc";

import type { Move } from ".";

const SIZE = 400;
const DELAY = 300;
const SQUARE = SIZE / 8;

const PALETTE: [number, number, number][] = [
  [240, 217, 181],
  [181, 136, 99],
  [255, 255, 255],
  [17, 17, 17],
  [245, 245, 245],
];

const LIGHT_SQUARE = 0;
const DARK_SQUARE = 1;
const WHITE_PIECE = 2;
const BLACK_PIECE = 3;
const OUTLINE = 4;

const PIECES: Record<string, string> = {
  b: "♝",
  k: "♚",
  n: "♞",
  p: "♟",
  q: "♛",
  r: "♜",
};

interface IndexedFrame {
  delay: number;
  pixels: Uint8Array;
}

export async function pgnToGif(rawMoves: Move[]): Promise<Blob> {
  const chess = new Chess();

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    throw new Error("Could not create canvas context");
  }

  setupContext(context);

  const frames: IndexedFrame[] = [];

  const addFrame = () => {
    frames.push({
      delay: DELAY,
      pixels: renderBoard(context, chess),
    });
  };

  // Initial position.
  addFrame();

  let currentMove = rawMoves[0]?.next ?? 0;

  while (currentMove > 0 && currentMove < rawMoves.length) {
    const move = rawMoves[currentMove];

    if (!move.from || !move.to) {
      throw new Error(
        `Invalid move at index ${currentMove}: ${JSON.stringify(move)}`,
      );
    }

    chess.move({
      from: move.from,
      to: move.to,
      ...(move.promotion ? { promotion: move.promotion } : {}),
    });

    addFrame();

    if (!move.next) {
      break;
    }

    currentMove = move.next;
  }

  const gif = GIFEncoder();

  for (const [index, frame] of frames.entries()) {
    gif.writeFrame(frame.pixels, SIZE, SIZE, {
      delay: frame.delay,
      palette: PALETTE,

      repeat: 0,
    });

    if ((index & 15) === 15) {
      await yieldToBrowser();
    }
  }

  gif.finish();

  const bytes = gif.bytes();
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);

  return new Blob([buffer], {
    type: "image/gif",
  });
}

function compositePiecesIntoIndexedFrame(
  pixels: Uint8Array,
  rgba: Uint8ClampedArray,
) {
  for (let index = 0, pixel = 0; index < rgba.length; index += 4, pixel++) {
    const alpha = rgba[index + 3];

    if (alpha === 0) {
      continue;
    }

    const r = rgba[index];
    const g = rgba[index + 1];
    const b = rgba[index + 2];

    if (r > 235 && g > 235 && b > 235) {
      pixels[pixel] = WHITE_PIECE;
      continue;
    }

    if (r < 50 && g < 50 && b < 50) {
      pixels[pixel] = BLACK_PIECE;
      continue;
    }

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    pixels[pixel] = brightness >= 128 ? OUTLINE : BLACK_PIECE;
  }
}

function fillBoardPixels(pixels: Uint8Array) {
  for (let rank = 0; rank < 8; rank++) {
    for (let y = 0; y < SQUARE; y++) {
      const rowStart = (rank * SQUARE + y) * SIZE;

      for (let file = 0; file < 8; file++) {
        const color = (rank + file) & 1 ? DARK_SQUARE : LIGHT_SQUARE;

        pixels.fill(
          color,
          rowStart + file * SQUARE,
          rowStart + (file + 1) * SQUARE,
        );
      }
    }
  }
}

function renderBoard(
  context: CanvasRenderingContext2D,
  chess: Chess,
): Uint8Array {
  const pixels = new Uint8Array(SIZE * SIZE);
  fillBoardPixels(pixels);
  context.clearRect(0, 0, SIZE, SIZE);
  const board = chess.board();

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];

      if (!piece) {
        continue;
      }

      const glyph = PIECES[piece.type];

      if (!glyph) {
        continue;
      }

      const x = file * SQUARE + SQUARE / 2;
      const y = rank * SQUARE + SQUARE / 2;

      if (piece.color === "w") {
        context.strokeStyle = "#111111";
        context.fillStyle = "#ffffff";
      } else {
        context.strokeStyle = "#f5f5f5";
        context.fillStyle = "#111111";
      }

      context.strokeText(glyph, x, y);
      context.fillText(glyph, x, y);
    }
  }

  const image = context.getImageData(0, 0, SIZE, SIZE);

  compositePiecesIntoIndexedFrame(pixels, image.data);

  return pixels;
}

function setupContext(context: CanvasRenderingContext2D) {
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${SQUARE * 0.78}px "Arial Unicode MS", "DejaVu Sans", sans-serif`;
  context.lineWidth = SQUARE * 0.035;
  context.imageSmoothingEnabled = true;
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });
}
