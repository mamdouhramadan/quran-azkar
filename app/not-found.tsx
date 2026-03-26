import Link from "next/link";

// NotFound renders a themed 404 state that matches the rest of the design system.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-3xl border border-primary/10 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <span className="text-3xl font-black">404</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you requested does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
