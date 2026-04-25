import { motion } from 'framer-motion';

export default function Header({ title, subtitle, icon: Icon, color = '#818cf8' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            <Icon size={20} color={color} />
          </div>
        )}
        <h1 className="section-title">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-sm mt-1 ml-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      )}
    </motion.div>
  );
}
