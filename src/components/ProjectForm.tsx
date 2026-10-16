import { useRef, useState, useSyncExternalStore } from 'react'
import type { FormEvent } from 'react'
import { Arrow } from './Arrow'
import { ServiceIcon } from './ServiceIcon'
import type { Service } from '../content/types'
import { budgetRanges, createBriefMessage, emptyBrief, stepError } from '../projectBrief'
import type { BriefValues } from '../projectBrief'
const subscribe = () => () => {}
const requestedService = () => new URLSearchParams(location.search).get('service') || ''
const steps = ['Your project', 'Scope & timing', 'Your details', 'Review']
const serviceHints: Record<string, string> = {
  'website-development': 'A better digital presence',
  'custom-software': 'Systems shaped around your work',
  'mobile-app-development': 'Useful wherever work happens',
  'ai-automation': 'Less repetitive work',
  'technology-consulting': 'Clarity before commitment',
  'hardware-infrastructure': 'A stronger foundation',
}
export function ProjectForm({ services }: { services: Service[] }) {
  const requested = useSyncExternalStore(subscribe, requestedService, () => '')
  const [values, setValues] = useState<BriefValues>({ ...emptyBrief })
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [copyState, setCopyState] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const messageDetails = useRef<HTMLDetailsElement>(null)
  const selected = values.service || (services.some((s) => s.slug === requested) ? requested : '')
  const current = { ...values, service: selected }
  const title = services.find((s) => s.slug === selected)?.title || 'Multiple services / not sure'
  const message = createBriefMessage(current, title)
  function update<K extends keyof BriefValues>(key: K, value: BriefValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }))
    setError('')
    setCopyState('')
  }
  function go(next: number) {
    setError('')
    setCopyState('')
    setStep(next)
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true })
      form.current?.scrollIntoView({
        block: 'start',
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
    })
  }
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const problem = stepError(
      step,
      current,
      services.map((s) => s.slug),
    )
    if (problem) {
      setError(problem)
      return
    }
    if (step < 3) go(step + 1)
  }
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(message)
      setCopyState('Brief copied. Paste it into your preferred conversation.')
    } catch {
      if (messageDetails.current) messageDetails.current.open = true
      setCopyState('Copy is unavailable in this browser. You can select the full message below.')
    }
  }
  const stageTitles = [
    'What can we help you build?',
    'What would better look like?',
    'Who are we building with?',
    'A considered beginning.',
  ]
  const stageCopy = [
    'Choose the closest fit. We’ll work out the details together.',
    'A little context helps us ask better questions.',
    'A few details so we can pick up the conversation.',
    'Check your brief, then open WhatsApp to review and send it.',
  ]
  return (
    <form
      ref={form}
      className="brief-form guided-brief"
      onSubmit={advance}
      aria-label="Project brief"
    >
      <ol className="brief-progress" aria-label="Project brief progress">
        {steps.map((label, index) => (
          <li key={label} className={index <= step ? 'reached' : ''}>
            {index < step ? (
              <button type="button" onClick={() => go(index)} aria-label={`Return to ${label}`}>
                <span className="step-marker" aria-hidden="true">
                  ✓
                </span>
                <span>{label}</span>
              </button>
            ) : (
              <span aria-current={index === step ? 'step' : undefined}>
                <span className="step-marker" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="brief-stage" key={step}>
        <div className="form-intro">
          <span className="eyebrow">
            0{step + 1} / {steps[step]}
          </span>
          <h2 ref={heading} tabIndex={-1}>
            {stageTitles[step]}
          </h2>
          <p>{stageCopy[step]}</p>
        </div>
        <fieldset className="brief-fields" hidden={step !== 0} disabled={step !== 0}>
          <legend className="sr-only">Service required</legend>
          <div className="service-choices">
            {services.map((service) => (
              <label
                className={`service-choice ${selected === service.slug ? 'selected' : ''}`}
                key={service.slug}
              >
                <input
                  type="radio"
                  name="service"
                  value={service.slug}
                  checked={selected === service.slug}
                  onChange={() => update('service', service.slug)}
                  required={step === 0}
                />
                <ServiceIcon kind={service.slug} />
                <span>
                  <b>{service.title}</b>
                  <small>{serviceHints[service.slug] || service.eyebrow}</small>
                </span>
                <span className="choice-check" aria-hidden="true">
                  ✓
                </span>
              </label>
            ))}
          </div>
          <label className={`unsure-choice ${selected === 'not-sure' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="service"
              value="not-sure"
              checked={selected === 'not-sure'}
              onChange={() => update('service', 'not-sure')}
            />
            <span>Something more connected?</span>
            <b>
              Let’s figure it out together <Arrow />
            </b>
          </label>
          <p className="brief-reassurance">
            <span aria-hidden="true">↳</span> A focused website or an ambitious platform. Let’s
            start with the need.
          </p>
        </fieldset>
        <fieldset className="brief-fields" hidden={step !== 1} disabled={step !== 1}>
          <legend className="sr-only">Project scope and timing</legend>
          <label htmlFor="project-description">
            What problem should we help you solve? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="project-description"
            name="description"
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            minLength={30}
            maxLength={2000}
            required={step === 1}
            rows={4}
            placeholder="The challenge, the people it affects, and what you’d like to change…"
            aria-describedby="description-hint"
          />
          <div className="field-meta">
            <span id="description-hint">
              30–2,000 characters. Please leave out confidential information.
            </span>
            <span aria-hidden="true">{values.description.length}/2000</span>
          </div>
          <fieldset className="budget-field">
            <legend>
              Estimated budget <span>(USD)</span> <span aria-hidden="true">*</span>
            </legend>
            <div className="budget-choices">
              {budgetRanges.map((budget) => (
                <label key={budget} className={values.budget === budget ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="budget"
                    value={budget}
                    checked={values.budget === budget}
                    onChange={() => update('budget', budget)}
                    required={step === 1}
                  />
                  <span>{budget}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="date-field" htmlFor="project-start">
            Desired project start date <span className="optional">(optional)</span>
            <input
              id="project-start"
              type="date"
              name="start"
              value={values.start}
              onChange={(e) => update('start', e.target.value)}
            />
            <small>Leave this open if you’d like to discuss the timing.</small>
          </label>
        </fieldset>
        <fieldset className="brief-fields" hidden={step !== 2} disabled={step !== 2}>
          <legend className="sr-only">Your contact details</legend>
          <div className="form-grid">
            <label>
              Full name <span aria-hidden="true">*</span>
              <input
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => update('name', e.target.value)}
                required={step === 2}
                maxLength={100}
                placeholder="Your full name"
              />
            </label>
            <label>
              Organization <span aria-hidden="true">*</span>
              <input
                name="organization"
                autoComplete="organization"
                value={values.organization}
                onChange={(e) => update('organization', e.target.value)}
                required={step === 2}
                maxLength={160}
                placeholder="Company or organization"
              />
            </label>
            <label>
              Work email <span aria-hidden="true">*</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => update('email', e.target.value)}
                required={step === 2}
                maxLength={200}
                placeholder="you@organization.com"
              />
            </label>
            <label>
              Country <span aria-hidden="true">*</span>
              <input
                name="country"
                autoComplete="country-name"
                value={values.country}
                onChange={(e) => update('country', e.target.value)}
                required={step === 2}
                maxLength={100}
                placeholder="e.g. Nigeria"
              />
            </label>
          </div>
          <div className="attachment-note">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <path d="m8 12 5-5a3 3 0 0 1 4 4l-7 7a5 5 0 0 1-7-7l8-8a7 7 0 0 1 10 10l-7 7" />
            </svg>
            <p>
              <b>Have a brief or supporting document?</b> Share it directly in WhatsApp after we
              connect.
            </p>
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => update('consent', e.target.checked)}
              required={step === 2}
            />
            <span>
              I have read the <a href="/privacy">privacy notice</a> and understand that I choose
              whether to send this brief in WhatsApp.
            </span>
          </label>
        </fieldset>
        {step === 3 && (
          <div className="brief-review">
            <div className="review-card">
              <div className="review-heading">
                <span className="eyebrow">THE PROJECT</span>
                <button type="button" onClick={() => go(0)}>
                  Edit project <Arrow />
                </button>
              </div>
              <h3>{title}</h3>
              <p className="review-description">{values.description.trim()}</p>
              <dl>
                <div>
                  <dt>Budget</dt>
                  <dd>{values.budget}</dd>
                </div>
                <div>
                  <dt>Desired start</dt>
                  <dd>{values.start || 'Flexible / to discuss'}</dd>
                </div>
              </dl>
              <button type="button" className="review-edit-scope" onClick={() => go(1)}>
                Edit scope & timing
              </button>
            </div>
            <div className="review-contact">
              <div>
                <b>{values.name.trim()}</b>
                <span>
                  {values.organization.trim()} · {values.country.trim()}
                </span>
                <span>{values.email.trim()}</span>
              </div>
              <button type="button" onClick={() => go(2)}>
                Edit details <Arrow />
              </button>
            </div>
            <details className="message-details" ref={messageDetails}>
              <summary>
                View the full WhatsApp message <span aria-hidden="true">+</span>
              </summary>
              <pre>{message}</pre>
            </details>
            <p className="review-notice">
              Your brief has not been sent. WhatsApp opens with the message ready for you to review
              and send.
            </p>
          </div>
        )}
      </div>
      <label className="honeypot" aria-hidden="true">
        Your website
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="brief-actions">
        <div>
          {step > 0 ? (
            <button type="button" className="brief-back" onClick={() => go(step - 1)}>
              <span aria-hidden="true">←</span> Back
            </button>
          ) : (
            <span className="brief-step-count">STEP 01 OF 04</span>
          )}
        </div>
        {step < 3 ? (
          <button type="submit" className="button brief-next">
            Continue <Arrow />
          </button>
        ) : (
          <a
            className="button"
            href={`https://wa.me/2348066512844?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            data-event="brief_whatsapp_open"
          >
            Continue to WhatsApp <Arrow />
          </a>
        )}
      </div>
      <div className="brief-bottom-note">
        {step === 3 ? (
          <>
            <button type="button" onClick={copyBrief}>
              Copy brief instead
            </button>
            <span>
              Need another way?{' '}
              <a
                href={`mailto:toni@arkbuilders.com.ng?subject=${encodeURIComponent(`Project enquiry — ${values.organization.trim()}`)}&body=${encodeURIComponent(message)}`}
              >
                Email this brief
              </a>
            </span>
          </>
        ) : (
          <>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            <span>Your details stay in this tab until you choose to share them.</span>
          </>
        )}
      </div>
      {copyState && (
        <p className="copy-status" role="status">
          {copyState}
        </p>
      )}
    </form>
  )
}
