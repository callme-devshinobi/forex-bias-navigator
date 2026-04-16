import { useRef } from "react";
import { toPng } from "html-to-image";
import { PairAnalysis, TIMEFRAMES } from "@/lib/forexPairs";
import BiasCell from "./BiasCell";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Bias } from "@/lib/forexPairs";

interface BiasTableProps {
  data: PairAnalysis[];
}

const BiasTable = ({ data }: BiasTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!tableRef.current) return;

    try {
      const dataUrl = await toPng(tableRef.current, {
        backgroundColor: "hsl(220, 20%, 7%)",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `forex-bias-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Directional Bias Analysis
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            {data.length} pairs · {TIMEFRAMES.length} timeframes · Price Action
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export as Image
        </Button>
      </div>

      <div
        ref={tableRef}
        className="rounded-lg border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground sticky left-0 bg-secondary/50 z-10 border-r border-border">
                  Pair
                </th>
                {TIMEFRAMES.map((tf) => (
                  <th
                    key={tf.value}
                    className="text-center px-3 py-3 font-semibold text-foreground whitespace-nowrap"
                  >
                    {tf.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={row.pair}
                  className={`border-t border-border transition-colors hover:bg-accent/30 ${
                    i % 2 === 0 ? "bg-card" : "bg-card/50"
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono font-semibold text-primary sticky left-0 z-10 border-r border-border bg-inherit">
                    {row.pair}
                  </td>
                  {TIMEFRAMES.map((tf) => (
                    <td key={tf.value} className="text-center px-3 py-2.5">
                      <BiasCell bias={(row.biases[tf.value] as Bias) || "Neutral"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-bullish" /> Bullish
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-bearish" /> Bearish
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neutral" /> Neutral
        </div>
      </div>
    </div>
  );
};

export default BiasTable;
