# KostholdsGPT

Dinner recommendation app. Type ingredients, get 2 AI recipes with steps and nutrition.

## Structure

- `public/` — static frontend (HTML, CSS, JS)
- `api/chat.js` — serverless function proxying to Groq

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new) (framework preset: Other).
3. Add an environment variable: `GROQ_API_KEY` = your Groq key.
4. Deploy.

The frontend is served from `public/`, the function from `/api/chat`.

## Local dev

```
npm i -g vercel
GROQ_API_KEY=your_key vercel dev
```
