export type Action =
  | { type: 'INIT_FROM_STORAGE', payload: Record<string, StockInfo> }
  | { type: 'ADD_SYMBOL', symbol: string, alert?: number, price?: number }
  | { type: 'REMOVE_SYMBOL', symbol: string }
  | { type: 'UPDATE_PRICE', symbol: string, price: number, timestamp?: number }
