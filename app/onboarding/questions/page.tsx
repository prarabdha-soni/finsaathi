"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, MapPin } from "lucide-react";

// Design tokens — dark navy theme
const T = {
  bg:             "#0a0f1a",
  bgCard:         "rgba(255,255,255,0.04)",
  bgSelected:     "rgba(0,212,170,0.08)",
  border:         "rgba(255,255,255,0.08)",
  borderSelected: "#00d4aa",
  teal:           "#00d4aa",
  blue:           "#0099ff",
  purple:         "#a78bfa",
  white:          "#ffffff",
  muted:          "#94a3b8",
  hint:           "#4e6080",
  sora:           "var(--font-sora)",
} as const;

// Phase config
const PHASES = [
  { id: "PROFILE",     steps: [1, 2, 3],          color: T.blue   },
  { id: "FINANCES",    steps: [4, 5, 6, 7, 8, 9], color: T.teal   },
  { id: "PREFERENCES", steps: [10, 11, 12],        color: T.purple },
] as const;

function getPhase(step: number) {
  return PHASES.find((p) => (p.steps as readonly number[]).includes(step)) ?? PHASES[0];
}

// Answers state
interface Answers {
  age: string;
  gender: string;
  smoker: string;
  income: number;
  dependents: string[];
  hasLoans: boolean;
  loanAmount: number;
  health: string;
  occupation: string;
  existingCover: string;
  pinCode: string;
  city: string;
  state: string;
  policyTerm: string;
  payoutType: string;
}

const DEFAULTS: Answers = {
  age:           "26–30",
  gender:        "Male",
  smoker:        "Non-smoker",
  income:        600000,
  dependents:    ["Spouse / Partner", "1 child"],
  hasLoans:      true,
  loanAmount:    2000000,
  health:        "Healthy",
  occupation:    "Salaried professional",
  existingCover: "No cover at all",
  pinCode:       "302001",
  city:          "Jaipur",
  state:         "Rajasthan",
  policyTerm:    "30 years",
  payoutType:    "Lump sum",
};

