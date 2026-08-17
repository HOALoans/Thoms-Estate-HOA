"use client";

import { useState, type FormEvent } from "react";

import { SITE } from "@/lib/site";

const TOPICS = [
  "General question",
  "Assessments / dues",
  "Architectural review",
  "Common area / maintenance",
  "Meeting or records request",
  "Other",
] as const;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const lot = String(data.get("lot") || "");
    const topic = String(data.get("topic") || "");
    const message = String(data.get("message") || "");
    const to = topic === "Architectural review" ? SITE.arcEmail : SITE.email;
    const subject = encodeURIComponent(`HOA inquiry: ${topic}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nLot / address: ${lot}\nTopic: ${topic}\n\n${message}`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-forest/10 bg-white p-8">
        <h2 className="font-display text-3xl text-forest">Message started</h2>
        <p className="mt-3 text-muted">
          Your email client should have opened a draft to the board or ARC. If
          it did not, write directly to {SITE.email}.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-pine underline"
          onClick={() => setSent(false)}
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="font-display text-3xl text-forest">Send a note</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted">Name</span>
          <input
            required
            name="name"
            className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2 outline-none focus:border-pine"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Email</span>
          <input
            required
            type="email"
            name="email"
            className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2 outline-none focus:border-pine"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-muted">Lot number or street address</span>
          <input
            name="lot"
            className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2 outline-none focus:border-pine"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-muted">Topic</span>
          <select
            name="topic"
            className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2 outline-none focus:border-pine"
            defaultValue={TOPICS[0]}
          >
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-muted">Message</span>
          <textarea
            required
            name="message"
            rows={6}
            className="mt-1 w-full rounded-xl border border-forest/15 bg-cream px-3 py-2 outline-none focus:border-pine"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream hover:bg-pine"
      >
        Open email draft
      </button>
    </form>
  );
}
