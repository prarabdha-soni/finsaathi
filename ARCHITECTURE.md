# FinSaathi — System Architecture

## Overview

FinSaathi is an AI-powered personal finance co-pilot for Indian consumers. It combines multiple LLM providers, a persistent data layer, and a mobile-first Next.js frontend.

---

## Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js 15 (App Router) + React 19 | UI, routing, server components |
| Styling | Tailwind CSS v4 + Framer Motion | Design system, animations |
| State | Zustand | Client-side app state |
| AI – Roast | DeepSeek API (`deepseek-chat`) | Portfolio analysis & scoring |
| AI – Chat | OpenRouter (`mistral-7b:free`) | Saathi conversational AI |
| Database | MongoDB Atlas | Roast history, user data |
| Runtime | Node.js 20 (WSL2 / Linux) | API routes via Next.js |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / Client                      │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Home Page   │   │ Saathi Chat  │   │ Portfolio Roast│  │
│  │  /home       │   │  /saathi     │   │  /roast        │  │
│  └──────┬───────┘   └──────┬───────┘   └───────┬────────┘  │
│         │                  │                   │           │
│         └──────────────────┴───────────────────┘           │
│                            │                               │
│                    Zustand Store                           │
│                (chat messages, persona)                    │
└────────────────────────────┼────────────────────────────────┘
                             │  fetch()
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                         │
│                                                             │
│   POST /api/chat          POST /api/roast                   │
│   ┌──────────────┐        ┌──────────────┐                 │
│   │  chat/route  │        │ roast/route  │                 │
│   │              │        │              │                 │
│   │ lib/openrouter│        │ DeepSeek API │                 │
│   │  (mock/live) │        │   (live)     │                 │
│   └──────┬───────┘        └──────┬───────┘                 │
└──────────┼─────────────────────  ┼ ──────────────────────── ┘
           │                       │
           ▼                       ▼
┌──────────────────┐    ┌──────────────────────────────────────┐
│   OpenRouter     │    │          DeepSeek API                │
│ openrouter.ai/   │    │       api.deepseek.com               │
│  api/v1          │    │                                      │
│                  │    │  Model: deepseek-chat                │
│ Model (default): │    │  Temp: 0.85                         │
│  mistral-7b:free │    │  Max tokens: 500                    │
│                  │    │  Returns: JSON {score, roast, fixes} │
│ MOCK_MODE when   │    │                                      │
│ no key in .env   │    └──────────────────────────────────────┘
└──────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │      MongoDB Atlas        │
                    │  Cluster: jobSearch       │
                    │  DB: finsaathi            │
                    │                          │
                    │  Collections:            │
                    │  • roasts (portfolio     │
                    │    analyses + scores)    │
                    └──────────────────────────┘
```

---

## Key Files

```
finsaathi/
├── app/
│   ├── (app)/                    # Authenticated app shell
│   │   ├── layout.tsx            # Responsive layout: sidebar (lg) / phone frame (sm)
│   │   ├── home/page.tsx         # Dashboard — roast card, insights, portfolio
│   │   ├── saathi/page.tsx       # AI chat powered by OpenRouter
│   │   ├── roast/page.tsx        # Portfolio Roast — 3-phase AI feature
│   │   └── ...                   # invest, finscore, money, me, family, credit
│   └── api/
│       ├── chat/route.ts         # POST — OpenRouter chat endpoint
│       └── roast/route.ts        # POST — DeepSeek analysis + MongoDB save
├── lib/
│   ├── openrouter.ts             # OpenRouter client (mock/live auto-switch)
│   ├── mongodb.ts                # MongoDB connection pooling
│   ├── usePersona.ts             # localStorage persona hook (hydration-safe)
│   ├── personas.ts               # Default demo persona (Rahul/Kunal)
│   └── generatePersona.ts        # Onboarding → DynamicPersona transformer
├── components/
│   ├── chrome/
│   │   ├── SideNav.tsx           # Desktop sidebar navigation
│   │   ├── BottomNav.tsx         # Mobile bottom navigation
│   │   └── AppHeader.tsx         # Shared sticky page header
│   └── shared/
│       ├── FSCard.tsx            # Base card component
│       ├── Pill.tsx              # Status/tag pill
│       ├── Avatar.tsx            # User initials avatar
│       └── Logo.tsx              # FinSaathi SVG logo
├── stores/
│   └── index.ts                  # Zustand stores (user, finScore, chat)
└── .env                          # MONGODB_URI, DEEPSEEK_API_KEY, OPENROUTER_API_KEY
```

---

## AI Provider Architecture

### OpenRouter (`lib/openrouter.ts`)

Auto-detects mock vs live based on `.env`:

```
OPENROUTER_API_KEY not set  →  MOCK_MODE = true
  └── Returns keyword-matched hardcoded responses (~520ms simulated latency)

OPENROUTER_API_KEY = real key  →  MOCK_MODE = false
  └── Real HTTP call to https://openrouter.ai/api/v1/chat/completions
```

**To go live:** Replace `your_openrouter_key_here` in `.env` with a key from [openrouter.ai](https://openrouter.ai). Free models available: `mistral-7b:free`, `llama-3.1-8b:free`, `gemma-3-27b:free`.

### DeepSeek (`app/api/roast/route.ts`)

Always live (key required). Returns structured JSON:

```json
{
  "score": 42,
  "roast": "...",
  "riskLevel": "Aggressive",
  "biggestIssue": "73% allocation in one sector",
  "fixes": ["...", "...", "..."]
}
```

---

## Responsive Layout

```
< 640px   (mobile)   →  Full viewport, bottom nav
640–1023px (tablet)  →  Phone frame (430×844px), rounded corners, shadow
≥ 1024px  (desktop)  →  Sidebar nav (232px) + scrollable content (max 720px)
```

The switch is handled entirely in CSS (`.mobile-screen` media query overrides) and `app/(app)/layout.tsx`.

---

## Data Flow — Portfolio Roast

```
User enters holdings
        │
        ▼
POST /api/roast
  { holdings: [{ name, allocation }] }
        │
        ├── Build prompt with Indian financial context
        │
        ├── Call DeepSeek API (deepseek-chat, temp 0.85)
        │
        ├── Parse JSON response
        │
        └── Fire-and-forget: save to MongoDB (finsaathi.roasts)
                │
                ▼
        Return { score, roast, riskLevel, biggestIssue, fixes }
                │
                ▼
        Client renders: Score ring → Roast quote → Fix plan
```

## Data Flow — Saathi Chat

```
User sends message
        │
        ▼
POST /api/chat
  { message, history: last 8 turns }
        │
        ├── Prepend financial system prompt
        │
        ├── Call openRouterChat()
        │     ├── MOCK_MODE → keyword match → hardcoded reply
        │     └── LIVE_MODE → OpenRouter → mistral-7b:free
        │
        └── Return { reply, provider: "openrouter", mode: "mock"|"live" }
                │
                ▼
        Zustand store: addBotMessage(reply)
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key (for Portfolio Roast) |
| `OPENROUTER_API_KEY` | No | OpenRouter key — mock mode if absent |
| `NEXT_PUBLIC_APP_URL` | No | App URL sent as `HTTP-Referer` to OpenRouter |
