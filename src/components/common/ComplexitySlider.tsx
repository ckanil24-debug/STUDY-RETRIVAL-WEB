import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import { ComplexityLevel, COMPLEXITY_META } from '../../types/study';

interface ComplexitySliderProps {
  level: ComplexityLevel;
  onChange: (newLevel: ComplexityLevel) => void;
  compact?: boolean;
}

const LEVELS: ComplexityLevel[] = [1, 2, 3, 4, 5];

export const ComplexitySlider: React.FC<ComplexitySliderProps> = ({ level, onChange, compact = false }) => {
  const currentMeta = COMPLEXITY_META[level];

  return (
    <div
      className={`rounded-xl border border-slate-800/90 bg-slate-900/90 backdrop-blur-md transition-all ${
        compact ? 'px-3.5 py-2' : 'p-4'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Complexity Calibration
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${currentMeta.badgeColor}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>
              Tier {level}: {currentMeta.label}
            </span>
          </span>
        </div>
      </div>

      {/* Interactive Range Input + Segmented Pills */}
      <div className="space-y-2">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={level}
          aria-label="Complexity Slider"
          onChange={(e) => onChange(Number(e.target.value) as ComplexityLevel)}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        <div className="grid grid-cols-5 gap-1">
          {LEVELS.map((itemLevel) => {
            const meta = COMPLEXITY_META[itemLevel];
            const isActive = itemLevel === level;
            return (
              <button
                key={itemLevel}
                type="button"
                onClick={() => onChange(itemLevel)}
                className={`text-center py-1 px-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="hidden sm:inline">{itemLevel}. </span>
                {meta.shortLabel}
              </button>
            );
          })}
        </div>

        {!compact && (
          <p className="text-[11px] text-slate-400 pt-0.5 flex items-center justify-between">
            <span>{currentMeta.description}</span>
            <span className="font-mono text-[10px] text-indigo-400">Instant Rewrite Active</span>
          </p>
        )}
      </div>
    </div>
  );
};
