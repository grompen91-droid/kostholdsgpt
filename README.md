# KostholdsGPT

Dinner recommendation app. Type ingredients, get 2 AI recipes with steps and nutrition.

## Structure

- `public/` — static frontend (HTML, CSS, JS)
- `api/chat.js` — serverless function proxying to Groq
- `api/image.js` — serverless function proxying to Pexels for recipe images

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new) (framework preset: Other).
3. Add environment variables:
   - `GROQ_API_KEY` = your Groq key.
   - `PEXELS_API_KEY` = your Pexels key (free at [pexels.com/api](https://www.pexels.com/api/)) — powers recipe images.
4. Deploy.

The frontend is served from `public/`, the functions from `/api/chat` and `/api/image`.

## Local dev

```
npm i -g vercel
GROQ_API_KEY=your_key PEXELS_API_KEY=your_key vercel dev
```
