import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  buildProgress,
  type PracticeKind,
  type PracticeSession,
  type ProgressStats,
} from "@/lib/progress";

export type LoggedSession = {
  kind: PracticeKind;
  topic?: string | null;
  durationSeconds: number;
  turns?: number;
  wordsSpoken?: number;
  confidence?: number | null;
  accuracy?: number | null;
  stress?: number | null;
  intonation?: number | null;
  rhythm?: number | null;
  note?: string | null;
};

/**
 * Reads the signed-in learner's own practice history and derives every progress
 * number from it. Signed-out or brand-new accounts get an all-zero state.
 */
export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("practice_sessions")
      .select(
        "id, kind, topic, duration_seconds, turns, words_spoken, confidence, accuracy, stress, intonation, rhythm, note, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500);
    setSessions((data ?? []) as PracticeSession[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const stats: ProgressStats = useMemo(() => buildProgress(sessions), [sessions]);

  return { stats, sessions, loading: loading || authLoading, refresh: load, signedIn: !!userId };
}

/** Records one genuinely completed activity for the signed-in learner. */
export async function logPracticeSession(userId: string, entry: LoggedSession) {
  if (!userId) return;
  await supabase.from("practice_sessions").insert({
    user_id: userId,
    kind: entry.kind,
    topic: entry.topic ?? null,
    duration_seconds: Math.max(0, Math.round(entry.durationSeconds)),
    turns: entry.turns ?? 0,
    words_spoken: entry.wordsSpoken ?? 0,
    confidence: entry.confidence ?? null,
    accuracy: entry.accuracy ?? null,
    stress: entry.stress ?? null,
    intonation: entry.intonation ?? null,
    rhythm: entry.rhythm ?? null,
    note: entry.note ?? null,
  });
}
