import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, Shield, Landmark } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

/* ── NPS Fund options (Tier I · Equity scheme) ────────────── */
const FUNDS = [
  {
    name:    "HDFC Pension",
    scheme:  "Scheme E (Equity)",
    ret1y:   19.8,
    ret3y:   14.2,
    ret5y:   14.2,
    aum:     38420,
    minSip:  500,
    rating:  5,
    saathiPick: true,
  },
  {
    name:    "UTI Retirement",
    scheme:  "Scheme E (Equity)",
    ret1y:   19.4,
    ret3y:   14.0,
    ret5y:   14.0,
    aum:     29800,
    minSip:  500,
    rating:  5,
    saathiPick: false,
  },
  {
    name:    "SBI Pension",
    scheme:  "Scheme E (Equity)",
    ret1y:   18.9,
    ret3y:   13.8,
    ret5y:   13.8,
    aum:     52100,
    minSip:  500,
    rating:  4,
    saathiPick: false,
  },
  {
    name:    "ICICI Pru Pension",
    scheme:  "Scheme E (Equity)",
    ret1y:   19.1,
    ret3y:   13.9,
    ret5y:   13.9,
    aum:     21300,
    minSip:  500,
    rating:  4,
    saathiPick: false,
  },
  {
    name:    "LIC Pension",
    scheme:  "Scheme E (Equity)",
    ret1y:   18.4,
    ret3y:   13.2,
    ret5y:   13.2,
    aum:     8900,
    minSip:  500,
    rating:  3,
    saathiPick: false,
  },
];

/* ── Tax saving at different slabs ──────────────────────────── */
const TAX_SLABS = [
  { slab: "5% slab",  bracket: 0.05, saved: Math.round(50000 * 0.05), note: "Income < ₹3L"    },
  { slab: "10% slab", bracket: 0.10, saved: Math.round(50000 * 0.10), note: "₹3L–₹7L"         },
  { slab: "15% slab", bracket: 0.15, saved: Math.round(50000 * 0.15), note: "₹7L–₹10L"        },
  { slab: "20% slab", bracket: 0.20, saved: Math.round(50000 * 0.20), note: "₹10L–₹12L"       },
  { slab: "30% slab", bracket: 0.30, saved: Math.round(50000 * 0.30), note: "₹12L+"            },
];

// Rahul's estimated bracket: ₹65K/mo = ₹7.8L/yr → after 80C deductions likely in 15–20% zone
const rahulEstimatedSaving = 7500; // ₹7,500 at ~15% effective

/* ── Asset allocation presets ─────────────────────────────── */
const ALLOCATIONS = [
  { label: "Aggressive",  eq: 75, corp: 15, govt: 10, note: "Age < 35 · max wealth building" },
  { label: "Balanced",    eq: 50, corp: 25, govt: 25, note: "Age 35–45 · moderate growth"     },
  { label: "Conservative", eq: 25, corp: 35, govt: 40, note: "Age 45+ · capital protection"  },
];

const HOW_TO_STEPS = [
  { step: "1", title: "Open NPS account",  sub: "Online via eNPS · Aadhaar-based KYC · 10 mins",          icon: "🆔" },
  { step: "2", title: "Choose fund & allocation", sub: "Pick HDFC Pension Scheme E for equity growth",     icon: "📊" },
  { step: "3", title: "Set auto-debit SIP", sub: "Minimum ₹500/month · 80CCD(1B) kicks in from ₹1",       icon: "🔄" },
  { step: "4", title: "File 80CCD(1B)",     sub: "Claim ₹50K extra deduction beyond 80C at ITR filing",   icon: "📝" },
];

