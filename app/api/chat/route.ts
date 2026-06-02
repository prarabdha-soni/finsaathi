/**
 * POST /api/chat
 *
 * Streams a DeepSeek response as Server-Sent Events.
 * The client reads the stream and appends tokens in real-time.
 */

import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Saathi, a sharp and friendly Indian personal finance assistant built by Gloww.
You have access to the user's financial profile: income ~₹65K/month, CIBIL 724, home loan EMI ₹24,800, SIP in small-cap funds, ₹12K 80C headroom remaining, no term insurance.
Keep replies under 3 sentences. Be specific with numbers. Use Indian context (NSE, BSE, SEBI, ITR, SIP, ELSS, etc.).
Never recommend specific stocks. Always suggest speaking to a SEBI-registered advisor for large decisions.`;

export async function POST(req: NextRequest) {
  const { message, history } = (await req.json()) as {
    message: string;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "Empty message" }), { status: 400 });
  }

  const messages = [
    { role: "system",    content: SYSTEM_PROMPT },
    ...(history ?? []).slice(-8),
    { role: "user",      content: message },
  ];

  const deepseekRes = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model:      "deepseek-chat",
      messages,
      stream:     true,
      max_tokens: 280,
      temperature: 0.7,
    }),
  });

  if (!deepseekRes.ok || !deepseekRes.body) {
    const err = await deepseekRes.text();
    console.error("DeepSeek chat error:", err);
    return new Response(JSON.stringify({ error: "AI unavailable" }), { status: 502 });
  }

  // Pass the DeepSeek SSE stream straight through to the browser
  return new Response(deepseekRes.body, {
    headers: {
      "Content-Type":  "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
