import { BottomNav } from "@/components/chrome/BottomNav";
import { SideNav }   from "@/components/chrome/SideNav";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    /*
     * Mobile (< lg):  centred phone frame — same as before
     * Desktop (≥ lg): full-height flex-row with a sticky sidebar
     */
    <div
      className="
        min-h-dvh flex flex-col items-center
        sm:justify-center sm:py-8
        lg:flex-row lg:items-stretch lg:justify-start lg:py-0
      "
      style={{ background: "var(--bg-canvas)" }}
    >
      {/* Desktop sidebar — hidden below lg */}
      <SideNav />

      {/* Phone frame on mobile/tablet · full-width pane on desktop */}
      <div className="mobile-screen">
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden lg:max-w-[720px] lg:mx-auto lg:w-full"
          style={{ background: "var(--bg-app)" }}
        >
          {children}
        </main>

        {/* Bottom nav — hidden on desktop (sidebar handles navigation) */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
