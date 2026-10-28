# 🤖 read-bible-api

[![ci](https://github.com/jennifershih/read-bible-api/actions/workflows/ci.yml/badge.svg)](https://github.com/jennifershih/read-bible-api/actions/workflows/ci.yml)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)

The API behind [Read Bible](https://github.com/jennifershih/read-bible). Describe how you feel, and it suggests a Bible verse that fits — returned in Chinese (Chinese Union Version, 和合本).

## How it works

1. `POST /get-bible-verse-from-mood` receives `{ "mood": "今天有點焦慮" }`.
2. OpenAI (chat model in JSON mode) picks a verse and answers with `{ book, chapter, verse }`.
3. The reference is validated against the 66 books, then the verse text is fetched in the Chinese Union Version from [bible-api.com](https://bible-api.com).
4. The API answers `{ "verse": "腓立比書 4:6 應當一無掛慮…" }`.

Invalid input returns `400`; a missing API key or an upstream failure returns `503` with a clear message.

## Endpoints

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/` | – | `{ "status": "ok" }` health check |
| `POST` | `/get-bible-verse-from-mood` | `{ "mood": string }` (1–200 chars) | `{ "verse": string }` |

## Getting started

Requires Node.js 22+.

```bash
git clone https://github.com/jennifershih/read-bible-api.git
cd read-bible-api
npm install
cp .env.example .env   # then fill in OPENAI_API_KEY
npm run start:dev      # http://localhost:3000
```

### Environment variables

| Name | Required | Default |
|---|---|---|
| `OPENAI_API_KEY` | yes | – |
| `OPENAI_MODEL` | no | `gpt-4o-mini` |
| `CORS_ORIGINS` | no | `https://jennifershih.github.io,http://localhost:4200` |
| `PORT` | no | `3000` |

## Scripts

| Command | What it does |
|---|---|
| `npm run start:dev` | Run with auto-reload |
| `npm run build` | Compile to `dist/` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | HTTP tests with Supertest |
| `npm run lint` | oxlint |

## Deployment

Deployed on Vercel (`vercel.json`). Set `OPENAI_API_KEY` in the Vercel project settings.
