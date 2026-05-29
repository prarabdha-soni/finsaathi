"use client";
import { Globe } from "lucide-react";
import { useUserStore } from "@/stores";
import { cn } from "@/lib/utils";

interface LangSwitchProps {
  className?: string;
}

export function LangSwitch({ className }: LangSwitchProps) {
  const { lang, setLang } = useUserStore();

  return (
    <button
      onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
      className={cn(
        "inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full",
        "bg-surface border border-hairline-2 text-ink-2",
        "text-[11px] font-bold tracking-[0.04em]",
        "hover:bg-surface-2 transition-colors",
        className,
      )}
    >
      <Globe size={13} strokeWidth={2} />
      <span>{lang === "EN" ? "EN" : "HI"}</span>
      <span className="text-muted">·</span>
      <span className="font-semibold">
        {lang === "EN" ? "HI" : "EN"}
      </span>
    </button>
  );
}
