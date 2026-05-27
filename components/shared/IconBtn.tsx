import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function IconBtn({ children, className, ...props }: IconBtnProps) {
  return (
    <button
      {...props}
      className={cn(
        "w-9 h-9 rounded-[12px] bg-surface border border-hairline",
        "inline-flex items-center justify-center text-ink-2",
        "hover:bg-surface-2 transition-colors shrink-0",
        className,
      )}
    >
      {children}
    </button>
  );
}
