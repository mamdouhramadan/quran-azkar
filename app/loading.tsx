// Loading renders the app-wide route fallback while App Router segments stream in.
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        <div className="mb-6 h-12 w-40 animate-pulse rounded-2xl bg-primary/10" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 h-56 animate-pulse rounded-3xl bg-card border border-primary/10" />
          <div className="h-56 animate-pulse rounded-3xl bg-card border border-primary/10" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-3xl bg-card border border-primary/10" />
          <div className="h-40 animate-pulse rounded-3xl bg-card border border-primary/10" />
        </div>
      </div>
    </div>
  );
}
