import { BottomNav } from "@/components/chrome/BottomNav";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center sm:justify-center sm:py-8" style={{ background: "var(--bg-canvas)" }}>
      <div className="mobile-screen">
        <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ background: "var(--bg-app)" }}>
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
