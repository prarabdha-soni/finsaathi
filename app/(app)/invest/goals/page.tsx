import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

const TONE_PILL: Record<string, "good" | "amber" | "rose"> = {
  good:  "good",
  amber: "amber",
  bad:   "rose",
};

const BAR_COLOR: Record<string, string> = {
  good:  "var(--good)",
  amber: "var(--caution)",
  bad:   "var(--bad)",
};

export default function GoalsPage() {
  const totalInvested = rahul.goals.reduce((sum, g) => sum + g.have, 0);
  const totalSip      = rahul.goals.reduce((sum, g) => sum + g.monthly, 0);
  const onTrackCount  = rahul.goals.filter((g) => g.tone === "good").length;

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="Goals"
        subtitle="What your money is for"
        leading={
          <Link href="/invest">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        trailing={
          <IconBtn aria-label="Add goal"><Plus size={18} /></IconBtn>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Hero summary */}
        <div
          className="flex items-center justify-between px-4 py-3.5 rounded-[18px]"
          style={{ background: "var(--surface-2)" }}
        >
          <div>
            <div
              className="text-[10px] font-bold tracking-[0.1em] uppercase"
              style={{ color: "var(--saffron-deep)" }}
            >
              Total invested
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="tnum text-[28px] font-bold text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatINR(totalInvested, { abbreviate: true })}
              </span>
              <Pill tone="good" size="sm">+12.4%</Pill>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-[10px] font-bold tracking-[0.1em] uppercase"
              style={{ color: "var(--saffron-deep)" }}
            >
              SIP/mo
            </div>
            <div
              className="tnum text-[24px] font-bold text-ink mt-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatINR(totalSip)}
            </div>
          </div>
        </div>

        {/* Section label */}
        <div
          className="eyebrow px-0.5"
          style={{ color: "var(--saffron-deep)" }}
        >
          {rahul.goals.length} goals · {onTrackCount} on track
        </div>

        {/* Goal cards */}
        {rahul.goals.map((g) => {
          const pct = Math.round((g.have / g.target) * 100);
          const pillTone = TONE_PILL[g.tone] ?? "neutral";
          const barColor = BAR_COLOR[g.tone] ?? "var(--saffron)";

          return (
            <Link key={g.id} href={`/invest/sip/${g.id}`}>
              <div
                className="p-4 rounded-[18px] bg-surface border border-hairline active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start gap-3.5">
                  {/* Emoji icon box */}
                  <div
                    className="w-[54px] h-[54px] rounded-[14px] shrink-0 flex items-center justify-center text-[26px]"
                    style={{ background: "var(--surface-3)" }}
                  >
                    {g.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + status pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[17px] font-bold text-ink leading-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {g.name}
                      </span>
                      <Pill tone={pillTone} size="sm">{g.status}</Pill>
                    </div>

                    {/* Have of target + by date */}
                    <div className="flex items-center justify-between mt-1.5 text-[13px]"
                      style={{ color: "var(--ink-3)" }}>
                      <span>
                        {formatINR(g.have, { abbreviate: true })} of{" "}
                        {formatINR(g.target, { abbreviate: true })}
                      </span>
                      <span>by {g.by}</span>
                    </div>

                    {/* Progress bar */}
                    <div
                      className="mt-2 h-[5px] rounded-full overflow-hidden"
                      style={{ background: "var(--surface-3)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(2, pct)}%`,
                          background: barColor,
                        }}
                      />
                    </div>

                    {/* % complete + SIP amount */}
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-muted">{pct}% complete</span>
                      <span className="text-[11px] text-muted">
                        SIP{" "}
                        <strong
                          className="tnum"
                          style={{ color: "var(--ink)", fontWeight: 700 }}
                        >
                          {formatINR(g.monthly)}
                        </strong>
                        /mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
