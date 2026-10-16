import { Arrow } from './Arrow'
export function SystemVisual() {
  return (
    <div
      className="system-visual"
      role="img"
      aria-label="Ark Builders connects consulting, software and hardware from strategy through delivery"
    >
      <div className="visual-top">
        <span>
          <i /> CONNECTED THINKING
        </span>
        <span>ARK / 01</span>
      </div>
      <div className="orbit orbit-outer" />
      <div className="orbit orbit-inner" />
      <div className="axis axis-h" />
      <div className="axis axis-v" />
      <div className="system-center">
        <span className="mini-mark">A</span>
        <b>ARK</b>
        <small>BUILDERS</small>
      </div>
      <div className="system-node node-consult">
        <span>01 / STRATEGY</span>
        <b>Consulting</b>
        <small>See the way forward</small>
      </div>
      <div className="system-node node-software">
        <span>02 / SYSTEMS</span>
        <b>Software</b>
        <small>Make it work better</small>
      </div>
      <div className="system-node node-hardware">
        <span>03 / FOUNDATION</span>
        <b>Hardware</b>
        <small>Build on solid ground</small>
      </div>
      <span className="orbit-dot" />
      <div className="visual-bottom">
        <span>THINK CLEARLY. BUILD PURPOSEFULLY.</span>
        <Arrow />
      </div>
    </div>
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
