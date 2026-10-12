"use client";

import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

type Member = { id: number; name: string; relation: string; score: number };

const STORAGE_KEY = "health-family";

const starter: Member[] = [
  { id: 1, name: "Priya", relation: "Aap", score: 78 },
  { id: 2, name: "Mummy", relation: "Maa", score: 65 },
  { id: 3, name: "Papa", relation: "Pita", score: 58 },
];

function scoreColor(score: number) {
  if (score >= 75) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-danger";
}

export default function FamilyPage() {
  const [members, setMembers] = useState<Member[]>(starter);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMembers(JSON.parse(saved));
    } catch {
      // kharab data ho to starter list rahegi
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {}
  }, [members, loaded]);

  function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), relation: relation.trim() || "Parivar", score: 70 },
    ]);
    setName("");
    setRelation("");
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[390px] bg-surface px-6 pb-28 pt-4">
      <div className="flex justify-end">
        <a
          href="tel:108"
          className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-white"
        >
          Emergency 108
        </a>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-ink">Family</h1>
      <p className="text-sm text-muted">Parivar ki sehat ek jagah</p>

      <ul className="mt-6 space-y-3">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {m.name[0]?.toUpperCase()}
              </span>
              <div>
                <p className="text-base font-semibold text-ink">{m.name}</p>
                <p className="text-xs text-muted">{m.relation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className={`h-3 w-3 rounded-full ${scoreColor(m.score)}`} />
                {m.score}
              </span>
              <button
                onClick={() => removeMember(m.id)}
                aria-label="Hatao"
                className="text-xs text-muted"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addMember} className="mt-6 space-y-3 rounded-2xl bg-white p-4 shadow-md">
        <p className="text-sm font-semibold text-ink">Naya member jodo</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naam"
          className="w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink outline-none"
        />
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Rishta (jaise Dadi, Bhai)"
          className="w-full rounded-xl bg-surface px-4 py-3 text-sm text-ink outline-none"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white"
        >
          Jodo
        </button>
      </form>

      <p className="mt-4 text-xs text-muted">
        Ye list sirf is browser mein save hoti hai.
      </p>

      <BottomNav />
    </main>
  );
}