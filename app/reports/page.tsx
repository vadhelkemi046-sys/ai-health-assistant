"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useT } from "../lib/i18n";

export default function ReportsPage() {
  const { t, lang } = useT();
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const L = {
    title: lang === "gu" ? "રિપોર્ટ" : lang === "en" ? "Reports" : "रिपोर्ट",
    sub:
      lang === "gu" ? "તમારા રિપોર્ટનો ફોટો અપલોડ કરો"
      : lang === "en" ? "Upload a photo of your report"
      : "अपनी रिपोर्ट की फोटो अपलोड करें",
    pick: lang === "gu" ? "ફોટો અથવા ફાઇલ પસંદ કરો" : lang === "en" ? "Choose photo or file" : "फोटो या फाइल चुनें",
    wait: lang === "gu" ? "રિપોર્ટ વાંચી રહ્યો છું..." : lang === "en" ? "Reading your report..." : "रिपोर्ट पढ़ रहा हूँ...",
    note:
      lang === "gu" ? "આ ફક્ત માર્ગદર્શન છે, ડૉક્ટરની સલાહ નથી. AI વાંચવામાં ભૂલ કરી શકે છે, અસલી રિપોર્ટ ડૉક્ટરને બતાવો. ટેસ્ટ માટે અસલી રિપોર્ટ અપલોડ ન કરો."
      : lang === "en" ? "This is only guidance, not a doctor's advice. The AI can misread values, so show the original report to a doctor. Do not upload real reports while testing."
      : "ये सिर्फ़ मार्गदर्शन है, डॉक्टर की सलाह नहीं। AI वैल्यू पढ़ने में गलती कर सकता है, असली रिपोर्ट डॉक्टर को दिखाएँ। टेस्ट के लिए असली रिपोर्ट अपलोड न करें।",
  };

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("lang", lang);
      const res = await fetch("/api/report", { method: "POST", body: form });
      const data = await res.json();
      setResult(data.reply ?? t.errGeneric);
    } catch {
      setResult(t.errNet);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[390px] bg-surface px-6 pb-28 pt-4">
      <div className="flex items-center justify-between">
        <LanguageSwitcher />
        <a href="tel:108" className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white">
          {t.emergency}
        </a>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-ink">{L.title}</h1>
      <p className="text-sm text-muted">{L.sub}</p>

      <label className="mt-6 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-primary bg-white p-8 text-center">
        <span className="text-4xl">📄</span>
        <span className="mt-3 text-base font-semibold text-ink">{L.pick}</span>
        <span className="mt-1 text-xs text-muted">JPG, PNG</span>
        <input type="file" accept="image/*" onChange={onPick} className="hidden" />
      </label>

      {fileName && <p className="mt-3 truncate text-xs text-muted">{fileName}</p>}

      {loading && <p className="mt-4 text-sm text-muted">{L.wait}</p>}

      {result && (
        <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm text-ink shadow-md">
          {result}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">{L.note}</p>

      <BottomNav />
    </main>
  );
}