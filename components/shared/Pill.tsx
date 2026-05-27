import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PillTone =
  | "neutral"
  | "saffron"
  | "indigo"
  | "good"
  | "amber"
  | "rose"
  | "ink"
  | "ghost";

const tones: Record<PillTone, string> = {
  neutral: "bg-surface-2 text-ink-2 border border-hairline",
  saffron: "bg-tint-saffron text-saffron-ink border-transparent",
  indigo:  "bg-tint-indigo text-indigo border-transparent",
  good:    "bg-tint-green text-good-deep border-transparent",
  amber:   "bg-tint-amber border-transparent",
  rose:    "bg-tint-rose border-transparent",
  ink:     "bg-ink text-[#faf5eb] border-transparent",
  ghost:   "bg-transparent text-ink-2 border border-hairline-2",
};

const amberText  = "[color:#6e4f0a]";
const roseText   = "[color:#7a2a1a]";

const textOverride: Partial<Record<PillTone, string>> = {
  amber: amberText,
  rose:  roseText,
};

interface PillProps {
  tone?: PillTone;
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Pill({ tone = "neutral", size = "md", children, className, style, onClick }: PillProps) {
  return (
    <span
      onClick={onClick}
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold leading-none tracking-[0.01em]",
        size === "sm" ? "px-[9px] py-[3px] text-[11px]" : "px-[11px] py-[5px] text-[12px]",
        tones[tone],
        textOverride[tone],
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </span>
  );
}
