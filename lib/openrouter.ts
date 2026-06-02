/**
 * OpenRouter client — wraps https://openrouter.ai/api/v1
 *
 * MOCK_MODE is active when OPENROUTER_API_KEY is absent or set to the
 * placeholder value.  Flip it off by adding a real key to .env.
 * Everything else (system prompt, model choice, message format) stays
 * identical whether mock or live — so the switch is one .env line.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Free models available on OpenRouter — swap to any other freely
export const OPENROUTER_MODELS = {
  fast:    "meta-llama/llama-3.1-8b-instruct:free",
  smart:   "google/gemma-3-27b-it:free",
  default: "mistralai/mistral-7b-instruct:free",
} as const;

export type OpenRouterModel = (typeof OPENROUTER_MODELS)[keyof typeof OPENROUTER_MODELS];

// ── Mock corpus ─────────────────────────────────────────────
// Keyword-matched replies that approximate what the real LLM would say.
// Replace with real responses once the key is active.
const MOCK_CORPUS: Array<{ keys: string[]; reply: string }> = [
  {
    keys: ["cibil", "credit score", "credit"],
    reply: "Your CIBIL of 724 is solid but not premium. To cross 750, keep your utilisation below 30% and avoid hard enquiries for the next 3 months. The SBI pre-approval should not need a fresh pull.",
  },
  {
    keys: ["elss", "80c", "tax saving", "tax"],
    reply: "You still have ₹12,000 of 80C headroom. Routing that into ELSS gives you market returns on top of the deduction — PPF would lock it for 15 years. I would not lumpsum; a ₹2K/month SIP from now covers the gap before March.",
  },
  {
    keys: ["sip", "invest", "mutual fund", "nifty", "portfolio"],
    reply: "Your SIP is 73% small-cap right now — that is aggressive for a 3-year horizon. Tilting 20% towards a Nifty 50 index fund cuts volatility without sacrificing much expected return.",
  },
  {
    keys: ["insurance", "term", "cover", "protect"],
    reply: "At ₹1.2Cr cover for ₹390/month, HDFC Click2Protect is the best-value option for your age bracket. The gap between your current ₹0 and the recommended ₹1.2Cr is the single largest risk in your profile.",
  },
  {
    keys: ["emi", "loan", "home loan", "prepay"],
    reply: "Your annual bonus of ₹85K would save ₹38K in interest if you prepay — marginally better than investing it at market rates. The real win is psychological: you free up ₹24,800/month 8 months earlier.",
  },
  {
    keys: ["emergency", "savings", "liquid", "fd"],
    reply: "You are at 3.1 months of runway versus the 6-month target. Parking the gap (₹1.6L) in a liquid fund gives you 7.1% and same next-day access as a savings account.",
  },
  {
    keys: ["gold", "sgb", "etf"],
    reply: "Gold ETFs (GoldBees, ICICI Gold) trade on NSE at real-time prices with zero making charges and 12.5% LTCG on gains. SGBs give an extra 2.5% interest but lock you in for 8 years — right now ETFs are more flexible.",
  },
];

const FALLBACK_REPLY =
  "Good question. Let me cross-reference your account statements and get back to you with a specific number — that is more useful than a generic answer.";

function mockReply(messages: LLMMessage[]): string {
  const last = messages.findLast(m => m.role === "user")?.content.toLowerCase() ?? "";
  const match = MOCK_CORPUS.find(({ keys }) => keys.some(k => last.includes(k)));
  return match?.reply ?? FALLBACK_REPLY;
}

// ── Real OpenRouter call ─────────────────────────────────────
async function liveCall(
  messages: LLMMessage[],
  model: OpenRouterModel,
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://gloww.app",
      "X-Title":      "Gloww",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens:  280,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err}`);
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) ?? FALLBACK_REPLY;
}

// ── Public API ───────────────────────────────────────────────
const isMock =
  !process.env.OPENROUTER_API_KEY ||
  process.env.OPENROUTER_API_KEY === "your_openrouter_key_here";

export async function openRouterChat(
  messages: LLMMessage[],
  model: OpenRouterModel = OPENROUTER_MODELS.default,
): Promise<string> {
  if (isMock) {
    await new Promise(r => setTimeout(r, 520)); // simulate latency
    return mockReply(messages);
  }
  return liveCall(messages, model);
}

export const openRouterStatus = isMock ? "mock" : "live";
