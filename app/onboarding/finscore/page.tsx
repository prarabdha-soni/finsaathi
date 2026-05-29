"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RingGauge }   from "@/components/finscore/RingGauge";
import { Pill }        from "@/components/shared/Pill";
import { usePersona }  from "@/lib/usePersona";
import { rahul }       from "@/lib/personas";

// ── Fallback data (mirrors rahul's profile) ──────────────────
const FALLBACK_DIMS = [
  { name: "Protection", v: 38, tone: "bad"   as const, status: "Critical · No term cover"    },
  { name: "Liquidity",  v: 52, tone: "amber" as const, status: "Thin · 1.2 mo expenses"     },
  { name: "Investing",  v: 64, tone: "amber" as const, status: "Active SIPs, random picks"  },
  { name: "Credit",     v: 71, tone: "good"  as const, status: "694 · Building"              },
  { name: "Tax",        v: 82, tone: "good"  as const, status: "80C 92% utilised"            },
];

const FALLBACK_TOP3 = [
  { t: "Get ₹1.2 Cr term cover",         s: "Will lift Protection by 28 pts", mins: "4 min" },
  { t: "Grow emergency fund to 6 months", s: "₹2.3L gap · auto-SIP suggested", mins: "2 min" },
  { t: "Move random funds to 3 curated",  s: "+2.4% projected CAGR",            mins: "6 min" },
];

const BAR: Record<string, string> = {
  good:  "var(--good)",
  amber: "var(--caution)",
  bad:   "var(--bad)",
};

export default function FinScoreRevealPage() {
  const persona = usePersona();

  // Pick data source — dynamic persona if available, else rahul fallback
  const displayName     = persona?.name          ?? rahul.name;
  const finScore        = persona?.finScore       ?? rahul.finScore;
  const finScoreGrade   = persona?.finScoreGrade  ?? rahul.finScoreGrade;
  const dims            = persona?.dims           ?? FALLBACK_DIMS;
  const top3            = persona?.top3           ?? FALLBACK_TOP3;

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ background: "var(--bg-app)" }}
    >
      <div className="flex-1 overflow-y-auto min-h-0 pb-4">

        {/* ── Saffron hero ─────────────────────────────── */}
        <div
          className="px-6 pt-8 pb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #faf0db 0%, #fbe7cf 50%, #f5d4a0 100%)",
            borderBottom: "1px solid rgba(217,120,58,0.18)",
          }}
        >
          {/* Decorative glows */}
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(217,120,58,0.2) 0%, transparent 65%)" }}
          />
          <div
            className="absolute -left-6 bottom-0 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,34,0.1) 0%, transparent 70%)" }}
          />

          {/* Eyebrow */}
          <div
            className="eyebrow text-center mb-4 relative"
            style={{ color: "var(--saffron-deep)" }}
          >
            Your FinScore · {displayName}
          </div>

          {/* Ring */}
          <div className="flex justify-center relative">
            <RingGauge
              score={finScore}
              size={220}
              thickness={13}
              grade={finScoreGrade}
              dark={false}
            />
          </div>

          {/* Headline — changes tone based on score */}
          <p
            className="text-center max-w-[270px] mx-auto text-[20px] font-medium leading-[1.3] mt-4 relative"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {finScore >= 70 ? (
              <>You&apos;re{" "}
                <em className="italic" style={{ color: "var(--saffron-deep)" }}>strong</em>{" "}
                — keep the momentum going.
              </>
            ) : finScore >= 50 ? (
              <>You&apos;re{" "}
                <em className="italic" style={{ color: "var(--saffron-deep)" }}>building</em>{" "}
                — a few gaps are quietly costing you.
              </>
            ) : (
              <>Your foundation{" "}
                <em className="italic" style={{ color: "var(--bad)" }}>needs attention</em>{" "}
                — but it&apos;s fixable.
              </>
            )}
          </p>
        </div>

        {/* ── 5 dimensions ─────────────────────────────── */}
        <div className="px-5 mt-5">
          <div className="eyebrow px-0.5 mb-3" style={{ color: "var(--ink-3)" }}>
            The 5 dimensions
          </div>
          <div
            className="rounded-[18px] overflow-hidden"
            style={{ border: "1px solid var(--hairline)" }}
          >
            {dims.map((d, i) => (
              <div
                key={d.name}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: "var(--surface)",
                  borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
                }}
              >
                <div
                  className="shrink-0 text-[13px] font-semibold text-ink"
                  style={{ width: 88 }}
                >
                  {d.name}
                </div>
                <div className="flex-1">
                  <div
                    className="h-[6px] rounded-full overflow-hidden"
                    style={{ background: "var(--surface-3)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.v}%`, background: BAR[d.tone] }}
                    />
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: "var(--ink-3)" }}>
                    {d.status}
                  </div>
                </div>
                <div
                  className="tnum text-[14px] font-bold shrink-0 text-right"
                  style={{ minWidth: 28, color: BAR[d.tone] }}
                >
                  {d.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top 3 ────────────────────────────────────── */}
        <div className="px-5 mt-5">
          <div className="eyebrow px-0.5 mb-3" style={{ color: "var(--ink-3)" }}>
            Top 3 to fix first
          </div>
          <div className="flex flex-col gap-2.5">
            {top3.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-[16px]"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <span
                  className="w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center font-extrabold text-[13px]"
                  style={{ background: "var(--saffron)", color: "#fff8ef" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px] text-ink leading-tight">
                    {a.t}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                    {a.s}
                  </div>
                </div>
                <Pill tone="amber" size="sm">{a.mins}</Pill>
                <ChevronRight size={15} strokeWidth={2} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div
        className="shrink-0 px-5 pt-3"
        style={{
          background: "rgba(250,245,235,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: "1px solid var(--hairline)",
          paddingBottom: "max(32px, env(safe-area-inset-bottom))",
        }}
      >
        <Link
          href="/home"
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full transition-opacity active:opacity-80"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 2px 12px rgba(168,85,34,0.32)",
          }}
        >
          Open my dashboard
          <ChevronRight size={18} strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