export default function NPSPage() {
  const monthlyIncome = rahul.income;
  const annualIncome  = monthlyIncome * 12;
  const npsOwned      = rahul.npsContribution;

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="NPS"
        subtitle="National Pension System · tax + retirement"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-4">

        {/* ── Hero — personalised tax saving ───────────── */}
        <div
          className="rounded-[20px] p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 55%, #c7d2fe 100%)",
            border: "1.5px solid rgba(99,102,241,0.2)",
            boxShadow: "0 2px 16px -6px rgba(99,102,241,0.2)",
          }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)" }} />
          <div className="relative">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase mb-1"
                  style={{ color: "#4338ca" }}>
                  {rahul.firstName}&apos;s tax saving via NPS
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-[42px] font-bold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    {formatINR(rahulEstimatedSaving)}
                  </span>
                  <span className="text-[13px]" style={{ color: "var(--ink-3)" }}>/yr saved</span>
                </div>
                <div className="text-[12px] mt-1" style={{ color: "#4338ca" }}>
                  80CCD(1B) · ₹50K extra deduction · ~15% bracket
                </div>
              </div>
              <span className="text-[36px]">🌅</span>
            </div>

            {npsOwned === 0 && (
              <div
                className="flex items-center gap-2 mt-3 px-3 py-2 rounded-[10px]"
                style={{ background: "rgba(239,68,68,0.12)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--bad)] shrink-0" />
                <span className="text-[12px] font-semibold" style={{ color: "#dc2626" }}>
                  NPS contribution: ₹0 · you&apos;re leaving {formatINR(rahulEstimatedSaving)}/yr on the table
                </span>
              </div>
            )}

            <div
              className="mt-3 p-2.5 rounded-[10px] text-[12px] leading-[1.45]"
              style={{ background: "rgba(99,102,241,0.1)", color: "#3730a3" }}
            >
              <strong>Retirement jumped to India&apos;s #1 financial priority in 2026.</strong>{" "}
              NPS combines tax saving + wealth building in one instrument — tax-free corpus at 60.
            </div>
          </div>
        </div>

        {/* ── Tax slab comparison ───────────────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="flex items-center justify-between mb-3">
            <div className="eyebrow">Tax saved by income bracket</div>
            <Pill tone="indigo" size="sm">80CCD(1B)</Pill>
          </div>
          {TAX_SLABS.map((t, i, arr) => {
            const isRahul = t.slab === "15% slab";
            return (
              <div
                key={t.slab}
                className="flex items-center gap-3 py-2.5"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none",
                  background: isRahul ? "rgba(99,102,241,0.06)" : "transparent",
                  margin: isRahul ? "0 -14px" : "0",
                  padding: isRahul ? "10px 14px" : undefined,
                  borderRadius: isRahul ? 10 : 0,
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-ink">{t.slab}</span>
                    {isRahul && <Pill tone="indigo" size="sm">You</Pill>}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>{t.note}</div>
                </div>
                <div
                  className="tnum text-[14px] font-bold"
                  style={{ color: "var(--good)" }}
                >
                  +{formatINR(t.saved)}/yr
                </div>
              </div>
            );
          })}
        </FSCard>

        {/* ── Asset allocation ──────────────────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="eyebrow mb-3">Asset allocation · choose a style</div>
          {ALLOCATIONS.map((a, i, arr) => {
            const isRecommended = a.label === "Aggressive";
            return (
              <div
                key={a.label}
                className="py-3"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[13px] font-bold text-ink">{a.label}</span>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>{a.note}</div>
                  </div>
                  {isRecommended && <Pill tone="good" size="sm">Saathi pick · age 28</Pill>}
                </div>
                {/* Stacked bar */}
                <div className="flex h-2.5 rounded-full overflow-hidden gap-[2px]">
                  <div className="rounded-full" style={{ width: `${a.eq}%`,   background: "var(--good)"    }} />
                  <div className="rounded-full" style={{ width: `${a.corp}%`, background: "var(--indigo)"  }} />
                  <div className="rounded-full" style={{ width: `${a.govt}%`, background: "var(--caution)" }} />
                </div>
                <div className="flex gap-3 mt-1.5">
                  {[
                    { label: "Equity",   pct: a.eq,   color: "var(--good)"    },
                    { label: "Corp bond", pct: a.corp, color: "var(--indigo)"  },
                    { label: "Govt bond", pct: a.govt, color: "var(--caution)" },
                  ].map((seg) => (
                    <div key={seg.label} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: seg.color }} />
                      <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                        {seg.label} {seg.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </FSCard>

        {/* ── Fund performance ──────────────────────────── */}
        <div>
          <div className="eyebrow mb-3">NPS funds · Scheme E (equity)</div>
          <div className="flex flex-col gap-2.5">
            {FUNDS.map((f) => (
              <FSCard key={f.name} tone="white" pad={14}>
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center font-bold text-[11px] shrink-0"
                    style={{ background: "rgba(99,102,241,0.1)", color: "var(--indigo)" }}
                  >
                    {f.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-bold text-ink">{f.name}</span>
                      {f.saathiPick && <Pill tone="good" size="sm">Saathi pick</Pill>}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                      AUM ₹{(f.aum / 100).toFixed(1)}K Cr · Min ₹{f.minSip}/mo
                    </div>
                  </div>
                </div>
                <div
                  className="flex gap-0 rounded-[10px] overflow-hidden"
                  style={{ background: "var(--surface-3)" }}
                >
                  {[
                    { label: "1Y return", value: `+${f.ret1y}%`, good: true  },
                    { label: "3Y return", value: `+${f.ret3y}%`, good: true  },
                    { label: "5Y CAGR",   value: `+${f.ret5y}%`, good: true  },
                  ].map((m, i, arr) => (
                    <div
                      key={m.label}
                      className="flex-1 py-2 text-center"
                      style={{ borderRight: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
                    >
                      <div className="tnum text-[12px] font-bold" style={{ color: "var(--good)" }}>{m.value}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "var(--ink-3)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </FSCard>
            ))}
          </div>
        </div>

        {/* ── How to start ──────────────────────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="eyebrow mb-3">How to start in 4 steps</div>
          {HOW_TO_STEPS.map((s, i, arr) => (
            <div
              key={s.step}
              className="flex gap-3 py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold shrink-0"
                style={{ background: "rgba(99,102,241,0.1)", color: "var(--indigo)" }}
              >
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink">{s.title}</span>
                  <span className="text-[14px]">{s.icon}</span>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </FSCard>

        {/* ── CTA ───────────────────────────────────────── */}
        <Link
          href="https://enps.nsdl.com"
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] text-[15px] font-semibold w-full"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "#eef2ff",
            boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset, 0 4px 12px -4px rgba(99,102,241,0.4)",
          }}
        >
          Open NPS on eNPS portal
          <ChevronRight size={18} strokeWidth={2.4} />
        </Link>
        <p className="text-center text-[11px] text-muted pb-2">
          Regulated by PFRDA · safe · tax-free corpus at 60
        </p>

      </div>
    </div>
  );
}
