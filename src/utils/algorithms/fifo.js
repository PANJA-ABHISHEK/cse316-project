/**
 * FIFO Page Replacement Algorithm
 * Returns full simulation history with frame snapshots at each step
 */
export function runFIFO(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  let queue = []; // tracks insertion order
  let faults = 0;
  let hits = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const framesCopy = [...frames];
    const isHit = frames.includes(page);

    if (isHit) {
      hits++;
      history.push({
        step: i,
        page,
        frames: [...frames],
        type: 'hit',
        replacedPage: null,
        replacedIndex: -1,
        faults,
        hits,
      });
    } else {
      faults++;
      let replacedPage = null;
      let replacedIndex = -1;

      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        queue.push({ page, index: emptyIndex });
        replacedIndex = emptyIndex;
      } else {
        // Evict the oldest
        const oldest = queue.shift();
        replacedPage = oldest.page;
        replacedIndex = oldest.index;
        frames[oldest.index] = page;
        queue.push({ page, index: oldest.index });
      }

      history.push({
        step: i,
        page,
        frames: [...frames],
        type: 'fault',
        replacedPage,
        replacedIndex,
        faults,
        hits,
      });
    }
  }

  return {
    history,
    totalFaults: faults,
    totalHits: hits,
    hitRatio: hits / referenceString.length,
    missRatio: faults / referenceString.length,
  };
}
