import Link from "next/link";
import { ChevronLeft, ChevronRight, TrendingUp, Zap, Info } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { formatINR } from "@/lib/format";
import { pooja }     from "@/lib/personas";

/* ── Gold ETF universe ──────────────────────────────────────
   Prices as of May 2026 · 1g gold ≈ ₹9,280 (domestic)
──────────────────────────────────────────────────────────── */
const ETFS = [
  {
    symbol:    "GOLDBEES",
    name:      "GoldBees",
    fullName:  "Nippon India Gold ETF",
    amc:       "Nippon India MF",
    price:     62.80,
    prevClose: 62.12,
    nav:       62.80,
    er:        0.59,
    aum:       9420,        // ₹ Cr
    ret1y:     18.4,
    ret3y:     13.2,
    units1g:   "~1/148 g",  // 1 unit ≈ 1/2 g gold approximately
    exchange:  "NSE",
    rank:      1,           // by AUM
    highlight: true,        // most liquid
  },
  {
    symbol:    "ICICIGOLD",
    name:      "ICICI Gold ETF",
    fullName:  "ICICI Pru Gold ETF",
    amc:       "ICICI Prudential MF",
    price:     64.80,
    prevClose: 64.08,
    nav:       64.80,
    er:        0.50,        // lowest ER
    aum:       4130,
    ret1y:     18.3,
    ret3y:     13.0,
    units1g:   "~1/143 g",
    exchange:  "NSE",
    rank:      2,
    highlight: false,
  },
  {
    symbol:    "HDFCMFGETF",
    name:      "HDFC Gold ETF",
    fullName:  "HDFC Gold Exchange Traded Fund",
    amc:       "HDFC Mutual Fund",
    price:     65.12,
    prevClose: 64.40,
    nav:       65.12,
    er:        0.59,
    aum:       3240,
    ret1y:     18.1,
    ret3y:     12.9,
    units1g:   "~1/142 g",
    exchange:  "NSE",
    rank:      3,
    highlight: false,
  },
  {
    symbol:    "SBIGETS",
    name:      "SBI Gold ETF",
    fullName:  "SBI Gold Exchange Traded Scheme",
    amc:       "SBI Funds Management",
    price:     63.45,
    prevClose: 62.74,
    nav:       63.45,
    er:        0.64,
    aum:       2830,
    ret1y:     18.5,        // slightly higher 1Y
    ret3y:     13.1,
    units1g:   "~1/146 g",
    exchange:  "NSE",
    rank:      4,
    highlight: false,
  },
  {
    symbol:    "KOTAKGOLD",
    name:      "Kotak Gold ETF",
    fullName:  "Kotak Gold Exchange Traded Fund",
    amc:       "Kotak Mahindra AMC",
    price:     62.95,
    prevClose: 62.24,
    nav:       62.95,
    er:        0.55,
    aum:       2110,
    ret1y:     18.2,
    ret3y:     13.0,
    units1g:   "~1/147 g",
    exchange:  "NSE",
    rank:      5,
    highlight: false,
  },
  {
    symbol:    "AXISGOLD",
    name:      "Axis Gold ETF",
    fullName:  "Axis Gold ETF",
    amc:       "Axis Mutual Fund",
    price:     63.20,
    prevClose: 62.50,
    nav:       63.20,
    er:        0.53,
    aum:       1230,
    ret1y:     18.0,
    ret3y:     12.8,
    units1g:   "~1/147 g",
    exchange:  "NSE",
    rank:      6,
    highlight: false,
  },
];

/* Pooja's existing holding — show badge on GoldBees */
const poojaHolding = pooja.stocks.find(s => s.symbol === "GOLDBEES");

