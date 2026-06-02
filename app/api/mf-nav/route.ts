/**
 * GET /api/mf-nav
 *
 * Returns latest NAVs for the funds shown in the Invest page.
 * Source: MFAPI.in — free, no auth, end-of-day NAVs.
 * Cache: 1 hour (NAVs update once daily after market close).
 */

import { NextResponse } from "next/server";
import { fetchMFNavs, MF_CODES } from "@/lib/market-data";

export const revalidate = 3600; // 1-hour ISR

const FUNDS = [
  { code: MF_CODES.paragParikhFlexiDirect, label: "Parag Parikh Flexi Cap",   sipId: "riya-college" },
  { code: MF_CODES.nipponNifty50,          label: "Nippon India Nifty 50",     sipId: "retirement"   },
  { code: MF_CODES.hdfcShortDuration,      label: "HDFC Short Duration",        sipId: "emergency"    },
  { code: MF_CODES.miraeLiquidGrowth,      label: "Mirae Asset Liquid",         sipId: "liquid"       },
];

export async function GET() {
  try {
    const navs = await fetchMFNavs(FUNDS.map(f => f.code));
    const byCode = Object.fromEntries(navs.map(n => [n.schemeCode, n]));

    const payload = FUNDS.map(f => ({
      sipId:      f.sipId,
      label:      f.label,
      schemeCode: f.code,
      nav:        byCode[f.code]?.nav   ?? null,
      date:       byCode[f.code]?.date  ?? null,
    }));

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" },
    });
  } catch (e) {
    console.error("MF NAV API error:", e);
    return NextResponse.json({ error: "NAV data unavailable" }, { status: 502 });
  }
}
