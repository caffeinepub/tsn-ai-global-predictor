# TSN Sports AI Pro

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Live scores section for cricket, football, kabaddi, basketball, and tennis
- AI match prediction system with win probability percentages
- Player performance analytics with charts/graphs
- Fantasy team suggestion engine with captain recommendations
- AI auto match summary generator (text-based AI summaries)
- Dark and light theme toggle
- Notification system for live match alerts
- Admin panel to update matches, scores, and news
- Bottom navigation bar: Home, Live, AI Prediction, Fantasy, Profile
- Mobile-optimized layout for Android

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- Match data store: CRUD for matches (sport type, teams, scores, status: live/upcoming/completed)
- News store: CRUD for news articles/updates
- Player store: player profiles with performance stats
- AI prediction store: win probability data per match
- Fantasy store: fantasy team suggestions per match with captain picks
- Match summary store: AI-generated text summaries per match
- Notification store: user notification preferences and alerts
- Admin authentication: simple admin key-based access for write operations

### Frontend
- App shell with bottom navigation bar (5 tabs)
- Home screen: featured matches, news feed, quick stats
- Live screen: live scores grouped by sport (cricket, football, kabaddi, basketball, tennis)
- AI Prediction screen: match list with win probability bars, confidence meter
- Fantasy screen: suggested teams, captain recommendations per match
- Profile screen: user preferences, theme toggle, notification settings
- Admin panel (accessible via Profile): add/edit matches, update scores, post news
- Player analytics modal/page: performance graphs using recharts
- Match detail page: score, summary, prediction, fantasy picks
- Dark/light theme with CSS variables
- Black and blue sports color palette
- Smooth animations using Framer Motion or CSS transitions

## UX Notes
- Mobile-first design optimized for Android (max-width ~430px)
- Bottom nav stays fixed at bottom, content scrolls above it
- Dark mode default, with light mode toggle in Profile
- Sports card-style UI with bold typography
- Live matches show pulsing "LIVE" badge
- Win probability shown as animated progress bars
- Fantasy captain shown with special badge/crown icon
- Admin panel gated behind a simple passcode entry
