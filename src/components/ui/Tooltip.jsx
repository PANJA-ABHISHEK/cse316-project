import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="tooltip-container"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="tooltip-box"
            style={{ maxWidth: 220, whiteSpace: 'normal', textAlign: 'center' }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export function InfoTooltip({ text }) {
  return (
    <Tooltip text={text}>
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-xs cursor-help font-bold ml-1"
        style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--accent-purple)', fontSize: '10px' }}
      >
        ?
      </span>
    </Tooltip>
  );
}
