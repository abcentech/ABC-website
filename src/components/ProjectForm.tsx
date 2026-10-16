import { Arrow } from './Arrow'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Service } from '../content/types'

const budgets = [
  '$1k–$5k',
  '$5k–$15k',
  '$15k–$30k',
  '$30k–$50k',
  '$50k–$100k',
  'Above $100k',
  'Not sure',
]
export function ProjectForm({ services }: { services: Service[] }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const link = useRef<HTMLAnchorElement>(null)
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (String(data.get('website') || '')) {
      setError('Please leave the website field empty.')
      return
    }
    const get = (key: string) => String(data.get(key) || '').trim()
    if (!get('name') || !get('organization') || !get('country') || get('description').length < 30) {
      setError(
        'Please include your name, organization, country and at least 30 characters about the project.',
      )
      return
    }
    const brief = [
      'Hello Ark Builders, I’d like to discuss a project.',
      '',
      `Name: ${get('name')}`,
      `Organization: ${get('organization')}`,
      `Work email: ${get('email')}`,
      `Country: ${get('country')}`,
      `Service: ${get('service')}`,
      `Budget: ${get('budget')}`,
      `Desired start: ${get('start') || 'Flexible / to discuss'}`,
      '',
      get('description'),
    ].join('\n')
    setError('')
    setMessage(brief)
    requestAnimationFrame(() => link.current?.focus())
  }
  return (
    <form
      className="brief-form"
      onSubmit={prepare}
      onChange={() => {
        if (message) setMessage('')
      }}
    >
      <div className="form-intro">
        <span className="eyebrow">YOUR PROJECT, IN CONTEXT</span>
        <h2>Tell us what you’re building.</h2>
        <p>
          Prepare a brief, then review and send it in WhatsApp. Nothing is submitted or stored on
          this website.
        </p>
      </div>
      <div className="form-grid">
        <label>
          Full name <span aria-hidden="true">*</span>
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Organization <span aria-hidden="true">*</span>
          <input name="organization" autoComplete="organization" required maxLength={160} />
        </label>
        <label>
          Work email <span aria-hidden="true">*</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label>
          Country <span aria-hidden="true">*</span>
          <input
            name="country"
            autoComplete="country-name"
            required
            maxLength={100}
            placeholder="e.g. Nigeria"
          />
        </label>
        <label>
          Service required <span aria-hidden="true">*</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Multiple services / not sure</option>
          </select>
        </label>
        <label>
          Estimated budget (USD) <span aria-hidden="true">*</span>
          <select name="budget" required defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="full">
          Desired project start date <span className="optional">(optional)</span>
          <input name="start" type="date" />
        </label>
        <label className="full">
          What problem should we help you solve? <span aria-hidden="true">*</span>
          <textarea
            name="description"
            required
            minLength={30}
            maxLength={2000}
            rows={5}
            placeholder="Tell us about your goals, users, current systems and what a good outcome looks like."
          />
          <small>
            30–2,000 characters. Please leave out passwords, personal records and confidential
            client data.
          </small>
        </label>
      </div>
      <div className="attachment-note">
        <Arrow />
        <p>
          <b>Have a supporting document?</b> Share it directly in WhatsApp after starting the
          conversation. This website does not upload or retain files.
        </p>
      </div>
      <label className="honeypot" aria-hidden="true">
        Your website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="check-label">
        <input type="checkbox" required name="consent" />
        <span>
          I understand that my brief will open in WhatsApp, where I choose whether to send it. I
          have read the <a href="/privacy">privacy notice</a>.
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button dark" type="submit">
        Prepare WhatsApp brief <Arrow />
      </button>
      <p className="form-footnote">
        Required fields are marked *. No automatic message, email or booking is sent.
      </p>
      {message && (
        <div className="handoff" role="status">
          <h3>Your brief is ready to review.</h3>
          <p>
            It has not been sent. Open WhatsApp, check the message and press Send there. On a shared
            device, consider whether to include your contact details.
          </p>
          <pre>{message}</pre>
          <a
            ref={link}
            className="button"
            href={`https://wa.me/2348066512844?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            data-event="brief_whatsapp_open"
          >
            Review & send in WhatsApp <Arrow />
          </a>
          <p>
            If WhatsApp is unavailable,{' '}
            <a href="mailto:toni@arkbuilders.com.ng">email Ark Builders</a> using your own mail app.
          </p>
        </div>
      )}
    </form>
  )
}
