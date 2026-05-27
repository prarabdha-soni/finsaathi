"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface RingGaugeProps {
  score?: number;
  size?: number;
  thickness?: number;
  label?: string;
  grade?: string;
  className?: string;
  dark?: boolean;
}

export function RingGauge({
  score = 61,
  size = 220,
  thickness = 14,
  label = "FinScore",
  grade,
  className,
  dark = false,
}: RingGaugeProps) {
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;

  const pct = Math.max(0, Math.min(100, score)) / 100;
  const targetOffset = circumference * (1 - pct);

  const colour =
    score >= 75 ? "var(--good)" : score >= 55 ? "var(--saffron)" : "var(--bad)";

  const tier =
    grade ||
    (score >= 80
      ? "Strong"
      : score >= 65
      ? "Building"
      : score >= 50
      ? "At risk"
      : "Critical");

  // Animate dashoffset on mount
  const dashOffset = useMotionValue(circumference);
  useEffect(() => {
    const controls = animate(dashOffset, targetOffset, {
      duration: 0.9,
      ease: [0.2, 0.7, 0.3, 1],
    });
    return controls.stop;
  }, [score]);

  // Animated score counter
  const scoreMotion = useMotionValue(0);
  const scoreRounded = useTransform(scoreMotion, Math.round);
  const scoreRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const unsub = scoreRounded.on("change", (v) => {
      if (scoreRef.current) scoreRef.current.textContent = String(v);
    });
    const controls = animate(scoreMotion, score, {
      duration: 0.9,
      ease: [0.2, 0.7, 0.3, 1],
    });
    return () => { controls.stop(); unsub(); };
  }, [score]);

  const textColor = dark ? "#fff8ef" : "var(--ink)";
  const subtextColor = dark ? "rgba(251,231,207,0.8)" : "var(--ink-3)";
  const trackColor = dark ? "rgba(255,255,255,0.1)" : "var(--surface-3)";
  const eyebrowColor = dark ? "var(--saffron-soft)" : "var(--muted)";

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={trackColor}
          strokeWidth={thickness}
          fill="none"
        />
        {/* Arc */}
        <motion.circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={colour}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
        {/* Tick marks */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * 2 * Math.PI;
          const outer = r + thickness / 2 + (i % 5 === 0 ? 14 : 10);
          const inner = r + thickness / 2 + 6;
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * inner}
              y1={cx + Math.sin(angle) * inner}
              x2={cx + Math.cos(angle) * outer}
              y2={cx + Math.sin(angle) * outer}
              stroke={dark ? "rgba(255,255,255,0.15)" : "var(--hairline-2)"}
              strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
            />
          );
        })}
      </svg>

      {/* Centre text — not rotated */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span
          className="eyebrow"
          style={{ fontSize: 10, color: eyebrowColor }}
        >
          {label}
        </span>
        <svg
          width={size * 0.44}
          height={size * 0.38}
          viewBox={`0 0 ${size * 0.44} ${size * 0.38}`}
          overflow="visible"
        >
          <text
            ref={scoreRef}
            x={size * 0.22}
            y={size * 0.3}
            textAnchor="middle"
            fontSize={size * 0.32}
            fontWeight="500"
            fill={textColor}
            fontFamily="var(--font-display)"
            style={{ letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            {score}
          </text>
        </svg>
        <span
          className="tnum"
          style={{ fontSize: 12, color: subtextColor, marginTop: -4 }}
        >
          / 100 · {tier}
        </span>
      </div>
    </div>
  );
}
