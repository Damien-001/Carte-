import React from 'react';
import { Minus, Plus } from '@phosphor-icons/react';

interface NumInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export function NumInput({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  unit = 'mm',
}: NumInputProps) {
  const handleDecrement = () => {
    const newVal = Math.max(min, Math.round((value - step) * 10) / 10);
    onChange(newVal);
  };

  const handleIncrement = () => {
    const newVal = Math.min(max, Math.round((value + step) * 10) / 10);
    onChange(newVal);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </label>
        {unit && (
          <span className="text-[10px] font-mono text-zinc-500 font-medium">
            {unit}
          </span>
        )}
      </div>

      <div className="relative flex items-center rounded-xl bg-zinc-950/80 border border-zinc-800/80 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all duration-200">
        <button
          type="button"
          onClick={handleDecrement}
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-l-xl transition-colors shrink-0"
        >
          <Minus size={12} weight="bold" />
        </button>

        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(isNaN(parsed) ? 0 : parsed);
          }}
          className="w-full text-center text-xs font-mono text-zinc-100 bg-transparent py-2 focus:outline-none font-medium tracking-tight"
        />

        <button
          type="button"
          onClick={handleIncrement}
          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-r-xl transition-colors shrink-0"
        >
          <Plus size={12} weight="bold" />
        </button>
      </div>
    </div>
  );
}
