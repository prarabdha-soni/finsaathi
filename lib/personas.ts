/** Rahul Sharma — primary persona throughout FinSaathi v1 */
export const rahul = {
  name: "Rahul Sharma",
  firstName: "Rahul",
  age: 28,
  city: "Jaipur",
  profession: "Software Engineer",
  income: 65000,            // ₹/mo take-home
  memberSince: "Mar 2026",

  // Loans
  homeLoan: {
    outstanding: 2800000,   // ₹28L
    emiPerMonth: 24800,
    yearsLeft: 18,
    interestRate: 8.65,
    bank: "SBI",
  },
  personalLoan: null,

  // Dependents
  dependents: ["Spouse", "Child", "Parents (part)"],

  // Credit
  cibil: 694,
  cibilTier: "Fair",
  creditUtilisation: 0.267,
  latePaysIn2024: 1,
  creditCardLimit: 180000,
  creditCardBalance: 48000,

  // FinScore
  finScore: 61,
  finScoreDelta: 4, // vs last month
  finScoreGrade: "Building",
  finScorePeerAvg: 54,
  dimensions: {
    protection: { score: 38, weight: 25, hint: "Term ₹0 of ₹1.2 Cr · Health ₹5L employer only" },
    liquidity:  { score: 52, weight: 15, hint: "₹78K of ₹4L emergency target — 3.1 months" },
    investing:  { score: 64, weight: 25, hint: "3 SIPs · 73% small-cap — diversification weak" },
    credit:     { score: 71, weight: 20, hint: "CIBIL 694 · 26.7% utilisation · 1 late pay" },
    tax:        { score: 82, weight: 15, hint: "80C ₹1.38L of ₹1.5L · NPS not started" },
  },

  // Insurance gap
  recommendedTermCover: 12000000, // ₹1.2 Cr
  termCoverOwned: 0,
  termPremiumEstimate: 820,       // ₹/mo
  healthCover: 500000,            // ₹5L employer floater

  // Portfolio
  portfolioValue: 184320,
  portfolioDeltaToday: -4210,
  sipPerMonth: 31800,
  portfolioXIRR: 12.6,

  // Net worth
  netWorth: {
    assets: {
      equity:      184320,   // MF + stocks
      epf:         212000,
      ppf:          30000,
      gold:         54000,   // ~12g
      savings:     240000,   // bank savings
      property:   3200000,   // estimated home value
    },
    liabilities: {
      homeLoan:  2800000,
      creditCard:  48000,
    },
  },

  // Monthly cash flow
  cashFlow: {
    income:   65000,
    expenses: {
      emi:          24800,
      groceries:     8200,
      utilities:     3400,
      subscriptions: 1800,
      fuel:          3200,
      dining:        5600,
      other:         4000,
    },
    sips: 31800,
  },

  // Goals
  goals: [
    { id: "riya-college",  name: "Riya's college",    icon: "🎓", target: 2500000, have: 320000, by: "2038", monthly: 6800,  status: "On track"       as const, tone: "good"  as const },
    { id: "emergency",     name: "Emergency fund",    icon: "🛟", target: 400000,  have: 78000,  by: "Mar 26", monthly: 12000, status: "Behind · top up" as const, tone: "amber" as const },
    { id: "house",         name: "Home upgrade",      icon: "🏠", target: 1800000, have: 145000, by: "2032", monthly: 8500,  status: "Lagging"        as const, tone: "bad"   as const },
    { id: "retirement",    name: "Retirement (60)",   icon: "🌅", target: 35000000,have: 184000, by: "2058", monthly: 4500,  status: "On track"       as const, tone: "good"  as const },
  ],

  // Spending (last 30 days)
  spending: {
    total:    51000,
    topMerchants: [
      { name: "Swiggy / Zomato", amount: 4800, category: "Food" },
      { name: "Amazon",          amount: 3200, category: "Shopping" },
      { name: "Petrol",          amount: 3100, category: "Transport" },
      { name: "Netflix / Prime", amount: 1800, category: "Entertainment" },
    ],
    upiMonthly: 38000,
  },

  // Stocks & MF portfolio (breakdown of portfolioValue ₹1.84L)
  stocks: [
    { symbol: "RELIANCE",  name: "Reliance Inds",      qty: 8,   avg: 2760, ltp: 2948, exchange: "NSE" },
    { symbol: "HDFCBANK",  name: "HDFC Bank",           qty: 12,  avg: 1520, ltp: 1682, exchange: "NSE" },
    { symbol: "TCS",       name: "TCS",                 qty: 3,   avg: 3680, ltp: 3924, exchange: "NSE" },
    { symbol: "NIFTYBEES", name: "Nifty 50 ETF",        qty: 40,  avg: 238,  ltp: 261,  exchange: "NSE" },
    { symbol: "PPFAS",     name: "Parag Parikh Flexi",  qty: null, avg: null, ltp: null, mfUnits: 284.5, nav: 82.4, mfValue: 23442, isMF: true },
    { symbol: "MIRAEMERGE",name: "Mirae Emerging Blue", qty: null, avg: null, ltp: null, mfUnits: 194.2, nav: 120.6, mfValue: 23420, isMF: true },
  ],

  // Vehicle
  vehicle: {
    type: "Car",
    model: "Maruti Swift VXI",
    year: 2022,
    regNo: "RJ14-CX-4821",
    insurer: "HDFC ERGO",
    idv: 580000,
    premium: 8200,
    expiry: "28 Jun 2026",
    daysLeft: 29,
    type2: "Comprehensive",
  },

  // Tax
  epf: 78000,
  ppf: 30000,
  elss: 30000,
  limitSec80C: 150000,
  taxRegime: "New",
  npsContribution: 0,

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
  education: "MA Literature",
  income: 0,

  finScore: 23,
  finScoreGrade: "No safety net",
  finScoreDelta: 0,

  // Credit
  cibil: null,          // invisible — no file
  cibilTarget: 740,
  cibilTargetBy: "Feb 27",
  cibilStrategy: "Add as authorised user on Rahul's HDFC card",

  // Insurance
  termCover: 0,
  maxTermCoverAvailable: 5000000,  // ₹50L (housewife human life value)
  termPremiumBestPlan: 390,        // ₹/mo — HDFC Click2Protect
  healthCover: 1000000,            // ₹10L family floater (Rahul's employer)
  criticalIllnessCover: 0,

  // Assets
  ppfMonthly: 500,
  ppfBalance: 22000,
  goldValue: 180000,               // ~40g gold jewellery
  goldLoanCapacity: 230000,        // ₹2.3L on 40g gold

  // Stocks & savings portfolio
  stocks: [
    { symbol: "GOLDBEES",  name: "Nippon Gold ETF",     qty: 45,  avg: 54.2, ltp: 62.8, exchange: "NSE" },
    { symbol: "SGB2026",   name: "Sovereign Gold Bond", qty: null, avg: null, ltp: null, mfValue: 50000, isBond: true, coupon: "2.5%" },
  ],
  ppfMonthlyContrib: 500,

  // Nominee
  nomineeOn: 2,   // accounts where Pooja is nominee
  nomineeOf: 4,   // total Rahul accounts
  nomineeGap: "Not nominated on HDFC Savings & ELSS",

  // Key gaps shown in family hub
  gaps: [
    { id: "term",     label: "Term insurance",    status: "critical", detail: "₹0 cover · ₹50L available at ₹390/mo" },
    { id: "cibil",    label: "Credit identity",   status: "critical", detail: "No CIBIL file · can't get loans independently" },
    { id: "nominee",  label: "Nominee gaps",       status: "warning",  detail: "2 of 4 accounts missing Pooja as nominee" },
    { id: "income",   label: "Income source",      status: "info",     detail: "Gold ₹1.8L · PPF ₹22K · liquid if needed" },
  ],

  // Financial journey
  actions: [
    { done: false, label: "Buy ₹50L term cover",             impact: "Protects family in worst case",    cost: "₹390/mo" },
    { done: false, label: "Add to HDFC card as auth user",    impact: "CIBIL file starts in 3–6 months",  cost: "Free" },
    { done: false, label: "Update 2 nominee forms",           impact: "Legal clarity for your accounts",  cost: "15 min" },
    { done: true,  label: "Family floater health cover",      impact: "₹10L cover active",                cost: "Employer" },
  ],
};

