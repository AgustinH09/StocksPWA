import { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

import { StockDataPoint, StockInfo, State } from 'types/stockTypes';
import { Action } from 'types/actionTypes';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_FROM_STORAGE':
      return { ...state, stocks: action.payload };
    case 'ADD_SYMBOL':
      return {
        ...state,
        stocks: {
          ...state.stocks,
          [action.symbol]: {
            symbol: action.symbol,
            alertPrice: action.alert,
            latestPrice: undefined,
            data: []
          }
        }
      };
    case 'REMOVE_SYMBOL': {
      const newStocks = { ...state.stocks };
      delete newStocks[action.symbol];
      return { ...state, stocks: newStocks };
    }
    case 'UPDATE_PRICE': {
      const stock = state.stocks[action.symbol];
      if (!stock) return state;
      const newDataPoint: StockDataPoint = { price: action.price, timestamp: Math.floor(Date.now() / 1000) };
      const updatedData = [...stock.data, newDataPoint];
      return {
        ...state,
        stocks: {
          ...state.stocks,
          [action.symbol]: {
            ...stock,
            latestPrice: action.price,
            data: updatedData
          }
        }
      };
    }
    default:
      return state;
  }
}

export function useFinnhubQuotes() {
  const [state, dispatch] = useReducer(reducer, { stocks: {} });
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
  const intervalRef = useRef<number | null>(null);
  const stocksInitialized = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem('stock_data');
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, StockInfo>;
      dispatch({ type: 'INIT_FROM_STORAGE', payload: parsed });
      stocksInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (!stocksInitialized.current) return;

    localStorage.setItem('stock_data', JSON.stringify(state.stocks));
  }, [state.stocks]);

  const addSymbol = (symbol: string, alert?: number) => {
    dispatch({ type: 'ADD_SYMBOL', symbol, alert });
  };

  const removeSymbol = (symbol: string) => {
    dispatch({ type: 'REMOVE_SYMBOL', symbol });
  };

  useEffect(() => {
    const fetchAllQuotes = async () => {
      const symbols = Object.keys(state.stocks);
      if (symbols.length === 0) return;
      for (const symbol of symbols) {
        try {
          const res = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
          if (res.status === 200) {
            const { c: currentPrice } = res.data;
            if (typeof currentPrice === 'number') {
              dispatch({ type: 'UPDATE_PRICE', symbol, price: currentPrice });
            }
          }
        } catch (error) {
          console.error("Error fetching quote for:", symbol, error);
        }
      }
    };

    fetchAllQuotes();
    intervalRef.current = window.setInterval(fetchAllQuotes, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.stocks, apiKey]);

  return {
    stocks: state.stocks,
    addSymbol,
    removeSymbol
  };
}
