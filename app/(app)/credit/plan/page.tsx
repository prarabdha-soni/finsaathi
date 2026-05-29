import Link from "next/link";
import { ChevronLeft, CheckCircle2, Circle, AlertTriangle, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { rahul }     from "@/lib/personas";

interface Action {
  id:       string;
  title:    string;
  detail:   string;
  impact:   string;
  priority: "high" | "medium" | "low";
  done:     boolean;
  timeframe: string;
}

const ACTIONS: Action[] = [
  {
    id:        "dispute-bajaj",
    title:     "Dispute Bajaj hard inquiry",
    detail:    "Aug 2024 inquiry on your report may qualify for removal under RBI guidelines.",
    impact:    "+8–12 pts",
    priority:  "high",
    done:      false,
    timeframe: "This week",
  },
  {
    id:        "reduce-cc-util",
    title:     "Pay down HDFC card to 10%",
    detail:    "Reduce utilisation from 26.7% → 10% (pay ₹29,700). Single biggest lever.",
    impact:    "+18–22 pts",
    priority:  "high",
    done:      false,
    timeframe: "Before 5 Jun",
  },
  {
    id:        "autopay",
    title:     "Enable auto-pay on all cards",
    detail:    "3 late payments in 2024. Auto-pay minimum prevents recurrence — free action.",
    impact:    "Protect score",
    priority:  "high",
    done:      false,
    timeframe: "Today",
  },
  {
    id:        "no-new-credit",
    title:     "Pause new credit applications",
    detail:    "Each hard inquiry costs 5–8 pts. Avoid new cards / loans for 6 months.",
    impact:    "Prevent -5 to -8",
    priority:  "medium",
    done:      false,
    timeframe: "Next 6 months",
  },
  {
    id:        "become-authorised",
    title:     "Add Pooja as authorised user",
    detail:    "Your HDFC card (old, low utilisation) boosts Pooja's thin file too.",
    impact:    "Pooja +30–40 pts",
    priority:  "medium",
    done:      false,
    timeframe: "This month",
  },
  {
    id:        "keep-old-accounts",
    title:     "Keep old Bajaj account open",
    detail:    "Credit age matters. Even closed-zero accounts add average age. Don't close.",
    impact:    "+4–6 pts",
    priority:  "low",
    done:      true,
    timeframe: "Done",
  },
];

const PRIORITY_STYLES = {
  high:   { bg: "var(--tint-bad,#fde8e8)",    text: "var(--bad)",    label: "High" },
  medium: { bg: "var(--tint-saffron)",         text: "var(--saffron-deep)", label: "Medium" },
  low:    { bg: "var(--surface-3)",            text: "var(--muted)",  label: "Low"  },
};

// Projected score milestones
const MILESTONES = [
  { label: "Now",    score: rahul.cibil, months: 0  },
  { label: "3 mo",   score: 716,         months: 3  },
  { label: "6 mo",   score: 731,         months: 6  },
  { label: "12 mo",  score: 752,         months: 12 },
];

export default function CreditPlanPage() {
  const target = 750;
  const pct    = (rahul.cibil - 300) / (900 - 300);
  const pctT   = (target - 300) / (900 - 300);

  return (
    <div className="pb-10">
      <AppHeader
        title="Improvement Plan"
        subtitle={`${rahul.cibil} → ${target}+ · 12 months`}
        leading={
          <Link href="/credit">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Projection card ──────────────────────── */}
        <FSCard tone="cream" pad={16}>
          <div className="eyebrow mb-2">Projected trajectory</div>
          {/* Progress bar now → target */}
          <div className="relative h-[10px] rounded-full overflow-visible mb-4"
            style={{ background: "var(--surface-3)" }}>
            {/* Target marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full"
              style={{ left: `${pctT * 100}%`, background: "var(--good)" }}
            />
            {/* Current fill */}
            <div
              className="h-full rounded-full"
              style={{ width: `${pct * 100}%`, background: "var(--caution)" }}
            />
            {/* Target label */}
            <div
              className="absolute -top-5 text-[9px] font-semibold"
              style={{ left: `${pctT * 100}%`, transform: "translateX(-50%)", color: "var(--good)" }}
            >
              {target}
            </div>
          </div>

          {/* Milestones row */}
          <div className="grid grid-cols-4 gap-1">
            {MILESTONES.map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className="tnum text-[16px] font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: m.months === 0 ? "var(--caution)" : m.score >= target ? "var(--good)" : "var(--ink)",
                  }}
                >
                  {m.score}
                </div>
                <div className="text-[10px] text-muted mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          <div
            className="mt-3 flex items-center gap-2 p-2.5 rounded-[10px]"
            style={{ background: "var(--surface-3)" }}
          >
            <TrendingUp size={13} style={{ color: "var(--good)", flexShrink: 0 }} />
            <p className="text-[11px] text-muted leading-[1.4]">
              Complete all 5 remaining actions and you can reach{" "}
              <strong className="text-ink">Good</strong> tier (750+) by May 2027.
            </p>
          </div>
        </FSCard>

        {/* ── Action list ──────────────────────────── */}
        <div className="eyebrow px-1 pt-1 pb-0.5">
          6 actions · 5 remaining
        </div>

        {ACTIONS.map((a) => {
          const ps = PRIORITY_STYLES[a.priority];
          return (
            <div
              key={a.id}
              className="p-4 rounded-[16px] border"
              style={{
                background: a.done ? "var(--surface-3)" : "var(--surface)",
                borderColor: a.done ? "var(--hairline)" : "var(--hairline)",
                opacity: a.done ? 0.6 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Check circle */}
                {a.done
                  ? <CheckCircle2 size={20} strokeWidth={2} style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }} />
                  : <Circle size={20} strokeWidth={1.5} style={{ color: "var(--hairline-2)", flexShrink: 0, marginTop: 1 }} />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-ink flex-1">
                      {a.title}
                    </span>
                    <Pill
                      tone={a.priority === "high" ? "rose" : a.priority === "medium" ? "saffron" : "neutral"}
                      size="sm"
                    >
                      {ps.label}
                    </Pill>
                  </div>
                  <p className="text-[12px] text-muted mt-1 leading-[1.45]">
                    {a.detail}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: a.priority === "high" ? "var(--good)" : "var(--saffron-deep)" }}
                    >
                      {a.impact}
                    </span>
                    <span className="text-[11px] text-muted">{a.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Dispute CTA ──────────────────────────── */}
        <div
          className="p-4 rounded-[16px] flex items-start gap-3"
          style={{ background: "var(--tint-indigo)" }}
        >
          <AlertTriangle size={16} strokeWidth={2} className="text-indigo shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-bold text-indigo">
              Saathi can draft your dispute letter
            </div>
            <p className="text-[12px] text-muted mt-1 leading-[1.4]">
              One tap to generate a CIBIL dispute letter for the Bajaj Finserv
              inquiry. Takes 2 minutes.
            </p>
            <Link
              href="/saathi"
              className="inline-block mt-2 text-[12px] font-semibold text-indigo underline underline-offset-2"
            >
              Open Saathi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
