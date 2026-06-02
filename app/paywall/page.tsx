import Link from "next/link";
import { ChevronLeft, Check, Sparkles, Zap, Shield, Users } from "lucide-react";
import { IconBtn } from "@/components/shared/IconBtn";
import { Logo }    from "@/components/shared/Logo";

const FEATURES = [
  {
    icon:  Zap,
    title: "Unlimited Saathi chats",
    free:  "5/mo",
    plus:  "Unlimited",
  },
  {
    icon:  Shield,
    title: "Full FinScore breakdown",
    free:  "Summary only",
    plus:  "All 5 dimensions",
  },
  {
    icon:  Sparkles,
    title: "Personalised action plan",
    free:  false,
    plus:  true,
  },
  {
    icon:  Check,
    title: "Insurance comparison",
    free:  false,
    plus:  true,
  },
  {
    icon:  Users,
    title: "Family financial health",
    free:  false,
    plus:  true,
  },
  {
    icon:  Check,
    title: "Credit dispute letters",
    free:  false,
    plus:  true,
  },
  {
    icon:  Check,
    title: "Tax filing prep",
    free:  false,
    plus:  true,
  },
  {
    icon:  Check,
    title: "Monthly money review",
    free:  false,
    plus:  true,
  },
];

const PLANS = [
  {
    id:       "monthly",
    label:    "Monthly",
    price:    299,
    period:   "mo",
    badge:    null,
    popular:  false,
  },
  {
    id:       "annual",
    label:    "Annual",
    price:    199,
    period:   "mo",
    badge:    "Save 33%",
    popular:  true,
    annualBilled: 2388,
  },
];

export default function PaywallPage() {
  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--ink)", color: "#fff8ef" }}
    >
      {/* Header */}
      <div className="shrink-0 px-[18px] pt-3 pb-2 flex items-center gap-3">
        <Link href="/home">
          <IconBtn aria-label="Back" className="border-[rgba(255,248,239,0.15)] bg-[rgba(255,255,255,0.06)]">
            <ChevronLeft size={18} style={{ color: "#fff8ef" }} />
          </IconBtn>
        </Link>
        <div className="flex items-center gap-2">
          <Logo size={24} color="var(--saffron)" />
          <span
            className="text-[15px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#fff8ef" }}
          >
            Gloww Plus
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[18px] pb-4">

        {/* Hero copy ───────────────────────────── */}
        <div className="py-4 text-center">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(217,120,58,0.18)", border: "1px solid rgba(217,120,58,0.3)" }}
          >
            <Sparkles size={12} style={{ color: "var(--saffron)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--saffron-soft)" }}>
              Upgrade to Plus
            </span>
          </div>
          <h1
            className="text-[28px] font-medium leading-[1.2] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your money deserves a{" "}
            <em className="italic" style={{ color: "var(--saffron-soft)" }}>
              real co‑pilot
            </em>
          </h1>
          <p className="text-[14px] leading-[1.5]" style={{ color: "rgba(255,248,239,0.65)" }}>
            Rahul saves an average of{" "}
            <strong style={{ color: "#fff8ef" }}>₹42,000/yr</strong> with Plus actions.
            Takes 10 minutes a month.
          </p>
        </div>

        {/* Feature comparison ──────────────────── */}
        <div
          className="rounded-[18px] overflow-hidden mb-4"
          style={{ border: "1px solid rgba(255,248,239,0.1)" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-3 px-4 py-2.5 text-center"
            style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,248,239,0.08)" }}
          >
            <div className="text-left text-[11px] font-semibold" style={{ color: "rgba(255,248,239,0.5)" }}>
              Feature
            </div>
            <div className="text-[11px] font-semibold" style={{ color: "rgba(255,248,239,0.5)" }}>Free</div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--saffron-soft)" }}>Plus</div>
          </div>

          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="grid grid-cols-3 px-4 py-3 items-center"
              style={{
                borderBottom: i < FEATURES.length - 1 ? "1px solid rgba(255,248,239,0.06)" : "none",
                background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
              }}
            >
              <div className="flex items-center gap-2">
                <f.icon size={13} style={{ color: "rgba(255,248,239,0.4)", flexShrink: 0 }} />
                <span className="text-[12px]" style={{ color: "rgba(255,248,239,0.8)" }}>
                  {f.title}
                </span>
              </div>
              <div className="text-center">
                {typeof f.free === "string"
                  ? <span className="text-[11px]" style={{ color: "rgba(255,248,239,0.45)" }}>{f.free}</span>
                  : f.free
                  ? <Check size={14} style={{ color: "rgba(255,248,239,0.4)", margin: "0 auto" }} />
                  : <span className="text-[14px]" style={{ color: "rgba(255,248,239,0.2)" }}>—</span>
                }
              </div>
              <div className="text-center">
                {typeof f.plus === "string"
                  ? <span className="text-[12px] font-semibold" style={{ color: "var(--saffron-soft)" }}>{f.plus}</span>
                  : <Check size={15} strokeWidth={2.5} style={{ color: "var(--saffron)", margin: "0 auto" }} />
                }
              </div>
            </div>
          ))}
        </div>

        {/* Plan selector ───────────────────────── */}
        <div className="flex gap-2.5 mb-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="flex-1 relative p-4 rounded-[16px] cursor-pointer"
              style={{
                background: plan.popular
                  ? "rgba(217,120,58,0.15)"
                  : "rgba(255,255,255,0.05)",
                border: plan.popular
                  ? "2px solid var(--saffron)"
                  : "1px solid rgba(255,248,239,0.12)",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                  style={{ background: "var(--saffron)", color: "#fff8ef" }}
                >
                  {plan.badge}
                </div>
              )}
              <div className="text-[12px] font-semibold mb-1" style={{ color: "rgba(255,248,239,0.6)" }}>
                {plan.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="tnum text-[24px] font-bold" style={{ color: "#fff8ef" }}>
                  ₹{plan.price}
                </span>
                <span className="text-[11px]" style={{ color: "rgba(255,248,239,0.5)" }}>
                  /{plan.period}
                </span>
              </div>
              {plan.annualBilled && (
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,248,239,0.45)" }}>
                  ₹{plan.annualBilled} billed annually
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Social proof ────────────────────────── */}
        <div
          className="flex items-center gap-3 p-3.5 rounded-[14px] mb-4"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,248,239,0.08)" }}
        >
          <div
            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-[12px]"
            style={{ background: "var(--saffron)", color: "#fff8ef" }}
          >
            RS
          </div>
          <div>
            <p className="text-[12px] leading-[1.4]" style={{ color: "rgba(255,248,239,0.85)" }}>
              &ldquo;Saathi found ₹38K of tax savings I missed for 3 years.
              Best ₹199 I&apos;ve spent.&rdquo;
            </p>
            <div className="text-[10px] mt-1" style={{ color: "rgba(255,248,239,0.45)" }}>
              Rohit S · Pune · Software Engineer
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA ──────────────────────────── */}
      <div
        className="shrink-0 px-[18px] pt-3.5 pb-7"
        style={{ background: "rgba(28,24,18,0.95)", borderTop: "1px solid rgba(255,248,239,0.08)" }}
      >
        <button
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)" }}
        >
          <Sparkles size={16} strokeWidth={2} />
          Start Plus · ₹199/mo
        </button>
        <p className="text-center text-[11px] mt-2" style={{ color: "rgba(255,248,239,0.35)" }}>
          Cancel anytime · 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
