/**
 * GET /api/market
 *
 * Returns live data for:
 *  - Indices:  Nifty 50, Sensex
 *  - Forex:    USD/INR
 *  - Gold:     MCX Gold proxy via GC=F (USD/oz) converted to INR/10g
 *  - Stocks:   RELIANCE, HDFCBANK, TCS, INFY (NSE)
 *
 * Sources: Yahoo Finance (no API key required)
 * Cache:   5 minutes (Next.js fetch revalidation)
 */

import { NextResponse } from "next/server";
import { fetchQuotes, type Quote } from "@/lib/market-data";

export const revalidate = 300; // 5-min ISR cache on the route itself

const SYMBOLS = {
  indices: ["^NSEI", "^BSESN"],
  forex:   ["USDINR=X"],
  gold:    ["GC=F"],          // USD per troy oz — we convert
  stocks:  ["RELIANCE.NS", "HDFCBANK.NS", "TCS.NS", "INFY.NS"],
};

function formatGold(goldUSD: Quote, usdInr: Quote) {
  const inrPerOz  = goldUSD.price * usdInr.price;
  const inrPer10g = (inrPerOz / 31.1035) * 10; // troy oz → grams
  const prevInrPer10g = (goldUSD.prev * usdInr.prev / 31.1035) * 10;
  const change    = inrPer10g - prevInrPer10g;
  return {
    symbol:    "GOLD",
    name:      "Gold (10g)",
    price:     Math.round(inrPer10g),
    prev:      Math.round(prevInrPer10g),
    change:    Math.round(change),
    changePct: (change / prevInrPer10g) * 100,
    currency:  "INR",
  };
}

export async function GET() {
  try {
    const allSymbols = [
      ...SYMBOLS.indices,
      ...SYMBOLS.forex,
      ...SYMBOLS.gold,
      ...SYMBOLS.stocks,
    ];

    const quotes = await fetchQuotes(allSymbols);
    const bySymbol = Object.fromEntries(quotes.map(q => [q.symbol, q]));

    const usdInr = bySymbol["USDINR=X"];
    const goldUSD = bySymbol["GC=F"];

    const payload = {
      indices: [bySymbol["^NSEI"], bySymbol["^BSESN"]].filter(Boolean),
      gold:    usdInr && goldUSD ? [formatGold(goldUSD, usdInr)] : [],
      forex:   usdInr ? [{
        ...usdInr,
        name: "USD / INR",
        symbol: "USDINR",
      }] : [],
      stocks: SYMBOLS.stocks.map(s => bySymbol[s]).filter(Boolean),
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (e) {
    console.error("Market API error:", e);
    return NextResponse.json({ error: "Market data unavailable" }, { status: 502 });
  }
}
