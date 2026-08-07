/**
 * Sample data for VoiceGym.
 * Replace these with real API/database reads when backend services are wired up.
 */

export type ConversationTopic = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  level: "Gentle" | "Everyday" | "Stretch";
  minutes: number;
  opener: string;
};

export const conversationTopics: ConversationTopic[] = [
  {
    id: "job-interview",
    title: "Job Interview",
    description: "Practise introducing yourself and answering common questions.",
    emoji: "💼",
    level: "Stretch",
    minutes: 8,
    opener: "Hi! Thanks for coming in today. Could you tell me a little about yourself?",
  },
  {
    id: "classroom",
    title: "Classroom",
    description: "Ask questions, share opinions and join group discussions.",
    emoji: "🎓",
    level: "Everyday",
    minutes: 6,
    opener: "Good morning! We're discussing our weekend projects. What did you work on?",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    description: "Order food, ask about the menu and handle small talk.",
    emoji: "🍜",
    level: "Gentle",
    minutes: 5,
    opener: "Welcome in! Table for one? Can I get you something to drink first?",
  },
  {
    id: "airport",
    title: "Airport",
    description: "Check in, ask for directions and talk to airline staff.",
    emoji: "✈️",
    level: "Everyday",
    minutes: 6,
    opener: "Good afternoon. May I see your passport and where are you flying today?",
  },
  {
    id: "meeting-people",
    title: "Meeting New People",
    description: "Break the ice and keep a friendly conversation going.",
    emoji: "👋",
    level: "Gentle",
    minutes: 5,
    opener: "Hey! I don't think we've met yet. I'm Sam — what brings you here today?",
  },
  {
    id: "presentation",
    title: "Presentation",
    description: "Open, structure and close a short talk with confidence.",
    emoji: "📊",
    level: "Stretch",
    minutes: 9,
    opener: "Whenever you're ready, take a breath and start your opening line.",
  },
  {
    id: "phone-call",
    title: "Phone Call",
    description: "Handle calls without seeing the other person's face.",
    emoji: "📞",
    level: "Stretch",
    minutes: 6,
    opener: "Hello, thanks for calling. How can I help you today?",
  },
];

export const learner = {
  name: "Amara",
  confidenceScore: 72,
  confidenceDelta: 8,
  streakDays: 12,
  dailyGoalMinutes: 15,
  minutesToday: 9,
  sessionsTotal: 48,
  conversationMinutes: 386,
  fearReduction: 64,
  consistency: 81,
  vocabularyLearned: 214,
};

export type Session = {
  id: string;
  topic: string;
  emoji: string;
  date: string;
  minutes: number;
  confidence: number;
  note: string;
};

export const recentSessions: Session[] = [
  {
    id: "s1",
    topic: "Job Interview",
    emoji: "💼",
    date: "Today",
    minutes: 9,
    confidence: 78,
    note: "You answered the 'tell me about yourself' question without pausing. Big step.",
  },
  {
    id: "s2",
    topic: "Restaurant",
    emoji: "🍜",
    date: "Yesterday",
    minutes: 6,
    confidence: 74,
    note: "Your questions sounded natural and relaxed today.",
  },
  {
    id: "s3",
    topic: "Meeting New People",
    emoji: "👋",
    date: "2 days ago",
    minutes: 7,
    confidence: 70,
    note: "You kept the conversation going for a full 7 minutes — your longest yet.",
  },
  {
    id: "s4",
    topic: "Phone Call",
    emoji: "📞",
    date: "3 days ago",
    minutes: 5,
    confidence: 66,
    note: "You recovered smoothly after losing your train of thought. That's real progress.",
  },
];

export const weeklyProgress = [
  { label: "Mon", confidence: 62, minutes: 12 },
  { label: "Tue", confidence: 65, minutes: 15 },
  { label: "Wed", confidence: 64, minutes: 8 },
  { label: "Thu", confidence: 69, minutes: 18 },
  { label: "Fri", confidence: 71, minutes: 14 },
  { label: "Sat", confidence: 74, minutes: 20 },
  { label: "Sun", confidence: 72, minutes: 9 },
];

