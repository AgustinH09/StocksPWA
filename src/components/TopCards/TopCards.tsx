import React from 'react';
import { Box, Typography } from '@mui/material';

import { useStocks } from 'hooks/useStocks';

import StockCard from './StockCard';

const TopCards: React.FC = () => {
  const { stocks, removeSymbol } = useStocks();
  const stockEntries = Object.values(stocks);

  if (stockEntries.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No stocks tracked yet. Add one from the sidebar.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: 3 }
      }}
    >
      {stockEntries.map(({ symbol, alertPrice, latestPrice, data }) => (
        <StockCard
          key={symbol}
          symbol={symbol}
          alertPrice={alertPrice}
          latestPrice={latestPrice}
          data={data}
          onRemove={removeSymbol}
        />
      ))}
    </Box>
  );
};

export default TopCards;
