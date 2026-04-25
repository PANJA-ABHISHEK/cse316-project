import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

export default function ControlPanel({
  onStart, onPause, onReset, onNext, onPrev,
  isRunning, canNext, canPrev, hasResult,
  speed, onSpeedChange, showPrev = true,
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Simulation controls */}
        <div className="flex items-center gap-2">
          {showPrev && (
            <Tooltip text="Previous Step">
              <button className="btn-secondary p-2" onClick={onPrev} disabled={!canPrev || isRunning}>
                <SkipBack size={16} />
              </button>
            </Tooltip>
          )}

          <Tooltip text="Next Step">
            <button className="btn-secondary p-2" onClick={onNext} disabled={!canNext || isRunning}>
              <SkipForward size={16} />
            </button>
          </Tooltip>

          {isRunning ? (
            <Tooltip text="Pause Auto-Run">
              <button className="btn-primary px-4" onClick={onPause}>
                <Pause size={16} /> Pause
              </button>
            </Tooltip>
          ) : (
            <Tooltip text="Auto-Run Simulation">
              <button className="btn-primary px-4" onClick={onStart} disabled={!hasResult && !onStart}>
                <Play size={16} /> Auto Run
              </button>
            </Tooltip>
          )}

          <Tooltip text="Reset">
            <button className="btn-danger p-2" onClick={onReset}>
              <RotateCcw size={16} />
            </button>
          </Tooltip>
        </div>

        {/* Speed slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[160px]">
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            Speed
          </span>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={2100 - speed}
            onChange={e => onSpeedChange(2100 - parseInt(e.target.value))}
            className="speed-slider flex-1"
            title={`${speed}ms per step`}
          />
          <span className="text-xs mono whitespace-nowrap" style={{ color: 'var(--accent-purple)' }}>
            {speed}ms
          </span>
        </div>
      </div>
    </div>
  );
}
