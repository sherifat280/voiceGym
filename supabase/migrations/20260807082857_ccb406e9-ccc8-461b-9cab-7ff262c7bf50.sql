CREATE TABLE public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('conversation','pronunciation','challenge')),
  topic TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  turns INTEGER NOT NULL DEFAULT 0,
  words_spoken INTEGER NOT NULL DEFAULT 0,
  confidence INTEGER,
  accuracy INTEGER,
  stress INTEGER,
  intonation INTEGER,
  rhythm INTEGER,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.practice_sessions TO authenticated;
GRANT ALL ON public.practice_sessions TO service_role;

ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice sessions" ON public.practice_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own practice sessions" ON public.practice_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own practice sessions" ON public.practice_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own practice sessions" ON public.practice_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX practice_sessions_user_created_idx ON public.practice_sessions (user_id, created_at DESC);