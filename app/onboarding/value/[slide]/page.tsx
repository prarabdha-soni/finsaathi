"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Shield, CreditCard, TrendingUp } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    tone: "saffron",
    Icon: Shield,
    eyebrowColor: "var(--saffron-deep)",
    illustrationBg: "linear-gradient(160deg, var(--tint-saffron) 0%, #f0c88e 100%)",
    iconBg: "var(--saffron)",
    headline: "Smart insurance",
    headlineEm: "advice",
    headlineEmColor: "var(--saffron-deep)",
    body: "Know exactly how much cover you need — for your income, loans and family. No agent push. No commission hiding.",
    comparison: [["Today", "₹0 cover", "var(--bad)"], ["Recommended", "₹1.2 Cr", "var(--good)"]],
  },
  {
    id: 2,
    tone: "indigo",
    Icon: CreditCard,
    eyebrowColor: "var(--indigo)",
    illustrationBg: "linear-gradient(160deg, var(--tint-indigo) 0%, #c5cae5 100%)",
    iconBg: "var(--indigo)",
    headline: "Credit score",
    headlineEm: "coach",
    headlineEmColor: "var(--indigo)",
    body: "Improve your CIBIL in 90 days with a weekly plan that fits your salary.",
    comparison: [["Today", "694", "var(--bad)"], ["90 days", "730+", "var(--good)"]],
  },
  {
    id: 3,
    tone: "good",
    Icon: TrendingUp,
    eyebrowColor: "var(--good-deep)",
    illustrationBg: "linear-gradient(160deg, var(--tint-green) 0%, #b8d9c0 100%)",
    iconBg: "var(--good)",
    headline: "Goal-based",
    headlineEm: "SIPs",
    headlineEmColor: "var(--good)",
    body: "Set a goal. Get 3 curated funds. Start in 2 minutes — not 200 funds to choose from.",
    comparison: [["You pick", "200 funds", "var(--muted)"], ["Saathi picks", "3 curated", "var(--good)"]],
  },
] as const;

const NEXT_HREF: Record<number, string> = {
  1: "/onboarding/value/2",
  2: "/onboarding/value/3",
  3: "/onboarding/language",
};

export default function ValueSlidePage() {
  const { slide } = useParams<{ slide: string }>();
  const num = Math.max(1, Math.min(3, parseInt(slide ?? "1", 10)));
  const s = SLIDES[num - 1];
  const Icon = s.Icon;
  const nextHref = NEXT_HREF[num] ?? "/onboarding/language";

  return (
    <div className="flex-1 flex flex-col bg-bg-app">

      {/* Skip */}
      <div className="flex justify-end px-5 pt-3 pb-0 shrink-0">
        <Link
          href="/onboarding/language"
          className="text-[12px] font-bold text-muted tracking-[0.04em]"
        >
          SKIP
        </Link>
      </div>

      {/* Illustration card */}
      <div className="flex-1 px-7 pt-4 overflow-y-auto">
        <div
          className="h-[300px] rounded-[24px] relative overflow-hidden"
          style={{ background: s.illustrationBg }}
        >
          {/* Inline SVG chart */}
          <svg
            viewBox="0 0 320 300"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            {num === 2 ? (
              <>
                <line x1="40" y1="250" x2="290" y2="250" stroke="rgba(46,58,120,0.18)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M40 220 L80 225 L120 200 L160 180 L200 150 L240 125 L280 95"
                  stroke="var(--indigo)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 220 L80 225 L120 200 L160 180 L200 150 L240 125 L280 95 L280 250 L40 250 Z"
                  fill="rgba(46,58,120,0.12)" />
                {[[40,220],[80,225],[120,200],[160,180],[200,150],[240,125],[280,95]].map(([x,y],i)=>(
                  <circle key={i} cx={x} cy={y} r={i===6?6:4} fill="var(--indigo)" />
                ))}
                <g>
                  <rect x="195" y="20" width="100" height="56" rx="14" fill="#fff" stroke="rgba(46,58,120,0.15)" />
                  <text x="245" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted)" letterSpacing="1.2">CIBIL</text>
                  <text x="245" y="67" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--indigo)" fontFamily="var(--font-display)">730</text>
                </g>
                <g transform="translate(160,40)">
                  <rect x="0" y="0" width="54" height="24" rx="12" fill="var(--good)" />
                  <text x="27" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">+36 pts</text>
                </g>
              </>
            ) : num === 1 ? (
              <>
                <path d="M60 240 C100 200,160 180,280 80" stroke="var(--saffron)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M60 240 C100 200,160 180,280 80 L280 270 L60 270 Z" fill="rgba(217,120,58,0.14)"/>
                <g>
                  <rect x="190" y="20" width="100" height="56" rx="14" fill="#fff" stroke="rgba(217,120,58,0.18)" />
                  <text x="240" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted)" letterSpacing="1.1">COVER</text>
                  <text x="240" y="67" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--saffron-deep)" fontFamily="var(--font-display)">₹1.2Cr</text>
                </g>
                <g transform="translate(142,38)">
                  <rect x="0" y="0" width="60" height="24" rx="12" fill="var(--good)"/>
                  <text x="30" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Secured</text>
                </g>
              </>
            ) : (
              <>
                <path d="M60 240 C100 160,180 200,280 80" stroke="var(--good)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M60 240 C100 160,180 200,280 80 L280 270 L60 270 Z" fill="rgba(63,122,78,0.12)"/>
                {[
                  [60,240,"Goal: Riya's college"],
                  [160,170,"Emergency fund"],
                  [280,80,"Retirement"],
                ].map(([cx, cy, label], i) => (
                  <g key={i}>
                    <circle cx={cx as number} cy={cy as number} r={i===2?7:5} fill="var(--good)" />
                    <text x={cx as number} y={(cy as number)-10} textAnchor="middle" fontSize="8" fill="var(--good-deep)" fontWeight="600">{label as string}</text>
                  </g>
                ))}
              </>
            )}
          </svg>

          {/* Icon badge */}
          <div
            className="absolute left-6 top-6 w-14 h-14 rounded-[16px] flex items-center justify-center text-white"
            style={{
              background: s.iconBg,
              boxShadow: "0 8px 22px -8px rgba(0,0,0,0.35)",
            }}
          >
            <Icon size={28} strokeWidth={2} />
          </div>
        </div>

        {/* Copy */}
        <div
          className="eyebrow mt-7"
          style={{ color: s.eyebrowColor }}
        >
          What Saathi does · {num} of 3
        </div>
        <div
          className="text-[32px] font-medium text-ink mt-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {s.headline}{" "}
          <em className="italic" style={{ color: s.headlineEmColor }}>
            {s.headlineEm}
          </em>
        </div>
        <p className="text-[15px] text-ink-3 mt-3 leading-[1.55]">{s.body}</p>

        {/* Comparison strip */}
        <div className="flex gap-2 mt-4">
          {s.comparison.map(([label, val, color]) => (
            <div
              key={label}
              className="flex-1 p-3 rounded-[12px] bg-surface border border-hairline"
            >
              <div className="text-[10px] text-muted font-bold tracking-[0.06em] uppercase">
                {label}
              </div>
              <div
                className="tnum text-[22px] font-medium mt-0.5"
                style={{ fontFamily: "var(--font-display)", color }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-7 pt-4 pb-7">
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mb-4">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: i === num ? 22 : 6,
                background: i === num ? "var(--saffron)" : "var(--hairline-2)",
              }}
            />
          ))}
        </div>

        <Link
          href={nextHref}
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          {num < 3 ? "Next" : "Choose language"}
          <ChevronRight size={18} strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
