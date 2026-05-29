import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CardTone = "white" | "cream" | "sand" | "saffron" | "indigo" | "ink";

const toneClasses: Record<CardTone, string> = {
  white:   "bg-surface border border-hairline",
  cream:   "bg-surface-2",
  sand:    "bg-surface-3",
  saffron: "bg-tint-saffron",
  indigo:  "bg-tint-indigo",
  ink:     "bg-surface-ink",
};

interface FSCardProps {
  children: ReactNode;
  tone?: CardTone;
  pad?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function FSCard({
  children,
  tone = "white",
  pad = 16,
  className,
  style,
  onClick,
}: FSCardProps) {
  return (
    <div
      onClick={onClick}
      style={{ padding: pad, ...style }}
      className={cn(
        "rounded-[18px]",
        toneClasses[tone],
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
