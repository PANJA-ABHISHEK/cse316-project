/**
 * Optimal Page Replacement Algorithm
 * Replaces page that won't be used for the longest time in future
 */
export function runOptimal(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  let faults = 0;
  let hits = 0;

  function getNextUse(page, fromIndex) {
    for (let j = fromIndex + 1; j < referenceString.length; j++) {
      if (referenceString[j] === page) return j;
    }
    return Infinity; // never used again
  }

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
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
        replacedIndex = emptyIndex;
      } else {
        // Find page used farthest in future
        let farthest = -1;
        for (let j = 0; j < frames.length; j++) {
          const nextUse = getNextUse(frames[j], i);
          if (nextUse > farthest) {
            farthest = nextUse;
            replacedIndex = j;
            replacedPage = frames[j];
          }
        }
        frames[replacedIndex] = page;
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
