import { motion } from 'framer-motion';
import { InfoTooltip } from '../ui/Tooltip';

export default function FrameGrid({ pageTable, numFrames, pageSize, highlightFrame = -1 }) {
  // Build frame -> pages mapping
  const frames = Array.from({ length: numFrames }, (_, i) => {
    const pages = pageTable
      ? pageTable
          .map((frame, pageIdx) => (frame === i ? pageIdx : null))
          .filter(p => p !== null)
      : [];
    return { frameIdx: i, pages };
  });

  const frameColors = [
    'rgba(99,102,241,0.15)',
    'rgba(52,211,153,0.15)',
    'rgba(251,191,36,0.15)',
    'rgba(244,114,182,0.15)',
    'rgba(34,211,238,0.15)',
    'rgba(248,113,113,0.15)',
    'rgba(167,139,250,0.15)',
    'rgba(251,146,60,0.15)',
  ];
  const frameBorders = [
    'rgba(99,102,241,0.4)',
    'rgba(52,211,153,0.4)',
    'rgba(251,191,36,0.4)',
    'rgba(244,114,182,0.4)',
    'rgba(34,211,238,0.4)',
    'rgba(248,113,113,0.4)',
    'rgba(167,139,250,0.4)',
    'rgba(251,146,60,0.4)',
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-sm" style={{ color: 'var(--accent-cyan)' }}>Physical Memory Frames</h3>
        <InfoTooltip text="Each block represents a physical memory frame. Pages are loaded into these frames." />
      </div>

      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          padding: '12px',
        }}
      >
        {/* Memory bar visualization */}
        <div className="flex rounded-lg overflow-hidden mb-4 h-8">
          {frames.map(({ frameIdx, pages }) => (
            <div
              key={frameIdx}
              className="flex-1 flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: pages.length > 0
                  ? frameColors[frameIdx % frameColors.length]
                  : 'rgba(100,100,100,0.1)',
                borderRight: frameIdx < numFrames - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                color: pages.length > 0 ? frameBorders[frameIdx % frameBorders.length] : 'rgba(150,150,150,0.4)',
              }}
            >
              F{frameIdx}
            </div>
          ))}
        </div>

        {/* Frame Cards */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(110px, 1fr))` }}>
          {frames.map(({ frameIdx, pages }) => (
            <motion.div
              key={frameIdx}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: frameIdx * 0.05 }}
              className="frame-block flex flex-col items-center justify-center gap-1 p-3 rounded-xl"
              style={{
                background: pages.length > 0 ? frameColors[frameIdx % frameColors.length] : 'rgba(100,100,100,0.05)',
                border: `1px solid ${pages.length > 0 ? frameBorders[frameIdx % frameBorders.length] : 'rgba(100,100,100,0.15)'}`,
                ...(highlightFrame === frameIdx ? {
                  boxShadow: `0 0 20px ${frameBorders[frameIdx % frameBorders.length]}`,
                } : {}),
              }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                Frame {frameIdx}
              </div>
              <div className="font-black text-base mono" style={{ color: pages.length > 0 ? frameBorders[frameIdx % frameBorders.length] : 'var(--text-secondary)' }}>
                {pages.length > 0 ? `P${pages[0]}` : '—'}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {pages.length > 0 ? `${frameIdx * pageSize}–${(frameIdx + 1) * pageSize - 1}` : 'Empty'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
