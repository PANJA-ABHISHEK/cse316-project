import { useState, useCallback } from 'react';
import { translateAddress, generatePageTable, calcPages } from '../utils/pagingUtils';

const DEFAULT = {
  memSize: 64,
  pageSize: 8,
  numFrames: 4,
};

export function usePaging() {
  const [config, setConfig] = useState(DEFAULT);
  const [pageTable, setPageTable] = useState(null);
  const [logicalAddr, setLogicalAddr] = useState('');
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState('');
  const [animStep, setAnimStep] = useState(-1);

  const validate = (cfg) => {
    if (cfg.pageSize <= 0) return 'Page size must be > 0';
    if (cfg.numFrames <= 0) return 'Number of frames must be > 0';
    if (cfg.memSize <= 0) return 'Memory size must be > 0';
    if (cfg.pageSize > cfg.memSize) return 'Page size cannot exceed memory size';
    const numPages = calcPages(cfg.memSize, cfg.pageSize);
    if (numPages > 64) return 'Too many pages (max 64)';
    if (cfg.numFrames > numPages) return `Frames (${cfg.numFrames}) cannot exceed pages (${numPages})`;
    return null;
  };

  const simulate = useCallback((cfg) => {
    const err = validate(cfg);
    if (err) { setError(err); return; }
    setError('');
    const numPages = calcPages(cfg.memSize, cfg.pageSize);
    const table = generatePageTable(numPages, cfg.numFrames);
    setPageTable(table);
    setConfig(cfg);
    setTranslation(null);
    setAnimStep(0);
    setTimeout(() => setAnimStep(1), 300);
  }, []);

  const translate = useCallback((addr, table, cfg) => {
    const num = parseInt(addr, 10);
    if (isNaN(num) || num < 0) {
      setError('Enter a valid non-negative integer address');
      return;
    }
    if (num >= cfg.memSize) {
      setError(`Address ${num} exceeds memory size ${cfg.memSize}`);
      return;
    }
    setError('');
    setTranslation(translateAddress(num, cfg.pageSize, table));
  }, []);

  const reset = useCallback(() => {
    setPageTable(null);
    setTranslation(null);
    setError('');
    setConfig(DEFAULT);
    setAnimStep(-1);
  }, []);

  return {
    config,
    pageTable,
    logicalAddr,
    setLogicalAddr,
    translation,
    error,
    animStep,
    simulate,
    translate,
    reset,
    numPages: pageTable ? pageTable.length : 0,
  };
}
