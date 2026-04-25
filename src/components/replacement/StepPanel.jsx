import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const ALGO_DESCRIPTIONS = {
  FIFO: {
    name: 'FIFO - First In, First Out',
    desc: 'The oldest page in memory is replaced first. Simple but not always optimal.',
    color: 'var(--accent-blue)',
  },
  LRU: {
    name: 'LRU - Least Recently Used',
    desc: 'The page that has not been used for the longest time is replaced.',
    color: 'var(--accent-purple)',
  },
  Optimal: {
    name: 'Optimal - Belady\'s Algorithm',
    desc: 'Replace the page that won\'t be used for the longest time in the future. Theoretical minimum faults.',
    color: 'var(--accent-cyan)',
  },
};

export default function StepPanel({ entry, algorithm, stepIndex, totalSteps }) {
  if (!entry) return null;
  const isFault = entry.type === 'fault';
  const algo = ALGO_DESCRIPTIONS[algorithm] || ALGO_DESCRIPTIONS.FIFO;

  return (
    <motion.div
      key={stepIndex}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3"
    >
      {/* Step header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isFault
            ? <AlertCircle size={18} style={{ color: 'var(--accent-red)' }} />
            : <CheckCircle2 size={18} style={{ color: 'var(--accent-green)' }} />
          }
          <span className="font-bold text-sm">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </div>
        <span className={`badge ${isFault ? 'badge-fault' : 'badge-hit'}`}>
          {isFault ? 'PAGE FAULT' : 'PAGE HIT'}
        </span>
      </div>

      {/* Explanation */}
      <div
        className="rounded-lg p-3 text-sm"
        style={{
          background: isFault ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)',
          border: `1px solid ${isFault ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`,
        }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>
          Reference: {' '}
        </span>
        <strong style={{ color: isFault ? 'var(--accent-red)' : 'var(--accent-green)' }}>
          Page {entry.page}
        </strong>
        {isFault && entry.replacedPage !== null && (
          <span style={{ color: 'var(--text-secondary)' }}>
            {' '}→ Replaced <strong style={{ color: 'var(--accent-red)' }}>Page {entry.replacedPage}</strong> in Frame {entry.replacedIndex}
          </span>
        )}
        {isFault && entry.replacedPage === null && entry.replacedIndex >= 0 && (
          <span style={{ color: 'var(--text-secondary)' }}>
            {' '}→ Loaded into empty Frame {entry.replacedIndex}
          </span>
        )}
        {!isFault && (
          <span style={{ color: 'var(--text-secondary)' }}>
            {' '}is already in memory — no replacement needed.
          </span>
        )}
      </div>

      {/* Algorithm tip */}
      <div className="flex gap-2 items-start">
        <Info size={14} style={{ color: algo.color, flexShrink: 0, marginTop: 2 }} />
        <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: algo.color }}>{algorithm}:</strong> {algo.desc}
        </p>
      </div>

      {/* Running counters */}
      <div className="flex gap-4 pt-1">
        <div className="text-xs">
          <span style={{ color: 'var(--text-secondary)' }}>Faults so far: </span>
          <strong style={{ color: 'var(--accent-red)' }}>{entry.faults}</strong>
        </div>
        <div className="text-xs">
          <span style={{ color: 'var(--text-secondary)' }}>Hits so far: </span>
          <strong style={{ color: 'var(--accent-green)' }}>{entry.hits}</strong>
        </div>
      </div>
    </motion.div>
  );
}
