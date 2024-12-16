import { useEffect, useRef, useReducer } from 'react';

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
            latestPrice: action.price,
            data: action.price ? [{ price: action.price, timestamp: Math.floor(Date.now()/1000) }] : [],
            lastUpdateTime: action.price ? Date.now() : undefined
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
      const newDataPoint: StockDataPoint = { price: action.price, timestamp: action.timestamp ?? Math.floor(Date.now() / 1000) };
      const updatedData = [...stock.data, newDataPoint].slice(-200);
      const wasAboveAlert = stock.latestPrice !== undefined && (stock.alertPrice !== undefined ? stock.latestPrice >= stock.alertPrice : true);
      const isBelowAlert = (stock.alertPrice !== undefined) ? (action.price < stock.alertPrice) : false;

      if (isBelowAlert && wasAboveAlert) {
        // Trigger notification
        setTimeout(() => {
          import('../utils/notifications').then(({ showPriceAlertNotification }) => {
            showPriceAlertNotification(`Price Alert: ${action.symbol}`, `The price has fallen below your alert ${stock.alertPrice}. Current: ${action.price}`);
          });
        }, 0);
      }

      return {
        ...state,
        stocks: {
          ...state.stocks,
          [action.symbol]: {
            ...stock,
            latestPrice: action.price,
            data: updatedData,
            lastUpdateTime: Date.now()
          }
        }
      };
    }
    default:
      return state;
  }
}

export function useFinnhubWebSocket() {
  const [state, dispatch] = useReducer(reducer, { stocks: {} });
  const wsRef = useRef<WebSocket | null>(null);
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  useEffect(() => {
    const stored = localStorage.getItem('stock_data');
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, StockInfo>;
      dispatch({ type: 'INIT_FROM_STORAGE', payload: parsed });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stock_data', JSON.stringify(state.stocks));
  }, [state.stocks]);

  useEffect(() => {
    if (!apiKey) {
      console.error("Finnhub API key is missing");
      return;
    }

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Subscribe to all currently tracked symbols
      Object.keys(state.stocks).forEach(symbol => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade' && Array.isArray(data.data)) {
        data.data.forEach((trade: { s: string; p: number; t: number }) => {
          const { s: symbol, p: price, t: timestamp } = trade;
          dispatch({ type: 'UPDATE_PRICE', symbol, price, timestamp: Math.floor(timestamp / 1000) });
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [apiKey, state.stocks]);

  const addSymbol = async (symbol: string, alert?: number): Promise<boolean> => {
    if (state.stocks[symbol]) {
      return false;
    }

    dispatch({ type: 'ADD_SYMBOL', symbol, alert });
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', symbol }));
    }

    const price = await fetchQuoteForSymbol(symbol, apiKey);
    if (price !== undefined) {
      dispatch({ type: 'ADD_SYMBOL', symbol, alert, price });
    }
    return true;
  };


  const removeSymbol = (symbol: string) => {
    dispatch({ type: 'REMOVE_SYMBOL', symbol });
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      for (const symbol in state.stocks) {
        const stock = state.stocks[symbol];
        const lastUpdate = stock.lastUpdateTime ?? 0;

        if (now - lastUpdate > 60000) {
          const price = await fetchQuoteForSymbol(symbol, apiKey);
          if (price !== undefined) {
            dispatch({ type: 'UPDATE_PRICE', symbol, price, timestamp: Math.floor(Date.now()/1000) });
          } else {
            dispatch({ type: 'UPDATE_PRICE', symbol, price: stock.latestPrice ?? 0, timestamp: Math.floor(Date.now()/1000) });
          }
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [state.stocks, apiKey]);

  return {
    stocks: state.stocks,
    addSymbol,
    removeSymbol
  };
}

async function fetchQuoteForSymbol(symbol: string, apiKey?: string): Promise<number | undefined> {
  if (!apiKey) return;
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    if (!res.ok) {
      console.error("Error fetching quote", res.status, res.statusText);
      return;
    }
    const data = await res.json();
    return data.c;
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
