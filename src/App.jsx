import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout';
import PagingPage from './pages/PagingPage';
import SegmentationPage from './pages/SegmentationPage';
import PageReplacementPage from './pages/PageReplacementPage';
import ComparisonPage from './pages/ComparisonPage';

// Framer Motion transition config for page-level animations
const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25 },
};

function AnimatedPage({ children }) {
  return (
    <motion.div {...PAGE_TRANSITION}>
      {children}
    </motion.div>
  );
}

export default function App() {
  // Theme state — defaults to dark mode
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />}>
          <Route
            path="/"
            element={<AnimatedPage><PagingPage /></AnimatedPage>}
          />
          <Route
            path="/segmentation"
            element={<AnimatedPage><SegmentationPage /></AnimatedPage>}
          />
          <Route
            path="/replacement"
            element={<AnimatedPage><PageReplacementPage /></AnimatedPage>}
          />
          <Route
            path="/comparison"
            element={<AnimatedPage><ComparisonPage /></AnimatedPage>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
