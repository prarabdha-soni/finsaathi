"use client";
import Link from "next/link";
import {
  Bell, Shield, CreditCard, TrendingUp, Flag, User,
  ChevronRight, Sparkles,
} from "lucide-react";
import { Avatar }      from "@/components/shared/Avatar";
import { LangSwitch }  from "@/components/shared/LangSwitch";
import { IconBtn }     from "@/components/shared/IconBtn";
import { Pill }        from "@/components/shared/Pill";
import { FSCard }      from "@/components/shared/FSCard";
import { RingGauge }   from "@/components/finscore/RingGauge";
import { formatINR }   from "@/lib/format";
import { rahul }       from "@/lib/personas";

/* Quick-access chips */
const quickLinks = [
  { id: "insurance", label: "Insurance", icon: Shield,     href: "/insurance",   tintBg: "bg-tint-saffron", tintFg: "text-saffron-deep" },
  { id: "credit",    label: "Credit",    icon: CreditCard, href: "/credit",      tintBg: "bg-tint-indigo",  tintFg: "text-indigo" },
  { id: "invest",    label: "Invest",    icon: TrendingUp, href: "/invest",      tintBg: "bg-tint-green",   tintFg: "text-good-deep" },
  { id: "tax",       label: "Tax · 80C", icon: Flag,       href: "/tax",         tintBg: "bg-tint-amber",   tintFg: "[color:#6e4f0a]" },
  { id: "family",    label: "Family",    icon: User,       href: "/family",      tintBg: "bg-tint-rose",    tintFg: "[color:#7a2a1a]" },
];

