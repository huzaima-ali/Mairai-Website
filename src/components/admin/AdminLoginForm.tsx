"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signInAdminAction } from "@/lib/cms/actions";

export function AdminLoginForm({ setupMissing }: { setupMissing?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto w-full max-w-md rounded-2xl border border-black/8 bg-white p-6 shadow-sm sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            await signInAdminAction(email, password);
            router.replace("/admin");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Sign-in failed");
          }
        });
      }}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">Mirai Site Ops</p>
      <h1 className="mt-2 text-2xl font-medium tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Internal admin access only. Accounts are invited manually.
      </p>

      {setupMissing ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase env vars are missing. Add them to <code>.env.local</code> before signing in.
        </div>
      ) : null}

      <label className="mt-6 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-3 text-base outline-none focus:border-accent sm:py-2.5 sm:text-sm"
        />
      </label>
      <label className="mt-4 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-3 text-base outline-none focus:border-accent sm:py-2.5 sm:text-sm"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

      <button
        type="submit"
        disabled={pending || setupMissing}
        className="mt-6 w-full rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
