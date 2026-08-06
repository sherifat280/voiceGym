import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Brand } from "@/components/layout/SiteChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

type Mode = "login" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode = search['mode'];
    return mode === "signup" || mode === "login" || mode === "forgot" ? { mode } : {};
  },
  head: () => ({
    meta: [
      { title: "Log in or join VoiceGym" },
      {
        name: "description",
        content: "Create your free VoiceGym account and start speaking English without fear today.",
      },
      { property: "og:title", content: "Log in or join VoiceGym" },
      {
        property: "og:description",
        content: "Create your free VoiceGym account and start speaking English without fear today.",
      },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.7 3-4.3 3-7.3 0-.7-.1-1.4-.2-2z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 1-3.5 1a6 6 0 0 1-5.7-4.1l-3.3 2.6A10 10 0 0 0 12 22" />
      <path fill="#FBBC05" d="M6.3 14a6 6 0 0 1 0-3.9L3 7.5a10 10 0 0 0 0 9z" />
      <path fill="#4285F4" d="M12 5.9c1.5 0 2.9.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3 7.5l3.3 2.6A6 6 0 0 1 12 5.9" />
    </svg>
  );
}

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode ?? "login");
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast("Check your inbox", {
          description: "If that email exists, a reset link is on its way.",
        });
        setMode("login");
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast("Almost there", {
            description: "Check your email to confirm your account, then log in.",
          });
          setMode("login");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      toast("Welcome in — take a breath.", {
        description: "Your coach is ready whenever you are.",
      });
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast("That didn't work", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPending(false);
    }
  };

  const signInWithGoogle = async () => {
    setPending(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setPending(false);
      toast("Google sign-in failed", { description: "Please try again." });
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="surface-glow flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Brand />
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <Card className="w-full max-w-md rounded-[2rem] border-border/60 shadow-lift animate-rise">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold">
                {mode === "signup"
                  ? "Let's get your voice warmed up"
                  : mode === "forgot"
                    ? "Let's get you back in"
                    : "Welcome back"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "forgot"
                  ? "Enter your email and we'll send a gentle reset link."
                  : "No pressure. You can speak or type — whatever feels right today."}
              </p>
            </div>

            {mode !== "forgot" ? (
              <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-secondary p-1">
                  <TabsTrigger value="login" className="rounded-full">Log in</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-full">Sign up</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : null}

            <form className="space-y-4" onSubmit={submit}>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="name">First name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              {mode !== "forgot" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" ? (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    ) : null}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-11 rounded-xl"
                  />
                </div>
              ) : null}

              <Button type="submit" className="h-11 w-full rounded-full" disabled={pending}>
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                {mode === "signup"
                  ? "Start Speaking Free"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Log in"}
              </Button>
            </form>

            {mode !== "forgot" ? (
              <>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full"
                  disabled={pending}
                  onClick={signInWithGoogle}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="w-full rounded-full" onClick={() => setMode("login")}>
                Back to log in
              </Button>
            )}

            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to practise kindly with yourself.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
