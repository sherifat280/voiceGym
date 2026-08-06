import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const form = await request.formData();
        const audio = form.get("audio");
        if (!(audio instanceof File) || audio.size < 2048) {
          return Response.json({ text: "" });
        }
        if (audio.size > 20 * 1024 * 1024) {
          return new Response("Recording too long", { status: 413 });
        }

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", audio, "recording.wav");

        const response = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: upstream,
          },
        );

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          return new Response(detail || "Transcription failed", {
            status: response.status,
          });
        }

        const data = (await response.json()) as { text?: string };
        return Response.json({ text: (data.text ?? "").trim() });
      },
    },
  },
});
