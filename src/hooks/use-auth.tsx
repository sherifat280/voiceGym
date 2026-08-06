import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  /** Best available name for the signed-in user, or "Learner". */
  displayName: string;
  initials: string;
  avatarUrl: string | null;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const FALLBACK_NAME = "Learner";

function nameFromUser(user: User | null, profile: Profile | null): string {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const candidates = [
    profile?.display_name,
    meta['display_name'],
    meta['full_name'],
    meta['name'],
    user?.email ? user.email.split("@")[0] : null,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return FALLBACK_NAME;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  const loadProfile = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", id)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
      if (!nextSession?.user) setProfile(null);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Fetch (and live-refresh) the profile for whoever is signed in.
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    void loadProfile(userId);

    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${userId}` },
        () => {
          void loadProfile(userId);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (userId) await loadProfile(userId);
  }, [userId, loadProfile]);

  const updateDisplayName = useCallback(
    async (name: string) => {
      if (!userId) throw new Error("You need to be signed in.");
      const trimmed = name.trim();
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, display_name: trimmed || null })
        .eq("id", userId);
      if (error) throw error;
      await supabase.auth.updateUser({ data: { display_name: trimmed } });
      await loadProfile(userId);
    },
    [userId, loadProfile],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const displayName = nameFromUser(user, profile);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      displayName,
      initials: displayName.slice(0, 1).toUpperCase(),
      avatarUrl:
        profile?.avatar_url ??
        ((user?.user_metadata as Record<string, unknown> | undefined)?.['avatar_url'] as
          | string
          | undefined) ??
        null,
      refreshProfile,
      updateDisplayName,
      signOut,
    }),
    [session, user, profile, loading, displayName, refreshProfile, updateDisplayName, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
