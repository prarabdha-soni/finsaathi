"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

/* Fund configs keyed by goal id */
const FUND_CONFIGS: Record<string, {
  allocation: [number, number, number];
  funds: Array<{
    abbr: string; name: string; category: string;
    bgColor: string; isCore?: boolean;
    cagr5yr: number; cagr3yr: number; expense: string; why: string;
  }>;
}> = {
  "riya-college": {
    allocation: [60, 25, 15],
    funds: [
      {
        abbr: "PP", name: "Parag Parikh Flexi Cap", category: "Flexi cap · large + mid",
        bgColor: "#2e3a78", isCore: true,
        cagr5yr: 22.4, cagr3yr: 18.2, expense: "0.62%",
        why: "Best long-term picker we trust · global allocation",
      },
      {
        abbr: "HD", name: "HDFC Balanced Advantage", category: "Hybrid · cushions falls",
        bgColor: "#244a30",
        cagr5yr: 16.8, cagr3yr: 14.1, expense: "0.81%",
        why: "For your nervous side · won't fall as hard",
      },
      {
        abbr: "NI", name: "Nippon India Small Cap", category: "Small cap · long horizon",
        bgColor: "#a85522",
        cagr5yr: 28.1, cagr3yr: 21.5, expense: "0.74%",
        why: "Only because you have 15+ years · expect bumps",
      },
    ],
  },
  "emergency": {
    allocation: [0, 80, 20],
    funds: [
      {
        abbr: "HD", name: "HDFC Short Duration", category: "Short duration · low risk",
        bgColor: "#244a30", isCore: true,
        cagr5yr: 7.5, cagr3yr: 7.2, expense: "0.31%",
        why: "No exit load after 30 days · 7%+ · near-liquid",
      },
      {
        abbr: "SB", name: "SBI Liquid Fund", category: "Liquid · instant redemption",
        bgColor: "#1c4f7a",
        cagr5yr: 6.8, cagr3yr: 6.9, expense: "0.20%",
        why: "Overnight liquidity · far better than savings account",
      },
      {
        abbr: "IC", name: "ICICI Pru Money Market", category: "Money market · stable",
        bgColor: "#4a2d6e",
        cagr5yr: 7.1, cagr3yr: 7.0, expense: "0.25%",
        why: "Emergency means instant access · this fund delivers",
      },
    ],
  },
  "house": {
    allocation: [50, 30, 20],
    funds: [
      {
        abbr: "MI", name: "Mirae Asset Large Cap", category: "Large cap · stable",
        bgColor: "#2e3a78", isCore: true,
        cagr5yr: 17.2, cagr3yr: 15.8, expense: "0.55%",
        why: "6-year horizon suits large cap — steady compounder",
      },
      {
        abbr: "PP", name: "Parag Parikh Flexi Cap", category: "Flexi cap · diversified",
        bgColor: "#244a30",
        cagr5yr: 22.4, cagr3yr: 18.2, expense: "0.62%",
        why: "Medium-term growth without concentrated sector risk",
      },
      {
        abbr: "IC", name: "ICICI Pru Balanced Adv", category: "Hybrid · downside buffer",
        bgColor: "#4a2d6e",
        cagr5yr: 15.9, cagr3yr: 14.2, expense: "0.78%",
        why: "Real-estate cycles can hurt equities — this cushions",
      },
    ],
  },
  "retirement": {
    allocation: [70, 20, 10],
    funds: [
      {
        abbr: "NI", name: "Nippon India Index — Nifty 50", category: "Index · Direct · Growth",
        bgColor: "#a85522", isCore: true,
        cagr5yr: 14.7, cagr3yr: 12.1, expense: "0.20%",
        why: "32 years out · just track the market and pay nothing",
      },
      {
        abbr: "PP", name: "Parag Parikh Flexi Cap", category: "Flexi cap · global",
        bgColor: "#2e3a78",
        cagr5yr: 22.4, cagr3yr: 18.2, expense: "0.62%",
        why: "Global diversification compounds powerfully over decades",
      },
      {
        abbr: "HD", name: "HDFC Mid-Cap Opp", category: "Mid cap · long horizon",
        bgColor: "#244a30",
        cagr5yr: 24.8, cagr3yr: 19.4, expense: "0.73%",
        why: "20% mid-cap over 30 years meaningfully adds alpha",
      },
    ],
  },
};

function yearsLeft(by: string): number {
  if (by.includes(" ")) return 1;
  const y = parseInt(by, 10);
  return isNaN(y) ? 10 : Math.max(1, y - 2026);
}

