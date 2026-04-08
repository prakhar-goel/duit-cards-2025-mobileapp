export const ONBOARDING_COMPLETED_KEY = "duit:onboarding:v1:completed";

export type OnboardingGoal = "networking" | "leadGen" | "partnerships" | "hiring";

export type OnboardingForm = {
  fullName: string;
  workEmail: string;
  goals: OnboardingGoal[];
};

export const ONBOARDING_STEPS = ["welcome", "goals", "profile", "finish"] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export function nextStepIndex(index: number): number {
  return Math.min(index + 1, ONBOARDING_STEPS.length - 1);
}

export function prevStepIndex(index: number): number {
  return Math.max(index - 1, 0);
}

export function canProceed(step: OnboardingStep, form: OnboardingForm): boolean {
  if (step === "goals") return form.goals.length > 0;
  if (step === "profile") return form.fullName.trim().length >= 2 && form.workEmail.includes("@");
  return true;
}

export function shouldShowOnboarding(flagEnabled: boolean, alreadyCompleted: boolean): boolean {
  return flagEnabled && !alreadyCompleted;
}

