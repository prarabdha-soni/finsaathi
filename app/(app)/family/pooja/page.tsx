import Link from "next/link";
import { ChevronLeft, ChevronRight, AlertTriangle, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { Avatar }    from "@/components/shared/Avatar";
import { formatINR } from "@/lib/format";
import { pooja }     from "@/lib/personas";

// Pooja's 5 dimension scores (all low — homemaker with no own finance)
const DIMS = [
  { name: "Protection", score: 12, weight: 25, hint: "Term ₹0 · health via Rahul family floater only" },
  { name: "Liquidity",  score: 8,  weight: 15, hint: "No personal savings account" },
  { name: "Investing",  score: 38, weight: 25, hint: "PPF ₹500/mo · no SIPs" },
  { name: "Credit",     score: 0,  weight: 20, hint: "Invisible file · no CIBIL score" },
  { name: "Tax",        score: 55, weight: 15, hint: "No taxable income · PPF filing up to date" },
];

function dimColor(score: number) {
  if (score >= 60) return "var(--good)";
  if (score >= 40) return "var(--caution)";
  return "var(--bad)";
}

const QUICK_FIXES = [
  {
    title: "Get ₹50L term cover",
    sub:   "Even homemakers need cover — child care, domestic labour cost",
    impact: "Protection +28 pts",
    href:   "/family/pooja/term",
    urgent: true,
  },
  {
    title: "Build credit file",
    sub:   "Add as authorised user on Rahul's HDFC card",
    impact: "Credit 0 → 650+",
    href:   "/family/pooja/credit",
    urgent: true,
  },
  {
    title: "Open her own savings account",
    sub:   "Financial independence starts with a personal account",
    impact: "Liquidity +20 pts",
    href:   "#",
    urgent: false,
  },
  {
    title: "Step up PPF to ₹2,000/mo",
    sub:   "Cheap, safe, 7.1% guaranteed — ideal for homemakers",
    impact: "Investing +12 pts",
    href:   "#",
    urgent: false,
  },
];

export default function PoojaPage() {
  return (
    <div className="pb-10">
      <AppHeader
        title="Pooja"
        subtitle="Family member · age 26"
        leading={
          <Link href="/family">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Profile card */}
        <FSCard tone="white" pad={16}>
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={pooja.name} size={52} tone="indigo" />
            <div className="flex-1 min-w-0">
              <div
                className="text-[20px] font-bold text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {pooja.name}
              </div>
              <div className="text-[12px] text-muted mt-0.5">
                {pooja.profession} · {pooja.education} · {pooja.city}
              </div>
              <Pill tone="rose" size="sm" className="mt-1.5">
                {pooja.finScoreGrade}
              </Pill>
            </div>
            <div className="text-right shrink-0">
              <div
                className="tnum text-[42px] font-bold leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--bad)" }}
              >
                {pooja.finScore}
              </div>
              <div className="text-[10px] text-muted mt-0.5">FinScore</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Term cover", value: "₹0",       bad: true  },
              { label: "CIBIL",      value: "None",      bad: true  },
              { label: "Health",     value: "₹10L",      bad: false },
            ].map((s) => (
              <div
                key={s.label}
                className="p-2.5 rounded-[10px] text-center"
                style={{ background: s.bad ? "rgba(220,80,60,0.08)" : "var(--surface-3)" }}
              >
                <div
                  className="tnum text-[14px] font-bold"
                  style={{ color: s.bad ? "var(--bad)" : "var(--ink)" }}
                >
                  {s.value}
                </div>
                <div className="text-[10px] text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </FSCard>

        {/* Critical alert */}
        <div
          className="flex items-start gap-3 p-3.5 rounded-[14px]"
          style={{ background: "var(--tint-bad,#fde8e8)", border: "1px solid rgba(220,80,60,0.2)" }}
        >
          <AlertTriangle size={16} strokeWidth={2} style={{ color: "var(--bad)", flexShrink: 0, marginTop: 1 }} />
          <p className="text-[12px] text-ink leading-[1.45]">
            Pooja has <strong>no financial identity</strong> — no credit file, no personal investments,
            no term cover. She is entirely dependent on Rahul. Two actions can change this in 4 minutes.
          </p>
        </div>

        {/* 5 dimension bars */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">5 dimensions</div>
          {DIMS.map((d) => (
            <div key={d.name} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[13px] font-semibold text-ink">{d.name}</span>
                <span
                  className="tnum text-[14px] font-bold"
                  style={{ color: dimColor(d.score) }}
                >
                  {d.score}
                </span>
              </div>
              <div
                className="h-[6px] rounded-full overflow-hidden"
                style={{ background: "var(--surface-3)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${d.score}%`, background: dimColor(d.score) }}
                />
              </div>
              <div className="text-[10px] text-muted mt-1">{d.hint}</div>
            </div>
          ))}
        </FSCard>

        {/* Potential score */}
        <FSCard tone="cream" pad={16}>
          <div className="eyebrow mb-2">Potential in 12 months</div>
          <div className="flex items-baseline gap-2">
            <span
              className="tnum text-[36px] font-bold text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pooja.finScore}
            </span>
            <TrendingUp size={20} style={{ color: "var(--good)" }} />
            <span
              className="tnum text-[36px] font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--good)" }}
            >
              52
            </span>
          </div>
          <p className="text-[12px] text-muted mt-1.5 leading-[1.45]">
            Completing the 4 actions below lifts Pooja from{" "}
            <em>No safety net</em> to <em>Building</em> — protecting
            Riya regardless of what happens.
          </p>
        </FSCard>

        {/* Action list */}
        <div className="eyebrow px-1 pt-1 pb-0.5">Actions for Pooja</div>

        {QUICK_FIXES.map((a, i) => (
          <Link key={a.title} href={a.href}>
            <div
              className="flex items-start gap-3 p-4 rounded-[16px] border"
              style={{
                background: "var(--surface)",
                borderColor: a.urgent ? "rgba(220,80,60,0.25)" : "var(--hairline)",
              }}
            >
              <span
                className="w-7 h-7 rounded-[8px] shrink-0 flex items-center justify-center font-extrabold text-[12px] mt-0.5"
                style={{
                  background: a.urgent ? "var(--bad)" : "var(--surface-3)",
                  color: a.urgent ? "#fff" : "var(--ink-2)",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-ink">{a.title}</div>
                <div className="text-[12px] text-muted mt-0.5">{a.sub}</div>
                <div
                  className="text-[11px] font-semibold mt-1.5"
                  style={{ color: "var(--good)" }}
                >
                  {a.impact}
                </div>
              </div>
              {a.href !== "#" && (
                <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0, marginTop: 4 }} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
