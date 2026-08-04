import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Send, Sparkles, Volume2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { conversationTopics, type ConversationTopic } from "@/lib/sample-data";
import { sendToCoach, transcribeSpeech, type CoachMessage } from "@/services/ai";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "AI Conversation Coach — VoiceGym" },
      {
        name: "description",
        content:
          "Practise real-life English conversations with a patient AI coach. Job interviews, classrooms, restaurants and more.",
      },
      { property: "og:title", content: "AI Conversation Coach — VoiceGym" },
      {
        property: "og:description",
        content: "Practise real-life English conversations with a patient AI coach.",
      },
    ],
  }),
  component: Practice,
});

function Practice() {
  const [topic, setTopic] = useState<ConversationTopic | null>(null);

  return (
    <AppShell
      title="AI Conversation Coach"
      subtitle="Speak, type, pause — all of it counts as practice."
    >
      {topic ? (
        <ConversationRoom topic={topic} onLeave={() => setTopic(null)} />
      ) : (
        <TopicPicker onPick={setTopic} />
      )}
    </AppShell>
  );
}

function TopicPicker({ onPick }: { onPick: (topic: ConversationTopic) => void }) {
  return (
    <div className="space-y-6 animate-rise">
      <Card className="surface-glow rounded-[2rem] border-border/60 shadow-soft">
        <CardContent className="space-y-2 p-7">
          <h2 className="text-2xl font-semibold">Pick a room to practise in</h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Start with something gentle if today feels heavy. There's no wrong choice, and you can
            leave any conversation whenever you want.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {conversationTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onPick(topic)}
            className="group rounded-3xl border border-border/60 bg-card p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl" aria-hidden>{topic.emoji}</span>
              <Badge variant="secondary" className="rounded-full text-xs">{topic.level}</Badge>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{topic.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
            <p className="mt-4 text-xs text-muted-foreground">About {topic.minutes} minutes</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ConversationRoom({
  topic,
  onLeave,
}: {
  topic: ConversationTopic;
  onLeave: () => void;
}) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    { id: "opener", role: "coach", text: topic.opener },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const say = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "learner", text: trimmed }]);
    setInput("");
    setThinking(true);
    const reply = await sendToCoach(trimmed, topic.title);
    setMessages((prev) => [...prev, reply]);
    setThinking(false);
  };

  const startListening = async () => {
    if (listening || thinking) return;
    setListening(true);
    const transcript = await transcribeSpeech();
    setListening(false);
    await say(transcript);
  };

  return (
    <div className="space-y-5 animate-rise">
      <Card className="rounded-3xl border-border/60 shadow-soft">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-2xl" aria-hidden>
              {topic.emoji}
            </span>
            <div>
              <p className="font-semibold">{topic.title}</p>
              <p className="text-xs text-muted-foreground">
                {topic.level} · about {topic.minutes} minutes
              </p>
            </div>
          </div>
          <Button variant="ghost" className="rounded-full" onClick={onLeave}>
            Choose another topic
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-border/60 shadow-soft">
        <CardContent className="p-0">
          <div className="max-h-[26rem] space-y-4 overflow-y-auto p-6">
            {messages.map((message) =>
              message.role === "coach" ? (
                <div key={message.id} className="max-w-[88%] space-y-2">
                  {message.encouragement ? (
                    <p className="flex items-start gap-2 rounded-3xl rounded-tl-lg bg-success/10 px-4 py-3 text-sm text-foreground">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-success" />
                      {message.encouragement}
                    </p>
                  ) : null}
                  <p className="rounded-3xl rounded-tl-lg bg-secondary px-5 py-4 text-sm leading-relaxed">
                    {message.text}
                  </p>
                  {message.gentleNote ? (
                    <p className="rounded-3xl rounded-tl-lg bg-accent-soft px-4 py-3 text-sm leading-relaxed text-accent-foreground">
                      {message.gentleNote}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p
                  key={message.id}
                  className="ml-auto max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-5 py-4 text-sm leading-relaxed text-primary-foreground"
                >
                  {message.text}
                </p>
              ),
            )}
            {thinking ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Your coach is thinking…
              </p>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border/60 p-5">
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void say(input);
              }}
            >
              <Button
                type="button"
                size="icon"
                variant={listening ? "default" : "outline"}
                className="relative size-11 shrink-0 rounded-full"
                onClick={() => void startListening()}
                aria-label="Speak your answer"
              >
                {listening ? (
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-breathe" aria-hidden />
                ) : null}
                <Mic className="relative size-4" />
              </Button>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={listening ? "Listening… take your time" : "Speak, or type if you prefer"}
                className="h-11 rounded-full"
              />
              <Button type="submit" size="icon" className="size-11 shrink-0 rounded-full" aria-label="Send">
                <Send className="size-4" />
              </Button>
            </form>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Volume2 className="size-3.5" />
              Voice replies and live transcription connect through the AI service layer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
