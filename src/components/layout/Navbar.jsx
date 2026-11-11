import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Logo from '../ui/Logo.jsx'
import { navLinks } from '../../data/content.js'

export default function Navbar({ activeId }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  // Esc closes the mobile menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!open) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const desktopLink = (id) =>
    `inline-flex h-11 items-center border-b-2 text-base transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen ${
      activeId === id
        ? 'border-pen font-medium text-ink'
        : 'border-transparent text-ink-soft hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-(--header-h) w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#home"
          aria-label="Inkline, back to top"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen"
        >
          <Logo />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={activeId === link.id ? 'location' : undefined}
                    className={desktopLink(link.id)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button href="#pricing" size="sm">
            Get started
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen md:hidden"
        >
          {open ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-line bg-paper md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-5 py-3 sm:px-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={activeId === link.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
                className={`flex h-12 items-center border-b border-line text-lg focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-pen ${
                  activeId === link.id ? 'font-medium text-pen' : 'text-ink'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="py-4">
            <Button href="#pricing" fullWidth onClick={() => setOpen(false)}>
              Get started
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
