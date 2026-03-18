# Marriage Readiness

A science-backed relationship assessment and reflection tool to help couples and individuals evaluate partnership readiness across key relationship domains.

Live at: [marriage-readiness.vercel.app](https://marriage-readiness.vercel.app)

## Features

- **Couple Mode** — Both partners answer independently, then compare scores side-by-side with conflict highlighting
- **Single Mode** — Individual reflection on your own perspective
- **10 Evidence-Based Domains** — Commitment, values alignment, conflict skills, emotional regulation, trust, teamwork, division of labor, growth mindset, sexual communication, and safety/respect
- **AI-Powered Analysis** — Optional Claude-generated narrative interpretation of your results
- **Bilingual** — Full English and Korean support
- **Privacy-First** — All responses stay local until you explicitly request AI analysis

## Tech Stack

- **Frontend:** Vanilla JS, HTML5, CSS3 (no framework, no build step)
- **Backend:** Node.js serverless function (Vercel)
- **AI:** Anthropic Claude API
- **Deployment:** Vercel

## Project Structure

```
marriage-readiness/
├── index.html       # Complete frontend (HTML + JS + CSS)
├── api/
│   └── chat.js      # Serverless API proxy to Anthropic Claude
└── vercel.json      # Deployment configuration
```

## Running Locally

Install the Vercel CLI, then run:

```bash
npm i -g vercel
vercel dev
# then open http://localhost:3000
```

`vercel dev` serves the frontend and runs the `/api/chat.js` serverless function locally, picking up your `.env` automatically.

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your_api_key_here
```

> Note: `python3 -m http.server` won't work — it can't run the serverless API function needed for AI analysis.

## Deployment

The project deploys automatically to Vercel on push to `main`.

Set `ANTHROPIC_API_KEY` in your Vercel project's environment variables to enable AI analysis.

## Scoring

Each of the 10 domains is scored 0–2:

| Score | Meaning |
|-------|---------|
| 0 | Significant concern |
| 1 | Some growth needed |
| 2 | Doing well |

Total range: **0–20**. Safety and foundation domains have override logic that flags critical concerns regardless of total score.

## Safety

This tool includes direct links to the [National Domestic Violence Hotline](https://www.thehotline.org) and [RAINN](https://www.rainn.org) for users who may be in unsafe situations. The safety/respect domain is treated as a primary gate — scores here can override the overall result.

## Research

Assessment items are grounded in peer-reviewed relationship science. The tool references 21 academic sources embedded in the app.

## License

MIT
