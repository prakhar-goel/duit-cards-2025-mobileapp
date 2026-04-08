# Duit Cards (Mobile Prototype)

Duit Cards is a modern mobile app concept for digital business cards and lightweight relationship management.

This repository contains a **Phase 1 frontend prototype** built with **Expo + React Native + TypeScript** for both Android and iOS (and optional web preview).

## Product Vision

Duit Cards is not only a business card scanner. It is a personal CRM that helps users:

- Create and share beautiful digital business cards
- Save and organize contacts
- Keep notes and interaction history
- Set reminders for follow-ups
- Build meaningful long-term relationships

## Current Scope (Phase 1)

This version is intentionally frontend-focused and uses mock data only.

### Implemented Screens

- Home Dashboard
  - Search contacts
  - Filter by `Recent`, `Favorites`, and `Tags`
  - Floating add action
- Add Card
  - Scan card mock UI
  - Manual card entry form
  - Upload photo CTA (UI only)
- Contact Detail
  - Card-style profile preview
  - Notes, tags, and interaction history
  - Remind me action
- Reminders
  - Follow-up list sorted by urgency
  - Snooze and complete actions
- My Card
  - Personal digital card preview
  - QR mock and share actions

## Design Direction

- Clean, minimal, modern UI
- Generous spacing and rounded corners
- Soft shadows and clear hierarchy
- Fast, lightweight interactions

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19 + TypeScript
- React Navigation (Bottom Tabs + Native Stack)
- `react-native-safe-area-context`
- `react-native-screens`

## Getting Started

### 1) Prerequisites

- Node.js 18+ recommended
- npm
- Expo Go app on your phone (optional but recommended for quick testing)

### 2) Install dependencies

```bash
npm install
```

### 3) Run the app

```bash
npm run start
```

Then choose one target:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go on a physical device

You can also run directly:

```bash
npm run ios
npm run android
npm run web
```

## Available Scripts

- `npm run start` - Start Expo dev server
- `npm run ios` - Launch on iOS
- `npm run android` - Launch on Android
- `npm run web` - Launch web preview
- `npm run typecheck` - Run TypeScript checks
- `npm run build:web` - Export static web build to `dist/`
- `npm run ci:verify` - Run typecheck + web export validation

## Project Notes

- This is a **prototype**, not production-ready.
- No backend/database is integrated yet.
- Data is mock/static for rapid UI iteration.

## Next Suggested Steps (Phase 2)

- Move mock data into structured state/store modules
- Add contact creation/edit flows with local persistence
- Integrate camera + OCR scanning pipeline
- Add authentication + backend API
- Improve animations and transitions

## Repository

GitHub: [git@github.com:prakhar-goel/duit-cards-2025-mobileapp.git](git@github.com:prakhar-goel/duit-cards-2025-mobileapp.git)