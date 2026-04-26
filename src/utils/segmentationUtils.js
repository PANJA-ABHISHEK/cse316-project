/**
 * Segmentation utility functions
 * Provides segment access validation, overlap detection,
 * and color palette generation for segment visualization.
 */

/**
 * Validates a segment access
 * @param {number} base
 * @param {number} limit
 * @param {number} offset
 * @returns {{ valid, physicalAddress, error }}
 */
export function accessSegment(base, limit, offset) {
  if (offset < 0) {
    return { valid: false, physicalAddress: null, error: 'Offset must be non-negative' };
  }
  if (offset >= limit) {
    return {
      valid: false,
      physicalAddress: null,
      error: `Segment Limit Violation! Offset ${offset} >= Limit ${limit}`,
    };
  }
  return {
    valid: true,
    physicalAddress: base + offset,
    error: null,
  };
}

/**
 * Checks if segments overlap in memory
 */
export function checkOverlap(segments) {
  const sorted = [...segments].sort((a, b) => a.base - b.base);
  const overlaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (prev.base + prev.limit > curr.base) {
      overlaps.push({ a: prev.name, b: curr.name });
    }
  }
  return overlaps;
}

/**
 * Generate color palette for segments
 */
export const SEGMENT_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.5)', text: '#818cf8', name: 'Indigo' },
  { bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.5)', text: '#34d399', name: 'Green' },
  { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.5)', text: '#fbbf24', name: 'Yellow' },
  { bg: 'rgba(244, 114, 182, 0.15)', border: 'rgba(244, 114, 182, 0.5)', text: '#f472b6', name: 'Pink' },
  { bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.5)', text: '#22d3ee', name: 'Cyan' },
  { bg: 'rgba(248, 113, 113, 0.15)', border: 'rgba(248, 113, 113, 0.5)', text: '#f87171', name: 'Red' },
];
