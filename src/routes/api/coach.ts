import { createFileRoute } from "@tanstack/react-router";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { generateText } from "ai";

type Turn = { role: "coach" | "learner"; text: string };
type Body = { topic?: string; messages?: Turn[] };

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as Body;
        const history = Array.isArray(body.messages) ? body.messages : [];
        const last = history[history.length - 1];

        // Never speak unless the learner actually said something.
        if (!last || last.role !== "learner" || !last.text.trim()) {
          return Response.json({ text: "" });
        }

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const { text } = await generateText({
            model: gateway("google/gemini-3.6-flash"),
            system: [
              "You are a warm, calm English conversation partner helping an ESL learner build confidence.",
              `The scenario is: ${body.topic ?? "everyday conversation"}.`,
              "Rules: reply ONLY to what the learner just said. Never greet, introduce yourself, narrate, or invent what the learner said.",
              "Keep replies to 1-3 short spoken sentences, then stop and wait. Ask at most one follow-up question.",
              "Prioritise encouragement over correction. Only mention a language fix if it genuinely blocks understanding, and keep it gentle and brief.",
              "Plain conversational text only — no markdown, no lists, no stage directions.",
            ].join(" "),
            messages: history.slice(-16).map((turn) => ({
              role: turn.role === "coach" ? ("assistant" as const) : ("user" as const),
              content: turn.text,
            })),
          });

          return Response.json({ text: text.trim() });
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI request failed";
          const status = /429/.test(message) ? 429 : /402/.test(message) ? 402 : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
