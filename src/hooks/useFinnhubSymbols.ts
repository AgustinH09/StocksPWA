import { useState, useEffect } from 'react';

import { SymbolInfo } from '@/types/symbolTypes';

export function useFinnhubSymbols() {
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
  const exchange = import.meta.env.VITE_FINNHUB_EXCHANGE_CODE || 'US';

  useEffect(() => {
    if (!apiKey) {
      console.error("API key is missing");
      return;
    }
    const fetchSymbols = async () => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=${exchange}&token=${apiKey}`);
        if (!res.ok) {
          console.error("Failed to fetch symbols:", res.status, res.statusText);
          return;
        }
        const data: SymbolInfo[] = await res.json();
        setSymbols(data);
      } catch (err) {
        console.error("Error fetching symbols:", err);
      }
    };

    fetchSymbols();
  }, [apiKey, exchange]);

  return symbols;
}
