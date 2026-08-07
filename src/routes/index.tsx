import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  HeartHandshake,
  MessageCircleHeart,
  Mic,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { conversationTopics, faqs, pricing, testimonials } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoiceGym — Speak English Without Fear" },
      {
        name: "description",
        content:
          "AI-powered speaking practice that feels like talking to a supportive coach. Build confidence, not perfection.",
      },
      { property: "og:title", content: "VoiceGym — Speak English Without Fear" },
      {
        property: "og:description",
        content:
          "Practise real conversations with a calm AI coach. Gentle corrections, confidence tracking, daily challenges.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: MessageCircleHeart,
    title: "AI Conversation Coach",
    body: "Speak naturally about job interviews, classrooms, restaurants and more. Your coach waits, listens and replies kindly.",
  },
  {
    icon: Mic,
    title: "Pronunciation Coach",
    body: "See accuracy, stress, intonation and rhythm — always framed as one small, doable improvement.",
  },
  {
    icon: TrendingUp,
    title: "Confidence Tracker",
    body: "We measure courage, not just correctness: fear reduction, consistency and time spent actually speaking.",
  },
  {
    icon: Sparkles,
    title: "Daily Challenge",
    body: "One short prompt a day. Sixty seconds of speaking is enough to keep your streak and your nerve alive.",
  },
  {
    icon: ShieldCheck,
    title: "A Judgement-Free Room",
    body: "No scores shouted in red, no public leaderboard. Your practice is private and yours to delete.",
  },
  {
    icon: HeartHandshake,
    title: "Encouragement First",
    body: "Every piece of feedback starts with what you did well, then offers one gentle idea to try next.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="surface-glow relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="animate-rise">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs font-medium">
              For anyone who freezes before speaking
            </Badge>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Speak English <span className="text-gradient-brand">Without Fear.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Build confidence through AI-powered speaking practice that feels like talking to a
              supportive coach.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7 shadow-lift">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start Speaking Free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/practice">Try a conversation</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              No card needed · Private sessions · Speak or type, your choice
            </p>
          </div>

          <div className="relative animate-rise">
            <div className="absolute -inset-6 rounded-[3rem] bg-primary/10 blur-2xl" aria-hidden />
            <Card className="relative rounded-[2.25rem] border-border/60 shadow-lift">
              <CardContent className="space-y-4 p-7">
                <div className="flex items-center gap-3">
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <span className="absolute inset-0 rounded-2xl bg-primary/25 animate-breathe" aria-hidden />
                    <Waves className="relative size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Your coach</p>
                    <p className="text-xs text-muted-foreground">Listening, no rush</p>
                  </div>
                </div>
                <div className="rounded-3xl rounded-tl-lg bg-secondary px-5 py-4 text-sm leading-relaxed">
                  Take your time. Tell me about a day you enjoyed recently.
                </div>
                <div className="ml-auto max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-5 py-4 text-sm leading-relaxed text-primary-foreground">
                  Ehm… last Saturday I go to the beach with my friends.
                </div>
                <div className="rounded-3xl rounded-tl-lg bg-secondary px-5 py-4 text-sm leading-relaxed">
                  <span className="font-medium">That was clear — I pictured it instantly.</span> One
                  tiny idea when you're ready: “I went to the beach.” Now tell me, what did you eat
                  there?
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="grid gap-5 rounded-[2rem] bg-secondary/60 p-8 sm:grid-cols-3">
          {[
            { k: "3 minutes", v: "to your first spoken sentence" },
            { k: "0 judgement", v: "no shame, no red corrections" },
            { k: "12 min/day", v: "average time our learners speak" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-2xl font-semibold">{s.k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            This is not another grammar website.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Most people who "can't speak English" already know the words. What stops them is the
            fear of sounding wrong. VoiceGym gives you a private room, a patient coach and a reason
            to open your mouth every single day.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="rounded-3xl border-border/60 shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <CardContent className="space-y-3 p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <h2 className="text-3xl font-semibold sm:text-4xl">Choose the room you want to practise in</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {conversationTopics.map((topic) => (
            <Link
              key={topic.id}
              to="/practice"
              className="group flex items-center gap-3 rounded-full border border-border/70 bg-card px-5 py-3 text-sm font-medium shadow-soft transition-colors hover:border-primary/40 hover:bg-primary-soft/50"
            >
              <span aria-hidden className="text-lg">{topic.emoji}</span>
              {topic.title}
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <h2 className="text-3xl font-semibold sm:text-4xl">Learners who stopped freezing</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="rounded-3xl border-border/60 bg-secondary/50 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm leading-relaxed">“{t.quote}”</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <h2 className="text-3xl font-semibold sm:text-4xl">Everything is free. Always.</h2>
        <p className="mt-3 text-muted-foreground">
          No plans, no cards, no locked rooms. Sign in and every feature is already yours.
        </p>
        <Card className="mt-8 rounded-[2rem] border-primary/30 bg-primary-soft/40 shadow-lift">
          <CardContent className="p-8">
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              {freeIncludes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 rounded-full px-7">
              <Link to="/auth" search={{ mode: "signup" }}>Start Speaking Free</Link>
            </Button>
          </CardContent>
        </Card>
      </section>


      <section className="mx-auto w-full max-w-3xl px-5 py-12">
        <h2 className="text-3xl font-semibold sm:text-4xl">Questions people ask us</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="surface-glow rounded-[2.5rem] border border-border/60 px-8 py-14 text-center shadow-soft">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            Your first sentence is the hardest. Let's get it over with today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Nobody is listening but your coach — and your coach is on your side.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-full px-8 shadow-lift">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start Speaking Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
