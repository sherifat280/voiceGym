import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, Flame, HeartPulse, Mic, Sparkles, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/voicegym/StatCard";
import { EmptyState } from "@/components/voicegym/EmptyState";
import { ConfidenceChart, MinutesChart, MonthlyChart } from "@/components/voicegym/Charts";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress & Confidence Tracker — VoiceGym" },
      {
        name: "description",
        content:
          "Your own speaking progress: confidence growth, minutes spoken, streaks and pronunciation — all from your real practice.",
      },
      { property: "og:title", content: "Progress & Confidence Tracker — VoiceGym" },
      {
        property: "og:description",
        content: "Track confidence growth, minutes spoken and consistency from your real sessions.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { stats, loading, signedIn } = useProgress();

  if (loading) {
    return (
      <AppShell title="Your progress" subtitle="Loading your practice history…">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-secondary/70" />
          ))}
        </div>
      </AppShell>
    );
  }

  if (!signedIn) {
    return (
      <AppShell title="Your progress" subtitle="Sign in to see your own progress.">
        <EmptyState
          icon={Sparkles}
          title="Sign in to start tracking"
          description="Your progress is private to your account. Sign in and your speaking history will appear here."
          action={
            <Button asChild className="rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const confidenceMetrics = [
    {
      label: "Confidence score",
      value: stats.confidence ?? 0,
      note:
        stats.confidence === null
          ? "Complete a conversation to get your first score."
          : stats.confidenceDelta === null
            ? "Based on your most recent sessions."
            : `${stats.confidenceDelta >= 0 ? "+" : ""}${stats.confidenceDelta} vs. your earlier sessions`,
    },
    {
      label: "Speaking consistency",
      value: stats.consistency,
      note: `You practised on ${Math.round((stats.consistency / 100) * 14)} of the last 14 days`,
    },
    {
      label: "Fear reduction",
      value: stats.fearReduction ?? 0,
      note:
        stats.fearReduction === null
          ? "Measured once you start finishing sessions."
          : "Based on how often you stay through a full session.",
    },
  ];

  return (
    <AppShell title="Your progress" subtitle="Everything here comes from sessions you actually did.">
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Confidence"
            value={stats.confidence === null ? "—" : `${stats.confidence}`}
            hint={stats.confidence === null ? "Not started" : "From your recent sessions"}
          />
          <StatCard
            icon={Clock}
            label="Speaking time"
            value={`${stats.totalMinutes} min`}
            hint="All time"
          />
          <StatCard
            icon={Mic}
            label="Speaking sessions"
            value={`${stats.totalSessions}`}
            hint={`${stats.sessionsThisMonth} this month`}
          />
          <StatCard
            icon={BookOpen}
            label="Words spoken"
            value={`${stats.wordsSpoken}`}
            hint={`${stats.conversations} conversations`}
          />
        </div>

        {!stats.hasActivity ? (
          <EmptyState
            icon={Mic}
            title="You're just getting started"
            description="Complete your first speaking session and your confidence, minutes and streak will start showing up here."
            action={
              <Button asChild className="rounded-full">
                <Link to="/practice">Start my first session</Link>
              </Button>
            }
          />
        ) : (
          <>
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
                    <ConfidenceChart data={stats.weekly} />
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-border/60 shadow-soft">
                  <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold">Minutes spoken</h3>
                    <MinutesChart data={stats.weekly} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monthly" className="mt-5 grid gap-6">
                <Card className="rounded-3xl border-border/60 shadow-soft">
                  <CardContent className="space-y-4 p-6">
                    <h3 className="text-lg font-semibold">Confidence & sessions by week</h3>
                    <MonthlyChart data={stats.monthly} />
                    <p className="text-sm text-muted-foreground">
                      Blue is your confidence score, teal is how many sessions you completed.
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
                  <p className="font-semibold">
                    {stats.streakDays === 0
                      ? "No streak yet"
                      : `${stats.streakDays}-day speaking streak`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.streakDays === 0
                      ? "Practise today to start one. A single session counts."
                      : "Missing a day won't erase your progress. Come back whenever you're ready."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
