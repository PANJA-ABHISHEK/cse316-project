import { motion, AnimatePresence } from 'framer-motion';

export default function FrameRow({ frames, replacedIndex, type, label, frameCount }) {
  const displayFrames = Array.from({ length: frameCount }, (_, i) => frames[i] ?? null);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <div
          className="text-xs font-bold w-16 flex-shrink-0 mono text-right"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {displayFrames.map((page, idx) => {
          const isReplaced = idx === replacedIndex && type === 'fault';
          const isEmpty = page === null;

          return (
            <motion.div
              key={idx}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: isReplaced
                  ? '0 0 16px rgba(248,113,113,0.5)'
                  : type === 'hit' && page !== null
                  ? '0 0 12px rgba(52,211,153,0.3)'
                  : 'none',
              }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base mono"
              style={{
                background: isEmpty
                  ? 'rgba(100,100,100,0.08)'
                  : isReplaced
                  ? 'rgba(248,113,113,0.15)'
                  : type === 'hit' && idx < frames.filter(f => f !== null).length
                  ? 'rgba(52,211,153,0.12)'
                  : 'rgba(99,102,241,0.12)',
                border: isEmpty
                  ? '1px solid rgba(100,100,100,0.15)'
                  : isReplaced
                  ? '1px solid rgba(248,113,113,0.5)'
                  : type === 'hit'
                  ? '1px solid rgba(52,211,153,0.4)'
                  : '1px solid rgba(99,102,241,0.35)',
                color: isEmpty
                  ? 'rgba(100,100,100,0.3)'
                  : isReplaced
                  ? 'var(--accent-red)'
                  : type === 'hit'
                  ? 'var(--accent-green)'
                  : 'var(--accent-purple)',
              }}
            >
              {isEmpty ? '—' : page}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
