import { Link } from "@tanstack/react-router";
import { Menu, Waves } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/", label: "Home" },
  { to: "/practice", label: "Practice" },
  { to: "/progress", label: "Progress" },
  { to: "/achievements", label: "Achievements" },
];

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display text-lg font-semibold ${className}`}>
      <span className="flex size-9 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Waves className="size-5" />
      </span>
      VoiceGym
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: link.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild className="rounded-full shadow-soft">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start Speaking Free
            </Link>
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 rounded-full" onClick={() => setOpen(false)}>
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start Speaking Free
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                <Link to="/auth">Log in</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Brand />
          <p className="max-w-xs text-sm text-muted-foreground">
            We don't teach people to sound perfect. We help them become unafraid to speak.
          </p>
        </div>
        <FooterColumn
          title="Practice"
          items={[
            { label: "AI Conversation Coach", to: "/practice" },
            { label: "Pronunciation Coach", to: "/pronunciation" },
            { label: "Daily Challenge", to: "/dashboard" },
          ]}
        />
        <FooterColumn
          title="Progress"
          items={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Progress Reports", to: "/progress" },
            { label: "Achievements", to: "/achievements" },
          ]}
        />
        <FooterColumn
          title="Get started"
          items={[
            { label: "Create account", to: "/auth" },
            { label: "Log in", to: "/auth" },
          ]}
        />
      </div>
      <div className="border-t border-border/60 px-5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VoiceGym. Speak gently with yourself.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
