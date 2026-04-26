/**
 * Custom hook for managing segmentation simulation state.
 * Handles segment CRUD, memory access validation, and violation detection.
 */
import { useState, useCallback } from 'react';
import { accessSegment, SEGMENT_COLORS } from '../utils/segmentationUtils';

const DEFAULT_SEGMENTS = [
  { id: 1, name: 'Code', base: 0, limit: 600 },
  { id: 2, name: 'Data', base: 1000, limit: 400 },
  { id: 3, name: 'Stack', base: 2000, limit: 300 },
];

export function useSegmentation() {
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [selectedSegId, setSelectedSegId] = useState(1);
  const [offset, setOffset] = useState('');
  const [accessResult, setAccessResult] = useState(null);
  const [violationAnim, setViolationAnim] = useState(false);
  const [error, setError] = useState('');

  const addSegment = useCallback((name, base, limit) => {
    const id = Date.now();
    setSegments(prev => [...prev, { id, name, base: parseInt(base), limit: parseInt(limit) }]);
  }, []);

  const removeSegment = useCallback((id) => {
    setSegments(prev => prev.filter(s => s.id !== id));
    setAccessResult(null);
  }, []);

  const updateSegment = useCallback((id, field, value) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, [field]: field === 'name' ? value : parseInt(value) || 0 } : s));
  }, []);

  const accessMemory = useCallback((segId, off) => {
    const seg = segments.find(s => s.id === segId);
    if (!seg) return;
    const offsetNum = parseInt(off, 10);
    if (isNaN(offsetNum)) {
      setError('Enter a valid offset integer');
      return;
    }
    setError('');
    const result = accessSegment(seg.base, seg.limit, offsetNum);
    setAccessResult({ ...result, segmentName: seg.name, segId });
    if (!result.valid) {
      setViolationAnim(true);
      setTimeout(() => setViolationAnim(false), 1500);
    }
  }, [segments]);

  const reset = useCallback(() => {
    setSegments(DEFAULT_SEGMENTS);
    setAccessResult(null);
    setViolationAnim(false);
    setError('');
    setOffset('');
  }, []);

  const getColor = (index) => SEGMENT_COLORS[index % SEGMENT_COLORS.length];

  return {
    segments,
    selectedSegId,
    setSelectedSegId,
    offset,
    setOffset,
    accessResult,
    violationAnim,
    error,
    setError,
    addSegment,
    removeSegment,
    updateSegment,
    accessMemory,
    reset,
    getColor,
  };
}
