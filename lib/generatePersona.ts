/**
 * generatePersonaFromAnswers
 *
 * Takes the 8 onboarding answers and computes a full DynamicPersona:
 * FinScore + dimensions, SIPs, portfolio, goals, insurance gap,
 * credit, net-worth, and ranked recommendations.
 *
 * Deterministic — same inputs always produce the same output.
 * No randomness, no API calls.
 */

// ─────────────────────────────────────────────────────────────
// Public interfaces
// ─────────────────────────────────────────────────────────────

export interface OnboardingAnswers {
  age:           number;
  gender:        string;
  income:        number;       // monthly ₹ take-home
  dependents:    string[];
  loans:         number;       // total outstanding ₹
  health:        string;
  existingCover: string;
  city:          string;
}

type Tone = "good" | "amber" | "bad";

export interface DimRow {
  name:   string;
  v:      number;
  tone:   Tone;
  status: string;
}

export interface ActionRow {
  t:    string;   // title
  s:    string;   // subtitle
  mins: string;   // time estimate
}

export interface PersonaGoal {
  id:      string;
  name:    string;
  icon:    string;
  target:  number;
  have:    number;
  by:      string;
  monthly: number;
  status:  string;
  tone:    Tone;
}

export interface UrgentAction {
  tag:      string;   // eyebrow label
  headline: string;
  sub:      string;
  cta:      string;
  ctaHref:  string;
  whyHref:  string;
  kind:     "cover" | "liquidity" | "invest" | "credit" | "tax";
}

export interface DynamicPersona {
  // Identity
  name:      string;
  firstName: string;
  age:       number;
  city:      string;
  gender:    string;
  income:    number;

  // FinScore
  finScore:        number;
  finScoreGrade:   string;
  finScoreDelta:   number;
  finScorePeerAvg: number;

  // Credit
  cibil:      number;
  cibilTier:  string;

  // Insurance
  recommendedTermCover: number;
  termCoverOwned:       number;
  termPremiumEstimate:  number;
  coverGap:             number;

  // Portfolio
  portfolioValue:      number;
  portfolioDeltaToday: number;
  sipPerMonth:         number;

  // Loans
  emiPerMonth: number;

  // Goals
  goals:        PersonaGoal[];
  onTrackCount: number;

  // FinScore page
  dims: DimRow[];
  top3: ActionRow[];

  // Home page
  monthlyExpenses: number;
  urgentAction:    UrgentAction;

  // Net worth
  totalAssets:      number;
  totalLiabilities: number;
  netWorth:         number;
}

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function toneFn(v: number, goodThresh: number, ambThresh: number): Tone {
  if (v >= goodThresh) return "good";
  if (v >= ambThresh)  return "amber";
  return "bad";
}

// Short label helpers (no import needed, keeps file self-contained)
function fmtCr(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000)    return `₹${Math.round(n / 100_000)}L`;
  return `₹${Math.round(n / 1_000)}K`;
}
function fmtSmall(n: number): string {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)   return `₹${Math.round(n / 1_000)}K`;
  return `₹${n}`;
}
function round500(n: number)  { return Math.round(n / 500)  * 500;  }
function round1k(n: number)   { return Math.round(n / 1000) * 1000; }
function roundL(n: number)    { return Math.round(n / 100_000) * 100_000; }

// ── Name banks ───────────────────────────────────────────────

const M_FIRST  = ["Arjun", "Vikram", "Amit", "Nikhil", "Kunal", "Rohan", "Dev", "Prateek", "Ankur", "Sachin"];
const F_FIRST  = ["Priya", "Meera",  "Kavya", "Ananya", "Neha", "Shreya", "Divya", "Aditi", "Ruchi",  "Sonia"];
const SURNAMES: Record<string, string[]> = {
  mumbai:    ["Mehta",   "Shah",     "Joshi",    "Patil",      "Desai"],
  delhi:     ["Sharma",  "Gupta",    "Singh",    "Verma",      "Kapoor"],
  bengaluru: ["Rao",     "Kumar",    "Reddy",    "Nair",       "Menon"],
  jaipur:    ["Sharma",  "Agarwal",  "Gupta",    "Singhania",  "Maheshwari"],
  hyderabad: ["Reddy",   "Rao",      "Sharma",   "Patel",      "Chowdary"],
  chennai:   ["Iyer",    "Kumar",    "Rajan",    "Krishnan",   "Sundaram"],
  pune:      ["Joshi",   "Kulkarni", "Patil",    "Deshpande",  "Bhave"],
  ahmedabad: ["Shah",    "Patel",    "Mehta",    "Modi",       "Gandhi"],
  _default:  ["Sharma",  "Kumar",    "Singh",    "Patel",      "Verma"],
};

