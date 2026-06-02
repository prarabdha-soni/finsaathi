/**
 * Market data utilities — Yahoo Finance (unofficial) + MFAPI.in
 *
 * Yahoo Finance:  No API key required. Unofficial public endpoints.
 *                 Rate limit: generous but not guaranteed — we cache 5 min.
 * MFAPI.in:       Free Indian MF NAV API. No auth. Caches at 1 h (NAVs are EOD).
 */

export interface Quote {
  symbol:    string;
  name:      string;
  price:     number;
  prev:      number;
  change:    number;
  changePct: number;
  currency:  string;
}

export interface MFNav {
  schemeCode: number;
  schemeName: string;
  nav:        number;
  date:       string;
}

// ── Yahoo Finance quote ─────────────────────────────────────
export async function fetchQuote(symbol: string): Promise<Quote> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Gloww/1.0)" },
    next: { revalidate: 300 }, // 5-min server cache
  });

  if (!res.ok) throw new Error(`Yahoo Finance ${res.status} for ${symbol}`);

  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No data for ${symbol}`);

  const price = meta.regularMarketPrice as number;
  const prev  = meta.chartPreviousClose as number;

  return {
    symbol,
    name:      (meta.longName || meta.shortName || symbol) as string,
    price,
    prev,
    change:    price - prev,
    changePct: ((price - prev) / prev) * 100,
    currency:  (meta.currency || "INR") as string,
  };
}

// ── Batch fetch — runs in parallel ─────────────────────────
export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const results = await Promise.allSettled(symbols.map(fetchQuote));
  return results.flatMap(r => r.status === "fulfilled" ? [r.value] : []);
}

// ── MFAPI.in — Indian mutual fund NAVs ─────────────────────
export async function fetchMFNav(schemeCode: number): Promise<MFNav> {
  const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`, {
    next: { revalidate: 3600 }, // 1-hour cache — NAVs are end-of-day
  });

  if (!res.ok) throw new Error(`MFAPI ${res.status} for ${schemeCode}`);

  const json = await res.json();
  const latest = json.data?.[0];
  if (!latest) throw new Error(`No NAV data for ${schemeCode}`);

  return {
    schemeCode,
    schemeName: json.meta.scheme_name as string,
    nav:        parseFloat(latest.nav),
    date:       latest.date as string,
  };
}

export async function fetchMFNavs(codes: number[]): Promise<MFNav[]> {
  const results = await Promise.allSettled(codes.map(fetchMFNav));
  return results.flatMap(r => r.status === "fulfilled" ? [r.value] : []);
}

// ── Well-known scheme codes (MFAPI.in) ─────────────────────
export const MF_CODES = {
  paragParikhFlexiDirect:   122639,
  miraeLiquidGrowth:        107648,
  nipponNifty50:            113296,
  hdfcShortDuration:        119598, // HDFC Short Duration Fund - Growth
  elssParag:                122639, // same as Parag Parikh (Flexi Cap is also ELSS-comparable)
} as const;
