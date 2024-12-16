import React, { useState, useMemo } from 'react';
import { Box, Typography, TextField, Button, Divider, Snackbar, Alert, FilterOptionsState } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { useStocks } from 'hooks/useStocks';
import { useFinnhubSymbols } from 'hooks/useFinnhubSymbols';

const filter = createFilterOptions<{ symbol: string; description: string; }>({
  limit: 50,
});

const LeftForm: React.FC = () => {
  const symbols = useFinnhubSymbols();
  const { addSymbol } = useStocks();

  const [inputValue, setInputValue] = useState('');
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [alertValue, setAlertValue] = useState<string>('');
  const [errorOpen, setErrorOpen] = useState(false);

  const symbolOptions = useMemo(() => {
    return symbols.map(s => ({ symbol: s.symbol, description: s.description }));
  }, [symbols]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    const parsedAlert = alertValue ? parseFloat(alertValue) : undefined;
    const success = await addSymbol(selectedStock, parsedAlert);
    if (!success) {
      setErrorOpen(true);
    } else {
      setAlertValue('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" component="h2" fontWeight={700}>
            Watchlist
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Start typing a stock symbol to find and add it to your watchlist.
        </Typography>
      </Box>

      <Divider />

      <Autocomplete
        fullWidth
        options={symbolOptions}
        getOptionLabel={(option: { symbol: string; description: string; }) => `${option.symbol} - ${option.description}`}
        filterOptions={(options: { symbol: string; description: string; }[], params: FilterOptionsState<{ symbol: string; description: string; }>) => {
          const filtered = filter(options, params) as { symbol: string; description: string; }[];
          return filtered;
        }}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, newValue) => {
          if (newValue) {
            setSelectedStock(newValue.symbol);
          } else {
            setSelectedStock('');
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a stock"
            variant="outlined"
            placeholder="e.g., AAPL, TSLA"
          />
        )}
      />

      <TextField
        label="Alert Price"
        type="number"
        value={alertValue}
        onChange={(e) => setAlertValue(e.target.value)}
        fullWidth
        variant="outlined"
      />

      <Button type="submit" variant="contained" size="large" disabled={!selectedStock}>
        Add to Watchlist
      </Button>

      <Snackbar open={errorOpen} autoHideDuration={3000} onClose={() => setErrorOpen(false)}>
        <Alert severity="error" onClose={() => setErrorOpen(false)}>
          This stock is already being tracked. Remove it first to re-add.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeftForm;
