const tones = {
  paper: 'bg-paper',
  sheet: 'border-y border-line bg-sheet',
}

const sizes = {
  default: 'py-20 md:py-28',
  hero: 'pt-12 pb-20 md:pt-20 md:pb-28',
}

// Every page block uses this wrapper, so spacing and width are identical across sections.
// The section is labelled by the heading whose id is `${id}-title`.
export default function Section({ id, tone = 'paper', size = 'default', children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tones[tone]} ${sizes[size]}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  )
}
