import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface Holding {
  name: string;
  allocation: number;
}

export async function POST(req: NextRequest) {
  const { holdings }: { holdings: Holding[] } = await req.json();

  if (!holdings?.length) {
    return NextResponse.json({ error: "No holdings provided" }, { status: 400 });
  }

  const holdingsText = holdings
    .map((h) => `${h.name}: ${h.allocation}%`)
    .join(", ");

  const prompt = `You are a brutally honest but helpful Indian financial advisor who roasts bad portfolios like a finance Twitter bro. Be witty, specific, and culturally relevant (mention NSE/BSE, Zerodha, Groww etc where fitting). Be savage about bad allocations but always end with actionable advice.

Portfolio to roast: ${holdingsText}

Respond with ONLY valid JSON (no markdown, no \`\`\` fences):
{
  "score": <integer 0-100 portfolio health score>,
  "roast": "<2-3 savage but helpful sentences about the portfolio's worst problems>",
  "riskLevel": "<exactly one of: Conservative|Balanced|Aggressive|Reckless>",
  "biggestIssue": "<the single biggest problem in 5-8 words>",
  "fixes": [
    "<specific actionable fix 1 — be concrete with numbers/percentages>",
    "<specific actionable fix 2>",
    "<specific actionable fix 3>"
  ]
}`;

  const deepseekRes = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
      max_tokens: 500,
      stream: false,
    }),
  });

  if (!deepseekRes.ok) {
    const err = await deepseekRes.text();
    console.error("DeepSeek error:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
  }

  const aiData = await deepseekRes.json();
  const raw = aiData.choices?.[0]?.message?.content ?? "";

  let result;
  try {
    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    result = JSON.parse(cleaned);
  } catch {
    console.error("JSON parse failed. Raw:", raw);
    return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
  }

  // Persist to MongoDB async — don't block the response
  clientPromise
    .then((client) =>
      client.db("gloww").collection("roasts").insertOne({
        holdings,
        score: result.score,
        roast: result.roast,
        riskLevel: result.riskLevel,
        biggestIssue: result.biggestIssue,
        fixes: result.fixes,
        createdAt: new Date(),
      })
    )
    .catch((e) => console.error("MongoDB save failed:", e));

  return NextResponse.json(result);
}
