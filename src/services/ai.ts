/**
 * AI service layer.
 *
 * Conversation and speech-to-text are live (server routes backed by Lovable AI).
 * Text-to-speech and pronunciation analysis are still placeholders.
 */

export type CoachMessage = {
  id: string;
  role: "coach" | "learner";
  text: string;
  encouragement?: string | undefined;
  gentleNote?: string | undefined;
};

export type PronunciationReport = {
  accuracy: number;
  stress: number;
  intonation: number;
  rhythm: number;
  encouragement: string;
  suggestion: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends the conversation so far and returns the coach's single reply.
 * Returns an empty string when the learner has not said anything.
 */
export async function sendToCoach(
  messages: { role: "coach" | "learner"; text: string }[],
  topicTitle: string,
): Promise<string> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topicTitle, messages }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 429) throw new Error("Too many requests right now — try again in a moment.");
    if (response.status === 402) throw new Error("The AI service is out of credits.");
    throw new Error(detail || "The coach could not reply right now.");
  }

  const data = (await response.json()) as { text?: string };
  return (data.text ?? "").trim();
}

/** Transcribes a recorded WAV clip. Returns "" when nothing was said. */
export async function transcribeSpeech(audio: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", audio, "recording.wav");

  const response = await fetch("/api/transcribe", { method: "POST", body: form });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "We couldn't hear that clearly. Please try again.");
  }

  const data = (await response.json()) as { text?: string };
  return (data.text ?? "").trim();
}


/** Replace with a text-to-speech provider; returns an audio URL to play. */
export async function speak(_text: string): Promise<{ audioUrl: string | null }> {
  await delay(200);
  return { audioUrl: null };
}

/** Replace with pronunciation analysis (audio in, per-metric scores out). */
export async function analysePronunciation(_phrase: string): Promise<PronunciationReport> {
  await delay(1400);
  const base = 68 + Math.floor(Math.random() * 20);
  return {
    accuracy: base,
    stress: Math.max(55, base - 6),
    intonation: Math.max(55, base - 9),
    rhythm: Math.max(55, base - 3),
    encouragement: "Your message came through clearly — that's what matters most.",
    suggestion: "Next round, try holding the vowel in 'really' a touch longer.",
  };
}

export const aiServiceStatus = {
  conversation: "placeholder",
  speechToText: "placeholder",
  textToSpeech: "placeholder",
  pronunciation: "placeholder",
} as const;
