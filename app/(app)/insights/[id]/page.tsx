import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Lock, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import { Logo }   from "@/components/shared/Logo";
import { Pill }   from "@/components/shared/Pill";
import { FSCard } from "@/components/shared/FSCard";

/* Only the cashback insight has a full detail view right now */
export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id !== "cashback") notFound();
  return <CashbackInsight />;
}

/* Evidence step definition */
const EVIDENCE_STEPS = [
  {
    tag: "AA · 6 months",
    tone: "good",
    icon: CreditCard,
    title: "Your spending pattern",
    data: [
      ["Monthly salary credit",  "₹65,000",         false],
      ["Average monthly spend",  "₹38,000",         true ],
      ["Of which UPI",           "₹35,400 (93%)",   true ],
      ["Card EMI visible",       "None — likely no card", false],
    ] as [string, string, boolean][],
  },
  {
    tag: "Conversation",
    tone: "indigo",
    icon: MessageCircle,
    title: "You confirmed in chat",
    quote: '"I pay everything by UPI. Don\'t want a credit card — too risky."',
    quoteMeta: "— Rahul · 14 days ago",
    follow:
      'Saathi context: "risky" usually means "I don\'t want debt". A cashback card paid in full each month isn\'t debt.',
  },
  {
    tag: "Experian · live",
    tone: "saffron",
    icon: ShieldCheck,
    title: "You qualify — and you don't even know",
    data: [
      ["Your CIBIL score",          "724",                           false],
      ["Required for premium cards", "720+",                         false],
      ["Pre-qualified offers",       "4 cards (HDFC, Axis, ICICI, SBI)", true],
    ] as [string, string, boolean][],
  },
] as const;

const TONE_STYLES: Record<string, { bg: string; fg: string }> = {
  good:    { bg: "var(--tint-green)",   fg: "var(--good-deep)" },
  indigo:  { bg: "var(--tint-indigo)",  fg: "var(--indigo)" },
  saffron: { bg: "var(--tint-saffron)", fg: "var(--saffron-deep)" },
};

