import { Bias } from "@/lib/forexPairs";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BiasCellProps {
  bias: Bias;
}

const BiasCell = ({ bias }: BiasCellProps) => {
  const config = {
    Bullish: {
      icon: TrendingUp,
      className: "text-bullish bg-bullish/10 border-bullish/20",
    },
    Bearish: {
      icon: TrendingDown,
      className: "text-bearish bg-bearish/10 border-bearish/20",
    },
    Neutral: {
      icon: Minus,
      className: "text-neutral bg-neutral/10 border-neutral/20",
    },
  };

  const { icon: Icon, className } = config[bias];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {bias}
    </div>
  );
};

export default BiasCell;
