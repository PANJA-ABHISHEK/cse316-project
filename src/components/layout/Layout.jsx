import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ darkMode, toggleDark }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar darkMode={darkMode} toggleDark={toggleDark} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
