"use client";

import { useEffect, useRef, useState } from "react";
import BottomNav from "../components/BottomNav";
import { useT } from "../lib/i18n";

type Message = { id: number; role: "ai" | "user"; text: string };

const STORAGE_KEY = "health-chat-history";

export default function ChatPage() {
  const { t, lang } = useT();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Page khulte hi purani chat wapas lao
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // kharab data ho to ignore
    }
    setLoaded(true);
  }, []);

  // Har badlav par chat save karo (aakhri 50 messages)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      // storage bhar gaya ho to ignore
    }
  }, [messages, loaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function clearChat() {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  const clearLabel =
    lang === "gu" ? "ચેટ સાફ કરો" : lang === "en" ? "Clear chat" : "Chat saaf karo";

  function startMic() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert(t.micUnsupported);
      return;
    }
    const rec = new SR();
    rec.lang = lang === "gu" ? "gu-IN" : lang === "en" ? "en-IN" : "hi-IN";
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.start();
  }

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: clean };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(70000),
        body: JSON.stringify({
          lang,
          messages: history.slice(-12).map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: data.reply ?? t.errGeneric },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: t.errNet },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[390px] flex-col bg-surface">
      <header className="px-6 pt-4">
        <div className="flex items-center justify-between">
          {messages.length > 0 ? (
            <button onClick={clearChat} className="text-xs font-semibold text-muted">
              🗑 {clearLabel}
            </button>
          ) : (
            <span />
          )}
          <a
            href="tel:108"
            className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white"
          >
            {t.emergency}
          </a>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-ink">{t.chatTitle}</h1>
        <p className="text-sm text-muted">{t.chatSubtitle}</p>
      </header>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto px-6">
        <div className="flex justify-start">
          <p className="max-w-[80%] rounded-2xl bg-white px-4 py-3 text-sm text-ink shadow-sm">
            {t.chatHello}
          </p>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white text-ink shadow-sm"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <p className="rounded-2xl bg-white px-4 py-3 text-sm text-muted shadow-sm">
              {t.thinking}
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 pb-24 pt-3">
        <p className="mb-2 text-xs text-muted">{t.disclaimer}</p>

        <div className="mb-3 flex gap-2">
          {t.quick.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? t.listening : t.placeholder}
            className="flex-1 rounded-full bg-white px-5 py-4 text-sm text-ink shadow-md outline-none placeholder:text-muted"
          />
          <button
            type="button"
            aria-label="Mic"
            onClick={startMic}
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white ${
              listening ? "animate-pulse" : ""
            }`}
          >
            🎤
          </button>
        </form>
      </div>

      <BottomNav />
    </main>
  );
}