"use client";
import Link from "next/link";
import {
  Bell, Shield, CreditCard, TrendingUp, TrendingDown,
  ChevronRight, Flag, Sparkles, Users,
} from "lucide-react";
import { Avatar }     from "@/components/shared/Avatar";
import { LangSwitch } from "@/components/shared/LangSwitch";
import { Pill }       from "@/components/shared/Pill";
import { FSCard }     from "@/components/shared/FSCard";
import { RingGauge }  from "@/components/finscore/RingGauge";
import { formatINR }  from "@/lib/format";
import { usePersona } from "@/lib/usePersona";
import { rahul, pooja, household } from "@/lib/personas";

function abbr(n: number) { return formatINR(n, { abbreviate: true }); }

export default function HomePage() {
  const persona = usePersona();

  // ── Resolved values (persona > rahul fallback) ────────────
  const firstName     = persona?.firstName           ?? rahul.firstName;
  const fullName      = persona?.name                ?? rahul.name;
  const age           = persona?.age                 ?? rahul.age;
  const finScore      = persona?.finScore            ?? rahul.finScore;
  const finScoreGrade = persona?.finScoreGrade       ?? rahul.finScoreGrade;
  const finScoreDelta = persona?.finScoreDelta       ?? rahul.finScoreDelta;
  const peerAvg       = persona?.finScorePeerAvg     ?? rahul.finScorePeerAvg;
  const cibil         = persona?.cibil               ?? rahul.cibil;
  const portValue     = persona?.portfolioValue      ?? rahul.portfolioValue;
  const portDelta     = persona?.portfolioDeltaToday ?? rahul.portfolioDeltaToday;
  const termOwned     = persona?.termCoverOwned      ?? rahul.termCoverOwned;
  const recCover      = persona?.recommendedTermCover ?? rahul.recommendedTermCover;
  const coverGap      = persona?.coverGap            ?? (rahul.recommendedTermCover - rahul.termCoverOwned);
  const premium       = persona?.termPremiumEstimate ?? rahul.termPremiumEstimate;
  const goals         = persona?.goals               ?? rahul.goals;
  const onTrack       = persona?.onTrackCount        ?? goals.filter(g => g.tone === "good").length;
  const emiPerMonth   = persona?.emiPerMonth         ?? rahul.homeLoan.emiPerMonth;
  const netWorth      = persona?.netWorth            ??
    (Object.values(rahul.netWorth.assets).reduce((a, b) => a + b, 0) -
     Object.values(rahul.netWorth.liabilities).reduce((a, b) => a + b, 0));
  const totalAssets   = persona?.totalAssets         ?? Object.values(rahul.netWorth.assets).reduce((a, b) => a + b, 0);
  const totalLiab     = persona?.totalLiabilities    ?? Object.values(rahul.netWorth.liabilities).reduce((a, b) => a + b, 0);
  const urgentAction  = persona?.urgentAction;

  const laggingGoals  = goals.filter(g => g.tone !== "good");
  const goalsSubText  = laggingGoals.length === 0
    ? "All goals on track 🎉"
    : laggingGoals.slice(0, 2).map(g => g.name).join(" & ") + " lagging";
  const scoreColor    = finScore >= 70 ? "var(--good)" : finScore >= 52 ? "var(--caution)" : "var(--bad)";

  // ── Household score (blend of user + Pooja) ──────────────
  const householdScore = Math.round((finScore * 0.55 + pooja.finScore * 0.45));
  const householdGrade =
    householdScore >= 65 ? "On track" :
    householdScore >= 50 ? "Developing" :
    "Needs attention";
  const householdGradeTone: "good" | "amber" | "rose" =
    householdScore >= 65 ? "good" : householdScore >= 50 ? "amber" : "rose";

  // Score bar widths (0–100 scale mapped to 300–900 CIBIL-style bucket)
  const rahulBarPct = Math.round((finScore / 100) * 100);
  const poojaBarPct = Math.round((pooja.finScore / 100) * 100);

  // ── Saathi insights (dynamic 3 bullets) ──────────────────
  const idleAmt = abbr(Math.round(portValue * 0.13));
  const insights = [
    {
      dot: "var(--good)",
      text: `${idleAmt} sitting at 3.5% in savings — liquid fund gives 7.1% with same access`,
    },
    {
      dot: "var(--indigo)",
      text: "SIP portfolio is 73% small-cap — rebalancing cuts volatility without hurting returns",
    },
    emiPerMonth > 0
      ? {
          dot: "var(--caution)",
          text: `Annual bonus could prepay ${abbr(emiPerMonth * 3)} of loan — saves more than investing it`,
        }
      : {
          dot: "var(--saffron)",
          text: `Your CIBIL ${cibil} pre-qualifies for a cashback card — earn back ₹570/mo on UPI`,
        },
  ];

  return (
    <div className="pb-8" style={{ background: "var(--bg-app)" }}>

      {/* ── Sticky greeting header ───────────────────── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-hairline"
        style={{ background: "rgba(250,245,235,0.94)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2.5">
          <Avatar name={fullName} size={36} tone="saffron" />
          <div>
            <div className="text-[11px] text-ink-3">Good morning,</div>
            <div className="text-[14px] font-bold text-ink leading-tight">{firstName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <button aria-label="Notifications"
            className="w-9 h-9 rounded-[12px] flex items-center justify-center text-ink-2 hover:bg-surface-3 transition-colors">
            <Bell size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-3.5 flex flex-col gap-3.5">

        {/* ── FinScore hero — compact ──────────────────── */}
        <Link href="/finscore">
          <div
            className="rounded-[18px] px-4 py-3.5 relative overflow-hidden active:scale-[0.99] transition-transform"
            style={{
              background: "linear-gradient(135deg, #faf0db 0%, #fbe7cf 55%, #f5d4a0 100%)",
              border: "1.5px solid rgba(217,120,58,0.2)",
              boxShadow: "0 2px 16px -6px rgba(168,85,34,0.18)",
            }}
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,120,58,0.2) 0%, transparent 70%)" }} />
            <div className="flex items-center gap-3 relative">
              <RingGauge score={finScore} size={86} thickness={8} grade={finScoreGrade} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "var(--saffron-deep)" }}>
                  FinScore · this month
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Pill tone="good" size="sm">+{finScoreDelta} vs Apr</Pill>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--ink-2)" }}>{finScoreGrade}</span>
                </div>
                <p className="text-[11px] mt-1 leading-[1.4]" style={{ color: "var(--saffron-ink)", opacity: 0.78 }}>
                  3 wins waiting · peer avg {peerAvg}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-bold" style={{ color: "var(--saffron-deep)" }}>
                  View breakdown <ChevronRight size={12} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* ── Do this next ─────────────────────────────── */}
        <div>
          <div className="flex items-baseline justify-between mb-2 px-0.5">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Do this next
            </span>
            <Link href="/insurance" className="text-[12px] font-bold" style={{ color: "var(--saffron-deep)" }}>
              See all 3
            </Link>
          </div>

          <FSCard tone="saffron" pad={14} className="flex gap-3 items-start">
            <div
              className="w-10 h-10 rounded-[13px] flex items-center justify-center shrink-0"
              style={{ background: "var(--saffron)", color: "#fff8ef" }}
            >
              {urgentAction?.kind === "invest"  ? <TrendingUp size={20} strokeWidth={2} />
               : urgentAction?.kind === "credit" ? <CreditCard size={20} strokeWidth={2} />
               : <Shield size={20} strokeWidth={2} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-extrabold tracking-[0.08em] uppercase" style={{ color: "var(--saffron-deep)" }}>
                {urgentAction?.tag ?? "Most urgent"}
              </div>
              <p className="text-[15px] font-medium mt-0.5 leading-[1.25]"
                style={{ fontFamily: "var(--font-display)", color: "var(--saffron-ink)" }}>
                {urgentAction
                  ? urgentAction.headline
                  : <>You need{" "}
                      <em className="italic" style={{ color: "var(--saffron-deep)" }}>{abbr(recCover)}</em>{" "}
                      term cover. You have <em className="italic">zero</em>.
                    </>
                }
              </p>
              <p className="text-[11px] mt-1 leading-[1.4]" style={{ color: "var(--saffron-ink)", opacity: 0.8 }}>
                {urgentAction?.sub ?? `Dependents are unprotected. Est. ${formatINR(premium)}/mo.`}
              </p>
              <div className="flex gap-2 mt-2.5">
                <Link href={urgentAction?.ctaHref ?? "/insurance/plans"}
                  className="inline-flex items-center px-3 h-8 rounded-[10px] text-[12px] font-bold"
                  style={{ background: "var(--saffron-ink)", color: "#fbe7cf" }}>
                  {urgentAction?.cta ?? "See best-fit plans"}
                </Link>
                <Link href={urgentAction?.whyHref ?? "/insurance"}
                  className="inline-flex items-center px-2.5 h-8 rounded-[10px] text-[12px] font-bold"
                  style={{ color: "var(--saffron-deep)" }}>
                  Why this?
                </Link>
              </div>
            </div>
          </FSCard>
        </div>

        {/* ══════════════════════════════════════════════════
            SAATHI INSIGHTS — single card replacing scroll
        ══════════════════════════════════════════════════ */}
        <Link href="/insights" className="block active:scale-[0.99] transition-transform">
          <div
            className="rounded-[16px] p-3"
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--hairline)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-[9px] flex items-center justify-center"
                  style={{ background: "var(--saffron)" }}
                >
                  <Sparkles size={13} strokeWidth={2} color="#fff8ef" />
                </div>
                <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase" style={{ color: "var(--saffron-deep)" }}>
                  Saathi · Always watching
                </div>
              </div>
              <ChevronRight size={14} strokeWidth={2} style={{ color: "var(--ink-3)" }} />
            </div>

            {/* Headline */}
            <p
              className="text-[15px] font-medium leading-[1.25] mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              I found{" "}
              <em className="italic" style={{ color: "var(--saffron-deep)" }}>
                {insights.length} things
              </em>{" "}
              worth your attention.
            </p>

            {/* Insight bullets */}
            <div className="flex flex-col gap-1.5">
              {insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-[4px]"
                    style={{ background: ins.dot }}
                  />
                  <span className="text-[11px] leading-[1.45]" style={{ color: "var(--ink-2)" }}>
                    {ins.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div
              className="mt-2.5 pt-2 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--hairline)" }}
            >
              <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                Updated 2 hours ago
              </span>
              <span className="text-[11px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
                See all insights <ChevronRight size={11} strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </Link>

        {/* ══════════════════════════════════════════════════
            FAMILY HUB — single card replacing member scroll
        ══════════════════════════════════════════════════ */}
        <Link href="/family" className="block active:scale-[0.99] transition-transform">
          <div
            className="rounded-[16px] p-3 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #faf0db 0%, #fbe7cf 55%, #f5d4a0 100%)",
              border: "1.5px solid rgba(217,120,58,0.2)",
              boxShadow: "0 2px 12px -6px rgba(168,85,34,0.15)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute -right-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,120,58,0.18) 0%, transparent 65%)" }}
            />

            <div className="relative">
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-[7px] flex items-center justify-center"
                    style={{ background: "rgba(168,85,34,0.15)" }}
                  >
                    <Users size={12} strokeWidth={2} style={{ color: "var(--saffron-deep)" }} />
                  </div>
                  <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase" style={{ color: "var(--saffron-deep)" }}>
                    Household FinScore
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-[11px] font-bold" style={{ color: "var(--saffron-deep)" }}>
                  Family Hub <ChevronRight size={11} strokeWidth={2.5} />
                </div>
              </div>

              {/* Score + grade — horizontal compact layout */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="tnum text-[38px] font-bold leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                >
                  {householdScore}
                </span>
                <div>
                  <Pill tone={householdGradeTone} size="sm">{householdGrade}</Pill>
                  <div className="text-[10px] mt-1" style={{ color: "var(--saffron-ink)", opacity: 0.7 }}>
                    Dragged by Pooja&apos;s score ({pooja.finScore})
                  </div>
                </div>
              </div>

              {/* Member score bars */}
              <div
                className="rounded-[10px] px-2.5 py-2 flex flex-col gap-2"
                style={{ background: "rgba(168,85,34,0.08)" }}
              >
                {[
                  { name: firstName, score: finScore, pct: rahulBarPct, color: scoreColor },
                  { name: "Pooja",   score: pooja.finScore, pct: poojaBarPct, color: "var(--bad)" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--saffron-ink)", minWidth: 44 }}>
                      {m.name}
                    </span>
                    <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(168,85,34,0.15)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${m.pct}%`, background: m.color }}
                      />
                    </div>
                    <span
                      className="tnum text-[12px] font-bold"
                      style={{ minWidth: 20, textAlign: "right", color: m.color }}
                    >
                      {m.score}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mini stats strip */}
              <div
                className="flex mt-2 pt-2"
                style={{ borderTop: "1px solid rgba(168,85,34,0.18)" }}
              >
                {[
                  { label: "Net worth",  value: abbr(Math.abs(netWorth)),  alert: false },
                  { label: "Runway",     value: "3.1 mo",                  alert: true  },
                  { label: "Term cover", value: termOwned === 0 ? "₹0" : abbr(termOwned), alert: termOwned === 0 },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="flex-1 text-center"
                    style={{ borderLeft: i > 0 ? "1px solid rgba(168,85,34,0.18)" : "none" }}
                  >
                    <div
                      className="tnum text-[13px] font-bold leading-tight"
                      style={{ color: stat.alert ? "var(--bad)" : "var(--ink)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[9px] mt-0.5" style={{ color: "var(--saffron-ink)", opacity: 0.6 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* ── Money snapshot 2×2 ─────────────────────── */}
        <div>
          <div className="flex items-baseline justify-between mb-2 px-0.5">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Snapshot · May
            </span>
            <Link href="/money" className="text-[12px] font-bold" style={{ color: "var(--saffron-deep)" }}>
              See Money →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5">

            <Link href="/credit">
              <FSCard tone="white" pad={13} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={13} strokeWidth={2} style={{ color: "var(--indigo)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Credit score</span>
                </div>
                <div className="tnum text-[24px] font-medium mt-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{cibil}</div>
                <div className="text-[10px] mt-0.5" style={{ color: cibil >= 720 ? "var(--good)" : "var(--caution)" }}>
                  {cibil >= 750 ? "Good" : cibil >= 700 ? "Fair · improving" : "Building"}
                </div>
              </FSCard>
            </Link>

            <Link href="/invest">
              <FSCard tone="white" pad={13} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} strokeWidth={2} style={{ color: "var(--good)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Portfolio</span>
                </div>
                <div className="tnum text-[24px] font-medium mt-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{abbr(portValue)}</div>
                <div className="flex items-center gap-0.5 text-[10px] mt-0.5"
                  style={{ color: portDelta >= 0 ? "var(--good)" : "var(--bad)" }}>
                  {portDelta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {portDelta >= 0 ? "+" : "−"}{abbr(Math.abs(portDelta))} today
                </div>
              </FSCard>
            </Link>

            <Link href="/insurance">
              <FSCard tone="white" pad={13} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5">
                  <Shield size={13} strokeWidth={2} style={{ color: "var(--saffron)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Term cover</span>
                </div>
                <div className="tnum text-[24px] font-medium mt-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {termOwned === 0 ? "₹0" : abbr(termOwned)}
                </div>
                <div className="text-[10px] mt-0.5">
                  {coverGap > 0
                    ? <span style={{ color: "var(--bad)" }}>{abbr(coverGap)} gap</span>
                    : <span style={{ color: "var(--good)" }}>Covered ✓</span>}
                </div>
              </FSCard>
            </Link>

            <Link href="/invest/goals">
              <FSCard tone="white" pad={13} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5">
                  <Flag size={13} strokeWidth={2} style={{ color: "var(--indigo)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Goals</span>
                </div>
                <div className="tnum text-[24px] font-medium mt-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {onTrack}/{goals.length}
                </div>
                <div className="text-[10px] mt-0.5"
                  style={{ color: laggingGoals.length === 0 ? "var(--good)" : "var(--caution)" }}>
                  {goalsSubText}
                </div>
              </FSCard>
            </Link>
          </div>
        </div>

        {/* ── Net worth mini card ─────────────────────── */}
        <Link href="/family">
          <FSCard tone="white" pad={13} className="active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase" style={{ color: "var(--ink-3)" }}>
                  Household net worth
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="tnum text-[26px] font-medium"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    {abbr(Math.abs(netWorth))}
                  </span>
                  <Pill tone="good" size="sm">+{abbr(Math.round(Math.abs(netWorth) * 0.09))} yr</Pill>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>Assets</div>
                <div className="tnum text-[12px] font-bold text-ink">{abbr(totalAssets)}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>Liabilities</div>
                <div className="tnum text-[12px] font-bold" style={{ color: "var(--bad)" }}>−{abbr(totalLiab)}</div>
              </div>
            </div>
            <div className="mt-2.5 flex h-1.5 rounded-full overflow-hidden gap-[1.5px]">
              {[
                { w: 55, c: "var(--saffron)" }, { w: 12, c: "var(--good)" },
                { w: 10, c: "var(--indigo)"  }, { w: 13, c: "var(--caution)" },
              ].map((b, i) => (
                <div key={i} style={{ width: `${b.w}%`, background: b.c, borderRadius: 99 }} />
              ))}
            </div>
          </FSCard>
        </Link>

      </div>
    </div>
  );
}
