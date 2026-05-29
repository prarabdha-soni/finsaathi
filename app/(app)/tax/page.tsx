import Link from "next/link";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

// Derived tax numbers for Rahul
const GROSS_ANNUAL  = rahul.income * 12;           // 7,80,000
const STD_DEDUCTION = 75000;                        // new regime standard
const USED_80C      = rahul.epf + rahul.ppf + rahul.elss; // 1,38,000
const LIMIT_80C     = rahul.limitSec80C;            // 1,50,000
const HEADROOM_80C  = LIMIT_80C - USED_80C;         // 12,000
const NPS_USED      = 0;
const NPS_LIMIT     = 50000;
const HRA_USED      = 96000;                        // ~8K/mo rent receipt
const HRA_LIMIT     = 100800;                       // 40% of basic
const TOTAL_DED     = STD_DEDUCTION + USED_80C + HRA_USED;
const TAXABLE       = GROSS_ANNUAL - TOTAL_DED;
// Old regime tax (simplified slab)
function calcTax(income: number) {
  if (income <= 250000)  return 0;
  if (income <= 500000)  return (income - 250000) * 0.05;
  if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
  return 112500 + (income - 1000000) * 0.30;
}
const TAX_OLD       = calcTax(TAXABLE);
const TAX_NEW       = calcTax(GROSS_ANNUAL - STD_DEDUCTION); // new regime: no 80C
const SAVING_VS_NEW = Math.max(0, TAX_NEW - TAX_OLD);
const REFUND_EST    = Math.round(TAX_OLD * 0.18);  // ~advance tax overpaid

const DEDUCTIONS = [
  {
    section: "80C",
    label:   "Savings & investments",
    used:    USED_80C,
    limit:   LIMIT_80C,
    items:   [
      { name: "EPF (employer + employee)", amount: rahul.epf  },
      { name: "PPF",                       amount: rahul.ppf  },
      { name: "ELSS SIP",                  amount: rahul.elss },
    ],
    headroom: HEADROOM_80C,
    tone:    "amber" as const,
  },
  {
    section: "HRA",
    label:   "House rent allowance",
    used:    HRA_USED,
    limit:   HRA_LIMIT,
    items:   [
      { name: "Rent paid (₹8K/mo)", amount: HRA_USED },
    ],
    headroom: HRA_LIMIT - HRA_USED,
    tone:    "good" as const,
  },
  {
    section: "80CCD(1B)",
    label:   "NPS additional",
    used:    NPS_USED,
    limit:   NPS_LIMIT,
    items:   [],
    headroom: NPS_LIMIT,
    tone:    "bad" as const,
  },
  {
    section: "24(b)",
    label:   "Home loan interest",
    used:    Math.round(rahul.homeLoan.emiPerMonth * 0.62 * 12),
    limit:   200000,
    items:   [
      { name: "Interest component (est.)", amount: Math.round(rahul.homeLoan.emiPerMonth * 0.62 * 12) },
    ],
    headroom: 0,
    tone:    "good" as const,
  },
];

