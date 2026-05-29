"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Globe, Check } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function LanguagePage() {
  const [selected, setSelected] = useState<"en" | "hi">("en");
  const router = useRouter();

  function handleContinue() {
    if (typeof window !== "undefined") {
      localStorage.setItem("fs:language", selected);
    }
    router.push("/onboarding/trust");
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-app">
      {/* Back */}
      <div className="shrink-0 px-5 pt-2">
        <Link href="/onboarding/value/3">
          <button aria-label="Back" className="w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-surface-2 transition-colors">
            <ArrowLeft size={18} strokeWidth={1.8} className="text-ink-2" />
          </button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-7 pt-3 pb-4">
        <div className="eyebrow" style={{ color: "var(--saffron-deep)" }}>
          Step 1 of 4
        </div>
        <h1
          className="text-[30px] font-medium text-ink mt-2 leading-[1.1]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Which language do
          <br />
          you{" "}
          <em className="italic" style={{ color: "var(--saffron-deep)" }}>
            prefer?
          </em>
        </h1>
        <p className="text-[13px] text-muted mt-2.5 leading-[1.5]">
          You can change this anytime in Settings.
          <br />
          Saathi answers in whichever you use to ask.
        </p>

        {/* Language cards */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          {/* English */}
          <button
            onClick={() => setSelected("en")}
            className="flex flex-col items-center gap-2.5 px-4 py-5 rounded-[20px] text-center transition-all duration-150 min-h-[200px]"
            style={{
              background: selected === "en" ? "var(--tint-saffron)" : "var(--surface)",
              border: `1.5px solid ${selected === "en" ? "var(--saffron)" : "var(--hairline)"}`,
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, #f5efe1 0%, #e8d8b8 100%)" }}
            >
              <span
                className="text-[28px] font-medium text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Aa
              </span>
            </div>
            <div
              className="text-[22px] font-medium text-ink mt-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              English
            </div>
            <div className="text-[11px] text-muted font-semibold tracking-[0.04em]">Default</div>
          </button>

          {/* Hindi */}
          <button
            onClick={() => setSelected("hi")}
            className="relative flex flex-col items-center gap-2.5 px-4 py-5 rounded-[20px] text-center transition-all duration-150 min-h-[200px]"
            style={{
              background: selected === "hi" ? "var(--tint-saffron)" : "var(--surface)",
              border: `1.5px solid ${selected === "hi" ? "var(--saffron)" : "var(--hairline)"}`,
            }}
          >
            {selected === "hi" && (
              <span
                className="absolute top-3 right-3 w-[22px] h-[22px] rounded-full bg-saffron text-[#fff8ef] flex items-center justify-center"
              >
                <Check size={13} strokeWidth={2.6} />
              </span>
            )}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--saffron-soft) 0%, var(--saffron) 100%)",
                boxShadow: "0 6px 18px -8px rgba(217,120,58,0.5)",
              }}
            >
              <span
                className="text-[26px] font-semibold text-[#fff8ef]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Hi
              </span>
            </div>
            <div
              className="text-[22px] font-medium text-saffron-ink mt-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hindi
            </div>
            <div className="text-[11px] font-bold" style={{ color: "var(--saffron-deep)" }}>
              Devanagari · Suggested
            </div>
          </button>
        </div>

        {/* Coming soon card */}
        <div
          className="mt-5 flex items-center gap-3 p-3.5 rounded-[14px]"
          style={{ background: "var(--surface-2)", border: "none" }}
        >
          <Globe size={20} strokeWidth={2} className="text-muted shrink-0" />
          <div>
            <div className="text-[12px] text-ink-2 font-semibold">More languages coming soon</div>
            <div className="text-[11px] text-muted mt-0.5">
              Marathi · Tamil · Telugu · Bengali · Q3 2026
            </div>
          </div>
        </div>

        {/* Saathi note */}
        <div
          className="mt-4 flex gap-2.5 items-start p-3.5 rounded-[14px]"
          style={{ background: "var(--tint-indigo)" }}
        >
          <Logo size={26} color="var(--indigo)" className="shrink-0 mt-0.5" />
          <p className="text-[12px] leading-[1.55] font-medium" style={{ color: "var(--indigo)" }}>
            &ldquo;I&apos;m Saathi — I&apos;ll always respond in whatever language you choose. Switch anytime.&rdquo;
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 px-7 pb-7 pt-4">
        <button
          onClick={handleContinue}
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow: "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Continue
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
