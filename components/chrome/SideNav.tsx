"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageCircle, Wallet, User, Flame, Zap } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home",   label: "Home",   icon: Home,          href: "/home"   },
  { id: "family", label: "Family", icon: Users,         href: "/family" },
  { id: "saathi", label: "Saathi", icon: MessageCircle, href: "/saathi", badge: "AI" },
  { id: "money",  label: "Money",  icon: Wallet,        href: "/money"  },
  { id: "me",     label: "Me",     icon: User,          href: "/me"     },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-hairline"
      style={{ width: 232, background: "var(--bg-app)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-hairline">
        <Logo size={32} />
        <div>
          <div
            className="text-[17px] font-bold text-ink leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gloww
          </div>
          <div className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--ink-3)" }}>
            AI finance co-pilot
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-[0.1em] uppercase px-3 mb-1.5 mt-1" style={{ color: "var(--ink-3)" }}>
          Menu
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all text-[13px] font-medium group",
                isActive
                  ? "text-[#fbe7cf]"
                  : "text-ink-2 hover:bg-surface-3 hover:text-ink",
              )}
              style={isActive ? { background: "var(--surface-ink)" } : undefined}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.7}
                className="shrink-0"
              />
              <span className="flex-1">{tab.label}</span>
              {tab.badge && (
                <span
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(251,231,207,0.18)" : "rgba(217,120,58,0.12)",
                    color: isActive ? "#fbe7cf" : "var(--saffron)",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider + AI tools */}
        <div className="text-[10px] font-bold tracking-[0.1em] uppercase px-3 mb-1.5 mt-4" style={{ color: "var(--ink-3)" }}>
          AI tools
        </div>

        <Link
          href="/roast"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all text-[13px] font-medium",
            pathname.startsWith("/roast")
              ? "text-[#fca5a5]"
              : "text-ink-2 hover:bg-surface-3 hover:text-ink",
          )}
          style={pathname.startsWith("/roast") ? { background: "rgba(28,17,10,0.9)" } : undefined}
        >
          <Flame size={17} strokeWidth={1.7} className="shrink-0" />
          <span className="flex-1">Portfolio Roast</span>
          <span
            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(239,68,68,0.12)", color: "#dc2626" }}
          >
            NEW
          </span>
        </Link>

        <Link
          href="/saathi"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all text-[13px] font-medium",
            "text-ink-2 hover:bg-surface-3 hover:text-ink",
          )}
        >
          <Zap size={17} strokeWidth={1.7} className="shrink-0" />
          <span className="flex-1">Ask Saathi</span>
          <span
            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}
          >
            DeepSeek
          </span>
        </Link>
      </nav>

      {/* Tech stack footer */}
      <div className="px-4 py-4 border-t border-hairline">
        <div className="text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "var(--ink-3)" }}>
          Powered by
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["DeepSeek AI", "OpenRouter", "MongoDB", "Next.js 15"].map((t) => (
            <span
              key={t}
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[5px] border border-hairline"
              style={{ color: "var(--ink-3)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
