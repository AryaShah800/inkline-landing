import Logo from '../ui/Logo.jsx'
import { contactDetails, footerNote, navLinks } from '../../data/content.js'

const linkClass =
  'rounded-sm text-ink-muted underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function Footer() {
  return (
    <footer className="bg-ink text-ink-muted">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="text-white">
            <Logo inverse />
            <p className="mt-4 max-w-sm text-base text-ink-muted">
              Proposals, contracts and online signatures for freelancers and small agencies.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-base font-medium text-white">Explore</h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-base font-medium text-white">Get in touch</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${contactDetails.email}`} className={linkClass}>
                  {contactDetails.email}
                </a>
              </li>
              <li>
                <a href={contactDetails.phoneHref} className={linkClass}>
                  {contactDetails.phone}
                </a>
              </li>
              <li>{contactDetails.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Inkline. {footerNote}</p>
          <a href="#home" className={linkClass}>
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
