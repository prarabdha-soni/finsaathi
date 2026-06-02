"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { usePersona } from "@/lib/usePersona";
import { rahul }     from "@/lib/personas";

const SIPS = [
  {
    id:       "riya-college",
    fund:     "Parag Parikh Flexi Cap",
    category: "Flexi Cap",
    sip:      6800,
    value:    84200,
    xirr:     14.2,
    goalName: "Riya's college 🎓",
    tone:     "good" as const,
  },
  {
    id:       "emergency",
    fund:     "HDFC Short Duration",
    category: "Debt",
    sip:      12000,
    value:    78400,
    xirr:     7.1,
    goalName: "Emergency fund 🛟",
    tone:     "amber" as const,
  },
  {
    id:       "retirement",
    fund:     "Nippon India Index — Nifty 50",
    category: "Index",
    sip:      13000,
    value:    21720,
    xirr:     11.8,
    goalName: "Retirement 🌅",
    tone:     "good" as const,
  },
];

const ALLOCATION = [
  { label: "Equity",  pct: 57, color: "var(--saffron)" },
  { label: "Debt",    pct: 31, color: "var(--indigo)"  },
  { label: "Gold",    pct: 12, color: "var(--caution)" },
];

// Mini portfolio sparkline (6 months)
const PORT_SPARK = [
  { x:   0, y: 148000 }, { x:  48, y: 155000 }, { x:  96, y: 162000 },
  { x: 144, y: 170000 }, { x: 192, y: 179000 }, { x: 240, y: 184320 },
];
const SPARK_MONTHS = ["D", "J", "F", "M", "A", "M"];
function sy(v: number) { return 55 - ((v - 140000) / 55000) * 50; }
const sparkPath = PORT_SPARK.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${sy(p.y)}`).join(" ");
const sparkArea = sparkPath + ` L${PORT_SPARK[PORT_SPARK.length - 1].x} 60 L0 60 Z`;

export default function InvestPage() {
  const persona = usePersona();

  // Live MF NAVs from MFAPI.in
  const [navs, setNavs] = useState<Record<string, { nav: number; date: string } | null>>({});
  useEffect(() => {
    fetch("/api/mf-nav")
      .then(r => r.json())
      .then((data: Array<{ sipId: string; nav: number | null; date: string | null }>) => {
        const map: Record<string, { nav: number; date: string } | null> = {};
        data.forEach(d => { map[d.sipId] = d.nav ? { nav: d.nav, date: d.date ?? "" } : null; });
        setNavs(map);
      })
      .catch(() => {/* silent */});
  }, []);

  // Dynamic values — fall back to rahul if no onboarding data
  const portValue     = persona?.portfolioValue     ?? rahul.portfolioValue;
  const todayDelta    = persona?.portfolioDeltaToday ?? rahul.portfolioDeltaToday;
  const sipTotal      = persona?.sipPerMonth         ?? rahul.sipPerMonth;
  const goals         = persona?.goals               ?? rahul.goals;

  const deltaPositive = todayDelta >= 0;

  // Scale sparkline Y values proportionally to actual portfolio
  const scaleFactor = portValue / 184320;
  const SPARK_SCALED = PORT_SPARK.map(p => ({ ...p, y: Math.round(p.y * scaleFactor) }));
  const syScaled = (v: number) => {
    const min = SPARK_SCALED[0].y * 0.97;
    const max = SPARK_SCALED[SPARK_SCALED.length - 1].y * 1.02;
    return 55 - ((v - min) / (max - min)) * 50;
  };
  const scaledPath = SPARK_SCALED.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${syScaled(p.y)}`).join(" ");
  const scaledArea = scaledPath + ` L${SPARK_SCALED[SPARK_SCALED.length - 1].x} 60 L0 60 Z`;

  return (
    <div className="pb-10">
      <AppHeader
        title="Investing"
        subtitle="Portfolio · May 2026"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Portfolio hero ──────────────────────── */}
        <div
          className="rounded-[20px] p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #faf0db 0%, #fbe7cf 55%, #f5d4a0 100%)",
            border: "1.5px solid rgba(217,120,58,0.22)",
            boxShadow: "0 2px 20px -6px rgba(168,85,34,0.18)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(217,120,58,0.2) 0%, transparent 70%)" }}
          />
          <div className="flex justify-between items-start relative">
            <div>
              <div
                className="text-[10px] font-bold tracking-[0.12em] uppercase mb-1"
                style={{ color: "var(--saffron-deep)" }}
              >
                Total portfolio value
              </div>
              <div
                className="tnum text-[36px] font-medium leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                {formatINR(portValue)}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                {deltaPositive
                  ? <TrendingUp  size={13} style={{ color: "var(--good)" }} />
                  : <TrendingDown size={13} style={{ color: "var(--bad)" }} />}
                <span
                  className="tnum text-[13px] font-semibold"
                  style={{ color: deltaPositive ? "var(--good)" : "var(--bad)" }}
                >
                  {deltaPositive ? "+" : ""}{formatINR(Math.abs(todayDelta))} today
                </span>
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-[11px] font-semibold"
                style={{ color: "var(--saffron-deep)", opacity: 0.7 }}
              >
                SIPs / mo
              </div>
              <div
                className="tnum text-[18px] font-bold mt-0.5"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                {formatINR(sipTotal)}
              </div>
            </div>
          </div>

          {/* Sparkline */}
          <svg viewBox="0 0 280 65" className="w-full mt-3 relative" style={{ height: 60 }}>
            <defs>
              <linearGradient id="portGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"   stopColor="rgba(168,85,34,0.35)" />
                <stop offset="100%" stopColor="rgba(168,85,34,0)" />
              </linearGradient>
            </defs>
            <path d={scaledArea} fill="url(#portGrad)" />
            <path d={scaledPath} stroke="var(--saffron-deep)" strokeWidth="2"
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {SPARK_SCALED.map((p, i) => (
              <circle key={i} cx={p.x} cy={syScaled(p.y)} r="2.5" fill="var(--saffron-deep)" />
            ))}
            {SPARK_MONTHS.map((m, i) => (
              <text key={i} x={i * 48} y="64" fontSize="9"
                fill="var(--ink-3)" fontFamily="var(--font-ui)" textAnchor="middle">
                {m}
              </text>
            ))}
          </svg>
        </div>

        {/* Diversification warning ─────────────── */}
        <div
          className="flex items-start gap-3 p-3.5 rounded-[14px]"
          style={{ background: "var(--tint-saffron)", border: "1px solid rgba(217,120,58,0.2)" }}
        >
          <div
            className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-[13px]"
            style={{ background: "var(--saffron)", color: "#fff8ef" }}
          >
            !
          </div>
          <div>
            <div className="text-[13px] font-bold text-ink">Diversification weak</div>
            <p className="text-[12px] text-muted mt-0.5 leading-[1.4]">
              3 funds, 2 overlap heavily in large-cap allocation. Saathi recommends
              swapping 1 fund to mid-cap index.
            </p>
          </div>
        </div>

        {/* Asset allocation ────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">Asset allocation</div>
          <div className="flex items-center gap-4">
            {/* Stacked bar */}
            <div className="flex-1 h-3 rounded-full overflow-hidden flex">
              {ALLOCATION.map((a) => (
                <div
                  key={a.label}
                  style={{ width: `${a.pct}%`, background: a.color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-2.5">
            {ALLOCATION.map((a) => (
              <div key={a.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                <span className="text-[11px] text-muted">{a.label}</span>
                <span className="tnum text-[11px] font-bold text-ink">{a.pct}%</span>
              </div>
            ))}
          </div>
        </FSCard>

        {/* Goals progress ──────────────────────── */}
        <div className="eyebrow px-1 pt-2 pb-0.5">Goals</div>
        {goals.map((g) => (
          <FSCard key={g.id} tone="white" pad={14}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px]">{g.icon}</span>
                  <span className="text-[13px] font-bold text-ink">{g.name}</span>
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                  By {g.by} · {formatINR(g.monthly)}/mo
                </div>
              </div>
              <Pill
                tone={g.tone === "bad" ? "rose" : g.tone}
                size="sm"
              >
                {g.status}
              </Pill>
            </div>
            <div
              className="h-[6px] rounded-full overflow-hidden"
              style={{ background: "var(--surface-3)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (g.have / g.target) * 100)}%`,
                  background:
                    g.tone === "good" ? "var(--good)"
                    : g.tone === "amber" ? "var(--caution)"
                    : "var(--bad)",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-muted">
              <span>{formatINR(g.have)} saved</span>
              <span>{formatINR(g.target)} target</span>
            </div>
          </FSCard>
        ))}

        {/* SIP cards ───────────────────────────── */}
        <div className="eyebrow px-1 pt-2 pb-0.5">Your SIPs</div>

        {SIPS.map((sip) => (
          <Link key={sip.id} href={`/invest/sip/${sip.id}`}>
            <FSCard tone="white" pad={14}>
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "var(--tint-saffron)", color: "var(--saffron-deep)" }}
                >
                  SIP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-ink truncate flex-1">
                      {sip.fund}
                    </span>
                    <Pill tone={sip.tone} size="sm">{sip.category}</Pill>
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">{sip.goalName}</div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <div className="text-[10px] text-muted">SIP / mo</div>
                      <div className="tnum text-[13px] font-bold text-ink">
                        {formatINR(sip.sip)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted">Value</div>
                      <div className="tnum text-[13px] font-bold text-ink">
                        {formatINR(sip.value)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted">XIRR</div>
                      <div
                        className="tnum text-[13px] font-bold"
                        style={{ color: sip.xirr >= 10 ? "var(--good)" : "var(--caution)" }}
                      >
                        {sip.xirr}%
                      </div>
                    </div>
                    {/* Live NAV from MFAPI.in */}
                    {navs[sip.id] && (
                      <div>
                        <div className="text-[10px] text-muted flex items-center gap-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: "var(--good)" }}
                          />
                          Live NAV
                        </div>
                        <div className="tnum text-[13px] font-bold" style={{ color: "var(--good-deep)" }}>
                          ₹{navs[sip.id]!.nav.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0, marginTop: 2 }} />
              </div>
            </FSCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
