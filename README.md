# MemViz — Dynamic Memory Management Visualizer

An interactive OS Memory Management Visualizer built with **React + Vite**. Simulate Paging, Segmentation, Virtual Memory, and Page Replacement Algorithms with step-by-step animations.

## 📁 Project Structure

```
MemViz/
├── public/                    # Static assets (favicon, icons)
│   ├── favicon.svg
│   └── icons.svg
│
├── src/                       # Application source code
│   ├── assets/                # Images & media
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/            # Reusable UI components
│   │   ├── comparison/        # Algorithm comparison view
│   │   ├── dashboard/         # Stats dashboard widgets
│   │   ├── layout/            # Header, Sidebar, Layout shell
│   │   ├── paging/            # Paging visualization (FrameGrid, PageTable)
│   │   ├── replacement/       # Page replacement visualization
│   │   ├── segmentation/      # Segmentation visualization
│   │   └── ui/                # Generic UI primitives (AnimatedCounter, Tooltip, ControlPanel)
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── usePageReplacement.js
│   │   ├── usePaging.js
│   │   └── useSegmentation.js
│   │
│   ├── pages/                 # Route-level page components
│   │   ├── ComparisonPage.jsx
│   │   ├── PageReplacementPage.jsx
│   │   ├── PagingPage.jsx
│   │   └── SegmentationPage.jsx
│   │
│   ├── utils/                 # Utility functions & algorithms
│   │   ├── algorithms/        # FIFO, LRU, Optimal implementations
│   │   │   ├── fifo.js
│   │   │   ├── lru.js
│   │   │   └── optimal.js
│   │   ├── pagingUtils.js
│   │   └── segmentationUtils.js
│   │
│   ├── App.jsx                # Root component with routing
│   ├── App.css                # App-level styles
│   ├── index.css              # Global styles & design tokens
│   └── main.jsx               # React entry point
│
├── .gitignore
├── eslint.config.js
├── index.html                 # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| React 19         | UI framework                     |
| Vite 5           | Build tool & dev server          |
| React Router 7   | Client-side routing              |
| Framer Motion    | Animations & transitions         |
| Recharts         | Data visualization charts        |
| Lucide React     | Icon library                     |
| Tailwind CSS 3   | Utility-first styling            |

## 📖 Features

- **Paging Simulation** — Visualize page-to-frame mapping with configurable page/frame sizes
- **Segmentation** — Explore base-limit register visualization and logical memory mapping
- **Page Replacement** — Step-by-step FIFO, LRU, and Optimal algorithm simulations
- **Comparison Mode** — Side-by-side algorithm performance analysis
- **Dark / Light Mode** — Toggle between themes
- **Animated UI** — Smooth page transitions and micro-animations
