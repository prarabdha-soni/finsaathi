import type { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center sm:justify-center sm:py-8" style={{ background: "var(--bg-canvas)" }}>
      <div className="mobile-screen">
        {children}
      </div>
    </div>
  );
}
