import { useState } from "react";
import { FOREX_PAIRS } from "@/lib/forexPairs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square } from "lucide-react";

interface PairSelectorProps {
  selectedPairs: string[];
  onSelectionChange: (pairs: string[]) => void;
}

const PairSelector = ({ selectedPairs, onSelectionChange }: PairSelectorProps) => {
  const allSelected = selectedPairs.length === FOREX_PAIRS.length;

  const toggleAll = () => {
    onSelectionChange(allSelected ? [] : [...FOREX_PAIRS]);
  };

  const togglePair = (pair: string) => {
    onSelectionChange(
      selectedPairs.includes(pair)
        ? selectedPairs.filter((p) => p !== pair)
        : [...selectedPairs, pair]
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Select Pairs ({selectedPairs.length}/{FOREX_PAIRS.length})
        </span>
        <Button variant="ghost" size="sm" onClick={toggleAll} className="gap-1.5 text-xs h-7">
          {allSelected ? <Square className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto rounded-md border border-border p-3 bg-card/50">
        {FOREX_PAIRS.map((pair) => (
          <label
            key={pair}
            className="flex items-center gap-1.5 cursor-pointer text-xs font-mono px-1.5 py-1 rounded hover:bg-accent/30 transition-colors"
          >
            <Checkbox
              checked={selectedPairs.includes(pair)}
              onCheckedChange={() => togglePair(pair)}
              className="h-3.5 w-3.5"
            />
            <span className="text-foreground">{pair}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PairSelector;
