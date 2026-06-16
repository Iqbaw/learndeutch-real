import type { UserProfile } from "@/types";

// Simulated user state for MVP (PRD section 17 of prompt)
export const demoUser: UserProfile = {
  name: "Iqbal",
  currentLevel: "A1.1",
  day: 4,
  streak: 7,
  activeLevel: "A1.1",
  passiveLevel: "A1.2",
  goal: "Ausbildung",
  dailyTargetMinutes: 45,
  xp: 1240,
  badges: [
    "Verb Position Master",
    "Der Die Das Survivor",
    "7-Day Consistency",
    "First German Conversation",
    "100 Active Words",
  ],
};