/* Why ETF vs physical */
const ADVANTAGES = [
  { icon: "💸", title: "No making charges",    sub: "Jewellery costs 8–20% extra — ETF has none" },
  { icon: "📉", title: "Lower tax",             sub: "LTCG 12.5% after 2 yrs · physical gold = 20%" },
  { icon: "📲", title: "Real-time pricing",     sub: "Trades on NSE like a stock · buy/sell instantly" },
  { icon: "🔐", title: "No storage risk",       sub: "No locker fees · no theft risk · 99.5% pure" },
  { icon: "💰", title: "Start with ₹60",        sub: "1 unit ≈ ₹63 · accumulate slowly every month" },
];

/* Broker deep links (placeholder) */
const BROKERS = [
  { name: "Zerodha",  color: "#387ed1", bg: "rgba(56,126,209,0.1)"  },
  { name: "Groww",    color: "#00b386", bg: "rgba(0,179,134,0.1)"   },
  { name: "Upstox",   color: "#7c3aed", bg: "rgba(124,58,237,0.1)"  },
];

export default function GoldETFPage() {
  const minER  = Math.min(...ETFS.map(e => e.er));
  const maxAUM = Math.max(...ETFS.map(e => e.aum));

  return (
    <div className="pb-10" style={{ background: "var(--bg-app)" }}>
      <AppHeader
        title="Gold ETFs"
        subtitle="Compare · invest · track"
        leading={
          <Link href="/home">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-4">

        {/* ── Hero — gold price + rationale ─────────────── */}
        <div
          className="rounded-[20px] p-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 50%, #fde68a 100%)",
            border: "1.5px solid rgba(180,83,9,0.2)",
            boxShadow: "0 2px 16px -6px rgba(180,83,9,0.18)",
          }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 65%)" }} />
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase mb-1"
                  style={{ color: "#b45309" }}>
                  Gold · Domestic price
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-[32px] font-bold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                    ₹9,280
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: "var(--ink-3)" }}>/g</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp size={11} style={{ color: "#16a34a" }} strokeWidth={2.5} />
                  <span className="tnum text-[11px] font-bold" style={{ color: "#16a34a" }}>
                    +₹148 today · +18.4% this year
                  </span>
                </div>
              </div>
              <span className="text-[36px]">🥇</span>
            </div>

            <div
              className="p-3 rounded-[12px] text-[12px] leading-[1.5]"
              style={{ background: "rgba(180,83,9,0.08)", color: "#78350f" }}
            >
              <strong>Why Gold ETF?</strong> Same gold exposure, zero making charges, real-time
              NSE pricing — and LTCG tax is 12.5% after 2 years vs 20% on physical gold.
            </div>
          </div>
        </div>

        {/* ── Pooja already holds GoldBees ─────────────── */}
        {poojaHolding && poojaHolding.qty !== null && (
          <div
            className="flex items-center gap-3 p-3.5 rounded-[14px]"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <span className="text-[20px]">💜</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold" style={{ color: "var(--indigo)" }}>
                Pooja holds {poojaHolding.qty} units of GoldBees
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                Avg ₹{poojaHolding.avg} · LTP ₹{poojaHolding.ltp} · current ₹{formatINR(poojaHolding.qty * (poojaHolding.ltp ?? 0), { abbreviate: true })}
              </div>
            </div>
            <div className="tnum text-[12px] font-bold shrink-0" style={{ color: "#16a34a" }}>
              +{(((poojaHolding.ltp ?? 0) - (poojaHolding.avg ?? 0)) / (poojaHolding.avg ?? 1) * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {/* ── ETF comparison list ──────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">All Gold ETFs · {ETFS.length} funds</span>
            <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>
              <Info size={11} strokeWidth={2} />
              <span>Sorted by AUM</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {ETFS.map((etf) => {
              const dayChange    = etf.price - etf.prevClose;
              const dayChangePct = (dayChange / etf.prevClose) * 100;
              const isLowestER   = etf.er === minER;
              const isLargestAUM = etf.aum === maxAUM;
              const poojaOwns    = etf.symbol === poojaHolding?.symbol;

              return (
                <FSCard key={etf.symbol} tone="white" pad={14}>
                  {/* Top row */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Symbol badge */}
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center font-bold text-[10px] shrink-0 text-center leading-tight"
                      style={{ background: "rgba(254,240,138,0.4)", color: "#b45309" }}
                    >
                      {etf.symbol.slice(0, 4)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-bold text-ink">{etf.name}</span>
                        {etf.highlight && (
                          <Pill tone="good" size="sm">Most liquid</Pill>
                        )}
                        {isLowestER && (
                          <Pill tone="amber" size="sm">Lowest ER</Pill>
                        )}
                        {poojaOwns && (
                          <span
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(99,102,241,0.12)", color: "var(--indigo)" }}
                          >
                            Pooja holds
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>
                        {etf.amc} · {etf.exchange}
                      </div>
                    </div>

                    {/* Day change */}
                    <div className="text-right shrink-0">
                      <div className="tnum text-[15px] font-bold text-ink">₹{etf.price.toFixed(2)}</div>
                      <div
                        className="tnum text-[10px] font-semibold mt-0.5"
                        style={{ color: dayChange >= 0 ? "var(--good)" : "var(--bad)" }}
                      >
                        {dayChange >= 0 ? "+" : ""}{dayChange.toFixed(2)} ({dayChangePct.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  {/* Metrics row */}
                  <div
                    className="flex gap-0 rounded-[10px] overflow-hidden mb-3"
                    style={{ background: "var(--surface-3)" }}
                  >
                    {[
                      { label: "1Y return", value: `+${etf.ret1y}%`, good: true },
                      { label: "3Y return", value: `+${etf.ret3y}%`, good: true },
                      { label: "Exp ratio",  value: `${etf.er}%`,     good: false },
                      { label: "AUM",        value: `₹${(etf.aum / 100).toFixed(1)}K Cr`, good: false },
                    ].map((m, i, arr) => (
                      <div
                        key={m.label}
                        className="flex-1 py-2 text-center"
                        style={{ borderRight: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
                      >
                        <div
                          className="tnum text-[12px] font-bold"
                          style={{ color: m.good ? "var(--good)" : "var(--ink)" }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[9px] mt-0.5" style={{ color: "var(--ink-3)" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Invest via broker */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold" style={{ color: "var(--ink-3)" }}>Invest via:</span>
                    {BROKERS.map((b) => (
                      <button
                        key={b.name}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-[8px]"
                        style={{ background: b.bg, color: b.color }}
                      >
                        {b.name}
                      </button>
                    ))}
                    <ChevronRight size={13} className="ml-auto shrink-0" style={{ color: "var(--ink-3)" }} />
                  </div>
                </FSCard>
              );
            })}
          </div>
        </div>

        {/* ── Why ETF vs physical gold ─────────────────── */}
        <div>
          <div className="eyebrow mb-3">Why ETF beats physical gold</div>
          <FSCard tone="white" pad={14}>
            {ADVANTAGES.map((a, i, arr) => (
              <div
                key={a.title}
                className="flex items-start gap-3 py-2.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none" }}
              >
                <span className="text-[18px] shrink-0 mt-0.5">{a.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-ink">{a.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--ink-3)" }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </FSCard>
        </div>

        {/* ── SIP in Gold ETF nudge ───────────────────── */}
        <div
          className="flex items-start gap-3 p-4 rounded-[16px]"
          style={{
            background: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)",
            border: "1px solid rgba(180,83,9,0.18)",
          }}
        >
          <Zap size={18} strokeWidth={2} style={{ color: "#b45309", flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1">
            <div className="text-[13px] font-bold" style={{ color: "#78350f" }}>
              Start a ₹1,000/mo Gold SIP
            </div>
            <p className="text-[12px] mt-0.5 leading-[1.45]" style={{ color: "#92400e" }}>
              Rupee-cost average your gold — 76% of one-time investors panic sell.
              Monthly SIP removes the timing stress.
            </p>
          </div>
          <Link href="/invest/sip/gold"
            className="shrink-0 text-[12px] font-bold"
            style={{ color: "#b45309" }}>
            Set up →
          </Link>
        </div>

      </div>
    </div>
  );
}
