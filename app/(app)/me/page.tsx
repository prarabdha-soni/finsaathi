import Link from "next/link";
import {
  ChevronRight, Bell, Shield, HelpCircle,
  LogOut, Sparkles, FileText, Globe,
} from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { Avatar }    from "@/components/shared/Avatar";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { rahul }     from "@/lib/personas";

const STATS = [
  { label: "Actions taken",   value: rahul.actionsToDate.toString() },
  { label: "Saved",           value: formatINR(rahul.savedToDate) },
  { label: "FinScore lift",   value: `+${rahul.finScoreLift} pts` },
  { label: "Member since",    value: rahul.memberSince },
];

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: Bell,      label: "Notifications",       sub: "EMI reminders, nudges",     href: "#" },
      { icon: Globe,     label: "Language",             sub: "English",                   href: "#" },
      { icon: Shield,    label: "Privacy & data",       sub: "AA consent · data export",  href: "#" },
    ],
  },
  {
    title: "Gloww",
    items: [
      { icon: Sparkles,  label: "Upgrade to Plus",      sub: "₹199/mo · cancel anytime",  href: "/paywall" },
      { icon: FileText,  label: "My reports",           sub: "Tax summary, FinScore PDF",  href: "#" },
      { icon: HelpCircle, label: "Help & support",      sub: "FAQ · chat with team",       href: "#" },
    ],
  },
];

export default function MePage() {
  return (
    <div className="pb-10">
      <AppHeader
        title="Profile"
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* ── Profile card ─────────────────────────── */}
        <FSCard tone="cream" pad={16}>
          <div className="flex items-center gap-3">
            <Avatar name={rahul.name} size={52} tone="saffron" />
            <div className="flex-1 min-w-0">
              <div
                className="text-[20px] font-bold text-ink leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {rahul.name}
              </div>
              <div className="text-[12px] text-muted mt-0.5">
                {rahul.profession} · {rahul.city}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Pill tone="saffron" size="sm">
                  <Sparkles size={10} className="inline mr-1" />
                  {rahul.plan} plan
                </Pill>
                <span className="text-[11px] text-muted">
                  Renews {rahul.planRenews}
                </span>
              </div>
            </div>
          </div>
        </FSCard>

        {/* ── Stats grid ───────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="p-3.5 rounded-[14px]"
              style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
            >
              <div
                className="tnum text-[20px] font-bold text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </div>
              <div className="text-[11px] text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FinScore summary bar ─────────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="flex justify-between items-center mb-2">
            <div className="eyebrow">FinScore</div>
            <Link href="/finscore" className="text-[12px] font-semibold" style={{ color: "var(--saffron)" }}>
              See full breakdown →
            </Link>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="tnum text-[32px] font-bold text-ink"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {rahul.finScore}
            </span>
            <Pill tone="good" size="sm">+{rahul.finScoreDelta} this month</Pill>
          </div>
          <div
            className="mt-2 h-[6px] rounded-full overflow-hidden"
            style={{ background: "var(--surface-3)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${rahul.finScore}%`, background: "var(--saffron)" }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-muted">
            <span>{rahul.finScoreGrade}</span>
            <span>Peer avg {rahul.finScorePeerAvg}</span>
          </div>
        </FSCard>

        {/* ── Menu sections ────────────────────────── */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="eyebrow px-1 pb-1.5 pt-2">{section.title}</div>
            <div
              className="rounded-[16px] overflow-hidden"
              style={{ border: "1px solid var(--hairline)" }}
            >
              {section.items.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3.5 bg-surface hover:bg-surface-3 transition-colors"
                  style={{
                    borderBottom: i < section.items.length - 1
                      ? "1px solid var(--hairline)"
                      : "none",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-[9px] shrink-0 flex items-center justify-center"
                    style={{ background: "var(--surface-3)" }}
                  >
                    <item.icon size={15} strokeWidth={2} style={{ color: "var(--ink-2)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-ink">{item.label}</div>
                    <div className="text-[11px] text-muted">{item.sub}</div>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* ── Dependents summary ───────────────────── */}
        <FSCard tone="white" pad={14}>
          <div className="eyebrow mb-2">Your household</div>
          <div className="flex gap-2 flex-wrap">
            {["Rahul · 28", "Pooja · 26", "Riya · 4", "Parents"].map((m) => (
              <div
                key={m}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                style={{ background: "var(--surface-3)", border: "1px solid var(--hairline)" }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px]"
                  style={{ background: "var(--tint-saffron)", color: "var(--saffron-deep)" }}
                >
                  {m[0]}
                </div>
                <span className="text-[12px] text-ink-2">{m}</span>
              </div>
            ))}
          </div>
          <Link
            href="/family"
            className="flex items-center justify-between mt-3 pt-3 border-t border-hairline"
          >
            <span className="text-[13px] font-semibold text-ink">
              Family financial health
            </span>
            <ChevronRight size={15} style={{ color: "var(--saffron)" }} />
          </Link>
        </FSCard>

        {/* ── Legal footer ─────────────────────────── */}
        <div className="flex justify-center gap-4 pt-2 pb-4">
          {["Terms", "Privacy", "DPDP consent"].map((l) => (
            <span
              key={l}
              className="text-[11px] text-muted underline underline-offset-2 cursor-pointer"
            >
              {l}
            </span>
          ))}
        </div>

        {/* ── Sign out ─────────────────────────────── */}
        <button
          className="flex items-center justify-center gap-2 h-[48px] rounded-[14px] border border-hairline bg-surface text-[14px] font-semibold text-muted w-full"
        >
          <LogOut size={15} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </div>
  );
}