/** Riya Sharma — daughter, age 4 */
export const riya = {
  name: "Riya Sharma",
  firstName: "Riya",
  age: 4,
  healthCover: 300000,       // ₹3L health rider (employer)

  // Education goal
  educationGoal: {
    targetYear: 2038,
    totalNeeded: 2500000,    // ₹25L (engineering / abroad)
    savedSoFar:   320000,
    monthlyRequired: 6800,
    sipFund: "Parag Parikh Flexi Cap",
    onTrack: true,
  },
};

/** Suresh & Mira Sharma — Rahul's parents */
export const parents = {
  name: "Suresh & Mira",
  firstName: "Suresh & Mira",
  age: 58,
  city: "Jaipur",
  profession: "Retired (father) · Homemaker (mother)",

  // Income
  pension: 18000,           // ₹/mo — father's govt pension
  fd: {
    value: 480000,          // ₹4.8L in FDs
    interestRate: 7.1,
    maturity: "Aug 2027",
  },
  ppf: 95000,               // PPF balance

  // Health
  healthCover: 500000,      // ₹5L own senior citizen health plan
  healthInsurer: "Star Health",
  healthPremium: 18400,     // ₹/yr

  // Credit
  cibil: 742,
  cibilTier: "Good",

  // Stocks portfolio (conservative / dividend-focused)
  stocks: [
    { symbol: "NTPC",   name: "NTPC",  qty: 100, avg: 340, ltp: 381, exchange: "NSE" },
    { symbol: "ITC",    name: "ITC",   qty: 200, avg: 390, ltp: 441, exchange: "NSE" },
    { symbol: "SBIN",   name: "SBI",   qty: 30,  avg: 780, ltp: 852, exchange: "NSE" },
  ],

  // Support from Rahul
  monthlySupport: 8000,     // Rahul sends ₹8K/mo

  // Risks
  risks: [
    { label: "Health cover", status: "ok",      detail: "₹5L Star Health active — renews Aug" },
    { label: "Monthly income", status: "ok",    detail: "₹18K pension + ₹8K from Rahul" },
    { label: "Critical illness", status: "gap", detail: "No CI cover — age 58 is ideal time" },
    { label: "Succession plan", status: "gap",  detail: "No will drafted yet" },
  ],
};

