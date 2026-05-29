import Link from "next/link";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

// 6-month sparkline Dec→May
const SPARK = [
  { x:   0, y: 668 }, { x:  48, y: 671 }, { x:  96, y: 674 },
  { x: 144, y: 680 }, { x: 192, y: 688 }, { x: 240, y: 694 },
];
const MONTHS_S = ["D", "J", "F", "M", "A", "M"];
function sy(v: number) { return 48 - ((v - 660) / 50) * 42; }
const pathD = SPARK.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${sy(p.y)}`).join(" ");
const areaD = pathD + ` L${SPARK[SPARK.length - 1].x} 54 L0 54 Z`;

const ACCOUNTS = [
  {
    name:    "HDFC Bank",
    type:    "Credit Card",
    balance: 48000,
    limit:   180000,
    status:  "Active",
    tone:    "amber" as const,
    detail:  "26.7% utilisation · pay before 5 Jun",
  },
  {
    name:    "SBI",
    type:    "Home Loan",
    balance: rahul.homeLoan.outstanding,
    limit:   null,
    status:  "Active",
    tone:    "good" as const,
    detail:  `EMI ${formatINR(rahul.homeLoan.emiPerMonth)}/mo · ${rahul.homeLoan.yearsLeft} yrs left`,
  },
  {
    name:    "Bajaj Finserv",
    type:    "Consumer EMI",
    balance: 0,
    limit:   null,
    status:  "Closed",
    tone:    "neutral" as const,
    detail:  "Closed Aug 2024 · hard inquiry flagged",
  },
];

const SCORE_TIERS = [
  { label: "Poor",      range: "300–549", active: false },
  { label: "Fair",      range: "550–699", active: true  },
  { label: "Good",      range: "700–749", active: false },
  { label: "Excellent", range: "750–900", active: false },
];

// ── Semicircle arc maths (left to right, 180°) ───────────────
const SCORE_MIN = 300, SCORE_MAX = 900;
// viewBox: 0 0 260 140  (wide enough for r=100, cx=130, cy=115)
const CX = 130, CY = 115, R = 96;
const pct = (rahul.cibil - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
// Track: from (CX-R, CY) to (CX+R, CY) going UP (large arc = 0)
const trackStart = { x: CX - R, y: CY };
const trackEnd   = { x: CX + R, y: CY };
// Fill endpoint
const fillAngle = Math.PI + Math.PI * pct; // starts at left (180°), sweeps right
const fillX = CX + R * Math.cos(fillAngle);
const fillY = CY + R * Math.sin(fillAngle);
const largeArc  = pct > 0.5 ? 1 : 0;

// Score colour
const scoreColor = rahul.cibil >= 750 ? "var(--good)" : rahul.cibil >= 700 ? "var(--caution)" : "var(--caution)";

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

        {/* ── Score gauge + 6-month trend ─────────────── */}
        <FSCard tone="cream" pad={16}>

          {/* ── Semicircle gauge — full-width, centred ── */}
          <div className="flex flex-col items-center">
            <svg
              viewBox="0 0 260 130"
              style={{ width: "100%", maxWidth: 240, height: "auto" }}
              aria-label={`CIBIL score ${rahul.cibil}`}
            >
              {/* Track arc */}
              <path
                d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
                fill="none"
                stroke="var(--surface-3)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Filled arc */}
              <path
                d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 ${largeArc} 1 ${fillX} ${fillY}`}
                fill="none"
                stroke={scoreColor}
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Score number */}
              <text
                x={CX} y={CY - 14}
                textAnchor="middle"
                fontSize="38"
                fontWeight="600"
                fill="var(--ink)"
                fontFamily="var(--font-display)"
              >
                {rahul.cibil}
              </text>
              {/* Tier label */}
              <text
                x={CX} y={CY + 10}
                textAnchor="middle"
                fontSize="13"
                fill="var(--ink-3)"
                fontFamily="var(--font-ui)"
              >
                {rahul.cibilTier}
              </text>
              {/* Range labels */}
              <text x={trackStart.x - 2} y={CY + 20} textAnchor="middle" fontSize="9" fill="var(--ink-3)" fontFamily="var(--font-ui)">300</text>
              <text x={trackEnd.x + 2}   y={CY + 20} textAnchor="middle" fontSize="9" fill="var(--ink-3)" fontFamily="var(--font-ui)">900</text>
            </svg>

            {/* Tier bar */}
            <div className="flex gap-1 w-full mt-1">
              {SCORE_TIERS.map((t) => (
                <div key={t.label} className="flex-1 text-center">
                  <div
                    className="h-[4px] rounded-full mb-1"
                    style={{ background: t.active ? scoreColor : "var(--surface-3)" }}
                  />
                  <div className="text-[9px] font-semibold" style={{ color: t.active ? scoreColor : "var(--muted)" }}>
                    {t.label}
                  </div>
                  <div className="text-[8px]" style={{ color: "var(--muted)" }}>{t.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-3" style={{ borderTop: "1px solid var(--hairline)" }} />

          {/* 6-month sparkline */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="eyebrow">6-month trend</div>
              <Pill tone="good" size="sm">+26 since Dec</Pill>
            </div>
            <svg viewBox="0 0 240 58" className="w-full" style={{ height: 52 }}>
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
                <text key={i} x={i * 48} y="57" fontSize="9"
                  fill="var(--muted)" fontFamily="var(--font-ui)" textAnchor="middle">
                  {m}
                </text>
              ))}
            </svg>
          </div>
        </FSCard>

        {/* ── Dispute flag ─────────────────────────────── */}
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

        {/* ── Active accounts ──────────────────────────── */}
        <div className="eyebrow px-1 pt-1 pb-0.5">Active accounts</div>

        {ACCOUNTS.map((acc) => (
          <FSCard key={acc.name + acc.type} tone="white" pad={14}>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center font-bold text-[13px]"
                style={{ background: "var(--surface-3)", color: "var(--ink-2)" }}
              >
                {acc.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[13px] font-bold text-ink">{acc.name}</span>
                    <span className="text-[11px] text-muted ml-1.5">{acc.type}</span>
                  </div>
                  <Pill tone={acc.tone} size="sm">{acc.status}</Pill>
                </div>
                <div className="text-[11px] text-muted mt-0.5">{acc.detail}</div>
                {acc.limit && (
                  <div className="mt-1.5">
                    <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(acc.balance / acc.limit) * 100}%`, background: "var(--caution)" }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted">
                      <span>Used {formatINR(acc.balance)}</span>
                      <span>Limit {formatINR(acc.limit)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FSCard>
        ))}

        {/* ── Quick actions ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5 mt-1">
          <Link
            href="/credit/plan"
            className="flex items-center justify-between p-3.5 rounded-[14px]"
            style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
          >
            <div>
              <div className="text-[13px] font-bold text-ink">Improvement plan</div>
              <div className="text-[11px] text-muted mt-0.5">750 in 12 months</div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted)" }} />
          </Link>
          <Link
            href="/credit/loans"
            className="flex items-center justify-between p-3.5 rounded-[14px]"
            style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
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
