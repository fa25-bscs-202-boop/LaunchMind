import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WorkspaceEmptyState() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-lg border border-border bg-card/95 px-6 py-12 text-center shadow-[0_18px_44px_rgba(0,0,0,0.22)] sm:px-10">
      <div className="mb-5 inline-flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
        <Sparkles className="size-6" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">You haven&apos;t created anything yet</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
        Start with one idea analysis and LaunchMind will turn it into reports, SWOT analysis, pitch direction, and MVP planning.
      </p>
      <Button asChild className="mt-7">
        <Link href="/analyze">Create your first plan</Link>
      </Button>
    </div>
  );
}
