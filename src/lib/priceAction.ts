import { Candle, Bias } from "./forexPairs";

/**
 * Determines directional bias using pure price action:
 * - Checks swing highs/lows structure
 * - Higher highs + higher lows = Bullish
 * - Lower highs + lower lows = Bearish
 * - Mixed = Neutral
 */
export function analyzeBias(candles: Candle[]): Bias {
  if (candles.length < 3) return "Neutral";

  // Find swing points (local highs and lows)
  const swingHighs: number[] = [];
  const swingLows: number[] = [];

  for (let i = 1; i < candles.length - 1; i++) {
    if (candles[i].high > candles[i - 1].high && candles[i].high > candles[i + 1].high) {
      swingHighs.push(candles[i].high);
    }
    if (candles[i].low < candles[i - 1].low && candles[i].low < candles[i + 1].low) {
      swingLows.push(candles[i].low);
    }
  }

  // Need at least 2 swing points to compare
  if (swingHighs.length < 2 && swingLows.length < 2) {
    // Fallback: compare first and last candle close
    const first = candles[0];
    const last = candles[candles.length - 1];
    const change = (last.close - first.close) / first.close;
    if (change > 0.001) return "Bullish";
    if (change < -0.001) return "Bearish";
    return "Neutral";
  }

  let higherHighs = 0;
  let lowerHighs = 0;
  let higherLows = 0;
  let lowerLows = 0;

  for (let i = 1; i < swingHighs.length; i++) {
    if (swingHighs[i] > swingHighs[i - 1]) higherHighs++;
    else lowerHighs++;
  }

  for (let i = 1; i < swingLows.length; i++) {
    if (swingLows[i] > swingLows[i - 1]) higherLows++;
    else lowerLows++;
  }

  const bullishScore = higherHighs + higherLows;
  const bearishScore = lowerHighs + lowerLows;

  if (bullishScore > bearishScore && bullishScore >= 2) return "Bullish";
  if (bearishScore > bullishScore && bearishScore >= 2) return "Bearish";

  // Additional check: overall trend direction using close prices
  const recentClose = candles[candles.length - 1].close;
  const midClose = candles[Math.floor(candles.length / 2)].close;
  const firstClose = candles[0].close;

  if (recentClose > midClose && midClose > firstClose) return "Bullish";
  if (recentClose < midClose && midClose < firstClose) return "Bearish";

  return "Neutral";
}
