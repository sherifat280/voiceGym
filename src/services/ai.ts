/**
 * Placeholder AI service layer.
 *
 * Every function here has the shape it will keep once real providers are
 * connected (Gemini for conversation + feedback, a speech-to-text provider for
 * transcription, and text-to-speech for the coach's voice). Swap the bodies for
 * real server-function calls without touching the UI.
 */

export type CoachMessage = {
  id: string;
  role: "coach" | "learner";
  text: string;
  encouragement?: string;
  gentleNote?: string;
};

export type PronunciationReport = {
  accuracy: number;
  stress: number;
  intonation: number;
  rhythm: number;
  encouragement: string;
  suggestion: string;
};

const encouragements = [
  "That was clear — I understood you completely.",
  "Nice, you kept going even when the sentence got long.",
  "Lovely energy. You sound more relaxed than a minute ago.",
  "Good one. You used a full sentence without pausing.",
  "You're doing the hard part: speaking anyway.",
];

const gentleNotes = [
  "Tiny thing, whenever you're ready: try \"I have been\" instead of \"I am been\".",
  "One small idea: add \"because\" and give me a reason — it stretches your sentence naturally.",
  "If you like, slow down slightly on longer words. No rush at all.",
  "You could say \"I'd love to\" — it sounds warm and natural.",
];

const followUps = [
  "Tell me more about that — what happened next?",
  "That's interesting. How did that make you feel?",
  "Great. Can you describe it in a little more detail?",
  "Nice. And what would you say if someone disagreed with you?",
  "Thanks for sharing. What's one thing you'd change about it?",
];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Replace with a Gemini conversation call (streamed) behind a server function. */
export async function sendToCoach(input: string, topicTitle: string): Promise<CoachMessage> {
  await delay(700);
  const shouldNote = input.trim().split(/\s+/).length > 4 && Math.random() > 0.45;
  return {
    id: crypto.randomUUID(),
    role: "coach",
    text: `${pick(followUps)}`,
    encouragement: pick(encouragements),
    gentleNote: shouldNote ? pick(gentleNotes) : undefined,
  };
}

/** Replace with a speech-to-text provider (streaming transcription). */
export async function transcribeSpeech(): Promise<string> {
  await delay(1200);
  return pick([
    "I think my favourite part of the day is the morning, because it is quiet.",
    "Yesterday I went to the market with my sister and we bought some fruit.",
    "I am a little nervous but I want to practise for my interview next week.",
  ]);
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
