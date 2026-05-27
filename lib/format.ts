/**
 * formatINR — Indian comma grouping: ₹1,38,000 not ₹138,000
 * Direct port of rupees() from the design prototype.
 */
export interface FormatOptions {
  sign?: boolean;
  abbreviate?: boolean;
  paise?: boolean;
}

export function formatINR(n: number | null | undefined, opts: FormatOptions = {}): string {
  const { sign = false, abbreviate = false, paise = false } = opts;
  if (n == null || isNaN(n)) return "—";

  const s = n < 0 ? "−" : sign ? "+" : "";
  const abs = Math.abs(n);

  if (abbreviate) {
    if (abs >= 1e7) return `${s}₹${(abs / 1e7).toFixed(abs >= 1e8 ? 1 : 2)} Cr`;
    if (abs >= 1e5) return `${s}₹${(abs / 1e5).toFixed(abs >= 1e6 ? 1 : 2)} L`;
    if (abs >= 1e3) return `${s}₹${(abs / 1e3).toFixed(0)}K`;
  }

  // Indian comma grouping: last 3 digits, then groups of 2
  const intPart = Math.floor(abs).toString();
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const formatted = rest ? `${restGrouped},${last3}` : last3;
  const dec = paise ? `.${(abs % 1).toFixed(2).slice(2)}` : "";

  return `${s}₹${formatted}${dec}`;
}
