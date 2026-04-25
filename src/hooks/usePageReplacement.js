import { useState, useCallback, useRef } from 'react';
import { runFIFO } from '../utils/algorithms/fifo';
import { runLRU } from '../utils/algorithms/lru';
import { runOptimal } from '../utils/algorithms/optimal';

const ALGOS = { FIFO: runFIFO, LRU: runLRU, Optimal: runOptimal };

export function usePageReplacement() {
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [refString, setRefString] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1');
  const [frameCount, setFrameCount] = useState(3);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  const parseRefString = (str) => {
    const parts = str.trim().split(/[\s,]+/).filter(Boolean);
    const nums = parts.map(Number);
    if (nums.some(n => isNaN(n) || n < 0 || !Number.isInteger(n))) {
      return null;
    }
    return nums;
  };

  const simulate = useCallback((algo, refStr, frames) => {
    const pages = parseRefString(refStr);
    if (!pages || pages.length === 0) {
      setError('Invalid reference string. Use space/comma-separated non-negative integers.');
      return false;
    }
    const fc = parseInt(frames);
    if (isNaN(fc) || fc < 1 || fc > 10) {
      setError('Frame count must be between 1 and 10.');
      return false;
    }
    if (pages.length > 50) {
      setError('Reference string too long (max 50 entries).');
      return false;
    }
    setError('');
    const fn = ALGOS[algo] || runFIFO;
    const res = fn(pages, fc);
    setResult(res);
    setCurrentStep(0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    return true;
  }, []);

  const nextStep = useCallback(() => {
    if (!result) return;
    setCurrentStep(prev => Math.min(prev + 1, result.history.length - 1));
  }, [result]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const autoRun = useCallback((spd) => {
    if (!result) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= result.history.length - 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, spd || speed);
  }, [result, speed]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    pause();
    setResult(null);
    setCurrentStep(-1);
    setError('');
  }, [pause]);

  const jumpToStep = useCallback((step) => {
    if (!result) return;
    setCurrentStep(Math.min(Math.max(0, step), result.history.length - 1));
  }, [result]);

  return {
    algorithm,
    setAlgorithm,
    refString,
    setRefString,
    frameCount,
    setFrameCount,
    result,
    currentStep,
    isRunning,
    speed,
    setSpeed,
    error,
    simulate,
    nextStep,
    prevStep,
    autoRun,
    pause,
    reset,
    jumpToStep,
    currentEntry: result ? result.history[currentStep] : null,
  };
}
