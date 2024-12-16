// src/context/StocksContext.tsx
import { createContext } from 'react';

import { StockInfo } from 'types/stockTypes';

interface StocksContextValue {
  stocks: Record<string, StockInfo>;
  addSymbol: (symbol: string, alert?: number) => Promise<boolean>;
  removeSymbol: (symbol: string) => void;
}

export const StocksContext = createContext<StocksContextValue | null>(null);
