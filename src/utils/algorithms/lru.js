/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 */
export function runLRU(referenceString, frameCount) {
  const frames = new Array(frameCount).fill(null);
  const history = [];
  let recentUse = []; // tracks recency, index 0 = least recently used
  let faults = 0;
  let hits = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const isHit = frames.includes(page);

    if (isHit) {
      hits++;
      // Update recency: move this page to the end (most recently used)
      recentUse = recentUse.filter(p => p !== page);
      recentUse.push(page);

      history.push({
        step: i,
        page,
        frames: [...frames],
        type: 'hit',
        replacedPage: null,
        replacedIndex: -1,
        faults,
        hits,
        recentUse: [...recentUse],
      });
    } else {
      faults++;
      let replacedPage = null;
      let replacedIndex = -1;

      const emptyIndex = frames.indexOf(null);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        recentUse.push(page);
        replacedIndex = emptyIndex;
      } else {
        // Find LRU page: the one least recently used
        const lruPage = recentUse[0];
        replacedIndex = frames.indexOf(lruPage);
        replacedPage = lruPage;
        frames[replacedIndex] = page;
        recentUse.shift();
        recentUse.push(page);
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
        recentUse: [...recentUse],
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
