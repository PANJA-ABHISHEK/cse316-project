import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, color = 'var(--accent-purple)' }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const diff = end - start;
    const duration = 600;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((start + diff * eased).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
      else prevRef.current = end;
    };

    requestAnimationFrame(step);
  }, [value, decimals]);

  return (
    <motion.span
      key={value}
      initial={{ scale: 1.2, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}
    >
      {prefix}{decimals > 0 ? display.toFixed(decimals) : display}{suffix}
    </motion.span>
  );
}
