import { useEffect, useRef, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import Button from '../ui/Button.jsx'
import FormField from '../ui/FormField.jsx'
import Section from '../ui/Section.jsx'
import { contactDetails, plans, teamSizes } from '../../data/content.js'
import { FIELD_IDS, FIELD_ORDER, MESSAGE_LIMIT, validate } from '../../utils/validate.js'

const emptyValues = { name: '', email: '', company: '', teamSize: '', message: '' }

const detailLink =
  'rounded-sm text-pen underline underline-offset-4 hover:text-pen-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen'

// `plan` and `onPlanChange` live in App, so the pricing buttons can preselect a plan here.
// `resetSignal` changes each time a pricing button is clicked; it reopens the form after a success.
export default function Contact({ plan, onPlanChange, resetSignal }) {
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | success
  const [seenSignal, setSeenSignal] = useState(resetSignal)
  const timer = useRef(null)
  const successRef = useRef(null)

  if (seenSignal !== resetSignal) {
    setSeenSignal(resetSignal)
    if (status === 'success') {
      setStatus('idle')
      setValues(emptyValues)
      setErrors({})
      setAttempted(false)
    }
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  function handleChange(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    // After the first submit, errors update as the person types.
    if (attempted) setErrors(validate({ ...next, plan }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (status === 'sending') return

    const found = validate({ ...values, plan })
    setErrors(found)
    setAttempted(true)

    const firstInvalid = FIELD_ORDER.find((key) => found[key])
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus()
      return
    }

    // No backend: pretend to send, then show the success message.
    setStatus('sending')
    timer.current = window.setTimeout(() => setStatus('success'), 800)
  }

  function resetForm() {
    setValues(emptyValues)
    setErrors({})
    setAttempted(false)
    setStatus('idle')
  }

  const errorCount = Object.keys(errors).length
  const selectedPlan = plans.find((item) => item.id === plan)

  return (
    <Section id="contact" tone="sheet">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 id="contact-title" className="font-display text-h2 font-medium text-balance">
            Book a demo
          </h2>
          <p className="mt-4 max-w-md text-lead text-ink-soft">
            Tell us a little about your work. We will reply within one working day to agree a time.
          </p>

          <dl className="mt-10 space-y-5">
            <div>
              <dt className="text-sm text-ink-soft">Email</dt>
              <dd>
                <a href={`mailto:${contactDetails.email}`} className={detailLink}>
                  {contactDetails.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">Phone</dt>
              <dd>
                <a href={contactDetails.phoneHref} className={detailLink}>
                  {contactDetails.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">Office</dt>
              <dd>{contactDetails.address}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">Hours</dt>
              <dd>{contactDetails.hours}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-md border border-line bg-paper p-6 sm:p-8">
          {status === 'success' ? (
            <div ref={successRef} tabIndex={-1} role="status" className="outline-none">
              <CircleCheck aria-hidden="true" size={36} className="text-signed" />
              <h3 className="mt-4 font-display text-h3 font-semibold">Demo requested</h3>
              <p className="mt-3 max-w-md text-ink-soft">
                We will email{' '}
                <strong className="font-medium text-ink">{values.email.trim()}</strong> within one
                working day to agree a time. You asked about the {selectedPlan?.name} plan.
              </p>
              <Button variant="secondary" className="mt-8" onClick={resetForm}>
                Send another request
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} aria-label="Demo request">
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <FormField
                  id={FIELD_IDS.name}
                  name="name"
                  label="Full name"
                  placeholder="Priya Sharma…"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <FormField
                  id={FIELD_IDS.email}
                  name="email"
                  label="Work email"
                  type="email"
                  inputMode="email"
                  placeholder="name@company.com…"
                  autoComplete="email"
                  spellCheck={false}
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <FormField
                  id={FIELD_IDS.company}
                  name="company"
                  label="Company (optional)"
                  placeholder="Studio Mehta…"
                  autoComplete="organization"
                  value={values.company}
                  onChange={handleChange}
                />
                <FormField
                  id={FIELD_IDS.teamSize}
                  name="teamSize"
                  as="select"
                  label="Team size"
                  value={values.teamSize}
                  onChange={handleChange}
                  error={errors.teamSize}
                >
                  <option value="">Select a team size</option>
                  {teamSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </FormField>
                <FormField
                  id={FIELD_IDS.plan}
                  name="plan"
                  as="select"
                  label="Plan"
                  className="sm:col-span-2"
                  value={plan}
                  onChange={(event) => onPlanChange(event.target.value)}
                >
                  {plans.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </FormField>
                <FormField
                  id={FIELD_IDS.message}
                  name="message"
                  as="textarea"
                  label="Message (optional)"
                  placeholder="What would you like to see in the demo…"
                  className="sm:col-span-2"
                  value={values.message}
                  onChange={handleChange}
                  hint={`${values.message.length} of ${MESSAGE_LIMIT} characters`}
                  error={errors.message}
                />
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Request demo'}
                </Button>
                <p aria-live="polite" className="text-sm text-alert empty:hidden">
                  {errorCount > 0
                    ? `Fix the ${errorCount} marked ${errorCount === 1 ? 'field' : 'fields'}, then request the demo again.`
                    : ''}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}
