import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, Loader2, Mic, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/voicegym/EmptyState";
import { analysePronunciation, type PronunciationReport } from "@/services/ai";
import { logPracticeSession, useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/pronunciation")({
  head: () => ({
    meta: [
      { title: "Pronunciation Coach — VoiceGym" },
      {
        name: "description",
        content:
          "See your accuracy, stress, intonation and rhythm with encouraging, shame-free suggestions.",
      },
      { property: "og:title", content: "Pronunciation Coach — VoiceGym" },
      {
        property: "og:description",
        content: "Accuracy, stress, intonation and rhythm feedback that encourages first.",
      },
    ],
  }),
  component: Pronunciation,
});

const practicePhrase = "I'd really appreciate the opportunity to work with your team.";

const metricHints: Record<string, string> = {
  Accuracy: "How closely your sounds matched the phrase.",
  Stress: "Which syllables you leaned on.",
  Intonation: "How your pitch moved through the sentence.",
  Rhythm: "Your pacing and pauses.",
};

function Pronunciation() {
  const [report, setReport] = useState<PronunciationReport | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const { user } = useAuth();
  const { stats, loading, refresh } = useProgress();

  const run = async () => {
    setAnalysing(true);
    const started = Date.now();
    const result = await analysePronunciation(practicePhrase);
    setReport(result);
    setAnalysing(false);

    if (user) {
      await logPracticeSession(user.id, {
        kind: "pronunciation",
        topic: "Pronunciation drill",
        durationSeconds: Math.max(20, Math.round((Date.now() - started) / 1000)),
        turns: 1,
        wordsSpoken: practicePhrase.split(/\s+/).length,
        confidence: result.accuracy,
        accuracy: result.accuracy,
        stress: result.stress,
        intonation: result.intonation,
        rhythm: result.rhythm,
        note: result.suggestion,
      });
      await refresh();
    }
  };

  const averages = [
    ["Accuracy", stats.pronunciation.accuracy],
    ["Stress", stats.pronunciation.stress],
    ["Intonation", stats.pronunciation.intonation],
    ["Rhythm", stats.pronunciation.rhythm],
  ] as const;

  return (
    <AppShell title="Pronunciation Coach" subtitle="Clear is the goal. Perfect is not required.">
      <div className="space-y-6">
        <Card className="surface-glow rounded-[2rem] border-border/60 shadow-soft animate-rise">
          <CardContent className="space-y-5 p-7">
            <Badge variant="secondary" className="rounded-full">Say this out loud</Badge>
            <p className="font-display text-2xl leading-snug">“{practicePhrase}”</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="relative rounded-full" onClick={() => void run()} disabled={analysing}>
                {analysing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Listening…
                  </>
                ) : (
                  <>
                    <Mic className="size-4" /> Record and analyse
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Nobody hears this but you. Try as many times as you like.
              </p>
            </div>
          </CardContent>
        </Card>

        {report ? (
          <Card className="rounded-3xl border-border/60 bg-success/10 shadow-soft animate-rise">
            <CardContent className="space-y-3 p-6">
              <p className="flex items-center gap-2 font-medium">
                <Sparkles className="size-4 text-success" />
                {report.encouragement}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{report.suggestion}</p>
              <div className="grid gap-3 pt-2 sm:grid-cols-4">
                {[
                  ["Accuracy", report.accuracy],
                  ["Stress", report.stress],
                  ["Intonation", report.intonation],
                  ["Rhythm", report.rhythm],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl bg-card p-4">
                    <p className="text-xs text-muted-foreground">{label as string}</p>
                    <p className="font-display text-xl font-semibold">{value as number}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="rounded-3xl border-border/60 shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div>
              <h3 className="text-lg font-semibold">Your averages</h3>
              <p className="text-sm text-muted-foreground">
                From your last {Math.min(10, stats.pronunciationExercises)} pronunciation exercises.
              </p>
            </div>
            {loading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-secondary/70" />
            ) : stats.pronunciationExercises === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="Nothing to score yet"
                description="Record the phrase above once and your accuracy, stress, intonation and rhythm averages will appear here."
              />
            ) : (
              averages.map(([metric, score]) => (
                <div key={metric} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{metric}</span>
                    <span className="text-muted-foreground">{score ?? "—"}</span>
                  </div>
                  <Progress value={score ?? 0} className="h-2.5" />
                  <p className="text-xs leading-relaxed text-muted-foreground">{metricHints[metric]}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
