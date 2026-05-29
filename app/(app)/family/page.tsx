"use client";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, AlertTriangle, Heart,
  ShieldAlert, TrendingUp, Wallet, Target, Users,
  CheckCircle2, CircleDashed, Circle,
} from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { Avatar }    from "@/components/shared/Avatar";
import { formatINR } from "@/lib/format";
import { rahul, pooja, riya, parents, household } from "@/lib/personas";

/* ── Member swipe cards ─────────────────────────────── */
const MEMBERS = [
  {
    key:       "rahul",
    name:      rahul.firstName,
    full:      rahul.name,
    role:      "You · " + rahul.profession,
    age:       rahul.age,
    avatarTone: "saffron" as const,
    finScore:  rahul.finScore,
    grade:     rahul.finScoreGrade,
    scoreBg:   "var(--caution)",
    urgent:    false,
    urgentText: "",
    tag:       "Building",
    tagTone:   "amber" as const,
    href:      "/home",
    cardBg:    "var(--surface)",
    border:    "1px solid var(--hairline)",
    kpi: [
      { label: "CIBIL",     value: String(rahul.cibil),                                      alert: false },
      { label: "Portfolio", value: formatINR(rahul.portfolioValue, { abbreviate: true }),     alert: false },
      { label: "Cover",     value: "₹0",                                                     alert: true  },
    ],
  },
  {
    key:       "pooja",
    name:      pooja.firstName,
    full:      pooja.name,
    role:      "Wife · Homemaker",
    age:       pooja.age,
    avatarTone: "indigo" as const,
    finScore:  pooja.finScore,
    grade:     pooja.finScoreGrade,
    scoreBg:   "var(--bad)",
    urgent:    true,
    urgentText: "2 critical gaps",
    tag:       "No safety net",
    tagTone:   "rose" as const,
    href:      "/family/pooja",
    cardBg:    "#fff8f6",
    border:    "1.5px solid var(--bad)",
    kpi: [
      { label: "CIBIL",   value: "—",                                                        alert: true  },
      { label: "Gold",    value: formatINR(pooja.goldValue, { abbreviate: true }),            alert: false },
      { label: "Cover",   value: "₹0",                                                       alert: true  },
    ],
  },
  {
    key:       "riya",
    name:      riya.firstName,
    full:      riya.name,
    role:      "Daughter · age 4",
    age:       riya.age,
    avatarTone: "cream" as const,
    finScore:  null,
    grade:     "Education goal set",
    scoreBg:   "",
    urgent:    false,
    urgentText: "",
    tag:       "Dependent",
    tagTone:   "neutral" as const,
    href:      "#",
    cardBg:    "var(--surface)",
    border:    "1px solid var(--hairline)",
    kpi: [
      { label: "College",  value: "2038",                                                    alert: false },
      { label: "Saved",    value: formatINR(riya.educationGoal.savedSoFar, { abbreviate: true }), alert: false },
      { label: "Health",   value: "₹3L",                                                     alert: false },
    ],
  },
  {
    key:       "parents",
    name:      "Parents",
    full:      parents.name,
    role:      "Partial dependents · age 58",
    age:       parents.age,
    avatarTone: "cream" as const,
    finScore:  null,
    grade:     "Stable — 2 gaps",
    scoreBg:   "",
    urgent:    false,
    urgentText: "",
    tag:       "Stable",
    tagTone:   "good" as const,
    href:      "#",
    cardBg:    "var(--surface)",
    border:    "1px solid var(--hairline)",
    kpi: [
      { label: "Pension",  value: formatINR(parents.pension, { abbreviate: true }) + "/mo",  alert: false },
      { label: "CIBIL",    value: String(parents.cibil),                                     alert: false },
      { label: "Health",   value: "₹5L",                                                     alert: false },
    ],
  },
];

/* ── Net worth assets ───────────────────────────────── */
const ASSETS = [
  { label: "MF / Stocks",  value: rahul.netWorth.assets.equity,   color: "var(--good)",    pct: 4  },
  { label: "EPF",           value: rahul.netWorth.assets.epf,      color: "var(--indigo)",  pct: 5  },
  { label: "Property",      value: rahul.netWorth.assets.property, color: "var(--saffron)", pct: 75 },
  { label: "Savings",       value: rahul.netWorth.assets.savings,  color: "var(--caution)", pct: 6  },
  { label: "Gold",          value: pooja.goldValue + 54000,        color: "var(--caution)", pct: 6  },
  { label: "PPF / FDs",     value: rahul.netWorth.assets.ppf + parents.fd.value + parents.ppf,
                                                                    color: "var(--ink-3)",   pct: 4  },
];

