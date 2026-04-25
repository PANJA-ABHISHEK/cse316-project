import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import AnimatedCounter from '../ui/AnimatedCounter';
import { TrendingDown, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

function StatCard({ label, value, suffix = '', prefix = '', icon: Icon, color, decimals = 0, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 15 }}
      className="stat-card"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          {Icon && <Icon size={16} color={color} />}
        </div>
      </div>
      <div className="text-3xl font-black mt-1">
        <AnimatedCounter value={value} suffix={suffix} prefix={prefix} decimals={decimals} color={color} />
      </div>
    </motion.div>
  );
}

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-xs shadow-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
      >
        <div className="font-bold mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(p.name.includes('%') ? 1 : 0) : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StatsDashboard({ result, algorithm, frameCount }) {
  if (!result) return null;

  const { totalFaults, totalHits, hitRatio, missRatio, history } = result;
  const total = history.length;

  // Build chart data: cumulative faults over steps
  const chartData = history.map((entry, i) => ({
    step: i + 1,
    page: entry.page,
    faults: entry.faults,
    hits: entry.hits,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Page Faults"
          value={totalFaults}
          icon={AlertTriangle}
          color="var(--accent-red)"
          delay={0}
        />
        <StatCard
          label="Page Hits"
          value={totalHits}
          icon={Zap}
          color="var(--accent-green)"
          delay={0.05}
        />
        <StatCard
          label="Hit Ratio"
          value={hitRatio * 100}
          suffix="%"
          icon={TrendingUp}
          color="var(--accent-purple)"
          decimals={1}
          delay={0.1}
        />
        <StatCard
          label="Miss Ratio"
          value={missRatio * 100}
          suffix="%"
          icon={TrendingDown}
          color="var(--accent-yellow)"
          decimals={1}
          delay={0.15}
        />
      </div>

      {/* Cumulative Fault Chart */}
      <div className="glass-card p-4">
        <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--accent-purple)' }}>
          Cumulative Page Faults Over Time — {algorithm}
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
            <XAxis
              dataKey="step"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(99,102,241,0.2)' }}
              tickLine={false}
              label={{ value: 'Reference Steps', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(99,102,241,0.2)' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <Line
              type="monotone"
              dataKey="faults"
              name="Page Faults"
              stroke="var(--accent-red)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: 'var(--accent-red)' }}
            />
            <Line
              type="monotone"
              dataKey="hits"
              name="Page Hits"
              stroke="var(--accent-green)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: 'var(--accent-green)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)', paddingTop: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
