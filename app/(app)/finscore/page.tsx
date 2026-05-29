import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { IconBtn }   from "@/components/shared/IconBtn";
import { AppHeader } from "@/components/chrome/AppHeader";
import { Pill }      from "@/components/shared/Pill";
import { FSCard }    from "@/components/shared/FSCard";
import { rahul }     from "@/lib/personas";

// Dimension tone
function dimTone(score: number): "good" | "amber" | "bad" {
  if (score >= 75) return "good";
  if (score >= 55) return "amber";
  return "bad";
}

const BAR_COLORS = {
  good:  "var(--good)",
  amber: "var(--caution)",
  bad:   "var(--bad)",
};

// Sparkline data points: Dec→May, score 48→61
const SPARKLINE = [
  { x:  0, y: 48 }, { x: 40, y: 50 }, { x: 80, y: 52 },
  { x: 120, y: 55 }, { x: 160, y: 58 }, { x: 200, y: 59 },
  { x: 240, y: 61 },
];
const MONTHS = ["D", "J", "F", "M", "A", "M"];

// Scale y from [48,65] to SVG [60,10]
function sy(v: number) { return 60 - ((v - 46) / 20) * 55; }

const pathD = SPARKLINE.map((p, i) =>
  `${i === 0 ? "M" : "L"}${p.x} ${sy(p.y)}`
).join(" ");
const areaD = pathD + ` L${SPARKLINE[SPARKLINE.length - 1].x} 70 L0 70 Z`;

export default function FinScoreDetailPage() {
  const dims = Object.entries(rahul.dimensions).map(([key, d]) => ({
    name:   key.charAt(0).toUpperCase() + key.slice(1),
    score:  d.score,
    weight: d.weight,
    hint:   d.hint,
    tone:   dimTone(d.score),
  }));

  return (
    <div className="pb-8">
      <AppHeader
        title="Your FinScore"
        subtitle="Updated 26 May · monthly"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back">
              <ChevronLeft size={18} />
            </IconBtn>
          </Link>
        }
        trailing={
          <IconBtn aria-label="Share">
            <Sparkles size={16} />
          </IconBtn>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-2.5">
        {/* ── Trend card ───────────────────────────── */}
        <FSCard tone="cream" pad={16}>
          <div className="flex justify-between items-baseline">
            <div>
              <div className="eyebrow">6 month trend</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className="tnum text-[32px] font-medium"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {rahul.finScore}
                </span>
                <Pill tone="good" size="sm">+13 since Dec</Pill>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted">Peer avg · age {rahul.age}</div>
              <div className="tnum text-[18px] font-bold text-ink-2">
                {rahul.finScorePeerAvg}
              </div>
            </div>
          </div>

          {/* Sparkline */}
          <svg
            viewBox="0 0 280 70"
            className="w-full mt-2"
            style={{ height: 70 }}
          >
            <defs>
              <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"   stopColor="rgba(217,120,58,0.45)" />
                <stop offset="100%" stopColor="rgba(217,120,58,0)" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#sparkGrad)" />
            <path
              d={pathD}
              stroke="var(--saffron)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {SPARKLINE.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={sy(p.y)}
                r="2.5"
                fill="var(--saffron)"
              />
            ))}
            {MONTHS.map((m, i) => (
              <text
                key={i}
                x={i * 40 + 40}
                y="68"
                fontSize="9"
                fill="var(--muted)"
                fontFamily="var(--font-ui)"
                textAnchor="middle"
              >
                {m}
              </text>
            ))}
          </svg>
        </FSCard>

        {/* ── 5 dimensions ─────────────────────────── */}
        <div className="eyebrow px-1 pt-3 pb-1">The 5 dimensions</div>

        {dims.map((d) => (
          <FSCard key={d.name} tone="white" pad={16}>
            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-[14px] font-bold text-ink">{d.name}</div>
                <div className="text-[11px] text-muted mt-0.5">Weight {d.weight}%</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="tnum text-[22px] font-bold text-ink">{d.score}</span>
                <span className="text-[11px] text-muted">/100</span>
              </div>
            </div>

            {/* Bar */}
            <div
              className="h-[8px] rounded-full overflow-hidden mt-2.5"
              style={{ background: "var(--surface-3)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${d.score}%`,
                  background: BAR_COLORS[d.tone],
                }}
              />
            </div>

            <div className="text-[12px] text-ink-3 mt-2">{d.hint}</div>
          </FSCard>
        ))}

        {/* ── Top 3 actions ────────────────────────── */}
        <div className="eyebrow px-1 pt-3 pb-1">Top 3 actions to move the needle</div>

        {[
          {
            rank: 1,
            title: "Get ₹1.2Cr term insurance",
            impact: "+11 pts protection score",
            effort: "10 min",
            iconBg: "var(--bad)",
            href: "/insurance/plans",
          },
          {
            rank: 2,
            title: "Move ₹1.6L to liquid fund",
            impact: "+4 pts liquidity score",
            effort: "5 min",
            iconBg: "var(--good)",
            href: "/insights/liquid-fund",
          },
          {
            rank: 3,
            title: "Reduce credit card to 20%",
            impact: "+6 pts credit score",
            effort: "Pay ₹14K",
            iconBg: "var(--indigo)",
            href: "/credit/plan",
          },
        ].map((a) => (
          <Link key={a.rank} href={a.href}>
            <FSCard tone="white" pad={14} className="active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center text-[12px] font-extrabold"
                  style={{ background: a.iconBg, color: "#fff8ef" }}
                >
                  {a.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-ink">{a.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                    {a.impact} · {a.effort}
                  </div>
                </div>
                <ChevronRight size={15} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
              </div>
            </FSCard>
          </Link>
        ))}

        {/* ── Peer comparison ──────────────────────── */}
        <FSCard tone="cream" pad={16} className="mt-1">
          <div className="eyebrow mb-3">How you compare · age 28</div>
          {[
            { label: "Top 10%", score: 78, color: "var(--good)"    },
            { label: "You",     score: rahul.finScore, color: "var(--saffron)", bold: true },
            { label: "Average", score: rahul.finScorePeerAvg, color: "var(--caution)" },
            { label: "Bottom",  score: 31, color: "var(--ink-3)"   },
          ].map((p) => (
            <div key={p.label} className={`flex items-center gap-3 mb-2.5 last:mb-0`}>
              <div className="w-14 text-[11px] font-semibold shrink-0"
                style={{ color: p.bold ? "var(--ink)" : "var(--ink-3)" }}>
                {p.label}
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${p.score}%`, background: p.color }}
                />
              </div>
              <div className="tnum text-[12px] font-bold shrink-0 w-6 text-right"
                style={{ color: p.bold ? "var(--ink)" : "var(--ink-3)" }}>
                {p.score}
              </div>
            </div>
          ))}
        </FSCard>

        {/* ── Indigo callout ───────────────────────── */}
        <div
          className="p-4 rounded-[16px] mt-1"
          style={{ background: "var(--tint-indigo)" }}
        >
          <div className="eyebrow" style={{ color: "var(--indigo)" }}>
            The one metric
          </div>
          <p
            className="text-[16px] font-medium text-indigo mt-1.5 leading-[1.4]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            At 1.5 pts/month you move from{" "}
            <em className="italic">Building</em> to{" "}
            <em className="italic">Strong</em>{" "}
            by May 2027. That&apos;s the only number that matters.
          </p>
        </div>
      </div>
    </div>
  );
}
