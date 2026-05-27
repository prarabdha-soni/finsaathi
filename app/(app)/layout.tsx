import { BottomNav } from "@/components/chrome/BottomNav";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg-canvas flex flex-col items-center sm:justify-center sm:py-8">
      <div className="mobile-screen">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
