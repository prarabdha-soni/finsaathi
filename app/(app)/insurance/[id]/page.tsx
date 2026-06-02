import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Shield, Clock } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

/* Stub plan data — in a real app this would be looked up from a DB */
const PLAN_DATA: Record<string, {
  insurer: string; name: string; claimRatio: string;
  monthlyPrem: number; annualPrem: number; cover: number;
  features: string[]; riders: { name: string; addPrem: number }[];
  steps: string[];
}> = {
  "hdfc-click2protect": {
    insurer: "HDFC Life", name: "Click 2 Protect Super",
    claimRatio: "99.39%",
    monthlyPrem: rahul.termPremiumEstimate,
    annualPrem: rahul.termPremiumEstimate * 11,
    cover: rahul.recommendedTermCover,
    features: [
      "Death benefit: lump-sum or monthly income",
      "Critical illness cover up to ₹50L",
      "Waiver of premium on total disability",
      "30-day free look period",
      "Nominee receives payout in 7 business days",
      "No medical test up to ₹75L for age ≤35",
    ],
    riders: [
      { name: "Critical Illness (36 conditions)", addPrem: 210 },
      { name: "Accidental Death Benefit (2×)",    addPrem: 95  },
      { name: "Premium Waiver on Disability",     addPrem: 65  },
    ],
    steps: [
      "Fill basic details (2 min)",
      "Medical questionnaire (1 min)",
      "Pay first premium",
      "Instant policy PDF on email",
    ],
  },
  "lic-tech-term": {
    insurer: "LIC", name: "Tech Term",
    claimRatio: "99.04%",
    monthlyPrem: 892,
    annualPrem: 892 * 11,
    cover: rahul.recommendedTermCover,
    features: [
      "Govt-backed · highest public trust",
      "Lump-sum death benefit",
      "Level cover for entire 30-yr term",
      "Suicide exclusion waived after 12 months",
      "Nomination change free of cost",
    ],
    riders: [
      { name: "Accidental Death & Disability",  addPrem: 120 },
    ],
    steps: [
      "Online proposal form (3 min)",
      "Medical test may be required",
      "Physical document submission",
      "Policy issuance in 7–10 days",
    ],
  },
  "tata-aia-fortune": {
    insurer: "Tata AIA", name: "Fortune Plus",
    claimRatio: "98.97%",
    monthlyPrem: 748,
    annualPrem: 748 * 11,
    cover: rahul.recommendedTermCover,
    features: [
      "Lowest premium — best if budget-first",
      "Return of premium at maturity option",
      "Accidental death benefit included",
      "Wellness rewards: Vitality program",
      "Digital policy — paperless issuance",
    ],
    riders: [
      { name: "Critical Illness (40 conditions)",  addPrem: 230 },
      { name: "Accidental Disability Benefit",     addPrem: 80  },
    ],
    steps: [
      "Video KYC (2 min)",
      "Digital medical questionnaire",
      "Pay online — UPI / net banking",
      "Policy active in 24 hrs",
    ],
  },
};

const FALLBACK_ID = "hdfc-click2protect";

export default async function InsurancePlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = PLAN_DATA[id] ?? PLAN_DATA[FALLBACK_ID];
  const isSaathiPick = id === "hdfc-click2protect";

  return (
    <div className="pb-10">
      <AppHeader
        title={plan.name}
        subtitle={plan.insurer}
        leading={
          <Link href="/insurance/plans">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        trailing={
          isSaathiPick && (
            <Pill tone="saffron" size="sm">Saathi&apos;s pick</Pill>
          )
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Premium summary card ─────────────────── */}
        <FSCard tone={isSaathiPick ? "cream" : "white"} pad={16}>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="eyebrow mb-1">Monthly premium</div>
              <div className="flex items-baseline gap-1">
                <span
                  className="tnum text-[32px] font-bold text-ink"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatINR(plan.monthlyPrem)}
                </span>
                <span className="text-[12px] text-muted">/mo</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="eyebrow mb-1">Annual (save 1 mo)</div>
              <div className="flex items-baseline gap-1">
                <span className="tnum text-[24px] font-bold text-ink">
                  {formatINR(plan.annualPrem)}
                </span>
                <span className="text-[12px] text-muted">/yr</span>
              </div>
            </div>
          </div>

          <div
            className="mt-3 grid grid-cols-3 gap-2 p-3 rounded-[12px]"
            style={{ background: "var(--surface-3)" }}
          >
            {[
              { label: "Cover",        value: formatINR(plan.cover, { abbreviate: true }) },
              { label: "Term",         value: "30 yrs" },
              { label: "Claim ratio",  value: plan.claimRatio },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="tnum text-[14px] font-bold text-ink">{s.value}</div>
                <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </FSCard>

        {/* ── Features ─────────────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">
            <Shield size={12} className="inline mr-1.5" style={{ color: "var(--good)" }} />
            What&apos;s included
          </div>
          <div className="flex flex-col gap-2">
            {plan.features.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="shrink-0 mt-[2px]"
                  style={{ color: isSaathiPick ? "var(--saffron)" : "var(--good)" }}
                />
                <span className="text-[13px] text-ink-2 leading-[1.4]">{f}</span>
              </div>
            ))}
          </div>
        </FSCard>

        {/* ── Optional riders ──────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">Optional add-ons</div>
          {plan.riders.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between py-2.5 border-b border-hairline last:border-0"
            >
              <span className="text-[13px] text-ink flex-1 pr-2">{r.name}</span>
              <span className="tnum text-[13px] font-bold text-muted shrink-0">
                +{formatINR(r.addPrem)}/mo
              </span>
            </div>
          ))}
        </FSCard>

        {/* ── How to apply ─────────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">
            <Clock size={12} className="inline mr-1.5" style={{ color: "var(--saffron)" }} />
            Apply in 4 min
          </div>
          <div className="flex flex-col gap-2.5">
            {plan.steps.map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <span
                  className="w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "var(--tint-saffron)", color: "var(--saffron-deep)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] text-ink-2 leading-[1.4] mt-0.5">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </FSCard>

        {/* ── Apply CTA ────────────────────────────── */}
        <button
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Apply now
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>

        <p className="text-center text-[11px] text-muted pb-2">
          You&apos;ll be redirected to {plan.insurer}&apos;s secure portal.
          Gloww does not store payment data.
        </p>
      </div>
    </div>
  );
}
