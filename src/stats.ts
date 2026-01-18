import { groupBy, mapValues } from "es-toolkit";
import { floor, max, mean, min, round } from "es-toolkit/compat";

import initWasm from "./wasm/stats";

export interface StatSummary {
  avg: number;
  dominant: null | number;
  histogram: Record<number, number>;
  max: number;
  median: number;
  min: number;
  q1: number;
  q3: number;
  stddev: number;
  variance: number;
}

let wasmComputeStats: ((argument0: number[]) => StatSummary) | null = null;

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line unicorn/prefer-top-level-await, @typescript-eslint/no-explicit-any
void initWasm().then((wasm: any) => {
  wasmComputeStats = (array: number[]) => {
    const minNumber = min(array) || Number.POSITIVE_INFINITY;
    const maxNumber = max(array) || Number.NEGATIVE_INFINITY;

    let intType = "Uint32";
    if (minNumber >= 0 && maxNumber <= 255) {
      intType = "Uint8";
    } else if (minNumber >= -128 && maxNumber <= 127) {
      intType = "Int8";
    }
    const wasmVector = new wasm[`Vector${intType}`]();
    for (const item of array) {
      wasmVector.push_back(item);
    }

    const avg = wasm[`avg_${intType}`](wasmVector);
    const variance = wasm[`variance_${intType}`](wasmVector);
    const stddev = wasm[`stddev_${intType}`](wasmVector);
    const median = wasm[`median_${intType}`](wasmVector);
    const q1 = wasm[`q1_${intType}`](wasmVector);
    const q3 = wasm[`q3_${intType}`](wasmVector);
    const dominant = wasm[`dominant_${intType}`](wasmVector);
    const histogram = wasm[`histogram_${intType}`](wasmVector);

    wasmVector.delete();

    return {
      avg,
      dominant,
      histogram,
      max: maxNumber,
      median,
      min: minNumber,
      q1,
      q3,
      stddev,
      variance,
    };
  };
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

export function computeStats(data: number[]): StatSummary {
  if (wasmComputeStats !== null) {
    try {
      return wasmComputeStats(data);
    } catch {
      /* empty */
    }
  }
  const n = data.length;
  if (n === 0) {
    return {
      avg: 0,
      dominant: null,
      histogram: {},
      max: 0,
      median: 0,
      min: 0,
      q1: 0,
      q3: 0,
      stddev: 0,
      variance: 0,
    };
  }

  const minValue = min(data) || Number.POSITIVE_INFINITY;
  const maxValue = max(data) || Number.NEGATIVE_INFINITY;
  const avg = mean(data);

  const freq: Record<number, number> = mapValues(
    groupBy(data, (item) => round(item)),
    (item) => item.length,
  );

  let sqDiffSum = 0;
  for (let index = 0; index < n; index++) {
    const diff = data[index] - avg;
    sqDiffSum += diff * diff;
  }
  const variance = sqDiffSum / n;
  const stddev = Math.sqrt(variance);

  const sorted = data.toSorted((a, b) => a - b);
  const mid = floor(n / 2);
  const median =
    n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const q1 = sorted[floor(n / 4)];
  const q3 = sorted[floor((3 * n) / 4)];

  let dominant: null | number = null;
  let maxFreq = 0;
  for (const [key, value] of Object.entries(freq)) {
    if (value > maxFreq) {
      maxFreq = value;
      dominant = Number(key);
    }
  }

  return {
    avg,
    dominant,
    histogram: freq,
    max: maxValue,
    median,
    min: minValue,
    q1,
    q3,
    stddev,
    variance,
  };
}
