import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { countBy } from "es-toolkit";
import React, { useEffect, useRef } from "react";

import { useI18n } from "../context/useI18n";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

Chart.defaults.backgroundColor = "#9BD0F5";
Chart.defaults.borderColor = "#36A2EB";
Chart.defaults.color = "#000";

interface TournamentTimeSeriesProperties {
  readonly series: { start: string }[];
}

const current = new Date();

const getYearMonthRange = (start: string): `${number}-${string}`[] => {
  const result: `${number}-${string}`[] = [];

  const [startYear, startMonth] = start.split("-").map(Number);

  let year = startYear;
  let month = startMonth;

  while (
    year < current.getUTCFullYear() ||
    (year === current.getUTCFullYear() && month <= current.getUTCMonth())
  ) {
    result.push(`${year}-${String(month).padStart(2, "0")}`);

    month++;
    if (month === 13) {
      month = 1;
      year++;
    }
  }

  return result;
};

const TournamentTimeSeries: React.FC<TournamentTimeSeriesProperties> = ({
  series,
}) => {
  const { t } = useI18n();
  const canvasReference = useRef<HTMLCanvasElement | null>(null);
  const chartReference = useRef<Chart | null>(null);

  let minDate = "9999-12";

  const grouped = countBy(series, (item) => {
    const date = new Date(item.start);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  });

  const groupKeys = Object.keys(grouped);
  if (groupKeys.length > 0) {
    minDate = Object.keys(grouped).toSorted((a, b) => a.localeCompare(b))[0];
  }

  const fullRange = getYearMonthRange(minDate);

  const timeSeries = fullRange.map((yearMonth) => ({
    count: grouped[yearMonth] ?? 0,
    yearMonth,
  }));

  const labels = timeSeries.map((p) => p.yearMonth);
  const values = timeSeries.map((p) => p.count);

  useEffect(() => {
    if (!canvasReference.current) {
      return;
    }

    chartReference.current?.destroy();

    chartReference.current = new Chart(canvasReference.current, {
      data: {
        datasets: [
          {
            backgroundColor: "rgba(37, 99, 235, 0.2)",
            borderColor: "#2563eb",

            data: values,
            fill: true,
            label: t("quantity"),
            pointBackgroundColor: "#2563eb",
            pointBorderColor: "#ffffff",

            pointRadius: 4,
            tension: 0.3,
          },
        ],
        labels,
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      },
      type: "line",
    });

    // eslint-disable-next-line consistent-return
    return () => {
      chartReference.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels.join(","), values.join(",")]);

  return (
    <div style={{ overflowX: "auto", width: "100%" } as const}>
      <div
        style={
          {
            backgroundColor: "#fff",
            height: 300,
            minWidth: 600,
            width: "100%",
          } as const
        }
      >
        <canvas ref={canvasReference} />
      </div>
    </div>
  );
};

export default TournamentTimeSeries;