function sipFV(amount: number, years: number): number {
  const r = 0.12 / 12;
  const n = years * 12;
  return Math.round(amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

export default function SipGoalPage() {
  const params   = useParams<{ goal: string }>();
  const slug     = params?.goal ?? "riya-college";
  const goalData = rahul.goals.find((g) => g.id === slug) ?? rahul.goals[0];
  const config   = FUND_CONFIGS[slug] ?? FUND_CONFIGS["riya-college"];

  const [sipAmount, setSipAmount] = useState(goalData.monthly);

  const yrs            = yearsLeft(goalData.by);
  const totalInvested  = sipAmount * 12 * yrs;
  const projected      = sipFV(sipAmount, yrs);
  const allocationStr  = config.allocation.join("/");

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title={`Start SIP for ${goalData.name}`}
        subtitle={`${formatINR(goalData.monthly)}/mo · target ${formatINR(goalData.target, { abbreviate: true })} by ${goalData.by}`}
        leading={
          <Link href="/invest/goals">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* SIP amount card + slider */}
        <div
          className="p-4 rounded-[18px]"
          style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
        >
          {/* Amount row */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span
                className="tnum text-[38px] font-bold text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatINR(sipAmount)}
              </span>
              <span className="text-[14px] text-muted">/ month</span>
            </div>
            <button
              className="text-[13px] font-bold tracking-[0.04em]"
              style={{ color: "var(--saffron-deep)" }}
            >
              EDIT
            </button>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={1000}
            max={20000}
            step={500}
            value={sipAmount}
            onChange={(e) => setSipAmount(Number(e.target.value))}
            className="w-full mt-3"
            style={{ accentColor: "var(--saffron)", height: 4, cursor: "pointer" }}
          />
          <div className="flex justify-between mt-1 text-[11px] text-muted">
            <span>₹1K</span>
            <span>₹20K</span>
          </div>

          {/* YOU INVEST / PROJECTED stats */}
          <div
            className="mt-4 grid grid-cols-2 gap-3 p-3.5 rounded-[12px]"
            style={{ background: "var(--surface-2)" }}
          >
            <div>
              <div
                className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted"
              >
                You invest
              </div>
              <div
                className="tnum text-[22px] font-bold text-ink mt-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatINR(totalInvested, { abbreviate: true })}
              </div>
            </div>
            <div>
              <div
                className="text-[10px] font-bold tracking-[0.08em] uppercase"
                style={{ color: "var(--good)" }}
              >
                Projected · {yrs} yr
              </div>
              <div
                className="tnum text-[22px] font-bold mt-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--good)" }}
              >
                {formatINR(projected, { abbreviate: true })}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted mt-2 leading-[1.4]">
            Assuming 12% CAGR · historical, not guaranteed
          </p>
        </div>

        {/* Saathi suggests label */}
        <div
          className="eyebrow px-0.5 pt-1"
          style={{ color: "var(--saffron-deep)" }}
        >
          Saathi suggests · 3 funds, split {allocationStr}
        </div>

        {/* Fund cards */}
        {config.funds.map((fund) => (
          <div
            key={fund.abbr}
            className="rounded-[18px] overflow-hidden"
            style={{
              background: "var(--surface)",
              border: fund.isCore
                ? "2px solid var(--saffron)"
                : "1px solid var(--hairline)",
            }}
          >
            <div className="p-4">
              {/* Fund header */}
              <div className="flex items-start gap-3">
                {/* Badge */}
                <span
                  className="w-[44px] h-[44px] rounded-[12px] shrink-0 flex items-center justify-center text-[13px] font-extrabold tracking-[0.05em] text-white"
                  style={{ background: fund.bgColor }}
                >
                  {fund.abbr}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[15px] font-bold text-ink leading-tight"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {fund.name}
                        </span>
                        {fund.isCore && (
                          <Pill tone="saffron" size="sm">Core</Pill>
                        )}
                      </div>
                      <div className="text-[11px] text-muted mt-0.5">
                        {fund.category}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className="tnum text-[18px] font-bold"
                        style={{ fontFamily: "var(--font-display)", color: "var(--good)" }}
                      >
                        {fund.cagr5yr}%
                      </div>
                      <div className="text-[9px] text-muted mt-0.5">5yr CAGR</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why note */}
              <div
                className="mt-3 px-3 py-2.5 rounded-[10px]"
                style={{ background: "var(--tint-saffron)" }}
              >
                <p
                  className="text-[12px] leading-[1.4]"
                  style={{ color: "var(--saffron-ink)" }}
                >
                  <span className="font-semibold">Why</span>
                  {" · "}
                  <em className="italic">{fund.why}</em>
                </p>
              </div>

              {/* Stats row */}
              <div className="mt-3 flex gap-4 text-[11px] flex-wrap">
                <span className="text-muted">
                  3yr CAGR{" "}
                  <strong className="tnum text-ink">{fund.cagr3yr}%</strong>
                </span>
                <span className="text-muted">
                  Expense{" "}
                  <strong className="text-ink">{fund.expense}</strong>
                </span>
                <span className="font-semibold" style={{ color: "var(--good)" }}>
                  Direct plan ✓
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Allocation strip */}
        <div
          className="p-3.5 rounded-[18px] flex items-center gap-3"
          style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
        >
          <div className="flex-1 h-2.5 rounded-full overflow-hidden flex">
            {config.funds.map((f, i) => (
              <div
                key={f.abbr}
                style={{
                  width: `${config.allocation[i]}%`,
                  background: f.bgColor,
                }}
              />
            ))}
          </div>
          <div className="flex gap-3 shrink-0">
            {config.funds.map((f, i) => (
              <div key={f.abbr} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: f.bgColor }}
                />
                <span className="text-[10px] font-semibold text-muted">
                  {f.abbr} {config.allocation[i]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Start SIP · {formatINR(sipAmount)}/mo
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>

        <p className="text-center text-[11px] text-muted pb-2">
          Redirects to fund house portal · Saathi earns zero on direct plans
        </p>
      </div>
    </div>
  );
}
