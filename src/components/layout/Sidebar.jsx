import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Cpu, Layers, RefreshCw, GitCompare, ChevronLeft, ChevronRight,
  Zap, Moon, Sun, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Paging', icon: Cpu, desc: 'Address translation & frames' },
  { path: '/segmentation', label: 'Segmentation', icon: Layers, desc: 'Variable-sized memory blocks' },
  { path: '/replacement', label: 'Page Replacement', icon: RefreshCw, desc: 'FIFO · LRU · Optimal' },
  { path: '/comparison', label: 'Comparison Mode', icon: GitCompare, desc: 'Side-by-side algorithm analysis' },
];

export default function Sidebar({ darkMode, toggleDark }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>
          <Zap size={18} color="white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <div className="font-black text-base leading-tight" style={{ color: 'var(--text-primary)' }}>MemViz</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>OS Memory Simulator</div>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon, desc }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? label : ''}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-1 rounded-lg opacity-20"
                    style={{ background: 'var(--accent-purple)' }}
                  />
                )}
              </div>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                  <div className="font-medium text-sm leading-tight">{label}</div>
                  <div className="text-xs opacity-60 mt-0.5">{desc}</div>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={toggleDark}
          className="nav-item w-full"
          title={collapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : ''}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          )}
        </button>

        {/* Collapse Button (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item w-full hidden md:flex"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium">
              Collapse
            </motion.span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col w-64"
            style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0"
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