export default function FamilyPage() {
  const poojaGaps = pooja.gaps.filter(g => g.status === "critical").length;
  const totalInsuranceGap = household.totalTermCoverNeeded - household.totalTermCover;

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="Family Hub"
        subtitle="Household health · May 2026"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="flex flex-col gap-4">

        {/* ── Household FinScore hero ───────────────────── */}
        <div className="px-[18px]">
          <div
            className="p-5 rounded-[22px] relative overflow-hidden"
            style={{ background: "var(--ink)" }}
          >
            {/* Glow */}
            <div
              className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,120,58,0.28) 0%, transparent 65%)" }}
            />
            <div
              className="absolute -left-6 bottom-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="eyebrow mb-1" style={{ color: "rgba(255,248,239,0.5)" }}>
                    Household FinScore
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="tnum text-[56px] font-bold leading-none"
                      style={{ fontFamily: "var(--font-display)", color: "#fff8ef" }}
                    >
                      {household.finScore}
                    </span>
                    <div>
                      <Pill tone="rose" size="sm">Needs attention</Pill>
                      <div className="text-[11px] mt-1.5" style={{ color: "rgba(255,248,239,0.45)" }}>
                        Dragged by Pooja&apos;s score ({pooja.finScore})
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Users size={20} color="rgba(255,248,239,0.7)" strokeWidth={1.8} />
                </div>
              </div>

              {/* Member score bars */}
              <div className="flex gap-3">
                {[
                  { name: "Rahul", score: rahul.finScore, color: "var(--caution)" },
                  { name: "Pooja", score: pooja.finScore, color: "var(--bad)" },
                ].map((m) => (
                  <div key={m.name} className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1.5"
                      style={{ color: "rgba(255,248,239,0.5)" }}>
                      <span>{m.name}</span>
                      <span className="tnum font-bold" style={{ color: "#fff8ef" }}>{m.score}</span>
                    </div>
                    <div
                      className="h-[5px] rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${m.score}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick stats strip */}
              <div
                className="mt-4 pt-4 flex gap-5 border-t"
                style={{ borderColor: "rgba(255,248,239,0.1)" }}
              >
                {[
                  { v: formatINR(household.netWorth, { abbreviate: true }), l: "Net worth" },
                  { v: `${household.monthsSustainable} mo`, l: "Runway" },
                  { v: "₹0", l: "Term cover", alert: true },
                ].map(({ v, l, alert }) => (
                  <div key={l}>
                    <div
                      className="tnum text-[15px] font-bold"
                      style={{ color: alert ? "var(--bad)" : "#fff8ef" }}
                    >
                      {v}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,248,239,0.45)" }}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Critical alert ─────────────────────────────── */}
        <div className="px-[18px]">
          <div
            className="flex items-start gap-3 p-4 rounded-[16px]"
            style={{ background: "#fde8e4", border: "1px solid rgba(220,80,60,0.2)" }}
          >
            <ShieldAlert size={18} strokeWidth={2} style={{ color: "var(--bad)", flexShrink: 0, marginTop: 1 }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-ink">
                Family is uninsured — ₹0 term cover
              </div>
              <p className="text-[12px] mt-0.5 leading-[1.45]" style={{ color: "var(--ink-2)" }}>
                If something happened today, your family has only{" "}
                <strong>{household.monthsSustainable} months</strong> of savings.
                {" "}{formatINR(totalInsuranceGap, { abbreviate: true })} coverage gap.
              </p>
            </div>
            <Link href="/insurance" className="shrink-0 text-[12px] font-bold" style={{ color: "var(--bad)" }}>
              Fix →
            </Link>
          </div>
        </div>

        {/* ── Swipeable member cards ──────────────────────── */}
        <div>
          <div className="flex items-center justify-between px-[18px] mb-3">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Members · {MEMBERS.length}
            </span>
            {poojaGaps > 0 && (
              <span className="text-[11px] font-bold" style={{ color: "var(--bad)" }}>
                {poojaGaps} critical gaps
              </span>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-0 px-[18px] pb-1 scrollbar-hide snap-x snap-mandatory">
            {MEMBERS.map((m) => (
              <Link
                key={m.key}
                href={m.href}
                className="shrink-0 snap-start flex flex-col rounded-[20px] active:scale-[0.98] transition-transform"
                style={{
                  width: 175,
                  background: m.cardBg,
                  border: m.border,
                  padding: 16,
                }}
              >
                {/* Avatar + urgent */}
                <div className="relative w-fit">
                  <Avatar name={m.name} size={48} tone={m.avatarTone} />
                  {m.urgent && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold"
                      style={{ background: "var(--bad)", color: "#fff8ef" }}
                    >
                      !
                    </span>
                  )}
                </div>

                {/* Name + role */}
                <div className="mt-3">
                  <div className="text-[14px] font-bold text-ink leading-tight">{m.name}</div>
                  <div className="text-[10px] mt-0.5 leading-tight" style={{ color: "var(--ink-3)" }}>
                    {m.role}
                  </div>
                </div>

                {/* FinScore or tag */}
                <div className="mt-2.5">
                  {m.finScore !== null ? (
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="tnum text-[28px] font-bold leading-none"
                        style={{ fontFamily: "var(--font-display)", color: m.scoreBg }}
                      >
                        {m.finScore}
                      </span>
                      <span className="text-[9px] font-bold" style={{ color: "var(--ink-3)" }}>/100</span>
                    </div>
                  ) : (
                    <Pill tone={m.tagTone} size="sm">{m.tag}</Pill>
                  )}
                </div>

                {/* KPI row */}
                <div className="mt-3 flex flex-col gap-1.5">
                  {m.kpi.map((k) => (
                    <div key={k.label} className="flex justify-between items-center">
                      <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>{k.label}</span>
                      <span
                        className="tnum text-[11px] font-bold"
                        style={{ color: k.alert ? "var(--bad)" : "var(--ink)" }}
                      >
                        {k.value}
                      </span>
                    </div>
                  ))}
                </div>

                {m.href !== "#" && (
                  <div
                    className="mt-3 pt-2.5 flex items-center justify-between border-t"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: "var(--saffron-deep)" }}>
                      {m.urgent ? "View gaps" : "See details"}
                    </span>
                    <ChevronRight size={12} style={{ color: "var(--saffron-deep)" }} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Net worth breakdown ──────────────────────────── */}
        <div className="px-[18px]">
          <div className="eyebrow mb-3">Net worth · {formatINR(household.netWorth, { abbreviate: true })}</div>

          <FSCard tone="white" pad={16}>
            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden gap-[2px] mb-3">
              {ASSETS.map((a) => (
                <div
                  key={a.label}
                  style={{ width: `${a.pct}%`, background: a.color, borderRadius: 99 }}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {ASSETS.map((a) => (
                <div key={a.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-ink truncate">{a.label}</div>
                  </div>
                  <span className="tnum text-[11px] font-bold text-ink shrink-0">
                    {formatINR(a.value, { abbreviate: true })}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-3.5 pt-3 flex justify-between items-center border-t border-hairline"
            >
              <div>
                <div className="text-[10px] text-ink-3 font-semibold">Total liabilities</div>
                <div className="tnum text-[15px] font-bold" style={{ color: "var(--bad)" }}>
                  −{formatINR(household.totalLiabilities, { abbreviate: true })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-ink-3 font-semibold">Net worth</div>
                <div className="tnum text-[15px] font-bold text-ink">
                  {formatINR(household.netWorth, { abbreviate: true })}
                </div>
              </div>
            </div>
          </FSCard>
        </div>

        {/* ── Monthly cash flow ───────────────────────────── */}
        <div className="px-[18px]">
          <div className="eyebrow mb-3">Monthly cash flow</div>

          <FSCard tone="white" pad={16}>
            {/* Income vs spend */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase" style={{ color: "var(--good-deep)" }}>
                  Income
                </div>
                <div className="tnum text-[22px] font-bold text-ink mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  {formatINR(household.monthlyIncome, { abbreviate: true })}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase" style={{ color: "var(--bad)" }}>
                  Expenses
                </div>
                <div className="tnum text-[22px] font-bold text-ink mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  {formatINR(household.monthlyExpenses, { abbreviate: true })}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase" style={{ color: "var(--indigo)" }}>
                  Invested
                </div>
                <div className="tnum text-[22px] font-bold text-ink mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  {formatINR(household.monthlySavings, { abbreviate: true })}
                </div>
              </div>
            </div>

            {/* Spending breakdown */}
            <div className="flex h-2 rounded-full overflow-hidden gap-[1.5px]">
              {household.spendCategories.map((c) => (
                <div key={c.label} style={{ width: `${c.pct}%`, background: c.color, borderRadius: 99 }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {household.spendCategories.map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-[10px] text-ink-3">{c.label} {c.pct}%</span>
                </div>
              ))}
            </div>

            <div
              className="mt-3 pt-3 flex items-center justify-between border-t border-hairline"
            >
              <div className="text-[12px] text-ink-3">
                Savings rate:{" "}
                <strong className="text-ink">
                  {Math.round((household.monthlySavings / household.monthlyIncome) * 100)}%
                </strong>
              </div>
              <Pill tone="good" size="sm">Healthy</Pill>
            </div>
          </FSCard>
        </div>

        {/* ── Insurance analysis ──────────────────────────── */}
        <div className="px-[18px]">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Insurance gaps</span>
            <Link href="/insurance" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              See plans <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          <FSCard tone="white" pad={14}>
            {[
              {
                name: "Rahul",
                type: "Term",
                have: "₹0",
                need: formatINR(rahul.recommendedTermCover, { abbreviate: true }),
                status: "critical" as const,
                action: "₹820/mo fixes this",
              },
              {
                name: "Pooja",
                type: "Term",
                have: "₹0",
                need: formatINR(pooja.maxTermCoverAvailable, { abbreviate: true }),
                status: "critical" as const,
                action: "₹390/mo · HDFC plan",
              },
              {
                name: "Family",
                type: "Health",
                have: formatINR(household.totalHealthCover, { abbreviate: true }),
                need: "₹20L+",
                status: "warning" as const,
                action: "Top up by ₹10L",
              },
              {
                name: "Parents",
                type: "CI Cover",
                have: "₹0",
                need: "₹25L",
                status: "warning" as const,
                action: "₹1,200/mo available",
              },
            ].map((r, i, arr) => (
              <div
                key={r.name + r.type}
                className="flex items-center gap-3 py-3"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                  style={{ background: r.status === "critical" ? "var(--bad)" : "var(--caution)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-ink">{r.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: r.status === "critical" ? "#fde8e4" : "var(--tint-amber)",
                        color: r.status === "critical" ? "var(--bad)" : "#6e4f0a",
                      }}
                    >
                      {r.type}
                    </span>
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                    Have <strong className="text-ink">{r.have}</strong> · need{" "}
                    <strong className="text-ink">{r.need}</strong>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold" style={{ color: r.status === "critical" ? "var(--bad)" : "var(--caution)" }}>
                    {r.action}
                  </div>
                </div>
              </div>
            ))}
          </FSCard>
        </div>

        {/* ── Pooja action plan ───────────────────────────── */}
        <div className="px-[18px]">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Pooja&apos;s action plan</span>
            <Link href="/family/pooja" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              Full profile <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          <FSCard tone="white" pad={14}>
            {pooja.actions.map((a, i, arr) => (
              <div
                key={a.label}
                className="flex gap-3 py-3"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
              >
                <div className="shrink-0 mt-0.5">
                  {a.done
                    ? <CheckCircle2 size={16} style={{ color: "var(--good)" }} strokeWidth={2} />
                    : <CircleDashed size={16} style={{ color: "var(--ink-3)" }} strokeWidth={2} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: a.done ? "var(--ink-3)" : "var(--ink)" }}
                  >
                    {a.label}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                    {a.impact}
                  </div>
                </div>
                <div
                  className="shrink-0 text-[11px] font-bold"
                  style={{ color: a.done ? "var(--good)" : "var(--saffron-deep)" }}
                >
                  {a.done ? "Done" : a.cost}
                </div>
              </div>
            ))}
          </FSCard>
        </div>

        {/* ── Goals across family ─────────────────────────── */}
        <div className="px-[18px]">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Family goals</span>
            <Link href="/invest/goals" className="text-[12px] font-bold flex items-center gap-0.5" style={{ color: "var(--saffron-deep)" }}>
              Manage <ChevronRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {[
              ...rahul.goals,
              {
                id: "riya-college-fam",
                name: riya.firstName + "'s college",
                icon: "🎓",
                target: riya.educationGoal.totalNeeded,
                have: riya.educationGoal.savedSoFar,
                by: String(riya.educationGoal.targetYear),
                monthly: riya.educationGoal.monthlyRequired,
                status: "On track" as const,
                tone: "good" as const,
              },
            ].slice(0, 4).map((g) => {
              const pct = Math.min(100, (g.have / g.target) * 100);
              const barColor = g.tone === "good" ? "var(--good)" : g.tone === "amber" ? "var(--caution)" : "var(--bad)";
              return (
                <FSCard key={g.id} tone="white" pad={14}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px]">{g.icon}</span>
                      <div>
                        <div className="text-[13px] font-bold text-ink">{g.name}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                          By {g.by} · {formatINR(g.monthly)}/mo
                        </div>
                      </div>
                    </div>
                    <Pill tone={g.tone === "bad" ? "rose" : g.tone} size="sm">{g.status}</Pill>
                  </div>
                  <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: "var(--ink-3)" }}>
                    <span>{formatINR(g.have, { abbreviate: true })} saved</span>
                    <span>{pct.toFixed(0)}% · {formatINR(g.target, { abbreviate: true })} target</span>
                  </div>
                </FSCard>
              );
            })}
          </div>
        </div>

        {/* ── Emergency fund meter ───────────────────────── */}
        <div className="px-[18px]">
          <div className="eyebrow mb-3">Emergency fund</div>

          <FSCard tone="white" pad={16}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="tnum text-[28px] font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
                  {formatINR(rahul.netWorth.assets.savings, { abbreviate: true })}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                  {household.monthsSustainable} of 6 months target
                </div>
              </div>
              <Pill tone="amber" size="sm">Underfunded</Pill>
            </div>

            {/* Months meter */}
            <div className="flex gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-3 rounded-full"
                  style={{
                    background: i < Math.floor(household.monthsSustainable)
                      ? "var(--caution)"
                      : i === Math.floor(household.monthsSustainable)
                      ? "var(--tint-amber)"
                      : "var(--surface-3)",
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] mt-1.5" style={{ color: "var(--ink-3)" }}>
              <span>0 months</span>
              <span className="font-bold" style={{ color: "var(--caution)" }}>{household.monthsSustainable} mo current</span>
              <span>6 months target</span>
            </div>

            <div
              className="mt-3 p-3 rounded-[10px]"
              style={{ background: "var(--tint-amber)" }}
            >
              <p className="text-[12px] leading-[1.45]" style={{ color: "#6e4f0a" }}>
                Add <strong>{formatINR(rahul.goals[1].monthly)}/mo</strong> to reach 6-month target by{" "}
                <strong>Mar 2026</strong>. Liquid fund earns 7.1% while you build it.
              </p>
            </div>
          </FSCard>
        </div>

        {/* ── Parents financial summary ─────────────────── */}
        <div className="px-[18px]">
          <div className="eyebrow mb-3">Parents · Suresh & Mira</div>

          <FSCard tone="white" pad={14}>
            <div className="flex items-center gap-3 pb-3 mb-3" style={{ borderBottom: "1px solid var(--hairline)" }}>
              <Avatar name="Suresh" size={44} tone="cream" />
              <div className="flex-1">
                <div className="text-[14px] font-bold text-ink">Suresh & Mira</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                  Age 58 · Retired + Homemaker
                </div>
              </div>
              <Pill tone="good" size="sm">Stable</Pill>
            </div>

            {[
              { label: "Monthly pension",   value: formatINR(parents.pension) + "/mo",  tone: "good" },
              { label: "FD balance",        value: formatINR(parents.fd.value, { abbreviate: true }), tone: "good" },
              { label: "PPF",               value: formatINR(parents.ppf, { abbreviate: true }), tone: "good" },
              { label: "Health cover",      value: "₹5L · Star Health",                tone: "good" },
              { label: "CIBIL",             value: parents.cibil + " · " + parents.cibilTier, tone: "good" },
              { label: "Critical illness",  value: "No cover",                          tone: "alert" },
              { label: "Monthly support",   value: "₹8K from Rahul",                   tone: "neutral" },
            ].map((r, i, arr) => (
              <div
                key={r.label}
                className="flex justify-between items-center py-2.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px dashed var(--hairline)" : "none" }}
              >
                <span className="text-[12px]" style={{ color: "var(--ink-3)" }}>{r.label}</span>
                <span
                  className="text-[12px] font-bold"
                  style={{
                    color: r.tone === "good" ? "var(--ink)"
                      : r.tone === "alert" ? "var(--bad)"
                      : "var(--ink-3)",
                  }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </FSCard>
        </div>

        {/* ── Nominee check ──────────────────────────────── */}
        <div className="px-[18px]">
          <div
            className="flex items-center gap-3 p-4 rounded-[16px]"
            style={{ background: "var(--tint-indigo)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <Heart size={18} strokeWidth={2} className="shrink-0" style={{ color: "var(--indigo)" }} />
            <div className="flex-1">
              <div className="text-[13px] font-bold" style={{ color: "var(--indigo)" }}>
                Nominee check — action needed
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                {pooja.nomineeGap}. Update before June to ensure clean legal handover.
              </div>
            </div>
            <ChevronRight size={15} className="shrink-0" style={{ color: "var(--indigo)" }} />
          </div>
        </div>

      </div>
    </div>
  );
}
