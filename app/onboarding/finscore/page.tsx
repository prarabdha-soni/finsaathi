import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RingGauge }    from "@/components/finscore/RingGauge";
import { rahul }        from "@/lib/personas";

const DIMS = [
  { name: "Protection", v: 38, status: "Critical · No term cover" },
  { name: "Liquidity",  v: 52, status: "Thin · 1.2 mo expenses" },
  { name: "Investing",  v: 64, status: "Active SIPs, random picks" },
  { name: "Credit",     v: 71, status: "694 · Building" },
  { name: "Tax",        v: 82, status: "80C 92% utilised" },
];

const TOP3 = [
  { t: "Get ₹1.2 Cr term cover",              s: "Will lift Protection by 28 pts",  mins: "4 min" },
  { t: "Grow emergency fund to 6 months",     s: "₹2.3L gap · auto‑SIP suggested",  mins: "2 min" },
  { t: "Move random funds to 3 curated",      s: "+2.4% projected CAGR",             mins: "6 min" },
];

function barColor(v: number) {
  if (v >= 75) return "#7eb389";
  if (v >= 55) return "var(--saffron-soft)";
  return "#e88a6e";
}

export default function FinScoreRevealPage() {
  return (
    <div
      className="flex-1 flex flex-col"
      style={{ background: "var(--ink)", color: "#fbe7cf" }}
    >
      <div className="flex-1 overflow-y-auto px-[22px] pt-3 pb-4">
        {/* Eyebrow */}
        <div className="eyebrow" style={{ color: "var(--saffron-soft)" }}>
          Your FinScore · {rahul.name}
        </div>

        {/* Ring */}
        <div className="flex justify-center my-3">
          <RingGauge
            score={rahul.finScore}
            size={240}
            thickness={14}
            grade={rahul.finScoreGrade}
            dark
          />
        </div>

        {/* Headline */}
        <p
          className="text-center max-w-[280px] mx-auto text-[22px] font-medium leading-[1.2]"
          style={{ fontFamily: "var(--font-display)", color: "#fff8ef" }}
        >
          You&apos;re{" "}
          <em className="italic" style={{ color: "var(--saffron-soft)" }}>
            building
          </em>{" "}
          — but a few gaps are quietly costing you.
        </p>

        {/* Dimensions */}
        <div
          className="mt-4 rounded-[18px] p-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(251,231,207,0.12)",
          }}
        >
          {DIMS.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center gap-3 py-2.5"
              style={{
                borderTop: i === 0 ? "none" : "1px solid rgba(251,231,207,0.08)",
              }}
            >
              <div
                className="shrink-0 text-[13px] font-semibold"
                style={{ width: 90, color: "#fff8ef" }}
              >
                {d.name}
              </div>
              <div className="flex-1">
                <div
                  className="h-[6px] rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.v}%`, background: barColor(d.v) }}
                  />
                </div>
                <div
                  className="text-[11px] mt-1"
                  style={{ color: "rgba(251,231,207,0.7)" }}
                >
                  {d.status}
                </div>
              </div>
              <div
                className="tnum text-[14px] font-bold shrink-0"
                style={{ minWidth: 32, textAlign: "right", color: "#fff8ef" }}
              >
                {d.v}
              </div>
            </div>
          ))}
        </div>

        {/* Top 3 */}
        <div className="eyebrow mt-5 mb-2.5" style={{ color: "var(--saffron-soft)" }}>
          Top 3 to fix first
        </div>
        <div className="flex flex-col gap-2">
          {TOP3.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 rounded-[14px]"
              style={{
                background: "rgba(251,231,207,0.06)",
                border: "1px solid rgba(251,231,207,0.12)",
              }}
            >
              <span
                className="w-7 h-7 rounded-[8px] shrink-0 flex items-center justify-center font-extrabold text-[13px]"
                style={{ background: "var(--saffron)", color: "#fff8ef" }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px]" style={{ color: "#fff8ef" }}>
                  {a.t}
                </div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: "rgba(251,231,207,0.7)" }}
                >
                  {a.s}
                </div>
              </div>
              <span
                className="text-[10px] font-semibold shrink-0"
                style={{ color: "var(--saffron-soft)" }}
              >
                {a.mins}
              </span>
              <ChevronRight size={16} strokeWidth={2} style={{ color: "var(--saffron-soft)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────── */}
      <div
        className="shrink-0 px-[22px] pt-3.5 pb-7"
        style={{ background: "rgba(28,24,18,0.92)" }}
      >
        <Link
          href="/home"
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Open my dashboard
          <ChevronRight size={18} strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
