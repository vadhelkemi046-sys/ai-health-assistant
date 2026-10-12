"use client";

import { useSyncExternalStore } from "react";

export type Lang = "hi" | "gu" | "en";

const en = {
  navHome: "Home",
  navChat: "Chat",
  navReports: "Reports",
  navFamily: "Family",
  emergency: "Emergency 108",
  greeting: "Good Morning, Priya",
  healthScore: "Health Score",
  remindersTitle: "Today's reminders",
  reminders: ["Medicine - 8:00 AM", "Drink water - 10:00 AM", "Walk - 6:00 PM"],
  reminderPlaceholder: "New reminder (e.g. Tablet - 9:00 PM)",
  addReminder: "Add",
  doneOf: "done today",
  removeLabel: "Remove",
  askAi: "Ask the AI",
  chatTitle: "AI Health Assistant",
  chatSubtitle: "Ask about your health",
  chatHello: "Hello Priya! How are you feeling today?",
  quick: ["Headache", "Fever", "Diet plan"],
  disclaimer: "This is only guidance, not a doctor's advice.",
  placeholder: "Type here...",
  listening: "Listening...",
  thinking: "AI is thinking...",
  micUnsupported: "This browser does not support the mic. Please use Chrome or Edge.",
  errNet: "Please check your internet and try again.",
  errGeneric: "Something went wrong.",
};

type Dict = typeof en;

const hi: Dict = {
  navHome: "होम",
  navChat: "चैट",
  navReports: "रिपोर्ट",
  navFamily: "परिवार",
  emergency: "इमरजेंसी 108",
  greeting: "सुप्रभात, प्रिया",
  healthScore: "हेल्थ स्कोर",
  remindersTitle: "आज के रिमाइंडर",
  reminders: ["दवा - सुबह 8:00", "पानी पीना - सुबह 10:00", "सैर - शाम 6:00"],
  reminderPlaceholder: "नया रिमाइंडर (जैसे दवा - रात 9:00)",
  addReminder: "जोड़ें",
  doneOf: "आज पूरे हुए",
  removeLabel: "हटाएँ",
  askAi: "AI से पूछें",
  chatTitle: "AI हेल्थ असिस्टेंट",
  chatSubtitle: "अपनी सेहत के बारे में पूछें",
  chatHello: "नमस्ते प्रिया! आज आप कैसा महसूस कर रही हैं?",
  quick: ["सिर दर्द", "बुखार", "डाइट प्लान"],
  disclaimer: "ये सिर्फ़ मार्गदर्शन है, डॉक्टर की सलाह नहीं।",
  placeholder: "यहाँ लिखें...",
  listening: "सुन रहा हूँ...",
  thinking: "AI सोच रहा है...",
  micUnsupported: "इस ब्राउज़र में माइक काम नहीं करता। कृपया Chrome या Edge इस्तेमाल करें।",
  errNet: "कृपया इंटरनेट जाँचकर फिर कोशिश करें।",
  errGeneric: "कुछ गड़बड़ हो गई।",
};

const gu: Dict = {
  navHome: "હોમ",
  navChat: "ચેટ",
  navReports: "રિપોર્ટ",
  navFamily: "પરિવાર",
  emergency: "ઇમરજન્સી 108",
  greeting: "સુપ્રભાત, પ્રિયા",
  healthScore: "હેલ્થ સ્કોર",
  remindersTitle: "આજના રિમાઇન્ડર",
  reminders: ["દવા - સવારે 8:00", "પાણી પીવું - સવારે 10:00", "ચાલવું - સાંજે 6:00"],
  reminderPlaceholder: "નવું રિમાઇન્ડર (જેમ કે દવા - રાત્રે 9:00)",
  addReminder: "ઉમેરો",
  doneOf: "આજે પૂરા થયા",
  removeLabel: "કાઢી નાખો",
  askAi: "AI ને પૂછો",
  chatTitle: "AI હેલ્થ આસિસ્ટન્ટ",
  chatSubtitle: "તમારા સ્વાસ્થ્ય વિશે પૂછો",
  chatHello: "નમસ્તે પ્રિયા! આજે તમને કેવું લાગે છે?",
  quick: ["માથાનો દુખાવો", "તાવ", "ડાયટ પ્લાન"],
  disclaimer: "આ માત્ર માર્ગદર્શન છે, ડૉક્ટરની સલાહ નથી.",
  placeholder: "અહીં લખો...",
  listening: "સાંભળી રહ્યો છું...",
  thinking: "AI વિચારી રહ્યું છે...",
  micUnsupported: "આ બ્રાઉઝરમાં માઇક કામ કરતું નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.",
  errNet: "કૃપા કરીને ઇન્ટરનેટ તપાસીને ફરી પ્રયાસ કરો.",
  errGeneric: "કંઈક ગડબડ થઈ ગઈ.",
};

const TEXT: Record<Lang, Dict> = { hi, gu, en };

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("langchange", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("langchange", cb);
  };
}

function getSnapshot(): Lang {
  try {
    const l = localStorage.getItem("lang");
    return l === "gu" || l === "en" || l === "hi" ? l : "hi";
  } catch {
    return "hi";
  }
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, () => "hi" as Lang);
}

export function setLang(l: Lang) {
  try {
    localStorage.setItem("lang", l);
  } catch {}
  window.dispatchEvent(new Event("langchange"));
}

export function useT() {
  const lang = useLang();
  return { t: TEXT[lang], lang };
}