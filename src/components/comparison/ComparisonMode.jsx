import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { runFIFO } from '../../utils/algorithms/fifo';
import { runLRU } from '../../utils/algorithms/lru';
import { runOptimal } from '../../utils/algorithms/optimal';
import { AlertCircle, GitCompare, TrendingUp } from 'lucide-react';
import FrameRow from '../replacement/FrameRow';
import AnimatedCounter from '../ui/AnimatedCounter';

const ALGO_COLORS = {
  FIFO: '#60a5fa',
  LRU: '#818cf8',
  Optimal: '#22d3ee',
};

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-xs" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
        <div className="font-bold mb-2">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
            <strong>{typeof p.value === 'number' ? p.value.toFixed(p.name.includes('%') ? 1 : 0) : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function AlgoCard({ name, result, color, step }) {
  if (!result) return null;
  const entry = result.history[Math.min(step, result.history.length - 1)];
  const frameCount = entry?.frames?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-black text-base" style={{ color }}>{name}</h3>
        <span className={`badge ${entry?.type === 'fault' ? 'badge-fault' : 'badge-hit'}`}>
          {entry?.type === 'fault' ? 'FAULT' : 'HIT'}
        </span>
      </div>

      <FrameRow
        frames={entry?.frames || []}
        replacedIndex={entry?.replacedIndex ?? -1}
        type={entry?.type}
        frameCount={frameCount}
      />

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Faults</div>
          <div className="font-black text-lg" style={{ color: 'var(--accent-red)' }}>{entry?.faults ?? 0}</div>
        </div>
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Hits</div>
          <div className="font-black text-lg" style={{ color: 'var(--accent-green)' }}>{entry?.hits ?? 0}</div>
        </div>
        <div className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Hit%</div>
          <div className="font-black text-lg" style={{ color }}>
            {entry ? ((entry.hits / (entry.step + 1)) * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ComparisonMode() {
  const [refString, setRefString] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2');
  const [frameCount, setFrameCount] = useState(3);
  const [results, setResults] = useState(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const parseRef = (str) => {
    const parts = str.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (parts.some(n => isNaN(n) || n < 0)) return null;
    return parts;
  };

  const compare = () => {
    const pages = parseRef(refString);
    if (!pages || pages.length === 0) {
      setError('Invalid reference string.');
      return;
    }
    const fc = parseInt(frameCount);
    if (isNaN(fc) || fc < 1 || fc > 8) {
      setError('Frame count must be 1-8.');
      return;
    }
    setError('');
    setResults({
      FIFO: runFIFO(pages, fc),
      LRU: runLRU(pages, fc),
      Optimal: runOptimal(pages, fc),
    });
    setStep(0);
  };

  const totalSteps = results ? results.FIFO.history.length : 0;

  // Chart data
  const barData = results ? [
    {
      metric: 'Page Faults',
      FIFO: results.FIFO.totalFaults,
      LRU: results.LRU.totalFaults,
      Optimal: results.Optimal.totalFaults,
    },
    {
      metric: 'Page Hits',
      FIFO: results.FIFO.totalHits,
      LRU: results.LRU.totalHits,
      Optimal: results.Optimal.totalHits,
    },
  ] : [];

  const hitRatioData = results ? [
    {
      subject: 'Hit Ratio',
      FIFO: parseFloat((results.FIFO.hitRatio * 100).toFixed(1)),
      LRU: parseFloat((results.LRU.hitRatio * 100).toFixed(1)),
      Optimal: parseFloat((results.Optimal.hitRatio * 100).toFixed(1)),
    },
    {
      subject: 'Miss Ratio',
      FIFO: parseFloat((results.FIFO.missRatio * 100).toFixed(1)),
      LRU: parseFloat((results.LRU.missRatio * 100).toFixed(1)),
      Optimal: parseFloat((results.Optimal.missRatio * 100).toFixed(1)),
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="glass-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="label">Reference String</label>
            <input
              className="input-field"
              value={refString}
              onChange={e => setRefString(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4 2 3"
            />
          </div>
          <div>
            <label className="label">Number of Frames</label>
            <input
              type="number"
              className="input-field"
              value={frameCount}
              onChange={e => setFrameCount(e.target.value)}
              min="1" max="8"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm mb-3 p-3 rounded-lg"
               style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--accent-red)' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button className="btn-primary" onClick={compare}>
          <GitCompare size={16} /> Compare All Algorithms
        </button>
      </div>

      {results && (
        <>
          {/* Step Navigator */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
                Step {step + 1} / {totalSteps}
              </span>
              <div className="flex gap-2">
                <button className="btn-secondary py-1 px-3 text-xs" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
                  ← Prev
                </button>
                <button className="btn-secondary py-1 px-3 text-xs" onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))} disabled={step === totalSteps - 1}>
                  Next →
                </button>
                <button className="btn-primary py-1 px-3 text-xs" onClick={() => setStep(0)}>
                  Reset
                </button>
              </div>
            </div>
            <input
              type="range" min="0" max={totalSteps - 1} value={step}
              onChange={e => setStep(parseInt(e.target.value))}
              className="speed-slider w-full"
            />
          </div>

          {/* Reference String Visual */}
          <div className="glass-card p-4">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              REFERENCE STRING
            </div>
            <div className="flex flex-wrap gap-1.5">
              {results.FIFO.history.map((entry, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: i === step ? 1.2 : 1,
                    opacity: i > step ? 0.35 : 1,
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black mono"
                  style={{
                    background: i === step
                      ? (entry.type === 'fault' ? 'rgba(248,113,113,0.25)' : 'rgba(52,211,153,0.2)')
                      : i < step
                      ? (entry.type === 'fault' ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.08)')
                      : 'rgba(100,100,100,0.1)',
                    border: i === step
                      ? (entry.type === 'fault' ? '2px solid var(--accent-red)' : '2px solid var(--accent-green)')
                      : '1px solid rgba(100,100,100,0.2)',
                    color: i === step
                      ? (entry.type === 'fault' ? 'var(--accent-red)' : 'var(--accent-green)')
                      : 'var(--text-secondary)',
                  }}
                >
                  {entry.page}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side-by-side algorithm cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(results).map(([name, res]) => (
              <AlgoCard key={name} name={name} result={res} color={ALGO_COLORS[name]} step={step} />
            ))}
          </div>

          {/* Summary Table */}
          <div className="glass-card p-4">
            <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--accent-purple)' }}>
              Final Summary
            </h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Total Faults</th>
                    <th>Total Hits</th>
                    <th>Hit Ratio</th>
                    <th>Miss Ratio</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(results).map(([name, res]) => (
                    <tr key={name}>
                      <td><span style={{ color: ALGO_COLORS[name], fontWeight: 700 }}>{name}</span></td>
                      <td style={{ color: 'var(--accent-red)' }}>{res.totalFaults}</td>
                      <td style={{ color: 'var(--accent-green)' }}>{res.totalHits}</td>
                      <td style={{ color: 'var(--accent-purple)' }}>{(res.hitRatio * 100).toFixed(1)}%</td>
                      <td style={{ color: 'var(--accent-yellow)' }}>{(res.missRatio * 100).toFixed(1)}%</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(100,100,100,0.2)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${res.hitRatio * 100}%`, background: ALGO_COLORS[name] }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-purple)' }}>
                Page Faults & Hits Comparison
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
                  <Bar dataKey="FIFO" fill={ALGO_COLORS.FIFO} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LRU" fill={ALGO_COLORS.LRU} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Optimal" fill={ALGO_COLORS.Optimal} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-4">
              <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-cyan)' }}>
                Hit / Miss Ratio Analysis
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hitRatioData} layout="vertical" barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <YAxis type="category" dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
                  <Bar dataKey="FIFO" fill={ALGO_COLORS.FIFO} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="LRU" fill={ALGO_COLORS.LRU} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Optimal" fill={ALGO_COLORS.Optimal} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
