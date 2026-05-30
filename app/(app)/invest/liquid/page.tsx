import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, Zap } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

/* ── Top liquid funds ───────────────────────────────────────── */
const FUNDS = [
  {
    name:       "Mirae Asset Liquid",
    amc:        "Mirae Asset MF",
    ret1y:      7.18,
    ret3y:      6.82,
    aum:        14200,
    minInvest:  500,
    settlement: "T+1",
    exitLoad:   "Nil after 7 days",
    saathiPick: true,
    riskometer: "Low risk",
  },
  {
    name:       "Nippon India Liquid",
    amc:        "Nippon India MF",
    ret1y:      7.14,
    ret3y:      6.79,
    aum:        27800,
    minInvest:  100,
    settlement: "T+1",
    exitLoad:   "Nil after 7 days",
    saathiPick: false,
    riskometer: "Low risk",
  },
  {
    name:       "HDFC Liquid",
    amc:        "HDFC Mutual Fund",
    ret1y:      7.12,
    ret3y:      6.77,
    aum:        62400,
    minInvest:  500,
    settlement: "T+1",
    exitLoad:   "Nil after 7 days",
    saathiPick: false,
    riskometer: "Low risk",
  },
  {
    name:       "SBI Liquid",
    amc:        "SBI Funds Mgmt",
    ret1y:      7.08,
    ret3y:      6.73,
    aum:        42100,
    minInvest:  500,
    settlement: "T+1",
    exitLoad:   "Nil after 7 days",
    saathiPick: false,
    riskometer: "Low risk",
  },
  {
    name:       "Axis Liquid",
    amc:        "Axis Mutual Fund",
    ret1y:      7.10,
    ret3y:      6.75,
    aum:        13900,
    minInvest:  500,
    settlement: "T+1",
    exitLoad:   "Nil after 7 days",
    saathiPick: false,
    riskometer: "Low risk",
  },
];

/* ── Savings options comparison ─────────────────────────────── */
const SAVINGS_OPTIONS = [
  { name: "SBI Savings",      rate: 3.00, type: "Bank",   color: "var(--bad)",    accessible: "Instant"  },
  { name: "HDFC Savings",     rate: 3.50, type: "Bank",   color: "var(--bad)",    accessible: "Instant"  },
  { name: "Kotak 811",        rate: 4.00, type: "Bank",   color: "var(--caution)", accessible: "Instant"  },
  { name: "FD (1 yr)",        rate: 7.00, type: "FD",     color: "var(--caution)", accessible: "Penalty on break" },
  { name: "Mirae Liquid MF",  rate: 7.18, type: "MF",     color: "var(--good)",   accessible: "Next day (T+1)" },
];

