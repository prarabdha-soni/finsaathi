import Link from "next/link";
import { ArrowLeft, ChevronRight, Lock, Shield, Check } from "lucide-react";
import { FSCard } from "@/components/shared/FSCard";

const TRUST_POINTS = [
  {
    title: "We never sell your data",
    sub: "No partner banks. No marketers. No data brokers. Period.",
    Icon: Lock,
  },
  {
    title: "End-to-end encrypted",
    sub: "Bank statements decrypted only on your device. Saathi servers store insights, not raw data.",
    Icon: Shield,
  },
  {
    title: "Licensed and audited",
    sub: "IRDAI Web Aggregator (145). AMFI ARN. SEBI RIA pending. RBI Account Aggregator framework.",
    Icon: Check,
  },
];

export default function TrustPage() {
  return (
    <div className="flex-1 flex flex-col bg-bg-app">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-2">
        <Link href="/onboarding/language">
          <button aria-label="Back" className="w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-surface-2 transition-colors">
            <ArrowLeft size={18} strokeWidth={1.8} className="text-ink-2" />
          </button>
        </Link>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-200"
              style={{
                width: i === 3 ? 22 : 6,
                background: i <= 3 ? "var(--saffron)" : "var(--hairline-2)",
                opacity: i === 3 ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-7 pt-5 pb-4">
        {/* Shield illustration */}
        <div className="flex justify-center mt-2">
          <div className="relative w-[120px] h-[120px]">
            <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden>
              <circle cx="60" cy="60" r="56" stroke="var(--saffron-soft)" strokeWidth="1" fill="none" opacity="0.5" />
              <circle cx="60" cy="60" r="46" stroke="var(--saffron-soft)" strokeWidth="1" fill="none" strokeDasharray="3 4" opacity="0.6" />
              <path
                d="M60 22 L92 32 L92 60 C92 82 60 96 60 96 C60 96 28 82 28 60 L28 32 Z"
                fill="var(--saffron)"
                stroke="var(--saffron-deep)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <rect x="48" y="56" width="24" height="20" rx="3" fill="#fff8ef" />
              <path d="M52 56 L52 50 A8 8 0 0 1 68 50 L68 56" stroke="#fff8ef" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="60" cy="66" r="2.5" fill="var(--saffron-deep)" />
            </svg>
          </div>
        </div>

        <h1
          className="text-[30px] font-medium text-ink mt-6 leading-[1.1] text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your data.{" "}
          <em className="italic" style={{ color: "var(--saffron-deep)" }}>
            Your control.
          </em>
        </h1>
        <p className="text-[13px] text-ink-3 mt-2.5 leading-[1.55] text-center max-w-[300px] mx-auto">
          Read this before we go further.
          <br />
          It&apos;s how Saathi is different.
        </p>

        {/* Trust points */}
        <div className="flex flex-col gap-2.5 mt-6">
          {TRUST_POINTS.map(({ title, sub, Icon }) => (
            <FSCard key={title} tone="white" pad={16} className="flex gap-3.5 items-start">
              <span
                className="w-10 h-10 rounded-[12px] shrink-0 flex items-center justify-center"
                style={{ background: "var(--tint-green)", color: "var(--good-deep)" }}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-ink">{title}</div>
                <p className="text-[12px] text-ink-3 mt-1 leading-[1.5]">{sub}</p>
              </div>
            </FSCard>
          ))}
        </div>

        {/* Commission disclosure */}
        <FSCard tone="saffron" pad={16} className="mt-4">
          <div className="eyebrow" style={{ color: "var(--saffron-deep)" }}>
            The one honest part
          </div>
          <p className="text-[13px] text-saffron-ink mt-1.5 leading-[1.55]">
            We earn referral commission when you buy insurance or open a card via Saathi.{" "}
            <strong>We always disclose the exact amount.</strong> Our recommendations are
            independent of what we earn.
          </p>
        </FSCard>
      </div>

      {/* CTA */}
      <div className="shrink-0 px-7 pt-4 pb-7">
        <Link
          href="/onboarding/personalise/1"
          className="flex items-center justify-center h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          I understand — let&apos;s begin
        </Link>
        <p className="text-center text-[11px] text-muted mt-2.5 leading-[1.5]">
          By continuing you agree to our{" "}
          <span className="text-ink-2 underline cursor-pointer">Terms</span>,{" "}
          <span className="text-ink-2 underline cursor-pointer">Privacy</span>, and{" "}
          <span className="text-ink-2 underline cursor-pointer">DPDP consent</span>.
        </p>
      </div>
    </div>
  );
}
