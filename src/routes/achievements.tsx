import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/lib/sample-data";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — VoiceGym" },
      {
        name: "description",
        content:
          "Unlock badges for bravery: First Conversation, Brave Speaker, Fear Conqueror and more.",
      },
      { property: "og:title", content: "Achievements — VoiceGym" },
      {
        property: "og:description",
        content: "Badges that celebrate courage, consistency and confidence — not perfection.",
      },
    ],
  }),
  component: Achievements,
});

function Achievements() {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <AppShell title="Achievements" subtitle="Badges for courage, not for being correct.">
      <div className="space-y-6">
        <Card className="surface-glow rounded-[2rem] border-border/60 shadow-soft animate-rise">
          <CardContent className="space-y-2 p-7">
            <h2 className="text-2xl font-semibold">
              {unlocked} of {achievements.length} unlocked
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Every badge here was earned by speaking when it felt uncomfortable. That's the whole
              skill.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`rounded-3xl shadow-soft transition-transform duration-300 hover:-translate-y-1 ${
                achievement.unlocked ? "border-primary/30 bg-primary-soft/40" : "border-border/60"
              }`}
            >
              <CardContent className="space-y-3 p-6">
                <div className="flex items-start justify-between">
                  <span className={`text-4xl ${achievement.unlocked ? "" : "opacity-40 grayscale"}`} aria-hidden>
                    {achievement.emoji}
                  </span>
                  <Badge variant={achievement.unlocked ? "default" : "secondary"} className="rounded-full">
                    {achievement.unlocked ? "Unlocked" : "In progress"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                {!achievement.unlocked && achievement.progress !== undefined ? (
                  <div className="space-y-1.5 pt-1">
                    <Progress value={achievement.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{achievement.progress}% there</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
