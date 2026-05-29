import { Logo }      from "@/components/shared/Logo";
import { formatINR } from "@/lib/format";
import { cn }        from "@/lib/utils";
import type { ReactNode } from "react";

interface ChatBubbleProps {
  from: "me" | "them";
  children: ReactNode;
  time?: string;
}

export function ChatBubble({ from, children, time }: ChatBubbleProps) {
  const isMe = from === "me";
  return (
    <div
      className={cn(
        "flex gap-2 mb-2.5",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      {!isMe && <Logo size={26} className="shrink-0 mt-1" />}
      <div style={{ maxWidth: "76%" }}>
        <div
          className={cn(
            "text-[14px] leading-[1.45] px-3.5 py-[11px]",
            isMe
              ? "bg-saffron text-[#fff8ef] rounded-[18px] rounded-br-[6px]"
              : "bg-surface text-ink border border-hairline rounded-[18px] rounded-bl-[6px]",
          )}
          style={isMe ? { boxShadow: "0 1px 4px rgba(168,85,34,0.25)" } : undefined}
        >
          {children}
        </div>
        {time && (
          <div
            className={cn(
              "text-[10px] text-muted mt-1",
              isMe ? "text-right" : "text-left",
            )}
          >
            {time}
          </div>
        )}
      </div>
    </div>
  );
}

/** Rich card embedded inside a Saathi bubble */
export function MonthAtAGlanceCard() {
  const rows = [
    { label: "Salary in",      value: formatINR(65000) },
    { label: "Fixed out",      value: formatINR(42100) },
    { label: "Free to deploy", value: formatINR(22900) },
    { label: "80C headroom",   value: formatINR(12000) },
  ];
  return (
    <div
      className="mt-2.5 p-3 rounded-[12px]"
      style={{ background: "var(--tint-saffron)" }}
    >
      <div className="eyebrow" style={{ color: "var(--saffron-deep)" }}>
        Month at a glance · May
      </div>
      <div className="grid grid-cols-2 gap-2.5 mt-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div
              className="text-[10px]"
              style={{ color: "var(--saffron-ink)", opacity: 0.7 }}
            >
              {r.label}
            </div>
            <div
              className="tnum text-[16px] font-bold mt-0.5"
              style={{ color: "var(--saffron-ink)" }}
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
