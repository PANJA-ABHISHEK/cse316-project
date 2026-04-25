/**
 * Paging utility functions
 */

/**
 * Translate a logical address to physical address
 * @param {number} logicalAddress
 * @param {number} pageSize
 * @param {Array} pageTable - array of frame numbers (index = page number)
 * @returns {{ pageNumber, offset, frameNumber, physicalAddress, valid }}
 */
export function translateAddress(logicalAddress, pageSize, pageTable) {
  const pageNumber = Math.floor(logicalAddress / pageSize);
  const offset = logicalAddress % pageSize;

  if (pageNumber >= pageTable.length) {
    return {
      pageNumber,
      offset,
      frameNumber: null,
      physicalAddress: null,
      valid: false,
      error: `Page ${pageNumber} out of range (max: ${pageTable.length - 1})`,
    };
  }

  const frameNumber = pageTable[pageNumber];
  if (frameNumber === null || frameNumber === undefined) {
    return {
      pageNumber,
      offset,
      frameNumber: null,
      physicalAddress: null,
      valid: false,
      error: `Page ${pageNumber} not loaded in memory`,
    };
  }

  const physicalAddress = frameNumber * pageSize + offset;
  return {
    pageNumber,
    offset,
    frameNumber,
    physicalAddress,
    valid: true,
    error: null,
  };
}

/**
 * Generate initial page table given number of pages and number of frames
 * Maps pages to frames; some pages may not be loaded
 */
export function generatePageTable(numPages, numFrames) {
  const table = [];
  const usedFrames = new Set();
  for (let i = 0; i < numPages; i++) {
    if (usedFrames.size < numFrames) {
      let frame = i; // simple sequential assignment
      if (frame < numFrames) {
        usedFrames.add(frame);
        table.push(frame);
      } else {
        table.push(null);
      }
    } else {
      table.push(null);
    }
  }
  return table;
}

/**
 * Get all logical addresses for demo translation
 */
export function getAllAddresses(totalMemory, pageSize, pageTable) {
  const addresses = [];
  for (let addr = 0; addr < totalMemory; addr += Math.floor(pageSize / 2)) {
    addresses.push(translateAddress(addr, pageSize, pageTable));
  }
  return addresses.slice(0, 12);
}

/**
 * Calculate number of pages needed
 */
export function calcPages(memSize, pageSize) {
  return Math.ceil(memSize / pageSize);
}
