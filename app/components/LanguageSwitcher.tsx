"use client";

import { useT, setLang, type Lang } from "../lib/i18n";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "gu", label: "ગુજરાતી" },
  { code: "hi", label: "हिंदी" },
  { code: "en", label: "English" },
];

export default function LanguageSwitcher() {
  const { lang } = useT();

  return (
    <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            lang === o.code ? "bg-primary text-white" : "text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}