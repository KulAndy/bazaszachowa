// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LogarithmicScale,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Tooltip,
  Legend,
);

const options = {
  scales: {
    y: {
      min: 1,
      type: "logarithmic" as const,
    },
  },
};

const Histogram = ({ data }: { readonly data: Record<number, number> }) => {
  const labels = Object.keys(data)
    .map(Number)
    .toSorted((a, b) => a - b);
  const values = labels.map((key) => data[key]);

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          backgroundColor: "rgba(53, 162, 235, 0.6)",
          borderColor: "rgba(53, 162, 235, 1)",
          borderWidth: 1,
          data: values,
          label: "Frequency",
        },
      ],
      labels,
    }),
    [labels, values],
  );

  return (
    <div
      style={
        {
          backgroundColor: "white",
          height: 200,
          margin: "auto",
          width: 400,
        } as const
      }
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Histogram;
