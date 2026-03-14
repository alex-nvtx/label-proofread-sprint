# Medical Label Verification Platform — Sprint Dashboard

A React + Vite dashboard for tracking a 4-week medical label verification platform sprint.

## Features

- 📋 Sprint planning with detailed task breakdown
- 📊 Kanban board view for visual task management  
- 🎯 Real-time progress tracking
- 📤 Export tasks to Excel (.xlsx)
- 🔍 Advanced filtering (week, owner, priority, status)
- 📝 Inline task notes

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output goes to `dist/` folder.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

The app will auto-detect Vite and deploy.

## Technologies

- **React 18** — UI framework
- **Vite** — Fast build tool
- **Pure CSS** — No dependencies

## Project Structure

```
src/
  App.jsx      — Main sprint dashboard component
  main.jsx     — React entry point
  index.css    — Global styles
index.html     — HTML template
vercel.json    — Vercel configuration
vite.config.js — Vite configuration
package.json   — Dependencies
```
