import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Heart } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { pooja, riya } from "@/lib/personas";

const WHY_HOMEMAKER = [
  {
    title: "Child care replacement",
    body:  "Professional childcare for Riya (age 4) until 18 costs ~₹25L. Someone has to fund that.",
  },
  {
    title: "Domestic labour value",
    body:  "A homemaker's unpaid work is worth ₹15,000–₹25,000/mo. Term cover replaces this.",
  },
  {
    title: "Loan co-applicant risk",
    body:  "Pooja is co-applicant on the SBI home loan. Her passing creates legal complexity for Rahul.",
  },
  {
    title: "Riya's long-term security",
    body:  `₹50L payout invested in index funds at 12% CAGR = ₹${formatINR(Math.round(5000000 * Math.pow(1.12, 14) / 100000) * 100000, { abbreviate: true })} by Riya's college year.`,
  },
];

const PLAN = {
  insurer:    "HDFC Life",
  name:       "Click 2 Protect Super",
  cover:      pooja.maxTermCoverAvailable,
  monthlyPrem: pooja.termPremiumBestPlan,
  annualPrem: pooja.termPremiumBestPlan * 11,
  claimRatio: "99.39%",
  term:       30,
  features: [
    "Lump-sum payout to Rahul / Riya",
    "Critical illness rider available",
    "No medical test required at age 26",
    "Apply jointly with Rahul's policy",
    "Instant policy on email",
  ],
};

export default function PoojaTermPage() {
  const annualSaving = Math.round((820 - PLAN.monthlyPrem) * 12);

  return (
    <div className="pb-10">
      <AppHeader
        title="Pooja's Term Cover"
        subtitle={`${formatINR(PLAN.cover)} · HDFC Life`}
        leading={
          <Link href="/family/pooja">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        trailing={<Pill tone="good" size="sm">Best for her</Pill>}
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Hero — what she gets */}
        <div
          className="p-4 rounded-[20px] relative overflow-hidden"
          style={{ background: "var(--ink)", color: "#fff8ef" }}
        >
          <div
            className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
          <div className="eyebrow mb-2" style={{ color: "rgba(255,248,239,0.55)" }}>
            Recommended cover
          </div>
          <div
            className="tnum text-[44px] font-bold leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {formatINR(PLAN.cover)}
          </div>
          <div className="mt-1 text-[13px]" style={{ color: "rgba(255,248,239,0.65)" }}>
            for {pooja.firstName} · {PLAN.term} yrs · non-smoker
          </div>

          <div
            className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-[12px]"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            {[
              { label: "Monthly",    value: formatINR(PLAN.monthlyPrem) },
              { label: "Annual",     value: formatINR(PLAN.annualPrem)  },
              { label: "Claim ratio", value: PLAN.claimRatio             },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="tnum text-[14px] font-bold" style={{ color: "#fff8ef" }}>
                  {s.value}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,248,239,0.45)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison to Rahul's premium */}
          <div
            className="mt-3 flex items-center gap-2 p-2.5 rounded-[10px]"
            style={{ background: "rgba(126,179,137,0.2)" }}
          >
            <span className="text-[13px]">💸</span>
            <p className="text-[12px] leading-[1.35]" style={{ color: "rgba(255,248,239,0.85)" }}>
              {formatINR(PLAN.monthlyPrem)}/mo is half of Rahul&apos;s term premium — saves{" "}
              <strong style={{ color: "#fff8ef" }}>{formatINR(annualSaving)}/yr</strong> vs applying separately.
            </p>
          </div>
        </div>

        {/* Why even homemakers need cover */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">Why homemakers need term cover</div>
          {WHY_HOMEMAKER.map((w, i) => (
            <div
              key={w.title}
              className="flex gap-3 py-3 border-b border-hairline last:border-0"
            >
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-[11px] mt-0.5"
                style={{ background: "var(--tint-saffron)", color: "var(--saffron-deep)" }}
              >
                {i + 1}
              </div>
              <div>
                <div className="text-[13px] font-bold text-ink">{w.title}</div>
                <p className="text-[12px] text-muted mt-0.5 leading-[1.45]">{w.body}</p>
              </div>
            </div>
          ))}
        </FSCard>

        {/* Plan features */}
        <FSCard tone="cream" pad={16}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[11px] text-muted font-semibold uppercase tracking-[0.08em]">
                {PLAN.insurer}
              </div>
              <div
                className="text-[16px] font-bold text-ink mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {PLAN.name}
              </div>
            </div>
            <Pill tone="saffron" size="sm">Saathi&apos;s pick</Pill>
          </div>
          <div className="flex flex-col gap-2">
            {PLAN.features.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="shrink-0 mt-[2px]"
                  style={{ color: "var(--saffron)" }}
                />
                <span className="text-[13px] text-ink-2 leading-[1.4]">{f}</span>
              </div>
            ))}
          </div>
        </FSCard>

        {/* Riya's future callout */}
        <div
          className="flex items-start gap-3 p-4 rounded-[16px]"
          style={{ background: "var(--tint-indigo)" }}
        >
          <Heart size={16} strokeWidth={2} className="text-indigo shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-bold text-indigo">For Riya&apos;s future</div>
            <p className="text-[12px] text-muted mt-1 leading-[1.4]">
              {pooja.firstName}&apos;s {formatINR(PLAN.cover)} payout as a nominee goes directly to a
              trust for {riya.name}. Saathi can help you set up the nomination correctly.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)" }}
        >
          Apply for Pooja · 4 min
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>

        <p className="text-center text-[11px] text-muted pb-2">
          Redirects to HDFC Life&apos;s secure portal. FinSaathi earns no commission on this recommendation.
        </p>
      </div>
    </div>
  );
}
