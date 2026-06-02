import Link from "next/link";
import { Logo }       from "@/components/shared/Logo";
import { LangSwitch } from "@/components/shared/LangSwitch";

export default function WelcomePage() {
  return (
    <div
      className="flex-1 flex flex-col"
      style={{ background: "var(--surface-3)" }}
    >
      {/* ── Top bar ──────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-7 pt-5 pb-0">
        <Logo size={36} />
        <LangSwitch />
      </div>

      {/* ── Scrollable hero copy ──────────────────────── */}
      <div className="flex-1 overflow-y-auto px-7 pt-0 pb-4">
        <div className="mt-[60px]">
          <div className="eyebrow" style={{ color: "var(--saffron-deep)" }}>
            Gloww · Your Financial Co-pilot
          </div>
          <h1
            className="mt-4 leading-[1.05] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px,10vw,52px)",
              fontWeight: 500,
              color: "var(--ink)",
            }}
          >
            Your money.
            <br />
            Your goals.
            <br />
            <em className="italic" style={{ color: "var(--saffron-deep)" }}>
              One co‑pilot.
            </em>
          </h1>
          <p className="text-[15px] text-ink-2 mt-4 leading-[1.5] max-w-[300px]">
            Honest, personalised financial advice — in English. Built for the
            400M middle‑class Indians no advisor will call back.
          </p>
        </div>
      </div>

      {/* ── CTAs — always visible ─────────────────────── */}
      <div className="shrink-0 px-7 pb-7 pt-4 flex flex-col gap-2.5">
        <Link
          href="/home"
          className="flex items-center justify-center h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Continue with mobile number
        </Link>

        <button className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-surface-2 border border-hairline text-[15px] font-semibold text-ink w-full">
          <span className="w-[18px] h-[18px] rounded-[4px] bg-ink text-[#fff] text-[11px] font-extrabold inline-flex items-center justify-center shrink-0">
            W
          </span>
          Continue on WhatsApp
        </button>

        <p className="text-center text-[11px] text-muted mt-1.5 leading-[1.5]">
          By continuing you accept our{" "}
          <span className="text-ink-2 underline cursor-pointer">Terms</span>{" "}
          and the{" "}
          <span className="text-ink-2 underline cursor-pointer">DPDP consent</span>.
          <br />
          Account Aggregator framework · RBI‑regulated.
        </p>
      </div>
    </div>
  );
}
