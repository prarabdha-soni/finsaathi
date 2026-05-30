import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, X, Plane } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";

/* ── Travel card universe ───────────────────────────────── */
const CARDS = [
  {
    id:            "niyo",
    name:          "Niyo Global",
    issuer:        "SBM Bank / DCB Bank",
    emoji:         "🌐",
    accentColor:   "#0d9488",
    bg:            "rgba(13,148,136,0.08)",
    annualFee:     0,
    feeLabel:      "Lifetime free",
    forexMarkup:   0,
    rewardRate:    "1% cashback",
    intlLounges:   "Partner (DreamFolks)",
    domLounges:    "2/qtr",
    fxAtm:         "Free (8 txns/mo)",
    welcomeBonus:  "₹500 cashback on 1st txn",
    bestFor:       "First international trip · budget traveler",
    saathiPick:    true,
    pros:          ["Zero forex markup saves ₹3,500/₹1L spend", "No annual fee ever", "Free ATM withdrawals abroad", "Virtual card in 2 mins"],
    cons:          ["Prepaid card — not credit", "No reward points system", "Limited lounge access"],
    applyUrl:      "#",
  },
  {
    id:            "scapia",
    name:          "Scapia",
    issuer:        "Federal Bank",
    emoji:         "🌍",
    accentColor:   "#0d9488",
    bg:            "rgba(13,148,136,0.08)",
    annualFee:     0,
    feeLabel:      "Lifetime free",
    forexMarkup:   0,
    rewardRate:    "10× on Cleartrip · 2× others",
    intlLounges:   "Unlimited (Mastercard)",
    domLounges:    "Unlimited",
    fxAtm:         "Free",
    welcomeBonus:  "5,000 Scapia coins (~₹500)",
    bestFor:       "Frequent flyers · lounge lovers",
    saathiPick:    true,
    pros:          ["Unlimited international lounges", "10× rewards on Cleartrip", "Zero forex on credit card (rare!)", "₹500Cr valuation — stable issuer"],
    cons:          ["Federal Bank credit card — slightly stricter approval", "Rewards only on Cleartrip ecosystem"],
    applyUrl:      "#",
  },
  {
    id:            "regalia",
    name:          "HDFC Regalia",
    issuer:        "HDFC Bank",
    emoji:         "👑",
    accentColor:   "#b45309",
    bg:            "rgba(254,240,138,0.3)",
    annualFee:     2500,
    feeLabel:      "₹2,500/yr (waived at ₹3L spend)",
    forexMarkup:   2.0,
    rewardRate:    "4 pts / ₹150",
    intlLounges:   "12/yr (Priority Pass)",
    domLounges:    "Unlimited VIAS",
    fxAtm:         "Included in markup",
    welcomeBonus:  "2,500 reward points",
    bestFor:       "High spenders · domestic lounges",
    saathiPick:    false,
    pros:          ["Best domestic lounge network (VIAS)", "Priority Pass for international", "Strong rewards on dining & travel"],
    cons:          ["2% forex markup = ₹2,000 lost/₹1L spent abroad", "₹2,500 fee if spend < ₹3L/yr"],
    applyUrl:      "#",
  },
  {
    id:            "atlas",
    name:          "Axis Atlas",
    issuer:        "Axis Bank",
    emoji:         "🗺️",
    accentColor:   "#6366f1",
    bg:            "rgba(99,102,241,0.08)",
    annualFee:     5000,
    feeLabel:      "₹5,000/yr",
    forexMarkup:   2.0,
    rewardRate:    "5 EDGE Miles / ₹200",
    intlLounges:   "8/yr (Priority Pass)",
    domLounges:    "8/yr VIAS",
    fxAtm:         "Included in markup",
    welcomeBonus:  "5,000 EDGE Miles (≈₹1,500)",
    bestFor:       "Business travelers · miles collectors",
    saathiPick:    false,
    pros:          ["EDGE Miles transferable to airlines", "Strong hotel/flight redemptions", "Travel concierge service"],
    cons:          ["₹5,000 fee is steep", "2% forex markup applies", "Miles expire if not used"],
    applyUrl:      "#",
  },
];

