import { ThemePicker } from './components/ThemePicker'
import { useMotion } from './useMotion'
import { Arrow } from './components/Arrow'
import { useEffect, useRef, useState } from 'react'
import type { Content, FAQ, Project, Service } from './content/types'
import source from './content/site.json'
import { SystemVisual, ProjectVisual, DeliveryDiagram, CapabilityGlyph } from './components/Visuals'
import { ProjectForm } from './components/ProjectForm'
import { Consent } from './components/Consent'
import { consentValue } from './analytics'
import { Admin } from './components/Admin'

function Button({
  href = '/start-project',
  children = 'Start a Project',
  secondary = false,
}: {
  href?: string
  children?: React.ReactNode
  secondary?: boolean
}) {
  return (
    <a className={`button ${secondary ? 'secondary' : ''}`} href={href} data-event="project_cta">
      {children}
      <Arrow />
    </a>
  )
}
function Brand() {
  return (
    <a href="/" className="brand" aria-label="Ark Builders home">
      <span className="brand-mark">A</span>
      <span>
        ARK
        <br />
        <b>BUILDERS</b>
      </span>
    </a>
  )
}
function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  return (
    <header className="site-header">
      <Brand />
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <nav
        id="main-nav"
        className={open ? 'open' : ''}
        aria-label="Main navigation"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            toggle.current?.focus()
          }
        }}
      >
        {[
          ['Services', '/services'],
          ['Work', '/work'],
          ['Industries', '/industries'],
          ['Capabilities', '/capabilities'],
          ['Contact', '/contact'],
        ].map(([label, href]) => (
          <a key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <ThemePicker />
      <a className="header-cta" href="/start-project" data-event="header_cta">
        Start a Project <Arrow />
      </a>
    </header>
  )
}
function Footer({ content }: { content: Content }) {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Brand />
          <p>
            Clear thinking.
            <br />
            Purposeful technology.
            <br />
            Lasting value.
          </p>
          <span className="eyebrow">LAGOS, NIGERIA · OPEN TO THE WORLD</span>
        </div>
        <div>
          <h2>What we do</h2>
          {content.services.map((s) => (
            <a key={s.slug} href={`/services/${s.slug}`}>
              {s.title}
            </a>
          ))}
        </div>
        <div>
          <h2>Explore</h2>
          <a href="/work">Selected work</a>
          <a href="/industries">Industries</a>
          <a href="/capabilities">Our capabilities</a>
          <a href="/insights">Insights</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <h2>Let’s talk</h2>
          <a href="mailto:toni@arkbuilders.com.ng">toni@arkbuilders.com.ng</a>
          <a href="tel:+2348066512844">+234 806 651 2844</a>
          <a
            href="https://wa.me/2348066512844"
            target="_blank"
            rel="noreferrer"
            data-event="footer_whatsapp"
          >
            Connect on WhatsApp <Arrow />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Ark Builders. Under promise, over deliver.</p>
        <a href="/privacy">Privacy & cookies</a>
        <a href="/capability-statement.pdf" download>
          Capability statement <span aria-hidden="true">↓</span>
        </a>
      </div>
    </footer>
  )
}
function CTA() {
  return (
    <section id="contact" className="closing">
      <div className="closing-orbit" aria-hidden="true" />
      <div>
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>
          Have a Technology Challenge?
          <br />
          <em>Let’s Build the Solution.</em>
        </h2>
        <p>
          Bring the ambition. Bring the complexity.
          <br />
          Let’s work out the right next step, together.
        </p>
      </div>
      <Button />
    </section>
  )
}
function FAQs({ questions }: { questions: FAQ[] }) {
  return (
    <div className="faq-list">
      {questions.map((q) => (
        <details key={q.question}>
          <summary>
            {q.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{q.answer}</p>
        </details>
      ))}
    </div>
  )
}
function SectionHead({
  number,
  label,
  title,
  text,
}: {
  number: string
  label: string
  title: string
  text?: string
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {number} / {label}
        </span>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  )
}
function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <a
        href={`/work/${project.slug}`}
        className="visual-link"
        aria-label={`Explore ${project.name}`}
      >
        {project.visual !== 'none' ? (
          <ProjectVisual kind={project.visual} />
        ) : (
          <div className="project-placeholder">
            <span className="eyebrow">ARK BUILDERS / SELECTED WORK</span>
            <strong>{project.name}</strong>
            <span>{project.status}</span>
          </div>
        )}
      </a>
      <div className="project-info">
        <div>
          <span className="eyebrow">{project.category}</span>
          <h3>
            <a href={`/work/${project.slug}`}>{project.name}</a>
          </h3>
          <p>{project.summary}</p>
        </div>
        <a
          className="round-link"
          href={`/work/${project.slug}`}
          aria-label={`Read ${project.name} case study`}
        >
          <Arrow />
        </a>
      </div>
      <span className="status">
        <i /> {project.status}
      </span>
    </article>
  )
}
const steps = [
  [
    'Discover & define',
    'Align on the problem, the people and the outcome. Turn uncertainty into a clear scope and solution architecture.',
  ],
  [
    'Design & validate',
    'Make complex journeys feel simple. Test the important ideas before investing in the full build.',
  ],
  [
    'Build & assure',
    'Deliver in focused iterations, with reviews, quality assurance and security checks appropriate to the scope.',
  ],
  [
    'Launch & enable',
    'Plan deployment, document the system and transfer knowledge. Agree maintenance around the way your team works.',
  ],
]
function Approach() {
  return (
    <section id="method" className="approach section">
      <SectionHead
        number="04"
        label="WHY WORK WITH ARK BUILDERS?"
        title="Good technology starts with good thinking."
        text="A considered process. Clear responsibilities. Working evidence at every stage."
      />
      <div className="steps">
        {steps.map(([title, desc], i) => (
          <article key={title}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
      <a className="text-link" href="/capabilities">
        Our approach, in more detail <Arrow />
      </a>
    </section>
  )
}
function Home({ content }: { content: Content }) {
  return (
    <>
      <section id="top" className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <i className="live-dot" /> CONSULTING · SOFTWARE · HARDWARE
          </span>
          <h1>
            We Build Technology That <em>Moves Businesses Forward.</em>
          </h1>
          <p>
            From custom software and digital platforms to AI-ready systems and technology
            infrastructure, Ark Builders designs and delivers solutions that help organizations
            grow, operate efficiently and create lasting value.
          </p>
          <div className="hero-actions">
            <Button />
            <Button href="/work" secondary>
              Explore Our Work
            </Button>
          </div>
          <div className="hero-note">
            <span className="small-line" /> BUILT IN NIGERIA. THINKING BEYOND BORDERS.
          </div>
        </div>
        <SystemVisual />
      </section>
      <section className="pillars" aria-label="Three core capabilities">
        {[
          [
            'CONSULTING',
            'Technology strategy, digital transformation, systems planning and AI readiness.',
            '/services/technology-consulting',
          ],
          [
            'SOFTWARE',
            'Websites, custom applications, enterprise platforms, mobile apps, dashboards, portals and integrations.',
            '/services/custom-software',
          ],
          [
            'HARDWARE',
            'Technology infrastructure, hardware integration, deployment and support.',
            '/services/hardware-infrastructure',
          ],
        ].map(([label, desc, href], i) => (
          <a key={label} href={href}>
            <CapabilityGlyph kind={i} />
            <span className="eyebrow">
              0{i + 1} / {label}
            </span>
            <h2>
              {['Think clearly.', 'Build purposefully.', 'Connect everything.'][i]} <Arrow />
            </h2>
            <p>{desc}</p>
          </a>
        ))}
      </section>
      <section id="experience" className="section selected-work">
        <SectionHead
          number="01"
          label="SELECTED WORK"
          title="Real challenges. Purposeful solutions."
          text="An introduction to our software contribution and a publishing platform in development. Clear about the work. Honest about its status."
        />
        <div className="project-grid">
          {content.projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <a href="/work" className="text-link">
          Explore our work <Arrow />
        </a>
      </section>
      <section id="capabilities" className="services-section section">
        <SectionHead
          number="02"
          label="WHAT WE CAN BUILD TOGETHER"
          title="From the first question to the final handover."
          text="A connected technology partner, whether you need a focused website or a more ambitious business platform."
        />
        <DeliveryDiagram />
        <div className="service-list">
          {content.services.map((s, i) => (
            <a key={s.slug} href={`/services/${s.slug}`}>
              <span className="service-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.intro}</p>
              <Arrow />
            </a>
          ))}
        </div>
      </section>
      <section className="industry-strip section">
        <div>
          <span className="eyebrow">03 / CONTEXT MATTERS</span>
          <h2>
            Built around your world.
            <br />
            <em>Not a template.</em>
          </h2>
          <p>
            Different sectors. Different constraints. We begin by understanding how your
            organization actually works.
          </p>
          <a className="text-link" href="/industries">
            Explore industries <Arrow />
          </a>
        </div>
        <div className="sector-tags">
          {content.industries.map((i) => (
            <a href="/industries" key={i.name}>
              {i.name}
              <Arrow />
            </a>
          ))}
        </div>
      </section>
      <Approach />
      {content.testimonials.length > 0 && (
        <section className="section">
          <SectionHead number="05" label="CLIENT PERSPECTIVES" title="In their own words." />
          {content.testimonials.map((t) => (
            <blockquote key={t.attribution}>
              <p>“{t.quote}”</p>
              <cite>{t.attribution}</cite>
            </blockquote>
          ))}
        </section>
      )}
      <CTA />
    </>
  )
}
function PageHero({
  label,
  title,
  text,
  children,
}: {
  label: string
  title: string
  text: string
  children?: React.ReactNode
}) {
  return (
    <section className="page-hero">
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <span>{label}</span>
      </div>
      <span className="eyebrow">ARK BUILDERS / {label}</span>
      <h1>{title}</h1>
      <p>{text}</p>
      {children}
    </section>
  )
}
function ServicePage({ service, content }: { service: Service; content: Content }) {
  const related = content.projects.find((p) => p.slug === service.related)
  return (
    <>
      <PageHero label={service.title} title={service.eyebrow} text={service.intro}>
        <Button>Discuss {service.title.toLowerCase()}</Button>
      </PageHero>
      <section className="section two-columns">
        <div>
          <span className="eyebrow">THE CHALLENGE</span>
          <h2>Make room for better ways of working.</h2>
          <p>{service.problem}</p>
        </div>
        <div>
          <span className="eyebrow">OUR RESPONSE</span>
          <h2>A considered solution. A practical path.</h2>
          <p>{service.solution}</p>
        </div>
      </section>
      <section className="section deliverables">
        <SectionHead
          number="01"
          label="POSSIBLE DELIVERABLES"
          title="What we can shape together."
          text="Your final scope follows discovery. These are examples of what an engagement may include."
        />
        <div className="deliverable-grid">
          {service.deliverables.map((d, i) => (
            <article key={d}>
              <span>0{i + 1}</span>
              <h3>{d}</h3>
            </article>
          ))}
        </div>
      </section>
      <Approach />
      <section className="section">
        <SectionHead
          number="02"
          label="RELEVANT CONTEXT"
          title={related ? 'A closer look at our work.' : 'Start with your use case.'}
          text={
            related
              ? 'The linked case study identifies the project status and evidence available. It does not imply delivery of every service listed here.'
              : 'We do not publish unverified sector experience. Tell us what you need and we can discuss a relevant approach.'
          }
        />
        {related ? (
          <div className="single-project">
            <ProjectCard project={related} />
          </div>
        ) : (
          <Button>Discuss your requirements</Button>
        )}
      </section>
      <section className="section faq-section">
        <div>
          <span className="eyebrow">BEFORE WE BEGIN</span>
          <h2>A few useful answers.</h2>
        </div>
        <FAQs questions={service.questions} />
      </section>
      <CTA />
    </>
  )
}
function Work({ content }: { content: Content }) {
  return (
    <>
      <PageHero
        label="Work"
        title="Technology with a purpose."
        text="Explore a software engineering contribution in agriculture and a publishing platform in development. No inflated metrics. No borrowed achievements."
      />
      <section className="section project-grid">
        {content.projects.map((p) => (
          <ProjectCard project={p} key={p.slug} />
        ))}
      </section>
      <section className="section note-section">
        <h2>The story behind the screen matters.</h2>
        <p>
          We publish project scope and outcomes only when they can be attributed and shared
          responsibly. Additional engagements will appear after verification and client approval.
        </p>
      </section>
      <CTA />
    </>
  )
}
function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <PageHero label="Work" title={project.title} text={project.summary}>
        <span className="status">
          <i /> {project.status}
        </span>
      </PageHero>
      <section className="case-meta section">
        <div>
          <span className="eyebrow">CLIENT / PROJECT</span>
          <p>{project.client}</p>
        </div>
        <div>
          <span className="eyebrow">SECTOR</span>
          <p>{project.industry}</p>
        </div>
        <div>
          <span className="eyebrow">FOCUS</span>
          <p>{project.category}</p>
        </div>
      </section>
      {project.visual !== 'none' && (
        <section className="case-visual section">
          <ProjectVisual kind={project.visual} large />
          <p className="caption">{project.approval}</p>
        </section>
      )}
      <section className="section case-story">
        <aside>
          <span className="eyebrow">PROJECT CONTEXT</span>
          <h2>{project.name}</h2>
          <p className="evidence-note">{project.approval}</p>
        </aside>
        <div>
          {project.sections.map((section) => (
            <section key={section.heading}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
              {section.items.length > 0 && (
                <ul className="check-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <Button>{project.cta}</Button>
        </div>
      </section>
      <CTA />
    </>
  )
}
function Industries({ content }: { content: Content }) {
  return (
    <>
      <PageHero
        label="Industries"
        title="Understand the context. Build the right thing."
        text="We bring a practical technology approach to organizations with different users, responsibilities and operating environments. Each engagement begins with discovery."
      />
      <section className="section industry-grid">
        {content.industries.map((industry, i) => {
          const p = content.projects.find((p) => p.slug === industry.related)
          return (
            <article key={industry.name}>
              <span className="eyebrow">0{i + 1} / SECTOR FOCUS</span>
              <h2>{industry.name}</h2>
              <p>{industry.description}</p>
              {p ? (
                <a href={`/work/${p.slug}`} className="text-link">
                  {p.name} <Arrow />
                </a>
              ) : (
                <a href="/start-project" className="text-link">
                  Discuss this sector <Arrow />
                </a>
              )}
            </article>
          )
        })}
      </section>
      <section className="section note-section">
        <h2>Relevant thinking, without assumptions.</h2>
        <p>
          Sector focus describes the kinds of challenges we welcome. It does not claim specific
          clients, certifications, regulatory approvals or prior delivery where no verified case
          study is linked.
        </p>
      </section>
      <CTA />
    </>
  )
}
function Capabilities({ content }: { content: Content }) {
  return (
    <>
      <PageHero
        label="Capabilities"
        title="A clear partner for complex technology decisions."
        text="Consulting, software and hardware, brought together around your requirements. A straightforward starting point for project teams and procurement."
      >
        <a className="button" href="/capability-statement.pdf" download>
          Download capability statement <span aria-hidden="true">↓</span>
        </a>
      </PageHero>
      <section className="section two-columns">
        <div>
          <span className="eyebrow">OUR CAPABILITY</span>
          <h2>From intent to implementation.</h2>
          <p>
            Ark Builders works with organizations to clarify technology needs, design usable systems
            and support implementation. We are based in Lagos, Nigeria, and welcome local and
            international enquiries.
          </p>
        </div>
        <div>
          <span className="eyebrow">DISCUSS YOUR REQUIREMENTS</span>
          <ul className="check-list">
            {content.services.map((s) => (
              <li key={s.slug}>
                <a href={`/services/${s.slug}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Approach />
      <section className="section procurement">
        <SectionHead
          number="02"
          label="PROCUREMENT & DELIVERY"
          title="The details that make a project workable."
        />
        <div className="deliverable-grid">
          {[
            [
              'Security & data protection',
              'Agree data flows, access controls, provider responsibilities and risk-appropriate testing before implementation.',
            ],
            [
              'Quality & acceptance',
              'Define acceptance criteria, review points and testing responsibilities in the scope of work.',
            ],
            [
              'Documentation & ownership',
              'Agree handover materials, source access, intellectual property and licensing terms in the contract.',
            ],
            [
              'Support & maintenance',
              'Define the support window, responsibilities and any ongoing service arrangement explicitly.',
            ],
          ].map(([t, d]) => (
            <article key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <p className="evidence-note">
          Registration, tax documentation, client references and any required compliance evidence
          can be requested during qualification and shared subject to verification and permission.
          No certification or guarantee is implied.
        </p>
      </section>
      {content.team.length > 0 && (
        <section className="section">
          <h2>The people behind the work.</h2>
          <div className="deliverable-grid">
            {content.team.map((t) => (
              <article key={t.name}>
                <h3>{t.name}</h3>
                <b>{t.role}</b>
                <p>{t.bio}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="section faq-section">
        <h2>Useful before you enquire.</h2>
        <FAQs questions={content.faqs} />
      </section>
      <CTA />
    </>
  )
}
function Contact({ brief, content }: { brief: boolean; content: Content }) {
  return (
    <>
      <PageHero
        label={brief ? 'Start a project' : 'Contact'}
        title={brief ? 'Let’s build what comes next.' : 'A good conversation is a good start.'}
        text={
          brief
            ? 'A website, a platform, a better workflow. Tell us what you have in mind and where you want to go.'
            : 'Speak with Ark Builders about a business challenge, a project brief or procurement requirements.'
        }
      />
      <section className="section contact-layout">
        <aside className="contact-details">
          <span className="eyebrow">LET’S CONNECT</span>
          <h2>
            Tell us where
            <br />
            you want to go.
          </h2>
          <p>
            Based in Lagos, Nigeria.
            <br />
            Working with local and international organizations.
          </p>
          <a
            href="https://wa.me/2348066512844"
            className="button dark"
            target="_blank"
            rel="noreferrer"
            data-event="contact_whatsapp"
          >
            Chat on WhatsApp <Arrow />
          </a>
          <a href="mailto:toni@arkbuilders.com.ng">
            toni@arkbuilders.com.ng <Arrow />
          </a>
          <a href="tel:+2348066512844">
            +234 806 651 2844 <Arrow />
          </a>
          <div className="contact-note">
            <b>What happens next?</b>
            <p>
              We clarify your goals, assess fit and agree a useful next step. A proposal follows an
              agreed scope—not a form submission.
            </p>
          </div>
        </aside>
        <ProjectForm services={content.services} />
      </section>
    </>
  )
}
function Privacy() {
  return (
    <>
      <PageHero
        label="Privacy"
        title="Your information deserves a clear explanation."
        text="How this website handles project briefs, optional analytics and contact information."
      />
      <section className="section legal">
        <h2>Project enquiries</h2>
        <p>
          The project form prepares a message within your browser. It does not submit your personal
          information or documents to an Ark Builders server. You choose whether to open WhatsApp
          and send the message. The message text is included in the WhatsApp link, so avoid
          confidential information and consider browser history on shared devices.
        </p>
        <h2>WhatsApp and email</h2>
        <p>
          WhatsApp is a third-party service operated by Meta and is governed by its privacy terms.
          Ark Builders receives information only when you contact us. We use enquiry information to
          discuss your request and manage the resulting relationship. Do not share passwords,
          sensitive personal records or confidential client data in an initial enquiry. Email and
          telephone links open your own applications.
        </p>
        <h2 id="analytics">Optional analytics</h2>
        <p>
          Analytics is off unless you choose “Allow analytics”. The optional first-party counter
          records an approved event name, page path and aggregate count. It does not store message
          text, form fields, IP addresses, cookies or persistent visitor identifiers. An interaction
          count shows a WhatsApp handoff, not proof of a sent message or qualified lead. If the
          counter service is unavailable, the website still works.
        </p>
        <h2>Browser storage and essential sessions</h2>
        <p>
          Your appearance preference (Light, Dark or System) is stored locally in your browser and
          can be changed through the Appearance control. Your analytics preference is also stored
          locally. You can change it through Privacy settings. The public site sets no advertising
          cookies. The administration service uses an essential, expiring session cookie for
          authenticated staff.
        </p>
        <h2>Enquiry records and rights</h2>
        <p>
          Authorized staff may record information from a conversation in a private enquiry register
          to follow up. Access is limited to authorized administrators. Contact{' '}
          <a href="mailto:toni@arkbuilders.com.ng">toni@arkbuilders.com.ng</a> to ask about your
          information, request correction or deletion, or raise a privacy concern. Retention should
          be limited to what is necessary for the enquiry and any legal obligations.
        </p>
        <h2>Supporting documents</h2>
        <p>
          This website does not accept uploads. Share a document in the conversation only when
          requested and after removing unnecessary sensitive information.
        </p>
        <p className="caption">
          Last updated: 16 October 2026. Ark Builders must approve operational retention and privacy
          arrangements before activating administration on a public host.
        </p>
      </section>
    </>
  )
}
function Insights({ content, slug }: { content: Content; slug?: string }) {
  const post = content.insights.find((p) => p.slug === slug)
  if (slug && !post) return <NotFound />
  return (
    <>
      <PageHero
        label="Insights"
        title={post?.title || 'Thinking that makes technology useful.'}
        text={
          post?.summary ||
          'Notes on better systems, digital delivery and the decisions behind them.'
        }
      />
      <section className="section legal">
        {post ? (
          <>
            <p className="eyebrow">{post.published}</p>
            <div className="article-body">{post.body}</div>
          </>
        ) : content.insights.length ? (
          content.insights.map((p) => (
            <article key={p.slug}>
              <h2>
                <a href={`/insights/${p.slug}`}>{p.title}</a>
              </h2>
              <p>{p.summary}</p>
            </article>
          ))
        ) : (
          <>
            <h2>Thoughtful work takes time.</h2>
            <p>
              Our first articles are being prepared. In the meantime, explore our approach or
              discuss a technology question with us.
            </p>
            <Button href="/capabilities">Explore our capabilities</Button>
          </>
        )}
      </section>
    </>
  )
}
function NotFound() {
  return (
    <>
      <PageHero
        label="Page not found"
        title="Let’s get you back on track."
        text="This page may have moved, or the address may be incomplete."
      />
      <section className="section">
        <Button href="/">Return to the homepage</Button>
      </section>
    </>
  )
}
export default function App({
  path = '/',
  content = source as Content,
}: {
  path?: string
  content?: Content
}) {
  useMotion(path)
  useEffect(() => {
    const record = (e: MouseEvent) => {
      if (consentValue() !== 'accepted') return
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-event]')
      if (target)
        navigator.sendBeacon?.(
          '/api/events',
          new Blob([JSON.stringify({ event: target.dataset.event, path })], {
            type: 'application/json',
          }),
        )
    }
    document.addEventListener('click', record)
    return () => document.removeEventListener('click', record)
  }, [path])
  if (path === '/admin') return <Admin />
  const service = content.services.find((s) => path === `/services/${s.slug}`)
  const project = content.projects.find((p) => path === `/work/${p.slug}`)
  let page
  if (path === '/') page = <Home content={content} />
  else if (service) page = <ServicePage service={service} content={content} />
  else if (project) page = <CaseStudy project={project} />
  else if (path === '/services')
    page = (
      <>
        <PageHero
          label="Services"
          title="The right expertise. A connected approach."
          text="Start with the business problem. Bring together the capabilities that help solve it."
        />
        <section className="section industry-grid">
          {content.services.map((s) => (
            <article key={s.slug}>
              <span className="eyebrow">{s.eyebrow}</span>
              <h2>
                <a href={`/services/${s.slug}`}>{s.title}</a>
              </h2>
              <p>{s.intro}</p>
              <a className="text-link" href={`/services/${s.slug}`}>
                Explore this service <Arrow />
              </a>
            </article>
          ))}
        </section>
        <CTA />
      </>
    )
  else if (path === '/work') page = <Work content={content} />
  else if (path === '/industries') page = <Industries content={content} />
  else if (path === '/capabilities') page = <Capabilities content={content} />
  else if (path === '/contact' || path === '/start-project')
    page = <Contact brief={path === '/start-project'} content={content} />
  else if (path === '/privacy') page = <Privacy />
  else if (path === '/insights' || path.startsWith('/insights/'))
    page = <Insights content={content} slug={path.split('/')[2]} />
  else page = <NotFound />
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main-content" tabIndex={-1}>
        {page}
      </main>
      <Footer content={content} />
      <Consent />
    </>
  )
}
