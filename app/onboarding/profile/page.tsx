"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense }         from "react";
import { ChevronLeft, ChevronRight, Check, Info } from "lucide-react";
import { IconBtn } from "@/components/shared/IconBtn";

const TOTAL_STEPS = 6;

const DEPENDENT_OPTIONS = [
  { id: "Spouse",        sub: "Partner / spouse" },
  { id: "Child",         sub: "1 child, school‑age" },
  { id: "Parents (part)", sub: "Parents (partial support)" },
  { id: "Parents (full)", sub: "Parents (fully dependent)" },
  { id: "Sibling",       sub: "Younger sibling" },
  { id: "None",          sub: "Only myself" },
];

const DEFAULT_SELECTED = ["Spouse", "Child", "Parents (part)"];

function ProfileForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const step         = Number(searchParams.get("step") ?? "2");
  const [deps, setDeps] = useState<string[]>(DEFAULT_SELECTED);

  const toggle = (id: string) =>
    setDeps((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  const next = () => {
    if (step < TOTAL_STEPS) {
      router.push(`/onboarding/profile?step=${step + 1}`);
    } else {
      router.push("/onboarding/finscore");
    }
  };

  const back = () => {
    if (step > 1) router.push(`/onboarding/profile?step=${step - 1}`);
    else router.push("/onboarding/welcome");
  };

  return (
    <div className="flex-1 flex flex-col bg-bg-app">
      {/* ── Progress row ─────────────────────────────── */}
      <div className="shrink-0 px-[18px] pt-3 pb-4">
        <div className="flex items-center gap-2.5">
          <IconBtn onClick={back} aria-label="Back">
            <ChevronLeft size={18} />
          </IconBtn>
          <div className="flex-1 h-[6px] bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-saffron rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className="tnum text-[11px] font-bold text-muted">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-[22px] pb-4">
        <div
          className="eyebrow mb-1.5"
          style={{ color: "var(--saffron-deep)" }}
        >
          Step {step} · Family &amp; dependents
        </div>
        <h2
          className="text-[28px] font-medium text-ink leading-[1.15]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Who counts on your{" "}
          <em className="italic">paycheque</em>?
        </h2>
        <p className="text-[13px] text-muted mt-2 leading-[1.5]">
          This shapes the term cover we&apos;ll recommend — and the emergency
          buffer you actually need.
        </p>

        {/* Selectable cards */}
        <div className="mt-5 flex flex-col gap-2.5">
          {DEPENDENT_OPTIONS.map((opt) => {
            const on = deps.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className="flex items-center gap-3.5 text-left px-4 py-3.5 rounded-[16px] transition-all duration-150 border-[1.5px]"
                style={{
                  background: on ? "var(--tint-saffron)" : "var(--surface)",
                  borderColor: on ? "var(--saffron)" : "var(--hairline)",
                }}
              >
                {/* Checkbox */}
                <span
                  className="w-[22px] h-[22px] rounded-[7px] shrink-0 flex items-center justify-center transition-all"
                  style={{
                    background: on ? "var(--saffron)" : "transparent",
                    border: `1.5px solid ${on ? "var(--saffron)" : "var(--hairline-2)"}`,
                    color: "#fff8ef",
                  }}
                >
                  {on && <Check size={14} strokeWidth={2.4} />}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-[15px] text-ink">{opt.id}</div>
                  <div className="text-[12px] text-muted">{opt.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info banner */}
        <div
          className="mt-5 p-3.5 rounded-[14px] flex gap-3 items-start"
          style={{ background: "var(--tint-indigo)" }}
        >
          <Info size={18} strokeWidth={2} className="text-indigo shrink-0 mt-0.5" />
          <p className="text-[12px] text-indigo leading-[1.5]">
            Based on your answers, term insurance recommendation will be roughly{" "}
            <strong>10–15× annual income</strong>, adjusted for loans.
          </p>
        </div>
      </div>

      {/* ── Sticky CTA ───────────────────────────────── */}
      <div
        className="shrink-0 px-[22px] pt-3.5 pb-7 border-t border-hairline"
        style={{ background: "rgba(250,245,235,0.94)" }}
      >
        <button
          onClick={next}
          className="flex items-center justify-center gap-2 h-[54px] rounded-[14px] bg-saffron text-[#fff8ef] text-[15px] font-semibold w-full"
          style={{
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)",
          }}
        >
          Continue
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileForm />
    </Suspense>
  );
}
