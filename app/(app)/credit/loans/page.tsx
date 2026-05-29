import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

// Home loan amortisation sketch (years 1-18, principal paid / balance remaining)
const AMORT = Array.from({ length: 7 }, (_, i) => {
  const yr    = i * 3;
  const paid  = 2800000 * (1 - Math.pow(1 - 24800 / 2800000 * 0.6, yr * 12));
  const bal   = 2800000 - Math.max(0, paid);
  return { yr, bal: Math.round(bal / 100000) * 100000 };
});

const EMI_BREAKDOWN = [
  { label: "Principal",  pct: 38, color: "var(--saffron)" },
  { label: "Interest",   pct: 62, color: "var(--surface-3)" },
];

function OverpaymentRow({
  extra, savedInterest, yearsOff,
}: { extra: number; savedInterest: number; yearsOff: number }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-hairline last:border-0">
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-ink">
          +{formatINR(extra)}/mo extra
        </div>
        <div className="text-[11px] text-muted">Saves {yearsOff} yr{yearsOff !== 1 ? "s" : ""} of EMI</div>
      </div>
      <div className="text-right">
        <div className="tnum text-[14px] font-bold" style={{ color: "var(--good)" }}>
          {formatINR(savedInterest)}
        </div>
        <div className="text-[10px] text-muted">interest saved</div>
      </div>
    </div>
  );
}

export default function LoansPage() {
  const { outstanding, emiPerMonth, yearsLeft } = rahul.homeLoan;
  const emiPct = Math.round((emiPerMonth / rahul.income) * 100);

  return (
    <div className="pb-10">
      <AppHeader
        title="Loans & EMIs"
        subtitle="Home loan · no personal loan"
        leading={
          <Link href="/credit">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Home loan hero ───────────────────────── */}
        <div
          className="p-4 rounded-[20px]"
          style={{ background: "var(--ink)", color: "#fff8ef" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="eyebrow mb-1" style={{ color: "rgba(255,248,239,0.6)" }}>
                SBI Home Loan · 8.5% p.a.
              </div>
              <div
                className="tnum text-[36px] font-bold leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatINR(outstanding)}
              </div>
              <div className="text-[12px] mt-1" style={{ color: "rgba(255,248,239,0.65)" }}>
                Outstanding principal
              </div>
            </div>
            <Pill tone="neutral" size="sm">Active</Pill>
          </div>

          {/* Stats row */}
          <div
            className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-[12px]"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            {[
              { label: "EMI",           value: formatINR(emiPerMonth) + "/mo" },
              { label: "Years left",    value: `${yearsLeft} yrs` },
              { label: "% of income",   value: `${emiPct}%` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="tnum text-[14px] font-bold" style={{ color: "#fff8ef" }}>
                  {s.value}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,248,239,0.55)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* EMI income load bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] mb-1"
              style={{ color: "rgba(255,248,239,0.55)" }}>
              <span>EMI load: {emiPct}% of income</span>
              <span>Safe limit: 40%</span>
            </div>
            <div
              className="h-[6px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${emiPct}%`,
                  background: emiPct < 40 ? "var(--good)" : "var(--bad)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── EMI breakdown ────────────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">This month&apos;s EMI breakdown</div>
          <div className="flex items-center gap-3">
            {/* Donut */}
            <div className="shrink-0" style={{ width: 64, height: 64 }}>
              <svg viewBox="0 0 64 64" width={64} height={64}>
                {(() => {
                  let offset = 0;
                  return EMI_BREAKDOWN.map((seg) => {
                    const circ = 2 * Math.PI * 24;
                    const dash = (seg.pct / 100) * circ;
                    const gap  = circ - dash;
                    const el = (
                      <circle
                        key={seg.label}
                        cx="32" cy="32" r="24"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset * circ / 100}
                        transform="rotate(-90 32 32)"
                      />
                    );
                    offset += seg.pct;
                    return el;
                  });
                })()}
              </svg>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--saffron)" }} />
                  <span className="text-[12px] text-ink">Principal</span>
                </div>
                <span className="tnum text-[13px] font-bold text-ink">
                  {formatINR(Math.round(emiPerMonth * 0.38))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--surface-3)" }} />
                  <span className="text-[12px] text-ink">Interest</span>
                </div>
                <span className="tnum text-[13px] font-bold text-ink">
                  {formatINR(Math.round(emiPerMonth * 0.62))}
                </span>
              </div>
              <div
                className="flex items-center justify-between pt-1.5 border-t border-hairline"
              >
                <span className="text-[12px] font-semibold text-ink">Total EMI</span>
                <span className="tnum text-[13px] font-bold text-ink">
                  {formatINR(emiPerMonth)}
                </span>
              </div>
            </div>
          </div>
        </FSCard>

        {/* ── Overpayment impact ───────────────────── */}
        <FSCard tone="cream" pad={16}>
          <div className="flex items-center gap-2 mb-1">
            <div className="eyebrow flex-1">Overpayment impact</div>
            <Info size={13} style={{ color: "var(--muted)" }} />
          </div>
          <p className="text-[11px] text-muted mb-2 leading-[1.4]">
            Even a small extra monthly payment dramatically reduces total interest.
          </p>
          <OverpaymentRow extra={2000}  savedInterest={380000}  yearsOff={2} />
          <OverpaymentRow extra={5000}  savedInterest={840000}  yearsOff={4} />
          <OverpaymentRow extra={10000} savedInterest={1520000} yearsOff={7} />
        </FSCard>

        {/* ── Balance projection ───────────────────── */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">Balance projection</div>
          <svg viewBox="0 0 300 80" className="w-full" style={{ height: 80 }}>
            {(() => {
              const maxBal = AMORT[0].bal;
              const pts = AMORT.map((d, i) => ({
                x: (i / (AMORT.length - 1)) * 280 + 10,
                y: 10 + (1 - d.bal / maxBal) * 60,
              }));
              const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
              const area = path + ` L${pts[pts.length - 1].x} 75 L${pts[0].x} 75 Z`;
              return (
                <>
                  <defs>
                    <linearGradient id="loanGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(217,120,58,0.3)" />
                      <stop offset="100%" stopColor="rgba(217,120,58,0)" />
                    </linearGradient>
                  </defs>
                  <path d={area} fill="url(#loanGrad)" />
                  <path d={path} stroke="var(--saffron)" strokeWidth="2"
                    fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="2.5" fill="var(--saffron)" />
                      <text x={p.x} y="75" fontSize="8" fill="var(--muted)"
                        fontFamily="var(--font-ui)" textAnchor="middle">
                        Yr{AMORT[i].yr}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </FSCard>

        {/* ── No personal loan callout ─────────────── */}
        <div
          className="flex items-center gap-3 p-3.5 rounded-[14px]"
          style={{ background: "var(--tint-indigo)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-[13px]"
            style={{ background: "var(--indigo)", color: "#fff" }}
          >
            ✓
          </div>
          <div>
            <div className="text-[13px] font-bold text-indigo">No personal loan</div>
            <div className="text-[11px] text-muted mt-0.5">
              Your credit mix is clean — only the home loan. Avoid personal loans until CIBIL hits 750.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
