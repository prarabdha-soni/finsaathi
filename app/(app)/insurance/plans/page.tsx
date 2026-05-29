import Link from "next/link";
import { ChevronLeft, Check, Star } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

interface Plan {
  id:          string;
  insurer:     string;
  name:        string;
  monthlyPrem: number;
  annualPrem:  number;
  claimRatio:  string;
  cover:       number;
  term:        number;
  features:    string[];
  saathiPick:  boolean;
}

const PLANS: Plan[] = [
  {
    id:          "hdfc-click2protect",
    insurer:     "HDFC Life",
    name:        "Click 2 Protect Super",
    monthlyPrem: rahul.termPremiumEstimate,   // 820
    annualPrem:  rahul.termPremiumEstimate * 11, // ~2 mo free
    claimRatio:  "99.39%",
    cover:       rahul.recommendedTermCover,
    term:        30,
    saathiPick:  true,
    features: [
      "Monthly income payout option",
      "Critical illness rider available",
      "Waiver of premium on disability",
      "Online application · instant issuance",
    ],
  },
  {
    id:          "lic-tech-term",
    insurer:     "LIC",
    name:        "Tech Term",
    monthlyPrem: 892,
    annualPrem:  892 * 11,
    claimRatio:  "99.04%",
    cover:       rahul.recommendedTermCover,
    term:        30,
    saathiPick:  false,
    features: [
      "Govt-backed insurer",
      "Lump-sum payout",
      "No riders available online",
      "Strong claim track record",
    ],
  },
  {
    id:          "tata-aia-fortune",
    insurer:     "Tata AIA",
    name:        "Fortune Plus",
    monthlyPrem: 748,
    annualPrem:  748 * 11,
    claimRatio:  "98.97%",
    cover:       rahul.recommendedTermCover,
    term:        30,
    saathiPick:  false,
    features: [
      "Lowest premium on list",
      "Return of premium option",
      "Accidental death benefit",
      "Wellness benefits included",
    ],
  },
];

export default function InsurancePlansPage() {
  return (
    <div className="pb-10">
      <AppHeader
        title="Term Plans"
        subtitle={`${formatINR(rahul.recommendedTermCover)} cover · 30 yr · age 28`}
        leading={
          <Link href="/insurance">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Sub-header */}
        <p className="text-[12px] text-muted leading-[1.5]">
          Comparing{" "}
          <span className="font-semibold text-ink-2">3 of 12 shortlisted</span>{" "}
          plans for your profile. Saathi&apos;s pick highlighted.
        </p>

        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="rounded-[18px] overflow-hidden"
            style={{
              border: plan.saathiPick
                ? "2px solid var(--saffron)"
                : "1px solid var(--hairline)",
              background: "var(--surface)",
            }}
          >
            {/* Saathi pick banner */}
            {plan.saathiPick && (
              <div
                className="flex items-center gap-1.5 px-4 py-2"
                style={{ background: "var(--tint-saffron)" }}
              >
                <Star
                  size={12}
                  strokeWidth={2.5}
                  fill="var(--saffron)"
                  style={{ color: "var(--saffron)" }}
                />
                <span
                  className="eyebrow text-[10px]"
                  style={{ color: "var(--saffron-deep)" }}
                >
                  Saathi&apos;s pick for Rahul
                </span>
              </div>
            )}

            <div className="p-4">
              {/* Header row */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] text-muted font-semibold uppercase tracking-[0.08em]">
                    {plan.insurer}
                  </div>
                  <div
                    className="text-[16px] font-bold text-ink mt-0.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {plan.name}
                  </div>
                </div>
                <Pill
                  tone={plan.saathiPick ? "saffron" : "neutral"}
                  size="sm"
                >
                  {plan.claimRatio} CR
                </Pill>
              </div>

              {/* Premium */}
              <div
                className="mt-3 flex gap-3 p-3 rounded-[12px]"
                style={{ background: "var(--surface-3)" }}
              >
                <div className="flex-1">
                  <div className="text-[10px] text-muted">Monthly</div>
                  <div className="tnum text-[20px] font-bold text-ink mt-0.5">
                    {formatINR(plan.monthlyPrem)}
                  </div>
                </div>
                <div className="w-px bg-hairline" />
                <div className="flex-1">
                  <div className="text-[10px] text-muted">Annual (pay 11)</div>
                  <div className="tnum text-[20px] font-bold text-ink mt-0.5">
                    {formatINR(plan.annualPrem)}
                  </div>
                </div>
                <div className="w-px bg-hairline" />
                <div className="flex-1">
                  <div className="text-[10px] text-muted">Cover</div>
                  <div className="tnum text-[14px] font-bold text-ink mt-0.5">
                    {formatINR(plan.cover, { abbreviate: true })}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-3 flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check
                      size={13}
                      strokeWidth={2.5}
                      style={{ color: plan.saathiPick ? "var(--saffron)" : "var(--good)", flexShrink: 0 }}
                    />
                    <span className="text-[12px] text-ink-2">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/insurance/${plan.id}`}
                className="mt-4 flex items-center justify-center h-[44px] rounded-[12px] text-[14px] font-semibold w-full transition-colors"
                style={
                  plan.saathiPick
                    ? {
                        background: "var(--saffron)",
                        color: "#fff8ef",
                        boxShadow: "0 1px 3px rgba(168,85,34,0.3)",
                      }
                    : {
                        background: "var(--surface-3)",
                        color: "var(--ink)",
                        border: "1px solid var(--hairline)",
                      }
                }
              >
                {plan.saathiPick ? "Apply in 4 min →" : "View details"}
              </Link>
            </div>
          </div>
        ))}

        <p className="text-center text-[11px] text-muted pb-2">
          Premiums shown for ₹1.2 Cr · 30 yr · non-smoker · Rajasthan
        </p>
      </div>
    </div>
  );
}
