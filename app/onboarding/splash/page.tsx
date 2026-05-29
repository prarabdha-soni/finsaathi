import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const TRUST_BADGES = ["IRDAI 145", "SEBI RIA", "RBI · AA", "DPDP ✓"];

export default function SplashPage() {
  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden"
      style={{ background: "var(--surface-3)" }}
    >
      {/* Radial wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(217,120,58,0.18) 0%, transparent 55%)",
        }}
      />

      {/* Decorative concentric circles */}
      <svg
        viewBox="0 0 390 844"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        {[120, 180, 240, 320].map((r, i) => (
          <circle
            key={r}
            cx="195"
            cy="320"
            r={r}
            stroke="rgba(45,42,32,0.06)"
            strokeWidth="1"
            fill="none"
            strokeDasharray={i === 1 ? "3 6" : "0"}
          />
        ))}
      </svg>

      <div className="flex-1 flex flex-col relative">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-4">

          {/* Brand mark */}
          <div className="mt-[72px] flex flex-col items-center">
            <div className="relative">
              <Logo size={84} />
              {/* Pulse rings */}
              <span
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -10,
                  border: "1.5px solid var(--saffron)",
                  opacity: 0.4,
                }}
              />
              <span
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -22,
                  border: "1px solid var(--saffron-deep)",
                  opacity: 0.18,
                }}
              />
            </div>

            <div
              className="text-[38px] font-medium text-ink mt-7 tracking-[-0.015em] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FinSaathi
            </div>
            <div
              className="text-[14px] font-semibold mt-2.5 tracking-[0.01em]"
              style={{ color: "var(--saffron-deep)" }}
            >
              Your AI-powered financial co-pilot
            </div>
            <p className="text-[14px] text-ink-3 mt-4 leading-[1.55] text-center max-w-[280px]">
              Honest advice on insurance, credit and investing.
              <br />
              Not a comparison site. Not an agent.{" "}
              <em
                className="italic"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A co-pilot.
              </em>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex justify-center flex-wrap gap-3.5">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="text-[10px] text-ink-3 font-bold tracking-[0.08em] uppercase px-[9px] py-[5px] rounded-full border"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  borderColor: "var(--hairline-2)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>

        </div>

        {/* CTAs — always visible at bottom */}
        <div className="shrink-0 px-8 pb-9 pt-4 flex flex-col gap-2.5">
          <Link
            href="/onboarding/value/1"
            className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
            style={{
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
            }}
          >
            Get started · it&apos;s free
            <ChevronRight size={18} strokeWidth={2.4} />
          </Link>

          <p className="text-center text-[13px] text-ink-3 mt-1">
            Already have an account?{" "}
            <Link
              href="/onboarding/welcome"
              className="font-bold"
              style={{ color: "var(--saffron-deep)" }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