export const monthlyProgress = [
  { label: "Week 1", confidence: 48, vocabulary: 32, sessions: 5 },
  { label: "Week 2", confidence: 56, vocabulary: 61, sessions: 8 },
  { label: "Week 3", confidence: 64, vocabulary: 88, sessions: 11 },
  { label: "Week 4", confidence: 72, vocabulary: 33, sessions: 12 },
];

export const pronunciationBreakdown = [
  { metric: "Accuracy", score: 82, hint: "Your vowel sounds are clear and easy to follow." },
  { metric: "Stress", score: 74, hint: "Try leaning on the first syllable in 'COMfortable'." },
  { metric: "Intonation", score: 69, hint: "Let your voice rise a little at the end of questions." },
  { metric: "Rhythm", score: 77, hint: "Lovely pacing — a small pause after commas would shine." },
];

export const pronunciationWords = [
  { word: "comfortable", score: 68, tip: "Three syllables is enough: COMF-ter-bul." },
  { word: "opportunity", score: 81, tip: "Nice work — keep the stress on 'TU'." },
  { word: "schedule", score: 74, tip: "Both SHED-yool and SKED-jool are correct. Pick one." },
  { word: "thoroughly", score: 63, tip: "Soften the second syllable: THUR-oh-lee." },
];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
};

export const achievements: Achievement[] = [
  { id: "a1", title: "First Conversation", description: "You spoke to your coach for the very first time.", emoji: "🌱", unlocked: true },
  { id: "a2", title: "7-Day Streak", description: "One week of showing up for your voice.", emoji: "🔥", unlocked: true },
  { id: "a3", title: "Brave Speaker", description: "Completed a session you felt nervous about.", emoji: "🦁", unlocked: true },
  { id: "a4", title: "Fear Conqueror", description: "Finished 10 sessions on 'Stretch' topics.", emoji: "🛡️", unlocked: false, progress: 70 },
  { id: "a5", title: "30-Day Streak", description: "A full month of daily speaking.", emoji: "🏔️", unlocked: false, progress: 40 },
  { id: "a6", title: "Confident Communicator", description: "Reach a confidence score of 85.", emoji: "🌟", unlocked: false, progress: 85 },
];

export const dailyChallenge = {
  title: "Describe your morning in 60 seconds",
  prompt:
    "Tell your coach what you did this morning — from waking up to right now. No script, no perfect grammar. Just keep talking for one minute.",
  minutes: 1,
  reward: "+5 confidence points",
};

export const testimonials = [
  {
    name: "Chidera O.",
    role: "University student",
    quote:
      "I used to freeze in class. After three weeks of talking to my coach every night, I raised my hand for the first time.",
  },
  {
    name: "Ravi S.",
    role: "Job seeker",
    quote:
      "The interview practice felt safe. Nobody laughed at me, nobody rushed me. I walked into my real interview calm.",
  },
  {
    name: "Mai T.",
    role: "Product manager",
    quote:
      "It never corrected me harshly. It just kept encouraging me until I actually enjoyed speaking English.",
  },
];

export const faqs = [
  {
    q: "Will VoiceGym correct my mistakes?",
    a: "Gently, and only after it acknowledges what you did well. We highlight one or two things at a time so you never feel overwhelmed.",
  },
  {
    q: "I'm a complete beginner. Is this for me?",
    a: "Yes. Start with Gentle topics like ordering food. Your coach slows down, waits for you and never interrupts.",
  },
  {
    q: "Do I need a good microphone?",
    a: "Any laptop or phone microphone works. You can also type your replies on days when speaking feels like too much.",
  },
  {
    q: "Does anyone hear my recordings?",
    a: "No. Your practice sessions are private to you, and you can delete any session at any time.",
  },
  {
    q: "How long should I practise each day?",
    a: "Ten to fifteen minutes is plenty. Consistency builds confidence far more than long, occasional sessions.",
  },
];
