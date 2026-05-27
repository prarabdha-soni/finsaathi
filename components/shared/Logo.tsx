// SaathiMark — circle + pulse-wave SVG (matches design prototype)
interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Logo({ size = 32, color = "#d9783a", className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <circle cx="16" cy="16" r="15" fill={color} />
      <path
        d="M7 18c2-6 4-6 5 0s3 6 5 0 4-6 8 0"
        stroke="#fff8ef"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
