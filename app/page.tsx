"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useT } from "./lib/i18n";

// key: default reminder ka number (language ke hisaab se badalta hai)
// text: user ka apna likha reminder
type Reminder = { id: number; key?: number; text?: string; done: boolean };

const STORAGE_KEY = "health-reminders";

function defaults(count: number): Reminder[] {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, key: i, done: false }));
}

export default function Home() {
  const { t } = useT();
  const [items, setItems] = useState<Reminder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newText, setNewText] = useState("");

  // Page khulte hi reminders wapas lao. Nayi tarikh ho to "done" reset karo.
  useEffect(() => {
    const today = new Date().toDateString();
    let list: Reminder[] = defaults(t.reminders.length);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { date: string; items: Reminder[] };
        list =
          parsed.date === today
            ? parsed.items
            : parsed.items.map((r) => ({ ...r, done: false }));
      }
    } catch {
      // kharab data ho to default list rahegi
    }
    setItems(list);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ date: new Date().toDateString(), items })
      );
    } catch {}
  }, [items, loaded]);

  function toggle(id: number) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setItems((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setNewText("");
  }

  // Score: 50 se shuru, har poora kiya reminder score badhata hai (max 100)
  const doneCount = items.filter((r) => r.done).length;
  const score = items.length === 0 ? 50 : Math.round(50 + (50 * doneCount) / items.length);

  const circumference = 2 * Math.PI * 44;
  const offset = circumference * (1 - score / 100);

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[390px] bg-surface px-6 pb-28 pt-4">
      <div className="flex items-center justify-between">
        <LanguageSwitcher />
        <a
          href="tel:108"
          className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white"
        >
          {t.emergency}
        </a>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-ink">{t.greeting}</h1>

      <section className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-md">
        <div>
          <p className="text-base text-ink">{t.healthScore}</p>
          <p className="mt-2 text-5xl font-bold text-primary">
            {score}
            <span className="ml-1 text-base font-semibold text-ink">/100</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            {doneCount}/{items.length} {t.doneOf}
          </p>
        </div>

        <div className="relative h-[100px] w-[100px]">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E5E7EB" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke="#0D9488" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.4s" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-ink">
            {score}
          </span>
        </div>
      </section>

      <h2 className="mt-8 text-lg font-semibold text-ink">{t.remindersTitle}</h2>
      <ul className="mt-3 space-y-3">
        {items.map((r) => {
          const label = r.key !== undefined ? t.reminders[r.key] : r.text;
          return (
            <li
              key={r.id}
              className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-md"
            >
              <button
                onClick={() => toggle(r.id)}
                aria-label="Done"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                  r.done
                    ? "border-primary bg-primary text-white"
                    : "border-muted text-transparent"
                }`}
              >
                ✓
              </button>
              <span
                className={`flex-1 text-base ${
                  r.done ? "text-muted line-through" : "text-ink"
                }`}
              >
                {label}
              </span>
              <button
                onClick={() => remove(r.id)}
                aria-label={t.removeLabel}
                className="text-xs text-muted"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <form onSubmit={add} className="mt-4 flex gap-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={t.reminderPlaceholder}
          className="min-w-0 flex-1 rounded-full bg-white px-4 py-3 text-sm text-ink shadow-md outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-white"
        >
          {t.addReminder}
        </button>
      </form>

      <Link
        href="/chat"
        className="mt-8 block w-full rounded-full bg-primary py-4 text-center text-base font-semibold text-white shadow-md active:scale-[0.98]"
      >
        {t.askAi}
      </Link>

      <BottomNav />
    </main>
  );
}