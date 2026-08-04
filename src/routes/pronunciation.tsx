import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mic, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { pronunciationBreakdown, pronunciationWords } from "@/lib/sample-data";
import { analysePronunciation, type PronunciationReport } from "@/services/ai";

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

function Pronunciation() {
  const [report, setReport] = useState<PronunciationReport | null>(null);
  const [analysing, setAnalysing] = useState(false);

  const run = async () => {
    setAnalysing(true);
    const result = await analysePronunciation(practicePhrase);
    setReport(result);
    setAnalysing(false);
  };

  return (
    <AppShell
      title="Pronunciation Coach"
      subtitle="Clear is the goal. Perfect is not required."
    >
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-border/60 shadow-soft">
            <CardContent className="space-y-5 p-6">
              <h3 className="text-lg font-semibold">Your recent averages</h3>
              {pronunciationBreakdown.map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.metric}</span>
                    <span className="text-muted-foreground">{item.score}</span>
                  </div>
                  <Progress value={item.score} className="h-2.5" />
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.hint}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold">Words worth one more try</h3>
              <p className="text-sm text-muted-foreground">
                These aren't mistakes — they're just the next small wins.
              </p>
              <div className="space-y-3">
                {pronunciationWords.map((word) => (
                  <div key={word.word} className="rounded-2xl bg-secondary/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{word.word}</p>
                      <Badge variant="secondary" className="rounded-full">{word.score}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{word.tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
