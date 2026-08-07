import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** Encouraging placeholder shown when a learner has no activity yet. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="rounded-3xl border-dashed border-border bg-card/60 shadow-none">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-6" />
        </span>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
