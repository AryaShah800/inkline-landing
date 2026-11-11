import { useEffect, useState } from 'react'

// Returns the id of the section currently crossing the middle of the viewport.
// `ids` must be a stable array (define it outside the component).
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (sections.length === 0 || !('IntersectionObserver' in window)) return undefined

    // A thin band in the middle of the screen: whichever section touches it is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((entry) => entry.isIntersecting).at(-1)
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return active
}
