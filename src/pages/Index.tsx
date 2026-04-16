import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BiasTable from "@/components/BiasTable";
import PairSelector from "@/components/PairSelector";
import { PairAnalysis, FOREX_PAIRS } from "@/lib/forexPairs";
import { analyzeAllPairs, generateDemoData } from "@/lib/fetchForexData";
import { Activity, Zap, Key } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<PairAnalysis[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, pair: "" });
  const [apiKey, setApiKey] = useState("");
  const [mode, setMode] = useState<"idle" | "demo" | "live">("idle");
  const [selectedPairs, setSelectedPairs] = useState<string[]>([...FOREX_PAIRS]);

  const handleDemo = () => {
    setData(generateDemoData(selectedPairs));
    setMode("demo");
  };

  const handleLiveAnalysis = async () => {
    if (!apiKey.trim()) return;
    setLoading(true);
    setMode("live");
    try {
      const results = await analyzeAllPairs(apiKey, selectedPairs, (current, total, pair) => {
        setProgress({ current, total, pair });
      });
      setData(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                FX Bias Scanner
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Multi-Timeframe Price Action Analysis
              </p>
            </div>
          </div>
          {mode === "demo" && (
            <span className="text-xs font-mono px-2 py-1 rounded bg-neutral/10 text-neutral border border-neutral/20">
              DEMO MODE
            </span>
          )}
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Controls */}
        {!data && !loading && (
          <div className="max-w-xl mx-auto space-y-8 text-center pt-16">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Forex Directional Bias
              </h2>
              <p className="text-muted-foreground">
                Analyze 26 forex pairs across 7 timeframes using pure price
                action — swing highs, swing lows, and market structure.
              </p>
            </div>

            <PairSelector
              selectedPairs={selectedPairs}
              onSelectionChange={setSelectedPairs}
            />

            <div className="space-y-4">
              <Button
                onClick={handleDemo}
                size="lg"
                className="w-full gap-2 text-base"
                disabled={selectedPairs.length === 0}
              >
                <Zap className="w-5 h-5" />
                Quick Demo ({selectedPairs.length} pairs)
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground font-mono">
                    OR USE LIVE DATA
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Twelve Data API Key (free at twelvedata.com)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pl-10 font-mono text-sm"
                  />
                </div>
                <Button
                  onClick={handleLiveAnalysis}
                  disabled={!apiKey.trim() || selectedPairs.length === 0}
                  variant="outline"
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Analyze
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Free API key from{" "}
                <a
                  href="https://twelvedata.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  twelvedata.com
                </a>
                {" "}· Note: free tier has rate limits, full scan takes ~25 min
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-md mx-auto text-center pt-16 space-y-6">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                Analyzing {progress.pair || "..."}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {progress.current} / {progress.total} requests
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <>
            <BiasTable data={data} />
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setData(null);
                  setMode("idle");
                }}
              >
                New Analysis
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
