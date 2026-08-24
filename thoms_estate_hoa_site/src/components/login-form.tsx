"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginFormInner() {
  const next = useSearchParams().get("next") || "/budget/full";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not log in");
      window.location.assign(next.startsWith("/") ? next : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="mx-auto max-w-md rounded-3xl border border-forest/10 bg-white p-6"
    >
      <p className="text-sm text-muted">
        After you log in you go to the Board Budget page. That is where
        committee Saves appear and where you adjust year-end forecasts.
        Committee chairs do not need a password.
      </p>
      <label className="mt-4 block text-sm">
        <span className="text-xs tracking-wide text-muted uppercase">
          Treasurer password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 min-h-11 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 min-h-11 w-full rounded-full bg-brass px-4 py-2 text-sm font-semibold text-forest-deep"
      >
        {busy ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <LoginFormInner />
    </Suspense>
  );
}