/* ── Forex markup impact calculator ──────────────── */
const SPEND_SCENARIOS = [
  { trip: "Short trip (Bali / Thailand)",       spend: 50000  },
  { trip: "Europe / USA 2-week trip",           spend: 150000 },
  { trip: "Japan / Long-haul trip",             spend: 250000 },
];
const MARKUP_STD = 0.035; // 3.5% standard markup

export default function TravelCardsPage() {
  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="Travel Cards"
        subtitle="Compare · save on every trip"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-4">

        {/* ── Hero — forex savings calculator ──────────── */}
        <div
          className="rounded-[20px] p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)",
            border: "1.5px solid rgba(13,148,136,0.2)",
            boxShadow: "0 2px 16px -6px rgba(13,148,136,0.2)",
          }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 65%)" }} />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase mb-1"
                  style={{ color: "#0f766e" }}>Indian millennials spend</div>
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-[32px] font-bold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    ₹5L+
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: "var(--ink-3)" }}>/yr on travel</span>
                </div>
                <div className="text-[12px] mt-1" style={{ color: "#0f766e" }}>
                  A standard card charges 3.5% forex = <strong>₹17,500 lost</strong>/yr
                </div>
              </div>
              <Plane size={32} style={{ color: "#0d9488" }} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col gap-1.5">
              {SPEND_SCENARIOS.map((s) => {
                const loss    = Math.round(s.spend * MARKUP_STD);
                return (
                  <div key={s.trip} className="flex justify-between items-center">
                    <span className="text-[11px]" style={{ color: "#0f766e" }}>{s.trip}</span>
                    <span className="tnum text-[11px] font-bold" style={{ color: "#dc2626" }}>
                      −{formatINR(loss)} lost
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-3 p-2.5 rounded-[10px] text-[12px] font-bold text-center"
              style={{ background: "#0d9488", color: "#f0fdfa" }}
            >
              Niyo or Scapia = ₹0 forex markup. Keep every rupee.
            </div>
          </div>
        </div>

        {/* ── Saathi recommended picks ──────────────────── */}
        <div>
          <div className="eyebrow mb-3">Saathi recommends · 2 picks</div>
          <div className="flex gap-3 overflow-x-auto -mx-[18px] px-[18px] pb-1 scrollbar-hide snap-x snap-mandatory">
            {CARDS.filter(c => c.saathiPick).map((card) => (
              <div
                key={card.id}
                className="shrink-0 snap-start rounded-[18px] p-4 flex flex-col"
                style={{
                  width: 240,
                  background: card.bg,
                  border: `1.5px solid ${card.accentColor}30`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[22px]">{card.emoji}</span>
                  <div>
                    <div className="text-[15px] font-bold text-ink">{card.name}</div>
                    <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>{card.issuer}</div>
                  </div>
                  <Pill tone="good" size="sm" className="ml-auto">Saathi pick</Pill>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
                  {[
                    { label: "Annual fee",  value: card.feeLabel   },
                    { label: "Forex markup", value: card.forexMarkup === 0 ? "0% ✓" : `${card.forexMarkup}%` },
                    { label: "Lounges intl", value: card.intlLounges },
                    { label: "Rewards",      value: card.rewardRate  },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="text-[9px] font-bold tracking-[0.06em] uppercase"
                        style={{ color: card.accentColor, opacity: 0.7 }}>{m.label}</div>
                      <div className="text-[11px] font-semibold text-ink mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href={card.applyUrl}
                  className="mt-auto flex items-center justify-center gap-1 h-9 rounded-[11px] text-[12px] font-bold"
                  style={{ background: card.accentColor, color: "#f0fdfa" }}
                >
                  Apply free <ChevronRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Full comparison ───────────────────────────── */}
        <div>
          <div className="eyebrow mb-3">All {CARDS.length} cards compared</div>
          <div className="flex flex-col gap-3">
            {CARDS.map((card) => (
              <FSCard key={card.id} tone="white" pad={14}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[20px] shrink-0"
                    style={{ background: card.bg }}
                  >
                    {card.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[14px] font-bold text-ink">{card.name}</span>
                      {card.saathiPick && <Pill tone="good" size="sm">Saathi pick</Pill>}
                      {card.forexMarkup === 0 && <Pill tone="amber" size="sm">0% forex</Pill>}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>{card.issuer}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-bold" style={{ color: card.annualFee === 0 ? "var(--good)" : "var(--ink)" }}>
                      {card.annualFee === 0 ? "Free" : formatINR(card.annualFee) + "/yr"}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>annual fee</div>
                  </div>
                </div>

                {/* Metrics grid */}
                <div
                  className="grid grid-cols-3 rounded-[10px] overflow-hidden mb-3"
                  style={{ background: "var(--surface-3)" }}
                >
                  {[
                    { label: "Forex markup", value: card.forexMarkup === 0 ? "0% ✓" : card.forexMarkup + "%", good: card.forexMarkup === 0 },
                    { label: "Intl lounges",  value: card.intlLounges,   good: false },
                    { label: "Dom lounges",   value: card.domLounges,    good: false },
                  ].map((m, i, arr) => (
                    <div
                      key={m.label}
                      className="py-2 px-1 text-center"
                      style={{ borderRight: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
                    >
                      <div className="text-[11px] font-bold" style={{ color: m.good ? "var(--good)" : "var(--ink)" }}>
                        {m.value}
                      </div>
                      <div className="text-[9px] mt-0.5" style={{ color: "var(--ink-3)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Pros & cons */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    {card.pros.slice(0, 2).map((p) => (
                      <div key={p} className="flex items-start gap-1.5 mb-1">
                        <Check size={11} style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                        <span className="text-[10px] leading-[1.3]" style={{ color: "var(--ink-2)" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {card.cons.slice(0, 2).map((c) => (
                      <div key={c} className="flex items-start gap-1.5 mb-1">
                        <X size={11} style={{ color: "var(--bad)", flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                        <span className="text-[10px] leading-[1.3]" style={{ color: "var(--ink-3)" }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best for + CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                    Best for: <strong className="text-ink">{card.bestFor}</strong>
                  </div>
                  <Link href={card.applyUrl}
                    className="text-[11px] font-bold flex items-center gap-0.5"
                    style={{ color: card.accentColor }}>
                    Apply <ChevronRight size={11} strokeWidth={2.5} />
                  </Link>
                </div>
              </FSCard>
            ))}
          </div>
        </div>

        {/* ── Quick guide ──────────────────────────────── */}
        <FSCard tone="cream" pad={14}>
          <div className="eyebrow mb-3">Which card is right for you?</div>
          {[
            { type: "First international trip",   pick: "Niyo Global",  reason: "Free, instant, 0% forex — no risk" },
            { type: "Frequent flyer (4+ trips/yr)", pick: "Scapia",    reason: "Unlimited lounges + 10× rewards" },
            { type: "High domestic spend",          pick: "HDFC Regalia", reason: "VIAS lounge network is unmatched" },
            { type: "Business / miles collector",   pick: "Axis Atlas",  reason: "EDGE Miles → airline transfers" },
          ].map((r, i, arr) => (
            <div
              key={r.type}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px dashed var(--hairline)" : "none" }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-ink">{r.type}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "var(--ink-3)" }}>{r.reason}</div>
              </div>
              <div
                className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-[8px]"
                style={{ background: "var(--tint-saffron)", color: "var(--saffron-deep)" }}
              >
                {r.pick}
              </div>
            </div>
          ))}
        </FSCard>

      </div>
    </div>
  );
}
