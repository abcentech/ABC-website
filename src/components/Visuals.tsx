import { Arrow } from './Arrow'
export function SystemVisual() {
  return (
    <div
      className="system-visual nexus-visual"
      role="img"
      aria-label="An illuminated architectural gateway representing connected consulting, software and hardware"
    >
      <picture className="hero-artwork">
        <source media="(max-width: 540px)" srcSet="/art/ark-nexus-480.webp" />
        <img
          src="/art/ark-nexus-960.webp"
          width="960"
          height="960"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="visual-vignette" aria-hidden="true" />
      <div className="visual-top">
        <span>
          <i /> THE ART OF BUILDING BETTER
        </span>
        <span>ARK / 01</span>
      </div>
      <svg className="nexus-traces" viewBox="0 0 600 640" fill="none" aria-hidden="true">
        <path
          className="trace-base"
          d="M54 180h82l32 32v80M546 262h-70l-30 30v130M98 490h100l35-35h72"
        />
        <path
          className="trace-light"
          d="M54 180h82l32 32v80M546 262h-70l-30 30v130M98 490h100l35-35h72"
        />
        <circle cx="54" cy="180" r="4" />
        <circle cx="546" cy="262" r="4" />
        <circle cx="98" cy="490" r="4" />
        <path className="trace-corner" d="M26 58V26h32m484 0h32v32M26 582v32h32m484 0h32v-32" />
      </svg>
      <div className="visual-disciplines">
        <span>
          01 <b>Think.</b>
        </span>
        <span>
          02 <b>Build.</b>
        </span>
        <span>
          03 <b>Connect.</b>
        </span>
      </div>
      <div className="visual-bottom">
        <span>THREE CAPABILITIES. ONE CONNECTED PARTNER.</span>
        <Arrow />
      </div>
    </div>
  )
}
export function CapabilityGlyph({ kind }: { kind: number }) {
  return (
    <svg
      className="capability-glyph"
      width="34"
      height="34"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {kind === 0 ? (
        <>
          <path d="M8 31V11l12-6 12 6v20L20 37 8 31Zm0-20 12 6 12-6M20 17v20" />
          <path className="glyph-accent" d="M8 20 20 26l12-6M20 5v12" />
        </>
      ) : kind === 1 ? (
        <>
          <path d="m20 4 16 9-16 9L4 13 20 4Z" />
          <path d="m4 21 16 9 16-9M4 29l16 9 16-9" />
          <path className="glyph-accent" d="m12 13 8 4 8-4" />
        </>
      ) : (
        <>
          <rect x="7" y="5" width="26" height="30" rx="2" />
          <path d="M7 15h26M7 25h26M13 10h10m-10 10h10m-10 10h10" />
          <path className="glyph-accent" d="M27 10h1m-1 10h1m-1 10h1" />
        </>
      )}
    </svg>
  )
}
export function DeliveryDiagram() {
  return (
    <figure className="delivery-map">
      <svg viewBox="0 0 1000 160" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path className="delivery-line" d="M30 80H970M170 38h170l42 42m200 0 42 42h170" />
        <path className="delivery-signal" d="M30 80H970" />
        <circle cx="166" cy="80" r="27" />
        <circle cx="500" cy="80" r="27" />
        <circle cx="834" cy="80" r="27" />
      </svg>
      <div className="delivery-stations">
        {[
          ['Clarity', 'Understand the right problem.'],
          ['Craft', 'Make the right thing work.'],
          ['Continuity', 'Build for what comes next.'],
        ].map(([title, copy], i) => (
          <div key={title}>
            <span className="station-icon">
              <CapabilityGlyph kind={i} />
            </span>
            <b>{title}</b>
            <small>{copy}</small>
          </div>
        ))}
      </div>
      <figcaption>CONSULTING → SOFTWARE → HARDWARE · CONNECTED FROM THE START</figcaption>
    </figure>
  )
}
export function ProjectVisual({ kind, large = false }: { kind: string; large?: boolean }) {
  return (
    <div
      className={`project-visual ${kind === 'cold-chain' ? 'cold' : 'news'} ${large ? 'large' : ''}`}
    >
      {kind === 'cold-chain' ? (
        <div
          className="cold-concept"
          aria-label="Concept diagram of the agricultural cooling service journey"
        >
          <div className="concept-bar">
            <span>AGRICULTURE / DIGITAL SYSTEMS</span>
            <Arrow />
          </div>
          <div className="cold-heading">
            Better information.
            <br />
            <em>Across the chain.</em>
          </div>
          <div className="chain">
            <div>
              <span>01</span>
              <b>Grower</b>
              <small>Harvest information</small>
            </div>
            <i>→</i>
            <div>
              <span>02</span>
              <b>Cooling service</b>
              <small>Service coordination</small>
            </div>
            <i>→</i>
            <div>
              <span>03</span>
              <b>Market</b>
              <small>Informed decisions</small>
            </div>
          </div>
          <div className="concept-foot">
            <span>FIELD → FACILITY → MARKET</span>
            <span>◉</span>
          </div>
        </div>
      ) : (
        <div
          className="news-concept"
          aria-label="Concept editorial layout for Church Times Nigeria"
        >
          <div className="news-masthead">
            Church Times <small>NIGERIA</small>
          </div>
          <div className="news-nav">
            NEWS <span>FAITH & COMMUNITY</span> PERSPECTIVES
          </div>
          <div className="news-layout">
            <div>
              <div className="concept-photo">
                <span>
                  COMMUNITY
                  <br />
                  IN FOCUS.
                </span>
                <i />
              </div>
              <small>EDITORIAL CONCEPT</small>
              <h3>
                Stories that bring
                <br />a community together.
              </h3>
            </div>
            <div className="news-sidebar">
              <b>Perspectives</b>
              <p>A space for meaningful conversations.</p>
              <hr />
              <b>From the community</b>
              <p>People. Events. Shared experiences.</p>
              <hr />
              <span>READ. REFLECT. CONNECT.</span>
            </div>
          </div>
        </div>
      )}
      <span className="concept-label">ILLUSTRATIVE CONCEPT · NOT A PRODUCT SCREENSHOT</span>
    </div>
  )
}
