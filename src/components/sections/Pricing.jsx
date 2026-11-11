import { useState } from 'react'
import { Check } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Section from '../ui/Section.jsx'
import { plans } from '../../data/content.js'
import { formatINR } from '../../utils/format.js'

const periods = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly, 20% off' },
]

function priceNote(plan, period, price) {
  if (price === 0) return 'No card needed'
  return period === 'yearly' ? `Billed ${formatINR(price * 12)} a year` : 'Billed monthly'
}

function PlanCard({ plan, period, onSelectPlan }) {
  const price = period === 'yearly' ? plan.yearly : plan.monthly
  const dark = Boolean(plan.highlight)

  return (
    <article
      className={`flex flex-col rounded-md border p-6 sm:p-8 ${
        dark ? 'border-ink bg-ink text-white' : 'border-line bg-sheet'
      }`}
    >
      <h3 className="font-display text-h3 font-semibold">{plan.name}</h3>
      {/* Two lines of room on desktop so prices and buttons line up across the three plans. */}
      <p className={`mt-2 lg:min-h-14 ${dark ? 'text-ink-muted' : 'text-ink-soft'}`}>
        {plan.blurb}
      </p>

      <p className="mt-8 flex items-baseline gap-2">
        <span className="font-display text-h2 font-medium tabular-nums">{formatINR(price)}</span>
        <span className={dark ? 'text-ink-muted' : 'text-ink-soft'}>
          {price === 0 ? 'forever' : 'per month'}
        </span>
      </p>
      <p className={`mt-1 text-sm ${dark ? 'text-ink-muted' : 'text-ink-soft'}`}>
        {priceNote(plan, period, price)}
      </p>

      <Button
        href="#contact"
        variant={dark ? 'inverse' : 'secondary'}
        fullWidth
        className="mt-8"
        onClick={() => onSelectPlan(plan.id)}
      >
        {plan.cta}
      </Button>

      <ul role="list" className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check
              aria-hidden="true"
              size={20}
              className={`mt-0.5 shrink-0 ${dark ? 'text-white' : 'text-pen'}`}
            />
            <span className={dark ? 'text-ink-muted' : undefined}>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Pricing({ onSelectPlan }) {
  const [period, setPeriod] = useState('monthly')

  return (
    <Section id="pricing">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="pricing-title"
            className="max-w-2xl font-display text-h2 font-medium text-balance"
          >
            Pricing that starts at zero
          </h2>
          <p className="mt-4 max-w-xl text-lead text-ink-soft">
            Start on the free plan. Move up when you send more contracts or add teammates.
          </p>
        </div>

        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex self-start rounded-lg border border-line bg-sheet p-1"
        >
          {periods.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={period === item.id}
              onClick={() => setPeriod(item.id)}
              className={`h-11 cursor-pointer rounded-md px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen ${
                period === item.id ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} period={period} onSelectPlan={onSelectPlan} />
        ))}
      </div>
    </Section>
  )
}
