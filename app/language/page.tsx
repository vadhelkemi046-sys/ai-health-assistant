"use client";

import Link from "next/link";
import { setLang, useLang, type Lang } from "../lib/i18n";

const languages: { code: Lang; label: string }[] = [
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "en", label: "English" },
];

export default function LanguagePage() {
  const selected = useLang();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-surface px-6 pb-10 pt-20">
      <h1 className="text-center text-3xl font-bold text-ink">Apni bhasha chuno</h1>
      <p className="mt-3 text-center text-base text-muted">
        Aap kis bhasha mein baat karna chahte ho?
      </p>

      <div className="mt-10 space-y-4">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`w-full rounded-2xl bg-white px-6 py-6 text-left text-xl font-semibold text-ink shadow-md ${
              selected === l.code ? "ring-2 ring-primary" : ""
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <Link
        href="/"
        className="mt-auto block w-full rounded-full bg-primary py-4 text-center text-base font-semibold text-white shadow-md"
      >
        Aage badhein
      </Link>
    </main>
  );
}