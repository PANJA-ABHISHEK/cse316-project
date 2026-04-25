import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowRight, AlertCircle, RefreshCw, Play } from 'lucide-react';
import Header from '../components/layout/Header';
import PageTable from '../components/paging/PageTable';
import FrameGrid from '../components/paging/FrameGrid';
import { usePaging } from '../hooks/usePaging';
import { calcPages } from '../utils/pagingUtils';
import { InfoTooltip } from '../components/ui/Tooltip';

export default function PagingPage() {
  const {
    config, pageTable, logicalAddr, setLogicalAddr,
    translation, error, simulate, translate, reset, numPages,
  } = usePaging();

  const [formConfig, setFormConfig] = useState({ memSize: 64, pageSize: 8, numFrames: 4 });

  const handleSimulate = () => simulate(formConfig);

  return (
    <div className="space-y-6">
      <Header
        title="Paging Visualization"
        subtitle="Explore logical-to-physical address translation with animated frame allocation"
        icon={Cpu}
        color="#818cf8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-purple)' }}>
              Configuration
              <InfoTooltip text="Set up memory parameters to generate the page table and frame layout." />
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Memory Size (bytes)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formConfig.memSize}
                  onChange={e => setFormConfig(p => ({ ...p, memSize: parseInt(e.target.value) || 0 }))}
                  min="1" placeholder="e.g. 64"
                />
              </div>
              <div>
                <label className="label">
                  Page Size (bytes)
                  <InfoTooltip text="Each page and frame is this many bytes." />
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formConfig.pageSize}
                  onChange={e => setFormConfig(p => ({ ...p, pageSize: parseInt(e.target.value) || 0 }))}
                  min="1" placeholder="e.g. 8"
                />
              </div>
              <div>
                <label className="label">
                  Number of Frames
                  <InfoTooltip text="Total physical memory frames available." />
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formConfig.numFrames}
                  onChange={e => setFormConfig(p => ({ ...p, numFrames: parseInt(e.target.value) || 0 }))}
                  min="1" placeholder="e.g. 4"
                />
              </div>

              {/* Preview stats */}
              <div
                className="rounded-lg p-3 text-xs space-y-1.5"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
              >
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Number of Pages:</span>
                  <span className="mono font-bold" style={{ color: 'var(--accent-blue)' }}>
                    {formConfig.memSize > 0 && formConfig.pageSize > 0 ? calcPages(formConfig.memSize, formConfig.pageSize) : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Offset bits:</span>
                  <span className="mono font-bold" style={{ color: 'var(--accent-purple)' }}>
                    {formConfig.pageSize > 0 ? Math.ceil(Math.log2(formConfig.pageSize)) : '—'}
                  </span>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 text-xs p-3 rounded-lg"
                  style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--accent-red)' }}
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}

              <div className="flex gap-2">
                <button className="btn-primary flex-1" onClick={handleSimulate}>
                  <Play size={15} /> Simulate
                </button>
                <button className="btn-danger p-2.5" onClick={reset} title="Reset">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Address Translator */}
          {pageTable && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-cyan)' }}>
                Address Translator
                <InfoTooltip text="Enter a logical address to see its physical address translation." />
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="label">Logical Address</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="input-field"
                      value={logicalAddr}
                      onChange={e => setLogicalAddr(e.target.value)}
                      placeholder={`0 – ${config.memSize - 1}`}
                      onKeyDown={e => e.key === 'Enter' && translate(logicalAddr, pageTable, config)}
                    />
                    <button
                      className="btn-primary flex-shrink-0"
                      onClick={() => translate(logicalAddr, pageTable, config)}
                    >
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {translation && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl p-4 space-y-2"
                      style={{
                        background: translation.valid ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                        border: `1px solid ${translation.valid ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                      }}
                    >
                      {translation.valid ? (
                        <>
                          <div className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>✓ Translation Successful</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {[
                              ['Page #', `P${translation.pageNumber}`, 'var(--accent-blue)'],
                              ['Offset', translation.offset, 'var(--accent-yellow)'],
                              ['Frame #', `F${translation.frameNumber}`, 'var(--accent-purple)'],
                              ['Physical Addr', translation.physicalAddress, 'var(--accent-green)'],
                            ].map(([label, val, color]) => (
                              <div key={label}>
                                <div style={{ color: 'var(--text-secondary)' }}>{label}</div>
                                <div className="mono font-black text-base" style={{ color }}>{val}</div>
                              </div>
                            ))}
                          </div>
                          {/* Formula visualization */}
                          <div
                            className="text-xs p-2 rounded-lg mono"
                            style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}
                          >
                            PA = F{translation.frameNumber} × {config.pageSize} + {translation.offset} = <strong style={{ color: 'var(--accent-green)' }}>{translation.physicalAddress}</strong>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs" style={{ color: 'var(--accent-red)' }}>
                          <AlertCircle size={14} className="inline mr-1" />
                          {translation.error}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>

        {/* Visualization */}
        <div className="lg:col-span-2 space-y-4">
          {pageTable ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5"
              >
                <FrameGrid
                  pageTable={pageTable}
                  numFrames={config.numFrames}
                  pageSize={config.pageSize}
                  highlightFrame={translation?.frameNumber ?? -1}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5"
              >
                <PageTable pageTable={pageTable} pageSize={config.pageSize} config={config} />
              </motion.div>
            </>
          ) : (
            <div
              className="glass-card flex flex-col items-center justify-center text-center p-16 min-h-[300px]"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <Cpu size={32} style={{ color: 'var(--accent-purple)', opacity: 0.5 }} />
              </div>
              <div className="font-bold text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
                Configure & Simulate
              </div>
              <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                Set memory size, page size, and frame count, then click Simulate to visualize paging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
