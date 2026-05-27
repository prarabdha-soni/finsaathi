import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MobileScreenProps {
  children: ReactNode;
  className?: string;
  bg?: string;
}

export function MobileScreen({ children, className, bg }: MobileScreenProps) {
  return (
    <div className="min-h-dvh bg-bg-canvas flex flex-col items-center sm:justify-center sm:py-8">
      <div
        className={cn(
          "mobile-screen flex flex-col",
          className,
        )}
        style={bg ? { background: bg } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
