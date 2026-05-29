"use client";
import Link from "next/link";
import {
  Bell, Shield, CreditCard, TrendingUp, TrendingDown,
  ChevronRight, Flag,
} from "lucide-react";
import { Avatar }     from "@/components/shared/Avatar";
import { LangSwitch } from "@/components/shared/LangSwitch";
import { Pill }       from "@/components/shared/Pill";
import { FSCard }     from "@/components/shared/FSCard";
import { RingGauge }  from "@/components/finscore/RingGauge";
import { formatINR }  from "@/lib/format";
import { usePersona } from "@/lib/usePersona";
import { rahul, pooja } from "@/lib/personas";

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
  const netWorth      = persona?.netWorth            ??
    (Object.values(rahul.netWorth.assets).reduce((a, b) => a + b, 0) -
     Object.values(rahul.netWorth.liabilities).reduce((a, b) => a + b, 0));
  const totalAssets   = persona?.totalAssets         ?? Object.values(rahul.netWorth.assets).reduce((a, b) => a + b, 0);
  const totalLiab     = persona?.totalLiabilities    ?? Object.values(rahul.netWorth.liabilities).reduce((a, b) => a + b, 0);
  const urgentAction  = persona?.urgentAction;

  const laggingGoals = goals.filter(g => g.tone !== "good");
  const goalsSubText = laggingGoals.length === 0
    ? "All goals on track 🎉"
    : laggingGoals.slice(0, 2).map(g => g.name).join(" & ") + " lagging";

  const scoreColor = finScore >= 70 ? "var(--good)" : finScore >= 52 ? "var(--caution)" : "var(--bad)";

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
              {/* Smaller ring */}
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
                <Link
                  href={urgentAction?.ctaHref ?? "/insurance/plans"}
                  className="inline-flex items-center px-3 h-8 rounded-[10px] text-[12px] font-bold"
                  style={{ background: "var(--saffron-ink)", color: "#fbe7cf" }}
                >
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

        {/* ── Saathi noticed — horizontal scroll ────────── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Saathi noticed
            </span>
            <Link href="/insights" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              See all <ChevronRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide snap-x snap-mandatory">
            {[
              {
                id: "liquid-fund", bg: "var(--tint-green)", fg: "var(--good-deep)", iconBg: "var(--good)",
                eyebrow: "IDLE MONEY", when: "Yesterday",
                headline: `${abbr(Math.round(portValue * 0.13))} at 3.5%`,
                sub: "Move to liquid fund · same-day access, 7.1% return.",
                value: abbr(Math.round(portValue * 0.031)), label: "EST. GAIN / YR",
                cta: "See the move", href: "/insights",
              },
              {
                id: "rebalance", bg: "var(--tint-indigo)", fg: "var(--indigo)", iconBg: "var(--indigo)",
                eyebrow: "PORTFOLIO DRIFT", when: "3 days ago",
                headline: "SIP is 73% small-cap",
                sub: "Rebalance to 50/30/20 — same returns, less volatility.",
                value: "Stability", label: "BENEFIT",
                cta: "Show rebalance", href: "/insights",
              },
              {
                id: "cashback", bg: "var(--tint-saffron)", fg: "var(--saffron-deep)", iconBg: "var(--saffron)",
                eyebrow: "SPENDING PATTERN", when: "2h ago",
                headline: `UPI earns ₹0`,
                sub: `Cashback card pays ₹570/mo back at your CIBIL ${cibil}.`,
                value: abbr(570 * 12), label: "EST. GAIN / YR",
                cta: "See the math", href: "/insights/cashback",
              },
              {
                id: "prepay", bg: "var(--tint-amber)", fg: "#6e4f0a", iconBg: "var(--caution)",
                eyebrow: "ANNUAL BONUS", when: "1 week ago",
                headline: "₹85K bonus — prepay?",
                sub: "Saves ₹38K in interest vs investing. Here's the math.",
                value: "₹38K", label: "INTEREST SAVED",
                cta: "Compare", href: "/insights",
              },
            ].map((ins) => (
              <Link
                key={ins.id}
                href={ins.href}
                className="shrink-0 snap-start flex flex-col rounded-[18px] overflow-hidden active:scale-[0.98] transition-transform"
                style={{
                  width: "calc(100vw - 112px)",
                  maxWidth: 240,
                  background: ins.bg,
                  border: "1px solid rgba(0,0,0,0.06)",
                  padding: 13,
                }}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <span className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: ins.iconBg }}>
                    <TrendingUp size={16} strokeWidth={2} color="#fff" />
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: ins.fg, opacity: 0.65 }}>{ins.when}</span>
                </div>
                <div className="text-[9px] font-extrabold tracking-[0.1em]" style={{ color: ins.fg }}>{ins.eyebrow}</div>
                <div className="mt-0.5 text-[16px] font-medium leading-[1.2]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  <em className="italic">{ins.headline.split(" ").slice(0, 2).join(" ")}</em>{" "}
                  {ins.headline.split(" ").slice(2).join(" ")}
                </div>
                <p className="text-[11px] mt-1 leading-[1.4]" style={{ color: "var(--ink-2)" }}>{ins.sub}</p>
                <div className="mt-2.5">
                  <div className="text-[9px] font-bold tracking-[0.07em]" style={{ color: ins.fg, opacity: 0.65 }}>{ins.label}</div>
                  <div className="tnum text-[18px] font-medium mt-0.5"
                    style={{ fontFamily: "var(--font-display)", color: ins.fg }}>
                    {ins.value}
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1 px-3 h-7 rounded-[10px] text-[11px] font-bold"
                    style={{ background: "rgba(255,255,255,0.65)", color: ins.fg }}>
                    {ins.cta} <ChevronRight size={11} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Your family ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
                Your family
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--bad)", color: "#fff" }}>1</span>
            </div>
            <Link href="/family" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              Hub <ChevronRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide snap-x snap-mandatory">
            {[
              {
                name: firstName, role: "You", sub: `${age} yrs`,
                score: finScore, scoreColor,
                tone: "saffron" as const, urgent: false, badge: null,
                urgentText: "", href: "/finscore",
                bg: "linear-gradient(135deg, #faf0db 0%, #fbe7cf 100%)",
                border: "1.5px solid rgba(217,120,58,0.22)",
              },
              {
                name: "Pooja", role: "Wife", sub: "Homemaker",
                score: pooja.finScore, scoreColor: "var(--bad)",
                tone: "indigo" as const, urgent: true,
                badge: "!", urgentText: "No CIBIL · No cover",
                href: "/family/pooja",
                bg: "var(--surface)",
                border: "1.5px solid var(--saffron)",
              },
              {
                name: "Riya", role: "Daughter", sub: "Age 4",
                score: null, scoreColor: "",
                tone: "cream" as const, urgent: false, badge: null,
                urgentText: "", href: "#",
                bg: "var(--surface)",
                border: "1px solid var(--hairline)",
              },
              {
                name: "Parents", role: "Dependents", sub: "Jaipur",
                score: null, scoreColor: "",
                tone: "cream" as const, urgent: false, badge: null,
                urgentText: "", href: "#",
                bg: "var(--surface)",
                border: "1px solid var(--hairline)",
              },
            ].map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="shrink-0 snap-start flex flex-col p-3.5 rounded-[18px] active:scale-[0.98] transition-transform"
                style={{ width: 148, background: m.bg, border: m.border }}
              >
                {/* Avatar row */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="relative">
                    <Avatar name={m.name} size={44} tone={m.tone} />
                    {m.badge && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-extrabold"
                        style={{ background: "var(--saffron)", color: "#fff8ef" }}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>
                  {m.score !== null && (
                    <div className="text-right">
                      <div className="tnum text-[24px] font-medium leading-none"
                        style={{ fontFamily: "var(--font-display)", color: m.scoreColor }}>
                        {m.score}
                      </div>
                      <div className="text-[9px] font-semibold mt-0.5" style={{ color: "var(--ink-3)" }}>FinScore</div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="text-[14px] font-bold text-ink leading-tight">{m.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>{m.role}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>{m.sub}</div>
                </div>

                {/* Status */}
                {m.urgent && (
                  <div className="mt-2 text-[10px] font-bold px-2 py-1 rounded-[8px]"
                    style={{ background: "rgba(220,38,38,0.08)", color: "var(--bad)" }}>
                    {m.urgentText}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

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

            {/* Credit */}
            <Link href="/credit">
              <FSCard tone="white" pad={13} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={13} strokeWidth={2} style={{ color: "var(--indigo)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Credit score</span>
                </div>
                <div className="tnum text-[24px] font-medium mt-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {cibil}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: cibil >= 720 ? "var(--good)" : "var(--caution)" }}>
                  {cibil >= 750 ? "Good" : cibil >= 700 ? "Fair · improving" : "Building"}
                </div>
              </FSCard>
            </Link>

            {/* Portfolio */}
            <Link href="/invest">
              <FSCard tone="white" pad={13} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} strokeWidth={2} style={{ color: "var(--good)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Portfolio</span>
                </div>
                <div className="tnum text-[24px] font-medium mt-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {abbr(portValue)}
                </div>
                <div className="flex items-center gap-0.5 text-[10px] mt-0.5"
                  style={{ color: portDelta >= 0 ? "var(--good)" : "var(--bad)" }}>
                  {portDelta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {portDelta >= 0 ? "+" : "−"}{abbr(Math.abs(portDelta))} today
                </div>
              </FSCard>
            </Link>

            {/* Term cover */}
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
                    : <span style={{ color: "var(--good)" }}>Covered ✓</span>
                  }
                </div>
              </FSCard>
            </Link>

            {/* Goals */}
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
                { w: 55, c: "var(--saffron)"  },
                { w: 12, c: "var(--good)"     },
                { w: 10, c: "var(--indigo)"   },
                { w: 13, c: "var(--caution)"  },
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
