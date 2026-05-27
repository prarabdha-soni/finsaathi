/** Rahul Sharma — primary persona throughout FinSaathi v1 */
export const rahul = {
  name: "Rahul Sharma",
  firstName: "Rahul",
  age: 28,
  city: "Jaipur",
  profession: "Software Engineer",
  income: 65000,            // ₹/mo
  memberSince: "Mar 2026",

  // Loans
  homeLoan: {
    outstanding: 2800000,   // ₹28L
    emiPerMonth: 24800,
    yearsLeft: 18,
  },

  // Dependents
  dependents: ["Spouse", "Child", "Parents (part)"],

  // Credit
  cibil: 694,
  cibilTier: "Fair",
  creditUtilisation: 0.47,
  latePaysIn2024: 3,

  // FinScore
  finScore: 61,
  finScoreDelta: 4, // vs last month
  finScoreGrade: "Building",
  finScorePeerAvg: 54,
  dimensions: {
    protection: { score: 38, weight: 25, hint: "Term ₹0 of ₹1.2 Cr · Health ₹5L employer" },
    liquidity:  { score: 52, weight: 15, hint: "₹78K of ₹4L emergency target" },
    investing:  { score: 64, weight: 25, hint: "3 SIPs · diversification weak" },
    credit:     { score: 71, weight: 20, hint: "694 score · 26% utilisation" },
    tax:        { score: 82, weight: 15, hint: "80C ₹1.38L of ₹1.5L" },
  },

  // Insurance gap
  recommendedTermCover: 12000000, // ₹1.2 Cr
  termCoverOwned: 0,
  termPremiumEstimate: 820,       // ₹/mo

  // Portfolio
  portfolioValue: 184320,
  portfolioDeltaToday: -4210,
  sipPerMonth: 31800,

  // Goals
  goals: [
    { id: "riya-college", name: "Riya's college", icon: "🎓", target: 2500000, have: 320000, by: "2038", monthly: 6800, status: "On track" as const, tone: "good" as const },
    { id: "emergency",    name: "Emergency fund", icon: "🛟", target: 400000,  have: 78000,  by: "Mar 26", monthly: 12000, status: "Behind · top up" as const, tone: "amber" as const },
    { id: "house",        name: "Own house upgrade", icon: "🏠", target: 1800000, have: 145000, by: "2032", monthly: 8500, status: "Lagging" as const, tone: "bad" as const },
    { id: "retirement",   name: "Retirement (60)", icon: "🌅", target: 35000000, have: 184000, by: "2058", monthly: 4500, status: "On track" as const, tone: "good" as const },
  ],

  // Tax
  epf: 78000,
  ppf: 30000,
  elss: 30000,
  limitSec80C: 150000,

  // Subscription
  plan: "Plus" as const,
  planRenews: "12 Mar 26",
  actionsToDate: 17,
  savedToDate: 42000,
  finScoreLift: 13,
};

/** Pooja Sharma — Rahul's wife, the Family flow's protagonist */
export const pooja = {
  name: "Pooja Sharma",
  firstName: "Pooja",
  age: 26,
  city: "Jaipur",
  profession: "Homemaker",
  education: "MA Lit",

  finScore: 23,
  finScoreGrade: "No safety net",

  // Gaps
  termCover: 0,
  maxTermCoverAvailable: 5000000,  // ₹50L
  termPremiumBestPlan: 390,        // ₹/mo (HDFC pick)
  cibil: null,  // invisible — no file
  cibilTarget: 740,
  cibilTargetBy: "Feb 27",

  // Other assets
  healthCover: 1000000,            // ₹10L family floater
  ppfMonthly: 500,
  goldLoanCapacity: 230000,        // ₹2.3L on 18g gold
  nomineeOn: 2,
  nomineeOf: 4,
};

/** Riya — daughter */
export const riya = {
  name: "Riya Sharma",
  age: 4,
  healthCover: 300000,  // ₹3L health rider (employer)
};

/** Suresh & Mira — parents */
export const parents = {
  name: "Suresh & Mira",
  age: 58,
  healthCover: 500000,  // ₹5L own senior health
  cibil: 742,
  cibilTier: "Good",
};

/** Household aggregate */
export const household = {
  finScore: 48,
  finScoreDrag: "Pooja",
  insurancePayout: 0,
  monthsSustainable: 3.1,
};