export default function TaxPage() {
  return (
    <div className="pb-10">
      <AppHeader
        title="Tax"
        subtitle="FY 2025-26 · Old regime"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        trailing={<Pill tone="good" size="sm">Old regime saves more</Pill>}
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Tax summary hero ────────────────────── */}
        <FSCard tone="ink" pad={16}>
          <div className="eyebrow mb-2" style={{ color: "rgba(255,248,239,0.55)" }}>
            Estimated tax liability · FY 26
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: "rgba(255,248,239,0.55)" }}>
                Old regime
              </div>
              <div
                className="tnum text-[28px] font-bold leading-none"
                style={{ fontFamily: "var(--font-display)", color: "#fff8ef" }}
              >
                {formatINR(Math.round(TAX_OLD))}
              </div>
            </div>
            <div>
              <div className="text-[11px] mb-0.5" style={{ color: "rgba(255,248,239,0.55)" }}>
                New regime
              </div>
              <div
                className="tnum text-[28px] font-bold leading-none"
                style={{ color: "rgba(255,248,239,0.45)" }}
              >
                {formatINR(Math.round(TAX_NEW))}
              </div>
            </div>
          </div>

          <div
            className="mt-3 flex items-center gap-2 p-2.5 rounded-[10px]"
            style={{ background: "rgba(126,179,137,0.18)" }}
          >
            <span className="text-[13px]">💡</span>
            <p className="text-[12px] leading-[1.4]" style={{ color: "rgba(255,248,239,0.85)" }}>
              Old regime saves you{" "}
              <strong style={{ color: "#fff8ef" }}>{formatINR(SAVING_VS_NEW)}</strong> this year.
            </p>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div>
              <div className="text-[11px]" style={{ color: "rgba(255,248,239,0.55)" }}>
                Estimated refund
              </div>
              <div
                className="tnum text-[18px] font-bold mt-0.5"
                style={{ color: "var(--good)", fontFamily: "var(--font-display)" }}
              >
                +{formatINR(REFUND_EST)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px]" style={{ color: "rgba(255,248,239,0.55)" }}>
                Taxable income
              </div>
              <div className="tnum text-[16px] font-bold mt-0.5" style={{ color: "#fff8ef" }}>
                {formatINR(Math.max(0, TAXABLE))}
              </div>
            </div>
          </div>
        </FSCard>

        {/* Income summary ──────────────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="eyebrow mb-2.5">Income & deductions</div>
          {[
            { label: "Gross income",       value: formatINR(GROSS_ANNUAL), sign: null },
            { label: "Standard deduction", value: "−" + formatINR(STD_DEDUCTION), sign: "minus" },
            { label: "80C",                value: "−" + formatINR(USED_80C),       sign: "minus" },
            { label: "HRA",                value: "−" + formatINR(HRA_USED),        sign: "minus" },
            { label: "24(b) interest",     value: "−" + formatINR(Math.min(200000, Math.round(rahul.homeLoan.emiPerMonth * 0.62 * 12))), sign: "minus" },
            { label: "Taxable income",     value: formatINR(Math.max(0, TAXABLE)), sign: "total" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-hairline last:border-0"
            >
              <span
                className="text-[13px]"
                style={{
                  color: row.sign === "total" ? "var(--ink)" : "var(--ink-2)",
                  fontWeight: row.sign === "total" ? 700 : 400,
                }}
              >
                {row.label}
              </span>
              <span
                className="tnum text-[13px] font-bold"
                style={{
                  color: row.sign === "minus" ? "var(--good)"
                       : row.sign === "total" ? "var(--ink)"
                       : "var(--ink)",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </FSCard>

        {/* Deduction cards ─────────────────────── */}
        <div className="eyebrow px-1 pt-1 pb-0.5">Deductions</div>

        {DEDUCTIONS.map((d) => {
          const usedPct = Math.min(100, (d.used / d.limit) * 100);
          return (
            <FSCard key={d.section} tone="white" pad={14}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="eyebrow">{d.section}</span>
                    {d.headroom > 0 && (
                      <Pill tone="amber" size="sm">
                        ₹{Math.round(d.headroom / 1000)}K headroom
                      </Pill>
                    )}
                  </div>
                  <div className="text-[12px] text-muted mt-0.5">{d.label}</div>
                </div>
                <div className="text-right">
                  <div className="tnum text-[15px] font-bold text-ink">
                    {formatINR(d.used)}
                  </div>
                  <div className="text-[10px] text-muted">of {formatINR(d.limit)}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div
                className="h-[6px] rounded-full overflow-hidden mb-2"
                style={{ background: "var(--surface-3)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${usedPct}%`,
                    background:
                      d.tone === "good"  ? "var(--good)"
                      : d.tone === "amber" ? "var(--caution)"
                      : "var(--bad)",
                  }}
                />
              </div>

              {/* Items */}
              {d.items.length > 0 && (
                <div className="flex flex-col gap-1">
                  {d.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center"
                    >
                      <span className="text-[11px] text-muted">{item.name}</span>
                      <span className="tnum text-[11px] font-semibold text-ink-2">
                        {formatINR(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state for NPS */}
              {d.items.length === 0 && (
                <div
                  className="flex items-center gap-2 p-2.5 rounded-[10px]"
                  style={{ background: "var(--tint-saffron)" }}
                >
                  <Info size={13} style={{ color: "var(--saffron-deep)", flexShrink: 0 }} />
                  <p className="text-[11px]" style={{ color: "var(--saffron-deep)" }}>
                    Start NPS and save up to {formatINR(NPS_LIMIT)} more. Saathi can help.
                  </p>
                </div>
              )}
            </FSCard>
          );
        })}

        {/* File ITR nudge ──────────────────────── */}
        <Link href="/saathi">
          <div
            className="flex items-center gap-3 p-4 rounded-[16px]"
            style={{ background: "var(--tint-indigo)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <div className="flex-1">
              <div className="text-[13px] font-bold text-indigo">
                Ask Saathi to prep your ITR
              </div>
              <div className="text-[12px] text-muted mt-0.5">
                One conversation → Form 16 checklist → refund tracked
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--indigo)" }} />
          </div>
        </Link>
      </div>
    </div>
  );
}
