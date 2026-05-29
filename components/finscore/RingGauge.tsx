"use client";
import { useEffect, useRef, useId } from "react";
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
  thickness = 12,
  label = "FinScore",
  grade,
  className,
  dark = false,
}: RingGaugeProps) {
  const uid     = useId().replace(/:/g, "");
  const r       = (size - thickness) / 2;
  const cx      = size / 2;
  const circum  = 2 * Math.PI * r;

  const pct         = Math.max(0, Math.min(100, score)) / 100;
  const targetOffset = circum * (1 - pct);

  // Endpoint dot position (tip of the arc)
  // Arc starts at top (after -90deg rotation), goes clockwise
  const endAngle = pct * 2 * Math.PI - Math.PI / 2;
  const dotX = cx + r * Math.cos(endAngle);
  const dotY = cx + r * Math.sin(endAngle);

  const tier =
    grade ??
    (score >= 80 ? "Strong"
      : score >= 65 ? "Building"
      : score >= 50 ? "At risk"
      : "Critical");

  // Animate arc
  const dashOffset = useMotionValue(circum);
  useEffect(() => {
    const c = animate(dashOffset, targetOffset, {
      duration: 1.1,
      ease: [0.25, 0.8, 0.25, 1],
    });
    return c.stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  // Animated dot position
  const dotAngleMotion = useMotionValue(-Math.PI / 2);
  useEffect(() => {
    const c = animate(dotAngleMotion, endAngle, {
      duration: 1.1,
      ease: [0.25, 0.8, 0.25, 1],
    });
    return c.stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const dotXMotion = useTransform(dotAngleMotion, (a) => cx + r * Math.cos(a));
  const dotYMotion = useTransform(dotAngleMotion, (a) => cx + r * Math.sin(a));

  // Animated score counter
  const scoreMotion  = useMotionValue(0);
  const scoreRounded = useTransform(scoreMotion, Math.round);
  const scoreRef     = useRef<SVGTextElement>(null);
  useEffect(() => {
    const unsub = scoreRounded.on("change", (v) => {
      if (scoreRef.current) scoreRef.current.textContent = String(v);
    });
    const c = animate(scoreMotion, score, {
      duration: 1.1,
      ease: [0.25, 0.8, 0.25, 1],
    });
    return () => { c.stop(); unsub(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  // Colors
  const textColor    = dark ? "#fff8ef"                    : "var(--ink)";
  const subtextColor = dark ? "rgba(251,231,207,0.65)"     : "var(--ink-3)";
  const trackColor   = dark ? "rgba(255,255,255,0.08)"     : "rgba(28,24,18,0.07)";
  const outerRingC   = dark ? "rgba(255,255,255,0.06)"     : "rgba(28,24,18,0.06)";
  const gradStart    = dark ? "#f3c699" : "#f0b870";
  const gradEnd      = dark ? "#a85522" : "#c06020";
  const glowColor    = dark ? "rgba(217,120,58,0.45)"      : "rgba(192,96,32,0.35)";

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradient for the progress arc */}
          <linearGradient
            id={`arcGrad_${uid}`}
            x1={cx + r} y1={cx}
            x2={cx - r} y2={cx}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor={gradStart} />
            <stop offset="100%" stopColor={gradEnd}   />
          </linearGradient>

          {/* Glow filter for the arc */}
          <filter id={`glow_${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter for endpoint dot */}
          <filter id={`dotGlow_${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip to hide the arc start dot */}
          <clipPath id={`ring_${uid}`}>
            <circle cx={cx} cy={cx} r={size / 2 + 4} />
          </clipPath>
        </defs>

        {/* ── Outer decorative ring ─────────────────── */}
        <circle
          cx={cx} cy={cx}
          r={r + thickness / 2 + 5}
          stroke={outerRingC}
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 6"
        />

        {/* ── Track ────────────────────────────────── */}
        <circle
          cx={cx} cy={cx} r={r}
          stroke={trackColor}
          strokeWidth={thickness}
          fill="none"
          style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cx}px` }}
        />

        {/* ── Progress arc ─────────────────────────── */}
        <motion.circle
          cx={cx} cy={cx} r={r}
          stroke={`url(#arcGrad_${uid})`}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circum}
          style={{
            strokeDashoffset: dashOffset,
            transform: `rotate(-90deg)`,
            transformOrigin: `${cx}px ${cx}px`,
            filter: `url(#glow_${uid})`,
          }}
        />

        {/* ── Endpoint glowing dot ──────────────────── */}
        <motion.circle
          style={{ cx: dotXMotion, cy: dotYMotion }}
          r={thickness / 2 + 1.5}
          fill={gradEnd}
          filter={`url(#dotGlow_${uid})`}
        />
        {/* Inner bright dot */}
        <motion.circle
          style={{ cx: dotXMotion, cy: dotYMotion }}
          r={thickness / 2 - 2}
          fill="#fff8ef"
          opacity={0.9}
        />
      </svg>

      {/* ── Centre text ───────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Score number */}
        <svg
          width={size * 0.5}
          height={size * 0.42}
          viewBox={`0 0 ${size * 0.5} ${size * 0.42}`}
          overflow="visible"
          style={{ display: "block" }}
        >
          <text
            ref={scoreRef}
            x={size * 0.25}
            y={size * 0.34}
            textAnchor="middle"
            fontSize={size * 0.33}
            fontWeight="500"
            fill={textColor}
            fontFamily="var(--font-display)"
            style={{ letterSpacing: "-0.03em" }}
          >
            {score}
          </text>
        </svg>

        {/* Grade label */}
        <span
          style={{
            fontSize: size * 0.085,
            color: subtextColor,
            fontFamily: "var(--font-ui)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginTop: size * -0.01,
          }}
        >
          {tier}
        </span>
      </div>
    </div>
  );
}
