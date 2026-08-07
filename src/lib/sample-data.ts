/**
 * Static content for VoiceGym (conversation topics, marketing copy).
 * All learner progress comes from the database — never from this file.
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

export const dailyChallenge = {
  title: "Describe your morning in 60 seconds",
  prompt:
    "Tell your coach what you did this morning — from waking up to right now. No script, no perfect grammar. Just keep talking for one minute.",
  minutes: 1,
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
