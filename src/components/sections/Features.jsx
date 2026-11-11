import Section from '../ui/Section.jsx'
import { features } from '../../data/content.js'

// How much room each feature takes in the grid. Full class names so Tailwind can find them.
const layouts = {
  lead: 'md:col-span-2 lg:col-span-7',
  side: 'lg:col-span-5',
  third: 'lg:col-span-4',
  wide: 'md:col-span-2 lg:col-span-12',
}

export default function Features() {
  return (
    <Section id="features" tone="sheet">
      <h2 id="features-title" className="max-w-2xl font-display text-h2 font-medium text-balance">
        Everything between “yes” and a signed contract
      </h2>
      <p className="mt-4 max-w-xl text-lead text-ink-soft">
        Inkline covers the steps freelancers usually do by hand in documents and email threads.
      </p>

      {/* One bordered block; the 1px gaps show the line colour and act as dividers. */}
      <ul
        role="list"
        className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2 lg:grid-cols-12"
      >
        {features.map((feature) => {
          const Icon = feature.icon
          const isWide = feature.size === 'wide'
          const isLead = feature.size === 'lead'
          return (
            <li key={feature.title} className={`bg-sheet p-6 sm:p-8 ${layouts[feature.size]}`}>
              <div className={`flex flex-col gap-5 ${isWide ? 'md:flex-row md:gap-8' : ''}`}>
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-pen-tint text-pen">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <div>
                  <h3
                    className={`font-display font-semibold ${
                      isLead ? 'text-h3' : 'text-lead leading-snug'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-ink-soft">{feature.text}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
