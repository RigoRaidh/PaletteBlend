export default function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <circle cx="25" cy="32" r="16" fill="#d4af37" fillOpacity="0.85" />
      <circle cx="39" cy="32" r="16" fill="#4a9eff" fillOpacity="0.85" style={{ mixBlendMode: 'screen' }} />
    </svg>
  )
}
