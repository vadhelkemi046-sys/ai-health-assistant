import { NextResponse } from "next/server";

export const maxDuration = 60;

const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

const PROMPT = `You explain medical reports to ordinary people in India. You are NOT a doctor.
Look at the attached report and write:
1. One line: what kind of report this is.
2. Up to 6 short points: the important values, saying clearly if each is normal, high or low, in very simple words.
3. Simple home-care tips (rest, water, food) only if suitable.
4. Last line: show this report to a doctor for proper advice.
Always compare each value with the reference range printed on the report itself. If a reference range is not printed, say "range not shown on the report" instead of guessing normal, high or low. Always add that the lab's own range is final and the doctor should confirm.
Rules: never give a definite diagnosis, never suggest medicine names or doses. If the image is not a medical report or is unreadable, say ONLY that politely (one or two lines), ask for a clear photo of a medical report, and do NOT add any advice about doctors.`;

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const lang = String(form.get("lang") ?? "hi");

  if (!file) return NextResponse.json({ reply: "File nahi mili." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ reply: "File 4 MB se chhoti honi chahiye." }, { status: 400 });
  }

  const langRule =
    lang === "gu"
      ? "Reply ONLY in Gujarati, using Gujarati script."
      : lang === "en"
      ? "Reply ONLY in simple English."
      : "Reply ONLY in Hindi, using Devanagari script.";

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

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
            systemInstruction: { parts: [{ text: `${PROMPT}\n\nLANGUAGE RULE: ${langRule}` }] },
            contents: [
              {
                role: "user",
                parts: [
                  { inlineData: { mimeType: file.type || "image/jpeg", data: base64 } },
                  { text: "Please explain this report." },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 4000 },
          }),
          signal: AbortSignal.timeout(40000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return NextResponse.json({ reply });
      } else {
        console.error(model, res.status, await res.text());
      }
    } catch (err) {
      console.error(model, err);
    }
  }
  return NextResponse.json(
    { reply: "Abhi report padh nahi paaya. Thodi der baad dobara try karein." },
    { status: 500 }
  );
}