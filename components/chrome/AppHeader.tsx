import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Provide a custom bg colour (e.g. 'transparent' or 'var(--bg-app)') */
  bg?: string;
  sticky?: boolean;
  className?: string;
}

export function AppHeader({
  title,
  subtitle,
  leading,
  trailing,
  bg,
  sticky = true,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "shrink-0 px-[18px] pb-3 pt-2 z-10",
        sticky && "sticky top-0",
        className,
      )}
      style={{
        background: bg ?? "transparent",
        borderBottom: bg ? "1px solid var(--hairline)" : "none",
      }}
    >
      <div className="flex items-center justify-between gap-3 min-h-[36px]">
        <div className="flex items-center gap-[10px] min-w-0">
          {leading}
          {(title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <div
                  className="font-display text-[22px] font-medium tracking-[-0.015em] text-ink truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-[12px] text-muted mt-0.5">{subtitle}</div>
              )}
            </div>
          )}
        </div>
        {trailing && (
          <div className="flex items-center gap-1.5 shrink-0">{trailing}</div>
        )}
      </div>
    </header>
  );
}
