import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  canProceed,
  nextStepIndex,
  ONBOARDING_STEPS,
  OnboardingForm,
  OnboardingGoal,
  prevStepIndex,
} from "./state";

const GOALS: { id: OnboardingGoal; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "networking", label: "Grow network", icon: "people-outline" },
  { id: "leadGen", label: "Find leads", icon: "sparkles-outline" },
  { id: "partnerships", label: "Partnerships", icon: "briefcase-outline" },
  { id: "hiring", label: "Hire talent", icon: "person-add-outline" },
];

const INITIAL_FORM: OnboardingForm = {
  fullName: "",
  workEmail: "",
  goals: [],
};

type Props = {
  onComplete: () => void;
};

export function OnboardingWizard({ onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const step = ONBOARDING_STEPS[stepIndex];

  const ctaLabel = useMemo(() => {
    if (step === "finish") return "Enter Duit Cards";
    if (step === "welcome") return "Get Started";
    return "Continue";
  }, [step]);

  const disableContinue = !canProceed(step, form);

  function toggleGoal(goal: OnboardingGoal) {
    setForm((curr) => {
      const selected = curr.goals.includes(goal);
      if (selected) {
        return { ...curr, goals: curr.goals.filter((item) => item !== goal) };
      }
      return { ...curr, goals: [...curr.goals, goal] };
    });
  }

  function handleNext() {
    if (step === "finish") {
      onComplete();
      return;
    }
    if (!canProceed(step, form)) return;
    setStepIndex((curr) => nextStepIndex(curr));
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.heroGlowTop} />
      <View style={styles.heroGlowBottom} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>Duit Cards</Text>
          <Pressable onPress={onComplete} hitSlop={8}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.progressRow}>
          {ONBOARDING_STEPS.map((item, idx) => (
            <View key={item} style={[styles.progressDot, idx <= stepIndex && styles.progressDotActive]} />
          ))}
        </View>

        <View style={styles.card}>
          {step === "welcome" && (
            <>
              <Text style={styles.eyebrow}>Welcome</Text>
              <Text style={styles.title}>Build relationships that compound.</Text>
              <Text style={styles.subtitle}>
                A premium personal CRM experience inspired by social-first apps, tuned for fintech-grade trust.
              </Text>
              <View style={styles.pillsRow}>
                {["Fast Setup", "Secure by default", "Highly personal"].map((item) => (
                  <View key={item} style={styles.infoPill}>
                    <Text style={styles.infoPillText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {step === "goals" && (
            <>
              <Text style={styles.eyebrow}>Your Intent</Text>
              <Text style={styles.title}>What matters most right now?</Text>
              <Text style={styles.subtitle}>Select one or more goals so we can tailor your dashboard.</Text>
              <View style={styles.goalGrid}>
                {GOALS.map((goal) => {
                  const active = form.goals.includes(goal.id);
                  return (
                    <Pressable
                      key={goal.id}
                      onPress={() => toggleGoal(goal.id)}
                      style={[styles.goalCard, active && styles.goalCardActive]}
                    >
                      <Ionicons name={goal.icon} size={18} color={active ? "#1744C8" : "#4B5563"} />
                      <Text style={[styles.goalLabel, active && styles.goalLabelActive]}>{goal.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {step === "profile" && (
            <>
              <Text style={styles.eyebrow}>Your Profile</Text>
              <Text style={styles.title}>Let us personalize your card.</Text>
              <Text style={styles.subtitle}>Only basic details for now. You can edit everything later.</Text>
              <TextInput
                value={form.fullName}
                onChangeText={(fullName) => setForm((curr) => ({ ...curr, fullName }))}
                placeholder="Full name"
                placeholderTextColor="#8A93A6"
                style={styles.input}
                autoCapitalize="words"
              />
              <TextInput
                value={form.workEmail}
                onChangeText={(workEmail) => setForm((curr) => ({ ...curr, workEmail }))}
                placeholder="Work email"
                placeholderTextColor="#8A93A6"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </>
          )}

          {step === "finish" && (
            <>
              <Text style={styles.eyebrow}>Ready</Text>
              <Text style={styles.title}>You are all set.</Text>
              <Text style={styles.subtitle}>
                We prepared your workspace for{" "}
                <Text style={styles.subtitleStrong}>{form.fullName || "your account"}</Text>. Start adding cards and
                building stronger connections.
              </Text>
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={22} color="#22643A" />
                <Text style={styles.successText}>Onboarding complete</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.backButton, stepIndex === 0 && styles.backButtonHidden]}
            onPress={() => setStepIndex((curr) => prevStepIndex(curr))}
            disabled={stepIndex === 0}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, disableContinue && step !== "finish" && styles.primaryButtonDisabled]}
            onPress={handleNext}
            disabled={disableContinue && step !== "finish"}
          >
            <Text style={styles.primaryButtonText}>{ctaLabel}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F6FF" },
  content: { flex: 1, paddingHorizontal: 22, paddingVertical: 12 },
  heroGlowTop: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#CDD9FF",
    opacity: 0.75,
  },
  heroGlowBottom: {
    position: "absolute",
    bottom: 80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#E7DCFF",
    opacity: 0.55,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  brand: { fontSize: 17, fontWeight: "700", color: "#111827", letterSpacing: 0.3 },
  skip: { color: "#4263C4", fontWeight: "600" },
  progressRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  progressDot: { flex: 1, height: 5, borderRadius: 999, backgroundColor: "#D8E1F5" },
  progressDotActive: { backgroundColor: "#3563E9" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#DEE6F8",
    padding: 20,
    gap: 10,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  eyebrow: { color: "#3563E9", fontWeight: "700", fontSize: 13, letterSpacing: 0.2 },
  title: { fontSize: 31, lineHeight: 36, fontWeight: "800", color: "#0F172A" },
  subtitle: { color: "#64748B", fontSize: 15, lineHeight: 22 },
  subtitleStrong: { fontWeight: "700", color: "#334155" },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 2 },
  infoPill: { backgroundColor: "#EEF3FF", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  infoPillText: { color: "#3558B9", fontSize: 12, fontWeight: "600" },
  goalGrid: { gap: 10, marginTop: 4 },
  goalCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8E1F5",
    backgroundColor: "#F9FBFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  goalCardActive: { borderColor: "#9BB3FF", backgroundColor: "#EAF0FF" },
  goalLabel: { color: "#4B5563", fontWeight: "600" },
  goalLabelActive: { color: "#1744C8" },
  input: {
    borderWidth: 1,
    borderColor: "#D9E3F8",
    borderRadius: 12,
    backgroundColor: "#FAFCFF",
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  successBox: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#E7F7ED",
    borderWidth: 1,
    borderColor: "#B6E2C6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  successText: { color: "#22643A", fontWeight: "700" },
  footer: { marginTop: "auto", flexDirection: "row", gap: 10, paddingVertical: 16 },
  backButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CAD6F2",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
  },
  backButtonHidden: { opacity: 0 },
  backButtonText: { color: "#3558B9", fontWeight: "700" },
  primaryButton: {
    flex: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    backgroundColor: "#3563E9",
  },
  primaryButtonDisabled: { backgroundColor: "#9FB6F8" },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "700" },
});

