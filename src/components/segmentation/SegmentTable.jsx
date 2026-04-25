import { motion, AnimatePresence } from 'framer-motion';
import { InfoTooltip } from '../ui/Tooltip';
import { SEGMENT_COLORS } from '../../utils/segmentationUtils';

export default function SegmentTable({ segments, selectedSegId, onSelect, getColor }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-sm" style={{ color: 'var(--accent-yellow)' }}>Segment Table</h3>
        <InfoTooltip text="Each segment has a base address and a limit. Access is only valid if offset < limit." />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Seg #</th>
              <th>Name</th>
              <th>Base</th>
              <th>Limit</th>
              <th>End Addr</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {segments.map((seg, idx) => {
                const color = getColor(idx);
                const isSelected = seg.id === selectedSegId;
                return (
                  <motion.tr
                    key={seg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onSelect(seg.id)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? `${color.bg}` : 'transparent',
                    }}
                  >
                    <td>
                      <span style={{ color: color.text }}>S{idx}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: color.text }}
                        />
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {seg.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--accent-blue)' }}>{seg.base}</td>
                    <td style={{ color: 'var(--accent-yellow)' }}>{seg.limit}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{seg.base + seg.limit - 1}</td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
