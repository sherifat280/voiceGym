import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/voicegym/StatCard";
import { ConfidenceChart } from "@/components/voicegym/Charts";
import { dailyChallenge, learner, recentSessions, weeklyProgress } from "@/lib/sample-data";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your VoiceGym dashboard" },
      {
        name: "description",
        content: "Confidence level, speaking streak, daily goal and recent practice sessions.",
      },
      { property: "og:title", content: "Your VoiceGym dashboard" },
      {
        property: "og:description",
        content: "Confidence level, speaking streak, daily goal and recent practice sessions.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const goalPct = Math.round((learner.minutesToday / learner.dailyGoalMinutes) * 100);
  const { displayName } = useAuth();

  return (
    <AppShell title={`Hello, ${displayName}`} subtitle="You're safe here. Let's speak a little today.">
      <div className="space-y-8">
        <Card className="surface-glow rounded-[2rem] border-border/60 shadow-soft animate-rise">
          <CardContent className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg space-y-2">
              <Badge variant="secondary" className="rounded-full">Today's daily challenge</Badge>
              <h2 className="text-2xl font-semibold">{dailyChallenge.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{dailyChallenge.prompt}</p>
              <p className="text-xs text-muted-foreground">
                {dailyChallenge.minutes} minute · {dailyChallenge.reward}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full shadow-soft">
              <Link to="/practice">
                Continue Learning
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Confidence level"
            value={`${learner.confidenceScore}`}
            hint={`+${learner.confidenceDelta} this week`}
          />
          <StatCard icon={Flame} label="Speaking streak" value={`${learner.streakDays} days`} hint="Keep it gentle" />
          <StatCard
            icon={Target}
            label="Daily goal"
            value={`${learner.minutesToday}/${learner.dailyGoalMinutes} min`}
            hint={`${goalPct}% done`}
          />
          <StatCard
            icon={Sparkles}
            label="Sessions"
            value={`${learner.sessionsTotal}`}
            hint={`${learner.conversationMinutes} min spoken`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-3xl border-border/60 shadow-soft">
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold">Progress overview</h3>
                <p className="text-sm text-muted-foreground">Confidence over the last 7 days</p>
              </div>
              <ConfidenceChart data={weeklyProgress} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 shadow-soft">
            <CardContent className="space-y-5 p-6">
              <h3 className="text-lg font-semibold">Today's goal</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Speaking time</span>
                  <span className="font-medium">
                    {learner.minutesToday} / {learner.dailyGoalMinutes} min
                  </span>
                </div>
                <Progress value={goalPct} className="h-2.5" />
              </div>
              <p className="rounded-2xl bg-secondary/70 p-4 text-sm leading-relaxed text-muted-foreground">
                You're {learner.dailyGoalMinutes - learner.minutesToday} minutes away. That's one
                short conversation about your day.
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
          <div className="grid gap-3">
            {recentSessions.map((session) => (
              <Card key={session.id} className="rounded-3xl border-border/60 shadow-soft">
                <CardContent className="flex flex-wrap items-center gap-4 p-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl" aria-hidden>
                    {session.emoji}
                  </span>
                  <div className="min-w-[12rem] flex-1">
                    <p className="font-medium">{session.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.date} · {session.minutes} min
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{session.note}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    Confidence {session.confidence}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
