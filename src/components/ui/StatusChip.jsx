const tones = {
  neutral: 'bg-line/70 text-ink',
  pen: 'bg-pen-tint text-pen-deep',
  signed: 'bg-signed-tint text-signed',
}

// A document status, used on the hero contract and in the "How it works" steps.
export default function StatusChip({ tone = 'neutral', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${tones[tone]} ${className}`}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
