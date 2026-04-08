import { describe, expect, it } from "vitest";
import {
  canProceed,
  nextStepIndex,
  prevStepIndex,
  shouldShowOnboarding,
  type OnboardingForm,
} from "./state";

const validForm: OnboardingForm = {
  fullName: "Alex Doe",
  workEmail: "alex@duitcards.app",
  goals: ["networking"],
};

describe("onboarding state helpers", () => {
  it("clamps next and previous step bounds", () => {
    expect(prevStepIndex(0)).toBe(0);
    expect(nextStepIndex(3)).toBe(3);
    expect(nextStepIndex(1)).toBe(2);
  });

  it("requires at least one goal in goals step", () => {
    expect(canProceed("goals", { ...validForm, goals: [] })).toBe(false);
    expect(canProceed("goals", validForm)).toBe(true);
  });

  it("requires profile basics in profile step", () => {
    expect(canProceed("profile", { ...validForm, fullName: "A" })).toBe(false);
    expect(canProceed("profile", { ...validForm, workEmail: "invalid-email" })).toBe(false);
    expect(canProceed("profile", validForm)).toBe(true);
  });

  it("respects feature flag and completion status", () => {
    expect(shouldShowOnboarding(true, false)).toBe(true);
    expect(shouldShowOnboarding(false, false)).toBe(false);
    expect(shouldShowOnboarding(true, true)).toBe(false);
  });
});