function pickName(age: number, income: number, gender: string, city: string) {
  const seed = (age + Math.floor(income / 10_000)) % 10;
  const firstName = (gender === "Female" ? F_FIRST : M_FIRST)[seed];
  const key = Object.keys(SURNAMES).find(k => city.toLowerCase().includes(k)) ?? "_default";
  const list = SURNAMES[key];
  const surname = list[Math.floor(income / 20_000) % list.length];
  return { firstName, name: `${firstName} ${surname}` };
}

// ── Existing cover → amount ──────────────────────────────────
function coverToAmt(ec: string): number {
  if (ec === "Under ₹25L")   return 1_500_000;
  if (ec === "₹25L – ₹1Cr") return 5_000_000;
  if (ec === "₹1Cr+")       return 12_500_000;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Main generator
// ─────────────────────────────────────────────────────────────

export function generatePersonaFromAnswers(a: OnboardingAnswers): DynamicPersona {
  const { age, gender, income, dependents, loans, health, existingCover, city } = a;

  // Guard
  const safeIncome = Math.max(income, 10_000);

  // ── Identity
  const { firstName, name } = pickName(age, safeIncome, gender, city);

  // ── Insurance gap
  const annualIncome    = safeIncome * 12;
  const recTermCover    = roundL(annualIncome * 15 + loans);
  const termCoverOwned  = coverToAmt(existingCover);
  const coverGap        = Math.max(0, recTermCover - termCoverOwned);

  const healthMult =
    health === "Heart condition" || health === "Multiple conditions" ? 1.4
    : health === "Diabetes"     || health === "Blood pressure"      ? 1.2
    : 1.0;

  const baseRatePerCr =
    gender === "Female"
      ? (age < 30 ? 550 : age < 40 ? 820 : 1_200)
      : (age < 30 ? 750 : age < 40 ? 1_100 : 1_600);

  const gapCr = Math.max(0.25, coverGap / 10_000_000);
  const termPremiumEstimate = round500(baseRatePerCr * gapCr * healthMult);

  // ── EMI
  const emiPerMonth = loans > 0 ? round1k(loans * 0.0085) : 0;
  const emiRatio    = emiPerMonth / safeIncome;

  // ── Helper flags
  const hasNoDeps   = dependents.length === 1 && dependents[0] === "No dependents yet";
  const hasSpouse   = dependents.some(d => d.includes("Spouse"));
  const hasChild    = dependents.some(d => d.includes("child") || d.includes("children"));
  const hasParents  = dependents.some(d => d.includes("parent"));
  const yearsWorking = Math.max(1, age - 22);

  // ════════════════════════════════════════════════════════════
  // 5 DIMENSION SCORES
  // ════════════════════════════════════════════════════════════

  // ── Protection (25%)
  const coverRatio = recTermCover > 0 ? termCoverOwned / recTermCover : 0;
  let protScore =
    coverRatio === 0  ? (hasNoDeps ? 45 : 25)
    : coverRatio < 0.3 ? 44
    : coverRatio < 0.7 ? 62
    : 78;
  if (health === "Heart condition" || health === "Multiple conditions") protScore -= 10;
  else if (health === "Diabetes"   || health === "Blood pressure")      protScore -= 5;
  protScore = clamp(protScore, 15, 90);

  // ── Liquidity (15%)
  let liquidScore: number;
  if      (income < 30_000 && age < 27)     liquidScore = 24;
  else if (emiRatio > 0.45)                  liquidScore = 30;
  else if (income < 50_000 && emiRatio > 0.35) liquidScore = 35;
  else if (age < 27)                         liquidScore = 38;
  else if (income < 60_000)                  liquidScore = 50;
  else if (income < 100_000)                 liquidScore = 58;
  else                                       liquidScore = 67;
  liquidScore = clamp(liquidScore, 15, 88);

  // ── Investing (25%)
  let investScore: number;
  if      (income < 30_000)                   investScore = 30;
  else if (income < 50_000 && age < 28)       investScore = 44;
  else if (income < 70_000)                   investScore = 55;
  else if (income < 120_000)                  investScore = 64;
  else                                        investScore = 71;
  if (age > 35 && income > 80_000) investScore += 5;
  if (age > 42)                    investScore += 3;
  investScore = clamp(investScore, 22, 86);

  // ── Credit (20%)
  let creditScore: number;
  if      (loans === 0)       creditScore = 74;
  else if (emiRatio < 0.30)   creditScore = 68;
  else if (emiRatio < 0.45)   creditScore = 60;
  else                        creditScore = 50;
  creditScore = clamp(creditScore, 25, 88);

  const cibil     = clamp(Math.round(580 + creditScore * 2.3), 510, 820);
  const cibilTier = cibil >= 750 ? "Good" : cibil >= 700 ? "Fair" : "Building";

  // ── Tax (15%)
  let taxScore: number;
  if      (income < 25_000)   taxScore = 88;
  else if (income < 50_000)   taxScore = 77;
  else if (income < 100_000)  taxScore = 64;
  else                        taxScore = 54;
  taxScore = clamp(taxScore, 28, 90);

  // ── Composite FinScore
  const finScore = clamp(
    Math.round(
      protScore  * 0.25 +
      liquidScore * 0.15 +
      investScore * 0.25 +
      creditScore * 0.20 +
      taxScore    * 0.15
    ),
    20, 88
  );

  const finScoreGrade =
    finScore >= 80 ? "Excellent"   :
    finScore >= 70 ? "Strong"      :
    finScore >= 60 ? "Building"    :
    finScore >= 50 ? "Developing"  :
    finScore >= 38 ? "Starting up" :
    "Needs help";

  const finScorePeerAvg = income > 100_000 ? 63 : income > 60_000 ? 57 : 51;
  const finScoreDelta   = clamp(Math.round((finScore - 48) / 5) + 2, 1, 8);

  // ════════════════════════════════════════════════════════════
  // PORTFOLIO
  // ════════════════════════════════════════════════════════════

  const sipPct       = income < 40_000 ? 0.15 : income < 70_000 ? 0.20 : income < 120_000 ? 0.22 : 0.25;
  const sipPerMonth  = round500(safeIncome * sipPct);
  const annualSIP    = sipPerMonth * 12;
  const growFactor   = yearsWorking < 3 ? 0.85 : yearsWorking < 7 ? 1.05 : 1.25;
  const portfolioValue = round1k(annualSIP * yearsWorking * growFactor);

  // Today's delta — small ± movement
  const deltaSign  = safeIncome > 80_000 ? -1 : 1;
  const deltaMag   = round1k(portfolioValue * (0.008 + (age % 5) * 0.003));
  const portfolioDeltaToday = deltaSign * deltaMag;

  // ════════════════════════════════════════════════════════════
  // MONTHLY EXPENSES & NET WORTH
  // ════════════════════════════════════════════════════════════

  const monthlyExpenses = round500(safeIncome * (0.60 + Math.min(emiRatio, 0.35)));

  const equityVal   = portfolioValue;
  const epfVal      = round1k(safeIncome * 12 * yearsWorking * 0.10);
  const goldVal     = hasSpouse ? 80_000 : 20_000;
  const savingsVal  = round1k(safeIncome * 2.5);
  const propertyVal = loans > 1_000_000 ? round1k(loans * 1.14) : 0;
  const totalAssets = equityVal + epfVal + goldVal + savingsVal + propertyVal;
  const totalLiabilities = loans + round1k(safeIncome * 0.18);
  const netWorth    = totalAssets - totalLiabilities;

  // ════════════════════════════════════════════════════════════
  // DIM ROWS
  // ════════════════════════════════════════════════════════════

  const dims: DimRow[] = [
    {
      name:   "Protection",
      v:      protScore,
      tone:   toneFn(protScore, 65, 45),
      status:
        protScore < 35 ? `Critical · ${fmtCr(coverGap)} gap`
        : protScore < 52 ? `Partial · ${fmtCr(coverGap)} still needed`
        : protScore < 70 ? `Partial cover · review plan`
        : "Covered · review annually",
    },
    {
      name:   "Liquidity",
      v:      liquidScore,
      tone:   toneFn(liquidScore, 60, 42),
      status:
        liquidScore < 32 ? "Critical · < 1 mo saved"
        : liquidScore < 46 ? "Thin · 1–2 mo expenses"
        : liquidScore < 62 ? "~2–3 mo saved · target 6"
        : "Solid · 4+ mo emergency fund",
    },
    {
      name:   "Investing",
      v:      investScore,
      tone:   toneFn(investScore, 62, 44),
      status:
        investScore < 35 ? "Not yet investing"
        : investScore < 52 ? "Starting SIPs · grow steadily"
        : investScore < 66 ? "Active SIPs · diversify mix"
        : "Strong SIP discipline",
    },
    {
      name:   "Credit",
      v:      creditScore,
      tone:   toneFn(creditScore, 68, 52),
      status: `${cibil} · ${cibilTier}${loans > 0 ? ` · EMI ${Math.round(emiRatio * 100)}% income` : " · Debt free"}`,
    },
    {
      name:   "Tax",
      v:      taxScore,
      tone:   toneFn(taxScore, 72, 55),
      status:
        income < 30_000    ? "Below bracket · all clear"
        : taxScore >= 75   ? "80C well utilised"
        : taxScore >= 60   ? "80C partially used"
        : "80C + NPS room available",
    },
  ];

  // ════════════════════════════════════════════════════════════
  // TOP-3 RECOMMENDATIONS
  // ════════════════════════════════════════════════════════════

  const sortedDims = [...dims].sort((a, b) => a.v - b.v);
  const top3: ActionRow[] = [];

  const ACTION_POOL: Record<string, () => ActionRow | null> = {
    Protection: () =>
      coverGap > 0
        ? { t: `Get ${fmtCr(coverGap)} term cover`,  s: `Lifts Protection by ~${Math.round((100 - protScore) * 0.36)} pts`, mins: "4 min" }
        : null,
    Liquidity: () => ({
      t: "Grow emergency fund to 6 months",
      s: `${fmtSmall(Math.round(safeIncome * 4 / 1000) * 1000)} gap · auto-SIP suggested`,
      mins: "2 min",
    }),
    Investing: () =>
      income < 40_000
        ? { t: "Start ₹1,000/mo Nifty index SIP", s: "₹1K/mo → ₹8L in 20 yrs at 12% CAGR", mins: "3 min" }
        : { t: "Diversify to 3-fund portfolio",   s: "+2.1% projected CAGR improvement",     mins: "5 min" },
    Credit: () => ({
      t: "Reduce credit utilisation to 20%",
      s: `CIBIL can jump 30–50 pts in 90 days`,
      mins: "5 min",
    }),
    Tax: () =>
      income < 30_000
        ? null
        : {
            t: "Max out your 80C limit",
            s: income < 60_000 ? "Save ~₹15K in taxes this year" : "Save ~₹45K in taxes this year",
            mins: "6 min",
          },
  };

  for (const dim of sortedDims) {
    if (top3.length >= 3) break;
    const action = ACTION_POOL[dim.name]?.();
    if (action) top3.push(action);
  }

  // Fillers if < 3
  const fillers: ActionRow[] = [
    { t: "Enable account aggregator",    s: "Full picture — bank + MF in one view", mins: "1 min"  },
    { t: "Add nominee to all accounts",  s: "15 min of peace of mind for family",   mins: "15 min" },
    { t: "Set up SIP auto-pay on 1st",   s: "Never miss a SIP — remove friction",   mins: "2 min"  },
  ];
  for (const f of fillers) {
    if (top3.length >= 3) break;
    if (!top3.some(a => a.t === f.t)) top3.push(f);
  }

  // ════════════════════════════════════════════════════════════
  // GOALS
  // ════════════════════════════════════════════════════════════

  const goals: PersonaGoal[] = [];

  // Emergency fund (always)
  const emergTarget = round1k(safeIncome * 6);
  const emergHave =
    liquidScore < 34  ? round1k(safeIncome * 0.7)
    : liquidScore < 50 ? round1k(safeIncome * 2.0)
    : round1k(safeIncome * 3.5);
  goals.push({
    id: "emergency", name: "Emergency fund", icon: "🛟",
    target: emergTarget, have: Math.min(emergHave, emergTarget),
    by: "Dec 26",
    monthly: round500(sipPerMonth * 0.30),
    status: emergHave >= emergTarget * 0.75 ? "On track" : emergHave >= emergTarget * 0.35 ? "Behind · top up" : "Critical · start",
    tone:   emergHave >= emergTarget * 0.75 ? "good"     : emergHave >= emergTarget * 0.35 ? "amber"           : "bad",
  });

  // Retirement (always)
  const retireTarget = round1k(annualIncome * 22);
  const retireHave   = round1k(annualSIP * Math.max(1, yearsWorking - 2) * 0.32);
  goals.push({
    id: "retirement", name: "Retirement (60)", icon: "🌅",
    target: retireTarget,
    have:   Math.min(retireHave, retireTarget),
    by: `${2026 + Math.max(18, 60 - age)}`,
    monthly: round500(sipPerMonth * 0.28),
    status: "On track",
    tone:   "good",
  });

  // Child education
  if (hasChild) {
    const eduTarget = 2_500_000;
    const eduHave   = round1k(annualSIP * Math.max(0, yearsWorking - 3) * 0.22);
    goals.push({
      id: "education", name: "Child's education", icon: "🎓",
      target: eduTarget, have: Math.min(eduHave, eduTarget),
      by: `${2026 + 16}`,
      monthly: round500(sipPerMonth * 0.22),
      status: eduHave > eduTarget * 0.08 ? "On track" : "Building",
      tone:   eduHave > eduTarget * 0.08 ? "good"     : "amber",
    });
  }

  // Home goal (if no large existing loan + has spouse)
  if (hasSpouse && loans < 500_000) {
    const homeTarget = safeIncome < 60_000 ? 4_500_000 : 8_000_000;
    const homeHave   = round1k(savingsVal * 0.35);
    goals.push({
      id: "house", name: "Dream home", icon: "🏠",
      target: homeTarget, have: homeHave,
      by: "2032",
      monthly: round500(sipPerMonth * 0.20),
      status: "Lagging",
      tone:   "bad",
    });
  }

  // Parents health fund
  if (hasParents) {
    goals.push({
      id: "parents-health", name: "Parents health fund", icon: "🏥",
      target: 500_000, have: round1k(safeIncome * 1.5),
      by: "Ongoing",
      monthly: round500(safeIncome * 0.05),
      status: "Active",
      tone:   "amber",
    });
  }

  const onTrackCount = goals.filter(g => g.tone === "good").length;

  // ════════════════════════════════════════════════════════════
  // URGENT ACTION (for home page hero)
  // ════════════════════════════════════════════════════════════

  let urgentAction: UrgentAction;

  if (coverGap > 500_000) {
    const coverStr  = fmtCr(recTermCover);
    const ownedStr  = termCoverOwned === 0 ? "zero" : `only ${fmtCr(termCoverOwned)}`;
    const depsText  = hasChild  ? "Spouse, child & loans sit unprotected."
                    : hasSpouse ? "Your spouse depends on your income."
                    : hasParents ? "Your parents have no fallback if you're gone."
                    : "Your dependents have no safety net.";
    urgentAction = {
      tag:     "INSURANCE GAP",
      headline: `You need ${coverStr} term cover. You have ${ownedStr}.`,
      sub:     `${depsText} Est. ₹${termPremiumEstimate}/mo.`,
      cta:     "See 3 best-fit plans",
      ctaHref: "/insurance/plans",
      whyHref: "/insurance",
      kind:    "cover",
    };
  } else if (liquidScore < 38) {
    urgentAction = {
      tag:     "EMERGENCY FUND",
      headline: "Emergency fund is critically low.",
      sub:     `Less than 1 month of expenses saved. An auto-SIP of ${fmtSmall(round500(safeIncome * 0.15))}/mo closes the gap in 12 months.`,
      cta:     "Set up auto-SIP",
      ctaHref: "/invest",
      whyHref: "/insights",
      kind:    "liquidity",
    };
  } else if (investScore < 40) {
    urgentAction = {
      tag:     "WEALTH BUILDING",
      headline: "You haven't started investing yet.",
      sub:     `A ₹1,000/mo index SIP at 12% becomes ₹8L in 20 years. Best time to start: today.`,
      cta:     "Start my first SIP",
      ctaHref: "/invest",
      whyHref: "/insights",
      kind:    "invest",
    };
  } else if (creditScore < 52) {
    urgentAction = {
      tag:     "CREDIT HEALTH",
      headline: `CIBIL ${cibil} is limiting your options.`,
      sub:     `High EMI ratio (${Math.round(emiRatio * 100)}% of income) hurts your score. 3 quick fixes can add 40+ pts.`,
      cta:     "Fix my credit",
      ctaHref: "/credit",
      whyHref: "/insights",
      kind:    "credit",
    };
  } else {
    // Catch-all: weakest dim
    const weakest = sortedDims[0];
    urgentAction = {
      tag:     "TOP PRIORITY",
      headline: top3[0].t,
      sub:     top3[0].s,
      cta:     "Show me how",
      ctaHref: "/insights",
      whyHref: "/insights",
      kind:    "tax",
    };
  }

  return {
    name, firstName, age, city, gender, income: safeIncome,
    finScore, finScoreGrade, finScoreDelta, finScorePeerAvg,
    cibil, cibilTier,
    recommendedTermCover: recTermCover,
    termCoverOwned, termPremiumEstimate, coverGap,
    portfolioValue, portfolioDeltaToday, sipPerMonth,
    emiPerMonth,
    goals, onTrackCount,
    dims, top3,
    monthlyExpenses, urgentAction,
    totalAssets, totalLiabilities, netWorth,
  };
}
