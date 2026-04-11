# Changelog

## 2026-04-08

- Added a multi-step onboarding wizard with soft gradients, segmented progress, and minimal inputs (name-first, then personalized copy).
- Flow: name → personalized message → role → company → optional website → networking intents → mock AI follow-up → plan summary → finish.
- Onboarding completion and full profile JSON persisted locally (`AsyncStorage`); feature flag `onboardingWizardV1`.
- Documented real AI and production storage in `docs/onboarding-ai-and-storage.md`.
- Added `expo-linear-gradient` and unit tests for onboarding state and mock AI helpers.
