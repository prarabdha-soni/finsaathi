"use client";
import Link from "next/link";
import {
  Shield, CreditCard, TrendingUp, Flag, ChevronRight,
  TrendingDown, AlertTriangle,
} from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { Pill }      from "@/components/shared/Pill";
import { FSCard }    from "@/components/shared/FSCard";
import { formatINR } from "@/lib/format";
import { usePersona } from "@/lib/usePersona";
import { rahul }     from "@/lib/personas";

function abbr(n: number) { return formatINR(n, { abbreviate: true }); }

export default function MoneyPage() {
  const persona = usePersona();

  const cibil        = persona?.cibil              ?? rahul.cibil;
  const cibilTier    = persona?.cibilTier           ?? rahul.cibilTier;
  const portValue    = persona?.portfolioValue      ?? rahul.portfolioValue;
  const portDelta    = persona?.portfolioDeltaToday ?? rahul.portfolioDeltaToday;
  const sipTotal     = persona?.sipPerMonth         ?? rahul.sipPerMonth;
  const termOwned    = persona?.termCoverOwned      ?? rahul.termCoverOwned;
  const coverGap     = persona?.coverGap            ?? (rahul.recommendedTermCover - rahul.termCoverOwned);
  const premium      = persona?.termPremiumEstimate ?? rahul.termPremiumEstimate;
  const goals        = persona?.goals               ?? rahul.goals;
  const onTrack      = persona?.onTrackCount        ?? goals.filter(g => g.tone === "good").length;
  const income       = persona?.income              ?? rahul.income;
  const emiPerMonth  = persona?.emiPerMonth         ?? rahul.homeLoan.emiPerMonth;
  const netWorth     = persona?.netWorth            ??
    (Object.values(rahul.netWorth.assets).reduce((a, b) => a + b, 0) -
     Object.values(rahul.netWorth.liabilities).reduce((a, b) => a + b, 0));
  const totalAssets  = persona?.totalAssets         ?? Object.values(rahul.netWorth.assets).reduce((a, b) => a + b, 0);
  const totalLiab    = persona?.totalLiabilities    ?? Object.values(rahul.netWorth.liabilities).reduce((a, b) => a + b, 0);

  const portPositive = portDelta >= 0;
  const laggingGoals = goals.filter(g => g.tone !== "good");

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="Money"
        subtitle="Your finances at a glance"
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Net worth summary ───────────────────────── */}
        <div
          className="rounded-[18px] p-4"
          style={{
            background: "linear-gradient(135deg, #faf0db 0%, #fbe7cf 55%, #f5d4a0 100%)",
            border: "1.5px solid rgba(217,120,58,0.2)",
          }}
        >
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "var(--saffron-deep)" }}>
            Net worth
          </div>
          <div className="flex items-end justify-between mt-1">
            <div>
              <div
                className="tnum text-[32px] font-medium leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                {abbr(Math.abs(netWorth))}
              </div>
              <Pill tone="good" size="sm" className="mt-1.5">
                +{abbr(Math.round(Math.abs(netWorth) * 0.09))} this year
              </Pill>
            </div>
            <div className="text-right">
              <div className="text-[10px]" style={{ color: "var(--saffron-deep)", opacity: 0.7 }}>Assets</div>
              <div className="tnum text-[14px] font-bold" style={{ color: "var(--ink)" }}>{abbr(totalAssets)}</div>
              <div className="text-[10px] mt-1" style={{ color: "var(--saffron-deep)", opacity: 0.7 }}>Liabilities</div>
              <div className="tnum text-[14px] font-bold" style={{ color: "var(--bad)" }}>−{abbr(totalLiab)}</div>
            </div>
          </div>
          {/* Bar */}
          <div className="mt-3 h-[5px] rounded-full overflow-hidden flex gap-[2px]">
            {[
              { w: 55, c: "var(--saffron)"  },
              { w: 20, c: "var(--good)"     },
              { w: 10, c: "var(--indigo)"   },
              { w: 15, c: "var(--caution)"  },
            ].map((b, i) => (
              <div key={i} style={{ width: `${b.w}%`, background: b.c, borderRadius: 99 }} />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[9px]" style={{ color: "var(--saffron-ink)", opacity: 0.65 }}>
            <span>Property</span><span>MF</span><span>EPF</span><span>Gold/Other</span>
          </div>
        </div>

        {/* ── Section label ───────────────────────────── */}
        <div className="eyebrow px-0.5 pt-1">Financial areas</div>

        {/* ── 2×2 feature grid ────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Insurance */}
          <Link href="/insurance">
            <div
              className="rounded-[18px] p-4 flex flex-col gap-2 active:scale-[0.97] transition-transform"
              style={{
                background: "var(--tint-saffron)",
                border: "1.5px solid rgba(217,120,58,0.22)",
                minHeight: 148,
              }}
            >
              <div
                className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                style={{ background: "var(--saffron)", color: "#fff8ef" }}
              >
                <Shield size={18} strokeWidth={2} />
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: "var(--saffron-ink)" }}>Insurance</div>
                <div className="tnum text-[22px] font-medium mt-0.5 leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {termOwned === 0 ? "₹0" : abbr(termOwned)}
                </div>
                <div className="text-[10px] mt-1" style={{ color: "var(--saffron-ink)", opacity: 0.7 }}>Term cover</div>
              </div>
              <div className="mt-auto">
                {coverGap > 0
                  ? <Pill tone="rose" size="sm">{abbr(coverGap)} gap</Pill>
                  : <Pill tone="good" size="sm">Covered ✓</Pill>
                }
              </div>
            </div>
          </Link>

          {/* Credit */}
          <Link href="/credit">
            <div
              className="rounded-[18px] p-4 flex flex-col gap-2 active:scale-[0.97] transition-transform"
              style={{
                background: "var(--tint-indigo)",
                border: "1.5px solid rgba(99,102,241,0.18)",
                minHeight: 148,
              }}
            >
              <div
                className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                style={{ background: "var(--indigo)", color: "#fff" }}
              >
                <CreditCard size={18} strokeWidth={2} />
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: "var(--indigo)" }}>Credit</div>
                <div className="tnum text-[22px] font-medium mt-0.5 leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {cibil}
                </div>
                <div className="text-[10px] mt-1" style={{ color: "var(--indigo)", opacity: 0.7 }}>CIBIL score</div>
              </div>
              <div className="mt-auto">
                <Pill tone={cibil >= 720 ? "good" : "amber"} size="sm">{cibilTier}</Pill>
              </div>
            </div>
          </Link>

          {/* Invest */}
          <Link href="/invest">
            <div
              className="rounded-[18px] p-4 flex flex-col gap-2 active:scale-[0.97] transition-transform"
              style={{
                background: "var(--tint-green)",
                border: "1.5px solid rgba(34,197,94,0.18)",
                minHeight: 148,
              }}
            >
              <div
                className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                style={{ background: "var(--good)", color: "#fff" }}
              >
                <TrendingUp size={18} strokeWidth={2} />
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: "var(--good-deep)" }}>Invest</div>
                <div className="tnum text-[22px] font-medium mt-0.5 leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {abbr(portValue)}
                </div>
                <div className="text-[10px] mt-1" style={{ color: "var(--good-deep)", opacity: 0.7 }}>
                  {abbr(sipTotal)}/mo SIP
                </div>
              </div>
              <div className="mt-auto flex items-center gap-1">
                {portPositive
                  ? <TrendingUp  size={11} style={{ color: "var(--good)" }} />
                  : <TrendingDown size={11} style={{ color: "var(--bad)" }} />}
                <span className="tnum text-[11px] font-semibold"
                  style={{ color: portPositive ? "var(--good)" : "var(--bad)" }}>
                  {portPositive ? "+" : "−"}{abbr(Math.abs(portDelta))} today
                </span>
              </div>
            </div>
          </Link>

          {/* Tax */}
          <Link href="/tax">
            <div
              className="rounded-[18px] p-4 flex flex-col gap-2 active:scale-[0.97] transition-transform"
              style={{
                background: "var(--tint-amber)",
                border: "1.5px solid rgba(245,158,11,0.22)",
                minHeight: 148,
              }}
            >
              <div
                className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                style={{ background: "var(--caution)", color: "#fff" }}
              >
                <Flag size={18} strokeWidth={2} />
              </div>
              <div>
                <div className="text-[13px] font-bold" style={{ color: "#6e4f0a" }}>Tax · 80C</div>
                <div className="tnum text-[22px] font-medium mt-0.5 leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {income >= 30000 ? abbr(Math.min(income * 12 * 0.12, 150000)) : "₹0"}
                </div>
                <div className="text-[10px] mt-1" style={{ color: "#6e4f0a", opacity: 0.7 }}>80C utilised</div>
              </div>
              <div className="mt-auto">
                {income < 25000
                  ? <Pill tone="good" size="sm">Below bracket</Pill>
                  : <Pill tone="amber" size="sm">Room left</Pill>
                }
              </div>
            </div>
          </Link>
        </div>

        {/* ── Goals summary ───────────────────────────── */}
        <div className="eyebrow px-0.5 pt-1">Goals</div>

        <FSCard tone="white" pad={14}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="tnum text-[28px] font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                {onTrack}/{goals.length}
              </span>
              <span className="text-[12px] font-medium" style={{ color: "var(--ink-3)" }}>on track</span>
            </div>
            <Link href="/invest/goals" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              See all <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {goals.slice(0, 3).map((g) => (
              <div key={g.id} className="flex items-center gap-2.5">
                <span className="text-[16px] leading-none shrink-0">{g.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-ink truncate">{g.name}</span>
                    <span className="text-[10px] font-semibold shrink-0 ml-1"
                      style={{ color: g.tone === "good" ? "var(--good)" : g.tone === "amber" ? "var(--caution)" : "var(--bad)" }}>
                      {g.status}
                    </span>
                  </div>
                  <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((g.have / g.target) * 100))}%`,
                        background: g.tone === "good" ? "var(--good)" : g.tone === "amber" ? "var(--caution)" : "var(--bad)",
                      }}
                    />
                  </div>
                </div>
                <span className="tnum text-[10px] font-bold shrink-0" style={{ color: "var(--ink-2)" }}>
                  {Math.min(100, Math.round((g.have / g.target) * 100))}%
                </span>
              </div>
            ))}
          </div>
          {laggingGoals.length > 0 && (
            <div
              className="flex items-center gap-1.5 mt-3 p-2.5 rounded-[10px]"
              style={{ background: "var(--tint-saffron)" }}
            >
              <AlertTriangle size={12} style={{ color: "var(--saffron-deep)", flexShrink: 0 }} />
              <span className="text-[11px] font-semibold" style={{ color: "var(--saffron-deep)" }}>
                {laggingGoals.length} goal{laggingGoals.length > 1 ? "s" : ""} need attention
              </span>
            </div>
          )}
        </FSCard>

      </div>
    </div>
  );
}
