const control =
  'block w-full rounded-lg border bg-white px-4 text-base text-ink placeholder:text-ink-soft/70 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pen'

// A label, a control (input, select or textarea) and an inline error that screen readers announce.
export default function FormField({
  id,
  label,
  error,
  hint,
  as: Control = 'input',
  className = '',
  children,
  ...props
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')
  const height = Control === 'textarea' ? 'min-h-32 py-3' : 'h-12'
  const border = error ? 'border-alert' : 'border-line hover:border-ink/40'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <Control
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`${control} ${height} ${border}`}
        {...props}
      >
        {children}
      </Control>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-soft tabular-nums">
          {hint}
        </p>
      ) : null}
      <p id={`${id}-error`} aria-live="polite" className="text-sm text-alert empty:hidden mt-1.5">
        {error}
      </p>
    </div>
  )
}
