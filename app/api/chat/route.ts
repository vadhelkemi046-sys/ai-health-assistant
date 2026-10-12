import { NextResponse } from "next/server";

export const maxDuration = 30;

type Msg = { role: "user" | "assistant"; content: string };

// Pehla model chalega, na chale (busy/404/timeout) to doosra try hoga
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

const SYSTEM_PROMPT = `You are "AI Health Assistant", a friendly health guide for ordinary people in India. You are NOT a doctor.

Language (very important):
- Write EVERY line of your reply in the language and script of the language rule given below, including the closing line and any emergency line.
- Never copy sentences from these instructions word for word. Translate them naturally into the reply language.
- Never mix two languages in one reply.

Style:
- Use very simple everyday words (for example "BP", "sugar", "fever").
- Keep the reply very short: at most 5 short points or 80 words. Put each point on a new line ("1. ...").
- If information is missing (how many days, age, other symptoms), put ONE short question as the LAST point, after 2-3 simple home-care tips.
- End with one short line, in the reply language, saying: if symptoms continue or get worse, see a doctor.

Emergency:
- For chest pain or pressure, severe breathlessness, fainting, seizure, face drooping or slurred speech, weakness on one side, heavy bleeding, a child who is blue or not responding, snake bite or poisoning: the FIRST line of your reply must say (in the reply language): "Call 108 now or go to the nearest hospital."

Hard rules:
- Never give a definite diagnosis (do not say "you have X").
- Never give medicine doses, amounts or antibiotic/steroid advice. Say that the right dose can only be given by a doctor or pharmacist.
- For children under 5, pregnancy, elderly people, and people with diabetes, BP or heart disease: always advise seeing a doctor.
- If the user talks about harming themselves or not wanting to live: do NOT use a numbered list. Reply in 3-4 warm, short sentences in plain paragraph form. Tell them they are not alone, share Tele-MANAS 14416 (free, 24x7), and ask if they are with someone right now. If they are in immediate danger, tell them to call 108.
- If the question is not about health, politely say you can only help with health.
- Never start with or repeat "I am an AI" or "I am not a doctor". The app already shows a disclaimer. Say it only if the user directly asks.`;

// Roman letters mein likhi Hindi (Hinglish) pehchanne ke liye
const HINGLISH =
  /\b(kya|kaise|kaun|kaunsi|kitni|kitna|kab|kyun|mujhe|mera|meri|mere|hai|hain|nahi|nahin|dawai|dawa|dard|bukhar|khansi|sardi|chakkar|ulti|karo|karu|batao|bataiye|lun|raha|rahi|rahe|abhi|thoda|bahut|ke liye)\b/i;

// User ne kis lipi/bhasha mein likha, usse jawab ki bhasha tay karo
function languageRule(lastUserText: string, pref?: string) {
  if (/[\u0A80-\u0AFF]/.test(lastUserText)) {
    return "The user wrote in Gujarati. Reply ONLY in Gujarati, using Gujarati script (ગુજરાતી). Do not reply in English.";
  }
  if (/[\u0900-\u097F]/.test(lastUserText)) {
    return "The user wrote in Hindi. Reply ONLY in Hindi, using Devanagari script (हिन्दी). Do not reply in English.";
  }
  if (HINGLISH.test(lastUserText)) {
    return 'The user wrote Hindi in English letters (Hinglish). Reply ONLY in Hinglish, meaning Hindi written in English letters, for example "Aaram karo aur paani piyo." Do NOT reply in English.';
  }
  if (pref === "gu") {
    return "Reply in Gujarati, using Gujarati script (ગુજરાતી).";
  }
  if (pref === "en") {
    return "Reply in simple English.";
  }
  return "Reply in the same language and script the user used. If the user wrote in English, reply in simple English.";
}

export async function POST(req: Request) {
  const { messages, lang } = (await req.json()) as {
    messages: Msg[];
    lang?: string;
  };

  const firstUser = messages.findIndex((m) => m.role === "user");
  if (firstUser === -1) {
    return NextResponse.json({ reply: "Kuch likhiye." }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const rule = languageRule(lastUser?.content ?? "", lang);

  const contents = messages.slice(firstUser).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let reply: string | null = null;

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                { text: `${SYSTEM_PROMPT}\n\nLANGUAGE RULE (must follow): ${rule}` },
              ],
            },
            contents,
            generationConfig: { maxOutputTokens: 4000 },
          }),
          signal: AbortSignal.timeout(20000),
        }
      );

      if (res.ok) {
        const data = await res.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
        if (reply) break;
      } else {
        console.error(model, res.status, await res.text());
      }
    } catch (err) {
      console.error(model, "timeout ya network error", err);
    }
  }

  if (!reply) {
    return NextResponse.json(
      {
        reply:
          "Abhi AI jawab nahi de pa raha (busy ho sakta hai). 1 minute baad dobara try karein. Emergency mein seedha 108 par call karein.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ reply });
}