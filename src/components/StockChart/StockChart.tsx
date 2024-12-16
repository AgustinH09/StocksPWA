import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Box, Typography, Paper } from '@mui/material';

import { useStocks } from 'hooks/useStocks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const colors = [
  { border: 'rgba(0,128,0,0.8)', background: 'rgba(0,128,0,0.2)' },
  { border: 'rgba(255,0,0,0.8)', background: 'rgba(255,0,0,0.2)' },
  { border: 'rgba(0,0,255,0.8)', background: 'rgba(0,0,255,0.2)' },
  { border: 'rgba(255,165,0,0.8)', background: 'rgba(255,165,0,0.2)' },
  { border: 'rgba(128,0,128,0.8)', background: 'rgba(128,0,128,0.2)' },
];

const StockChart: React.FC = () => {
  const { stocks } = useStocks();

  const data = useMemo(() => {
    const allSymbols = Object.values(stocks);
    if (allSymbols.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const timestamps = Array.from(new Set(allSymbols.flatMap(s => s.data.map(d => d.timestamp)))).sort((a, b) => a - b);
    const labels = timestamps.map(ts => {
      const date = new Date(ts * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    });

    const datasets = allSymbols.map((s, i) => {
      const color = colors[i % colors.length];
      const symbolDataMap = new Map(s.data.map(d => [d.timestamp, d.price]));
      const dataPoints = timestamps.map(t => symbolDataMap.get(t) ?? NaN);
      return {
        label: s.symbol,
        data: dataPoints,
        borderColor: color.border,
        backgroundColor: color.background,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5
      };
    });

    return { labels, datasets };
  }, [stocks]);

  return (
    <Paper
      sx={{
        p: 3,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)'
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Stock Price Over Time
      </Typography>
      {data.labels.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Add a stock to begin charting its price.
        </Typography>
      ) : (
        <Box sx={{ flex: 1, position: 'relative' }}>
          <Line
            data={data}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { display: false }
                },
                y: {
                  grid: { color: '#eee' },
                  ticks: { callback: (val) => `$${val}` }
                }
              },
              plugins: {
                legend: { position: 'top' },
              }
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default StockChart;