function rupee(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)} lakh`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

// Chip component
function Chip({
  label, sub, emoji, selected, onClick, multi,
}: {
  label: string; sub?: string; emoji?: string;
  selected: boolean; onClick: () => void; multi?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 4, padding: "14px 14px 14px 14px",
        borderRadius: 16, textAlign: "left", width: "100%",
        border: `1.5px solid ${selected ? T.borderSelected : T.border}`,
        background: selected ? T.bgSelected : T.bgCard,
        boxShadow: selected ? `0 0 0 1px ${T.teal}30, 0 0 18px ${T.teal}20` : "none",
        cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {multi && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 20, height: 20, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: selected ? T.teal : "transparent",
          border: `1.5px solid ${selected ? T.teal : "rgba(255,255,255,0.18)"}`,
          flexShrink: 0,
        }}>
          {selected && <Check size={11} strokeWidth={3} color="#000" />}
        </div>
      )}
      {emoji && <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>}
      <span style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: T.hint }}>{sub}</span>}
    </button>
  );
}

// Large card (gender / smoker / payout)
function BigCard({
  emoji, title, sub1, sub2, selected, onClick,
}: {
  emoji: string; title: string; sub1?: string; sub2?: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 8, padding: "24px 12px",
        borderRadius: 20, minHeight: 150,
        border: `1.5px solid ${selected ? T.borderSelected : T.border}`,
        background: selected ? T.bgSelected : T.bgCard,
        boxShadow: selected ? `0 0 0 1px ${T.teal}30, 0 0 22px ${T.teal}22` : "none",
        cursor: "pointer", transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 36 }}>{emoji}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: T.white }}>{title}</span>
      {sub1 && <span style={{ fontSize: 11, color: T.hint, textAlign: "center" }}>{sub1}</span>}
      {sub2 && <span style={{ fontSize: 11, color: T.muted, textAlign: "center" }}>{sub2}</span>}
    </button>
  );
}

// Step shell — headline + hint + children
function StepShell({
  headline, hint, children,
}: {
  headline: string; hint: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{
          fontSize: 26, fontWeight: 700, color: T.white,
          lineHeight: 1.2, fontFamily: T.sora, margin: 0,
        }}>
          {headline}
        </h2>
        <p style={{ fontSize: 13, color: T.hint, marginTop: 8, lineHeight: 1.5 }}>
          {hint}
        </p>
      </div>
      {children}
    </div>
  );
}

// Main form
function QuestionsForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const step         = Math.max(1, Math.min(12, Number(searchParams.get("step") ?? "1")));
  const [ans, setAns] = useState<Answers>(DEFAULTS);

  const phase    = getPhase(step);
  const progress = (step / 12) * 100;

  const isValid = (): boolean => {
    if (step === 1)  return !!ans.age;
    if (step === 2)  return !!ans.gender;
    if (step === 3)  return !!ans.smoker;
    if (step === 4)  return ans.income > 0;
    if (step === 5)  return ans.dependents.length > 0;
    if (step === 6)  return true;
    if (step === 7)  return !!ans.health;
    if (step === 8)  return !!ans.occupation;
    if (step === 9)  return !!ans.existingCover;
    if (step === 10) return ans.pinCode.length === 6;
    if (step === 11) return !!ans.policyTerm;
    if (step === 12) return !!ans.payoutType;
    return false;
  };

  const next = () => {
    if (!isValid()) return;
    if (step < 12) router.push(`/onboarding/questions?step=${step + 1}`);
    else router.push("/onboarding/finscore");
  };

  const back = () => {
    if (step > 1) router.push(`/onboarding/questions?step=${step - 1}`);
    else router.push("/onboarding/welcome");
  };

  const toggleDep = (id: string) =>
    setAns((a) => ({
      ...a,
      dependents: a.dependents.includes(id)
        ? a.dependents.filter((d) => d !== id)
        : [...a.dependents, id],
    }));

  function renderStep() {
    switch (step) {

      /* ── STEP 1 — Age ─────────────────────────── */
      case 1:
        return (
          <StepShell headline="How old are you?"
            hint="Every year you wait adds 4–8% to your premium">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["18–25","26–30","31–35","36–40","41–45","46+"].map((o) => (
                <Chip key={o} label={o} selected={ans.age === o}
                  onClick={() => setAns((a) => ({ ...a, age: o }))} />
              ))}
            </div>
          </StepShell>
        );

      /* ── STEP 2 — Gender ──────────────────────── */
      case 2:
        return (
          <StepShell headline="What is your gender?"
            hint="Women get 10–15% lower premiums due to higher life expectancy">
            <div style={{ display: "flex", gap: 12 }}>
              <BigCard emoji="👨" title="Male" selected={ans.gender === "Male"}
                onClick={() => setAns((a) => ({ ...a, gender: "Male" }))} />
              <BigCard emoji="👩" title="Female" selected={ans.gender === "Female"}
                onClick={() => setAns((a) => ({ ...a, gender: "Female" }))} />
            </div>
          </StepShell>
        );

      /* ── STEP 3 — Smoker ──────────────────────── */
      case 3:
        return (
          <StepShell headline="Do you smoke or use tobacco?"
            hint="Smokers pay 40–80% more. Be honest — insurers verify at claim time">
            <div style={{ display: "flex", gap: 12 }}>
              <BigCard emoji="🌿" title="Non-smoker" sub1="Never or quit 12+ months ago"
                selected={ans.smoker === "Non-smoker"}
                onClick={() => setAns((a) => ({ ...a, smoker: "Non-smoker" }))} />
              <BigCard emoji="🚬" title="Smoker" sub1="Current or recent use"
                selected={ans.smoker === "Smoker"}
                onClick={() => setAns((a) => ({ ...a, smoker: "Smoker" }))} />
            </div>
          </StepShell>
        );

      /* ── STEP 4 — Income ──────────────────────── */
      case 4:
        return (
          <StepShell headline="What is your annual income?"
            hint="Determines how many years of income your cover must replace">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "28px 16px", borderRadius: 20,
                background: T.bgCard, border: `1.5px solid ${T.border}`,
              }}>
                <span style={{
                  fontSize: 48, fontWeight: 800, color: T.teal,
                  fontFamily: T.sora, lineHeight: 1,
                }}>
                  {rupee(ans.income)}
                </span>
                <span style={{ fontSize: 13, color: T.hint, marginTop: 8 }}>per year</span>
              </div>
              <input type="range" min={200000} max={10000000} step={100000}
                value={ans.income}
                onChange={(e) => setAns((a) => ({ ...a, income: Number(e.target.value) }))}
                style={{ accentColor: T.teal, width: "100%", cursor: "pointer", height: 4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.hint }}>
                <span>₹2 lakh</span><span>₹1 Cr+</span>
              </div>
            </div>
          </StepShell>
        );

      /* ── STEP 5 — Dependents ──────────────────── */
      case 5:
        return (
          <StepShell headline="Who financially depends on you?"
            hint="Select all that apply">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "Spouse / Partner",  emoji: "💑", sub: "Primary breadwinner"  },
                { id: "1 child",           emoji: "👶", sub: "Under 18 years"        },
                { id: "2+ children",       emoji: "👨‍👧‍👦", sub: "Under 18 years"       },
                { id: "Dependent parents", emoji: "👴", sub: "No pension / income"   },
                { id: "No dependents yet", emoji: "🧑", sub: "Planning ahead"        },
              ].map((d) => (
                <Chip key={d.id} label={d.id} sub={d.sub} emoji={d.emoji}
                  selected={ans.dependents.includes(d.id)}
                  onClick={() => toggleDep(d.id)} multi />
              ))}
            </div>
          </StepShell>
        );

      /* ── STEP 6 — Loans ───────────────────────── */
      case 6:
        return (
          <StepShell headline="What is your total outstanding loan amount?"
            hint="Any debt your family would inherit — home, car, personal loans">
            <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
              <Chip label="✨  Debt free" selected={!ans.hasLoans}
                onClick={() => setAns((a) => ({ ...a, hasLoans: false }))} />
              <Chip label="🏠  Yes, I have loans" selected={ans.hasLoans}
                onClick={() => setAns((a) => ({ ...a, hasLoans: true }))} />
            </div>
            {ans.hasLoans && (
              <div style={{
                display: "flex", flexDirection: "column", gap: 14,
                padding: "20px 16px", borderRadius: 20,
                background: T.bgCard, border: `1.5px solid ${T.border}`,
              }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: 42, fontWeight: 800, color: T.teal,
                    fontFamily: T.sora, lineHeight: 1,
                  }}>
                    {rupee(ans.loanAmount)}
                  </span>
                </div>
                <input type="range" min={100000} max={20000000} step={100000}
                  value={ans.loanAmount}
                  onChange={(e) => setAns((a) => ({ ...a, loanAmount: Number(e.target.value) }))}
                  style={{ accentColor: T.teal, width: "100%", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.hint }}>
                  <span>₹1 lakh</span><span>₹2 Cr+</span>
                </div>
              </div>
            )}
          </StepShell>
        );

      /* ── STEP 7 — Health ──────────────────────── */
      case 7:
        return (
          <StepShell headline="Any pre-existing health conditions?"
            hint="Honesty protects your family's claim">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "Healthy",             emoji: "💪", sub: "No major conditions"     },
                { id: "Diabetes",            emoji: "🩸", sub: "Type 1 or Type 2"        },
                { id: "Blood pressure",      emoji: "💊", sub: "Hypertension, controlled" },
                { id: "Heart condition",     emoji: "❤️", sub: "Past or current"          },
                { id: "Other condition",     emoji: "🏥", sub: "Cancer, kidney, etc."     },
                { id: "Multiple conditions", emoji: "📋", sub: ""                         },
              ].map((h) => (
                <Chip key={h.id} label={h.id} sub={h.sub} emoji={h.emoji}
                  selected={ans.health === h.id}
                  onClick={() => setAns((a) => ({ ...a, health: h.id }))} />
              ))}
            </div>
          </StepShell>
        );

      /* ── STEP 8 — Occupation ──────────────────── */
      case 8:
        return (
          <StepShell headline="What is your occupation type?"
            hint="High-risk jobs attract 20–50% premium loading">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "Salaried professional", emoji: "💼", sub: "Office / desk job"              },
                { id: "Business owner",        emoji: "🏪", sub: "Self-employed"                  },
                { id: "High-risk job",         emoji: "⚠️", sub: "Mining, construction, defence"  },
                { id: "Other",                 emoji: "🧑‍🎓", sub: "Student"                         },
              ].map((o) => (
                <Chip key={o.id} label={o.id} sub={o.sub} emoji={o.emoji}
                  selected={ans.occupation === o.id}
                  onClick={() => setAns((a) => ({ ...a, occupation: o.id }))} />
              ))}
            </div>
          </StepShell>
        );

      /* ── STEP 9 — Existing Cover ──────────────── */
      case 9:
        return (
          <StepShell headline="Do you already have life insurance?"
            hint="We'll deduct this from your recommended cover">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "No cover at all",  emoji: "0️⃣", sub: ""                   },
                { id: "Under ₹25 lakh",  emoji: "🔒", sub: "Employer basic only" },
                { id: "₹25L – ₹1Cr",    emoji: "🛡️", sub: ""                   },
                { id: "₹1Cr+",           emoji: "💎", sub: ""                   },
              ].map((c) => (
                <Chip key={c.id} label={c.id} sub={c.sub} emoji={c.emoji}
                  selected={ans.existingCover === c.id}
                  onClick={() => setAns((a) => ({ ...a, existingCover: c.id }))} />
              ))}
            </div>
          </StepShell>
        );

      /* ── STEP 10 — Location ───────────────────── */
      case 10: {
        const pinOk = ans.pinCode.length === 6;
        return (
          <StepShell headline="Where are you located?"
            hint="For agent assignment and regional plan availability">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* PIN row */}
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text" maxLength={6} inputMode="numeric"
                  value={ans.pinCode}
                  onChange={(e) => setAns((a) => ({ ...a, pinCode: e.target.value.replace(/\D/g, "") }))}
                  placeholder="PIN code"
                  style={{
                    flex: 1, background: T.bgCard,
                    border: `1.5px solid ${pinOk ? T.teal : T.border}`,
                    borderRadius: 12, padding: "13px 16px",
                    color: T.white, fontSize: 15, fontWeight: 600,
                    outline: "none", fontFamily: T.sora,
                  }}
                />
                <button style={{
                  padding: "0 18px", borderRadius: 12, whiteSpace: "nowrap",
                  background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                  color: "#000", fontSize: 13, fontWeight: 700,
                  border: "none", cursor: "pointer",
                }}>
                  Look up →
                </button>
              </div>

              {/* Confirmation */}
              {pinOk && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderRadius: 12,
                  background: "rgba(0,212,170,0.1)",
                  border: `1px solid ${T.teal}45`,
                }}>
                  <MapPin size={14} style={{ color: T.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.teal, fontWeight: 600 }}>
                    Found: {ans.city}, {ans.state} — plans available
                  </span>
                </div>
              )}

              {/* City / State */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(["city", "state"] as const).map((key) => (
                  <div key={key}>
                    <label style={{
                      fontSize: 11, color: T.hint, display: "block",
                      marginBottom: 6, textTransform: "capitalize",
                    }}>
                      {key}
                    </label>
                    <input
                      value={ans[key]}
                      onChange={(e) => setAns((a) => ({ ...a, [key]: e.target.value }))}
                      style={{
                        width: "100%", background: T.bgCard,
                        border: `1.5px solid ${T.border}`, borderRadius: 12,
                        padding: "11px 14px", color: T.white, fontSize: 14,
                        outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </StepShell>
        );
      }

      /* ── STEP 11 — Policy Term ────────────────── */
      case 11:
        return (
          <StepShell headline="How long should your cover last?"
            hint="Cover yourself until dependents are independent and loans repaid">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { id: "20 years",    emoji: "📅", sub: "Good for younger buyers"    },
                  { id: "30 years",    emoji: "📆", sub: "Comprehensive long cover"    },
                  { id: "Till age 60", emoji: "🔐", sub: "Covers working years"        },
                  { id: "Till age 65", emoji: "🏁", sub: "Post-retirement buffer"      },
                  { id: "Till age 70", emoji: "♾️", sub: "Maximum protection"         },
                  { id: "Advise me",   emoji: "🤔", sub: "Let FinSaathi decide"        },
                ].map((t) => (
                  <Chip key={t.id} label={t.id} sub={t.sub} emoji={t.emoji}
                    selected={ans.policyTerm === t.id}
                    onClick={() => setAns((a) => ({ ...a, policyTerm: t.id }))} />
                ))}
              </div>
              {ans.policyTerm === "30 years" && (
                <div style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: `${T.blue}18`,
                  border: `1px solid ${T.blue}35`,
                }}>
                  <p style={{ fontSize: 12, color: T.blue, lineHeight: 1.5, margin: 0 }}>
                    Most popular choice. Covers home loan repayment and child education.
                  </p>
                </div>
              )}
            </div>
          </StepShell>
        );

      /* ── STEP 12 — Payout Type ────────────────── */
      case 12:
        return (
          <StepShell headline="How should the money reach your family?"
            hint="Both options pay the full cover amount — just differently">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  {
                    id: "Lump sum", emoji: "💰",
                    sub1: "Full amount paid at once. Family decides how to use it.",
                    sub2: "e.g. ₹1.5 Cr on Day 1",
                  },
                  {
                    id: "Monthly income", emoji: "📅",
                    sub1: "Paid as monthly salary to family. Prevents mismanagement.",
                    sub2: "e.g. ₹62,500/month × 20yr",
                  },
                ].map((opt) => {
                  const sel = ans.payoutType === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={() => setAns((a) => ({ ...a, payoutType: opt.id }))}
                      style={{
                        flex: 1, display: "flex", flexDirection: "column",
                        alignItems: "flex-start", gap: 8,
                        padding: "20px 14px", borderRadius: 20, textAlign: "left",
                        border: `1.5px solid ${sel ? T.borderSelected : T.border}`,
                        background: sel ? T.bgSelected : T.bgCard,
                        boxShadow: sel ? `0 0 0 1px ${T.teal}30, 0 0 20px ${T.teal}20` : "none",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 32 }}>{opt.emoji}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>{opt.id}</span>
                      <span style={{ fontSize: 11, color: T.hint, lineHeight: 1.45 }}>{opt.sub1}</span>
                      <span style={{ fontSize: 11, color: T.muted }}>{opt.sub2}</span>
                    </button>
                  );
                })}
              </div>

              {ans.payoutType === "Lump sum" && (
                <div style={{
                  padding: "12px 14px", borderRadius: 12,
                  background: `${T.blue}18`,
                  border: `1px solid ${T.blue}35`,
                }}>
                  <p style={{ fontSize: 12, color: T.blue, lineHeight: 1.5, margin: 0 }}>
                    Best for families who can invest the lump sum or have large one-time
                    liabilities like a home loan.
                  </p>
                </div>
              )}
            </div>
          </StepShell>
        );

      default:
        return null;
    }
  }

  const valid = isValid();

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      minHeight: "100dvh", background: T.bg,
      fontFamily: T.sora, color: T.white,
    }}>

      {/* Header — back + step indicator + progress bar */}
      <div style={{ flexShrink: 0, padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          {/* Back */}
          <button onClick={back} style={{
            width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${T.border}`,
            cursor: "pointer",
          }}>
            <ChevronLeft size={18} color={T.white} />
          </button>

          {/* Logo + step */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{
              fontSize: 13, fontWeight: 800, letterSpacing: "0.04em",
              background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              FinSaathi
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: T.hint }}>Step {step} of 12</span>
              <span style={{
                padding: "2px 8px", borderRadius: 99,
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                background: `${phase.color}22`, color: phase.color,
              }}>
                {phase.id}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ width: 36 }} />
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, borderRadius: 99, overflow: "hidden",
          background: "rgba(255,255,255,0.07)",
        }}>
          <div style={{
            height: "100%", borderRadius: 99,
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${T.teal}, ${T.blue})`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 16px" }}>
        {renderStep()}
      </div>

      {/* Continue button */}
      <div style={{
        flexShrink: 0,
        padding: "12px 20px calc(env(safe-area-inset-bottom) + 28px)",
      }}>
        <button
          onClick={next}
          disabled={!valid}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, width: "100%", height: 54,
            borderRadius: 16, fontSize: 15, fontWeight: 700,
            fontFamily: T.sora, cursor: valid ? "pointer" : "not-allowed",
            border: valid ? "none" : `1.5px solid ${T.border}`,
            background: valid
              ? `linear-gradient(135deg, ${T.teal} 0%, ${T.blue} 100%)`
              : "rgba(255,255,255,0.05)",
            color: valid ? "#000" : T.hint,
            boxShadow: valid ? `0 4px 28px ${T.teal}45` : "none",
            transition: "all 0.2s",
          }}
        >
          {step === 12 ? "Calculate my cover" : "Continue"}
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense>
      <QuestionsForm />
    </Suspense>
  );
}
