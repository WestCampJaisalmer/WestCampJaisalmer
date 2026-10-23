import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-teal px-4 py-10">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-gold-light/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold font-serif text-2xl font-bold text-white shadow-gold">W</div>
          <h1 className="font-serif text-3xl font-bold text-white">West Camp Jaisalmer</h1>
          <p className="mt-1 text-sm text-white/60">Admin dashboard</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-hover sm:p-8">
          <h2 className="font-serif text-xl font-bold text-deep-teal">Welcome back</h2>
          <p className="mb-6 mt-1 text-sm text-text-muted">Sign in to manage your website.</p>
          <LoginForm next={next} />
        </div>
        <p className="mt-6 text-center text-xs text-white/40">Authorised staff only. Activity is logged.</p>
      </div>
    </div>
  );
}
