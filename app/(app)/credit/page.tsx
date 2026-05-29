import Link from "next/link";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

// Sparkline data: Dec→May CIBIL 668→694
const SPARK = [
  { x:   0, y: 668 }, { x:  48, y: 671 }, { x:  96, y: 674 },
  { x: 144, y: 680 }, { x: 192, y: 688 }, { x: 240, y: 694 },
];
const MONTHS_S = ["D", "J", "F", "M", "A", "M"];
function sy(v: number) { return 55 - ((v - 660) / 50) * 45; }
const pathD = SPARK.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${sy(p.y)}`).join(" ");
const areaD = pathD + ` L${SPARK[SPARK.length - 1].x} 60 L0 60 Z`;

const ACCOUNTS = [
  {
    name:     "HDFC Bank",
    type:     "Credit Card",
    balance:  48000,
    limit:    180000,
    status:   "Active",
    tone:     "amber" as const,
    detail:   "26.7% utilisation · pay before 5 Jun",
  },
  {
    name:     "SBI",
    type:     "Home Loan",
    balance:  rahul.homeLoan.outstanding,
    limit:    null,
    status:   "Active",
    tone:     "good" as const,
    detail:   `EMI ${formatINR(rahul.homeLoan.emiPerMonth)}/mo · ${rahul.homeLoan.yearsLeft} yrs left`,
  },
  {
    name:     "Bajaj Finserv",
    type:     "Consumer EMI",
    balance:  0,
    limit:    null,
    status:   "Closed",
    tone:     "neutral" as const,
    detail:   "Closed Aug 2024 · hard inquiry flagged",
  },
];

const SCORE_TIERS = [
  { label: "Poor",      range: "300–549", active: false },
  { label: "Fair",      range: "550–699", active: true  },
  { label: "Good",      range: "700–749", active: false },
  { label: "Excellent", range: "750–900", active: false },
];

// Arc maths: 694 maps to ~144° of 180° arc
const SCORE_MIN = 300, SCORE_MAX = 900;
const pct = (rahul.cibil - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
const cx = 120, cy = 110, r = 85;
const startAngle = Math.PI;
const totalAngle = Math.PI;
const endAngle = startAngle + totalAngle * pct;
const x1 = cx + r * Math.cos(startAngle);
const y1 = cy + r * Math.sin(startAngle);
const x2 = cx + r * Math.cos(endAngle);
const y2 = cy + r * Math.sin(endAngle);
const largeArc = pct > 0.5 ? 1 : 0;

export default function CreditPage() {
  return (
    <div className="pb-10">
      <AppHeader
        title="Credit"
        subtitle={`CIBIL ${rahul.cibil} · ${rahul.cibilTier}`}
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Score gauge + sparkline ──────────────── */}
        <FSCard tone="cream" pad={16}>
          <div className="flex gap-4 items-start">
            {/* Semicircle gauge */}
            <div className="shrink-0" style={{ width: 130 }}>
              <svg viewBox="0 0 240 120" style={{ width: 130, height: 65 }}>
                {/* Track */}
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke="var(--surface-3)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Fill */}
                <path
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke="var(--caution)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Score label */}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fontWeight="700"
                  fill="var(--ink)" fontFamily="var(--font-display)">
                  {rahul.cibil}
                </text>
                <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11"
                  fill="var(--muted)" fontFamily="var(--font-ui)">
                  {rahul.cibilTier}
                </text>
              </svg>
            </div>

            {/* 6-month sparkline */}
            <div className="flex-1 min-w-0">
              <div className="eyebrow mb-1">6-month trend</div>
              <div className="flex items-baseline gap-1.5">
                <span className="tnum text-[22px] font-bold text-ink"
                  style={{ fontFamily: "var(--font-display)" }}>
                  {rahul.cibil}
                </span>
                <Pill tone="good" size="sm">+26 since Dec</Pill>
              </div>
              <svg viewBox="0 0 240 65" className="w-full mt-1.5" style={{ height: 55 }}>
                <defs>
                  <linearGradient id="cibilGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(217,120,58,0.35)" />
                    <stop offset="100%" stopColor="rgba(217,120,58,0)" />
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#cibilGrad)" />
                <path d={pathD} stroke="var(--saffron)" strokeWidth="2"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {SPARK.map((p, i) => (
                  <circle key={i} cx={p.x} cy={sy(p.y)} r="2.5" fill="var(--saffron)" />
                ))}
                {MONTHS_S.map((m, i) => (
                  <text key={i} x={i * 48} y="63" fontSize="9"
                    fill="var(--muted)" fontFamily="var(--font-ui)" textAnchor="middle">
                    {m}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Score tier bar */}
          <div className="flex gap-1 mt-3">
            {SCORE_TIERS.map((t) => (
              <div key={t.label} className="flex-1 text-center">
                <div
                  className="h-[5px] rounded-full mb-1"
                  style={{
                    background: t.active ? "var(--caution)" : "var(--surface-3)",
                  }}
                />
                <div
                  className="text-[9px] font-semibold"
                  style={{ color: t.active ? "var(--caution)" : "var(--muted)" }}
                >
                  {t.label}
                </div>
                <div className="text-[8px] text-muted">{t.range}</div>
              </div>
            ))}
          </div>
        </FSCard>

        {/* ── Dispute flag ─────────────────────────── */}
        <div
          className="flex items-start gap-3 p-3.5 rounded-[14px]"
          style={{ background: "var(--tint-bad, #fde8e8)", border: "1px solid rgba(220,80,60,0.2)" }}
        >
          <AlertCircle size={16} strokeWidth={2} style={{ color: "var(--bad)", flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-ink">
              1 dispute opportunity found
            </div>
            <div className="text-[12px] text-muted mt-0.5">
              Bajaj Finserv hard inquiry (Aug 2024) may be removable — could lift score 8–12 pts
            </div>
          </div>
          <Link
            href="/credit/plan"
            className="shrink-0 text-[12px] font-semibold"
            style={{ color: "var(--bad)" }}
          >
            Fix →
          </Link>
        </div>

        {/* ── Credit accounts ──────────────────────── */}
        <div className="eyebrow px-1 pt-1 pb-0.5">Active accounts</div>

        {ACCOUNTS.map((acc) => (
          <FSCard key={acc.name + acc.type} tone="white" pad={14}>
            <div className="flex items-start gap-3">
              {/* Monogram */}
              <div
                className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center font-bold text-[13px]"
                style={{ background: "var(--surface-3)", color: "var(--ink-2)" }}
              >
                {acc.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-ink">{acc.name}</span>
                  <span className="text-[11px] text-muted">{acc.type}</span>
                </div>
                <div className="text-[11px] text-muted mt-0.5">{acc.detail}</div>

                {/* Utilisation bar for credit card */}
                {acc.limit && (
                  <div className="mt-1.5">
                    <div
                      className="h-[4px] rounded-full overflow-hidden"
                      style={{ background: "var(--surface-3)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(acc.balance / acc.limit) * 100}%`,
                          background: "var(--caution)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted">
                      <span>Used {formatINR(acc.balance)}</span>
                      <span>Limit {formatINR(acc.limit)}</span>
                    </div>
                  </div>
                )}
              </div>
              <Pill tone={acc.tone} size="sm">{acc.status}</Pill>
            </div>
          </FSCard>
        ))}

        {/* ── Quick links ──────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 mt-1">
          <Link
            href="/credit/plan"
            className="flex items-center justify-between p-3.5 rounded-[14px] bg-surface border border-hairline"
          >
            <div>
              <div className="text-[13px] font-bold text-ink">Improvement plan</div>
              <div className="text-[11px] text-muted mt-0.5">750 in 12 months</div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted)" }} />
          </Link>
          <Link
            href="/credit/loans"
            className="flex items-center justify-between p-3.5 rounded-[14px] bg-surface border border-hairline"
          >
            <div>
              <div className="text-[13px] font-bold text-ink">Loans & EMIs</div>
              <div className="text-[11px] text-muted mt-0.5">
                {formatINR(rahul.homeLoan.emiPerMonth)}/mo
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted)" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
