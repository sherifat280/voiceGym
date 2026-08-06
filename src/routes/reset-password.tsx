import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Brand } from "@/components/layout/SiteChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new VoiceGym password" },
      { name: "description", content: "Choose a new password and get back to speaking practice." },
      { property: "og:title", content: "Set a new VoiceGym password" },
      {
        name: "og:description",
        content: "Choose a new password and get back to speaking practice.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setReady(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (error) {
      toast("Couldn't update password", { description: error.message });
      return;
    }
    toast("Password updated", { description: "You're all set." });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="surface-glow flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-6xl px-5 py-6">
        <Brand />
      </div>
      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <Card className="w-full max-w-md rounded-[2rem] border-border/60 shadow-lift">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold">Choose a new password</h1>
              <p className="text-sm text-muted-foreground">
                {ready
                  ? "Pick something you'll remember easily."
                  : "Open this page from the reset link in your email."}
              </p>
            </div>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button type="submit" className="h-11 w-full rounded-full" disabled={pending || !ready}>
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