function CashbackInsight() {
  return (
    <div className="min-h-full pb-0" style={{ background: "var(--surface-2)" }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-hairline"
        style={{ background: "rgba(246,239,225,0.94)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2.5">
          <Link href="/insights">
            <button aria-label="Back" className="w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-surface-3 transition-colors">
              <ArrowLeft size={18} strokeWidth={1.8} />
            </button>
          </Link>
          <div>
            <div className="text-[16px] font-bold text-ink leading-tight">Saathi noticed</div>
            <div className="text-[11px] text-muted">Cashback card · 2h ago</div>
          </div>
        </div>
        <Link href="/insights">
          <button aria-label="Dismiss" className="w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-surface-3 transition-colors">
            <X size={18} strokeWidth={1.8} className="text-muted" />
          </button>
        </Link>
      </div>

      <div className="px-4 pt-4">

        {/* Hero punchline */}
        <FSCard tone="ink" pad={22} className="relative overflow-hidden">
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              right: -40, top: -40, width: 200, height: 200,
              background: "radial-gradient(circle, rgba(217,120,58,0.35), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="eyebrow" style={{ color: "var(--saffron-soft)" }}>
                Rahul, I noticed something
              </span>
            </div>
            <div
              className="text-[32px] font-medium mt-3.5 leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", color: "#fff8ef" }}
            >
              You&apos;re spending{" "}
              <em className="italic" style={{ color: "var(--saffron-soft)" }}>
                ₹38,000/mo
              </em>{" "}
              via UPI.
              <br />
              That&apos;s{" "}
              <em className="italic" style={{ color: "var(--saffron-soft)" }}>
                ₹6,800/yr
              </em>{" "}
              in cashback you&apos;re not earning.
            </div>
          </div>
        </FSCard>

        {/* Evidence timeline */}
        <div className="eyebrow mt-5 mb-2.5 px-1">What I&apos;m reading from</div>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div
            className="absolute left-[10px] top-3.5 bottom-3.5 w-0.5 rounded"
            style={{ background: "var(--hairline-2)" }}
          />

          {EVIDENCE_STEPS.map((step, i) => {
            const t = TONE_STYLES[step.tone];
            const Icon = step.icon;
            return (
              <div key={i} className="relative pb-3.5">
                {/* Timeline dot */}
                <span
                  className="absolute -left-[20px] top-3.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2"
                  style={{
                    background: t.bg, color: t.fg,
                    borderColor: "var(--surface-2)",
                  }}
                >
                  <Icon size={11} strokeWidth={2} />
                </span>

                <FSCard tone="white" pad={14}>
                  <div className="flex justify-between items-baseline">
                    <span className="eyebrow" style={{ color: t.fg }}>{step.tag}</span>
                    <Pill size="sm" tone="ghost">Source {i + 1}/3</Pill>
                  </div>
                  <div
                    className="text-[16px] font-medium mt-1.5 text-ink"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </div>

                  {"data" in step && step.data && (
                    <div className="mt-2.5">
                      {step.data.map(([label, value, highlight], j) => (
                        <div
                          key={j}
                          className="flex justify-between items-baseline py-1.5 text-[12px]"
                          style={{
                            borderBottom:
                              j < step.data!.length - 1 ? "1px dashed var(--hairline)" : "none",
                          }}
                        >
                          <span className="text-ink-3">{label}</span>
                          <span
                            className="tnum font-semibold"
                            style={{ color: highlight ? "var(--saffron-deep)" : "var(--ink)", fontWeight: highlight ? 700 : 600 }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {"quote" in step && step.quote && (
                    <div
                      className="mt-2.5 p-3 rounded-[10px]"
                      style={{ background: "var(--surface-2)", borderLeft: "3px solid var(--indigo)" }}
                    >
                      <p
                        className="text-[13px] text-ink leading-[1.45] italic"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {step.quote}
                      </p>
                      <div className="text-[10px] text-muted mt-1 font-semibold">{step.quoteMeta}</div>
                      <p className="text-[11px] text-ink-3 mt-2 leading-[1.45]">{step.follow}</p>
                    </div>
                  )}
                </FSCard>
              </div>
            );
          })}
        </div>

        {/* Math trail */}
        <div className="eyebrow mt-4 mb-2.5 px-1">Here&apos;s the math</div>
        <div
          className="rounded-[16px] p-4"
          style={{ background: "var(--tint-saffron)", border: "none" }}
        >
          <div
            className="text-[13px] leading-[2]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--saffron-ink)",
              fontFeatureSettings: "'tnum' on",
            }}
          >
            {(
              [
                ["Monthly spend",   "₹38,000", false, false],
                ["× Cashback rate", "1.5%",    false, false],
                ["= Per month back","₹570",    true,  false],
                ["× 12 months",     "",        false, false],
                ["= Per year",      "₹6,840",  true,  true ],
              ] as [string, string, boolean, boolean][]
            ).map(([label, value, divTop, bold], i) => (
              <div
                key={i}
                className="flex justify-between"
                style={divTop ? { borderTop: `${bold ? "2px" : "1.5px"} solid var(--saffron-deep)`, paddingTop: 6, marginTop: 4 } : undefined}
              >
                <span style={{ fontWeight: bold ? 800 : 400 }}>{label}</span>
                <span
                  className="tnum"
                  style={{ fontWeight: bold ? 800 : 700, fontSize: bold ? 18 : 13 }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3 leading-[1.5]" style={{ color: "rgba(90,42,12,0.7)" }}>
            Assumes you pay the bill in full each month (no interest). Saathi auto‑pays from HDFC
            savings on day&nbsp;25.
          </p>
        </div>

        {/* Card recommendation */}
        <div className="eyebrow mt-5 mb-2.5 px-1">Saathi pick · 4 you pre-qualify for</div>
        <FSCard
          tone="white"
          pad={16}
          className="border-[1.5px]"
          style={{ borderColor: "var(--saffron)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-12 h-12 rounded-[12px] flex items-center justify-center text-[13px] font-extrabold tracking-[0.04em] text-white shrink-0"
              style={{ background: "var(--indigo)" }}
            >
              HM
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-muted font-semibold">HDFC Bank</div>
              <div className="text-[15px] font-bold text-ink">Millennia Credit Card</div>
              <div className="text-[11px] font-bold mt-0.5" style={{ color: "var(--saffron-deep)" }}>
                ✓ Pre-approved · ₹2L limit
              </div>
            </div>
            <Pill tone="saffron" size="sm">Best fit</Pill>
          </div>

          {/* Stats grid */}
          <div
            className="grid grid-cols-3 gap-2 mt-3.5 py-3"
            style={{ borderTop: "1px dashed var(--hairline)", borderBottom: "1px dashed var(--hairline)" }}
          >
            {(
              [
                ["CASHBACK",    "1.5%",   "on UPI · 5% Swiggy",        "var(--ink)"],
                ["ANNUAL FEE",  "₹1,000", "Waived · ₹1L spend",        "var(--good)"],
                ["NET BENEFIT", "₹5,840", "per year",                   "var(--good)"],
              ] as const
            ).map(([label, val, note, valColor]) => (
              <div key={label}>
                <div className="text-[9px] text-muted font-bold">{label}</div>
                <div
                  className="tnum text-[16px] font-bold mt-0.5"
                  style={{ color: valColor }}
                >
                  {val}
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: valColor === "var(--good)" ? valColor : "var(--muted)" }}>
                  {note}
                </div>
              </div>
            ))}
          </div>

          <ul className="mt-3 flex flex-col gap-1 pl-0">
            {[
              "UPI on credit card · works as you spend today",
              "Saathi auto-pays full bill from HDFC on day 25",
              "No FX markup on Swiggy / Zomato / Netflix",
            ].map((p) => (
              <li key={p} className="flex gap-1.5 text-[12px] text-ink-2">
                <span className="font-bold" style={{ color: "var(--good)" }}>✓</span>
                {p}
              </li>
            ))}
          </ul>

          <button className="mt-3 inline-flex items-center px-3 h-8 rounded-[10px] border border-hairline text-[13px] font-semibold text-ink hover:bg-surface-2 transition-colors">
            Compare with 3 others
          </button>
        </FSCard>

        {/* Commission disclosure */}
        <div
          className="mt-3.5 p-3 rounded-[10px] flex gap-2 items-start text-[11px] text-muted leading-[1.5] border border-hairline bg-surface"
        >
          <Lock size={14} strokeWidth={2} className="shrink-0 mt-0.5" />
          <span>
            Saathi earns{" "}
            <strong className="text-ink-2">₹1,200</strong> if you&apos;re approved for this card. We rank Millennia
            first because the net benefit is highest — not the commission.{" "}
            <span className="font-bold" style={{ color: "var(--saffron-deep)" }}>
              Why?
            </span>
          </span>
        </div>

        {/* Extra bottom space for sticky bar */}
        <div className="h-32" />
      </div>

      {/* Sticky action bar */}
      <div
        className="sticky bottom-0 px-4 pt-3.5 pb-7 border-t border-hairline"
        style={{ background: "rgba(250,245,235,0.96)", backdropFilter: "blur(12px)" }}
      >
        <button
          className="w-full h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold flex items-center justify-center gap-2"
          style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.22) inset, 0 1px 3px rgba(168,85,34,0.4)" }}
        >
          Check pre-approval · 30 sec
        </button>
        <div className="flex justify-center gap-3.5 mt-2.5 text-[11px] text-muted">
          <span>No CIBIL hit · soft pull</span>
          <span>·</span>
          <span>Skip — remind me in 30 days</span>
        </div>
      </div>
    </div>
  );
}
