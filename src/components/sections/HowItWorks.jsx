import Button from '../ui/Button.jsx'
import Section from '../ui/Section.jsx'
import StatusChip from '../ui/StatusChip.jsx'
import { steps } from '../../data/content.js'

export default function HowItWorks() {
  return (
    <Section id="how-it-works">
      <h2
        id="how-it-works-title"
        className="max-w-2xl font-display text-h2 font-medium text-balance"
      >
        Three steps from idea to signed
      </h2>
      <p className="mt-4 max-w-xl text-lead text-ink-soft">
        The same document moves through each step, so nothing has to be copied or retyped.
      </p>

      {/* These steps really are a sequence, so they are numbered and joined by a line. */}
      <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative md:not-last:before:absolute md:not-last:before:top-5 md:not-last:before:left-14 md:not-last:before:-right-8 md:not-last:before:h-px md:not-last:before:bg-ink/25"
          >
            <span className="grid size-10 place-items-center rounded-full border border-pen bg-sheet font-display text-lead font-semibold text-pen">
              {index + 1}
            </span>
            <h3 className="mt-5 font-display text-lead leading-snug font-semibold">{step.title}</h3>
            <p className="mt-2 max-w-sm text-ink-soft">{step.text}</p>
            <StatusChip tone={step.tone} className="mt-5">
              {step.status}
            </StatusChip>
          </li>
        ))}
      </ol>

      <div className="mt-14">
        <Button href="#pricing">Try it free</Button>
      </div>
    </Section>
  )
}
