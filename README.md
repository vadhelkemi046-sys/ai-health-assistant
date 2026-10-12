# AI Health Assistant

A mobile-first, multilingual health guidance web app for ordinary families in India. Users can chat with an AI in **Gujarati, Hindi, Hinglish or English**, get simple explanations of lab reports from a photo, track daily health reminders, and keep an eye on family members' health scores in one place.

**Live demo:** https://ai-health-assistant-drab.vercel.app

> **Disclaimer:** This app gives general guidance only. It is not a doctor and does not replace medical advice. Please do not upload real medical reports to the demo.

## Features

- **AI chat in 3 languages.** Replies in the same language and script the user writes in (Gujarati, Hindi in Devanagari, Hinglish in Roman letters, or English). Voice input is supported through the browser's speech recognition.
- **Safety-first answers.** Emergency symptoms (such as chest pain) start with "call 108"; the assistant never gives a diagnosis or medicine doses; self-harm messages get a warm reply with the Tele-MANAS helpline (14416).
- **Report reader.** Upload a photo of a blood test report and get a short, plain-language summary that compares each value with the reference range printed on the report.
- **Daily reminders and health score.** Add, tick off and remove reminders; the score updates with the day's progress and resets every day.
- **Family dashboard.** Add family members and see their scores at a glance.
- **One-tap language switcher** (ગુજરાતી / हिंदी / English) on every page, so no technical knowledge is needed.
- **Saved locally.** Chat history, reminders and family list are stored in the browser (`localStorage`); nothing is stored on a server.

## Tech stack

- Next.js (App Router) and React with TypeScript
- Tailwind CSS
- Google Gemini API (text and image understanding) called from Next.js API routes
- Web Speech API for voice input
- Deployed on Vercel


## Run it locally

```bash
git clone https://github.com/vadhelkemi046-sys/ai-health-assistant.git
cd ai-health-assistant
npm install
```

Create a file named `.env.local` in the project root:

```
GEMINI_API_KEY=your_api_key_here
```

Then start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  page.tsx            Home: health score and reminders
  chat/page.tsx       AI chat
  reports/page.tsx    Report upload and summary
  family/page.tsx     Family members
  api/chat/route.ts   Chat API (system prompt, language and safety rules)
  api/report/route.ts Report reading API
  components/         BottomNav, LanguageSwitcher
  lib/i18n.ts         Gujarati, Hindi and English texts
```

## Roadmap

- Login and a database so data syncs across devices
- Use report values in the health score
- Reminder notifications (PWA)
- PDF report support

## Author

Vadhel Kemi