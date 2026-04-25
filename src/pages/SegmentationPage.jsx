import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, AlertTriangle, CheckCircle, Play, RefreshCw, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import SegmentTable from '../components/segmentation/SegmentTable';
import { useSegmentation } from '../hooks/useSegmentation';
import { InfoTooltip } from '../components/ui/Tooltip';

export default function SegmentationPage() {
  const {
    segments, selectedSegId, setSelectedSegId,
    offset, setOffset, accessResult, violationAnim,
    error, addSegment, removeSegment, updateSegment,
    accessMemory, reset, getColor,
  } = useSegmentation();

  const [newSeg, setNewSeg] = useState({ name: '', base: '', limit: '' });
  const [showAdd, setShowAdd] = useState(false);

  const maxMem = segments.reduce((acc, s) => Math.max(acc, s.base + s.limit), 0) + 200;

  const handleAdd = () => {
    if (!newSeg.name || !newSeg.base || !newSeg.limit) return;
    addSegment(newSeg.name, newSeg.base, newSeg.limit);
    setNewSeg({ name: '', base: '', limit: '' });
    setShowAdd(false);
  };

  const handleAccess = () => accessMemory(selectedSegId, offset);

  const COLORS_LIST = segments.map((_, i) => getColor(i));

  return (
    <div className="space-y-6">
      <Header
        title="Segmentation Visualization"
        subtitle="Visualize variable-sized memory segments with base/limit protection and access validation"
        icon={Layers}
        color="#fbbf24"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Segment Table */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm" style={{ color: 'var(--accent-yellow)' }}>
                Segments
                <InfoTooltip text="Click a segment to select it for access testing." />
              </h2>
              <div className="flex gap-2">
                <button className="btn-secondary py-1 px-2 text-xs" onClick={() => setShowAdd(!showAdd)}>
                  <Plus size={14} /> Add
                </button>
                <button className="btn-danger py-1 px-2 text-xs" onClick={reset}>
                  <RefreshCw size={14} /> Reset
                </button>
              </div>
            </div>

            <SegmentTable
              segments={segments}
              selectedSegId={selectedSegId}
              onSelect={setSelectedSegId}
              getColor={getColor}
            />

            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 overflow-hidden"
                >
                  <div className="text-xs font-bold" style={{ color: 'var(--accent-purple)' }}>New Segment</div>
                  <div className="grid grid-cols-3 gap-2">
                    <input className="input-field text-xs" placeholder="Name" value={newSeg.name}
                      onChange={e => setNewSeg(p => ({ ...p, name: e.target.value }))} />
                    <input type="number" className="input-field text-xs" placeholder="Base" value={newSeg.base}
                      onChange={e => setNewSeg(p => ({ ...p, base: e.target.value }))} />
                    <input type="number" className="input-field text-xs" placeholder="Limit" value={newSeg.limit}
                      onChange={e => setNewSeg(p => ({ ...p, limit: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 text-xs py-1.5" onClick={handleAdd}>Add Segment</button>
                    <button className="btn-secondary text-xs py-1.5 px-3" onClick={() => setShowAdd(false)}>Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Access Test */}
          <div className="glass-card p-5">
            <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-cyan)' }}>
              Memory Access Test
              <InfoTooltip text="Select a segment and enter an offset to test if the access is valid." />
            </h2>
            <div className="space-y-3">
              <div>
                <label className="label">Segment</label>
                <select
                  className="input-field"
                  value={selectedSegId}
                  onChange={e => setSelectedSegId(Number(e.target.value))}
                >
                  {segments.map((seg, idx) => (
                    <option key={seg.id} value={seg.id} style={{ background: 'var(--bg-secondary)' }}>
                      S{idx}: {seg.name} (base={seg.base}, limit={seg.limit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  Offset
                  <InfoTooltip text="Must be < Limit to avoid Segment Limit Violation." />
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input-field"
                    value={offset}
                    onChange={e => setOffset(e.target.value)}
                    placeholder="e.g. 100"
                    onKeyDown={e => e.key === 'Enter' && handleAccess()}
                  />
                  <button className="btn-primary flex-shrink-0" onClick={handleAccess}>
                    <Play size={15} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs p-3 rounded-lg"
                     style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--accent-red)' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <AnimatePresence>
                {accessResult && (
                  <motion.div
                    key={JSON.stringify(accessResult)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-4"
                    style={{
                      background: accessResult.valid ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                      border: `1px solid ${accessResult.valid ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    }}
                  >
                    {accessResult.valid ? (
                      <>
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />
                          <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>Access Granted</span>
                        </div>
                        <div className="text-xs mono" style={{ color: 'var(--text-secondary)' }}>
                          Physical Address = {accessResult.physicalAddress}
                        </div>
                        <div className="text-xs mono mt-1" style={{ color: 'var(--text-secondary)' }}>
                          = base({segments.find(s => s.id === accessResult.segId)?.base}) + offset({offset}) = <strong style={{ color: 'var(--accent-green)' }}>{accessResult.physicalAddress}</strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle size={14} style={{ color: 'var(--accent-red)' }} />
                          <span className="text-xs font-bold" style={{ color: 'var(--accent-red)' }}>Segment Limit Violation!</span>
                        </div>
                        <div className="text-xs" style={{ color: 'var(--accent-red)', opacity: 0.85 }}>
                          {accessResult.error}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Memory Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-yellow)' }}>
              Memory Layout
              <InfoTooltip text="Each segment block's width is proportional to its limit (size)." />
            </h2>

            {/* Memory bar */}
            <div
              className="relative rounded-xl overflow-hidden mb-4"
              style={{ background: 'rgba(0,0,0,0.2)', height: '40px', border: '1px solid var(--border-color)' }}
            >
              {segments.map((seg, idx) => {
                const color = getColor(idx);
                const leftPct = (seg.base / maxMem) * 100;
                const widthPct = (seg.limit / maxMem) * 100;
                return (
                  <motion.div
                    key={seg.id}
                    layout
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: '100%',
                      background: color.bg,
                      borderRight: `2px solid ${color.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ color: color.text, fontSize: '10px', fontWeight: 700 }}>{seg.name}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Segment Blocks */}
            <div className="space-y-3">
              <AnimatePresence>
                {segments.map((seg, idx) => {
                  const color = getColor(idx);
                  const isSelected = seg.id === selectedSegId;
                  const isViolation = violationAnim && accessResult?.segId === seg.id && !accessResult?.valid;
                  const isSuccess = accessResult?.segId === seg.id && accessResult?.valid;

                  return (
                    <motion.div
                      key={seg.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: isViolation ? [1, 1.02, 1, 1.02, 1] : 1,
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="rounded-xl p-4 cursor-pointer"
                      style={{
                        background: isViolation
                          ? 'rgba(248,113,113,0.12)'
                          : isSuccess
                          ? 'rgba(52,211,153,0.08)'
                          : color.bg,
                        border: `1px solid ${isViolation ? color.border.replace('0.5', '0.8') : isSuccess ? 'rgba(52,211,153,0.4)' : isSelected ? color.border : color.border.replace('0.5', '0.2')}`,
                        boxShadow: isViolation ? '0 0 20px rgba(248,113,113,0.3)' : isSelected ? `0 0 12px ${color.border}` : 'none',
                      }}
                      onClick={() => setSelectedSegId(seg.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: color.text }} />
                          <span className="font-bold text-sm">{seg.name}</span>
                          {isViolation && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="badge badge-fault"
                            >
                              ⚠ VIOLATION
                            </motion.span>
                          )}
                          {isSuccess && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="badge badge-hit"
                            >
                              ✓ VALID
                            </motion.span>
                          )}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); removeSegment(seg.id); }}
                          className="p-1 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--accent-red)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Inline editable fields */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Base', field: 'base', val: seg.base, color: 'var(--accent-blue)' },
                          { label: 'Limit', field: 'limit', val: seg.limit, color: 'var(--accent-yellow)' },
                          { label: 'End', field: null, val: seg.base + seg.limit - 1, color: 'var(--text-secondary)' },
                        ].map(({ label, field, val, color: c }) => (
                          <div key={label}>
                            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{label}</div>
                            {field ? (
                              <input
                                type="number"
                                className="w-full rounded-lg px-2 py-1 text-sm font-bold mono"
                                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: c, outline: 'none' }}
                                value={val}
                                onClick={e => e.stopPropagation()}
                                onChange={e => updateSegment(seg.id, field, e.target.value)}
                              />
                            ) : (
                              <div className="text-sm font-bold mono" style={{ color: c }}>{val}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Size bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                          <span>0</span>
                          <span>Used: {Math.min(parseInt(offset) || 0, seg.limit)} / {seg.limit}</span>
                          <span>{seg.limit}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          {accessResult?.segId === seg.id && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((parseInt(offset) || 0) / seg.limit * 100, 100)}%` }}
                              className="h-full rounded-full"
                              style={{ background: accessResult.valid ? 'var(--accent-green)' : 'var(--accent-red)' }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
