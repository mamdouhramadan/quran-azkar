"use client";

// Error renders the root App Router fallback and lets the user retry rendering.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl border border-primary/10 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <span className="text-2xl font-black">!</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page failed to load correctly. You can try again without losing the rest of the app shell.
        </p>
        {error.message ? (
          <p className="mb-6 rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
            {error.message}
          </p>
        ) : null}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
