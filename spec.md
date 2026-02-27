# TSN AI Assistant

## Current State
The workspace currently contains "TSN AI Global Predictor" — a sports/stock predictions app with 5 tabs (Home, Live, AI Predict, Fantasy, Profile), an admin panel, and a backend with matches, players, predictions, news, notifications, and fantasy suggestions.

## Requested Changes (Diff)

### Add
- Splash screen with animated logo on first load
- Auth flow (Login / Signup screens with email + password)
- Home dashboard with: daily motivational quote, quick-access cards (Chat, Tools, Sports, Stocks), user greeting
- AI Chat screen with WhatsApp-style chat bubbles, loading animation while "AI is thinking", message history
- Tools section with: Image Analysis (upload + explain), Homework Helper, Text Summarizer, Text-to-Speech, Voice Input
- Sports Info tab showing sports news and match summaries
- Stock Info card showing trending stocks/signals
- Profile screen with avatar, user stats, premium badge, settings shortcut
- Settings screen with Dark/Light mode toggle, notification preferences, premium subscription CTA
- Bottom navigation: Home, Chat, Tools, Profile (4 tabs)
- Blue + Black gradient theme (OKLCH color tokens)
- Smooth animations throughout
- Premium subscription UI (locked features with upgrade prompt)
- Daily motivational quotes system (stored backend, random pick)

### Modify
- Replace entire existing app shell (TSN AI Global Predictor) with TSN AI Assistant
- Replace existing 5-tab navigation with 4-tab navigation (Home, Chat, Tools, Profile)
- Replace existing color theme with blue/black gradient AI assistant theme
- Backend: replace sports/predictions schema with AI assistant schema (chat messages, user profiles, quotes, tool usage logs)

### Remove
- All old sports prediction tabs (Live, AI Predict, Fantasy)
- All old admin panel code
- Old seed data utilities for sports data
- Old backend types (Match, MatchPrediction, FantasySuggestion, Player, etc.)

## Implementation Plan
1. Generate new backend with: user profiles, chat message history, motivational quotes, tool usage logs, premium status, notifications
2. Generate app logo asset
3. Build frontend:
   - SplashScreen component (animated, shows 2s then transitions)
   - AuthScreen (Login/Signup toggle, email+password fields)
   - New App.tsx shell with 4-tab nav + auth gating + splash
   - HomeTab: greeting, daily quote card, quick-action grid, trending stocks teaser, sports teaser
   - ChatTab: full-screen chat with message bubbles, input bar, typing animation, simulated AI responses
   - ToolsTab: grid of tool cards — Image Analysis, Homework Helper, Text Summarizer, TTS, Voice Input; each opens a modal/sub-screen
   - ProfileTab: user info, premium badge, settings, dark/light toggle
   - SettingsScreen: theme toggle, notification prefs, premium CTA, about
   - Blue/black OKLCH color tokens in index.css

## UX Notes
- Mobile-first, max-width 430px centered
- Chat bubbles: user right (blue), AI left (dark card with subtle gradient)
- Loading state: three animated dots when AI is "thinking"
- Splash screen: logo fades in, then slides up to reveal home
- Tools section uses a 2-column card grid with icons
- Premium features show a lock icon and "Go Premium" overlay
- Motivational quote rotates daily, stored in backend
- Smooth tab transitions with opacity/translate animation
