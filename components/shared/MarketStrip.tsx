"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface QuoteItem {
  symbol:    string;
  name:      string;
  price:     number;
  changePct: number;
  change:    number;
  currency:  string;
}

interface MarketData {
  indices: QuoteItem[];
  gold:    QuoteItem[];
  forex:   QuoteItem[];
  stocks:  QuoteItem[];
  fetchedAt?: string;
}

function fmt(price: number, currency: string): string {
  if (currency === "INR") {
    if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)}L`;
    if (price >= 1_000)   return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    return `₹${price.toFixed(2)}`;
  }
  return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function displayName(symbol: string, name: string): string {
  const MAP: Record<string, string> = {
    "^NSEI":       "NIFTY 50",
    "^BSESN":      "SENSEX",
    "USDINR":      "USD/INR",
    "GOLD":        "Gold",
    "RELIANCE.NS": "Reliance",
    "HDFCBANK.NS": "HDFC Bank",
    "TCS.NS":      "TCS",
    "INFY.NS":     "Infosys",
  };
  return MAP[symbol] ?? name;
}

function Chip({ item }: { item: QuoteItem }) {
  const up = item.changePct >= 0;
  return (
    <div
      className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-[12px] border border-hairline"
      style={{ background: "var(--surface)" }}
    >
      <div>
        <div className="text-[10px] font-bold tracking-[0.04em]" style={{ color: "var(--ink-3)" }}>
          {displayName(item.symbol, item.name)}
        </div>
        <div className="text-[14px] font-bold tabular-nums" style={{ color: "var(--ink)" }}>
          {fmt(item.price, item.currency)}
        </div>
      </div>
      <div
        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[6px] text-[10px] font-bold"
        style={{
          background: up ? "var(--tint-green)" : "var(--tint-rose)",
          color:      up ? "var(--good-deep)"  : "var(--bad)",
        }}
      >
        {up
          ? <TrendingUp  size={9} strokeWidth={2.5} />
          : <TrendingDown size={9} strokeWidth={2.5} />
        }
        {Math.abs(item.changePct).toFixed(2)}%
      </div>
    </div>
  );
}

export function MarketStrip() {
  const [data,    setData]    = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [lastUpd, setLastUpd] = useState<string>("");

  async function load() {
    try {
      const res = await fetch("/api/market");
      if (!res.ok) throw new Error("failed");
      const json: MarketData = await res.json();
      setData(json);
      setError(false);
      setLastUpd(
        new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(id);
  }, []);

  const items: QuoteItem[] = data
    ? [...(data.indices ?? []), ...(data.gold ?? []), ...(data.forex ?? []), ...(data.stocks ?? [])]
    : [];

  if (error && !data) return null; // silent fail — don't break the page

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
          Live markets
        </span>
        <div className="flex items-center gap-1.5">
          {lastUpd && (
            <span className="text-[10px]" style={{ color: "var(--ink-3)" }}>
              {lastUpd}
            </span>
          )}
          <button
            onClick={load}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-3 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={10} strokeWidth={2} style={{ color: "var(--ink-3)" }} />
          </button>
        </div>
      </div>

      {/* Scrollable chips */}
      {loading && !data ? (
        /* skeleton */
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="shrink-0 w-28 h-[54px] rounded-[12px] animate-pulse"
              style={{ background: "var(--surface-3)" }}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-0.5 scrollbar-hide snap-x">
          {items.map(item => (
            <Chip key={item.symbol} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
