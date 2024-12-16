import { useFinnhubWebSocket } from "../hooks/useFinnhubWebSocket";
import { StocksContext } from "../context/StocksContext";

export const StocksProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { stocks, addSymbol, removeSymbol } = useFinnhubWebSocket();

  return (
    <StocksContext.Provider value={{ stocks, addSymbol, removeSymbol }}>
      {children}
    </StocksContext.Provider>
  );
};
