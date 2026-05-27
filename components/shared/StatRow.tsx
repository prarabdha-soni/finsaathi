import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type StatTone = "good" | "bad" | "amber" | "default";

const toneColor: Record<StatTone, string> = {
  good:    "text-good",
  bad:     "text-bad",
  amber:   "text-caution",
  default: "text-ink",
};

interface StatRowProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: StatTone;
  className?: string;
}

export function StatRow({ label, value, hint, tone = "default", className }: StatRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-baseline py-[10px] border-b border-dashed border-hairline last:border-0",
        className,
      )}
    >
      <div>
        <div className="text-[13px] text-ink-2 font-medium">{label}</div>
        {hint && <div className="text-[11px] text-muted mt-0.5">{hint}</div>}
      </div>
      <div className={cn("text-[15px] font-bold tnum", toneColor[tone])}>{value}</div>
    </div>
  );
}
