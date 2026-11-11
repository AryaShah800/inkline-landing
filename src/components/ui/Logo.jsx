// Wordmark with a small mark: a signature stroke on a blue tile.
export default function Logo({ inverse = false }) {
  return (
    <span className="inline-flex items-center gap-2.5" translate="no">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="6" className={inverse ? 'fill-white' : 'fill-pen'} />
        <path
          d="M7 19c3-8 5-9 6-6s1 6 4 2 3-5 4-4"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={inverse ? 'stroke-ink' : 'stroke-white'}
        />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">Inkline</span>
    </span>
  )
}
