const base =
  'inline-flex cursor-pointer items-center justify-center rounded-lg text-base font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-pen text-white hover:bg-pen-deep focus-visible:outline-pen',
  secondary: 'border border-ink/30 text-ink hover:bg-ink/5 focus-visible:outline-pen',
  inverse: 'bg-white text-ink hover:bg-pen-tint focus-visible:outline-white',
}

const sizes = {
  md: 'h-12 px-6',
  sm: 'h-11 px-5',
}

// Renders a link when `href` is given (navigation), otherwise a button (action).
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const classes = [base, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
