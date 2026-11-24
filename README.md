# Heat Game Card Deck

A modern React application for tracking cards, hand management, and engine heat for the board game **"Heat: Pedal to the Metal"**.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 with `vite-plugin-singlefile` (inlines all CSS/JS into a single self-contained HTML file)
- **Styling**: Modern CSS with 3D transforms, CSS animations, and authentic card textures
- **Testing**: Vitest + React Testing Library + JSDOM

## Features

- **Engine Heat Management**: Track engine heat in the cascade heat pile, cool down by shifting heat to discard.
- **Card Hand & Deck Tracking**: Dynamic 7-card hand limit, draw pile, play area, and discard pile.
- **Speed Calculation**: Real-time sum of speed cards currently played.
- **Sequential Boost (`+`) Resolution**: Simulates drawing and resolving boost cards with authentic animations and delays.
- **Interactive Drag & Drop**: Native HTML5 card dragging between Hand, Play Area, and Discard Piles with click-to-play fallbacks and full undo support.
- **Polished 3D Animations**: 3D card flips, flame pulses on heat cards, fanning cascade layouts, and smooth card dealing.

## Getting Started

### Installation

```bash
npm install
```

### Development Server

Start the local dev server:

```bash
npm run dev
```

### Production Build

Build the single-file HTML bundle into `dist/index.html`:

```bash
npm run build
```

### Running Tests

Run the Vitest test suite:

```bash
npm test
```

## Project Structure

```
├── dist/                     # Production single-file bundle
├── src/
│   ├── components/           # React UI components
│   │   ├── ActionButtons.tsx # Draw Cards & Play Cards controls
│   │   ├── CardPile.tsx      # Reusable stack and cascade card piles
│   │   ├── Hand.tsx          # Cascaded player hand
│   │   ├── HeatCard.tsx      # 3D interactive card component
│   │   └── PlayArea.tsx      # Active played cards area
│   ├── constants/            # Card definitions and deck configuration
│   ├── context/              # Game state management (reducer + context)
│   ├── logic/                # Pure game logic (shuffle, deal, calculate)
│   ├── styles/               # Theme, animations, and game board CSS
│   ├── App.tsx               # Root board layout
│   └── main.tsx              # React entry point
├── index.html                # HTML template
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite & Vitest configuration
```