export default function LiquidFundPage() {
  // Rahul's emergency fund data
  const emergencyGoal   = rahul.goals.find(g => g.id === "emergency");
  const saved           = emergencyGoal?.have   ?? 78000;
  const target          = emergencyGoal?.target ?? 400000;
  const gap             = target - saved;
  const monthsTarget    = 6;
  const monthsCurrent   = 3.1;
  const monthlyExpenses = 51000;
  const monthsToGoal    = Math.ceil(gap / (emergencyGoal?.monthly ?? 12000));

  // How much more earned at 7.1% vs 3.5% on current saved amount
  const extraEarnings   = Math.round(saved * (0.071 - 0.035));

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="Liquid Fund"
        subtitle="Emergency fund · 7.1% on idle cash"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-4">

        {/* ── Emergency fund tracker ────────────────────── */}
        <div
          className="rounded-[20px] p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 55%, #bbf7d0 100%)",
            border: "1.5px solid rgba(22,163,74,0.2)",
            boxShadow: "0 2px 16px -6px rgba(22,163,74,0.2)",
          }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 65%)" }} />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase mb-1"
                  style={{ color: "#15803d" }}>
                  {rahul.firstName}&apos;s emergency fund
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-[36px] font-bold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    {formatINR(saved, { abbreviate: true })}
                  </span>
                  <span className="text-[13px]" style={{ color: "var(--ink-3)" }}>saved</span>
                </div>
                <div className="text-[12px] mt-1" style={{ color: "#15803d" }}>
                  {monthsCurrent} of {monthsTarget} months · {formatINR(gap, { abbreviate: true })} more to go
                </div>
              </div>
              <span className="text-[36px]">🛟</span>
            </div>

            {/* Month meter */}
            <div className="flex gap-1.5 mb-2">
              {Array.from({ length: monthsTarget }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-3 rounded-full"
                  style={{
                    background: i < Math.floor(monthsCurrent)
                      ? "#22c55e"
                      : i === Math.floor(monthsCurrent)
                      ? "rgba(34,197,94,0.35)"
                      : "rgba(22,163,74,0.15)",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px]" style={{ color: "#15803d" }}>
              <span>₹0</span>
              <span className="font-bold">{monthsCurrent} months now</span>
              <span>{monthsTarget} months target</span>
            </div>

            <div
              className="mt-3 p-2.5 rounded-[10px]"
              style={{ background: "rgba(22,163,74,0.1)" }}
            >
              <p className="text-[12px] leading-[1.45]" style={{ color: "#14532d" }}>
                <strong>40% of Indians have no emergency fund.</strong>{" "}
                Park {formatINR(gap, { abbreviate: true })} in a liquid fund earning 7.1% —
                not a savings account at 3.5%.
              </p>
            </div>
          </div>
        </div>

        {/* ── Lost interest calculator ──────────────────── */}
        <FSCard tone="cream" pad={14}>
          <div className="eyebrow mb-2">Sitting in savings = leaving money behind</div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
              style={{ background: "var(--tint-saffron)" }}
            >
              <TrendingUp size={18} style={{ color: "var(--saffron-deep)" }} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-ink">
                {formatINR(extraEarnings)}/yr extra at 7.1% vs 3.5%
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                On your ₹{formatINR(saved, { abbreviate: true })} sitting in savings account right now
              </div>
            </div>
          </div>
        </FSCard>

        {/* ── Savings options comparison ───────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="eyebrow mb-3">Where to park your money</div>
          {SAVINGS_OPTIONS.map((opt, i, arr) => {
            const isBest = opt.name.includes("Mirae");
            return (
              <div
                key={opt.name}
                className="flex items-center gap-3 py-2.5"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none",
                  background: isBest ? "rgba(22,163,74,0.05)" : "transparent",
                  margin: isBest ? "0 -14px" : "0",
                  padding: isBest ? "10px 14px" : undefined,
                  borderRadius: isBest ? 10 : 0,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: opt.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[12px] font-semibold text-ink">{opt.name}</span>
                    {isBest && <Pill tone="good" size="sm">Best pick</Pill>}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                    {opt.accessible}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className="tnum text-[14px] font-bold"
                    style={{ color: opt.color }}
                  >
                    {opt.rate}%
                  </div>
                  <div className="text-[9px] mt-0.5" style={{ color: "var(--ink-3)" }}>annual</div>
                </div>
              </div>
            );
          })}
        </FSCard>

        {/* ── Top liquid funds ──────────────────────────── */}
        <div>
          <div className="eyebrow mb-3">Top liquid funds · {FUNDS.length} options</div>
          <div className="flex flex-col gap-2.5">
            {FUNDS.map((f) => (
              <FSCard key={f.name} tone="white" pad={14}>
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center font-bold text-[11px] shrink-0"
                    style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}
                  >
                    {f.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-bold text-ink">{f.name}</span>
                      {f.saathiPick && <Pill tone="good" size="sm">Saathi pick</Pill>}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                      {f.amc} · AUM ₹{(f.aum / 100).toFixed(1)}K Cr
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div
                  className="flex gap-0 rounded-[10px] overflow-hidden mb-3"
                  style={{ background: "var(--surface-3)" }}
                >
                  {[
                    { label: "1Y return",   value: `${f.ret1y}%`, good: true  },
                    { label: "3Y return",   value: `${f.ret3y}%`, good: true  },
                    { label: "Settlement",  value: f.settlement,  good: false },
                    { label: "Exit load",   value: "None",        good: true  },
                  ].map((m, i, arr) => (
                    <div
                      key={m.label}
                      className="flex-1 py-2 text-center"
                      style={{ borderRight: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
                    >
                      <div
                        className="tnum text-[11px] font-bold"
                        style={{ color: m.good ? "var(--good)" : "var(--ink)" }}
                      >
                        {m.value}
                      </div>
                      <div className="text-[9px] mt-0.5" style={{ color: "var(--ink-3)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[11px]" style={{ color: "var(--ink-3)" }}>
                    Min invest: <strong className="text-ink">₹{f.minInvest}</strong> · {f.riskometer}
                  </div>
                  <button
                    className="text-[11px] font-bold flex items-center gap-0.5"
                    style={{ color: "#16a34a" }}
                  >
                    Invest <ChevronRight size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </FSCard>
            ))}
          </div>
        </div>

        {/* ── Goal plan ─────────────────────────────────── */}
        <div
          className="flex items-start gap-3 p-4 rounded-[16px]"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "1px solid rgba(22,163,74,0.18)",
          }}
        >
          <Zap size={18} strokeWidth={2} style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1">
            <div className="text-[13px] font-bold" style={{ color: "#14532d" }}>
              ₹{emergencyGoal?.monthly?.toLocaleString("en-IN") ?? "12,000"}/mo to hit 6-month target
            </div>
            <p className="text-[12px] mt-0.5 leading-[1.45]" style={{ color: "#166534" }}>
              At 7.1%, you reach {formatINR(target, { abbreviate: true })} in ~{monthsToGoal} months.
              Money stays accessible — not locked like an FD.
            </p>
          </div>
          <Link href="/invest/goals"
            className="shrink-0 text-[12px] font-bold"
            style={{ color: "#16a34a" }}>
            Set goal →
          </Link>
        </div>

      </div>
    </div>
  );
}
