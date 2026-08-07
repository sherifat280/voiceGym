import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Mic, Sparkles, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/voicegym/StatCard";
import { EmptyState } from "@/components/voicegym/EmptyState";
import { ConfidenceChart } from "@/components/voicegym/Charts";
import { dailyChallenge } from "@/lib/sample-data";
import { DAILY_GOAL_MINUTES } from "@/lib/progress";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your VoiceGym dashboard" },
      {
        name: "description",
        content: "Confidence level, speaking streak, daily goal and your recent practice sessions.",
      },
      { property: "og:title", content: "Your VoiceGym dashboard" },
      {
        property: "og:description",
        content: "Confidence level, speaking streak, daily goal and your recent practice sessions.",
      },
    ],
  }),
  component: Dashboard,
});

function relativeDay(iso: string): string {
  const then = new Date(iso);
  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString();
}

function Dashboard() {
  const { displayName } = useAuth();
  const { stats, loading } = useProgress();

  const goalPct = Math.min(100, Math.round((stats.minutesToday / DAILY_GOAL_MINUTES) * 100));
  const remaining = Math.max(0, DAILY_GOAL_MINUTES - stats.minutesToday);

  return (
    <AppShell title={`Hello, ${displayName}`} subtitle="You're safe here. Let's speak a little today.">
      <div className="space-y-8">
        <Card className="surface-glow rounded-[2rem] border-border/60 shadow-soft animate-rise">
          <CardContent className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg space-y-2">
              <Badge variant="secondary" className="rounded-full">Today's daily challenge</Badge>
              <h2 className="text-2xl font-semibold">{dailyChallenge.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{dailyChallenge.prompt}</p>
              <p className="text-xs text-muted-foreground">{dailyChallenge.minutes} minute</p>
            </div>
            <Button asChild size="lg" className="rounded-full shadow-soft">
              <Link to="/practice">
                Start speaking
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Confidence level"
            value={stats.confidence === null ? "—" : `${stats.confidence}`}
            hint={
              stats.confidence === null
                ? "Not started"
                : stats.confidenceDelta === null
                  ? "From your recent sessions"
                  : `${stats.confidenceDelta >= 0 ? "+" : ""}${stats.confidenceDelta} recently`
            }
          />
          <StatCard
            icon={Flame}
            label="Speaking streak"
            value={`${stats.streakDays} ${stats.streakDays === 1 ? "day" : "days"}`}
            hint={stats.streakDays === 0 ? "Start one today" : "Keep it gentle"}
          />
          <StatCard
            icon={Target}
            label="Daily goal"
            value={`${stats.minutesToday}/${DAILY_GOAL_MINUTES} min`}
            hint={`${goalPct}% done`}
          />
          <StatCard
            icon={Sparkles}
            label="Sessions"
            value={`${stats.totalSessions}`}
            hint={`${stats.totalMinutes} min spoken`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-3xl border-border/60 shadow-soft">
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold">Progress overview</h3>
                <p className="text-sm text-muted-foreground">Confidence over the last 7 days</p>
              </div>
              {stats.hasActivity ? (
                <ConfidenceChart data={stats.weekly} />
              ) : (
                <p className="rounded-2xl bg-secondary/70 p-5 text-sm leading-relaxed text-muted-foreground">
                  Your confidence graph appears after your first speaking session. Nothing here is
                  pre-filled — this space is yours to earn.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-soft">
            <CardContent className="space-y-5 p-6">
              <h3 className="text-lg font-semibold">Today's goal</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Speaking time</span>
                  <span className="font-medium">
                    {stats.minutesToday} / {DAILY_GOAL_MINUTES} min
                  </span>
                </div>
                <Progress value={goalPct} className="h-2.5" />
              </div>
              <p className="rounded-2xl bg-secondary/70 p-4 text-sm leading-relaxed text-muted-foreground">
                {remaining === 0
                  ? "You've hit today's goal. Anything more is a bonus."
                  : `You're ${remaining} minutes away. That's one short conversation about your day.`}
              </p>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/pronunciation">Warm up my pronunciation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent sessions</h3>
            <Link to="/progress" className="text-sm font-medium text-primary hover:underline">
              See all progress
            </Link>
          </div>
          {loading ? (
            <div className="h-24 animate-pulse rounded-3xl bg-secondary/70" />
          ) : stats.recent.length === 0 ? (
            <EmptyState
              icon={Mic}
              title="No sessions yet"
              description="Complete your first speaking session to begin tracking your progress. It only takes a minute."
              action={
                <Button asChild className="rounded-full">
                  <Link to="/practice">Start a conversation</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3">
              {stats.recent.map((session) => (
                <Card key={session.id} className="rounded-3xl border-border/60 shadow-soft">
                  <CardContent className="flex flex-wrap items-center gap-4 p-5">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary" aria-hidden>
                      {session.kind === "pronunciation" ? <Mic className="size-5" /> : <Sparkles className="size-5" />}
                    </span>
                    <div className="min-w-[12rem] flex-1">
                      <p className="font-medium">{session.topic ?? "Practice session"}</p>
                      <p className="text-xs text-muted-foreground">
                        {relativeDay(session.created_at)} · {Math.max(1, Math.round(session.duration_seconds / 60))} min
                      </p>
                      {session.note ? (
                        <p className="mt-1 text-sm text-muted-foreground">{session.note}</p>
                      ) : null}
                    </div>
                    {session.confidence ? (
                      <Badge variant="secondary" className="rounded-full">
                        Confidence {session.confidence}
                      </Badge>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
