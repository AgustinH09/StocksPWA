import { useEffect } from "react";
import { useFinnhubWebSocket } from "../hooks/useFinnhubWebSocket";
import { StocksContext } from "../context/StocksContext";

export const StocksProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { stocks, addSymbol, removeSymbol } = useFinnhubWebSocket();

  useEffect(() => {
    if (Object.keys(stocks).length === 0 && localStorage.getItem("stock_data") == null) {
      const defaultSymbolsEnv = import.meta.env.VITE_DEFAULT_STOCK_SYMBOLS || '';
      const defaultSymbols = defaultSymbolsEnv
        .split(',')
        .map((sym: string) => sym.trim())
        .filter((sym: string) => sym.length > 0);

      defaultSymbols.forEach((symbol: string) => {
        addSymbol(symbol);
      });
    }
  }, [stocks, addSymbol]);

  return (
    <StocksContext.Provider value={{ stocks, addSymbol, removeSymbol }}>
      {children}
    </StocksContext.Provider>
  );
};