/** Household aggregate */
export const household = {
  finScore: 48,
  finScoreDrag: "Pooja",
  insurancePayout: 0,
  monthsSustainable: 3.1,

  // Net worth
  totalAssets:      4232320,  // sum of all family assets
  totalLiabilities: 2848000,  // loans + credit
  netWorth:         1384320,

  // Monthly cash flow
  monthlyIncome:    83000,    // Rahul 65K + parents pension 18K
  monthlyExpenses:  51000,
  monthlySavings:   32000,    // SIPs + PPF + savings

  // Insurance
  totalTermCover:         0,
  totalTermCoverNeeded:  17000000,   // Rahul 1.2Cr + Pooja 50L
  totalHealthCover:       1800000,   // family floater 10L + Riya 3L + parents 5L

  // Spending breakdown
  spendCategories: [
    { label: "EMI",           amount: 24800, pct: 49, color: "var(--bad)"    },
    { label: "Food & dining", amount: 13800, pct: 27, color: "var(--saffron)" },
    { label: "Utilities",     amount:  5200, pct: 10, color: "var(--caution)" },
    { label: "Shopping",      amount:  3200, pct:  6, color: "var(--indigo)"  },
    { label: "Other",         amount:  4000, pct:  8, color: "var(--ink-3)"   },
  ],
};
