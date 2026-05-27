"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home",   label: "Home",   icon: Home,          href: "/home" },
  { id: "saathi", label: "Saathi", icon: MessageCircle, href: "/saathi", highlight: true },
  { id: "money",  label: "Money",  icon: Wallet,        href: "/invest" },
  { id: "me",     label: "Me",     icon: User,          href: "/me" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="shrink-0 flex items-center justify-around pb-safe-bottom border-t border-hairline"
      style={{
        height: 88,
        paddingTop: 8,
        paddingBottom: "max(22px, env(safe-area-inset-bottom))",
        background: "rgba(250,245,235,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname.startsWith(tab.href);

        if (tab.highlight) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="flex flex-col items-center gap-1 px-2"
            >
              <span
                className="flex items-center justify-center rounded-[18px] bg-ink text-saffron-soft"
                style={{
                  width: 52,
                  height: 52,
                  marginTop: -16,
                  boxShadow: "0 6px 18px -8px rgba(28,24,18,0.5)",
                }}
              >
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <span className="text-[10px] font-bold text-ink-2 tracking-[0.04em]">
                {tab.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              isActive ? "text-ink" : "text-muted",
            )}
          >
            <Icon size={22} strokeWidth={isActive ? 2 : 1.6} />
            <span
              className={cn(
                "text-[10px] tracking-[0.04em]",
                isActive ? "font-bold" : "font-medium",
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