export default function HomePage() {
  return (
    <div className="pb-4">
      <div className="px-5 pt-4 pb-4">
        {/* ── Greeting row ──────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar name={rahul.name} size={40} tone="saffron" />
            <div>
              <div className="text-[12px] text-muted font-hindi">नमस्ते,</div>
              <div className="text-[16px] font-bold text-ink">{rahul.firstName}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <LangSwitch />
            <IconBtn aria-label="Notifications">
              <Bell size={18} strokeWidth={1.8} />
            </IconBtn>
          </div>
        </div>

        {/* ── Hero FinScore card ─────────────────────────── */}
        <Link href="/finscore">
          <FSCard
            tone="ink"
            pad={20}
            className="mt-4 relative overflow-hidden"
          >
            {/* Radial glow */}
            <div
              className="absolute -right-10 -top-10 w-44 h-44 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,120,58,0.28) 0%, transparent 70%)" }}
            />
            <div className="flex items-center gap-4 relative">
              <RingGauge
                score={rahul.finScore}
                size={108}
                thickness={9}
                grade={rahul.finScoreGrade}
                dark
              />
              <div className="text-[#fbe7cf] flex-1">
                <div className="eyebrow" style={{ color: "var(--saffron-soft)" }}>
                  FinScore · this month
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className="tnum font-display text-[30px] font-medium text-[#fff8ef]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {rahul.finScore}
                  </span>
                  <Pill
                    tone="good"
                    size="sm"
                    style={{ background: "rgba(126,179,137,0.2)", color: "#9fd1ac", border: "none" }}
                  >
                    +{rahul.finScoreDelta} vs Apr
                  </Pill>
                </div>
                <p className="text-[12px] mt-1.5 leading-[1.4]" style={{ color: "rgba(251,231,207,0.75)" }}>
                  Three quick wins waiting — most users your age sit at {rahul.finScorePeerAvg}.
                </p>
              </div>
            </div>
          </FSCard>
        </Link>

        {/* ── Quick-access chips ────────────────────────── */}
        <div className="flex gap-2 mt-3.5 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-hide">
          {quickLinks.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                href={c.href}
                className="shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-[14px] bg-surface border border-hairline min-w-[64px]"
              >
                <span
                  className={`w-[38px] h-[38px] rounded-[11px] flex items-center justify-center ${c.tintBg} ${c.tintFg}`}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="text-[10px] font-bold text-ink-2 tracking-[0.02em] text-center whitespace-nowrap">
                  {c.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Do this next ──────────────────────────────── */}
        <div className="mt-3">
          <div className="flex items-baseline justify-between px-1 mb-2.5">
            <span className="eyebrow">Do this next</span>
            <Link href="/insurance" className="text-[12px] font-semibold text-saffron-deep">
              See all 3
            </Link>
          </div>

          <FSCard tone="saffron" pad={18} className="flex gap-3.5 items-start">
            <div className="w-11 h-11 rounded-[14px] bg-saffron flex items-center justify-center text-[#fff8ef] shrink-0">
              <Shield size={22} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-saffron-deep tracking-[0.08em] uppercase">
                Most urgent
              </div>
              <h2
                className="font-display text-[18px] font-medium text-saffron-ink mt-0.5 leading-[1.2]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                You need{" "}
                <em className="italic" style={{ color: "var(--saffron-deep)" }}>
                  {formatINR(rahul.recommendedTermCover, { abbreviate: true })}
                </em>{" "}
                term cover. You have{" "}
                <em className="italic">zero</em>.
              </h2>
              <p className="text-[12px] mt-1 leading-[1.4]" style={{ color: "var(--saffron-ink)", opacity: 0.8 }}>
                Your wife, child & home loan all sit unprotected. Premium estimate:{" "}
                <strong>{formatINR(rahul.termPremiumEstimate)}/mo</strong>.
              </p>
              <div className="flex gap-2 mt-3">
                <Link
                  href="/insurance/plans"
                  className="inline-flex items-center px-[14px] h-9 rounded-[14px] bg-ink text-[#faf5eb] text-[13px] font-semibold"
                >
                  See 3 best‑fit plans
                </Link>
                <Link
                  href="/insurance"
                  className="inline-flex items-center px-[14px] h-9 rounded-[14px] text-[13px] font-semibold text-saffron-deep"
                >
                  Why this number?
                </Link>
              </div>
            </div>
          </FSCard>
        </div>

        {/* ── Money snapshot ────────────────────────────── */}
        <div className="mt-5">
          <div className="px-1 mb-2.5">
            <span className="eyebrow">Money snapshot · May</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Credit score */}
            <FSCard tone="white" pad={14}>
              <div className="flex items-center gap-2">
                <CreditCard size={16} strokeWidth={2} className="text-indigo" />
                <div className="text-[11px] font-semibold text-muted">Credit score</div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="tnum font-display text-[26px] font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  {rahul.cibil}
                </span>
                <Pill tone="good" size="sm">+12</Pill>
              </div>
              <div className="text-[11px] text-muted mt-1">3 actions in plan</div>
            </FSCard>

            {/* Portfolio */}
            <FSCard tone="white" pad={14}>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} strokeWidth={2} className="text-good" />
                <div className="text-[11px] font-semibold text-muted">Portfolio</div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="tnum font-display text-[26px] font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  {formatINR(rahul.portfolioValue, { abbreviate: true })}
                </span>
              </div>
              <div className="text-[11px] text-bad mt-1">
                −{formatINR(Math.abs(rahul.portfolioDeltaToday))} today
              </div>
            </FSCard>

            {/* Insurance */}
            <FSCard tone="white" pad={14}>
              <div className="flex items-center gap-2">
                <Shield size={16} strokeWidth={2} className="text-saffron" />
                <div className="text-[11px] font-semibold text-muted">Insurance cover</div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="tnum font-display text-[26px] font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  {formatINR(rahul.termCoverOwned)}
                </span>
                <Pill tone="rose" size="sm">Gap ₹1.2Cr</Pill>
              </div>
              <div className="text-[11px] text-muted mt-1">Term only · employer health ✓</div>
            </FSCard>

            {/* Goals */}
            <FSCard tone="white" pad={14}>
              <div className="flex items-center gap-2">
                <Flag size={16} strokeWidth={2} className="text-indigo" />
                <div className="text-[11px] font-semibold text-muted">Goals on track</div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="tnum font-display text-[26px] font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  2/4
                </span>
              </div>
              <div className="text-[11px] text-muted mt-1">Home & retirement lagging</div>
            </FSCard>
          </div>
        </div>

        {/* ── Saathi nudge ──────────────────────────────── */}
        <FSCard
          tone="cream"
          pad={16}
          className="mt-4 flex gap-3 items-start border border-dashed border-hairline-2"
        >
          <span className="w-8 h-8 rounded-[10px] bg-ink text-saffron-soft flex items-center justify-center shrink-0">
            <Sparkles size={16} strokeWidth={2} />
          </span>
          <div className="flex-1">
            <div className="text-[11px] font-bold text-ink-3 tracking-[0.06em] uppercase">
              Saathi note
            </div>
            <p className="text-[13px] text-ink-2 mt-1 leading-[1.45]">
              Nifty fell 2.1% today. Your portfolio is down{" "}
              <strong>{formatINR(Math.abs(rahul.portfolioDeltaToday))}</strong>.{" "}
              <em>This is normal noise.</em> Selling now would lock in the loss. Stay put.
            </p>
          </div>
        </FSCard>

        {/* ── Weekly lesson ─────────────────────────────── */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between px-1 mb-2.5">
            <span className="eyebrow">This week&apos;s lesson</span>
            <span className="text-[12px] font-semibold text-saffron-deep">Watch · 2 min</span>
          </div>
          <FSCard tone="white" pad={0} className="overflow-hidden">
            <div
              className="h-[140px] flex items-center justify-center"
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--surface-3) 0 6px, var(--surface-2) 6px 12px)",
              }}
            >
              <span className="text-[11px] text-muted font-mono">
                [ term-vs-endowment thumbnail ]
              </span>
            </div>
            <div className="p-3.5">
              <p
                className="font-display text-[17px] font-medium text-ink leading-[1.25]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Why your LIC endowment is quietly losing to a term + SIP combo
              </p>
              <p className="text-[11px] text-muted mt-1.5 font-hindi">
                हिंदी · 2 min read · 24K Indians read this week
              </p>
            </div>
          </FSCard>
        </div>
      </div>
    </div>
  );
}
