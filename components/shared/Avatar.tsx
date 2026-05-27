import { cn } from "@/lib/utils";

type AvatarTone = "saffron" | "indigo" | "ink" | "cream";

const tones: Record<AvatarTone, { bg: string; fg: string }> = {
  saffron: { bg: "bg-saffron",   fg: "text-[#fff8ef]" },
  indigo:  { bg: "bg-indigo",    fg: "text-[#eaeaf6]" },
  ink:     { bg: "bg-ink",       fg: "text-[#fbe7cf]" },
  cream:   { bg: "bg-surface-3", fg: "text-ink" },
};

interface AvatarProps {
  name?: string;
  size?: number;
  tone?: AvatarTone;
  className?: string;
}

export function Avatar({ name = "Rahul Sharma", size = 40, tone = "saffron", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const t = tones[tone];

  return (
    <span
      style={{ width: size, height: size, borderRadius: size / 2, fontSize: size * 0.36 }}
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-[0.02em] shrink-0",
        t.bg,
        t.fg,
        className,
      )}
    >
      {initials}
    </span>
  );
}
