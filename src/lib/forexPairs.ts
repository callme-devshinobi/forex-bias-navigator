export const FOREX_PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "NZD/USD", "USD/CAD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "EUR/AUD", "EUR/CAD", "EUR/CHF",
  "GBP/AUD", "GBP/CAD", "GBP/CHF", "AUD/CAD", "AUD/CHF", "AUD/NZD",
  "NZD/JPY", "NZD/CAD", "NZD/CHF", "CAD/JPY", "CAD/CHF", "CHF/JPY",
] as const;

export const TIMEFRAMES = [
  { label: "Monthly", value: "1month", candles: 6 },
  { label: "Weekly", value: "1week", candles: 8 },
  { label: "Daily", value: "1day", candles: 10 },
  { label: "4H", value: "4h", candles: 12 },
  { label: "1H", value: "1h", candles: 20 },
  { label: "30M", value: "30min", candles: 20 },
  { label: "15M", value: "15min", candles: 20 },
] as const;

export type Bias = "Bullish" | "Bearish" | "Neutral";

export interface PairAnalysis {
  pair: string;
  biases: Record<string, Bias>;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}
