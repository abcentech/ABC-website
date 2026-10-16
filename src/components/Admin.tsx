import { ThemePicker } from './ThemePicker'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Content } from '../content/types'
type Lead = {
  id: string
  name: string
  organization: string
  email: string
  notes: string
  status: string
  created: string
}
type Report = {
  events: { day: string; event: string; path: string; count: number }[]
  audit: { id: number; action: string; created: string }[]
}
export function Admin() {
  const [csrf, setCsrf] = useState('')
  const [status, setStatus] = useState('')
  const [isError, setIsError] = useState(false)
  const [content, setContent] = useState<Content | null>(null)
  const [revision, setRevision] = useState(0)
  const [tab, setTab] = useState('projects')
  const [draft, setDraft] = useState('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [report, setReport] = useState<Report | null>(null)
  function notice(message: string, error = false) {
    setStatus(message)
    setIsError(error)
  }
  async function request(path: string, method = 'GET', body?: unknown, auth = csrf) {
    const response = await fetch(`/api/admin/${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': auth },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    let result
    try {
      result = await response.json()
    } catch {
      throw new Error('The administration service is unavailable on this host.')
    }
    if (!response.ok) {
      if (response.status === 401) setCsrf('')
      throw new Error([result.error, ...(result.details || [])].join(' '))
    }
    return result
  }
  useEffect(() => {
    let active = true
    fetch('/api/admin/session')
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json()
          if (active) setCsrf(data.csrf)
        }
      })
      .catch(() => {
        /* Login screen remains available. */
      })
    return () => {
      active = false
    }
  }, [])
  useEffect(() => {
    if (!csrf) return
    let active = true
    fetch('/api/admin/content')
      .then(async (r) => {
        if (!r.ok) throw new Error('Unable to load content. Sign in again.')
        return r.json()
      })
      .then((data) => {
        if (active) {
          setContent(data.content)
          setRevision(data.revision)
          setDraft(JSON.stringify(data.content.projects, null, 2))
        }
      })
      .catch((e) => {
        if (active) notice(e.message, true)
      })
    return () => {
      active = false
    }
  }, [csrf])
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    try {
      const data = new FormData(form)
      const result = await request('login', 'POST', { password: data.get('password') })
      setCsrf(result.csrf)
      form.reset()
      notice('Signed in. Content changes are saved as drafts until exported and rebuilt.')
    } catch (e) {
      notice((e as Error).message, true)
    }
  }
  async function selectTab(next: string) {
    if (
      content &&
      ['projects', 'services', 'industries', 'team', 'insights', 'testimonials', 'faqs'].includes(
        tab,
      ) &&
      draft !== JSON.stringify(content[tab as keyof Content], null, 2) &&
      !window.confirm('Discard unsaved edits in this section?')
    )
      return
    setTab(next)
    notice('')
    try {
      if (next === 'leads') setLeads((await request('leads')).leads)
      else if (next === 'report') setReport(await request('report'))
      else if (content) setDraft(JSON.stringify(content[next as keyof Content], null, 2))
    } catch (e) {
      notice((e as Error).message, true)
    }
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const next = { ...content, [tab]: JSON.parse(draft) }
      const result = await request('content', 'PUT', {
        content: next,
        revision,
        approved: new FormData(e.currentTarget).has('approved'),
      })
      setContent(next as Content)
      setRevision(result.revision)
      notice('Draft saved. Export the content and rebuild staging to review before publishing.')
    } catch (e) {
      notice((e as Error).message, true)
    }
  }
  function download() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob),
      a = document.createElement('a')
    a.href = url
    a.download = 'ark-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  async function addLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget,
      data = new FormData(form)
    try {
      await request('leads', 'POST', {
        name: data.get('name'),
        organization: data.get('organization'),
        email: data.get('email'),
        notes: data.get('notes'),
        status: 'New',
        consent: data.has('consent'),
      })
      setLeads((await request('leads')).leads)
      form.reset()
      notice('Enquiry recorded.')
    } catch (e) {
      notice((e as Error).message, true)
    }
  }
  async function updateLead(id: string, next: string) {
    try {
      await request(`leads/${id}`, 'PATCH', { status: next })
      setLeads((await request('leads')).leads)
      notice('Status updated.')
    } catch (e) {
      notice((e as Error).message, true)
    }
  }
  async function removeLead(id: string) {
    if (!window.confirm('Permanently delete this enquiry record?')) return
    try {
      await request(`leads/${id}`, 'DELETE')
      setLeads((await request('leads')).leads)
      notice('Enquiry deleted.')
    } catch (e) {
      notice((e as Error).message, true)
    }
  }
  return (
    <main className="admin">
      <div className="admin-controls">
        <a href="/" className="text-link">
          ← Return to Ark Builders
        </a>
        <ThemePicker />
      </div>
      <h1>Content & enquiries</h1>
      <p>Authorized administrators only. Public enquiries go directly to WhatsApp.</p>
      {status && (
        <p className={`admin-status ${isError ? 'error' : ''}`} role={isError ? 'alert' : 'status'}>
          {status}
        </p>
      )}
      {!csrf ? (
        <form onSubmit={login}>
          <label>
            Administrator password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              maxLength={500}
            />
          </label>
          <button className="button" type="submit">
            Sign in
          </button>
          <p className="caption">
            Administration needs a configured server and secure password hash. There is no default
            password.
          </p>
        </form>
      ) : (
        <>
          <div>
            <button onClick={download} disabled={!content}>
              Export saved content
            </button>
            <button
              onClick={async () => {
                try {
                  await request('logout', 'POST')
                  setCsrf('')
                  setContent(null)
                  setLeads([])
                  setReport(null)
                  notice('Signed out.')
                } catch (e) {
                  notice((e as Error).message, true)
                }
              }}
            >
              Sign out
            </button>
          </div>
          <p className="admin-note">
            Draft revision {revision}. Publication requires export, validation, a staging build and
            deployment approval. Do not add unverified delivery claims, confidential documents or
            unapproved testimonials. <a href="/capabilities">Public capability page ↗</a>
          </p>
          <nav className="admin-tabs" aria-label="Administration sections">
            {[
              'projects',
              'services',
              'industries',
              'team',
              'insights',
              'faqs',
              'testimonials',
              'leads',
              'report',
            ].map((t) => (
              <button key={t} aria-pressed={t === tab} onClick={() => selectTab(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
          {tab === 'leads' ? (
            <>
              <h2>Enquiry register</h2>
              <p>
                This is a manual register for conversations you are authorized to record. Opening
                WhatsApp on the website does not create a lead here. Do not paste confidential
                messages or unnecessary personal information.
              </p>
              <form className="lead-form" onSubmit={addLead}>
                <div className="form-grid">
                  <label>
                    Name
                    <input name="name" required maxLength={100} />
                  </label>
                  <label>
                    Organization
                    <input name="organization" required maxLength={160} />
                  </label>
                  <label>
                    Email (optional)
                    <input type="email" name="email" maxLength={200} />
                  </label>
                  <label className="full">
                    Follow-up notes
                    <textarea name="notes" required maxLength={4000} />
                  </label>
                </div>
                <label className="check-label">
                  <input name="consent" type="checkbox" required />I have permission and a valid
                  business purpose to store this enquiry.
                </label>
                <button type="submit">Add enquiry</button>
              </form>
              <div className="table-wrap">
                <table>
                  <caption>Recent enquiries (up to 500)</caption>
                  <thead>
                    <tr>
                      <th scope="col">Contact</th>
                      <th scope="col">Notes</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.id}>
                        <td>
                          {l.name}
                          <br />
                          {l.organization}
                          <br />
                          {l.email}
                        </td>
                        <td>{l.notes}</td>
                        <td>
                          <select
                            aria-label={`Status for ${l.name}`}
                            value={l.status}
                            onChange={(e) => updateLead(l.id, e.target.value)}
                          >
                            {['New', 'Qualifying', 'Proposal', 'Won', 'Closed'].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button onClick={() => removeLead(l.id)}>Delete {l.name}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!leads.length && <p>No recorded enquiries.</p>}
            </>
          ) : tab === 'report' ? (
            <>
              <h2>Interaction counts & audit</h2>
              <p>
                Counts represent consented CTA interactions, including WhatsApp handoffs. They do
                not establish that a message was sent. No enquiry text is collected by analytics.
              </p>
              <div className="table-wrap">
                <table>
                  <caption>Aggregate interactions</caption>
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Event</th>
                      <th scope="col">Page</th>
                      <th scope="col">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report?.events.map((e) => (
                      <tr key={`${e.day}-${e.event}-${e.path}`}>
                        <td>{e.day}</td>
                        <td>{e.event}</td>
                        <td>{e.path}</td>
                        <td>{e.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2>Recent administrative actions</h2>
              {report?.audit.map((a) => (
                <p key={a.id} className="caption">
                  {a.created} — {a.action}
                </p>
              ))}
            </>
          ) : content ? (
            <form onSubmit={save}>
              <h2>Edit {tab}</h2>
              <p>
                Structured JSON editor. Plain text is rendered safely; HTML and scripts are never
                executed. Validation runs on the server before saving. Keep existing fields and use
                the documented schema in <code>server/schema.mjs</code>.
              </p>
              <label htmlFor="content-editor">{tab} content</label>
              <textarea
                id="content-editor"
                spellCheck={false}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={24}
              />
              <label className="check-label">
                <input type="checkbox" name="approved" required />I have checked factual accuracy,
                client permission and suitability for public disclosure.
              </label>
              <button type="submit">Save content draft</button>
            </form>
          ) : (
            <p>Loading content…</p>
          )}
        </>
      )}
    </main>
  )
}
