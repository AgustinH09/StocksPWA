export interface StockDataPoint {
  timestamp: number;
  price: number;
}

export interface StockInfo {
  symbol: string;
  alertPrice?: number;
  latestPrice?: number;
  data: StockDataPoint[];
  lastUpdateTime?: number;
}

interface State {
  stocks: Record<string, StockInfo>;
}
