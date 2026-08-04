import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Flame, HeartPulse, Mic, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/voicegym/StatCard";
import { ConfidenceChart, MinutesChart, MonthlyChart } from "@/components/voicegym/Charts";
import { learner, monthlyProgress, weeklyProgress } from "@/lib/sample-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress & Confidence Tracker — VoiceGym" },
      {
        name: "description",
        content:
          "Weekly and monthly speaking progress: confidence growth, fear reduction, vocabulary and streaks.",
      },
      { property: "og:title", content: "Progress & Confidence Tracker — VoiceGym" },
      {
        property: "og:description",
        content: "Track confidence growth, fear reduction, vocabulary and speaking consistency.",
      },
    ],
  }),
  component: ProgressPage,
});

const confidenceMetrics = [
  { label: "Confidence score", value: learner.confidenceScore, note: "Up 8 points this month" },
  { label: "Speaking consistency", value: learner.consistency, note: "You spoke on 6 of the last 7 days" },
  { label: "Fear reduction", value: learner.fearReduction, note: "Based on how often you finish sessions" },
];

function ProgressPage() {
  return (
    <AppShell title="Your progress" subtitle="Growth you can actually see — not just corrections.">
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={TrendingUp} label="Confidence" value={`${learner.confidenceScore}`} hint="+8 this month" />
          <StatCard icon={Clock} label="Conversation time" value={`${learner.conversationMinutes} min`} hint="All time" />
          <StatCard icon={Mic} label="Speaking sessions" value={`${learner.sessionsTotal}`} hint="12 this month" />
          <StatCard icon={BookOpen} label="Vocabulary learned" value={`${learner.vocabularyLearned}`} hint="+33 this week" />
        </div>

        <Card className="rounded-3xl border-border/60 shadow-soft">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-2">
              <HeartPulse className="size-4 text-primary" />
              <h3 className="text-lg font-semibold">Confidence tracker</h3>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {confidenceMetrics.map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-muted-foreground">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2.5" />
                  <p className="text-xs text-muted-foreground">{metric.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly">
          <TabsList className="rounded-full bg-secondary p-1">
            <TabsTrigger value="weekly" className="rounded-full px-5">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-full px-5">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-5 grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border-border/60 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Confidence this week</h3>
                <ConfidenceChart data={weeklyProgress} />
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-border/60 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Minutes spoken</h3>
                <MinutesChart data={weeklyProgress} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-5 grid gap-6">
            <Card className="rounded-3xl border-border/60 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Confidence & vocabulary by week</h3>
                <MonthlyChart data={monthlyProgress} />
                <p className="text-sm text-muted-foreground">
                  Teal is your confidence score, green is new vocabulary. Both are moving up — keep
                  going at your own pace.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="surface-glow rounded-3xl border-border/60 shadow-soft">
          <CardContent className="flex flex-wrap items-center gap-4 p-6">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-foreground">
              <Flame className="size-5" />
            </span>
            <div>
              <p className="font-semibold">{learner.streakDays}-day speaking streak</p>
              <p className="text-sm text-muted-foreground">
                Missing a day won't erase your progress. Come back whenever you're ready.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
