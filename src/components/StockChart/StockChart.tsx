import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography, Paper, MenuItem, Select, FormControl } from "@mui/material";

import { useStocks } from "hooks/useStocks";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const colors = [
  { border: "rgba(0,128,0,0.8)", background: "rgba(0,128,0,0.2)" },
  { border: "rgba(255,0,0,0.8)", background: "rgba(255,0,0,0.2)" },
  { border: "rgba(0,0,255,0.8)", background: "rgba(0,0,255,0.2)" },
  { border: "rgba(255,165,0,0.8)", background: "rgba(255,165,0,0.2)" },
  { border: "rgba(128,0,128,0.8)", background: "rgba(128,0,128,0.2)" },
];

const TIME_RANGES = {
  "Last minute": 60,
  "Last 5 minutes": 300,
  "Last 10 minutes": 600,
  "Last day": 86400,
  "Last week": 604800,
  "Last month": 2592000,
};

const StockChart: React.FC = () => {
  const { stocks } = useStocks();
  const [selectedRange, setSelectedRange] = useState("Last 5 minutes");

  const data = useMemo(() => {
    const allSymbols = Object.values(stocks);

    if (allSymbols.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const rangeInSeconds = TIME_RANGES[selectedRange as keyof typeof TIME_RANGES];

    const allTimestamps = new Set(
      allSymbols.flatMap((s) =>
        s.data
          .filter((d) => currentTime - d.timestamp <= rangeInSeconds)
          .map((d) => d.timestamp)
      )
    );
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    const labels = sortedTimestamps.map((ts) => {
      const date = new Date(ts * 1000);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    });

    const datasets = allSymbols.map((s, i) => {
      const color = colors[i % colors.length];
      const priceMap = new Map(s.data.map((d) => [d.timestamp, d.price]));
      const dataPoints = sortedTimestamps.map((ts) => priceMap.get(ts) ?? NaN);

      return {
        label: s.symbol,
        data: dataPoints,
        borderColor: color.border,
        backgroundColor: color.background,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        spanGaps: true,
      };
    });

    return { labels, datasets };
  }, [stocks, selectedRange]);

  return (
    <Paper
      sx={{
        p: 3,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Stock Price Over Time
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            displayEmpty
          >
            {Object.keys(TIME_RANGES).map((range) => (
              <MenuItem key={range} value={range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {data.labels.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Add a stock to begin charting its price.
        </Typography>
      ) : (
        <Box sx={{ flex: 1, position: "relative", height: "500px" }}>
          <Line
            data={data}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { display: false },
                  title: {
                    display: true,
                    text: "Time",
                    font: { weight: "bold" },
                  },
                },
                y: {
                  grid: { color: "#eee" },
                  ticks: {
                    callback: (value) => `$${value}`,
                  },
                  title: {
                    display: true,
                    text: "Price (USD)",
                    font: { weight: "bold" },
                  },
                },
              },
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || "";
                      const value = context.raw;
                      return `${label}: $${value}`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default StockChart;
