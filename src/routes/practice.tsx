import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Send, Sparkles, Square, Volume2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { conversationTopics, type ConversationTopic } from "@/lib/sample-data";
import { startRecording, type Recorder } from "@/lib/recorder";
import { sendToCoach, transcribeSpeech, type CoachMessage } from "@/services/ai";
import { logPracticeSession } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { confidenceFromActivity } from "@/lib/progress";

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

type Phase = "idle" | "listening" | "transcribing" | "thinking";

function ConversationRoom({
  topic,
  onLeave,
}: {
  topic: ConversationTopic;
  onLeave: () => void;
}) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<Recorder | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const startedAtRef = useRef<number>(Date.now());
  const activityRef = useRef({ turns: 0, words: 0 });
  const savedRef = useRef(false);

  /** Saves the session only when the learner genuinely spoke at least once. */
  const saveSession = async () => {
    const { turns, words } = activityRef.current;
    if (savedRef.current || !user || turns === 0) return;
    savedRef.current = true;
    await logPracticeSession(user.id, {
      kind: "conversation",
      topic: topic.title,
      durationSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
      turns,
      wordsSpoken: words,
      confidence: confidenceFromActivity(turns, words),
      note: `You took ${turns} speaking ${turns === 1 ? "turn" : "turns"} in this conversation.`,
    });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  useEffect(
    () => () => {
      recorderRef.current?.cancel();
      void saveSession();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const busy = phase !== "idle";

  /** Adds the learner turn, then asks the coach for exactly one reply. */
  const say = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || phase === "thinking") return;

    const history = [
      ...messages.map((m) => ({ role: m.role, text: m.text })),
      { role: "learner" as const, text: trimmed },
    ];
    activityRef.current = {
      turns: activityRef.current.turns + 1,
      words: activityRef.current.words + trimmed.split(/\s+/).filter(Boolean).length,
    };
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "learner", text: trimmed }]);
    setInput("");
    setError(null);
    setPhase("thinking");

    try {
      const reply = await sendToCoach(history, topic.title);
      if (reply) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "coach", text: reply }]);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setPhase("idle");
    }
  };

  const startListening = async () => {
    if (busy) return;
    setError(null);
    try {
      recorderRef.current = await startRecording();
      setPhase("listening");
    } catch {
      setError("We need microphone access to hear you. Please allow it and try again.");
      setPhase("idle");
    }
  };

  const stopListening = async () => {
    const recorder = recorderRef.current;
    if (!recorder || phase !== "listening") return;
    recorderRef.current = null;
    setPhase("transcribing");
    try {
      const audio = await recorder.stop();
      const transcript = await transcribeSpeech(audio);
      if (!transcript) {
        setPhase("idle");
        setError("I didn't catch anything — tap the mic and speak whenever you're ready.");
        return;
      }
      await say(transcript);
    } catch (caught) {
      setPhase("idle");
      setError(caught instanceof Error ? caught.message : "We couldn't hear that clearly.");
    }
  };

  const statusLabel =
    phase === "listening"
      ? "Listening…"
      : phase === "transcribing"
        ? "Writing down what you said…"
        : phase === "thinking"
          ? "Thinking…"
          : null;

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
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              void saveSession().then(onLeave);
            }}
          >
            Choose another topic
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-border/60 shadow-soft">
        <CardContent className="p-0">
          <div className="max-h-[26rem] space-y-4 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="rounded-3xl bg-secondary/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground">You start whenever you're ready.</p>
                <p className="mt-1">
                  Tap the mic and speak, or type instead. Your coach stays quiet until you've
                  finished — then replies once and waits for you again.
                </p>
                <p className="mt-2 italic">Something you could talk about: {topic.opener}</p>
              </div>
            ) : null}

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

            {statusLabel ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                {phase === "listening" ? (
                  <span className="size-2.5 shrink-0 rounded-full bg-primary animate-breathe" aria-hidden />
                ) : (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {statusLabel}
              </p>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border/60 p-5">
            {error ? (
              <p className="mb-3 rounded-2xl bg-destructive/10 px-4 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
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
                variant={phase === "listening" ? "default" : "outline"}
                className="relative size-11 shrink-0 rounded-full"
                disabled={phase === "transcribing" || phase === "thinking"}
                onClick={() => void (phase === "listening" ? stopListening() : startListening())}
                aria-label={phase === "listening" ? "Stop recording" : "Start speaking"}
              >
                {phase === "listening" ? (
                  <>
                    <span className="absolute inset-0 rounded-full bg-primary/30 animate-breathe" aria-hidden />
                    <Square className="relative size-4" />
                  </>
                ) : (
                  <Mic className="relative size-4" />
                )}
              </Button>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={busy}
                placeholder={
                  phase === "listening" ? "Listening… tap stop when you're done" : "Speak, or type if you prefer"
                }
                className="h-11 rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                className="size-11 shrink-0 rounded-full"
                disabled={busy || !input.trim()}
                aria-label="Send"
              >
                <Send className="size-4" />
              </Button>
            </form>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Volume2 className="size-3.5" />
              Your coach only replies after you speak, then waits for your next turn.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

