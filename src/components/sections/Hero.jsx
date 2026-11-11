import Button from '../ui/Button.jsx'
import Section from '../ui/Section.jsx'
import ContractCard from './ContractCard.jsx'
import { hero } from '../../data/content.js'

export default function Hero({ onBookDemo }) {
  return (
    <Section id="home" size="hero">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
        <div>
          <h1
            id="home-title"
            className="max-w-2xl font-display text-display font-medium text-balance"
          >
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ink-soft">{hero.description}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" onClick={onBookDemo}>
              Book a demo
            </Button>
            <Button href="#pricing" variant="secondary">
              See pricing
            </Button>
          </div>
          <p className="mt-5 text-sm text-ink-soft">{hero.note}</p>
        </div>

        <div className="mb-8 w-full max-w-lg lg:mb-0 lg:max-w-none">
          <ContractCard />
        </div>
      </div>
    </Section>
  )
}
