import { motion } from 'framer-motion';
import { RefreshCw, Play, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import FrameRow from '../components/replacement/FrameRow';
import StepPanel from '../components/replacement/StepPanel';
import ControlPanel from '../components/ui/ControlPanel';
import StatsDashboard from '../components/dashboard/StatsDashboard';
import { usePageReplacement } from '../hooks/usePageReplacement';
import { InfoTooltip } from '../components/ui/Tooltip';

const ALGOS = ['FIFO', 'LRU', 'Optimal'];

const SAMPLE_INPUTS = [
  { label: 'Classic Test', ref: '7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1', frames: 3 },
  { label: 'Belady Anomaly', ref: '1 2 3 4 1 2 5 1 2 3 4 5', frames: 3 },
  { label: 'Simple Demo', ref: '2 3 2 1 5 2 4 5 3 2 5 2', frames: 4 },
];

export default function PageReplacementPage() {
  const {
    algorithm, setAlgorithm,
    refString, setRefString,
    frameCount, setFrameCount,
    result, currentStep, isRunning,
    speed, setSpeed, error,
    simulate, nextStep, prevStep, autoRun, pause, reset, jumpToStep,
    currentEntry,
  } = usePageReplacement();

  const handleSimulate = () => simulate(algorithm, refString, frameCount);

  const handleAutoRun = () => {
    if (result && currentStep < result.history.length - 1) {
      autoRun(speed);
    } else {
      handleSimulate();
      setTimeout(() => autoRun(speed), 200);
    }
  };



  return (
    <div className="space-y-6">
      <Header
        title="Page Replacement Algorithms"
        subtitle="Step-by-step simulation of FIFO, LRU, and Optimal page replacement"
        icon={RefreshCw}
        color="#22d3ee"
      />

      {/* Config */}
      <div className="glass-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="label">
              Reference String
              <InfoTooltip text="Enter page numbers separated by spaces or commas." />
            </label>
            <input
              className="input-field mono"
              value={refString}
              onChange={e => setRefString(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4 2 3"
            />
          </div>
          <div>
            <label className="label">Frames (1-10)</label>
            <input
              type="number"
              className="input-field"
              value={frameCount}
              onChange={e => setFrameCount(e.target.value)}
              min="1" max="10"
            />
          </div>
        </div>

        {/* Algorithm selector */}
        <div className="mb-4">
          <label className="label">Algorithm</label>
          <div className="flex gap-2 flex-wrap">
            {ALGOS.map(algo => (
              <button
                key={algo}
                onClick={() => { setAlgorithm(algo); reset(); }}
                className={algorithm === algo ? 'btn-primary' : 'btn-secondary'}
                style={algorithm === algo ? {} : {}}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Quick samples */}
        <div className="mb-4">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Quick Samples:</div>
          <div className="flex gap-2 flex-wrap">
            {SAMPLE_INPUTS.map(s => (
              <button
                key={s.label}
                className="btn-secondary py-1 px-3 text-xs"
                onClick={() => { setRefString(s.ref); setFrameCount(s.frames); reset(); }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm mb-3 p-3 rounded-lg"
               style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--accent-red)' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleSimulate}>
          <Play size={16} /> Run Simulation
        </button>
      </div>

      {result && (
        <>
          {/* Simulation Controls */}
          <ControlPanel
            onStart={handleAutoRun}
            onPause={pause}
            onReset={() => { reset(); }}
            onNext={nextStep}
            onPrev={prevStep}
            isRunning={isRunning}
            canNext={result && currentStep < result.history.length - 1}
            canPrev={currentStep > 0}
            hasResult={!!result}
            speed={speed}
            onSpeedChange={setSpeed}
            showPrev={true}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reference string timeline */}
            <div className="lg:col-span-2 space-y-4">
              {/* Reference string visual */}
              <div className="glass-card p-4">
                <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  REFERENCE STRING — Step {currentStep + 1} / {result.history.length}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.history.map((entry, i) => (
                    <motion.button
                      key={i}
                      onClick={() => jumpToStep(i)}
                      animate={{
                        scale: i === currentStep ? 1.25 : 1,
                        opacity: i > currentStep ? 0.3 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black mono"
                      style={{
                        background: i === currentStep
                          ? (entry.type === 'fault' ? 'rgba(248,113,113,0.25)' : 'rgba(52,211,153,0.2)')
                          : i < currentStep
                          ? (entry.type === 'fault' ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.06)')
                          : 'rgba(100,100,100,0.08)',
                        border: i === currentStep
                          ? (entry.type === 'fault' ? '2px solid var(--accent-red)' : '2px solid var(--accent-green)')
                          : '1px solid rgba(100,100,100,0.15)',
                        color: i === currentStep
                          ? (entry.type === 'fault' ? 'var(--accent-red)' : 'var(--accent-green)')
                          : i < currentStep
                          ? (entry.type === 'fault' ? 'rgba(248,113,113,0.6)' : 'rgba(52,211,153,0.6)')
                          : 'var(--text-secondary)',
                        cursor: 'default',
                      }}
                    >
                      {entry.page}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Frame state grid across steps */}
              <div className="glass-card p-4 overflow-x-auto">
                <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  FRAME STATE HISTORY
                </div>
                <div className="space-y-2 min-w-max">
                  {Array.from({ length: parseInt(frameCount) }, (_, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <div className="w-14 text-xs font-bold flex-shrink-0 text-right" style={{ color: 'var(--text-secondary)' }}>
                        Frame {fi}
                      </div>
                      <div className="flex gap-1">
                        {result.history.map((entry, si) => {
                          const page = entry.frames[fi];
                          const isCurrentCol = si === currentStep;
                          const isReplaced = si === currentStep && entry.replacedIndex === fi && entry.type === 'fault';
                          return (
                            <motion.div
                              key={si}
                              animate={{ opacity: si > currentStep ? 0.2 : 1 }}
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black mono flex-shrink-0"
                              style={{
                                background: page === null
                                  ? 'rgba(100,100,100,0.06)'
                                  : isReplaced
                                  ? 'rgba(248,113,113,0.2)'
                                  : isCurrentCol && entry.type === 'hit'
                                  ? 'rgba(52,211,153,0.15)'
                                  : 'rgba(99,102,241,0.1)',
                                border: page === null
                                  ? '1px solid rgba(100,100,100,0.1)'
                                  : isReplaced
                                  ? '1px solid rgba(248,113,113,0.5)'
                                  : isCurrentCol
                                  ? '1px solid rgba(99,102,241,0.5)'
                                  : '1px solid rgba(99,102,241,0.15)',
                                color: page === null ? 'rgba(100,100,100,0.3)'
                                  : isReplaced ? 'var(--accent-red)'
                                  : isCurrentCol && entry.type === 'hit' ? 'var(--accent-green)'
                                  : 'var(--accent-purple)',
                              }}
                            >
                              {page ?? '—'}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* F/H row */}
                  <div className="flex items-center gap-2">
                    <div className="w-14 text-xs font-bold flex-shrink-0 text-right" style={{ color: 'var(--text-secondary)' }}>
                      Result
                    </div>
                    <div className="flex gap-1">
                      {result.history.map((entry, si) => (
                        <motion.div
                          key={si}
                          animate={{ opacity: si > currentStep ? 0.2 : 1 }}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{
                            background: entry.type === 'fault' ? 'rgba(248,113,113,0.12)' : 'rgba(52,211,153,0.1)',
                            border: `1px solid ${entry.type === 'fault' ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.25)'}`,
                            color: entry.type === 'fault' ? 'var(--accent-red)' : 'var(--accent-green)',
                          }}
                        >
                          {entry.type === 'fault' ? 'F' : 'H'}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Step Panel + Current Frames */}
            <div className="space-y-4">
              <StepPanel
                entry={currentEntry}
                algorithm={algorithm}
                stepIndex={currentStep}
                totalSteps={result.history.length}
              />

              {currentEntry && (
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                    CURRENT FRAME STATE
                  </div>
                  <FrameRow
                    frames={currentEntry.frames}
                    replacedIndex={currentEntry.replacedIndex}
                    type={currentEntry.type}
                    frameCount={parseInt(frameCount)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Dashboard */}
          <StatsDashboard
            result={result}
            algorithm={algorithm}
            frameCount={parseInt(frameCount)}
          />
        </>
      )}
    </div>
  );
}
