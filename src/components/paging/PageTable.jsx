import { motion, AnimatePresence } from 'framer-motion';
import { InfoTooltip } from '../ui/Tooltip';

export default function PageTable({ pageTable, pageSize, config }) {
  if (!pageTable) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-sm" style={{ color: 'var(--accent-purple)' }}>Page Table</h3>
        <InfoTooltip text="Maps each logical page number to a physical frame number. 'null' means the page is not in memory." />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Page #</th>
              <th>Frame #</th>
              <th>Valid Bit</th>
              <th>Logical Range</th>
              <th>Physical Range</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {pageTable.map((frame, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <td>
                    <span style={{ color: 'var(--accent-blue)' }}>P{idx}</span>
                  </td>
                  <td>
                    {frame !== null
                      ? <span style={{ color: 'var(--accent-green)' }}>F{frame}</span>
                      : <span style={{ color: 'var(--text-secondary)' }}>—</span>
                    }
                  </td>
                  <td>
                    <span className={`badge ${frame !== null ? 'badge-hit' : 'badge-fault'}`}>
                      {frame !== null ? '1' : '0'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {idx * pageSize} – {(idx + 1) * pageSize - 1}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {frame !== null
                      ? `${frame * pageSize} – ${(frame + 1) * pageSize - 1}`
                      : '—'
                    }
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
