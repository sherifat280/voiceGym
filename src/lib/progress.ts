/**
 * Progress derivation.
 *
 * Every number here comes from rows the signed-in learner actually created in
 * `practice_sessions`. There is no seeded, demo or default data: a brand new
 * account derives zeros across the board.
 */

export type PracticeKind = "conversation" | "pronunciation" | "challenge";

export type PracticeSession = {
  id: string;
  kind: PracticeKind;
  topic: string | null;
  duration_seconds: number;
  turns: number;
  words_spoken: number;
  confidence: number | null;
  accuracy: number | null;
  stress: number | null;
  intonation: number | null;
  rhythm: number | null;
  note: string | null;
  created_at: string;
};

export const DAILY_GOAL_MINUTES = 15;

const DAY_MS = 86_400_000;

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * Confidence for a finished conversation, from what the learner actually did:
 * how many turns they took and how much they said. Never a random number.
 */
export function confidenceFromActivity(turns: number, words: number): number {
  if (turns <= 0 || words <= 0) return 0;
  const score = 40 + Math.min(30, turns * 5) + Math.min(25, Math.round(words / 8));
  return Math.max(1, Math.min(100, score));
}

export function averageOf(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function streakFromDates(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map((date) => dayKey(startOfDay(date))));
  const today = startOfDay(new Date());
  let cursor = today;
  if (!days.has(dayKey(cursor))) {
    cursor = new Date(today.getTime() - DAY_MS);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

export type ProgressStats = {
  hasActivity: boolean;
  totalSessions: number;
  sessionsThisMonth: number;
  conversations: number;
  pronunciationExercises: number;
  challenges: number;
  totalMinutes: number;
  minutesToday: number;
  wordsSpoken: number;
  streakDays: number;
  /** null until the learner has completed something worth scoring. */
  confidence: number | null;
  confidenceDelta: number | null;
  consistency: number;
  fearReduction: number | null;
  pronunciation: {
    accuracy: number | null;
    stress: number | null;
    intonation: number | null;
    rhythm: number | null;
  };
  weekly: { label: string; confidence: number; minutes: number }[];
  monthly: { label: string; confidence: number; sessions: number }[];
  recent: PracticeSession[];
};

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function buildProgress(sessions: PracticeSession[]): ProgressStats {
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const now = new Date();
  const today = startOfDay(now);

  const scored = sorted.filter((s) => typeof s.confidence === "number" && s.confidence > 0);
  const confidenceValues = scored.map((s) => s.confidence as number);
  const recentConfidence = averageOf(confidenceValues.slice(0, 5));
  const olderConfidence = averageOf(confidenceValues.slice(5, 10));

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const weekly = Array.from({ length: 7 }, (_, index) => {
    const day = startOfDay(new Date(today.getTime() - (6 - index) * DAY_MS));
    const dayEnd = day.getTime() + DAY_MS;
    const inDay = sorted.filter((s) => {
      const time = new Date(s.created_at).getTime();
      return time >= day.getTime() && time < dayEnd;
    });
    return {
      label: WEEKDAY[day.getDay()] as string,
      confidence:
        averageOf(
          inDay.filter((s) => (s.confidence ?? 0) > 0).map((s) => s.confidence as number),
        ) ?? 0,
      minutes: Math.round(inDay.reduce((sum, s) => sum + s.duration_seconds, 0) / 60),
    };
  });

  const monthly = Array.from({ length: 4 }, (_, index) => {
    const end = today.getTime() + DAY_MS - index * 7 * DAY_MS;
    const start = end - 7 * DAY_MS;
    const inWeek = sorted.filter((s) => {
      const time = new Date(s.created_at).getTime();
      return time >= start && time < end;
    });
    return {
      label: index === 0 ? "This week" : `${index + 1}w ago`,
      confidence:
        averageOf(
          inWeek.filter((s) => (s.confidence ?? 0) > 0).map((s) => s.confidence as number),
        ) ?? 0,
      sessions: inWeek.length,
    };
  }).reverse();

  const last14 = sorted.filter(
    (s) => new Date(s.created_at).getTime() >= today.getTime() - 13 * DAY_MS,
  );
  const activeDays = new Set(last14.map((s) => dayKey(startOfDay(new Date(s.created_at))))).size;

  const pick = (key: "accuracy" | "stress" | "intonation" | "rhythm") =>
    averageOf(
      sorted
        .filter((s) => typeof s[key] === "number" && (s[key] as number) > 0)
        .slice(0, 10)
        .map((s) => s[key] as number),
    );

  const totalSeconds = sorted.reduce((sum, s) => sum + s.duration_seconds, 0);
  const finishedRatio = sorted.length
    ? sorted.filter((s) => s.turns >= 2 || s.duration_seconds >= 60).length / sorted.length
    : 0;

  return {
    hasActivity: sorted.length > 0,
    totalSessions: sorted.length,
    sessionsThisMonth: sorted.filter((s) => new Date(s.created_at).getTime() >= monthStart).length,
    conversations: sorted.filter((s) => s.kind === "conversation").length,
    pronunciationExercises: sorted.filter((s) => s.kind === "pronunciation").length,
    challenges: sorted.filter((s) => s.kind === "challenge").length,
    totalMinutes: Math.round(totalSeconds / 60),
    minutesToday: Math.round(
      sorted
        .filter((s) => new Date(s.created_at).getTime() >= today.getTime())
        .reduce((sum, s) => sum + s.duration_seconds, 0) / 60,
    ),
    wordsSpoken: sorted.reduce((sum, s) => sum + s.words_spoken, 0),
    streakDays: streakFromDates(sorted.map((s) => new Date(s.created_at))),
    confidence: recentConfidence,
    confidenceDelta:
      recentConfidence !== null && olderConfidence !== null
        ? recentConfidence - olderConfidence
        : null,
    consistency: Math.round((activeDays / 14) * 100),
    fearReduction: sorted.length ? Math.round(finishedRatio * 100) : null,
    pronunciation: {
      accuracy: pick("accuracy"),
      stress: pick("stress"),
      intonation: pick("intonation"),
      rhythm: pick("rhythm"),
    },
    weekly,
    monthly,
    recent: sorted.slice(0, 6),
  };
}

export type EarnedAchievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress: number;
};

/** Achievements are computed from real activity only — nothing is pre-unlocked. */
export function buildAchievements(stats: ProgressStats): EarnedAchievement[] {
  const ratio = (value: number, target: number) =>
    Math.max(0, Math.min(100, Math.round((value / target) * 100)));

  const defs: { id: string; title: string; description: string; emoji: string; progress: number }[] = [
    {
      id: "first-conversation",
      title: "First Conversation",
      description: "Speak with your coach for the very first time.",
      emoji: "🌱",
      progress: ratio(stats.conversations, 1),
    },
    {
      id: "streak-7",
      title: "7-Day Streak",
      description: "Practise on seven days in a row.",
      emoji: "🔥",
      progress: ratio(stats.streakDays, 7),
    },
    {
      id: "ten-sessions",
      title: "Brave Speaker",
      description: "Complete ten practice sessions.",
      emoji: "🦁",
      progress: ratio(stats.totalSessions, 10),
    },
    {
      id: "sixty-minutes",
      title: "One Hour Spoken",
      description: "Spend sixty minutes speaking English.",
      emoji: "⏳",
      progress: ratio(stats.totalMinutes, 60),
    },
    {
      id: "streak-30",
      title: "30-Day Streak",
      description: "A full month of showing up for your voice.",
      emoji: "🏔️",
      progress: ratio(stats.streakDays, 30),
    },
    {
      id: "confident",
      title: "Confident Communicator",
      description: "Reach a confidence score of 85.",
      emoji: "🌟",
      progress: ratio(stats.confidence ?? 0, 85),
    },
  ];

  return defs.map((def) => ({ ...def, unlocked: def.progress >= 100 }));
}
