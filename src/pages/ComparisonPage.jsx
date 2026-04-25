import { motion } from 'framer-motion';
import { GitCompare } from 'lucide-react';
import Header from '../components/layout/Header';
import ComparisonMode from '../components/comparison/ComparisonMode';

export default function ComparisonPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Comparison Mode"
        subtitle="Run FIFO, LRU, and Optimal simultaneously on the same input and compare results side-by-side"
        icon={GitCompare}
        color="#f472b6"
      />
      <ComparisonMode />
    </div>
  );
}
