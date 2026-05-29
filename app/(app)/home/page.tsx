"use client";
import Link from "next/link";
import {
  Bell, Shield, CreditCard, TrendingUp, Flag,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { Logo }       from "@/components/shared/Logo";
import { Avatar }     from "@/components/shared/Avatar";
import { LangSwitch } from "@/components/shared/LangSwitch";
import { Pill }       from "@/components/shared/Pill";
import { FSCard }     from "@/components/shared/FSCard";
import { RingGauge }  from "@/components/finscore/RingGauge";
import { formatINR }  from "@/lib/format";
import { rahul, pooja, riya, parents, household } from "@/lib/personas";

const QUICK_LINKS = [
  { id: "insurance", label: "Insurance", Icon: Shield,     href: "/insurance", bg: "var(--tint-saffron)", fg: "var(--saffron-deep)" },
  { id: "credit",    label: "Credit",    Icon: CreditCard, href: "/credit",    bg: "var(--tint-indigo)",  fg: "var(--indigo)" },
  { id: "invest",    label: "Invest",    Icon: TrendingUp, href: "/invest",    bg: "var(--tint-green)",   fg: "var(--good-deep)" },
  { id: "tax",       label: "Tax · 80C", Icon: Flag,       href: "/tax",       bg: "var(--tint-amber)",   fg: "#6e4f0a" },
];

export default function HomePage() {
  return (
    <div className="pb-8" style={{ background: "var(--bg-app)" }}>

      {/* Sticky greeting header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-hairline"
        style={{ background: "rgba(250,245,235,0.94)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2.5">
          <Avatar name={rahul.name} size={38} tone="saffron" />
          <div>
            <div className="text-[11px] text-ink-3">Good morning,</div>
            <div className="text-[15px] font-bold text-ink leading-tight">{rahul.firstName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-[12px] flex items-center justify-center text-ink-2 hover:bg-surface-3 transition-colors"
          >
            <Bell size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-4">

        {/* FinScore hero */}
        <Link href="/finscore">
          <div
            className="rounded-[22px] p-5 relative overflow-hidden active:scale-[0.99] transition-transform"
            style={{
              background: "linear-gradient(135deg, #faf0db 0%, #fbe7cf 55%, #f5d4a0 100%)",
              border: "1.5px solid rgba(217,120,58,0.2)",
              boxShadow: "0 2px 20px -6px rgba(168,85,34,0.18)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,120,58,0.22) 0%, transparent 70%)" }}
            />

            <div className="flex items-center gap-4 relative">
              {/* Ring gauge — light mode */}
              <RingGauge score={rahul.finScore} size={104} thickness={9} grade={rahul.finScoreGrade} />

              <div className="flex-1 min-w-0">
                {/* Eyebrow */}
                <div
                  className="text-[10px] font-bold tracking-[0.12em] uppercase"
                  style={{ color: "var(--saffron-deep)" }}
                >
                  FinScore · this month
                </div>

                {/* Score + delta */}
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className="tnum text-[38px] font-medium leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {rahul.finScore}
                  </span>
                  <Pill tone="good" size="sm">
                    +{rahul.finScoreDelta} vs Apr
                  </Pill>
                </div>

                {/* Sub-line */}
                <p
                  className="text-[12px] mt-1.5 leading-[1.4]"
                  style={{ color: "var(--saffron-ink)", opacity: 0.8 }}
                >
                  3 wins waiting · peer avg {rahul.finScorePeerAvg}
                </p>

                {/* CTA link */}
                <div
                  className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold"
                  style={{ color: "var(--saffron-deep)" }}
                >
                  View breakdown <ChevronRight size={13} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* SAATHI INSIGHTS — horizontal scroll cards */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Saathi noticed
            </span>
            <Link href="/insights" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              See all 4 <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Horizontal scroll — peek effect */}
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide snap-x snap-mandatory">
            {[
              {
                id: "liquid-fund", tone: "good", bg: "var(--tint-green)", fg: "var(--good-deep)",
                iconBg: "var(--good)", eyebrow: "IDLE MONEY", when: "Yesterday",
                headline: "₹2.4L sitting at 3.5%",
                sub: "Move ₹1.6L to a liquid fund · same next-day access, 7.1% return.",
                value: "₹5,760", valueLabel: "EST. VALUE / YR",
                sources: ["AA · HDFC savings", "Emergency fund met"],
                cta: "See the move", href: "/insights",
              },
              {
                id: "rebalance", tone: "indigo", bg: "var(--tint-indigo)", fg: "var(--indigo)",
                iconBg: "var(--indigo)", eyebrow: "PORTFOLIO DRIFT", when: "3 days ago",
                headline: "SIP is 73% small-cap",
                sub: "Rebalance to 50/30/20 — same returns, far less volatility.",
                value: "Stability", valueLabel: "EST. VALUE / YR",
                sources: ["Groww · 3 funds", "Goal · retirement"],
                cta: "Show rebalance", href: "/insights",
              },
              {
                id: "cashback", tone: "saffron", bg: "var(--tint-saffron)", fg: "var(--saffron-deep)",
                iconBg: "var(--saffron)", eyebrow: "SPENDING PATTERN", when: "2h ago",
                headline: "₹38K/mo UPI earns ₹0",
                sub: "A cashback card pays ₹570/mo back. CIBIL 724 pre-qualifies you.",
                value: "₹6,800", valueLabel: "EST. VALUE / YR",
                sources: ["AA · 6mo txns", "CIBIL 724"],
                cta: "See the math", href: "/insights/cashback",
              },
              {
                id: "prepay", tone: "amber", bg: "var(--tint-amber)", fg: "#6e4f0a",
                iconBg: "var(--caution)", eyebrow: "ANNUAL BONUS", when: "1 week ago",
                headline: "Use ₹85K bonus to prepay loan",
                sub: "Saves ₹38K in interest vs investing. Marginal call — here's the math.",
                value: "₹38,000", valueLabel: "EST. VALUE / YR",
                sources: ["AA · ₹85K Mar 31", "HDFC home loan"],
                cta: "Compare options", href: "/insights",
              },
            ].map((ins) => (
              <Link
                key={ins.id}
                href={ins.href}
                className="shrink-0 snap-start flex flex-col rounded-[20px] overflow-hidden active:scale-[0.98] transition-transform"
                style={{
                  width: "calc(100vw - 80px)",
                  maxWidth: 280,
                  background: ins.bg,
                  border: `1px solid rgba(0,0,0,0.06)`,
                  padding: 16,
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                    style={{ background: ins.iconBg }}
                  >
                    <TrendingUp size={20} strokeWidth={2} color="#fff" />
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: ins.fg, opacity: 0.7 }}>
                    {ins.when}
                  </span>
                </div>

                {/* Eyebrow + headline */}
                <div className="text-[10px] font-extrabold tracking-[0.1em]" style={{ color: ins.fg }}>
                  {ins.eyebrow}
                </div>
                <div
                  className="mt-1 text-[19px] font-medium leading-[1.2]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                >
                  <em className="italic">{ins.headline.split(" ").slice(0, 2).join(" ")}</em>{" "}
                  {ins.headline.split(" ").slice(2).join(" ")}
                </div>
                <p className="text-[12px] mt-1.5 leading-[1.45]" style={{ color: "var(--ink-2)" }}>
                  {ins.sub}
                </p>

                {/* Value */}
                <div className="mt-3">
                  <div className="text-[9px] font-bold tracking-[0.08em]" style={{ color: ins.fg, opacity: 0.7 }}>
                    {ins.valueLabel}
                  </div>
                  <div
                    className="tnum text-[22px] font-medium mt-0.5"
                    style={{ fontFamily: "var(--font-display)", color: ins.fg }}
                  >
                    {ins.value}
                  </div>
                </div>

                {/* Source chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ins.sources.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[6px] text-[10px] font-semibold"
                      style={{ background: "rgba(255,255,255,0.55)", color: "var(--ink-2)", border: "1px solid rgba(255,255,255,0.4)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--good)" }} />
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-[12px] text-[13px] font-bold"
                    style={{ background: "rgba(255,255,255,0.65)", color: ins.fg }}
                  >
                    {ins.cta} <ChevronRight size={13} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* YOUR FAMILY — horizontal scroll of member cards */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
                Your family
              </span>
              <span className="ml-2 text-[11px] font-bold" style={{ color: "var(--bad)" }}>
                · 1 needs help
              </span>
            </div>
            <Link href="/family" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              Family hub <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide snap-x snap-mandatory">
            {[
              {
                name: "Rahul", role: "You", sub: `${rahul.age}`,
                score: rahul.finScore, scoreColor: "var(--caution)",
                avatarTone: "saffron" as const,
                urgent: false, urgentText: "",
                href: "/home",
                cardBg: "var(--surface)",
              },
              {
                name: "Pooja", role: "Wife · homemaker", sub: `${pooja.age}`,
                score: pooja.finScore, scoreColor: "var(--bad)",
                avatarTone: "indigo" as const,
                urgent: true, urgentText: "No CIBIL · No cover",
                href: "/family/pooja",
                cardBg: "var(--tint-saffron)",
              },
              {
                name: "Riya", role: "Daughter", sub: "age 4",
                score: null, scoreColor: "",
                avatarTone: "cream" as const,
                urgent: false, urgentText: "",
                href: "#",
                cardBg: "var(--surface)",
              },
              {
                name: "Parents", role: "Partial dependents", sub: "",
                score: null, scoreColor: "",
                avatarTone: "cream" as const,
                urgent: false, urgentText: "",
                href: "#",
                cardBg: "var(--surface)",
              },
            ].map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="shrink-0 snap-start flex flex-col p-4 rounded-[20px] active:scale-[0.98] transition-transform"
                style={{
                  width: 160,
                  background: m.cardBg,
                  border: m.urgent
                    ? "1.5px solid var(--saffron)"
                    : "1px solid var(--hairline)",
                }}
              >
                {/* Avatar + urgent badge */}
                <div className="relative w-fit">
                  <Avatar name={m.name} size={52} tone={m.avatarTone} />
                  {m.urgent && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold"
                      style={{ background: "var(--saffron)", color: "#fff8ef" }}
                    >
                      !
                    </span>
                  )}
                </div>

                {/* Name + role */}
                <div className="mt-3">
                  <div className="text-[15px] font-bold text-ink leading-tight">{m.name}</div>
                  <div className="text-[11px] mt-0.5 leading-tight" style={{ color: "var(--ink-3)" }}>
                    {m.role}{m.sub ? ` · ${m.sub}` : ""}
                  </div>
                </div>

                {/* FinScore or dependent label */}
                <div className="mt-3">
                  {m.score !== null ? (
                    <>
                      <div
                        className="tnum text-[28px] font-medium leading-none"
                        style={{ fontFamily: "var(--font-display)", color: m.scoreColor }}
                      >
                        {m.score}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: "var(--ink-3)" }}>FinScore</div>
                    </>
                  ) : (
                    <div
                      className="text-[11px] font-semibold mt-1"
                      style={{ color: "var(--ink-3)" }}
                    >
                      {m.urgent ? m.urgentText : "Dependent"}
                    </div>
                  )}
                  {m.urgent && (
                    <div
                      className="mt-1.5 text-[10px] font-bold"
                      style={{ color: "var(--bad)" }}
                    >
                      {m.urgentText}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick-access chips */}
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 scrollbar-hide">
          {QUICK_LINKS.map(({ id, label, Icon, href, bg, fg }) => (
            <Link
              key={id}
              href={href}
              className="shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-[14px] border border-hairline min-w-[68px]"
              style={{ background: "var(--surface)" }}
            >
              <span
                className="w-10 h-10 rounded-[11px] flex items-center justify-center"
                style={{ background: bg, color: fg }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="text-[10px] font-bold text-center whitespace-nowrap" style={{ color: "var(--ink-2)" }}>
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Most urgent action */}
        <div>
          <div className="flex items-baseline justify-between mb-2.5 px-0.5">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Do this next
            </span>
            <Link href="/insurance" className="text-[12px] font-bold" style={{ color: "var(--saffron-deep)" }}>
              See all 3
            </Link>
          </div>

          <FSCard tone="saffron" pad={16} className="flex gap-3.5 items-start">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: "var(--saffron)", color: "#fff8ef" }}
            >
              <Shield size={22} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-extrabold tracking-[0.08em] uppercase" style={{ color: "var(--saffron-deep)" }}>
                Most urgent
              </div>
              <p
                className="text-[17px] font-medium mt-1 leading-[1.25]"
                style={{ fontFamily: "var(--font-display)", color: "var(--saffron-ink)" }}
              >
                You need{" "}
                <em className="italic" style={{ color: "var(--saffron-deep)" }}>
                  {formatINR(rahul.recommendedTermCover, { abbreviate: true })}
                </em>{" "}
                term cover. You have{" "}
                <em className="italic">zero</em>.
              </p>
              <p className="text-[12px] mt-1.5 leading-[1.4]" style={{ color: "var(--saffron-ink)", opacity: 0.8 }}>
                Wife, child & home loan all sit unprotected. Est.{" "}
                <strong>{formatINR(rahul.termPremiumEstimate)}/mo</strong>.
              </p>
              <div className="flex gap-2 mt-3">
                <Link
                  href="/insurance/plans"
                  className="inline-flex items-center px-3.5 h-9 rounded-[12px] text-[13px] font-bold"
                  style={{ background: "var(--saffron-ink)", color: "#fbe7cf" }}
                >
                  See 3 best-fit plans
                </Link>
                <Link
                  href="/insurance"
                  className="inline-flex items-center px-3 h-9 rounded-[12px] text-[13px] font-bold"
                  style={{ color: "var(--saffron-deep)" }}
                >
                  Why this?
                </Link>
              </div>
            </div>
          </FSCard>
        </div>

        {/* Money snapshot 2×2 */}
        <div>
          <div className="mb-2.5 px-0.5">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Money snapshot · May
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Link href="/credit">
              <FSCard tone="white" pad={14} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-2">
                  <CreditCard size={15} strokeWidth={2} style={{ color: "var(--indigo)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ink-3)" }}>Credit score</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span
                    className="tnum text-[26px] font-medium"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {rahul.cibil}
                  </span>
                  <Pill tone="good" size="sm">+26</Pill>
                </div>
                <div className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>
                  Fair · 3 actions to 750
                </div>
              </FSCard>
            </Link>

            <Link href="/invest">
              <FSCard tone="white" pad={14} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} strokeWidth={2} style={{ color: "var(--good)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ink-3)" }}>Portfolio</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span
                    className="tnum text-[26px] font-medium"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {formatINR(rahul.portfolioValue, { abbreviate: true })}
                  </span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: "var(--bad)" }}>
                  −{formatINR(Math.abs(rahul.portfolioDeltaToday))} today
                </div>
              </FSCard>
            </Link>

            <Link href="/insurance">
              <FSCard tone="white" pad={14} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-2">
                  <Shield size={15} strokeWidth={2} style={{ color: "var(--saffron)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ink-3)" }}>Term cover</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span
                    className="tnum text-[26px] font-medium"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    ₹0
                  </span>
                  <Pill tone="rose" size="sm">₹1.2Cr gap</Pill>
                </div>
                <div className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>
                  ₹820/mo · employer health ✓
                </div>
              </FSCard>
            </Link>

            <Link href="/invest/goals">
              <FSCard tone="white" pad={14} className="h-full active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-2">
                  <Flag size={15} strokeWidth={2} style={{ color: "var(--indigo)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ink-3)" }}>Goals</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span
                    className="tnum text-[26px] font-medium"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    2/4
                  </span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: "var(--caution)" }}>
                  Home loan & emergency lagging
                </div>
              </FSCard>
            </Link>
          </div>
        </div>

        {/* Net worth mini card */}
        <Link href="/family">
          <FSCard tone="white" pad={14} className="active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold tracking-[0.07em] uppercase" style={{ color: "var(--ink-3)" }}>
                  Household net worth
                </div>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span
                    className="tnum text-[28px] font-medium"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    ₹13.8L
                  </span>
                  <Pill tone="good" size="sm">+₹1.2L this year</Pill>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>Assets</div>
                <div className="tnum text-[13px] font-bold text-ink">₹42.3L</div>
                <div className="text-[10px] mt-1" style={{ color: "var(--ink-3)" }}>Liabilities</div>
                <div className="tnum text-[13px] font-bold" style={{ color: "var(--bad)" }}>−₹28.5L</div>
              </div>
            </div>
            {/* Stacked mini bar */}
            <div className="mt-3 flex h-1.5 rounded-full overflow-hidden gap-[1.5px]">
              {[
                { w: 75, c: "var(--saffron)" },
                { w: 5,  c: "var(--good)"    },
                { w: 5,  c: "var(--indigo)"  },
                { w: 15, c: "var(--caution)" },
              ].map((b, i) => (
                <div key={i} style={{ width: `${b.w}%`, background: b.c, borderRadius: 99 }} />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[10px]" style={{ color: "var(--ink-3)" }}>
              <span>Property 75%</span>
              <span>MF 5% · EPF 5% · Other 15%</span>
            </div>
          </FSCard>
        </Link>

      </div>
    </div>
  );
}
