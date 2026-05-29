import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SplashPage() {
  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden"
      style={{ background: "var(--saffron)" }}
    >
      {/* ── Decorative arcs — top-right corner ────── */}
      <svg
        viewBox="0 0 430 430"
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: "82%", maxWidth: 360, opacity: 1 }}
        aria-hidden
      >
        <circle
          cx="430" cy="0" r="330"
          stroke="rgba(255,248,239,0.13)" strokeWidth="1.5" fill="none"
        />
        <circle
          cx="430" cy="0" r="255"
          stroke="rgba(255,248,239,0.08)" strokeWidth="1" fill="none"
        />
      </svg>

      {/* ── Spacer — pushes text down ─────────────── */}
      <div className="flex-1" />

      {/* ── Hero copy ─────────────────────────────── */}
      <div className="px-8 pb-10">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 11.5vw, 60px)",
            fontWeight: 500,
            color: "#fff8ef",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            margin: 0,
          }}
        >
          Your money.
          <br />
          Your goals.
          <br />
          <em className="italic">One co&#8209;pilot.</em>
        </h1>
      </div>

      {/* ── CTA ───────────────────────────────────── */}
      <div className="shrink-0 px-8 pb-12 flex flex-col gap-3">
        <Link
          href="/onboarding/questions?step=1"
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] text-[15px] font-semibold w-full transition-opacity active:opacity-80"
          style={{
            background: "rgba(255,248,239,0.20)",
            color: "#fff8ef",
            border: "1.5px solid rgba(255,248,239,0.28)",
          }}
        >
          Get started — it&apos;s free
          <ChevronRight size={18} strokeWidth={2.4} />
        </Link>

        <p
          className="text-center text-[13px]"
          style={{ color: "rgba(255,248,239,0.55)" }}
        >
          Already have an account?{" "}
          <Link
            href="/onboarding/welcome"
            className="font-bold"
            style={{ color: "rgba(255,248,239,0.88)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
