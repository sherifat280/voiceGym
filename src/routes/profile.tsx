import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your VoiceGym profile" },
      { name: "description", content: "Update the name your coach uses and manage your account." },
      { property: "og:title", content: "Your VoiceGym profile" },
      {
        property: "og:description",
        content: "Update the name your coach uses and manage your account.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, displayName, updateDisplayName, signOut, loading, session } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setName(profile?.display_name ?? (displayName === "Learner" ? "" : displayName));
  }, [profile?.display_name, displayName]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      await updateDisplayName(name);
      toast("Profile updated", { description: "Your coach will use your new name." });
    } catch (error) {
      toast("Couldn't save", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <AppShell title="Your profile" subtitle="How your coach greets you.">
      <Card className="max-w-xl rounded-3xl border-border/60 shadow-soft">
        <CardContent className="space-y-6 p-6">
          {!loading && !session ? (
            <p className="text-sm text-muted-foreground">Sign in to manage your profile.</p>
          ) : (
            <>
              <form className="space-y-4" onSubmit={save}>
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input
                    id="display-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Learner"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email</Label>
                  <Input
                    id="account-email"
                    value={user?.email ?? ""}
                    readOnly
                    disabled
                    className="h-11 rounded-xl"
                  />
                </div>
                <Button type="submit" className="rounded-full" disabled={pending}>
                  {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save changes
                </Button>
              </form>

              <Button
                variant="outline"
                className="rounded-full"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/auth", replace: true });
                }}
              >
                Sign out
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
