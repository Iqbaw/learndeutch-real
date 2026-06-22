// Brand logo (yellow rounded square + white "D" + red dot).
// Inline SVG so it stays crisp at any size and inherits sizing via className.
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Deutsch 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="6" width="84" height="84" rx="23" fill="#F7C400" />
      <path d="M30 22 H48 C70 22 82 35 82 49 C82 63 70 74 48 74 H30 Z" fill="#FFFFFF" />
      <circle cx="70" cy="70" r="9" fill="#E5342A" />
    </svg>
  );
}
