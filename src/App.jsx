import { useState } from 'react'
import Footer from './components/layout/Footer.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Contact from './components/sections/Contact.jsx'
import Features from './components/sections/Features.jsx'
import Hero from './components/sections/Hero.jsx'
import HowItWorks from './components/sections/HowItWorks.jsx'
import Pricing from './components/sections/Pricing.jsx'
import { sectionIds } from './data/content.js'
import { useActiveSection } from './hooks/useActiveSection.js'
import { focusField } from './utils/focus.js'
import { FIELD_IDS } from './utils/validate.js'

export default function App() {
  const [plan, setPlan] = useState('pro')
  const [planClicks, setPlanClicks] = useState(0)
  const activeId = useActiveSection(sectionIds)

  // A pricing button preselects its plan in the demo form, then the page scrolls there.
  function handleSelectPlan(id) {
    setPlan(id)
    setPlanClicks((count) => count + 1)
    focusField(FIELD_IDS.name)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar activeId={activeId} />
      <main id="main">
        <Hero onBookDemo={() => focusField(FIELD_IDS.name)} />
        <Features />
        <HowItWorks />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Contact plan={plan} onPlanChange={setPlan} resetSignal={planClicks} />
      </main>
      <Footer />
    </>
  )
}
