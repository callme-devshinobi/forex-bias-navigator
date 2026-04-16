import { Candle, Bias, FOREX_PAIRS, TIMEFRAMES, PairAnalysis } from "./forexPairs";
import { analyzeBias } from "./priceAction";

const API_BASE = "https://api.twelvedata.com";

interface TwelveDataResponse {
  values?: Array<{
    open: string;
    high: string;
    low: string;
    close: string;
  }>;
  status?: string;
  message?: string;
}

async function fetchCandles(
  pair: string,
  interval: string,
  count: number,
  apiKey: string
): Promise<Candle[]> {
  const symbol = pair.replace("/", "");
  const url = `${API_BASE}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${count}&apikey=${apiKey}`;

  const res = await fetch(url);
  const data: TwelveDataResponse = await res.json();

  if (!data.values || data.values.length === 0) {
    throw new Error(data.message || `No data for ${pair} ${interval}`);
  }

  // API returns newest first, reverse for chronological order
  return data.values.reverse().map((v) => ({
    open: parseFloat(v.open),
    high: parseFloat(v.high),
    low: parseFloat(v.low),
    close: parseFloat(v.close),
  }));
}

export async function analyzeAllPairs(
  apiKey: string,
  onProgress?: (current: number, total: number, pair: string) => void
): Promise<PairAnalysis[]> {
  const results: PairAnalysis[] = [];
  const total = FOREX_PAIRS.length * TIMEFRAMES.length;
  let current = 0;

  for (const pair of FOREX_PAIRS) {
    const biases: Record<string, Bias> = {};

    for (const tf of TIMEFRAMES) {
      try {
        // Rate limiting: Twelve Data free tier = 8 req/min
        if (current > 0 && current % 7 === 0) {
          await new Promise((r) => setTimeout(r, 62000)); // wait ~1 min
        }

        const candles = await fetchCandles(pair, tf.value, tf.candles, apiKey);
        biases[tf.value] = analyzeBias(candles);
      } catch {
        biases[tf.value] = "Neutral";
      }

      current++;
      onProgress?.(current, total, pair);
    }

    results.push({ pair, biases });
  }

  return results;
}

// Demo mode with simulated analysis
export function generateDemoData(): PairAnalysis[] {
  const biasOptions: Bias[] = ["Bullish", "Bearish", "Neutral"];

  return FOREX_PAIRS.map((pair) => {
    const biases: Record<string, Bias> = {};
    let seed = 0;
    for (let i = 0; i < pair.length; i++) seed += pair.charCodeAt(i);

    TIMEFRAMES.forEach((tf, idx) => {
      const val = (seed * (idx + 1) * 7 + idx * 13) % 100;
      if (val < 40) biases[tf.value] = biasOptions[0];
      else if (val < 75) biases[tf.value] = biasOptions[1];
      else biases[tf.value] = biasOptions[2];
    });

    return { pair, biases };
  });
}
