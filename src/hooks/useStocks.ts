import { useContext } from 'react';
import { StocksContext } from '../context/StocksContext'; // Adjust the path if needed.

export const useStocks = () => {
  const ctx = useContext(StocksContext);
  if (!ctx) {
    throw new Error("useStocks must be used within StocksProvider");
  }
  return ctx;
};
