import type { Service } from '../content/types'
import { Arrow } from './Arrow'
import { ProjectForm } from './ProjectForm'
export function ProjectStudio({ services }: { services: Service[] }) {
  return (
    <section className="project-studio">
      <div className="project-studio-intro">
        <div className="studio-breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>Start a project</span>
        </div>
        <div className="studio-intro-content">
          <span className="eyebrow">
            <i className="studio-dot" /> A GOOD PLACE TO BEGIN
          </span>
          <h1>
            Good things start with a <em>conversation.</em>
          </h1>
          <p className="studio-lead">
            An idea to explore. A system to improve. A challenge that needs a fresh perspective.
          </p>
          <p className="studio-support">
            Tell us what you have in mind. We’ll work out a sensible next step, together.
          </p>
          <div className="studio-expect">
            <span className="eyebrow">WHAT HAPPENS NEXT</span>
            <ol>
              <li>
                <span aria-hidden="true">01</span>
                <div>
                  <b>You share the context.</b>
                  <p>A few details about your project, your goals and your organization.</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">02</span>
                <div>
                  <b>We explore the possibilities.</b>
                  <p>A conversation about fit, scope and the right way forward.</p>
                </div>
              </li>
            </ol>
          </div>
          <div className="studio-direct">
            <div>
              <span className="direct-icon" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.7-4.5A9 9 0 1 1 21 11.5Z" />
                  <path d="M8.5 7.5c0 4 4 8 8 8" />
                </svg>
              </span>
              <p>Prefer to talk it through?</p>
            </div>
            <a
              href="https://wa.me/2348066512844"
              target="_blank"
              rel="noreferrer"
              data-event="contact_whatsapp"
            >
              Chat on WhatsApp <Arrow />
            </a>
          </div>
          <div className="studio-location">
            <span aria-hidden="true">◉</span> LAGOS, NIGERIA <span className="location-divider" />{' '}
            INTERNATIONAL ENQUIRIES WELCOME
          </div>
        </div>
      </div>
      <ProjectForm services={services} />
    </section>
  )
}
