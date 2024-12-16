import { useEffect, useReducer, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { StockDataPoint, StockInfo, State } from "types/stockTypes";
import { Action } from "types/actionTypes";

function getInitialState(): State {
  const stored = localStorage.getItem("stock_data");
  const stocks = stored ? (JSON.parse(stored) as Record<string, StockInfo>) : {};
  return { stocks };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_SYMBOL":
      return {
        ...state,
        stocks: {
          ...state.stocks,
          [action.symbol]: {
            symbol: action.symbol,
            alertPrice: action.alert,
            latestPrice: action.price,
            data: action.price
              ? [{ price: action.price, timestamp: Math.floor(Date.now() / 1000) }]
              : [],
            lastUpdateTime: action.price ? Date.now() : undefined,
          },
        },
      };
    case "REMOVE_SYMBOL": {
      const newStocks = { ...state.stocks };
      delete newStocks[action.symbol];
      return { ...state, stocks: newStocks };
    }
    case "UPDATE_PRICE": {
      const stock = state.stocks[action.symbol];
      if (!stock) return state;

      const newDataPoint: StockDataPoint = {
        price: action.price,
        timestamp: action.timestamp ?? Math.floor(Date.now() / 1000),
      };
      const updatedData = [...stock.data, newDataPoint];

      return {
        ...state,
        stocks: {
          ...state.stocks,
          [action.symbol]: {
            ...stock,
            latestPrice: action.price,
            data: updatedData,
            lastUpdateTime: Date.now(),
          },
        },
      };
    }
    default:
      return state;
  }
}

export function useFinnhubWebSocket() {
  const [state, dispatch] = useReducer(reducer, {}, getInitialState);
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  useEffect(() => {
    localStorage.setItem("stock_data", JSON.stringify(state.stocks));
  }, [state.stocks]);

  const { sendMessage, lastMessage } = useWebSocket(
    apiKey ? `wss://ws.finnhub.io?token=${apiKey}` : null,
    {
      onOpen: () => {
        console.log("WebSocket connected");
        Object.keys(state.stocks).forEach((symbol) => {
          sendMessage(JSON.stringify({ type: "subscribe", symbol }));
        });
      },
      onClose: () => {
        console.log("WebSocket disconnected");
      },
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (!lastMessage) return;

    const data = JSON.parse(lastMessage.data);
    if (data.type === "trade" && Array.isArray(data.data)) {
      data.data.forEach((trade: { s: string; p: number; t: number }) => {
        const { s: symbol, p: price, t: timestamp } = trade;
        dispatch({
          type: "UPDATE_PRICE",
          symbol,
          price,
          timestamp: Math.floor(timestamp / 1000),
        });
      });
    }
  }, [lastMessage]);

  const addSymbol = useCallback(
    async (symbol: string, alert?: number): Promise<boolean> => {
      if (state.stocks[symbol]) return false;

      const price = await fetchQuoteForSymbol(symbol, apiKey);
      dispatch({ type: "ADD_SYMBOL", symbol, alert, price });

      sendMessage(JSON.stringify({ type: "subscribe", symbol }));
      return true;
    },
    [state.stocks, apiKey, sendMessage]
  );

  const removeSymbol = useCallback(
    (symbol: string) => {
      if (!state.stocks[symbol]) return;

      dispatch({ type: "REMOVE_SYMBOL", symbol });
      sendMessage(JSON.stringify({ type: "unsubscribe", symbol }));
    },
    [state.stocks, sendMessage]
  );

  return {
    stocks: state.stocks,
    addSymbol,
    removeSymbol,
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
