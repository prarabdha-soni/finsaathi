import { NextRequest, NextResponse } from "next/server";
import { openRouterChat, openRouterStatus, OPENROUTER_MODELS, type LLMMessage } from "@/lib/openrouter";

const SYSTEM_PROMPT = `You are Saathi, a sharp and friendly Indian personal finance assistant built by FinSaathi.
You have access to the user's financial profile: income ~₹65K/month, CIBIL 724, home loan EMI ₹24,800,
SIP in small-cap funds, ₹12K 80C headroom remaining, no term insurance.
Keep replies under 3 sentences. Be specific with numbers. Use Indian context (NSE, BSE, SEBI, ITR, SIP, ELSS, etc.).
Never recommend specific stocks. Always suggest speaking to a SEBI-registered advisor for large decisions.`;

export async function POST(req: NextRequest) {
  const { message, history } = (await req.json()) as {
    message: string;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!message?.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const messages: LLMMessage[] = [
    { role: "system",    content: SYSTEM_PROMPT },
    ...(history ?? []).slice(-8), // keep last 8 turns for context
    { role: "user", content: message },
  ];

  try {
    const reply = await openRouterChat(messages, OPENROUTER_MODELS.default);
    return NextResponse.json({ reply, provider: "openrouter", mode: openRouterStatus });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json({ error: "AI unavailable" }, { status: 502 });
  }
}
