import React from 'react';
import { Box, Card, CardContent, Typography, Stack, IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

interface StockCardProps {
  symbol: string;
  alertPrice?: number;
  latestPrice?: number;
  data: { price: number; timestamp: number }[];
  onRemove: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, alertPrice, latestPrice, data, onRemove }) => {
  const current = latestPrice ?? 0;
  let changePercent = 0;
  if (data.length > 1) {
    const prev = data[data.length - 2].price;
    changePercent = ((current - prev) / prev) * 100;
  }

  let cardBg = 'background.paper';
  let isAboveAlert = false;
  if (alertPrice !== undefined) {
    isAboveAlert = current >= alertPrice;
    if (isAboveAlert) {
      cardBg = 'success.light';
    } else if (current < alertPrice) {
      cardBg = 'error.light';
    }
  }

  const isPositive = changePercent >= 0;

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .remove-btn': {
          opacity: 1
        }
      }}
    >
      <IconButton
        className="remove-btn"
        onClick={() => onRemove(symbol)}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          opacity: 0,
          transition: 'opacity 0.2s',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'grey.200' },
          zIndex: 2
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Card sx={{ minWidth: 220, backgroundColor: cardBg, transition: 'background-color 0.2s ease' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
            {symbol}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              fontSize: '1.5rem',
              color: (alertPrice !== undefined)
                ? (isAboveAlert ? 'success.main' : 'error.main')
                : 'text.primary'
            }}
          >
            ${current.toFixed(2)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {isPositive ? <ArrowDropUpIcon color="success" /> : <ArrowDropDownIcon color="error" />}
            <Typography variant="body2" color={isPositive ? 'success.main' : 'error.main'}>
              {changePercent.toFixed(2)}%
            </Typography>
          </Stack>
          {/* Always render the alert line for consistent height */}
          <Typography variant="body2" color="text.secondary">
            Alert: {alertPrice !== undefined ? `$${alertPrice.toFixed(2)}` : '-'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockCard;
