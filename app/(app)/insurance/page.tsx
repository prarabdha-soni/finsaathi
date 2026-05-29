import Link from "next/link";
import {
  ChevronLeft, ChevronRight, AlertTriangle,
  Users, Landmark, TrendingUp,
} from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

const WHY = [
  {
    icon: TrendingUp,
    label: "Income multiple",
    value: "15×",
    sub: `${formatINR(rahul.income)}/mo × 15 yrs`,
  },
  {
    icon: Landmark,
    label: "Home loan cover",
    value: formatINR(rahul.homeLoan.outstanding),
    sub: "Outstanding principal",
  },
  {
    icon: Users,
    label: "Dependents",
    value: "3",
    sub: "Spouse · Child · Parent",
  },
];

const COVERED = [
  ["Death benefit",           `Family gets ${formatINR(rahul.recommendedTermCover)} lump-sum`],
  ["Income replacement",      "~15 yrs of salary secured"],
  ["Home loan payoff",        `${formatINR(rahul.homeLoan.outstanding)} EMI burden wiped`],
  ["Accidental death rider",  "2× payout option available"],
];

export default function InsurancePage() {
  const pct = (rahul.termCoverOwned / rahul.recommendedTermCover) * 100;
  const gap = rahul.recommendedTermCover - rahul.termCoverOwned;

  return (
    <div className="pb-10">
      <AppHeader
        title="Insurance"
        subtitle="Needs analysis · May 2026"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Hero gap card ────────────────────────── */}
        <div
          className="p-4 rounded-[20px] relative overflow-hidden"
          style={{ background: "var(--bad)", color: "#fff8ef" }}
        >
          <div
            className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <div className="flex items-center gap-1.5 mb-3">
            <AlertTriangle size={13} strokeWidth={2.2} style={{ color: "rgba(255,248,239,0.7)" }} />
            <span className="eyebrow" style={{ color: "rgba(255,248,239,0.7)" }}>
              Critical gap
            </span>
          </div>

          <div className="text-[12px]" style={{ color: "rgba(255,248,239,0.75)" }}>
            Term cover you own
          </div>
          <div
            className="tnum text-[42px] font-bold leading-none mt-0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ₹0
          </div>

          <div className="mt-3 text-[12px]" style={{ color: "rgba(255,248,239,0.75)" }}>
            Recommended cover
          </div>
          <div className="tnum text-[24px] font-bold">
            {formatINR(rahul.recommendedTermCover)}
          </div>

          <div className="mt-3.5">
            <div
              className="h-[7px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: "#fff8ef" }}
              />
            </div>
            <div
              className="flex justify-between mt-1.5 text-[11px]"
              style={{ color: "rgba(255,248,239,0.55)" }}
            >
              <span>Covered: {pct.toFixed(0)}%</span>
              <span>Gap: {formatINR(gap)}</span>
            </div>
          </div>
        </div>

        {/* ── Why this amount ──────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">
            Why {formatINR(rahul.recommendedTermCover)}?
          </div>
          <div className="flex flex-col gap-3">
            {WHY.map((w) => (
              <div key={w.label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center"
                  style={{ background: "var(--tint-saffron)" }}
                >
                  <w.icon
                    size={16}
                    strokeWidth={2}
                    style={{ color: "var(--saffron-deep)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">
                    {w.label}
                  </div>
                  <div className="text-[11px] text-muted">{w.sub}</div>
                </div>
                <div className="tnum text-[15px] font-bold text-ink shrink-0">
                  {w.value}
                </div>
              </div>
            ))}
          </div>
        </FSCard>

        {/* ── Premium estimate ─────────────────────── */}
        <FSCard tone="cream" pad={16}>
          <div className="flex justify-between items-start">
            <div>
              <div className="eyebrow mb-1">Estimated premium</div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="tnum text-[32px] font-bold text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatINR(rahul.termPremiumEstimate)}
                </span>
                <span className="text-[13px] text-muted">/mo</span>
              </div>
              <div className="text-[12px] text-muted mt-0.5">
                ≈ {formatINR(rahul.termPremiumEstimate * 12)}/yr · 30-yr cover
              </div>
            </div>
            <Pill tone="good" size="sm">Plans from ₹748/mo</Pill>
          </div>
          <div
            className="mt-3 p-3 rounded-[12px] text-[12px] text-muted leading-[1.5]"
            style={{ background: "var(--surface-3)" }}
          >
            At {formatINR(rahul.income)}/mo income,{" "}
            {formatINR(rahul.termPremiumEstimate)} is{" "}
            <strong className="text-ink">1.3% of your income</strong> — and
            secures {formatINR(rahul.recommendedTermCover)} for your family.
          </div>
        </FSCard>

        {/* ── What's covered ───────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">What a term plan covers</div>
          {COVERED.map(([t, s]) => (
            <div
              key={t}
              className="flex gap-2.5 py-2.5 border-b border-hairline last:border-0"
            >
              <div
                className="w-[6px] h-[6px] rounded-full mt-[5px] shrink-0"
                style={{ background: "var(--good)" }}
              />
              <div>
                <div className="text-[13px] font-semibold text-ink">{t}</div>
                <div className="text-[11px] text-muted">{s}</div>
              </div>
            </div>
          ))}
        </FSCard>

        {/* ── CTA ──────────────────────────────────── */}
        <Link
          href="/insurance/plans"
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Compare plans
          <ChevronRight size={18} strokeWidth={2.4} />
        </Link>

        <p className="text-center text-[11px] text-muted pb-2">
          We compare 12 insurers · IRDAI-regulated · no spam
        </p>
      </div>
    </div>
  );
}
