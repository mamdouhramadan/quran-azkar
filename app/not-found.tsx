"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpenText, House, Sparkle } from "@phosphor-icons/react";

const SUGGESTED_DESTINATIONS = [
  {
    title: "Quran Reader",
    description: "Continue reading the Quran with bookmarks, tafsir, and audio recitation.",
    href: "/quran",
    cta: "Open Quran",
    icon: BookOpenText,
  },
  {
    title: "Azkar Categories",
    description: "Browse the daily azkar collections and open a category that matches your moment.",
    href: "/",
    cta: "Browse Azkar",
    icon: Sparkle,
  },
  {
    title: "Tasbih Counter",
    description: "Jump back into your digital tasbih and continue your dhikr progress.",
    href: "/tasbih",
    cta: "Open Tasbih",
    icon: House,
  },
] as const;

// NotFound renders a richer 404 state with helpful routes back into the app.
export default function NotFound() {
  const router = useRouter();

  return (
    <section className="bg-background text-foreground">
      <div className="container flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-medium text-primary">404 error</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Page not found</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              We searched high and low, but couldn&apos;t find what you&apos;re looking for. Let&apos;s find a better place for you to go.
            </p>

            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent sm:w-auto"
              >
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" weight="bold" />
                <span>Go back</span>
              </button>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Take me home
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUGGESTED_DESTINATIONS.map((item) => (
              <div key={item.title} className="rounded-3xl border border-primary/10 bg-card p-6 shadow-sm">
                <span className="text-muted-foreground">
                  <item.icon className="h-7 w-7" weight="regular" />
                </span>

                <h3 className="mt-6 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>

                <Link href={item.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <span>{item.cta}</span>
                  <ArrowLeft className="h-4 w-4 rotate-180 rtl:rotate-0" weight="bold" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
