import { useEffect } from "react";

const clients = [
  { name: "Lagos State Government", logo: "/clients/lagos.png", className: "crest" },
  { name: "Covenant University", logo: "/clients/covenant.png", className: "wide" },
  { name: "Landmark University", logo: "/clients/landmark.png", className: "crest" },
  { name: "Ekiti State University", logo: "/clients/eksu.jpg", className: "crest" },
  { name: "Sovereign Trust Insurance Plc", logo: "/clients/sti.png", className: "wide dark-logo" },
  { name: "Kids Inspiring Nation", logo: "/clients/kin.png", className: "square" },
  { name: "Basel Energy (BASE)", logo: "/clients/base.png", className: "square" },
];

const services = [
  {
    id: "01",
    label: "ADVISE",
    title: "Consulting & AI readiness",
    copy: "We uncover where work slows down, redesign the operating model and build a responsible path from AI opportunity to adoption.",
    details: ["Process diagnostics", "AI opportunity portfolio", "Operating-model redesign", "Governance & adoption"],
  },
  {
    id: "02",
    label: "BUILD",
    title: "Software & integration",
    copy: "We turn the new way of working into dependable systems—from internal tools and customer platforms to connected enterprise workflows.",
    details: ["Custom platforms", "Workflow automation", "Systems integration", "Data & AI products"],
  },
  {
    id: "03",
    label: "DELIVER",
    title: "Hardware & infrastructure",
    copy: "We source, configure and deliver the physical technology your teams need, with clear ownership from specification through deployment.",
    details: ["Enterprise devices", "Technology procurement", "Configuration & rollout", "Lifecycle support"],
  },
];

export default function Home() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));

    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>(".hero");
    const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
    const onPointerMove = (event: PointerEvent) => {
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
      hero.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    hero?.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      hero?.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="ARK BUILDERS home"><span className="brand-mark">A</span><span>ARK<br/><b>BUILDERS</b></span></a>
        <nav aria-label="Main navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#experience">Experience</a>
          <a href="#method">Method</a>
        </nav>
        <a className="header-cta" href="#contact">Start a project <span>↗</span></a>
      </header>

      <section id="top" className="hero">
        <div className="hero-grain" aria-hidden="true"></div>
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-copy" id="main-content">
          <p className="kicker light">NIGERIA&apos;S OPERATIONAL TECHNOLOGY PARTNER</p>
          <h1>Better work.<br/><em>Built to last.</em></h1>
          <p className="hero-lead">We connect strategy, software and hardware to help ambitious organisations move faster—and build capability for an AI-ready future.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#contact">Book a working session <span>↗</span></a>
            <a className="quiet-link" href="#capabilities">Explore our capabilities <span>↓</span></a>
          </div>
          <p className="promise">UNDER PROMISE, OVER DELIVER.</p>
        </div>
        <div className="hero-system" aria-hidden="true">
          <div className="system-beam beam-one"></div>
          <div className="system-beam beam-two"></div>
          <div className="system-orbit orbit-one"></div>
          <div className="system-orbit orbit-two"></div>
          <div className="system-grid"></div>
          <i className="signal-dot dot-one"></i>
          <i className="signal-dot dot-two"></i>
          <i className="signal-dot dot-three"></i>
          <div className="system-block block-one"><span>01</span><b>CLARITY</b></div>
          <div className="system-block block-two"><span>02</span><b>SYSTEMS</b></div>
          <div className="system-block block-three"><span>03</span><b>SCALE</b></div>
          <div className="system-core"><span>ARK</span></div>
          <div className="system-caption"><span>ARK OPERATING SYSTEM</span><b>ADVISE → BUILD → DELIVER</b></div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Selected clients">
        <p>SELECTED EXPERIENCE ACROSS</p>
        <div className="trust-window">
          <div className="trust-track">
            <div className="trust-set"><span>Government</span><i></i><span>Education</span><i></i><span>Financial services</span><i></i><span>Energy</span><i></i><span>Social impact</span><i></i></div>
            <div className="trust-set" aria-hidden="true"><span>Government</span><i></i><span>Education</span><i></i><span>Financial services</span><i></i><span>Energy</span><i></i><span>Social impact</span><i></i></div>
          </div>
        </div>
      </section>

      <section className="manifesto section-shell" data-reveal>
        <div className="section-number">01 / WHY ARK</div>
        <div className="manifesto-copy">
          <p className="kicker">ONE PARTNER. THREE CAPABILITIES.</p>
          <h2>Transformation breaks at the hand-offs.<br/><em>We close the gaps.</em></h2>
          <div className="manifesto-bottom">
            <p>Strategy without delivery stays in a deck. Software without process change becomes another tool. Hardware without the right operating model gathers dust.</p>
            <p>ARK BUILDERS brings the full picture together—so every decision is connected to work your people can use and results your leaders can see.</p>
          </div>
        </div>
      </section>

      <section id="capabilities" className="capabilities">
        <div className="section-shell capability-intro" data-reveal>
          <div className="section-number">02 / CAPABILITIES</div>
          <div><p className="kicker light">FROM INTENT TO OPERATIONS</p><h2>One outcome.<br/>Every layer required.</h2></div>
        </div>
        <div className="service-stack">
          {services.map((service) => (
            <article className="service-row" key={service.id} data-reveal>
              <div className="service-id"><span>{service.id}</span><b>{service.label}</b></div>
              <h3>{service.title}</h3>
              <div className="service-copy"><p>{service.copy}</p><ul>{service.details.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <a href="#contact" aria-label={`Discuss ${service.title}`}>↗</a>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="experience section-shell" data-reveal>
        <div className="section-number">03 / EXPERIENCE</div>
        <div className="experience-content">
          <div className="experience-heading"><div><p className="kicker">SELECTED CLIENT EXPERIENCE</p><h2>Trusted where the work matters.</h2></div><p>Experience across public institutions, leading universities, a quoted company and mission-led organisations.</p></div>
          <div className="logo-wall">
            {clients.map((client) => (
              <div className="client-logo" key={client.name} data-reveal>
                <img src={client.logo} alt={`${client.name} logo`} className={client.className}/>
                <span>{client.name}</span>
              </div>
            ))}
          </div>
          <p className="credential-note">Selected organisations and projects. Logos are shown for identification; references are available in the appropriate context.</p>
        </div>
      </section>

      <section id="method" className="method">
        <div className="section-shell method-grid" data-reveal>
          <div className="section-number">04 / METHOD</div>
          <div className="method-copy"><p className="kicker light">THE ARK BUILD PATH</p><h2>Start with the constraint.<br/><em>End with momentum.</em></h2><p>We begin small enough to move decisively, then expand only when the value is visible.</p></div>
          <ol className="method-list">
            <li><span>01</span><div><b>Frame the outcome</b><p>Align leaders on the business result, boundaries and measures that matter.</p></div></li>
            <li><span>02</span><div><b>Find the friction</b><p>Map the work, systems and infrastructure standing between today and the target.</p></div></li>
            <li><span>03</span><div><b>Build what proves value</b><p>Redesign, prototype, source and test with the teams closest to the work.</p></div></li>
            <li><span>04</span><div><b>Embed and scale</b><p>Transfer capability, measure the change and make the next investment deliberate.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="principles section-shell" data-reveal>
        <div className="section-number">05 / THE DIFFERENCE</div>
        <div className="principles-content"><p className="kicker">WHAT YOU CAN EXPECT</p><h2>Enterprise discipline.<br/>Builder&apos;s mentality.</h2><div className="principle-grid"><article><span>01</span><h3>One accountable team</h3><p>Fewer vendors, fewer hand-offs and one connected view of the outcome.</p></article><article><span>02</span><h3>Local operating context</h3><p>Recommendations shaped for Nigerian teams, constraints and decision realities.</p></article><article><span>03</span><h3>Visible progress</h3><p>Clear milestones, honest trade-offs and working evidence—not theatre.</p></article></div></div>
      </section>

      <section id="contact" className="contact" data-reveal>
        <div className="contact-glow" aria-hidden="true"></div>
        <div className="contact-copy"><p className="kicker light">YOUR NEXT MOVE</p><h2>Bring us the work<br/>holding you back.</h2><p>In one focused conversation, we will clarify the opportunity and identify the most sensible next step.</p></div>
        <div className="contact-panel">
          <p>START A CONVERSATION</p>
          <a href="mailto:toni@arkbuilders.com.ng?subject=Project%20enquiry%20for%20ARK%20BUILDERS">toni@arkbuilders.com.ng <span>↗</span></a>
          <a href="tel:+2348066512844">+234 806 651 2844 <span>↗</span></a>
          <a className="whatsapp" href="https://wa.me/2348066512844?text=Hello%20ARK%20BUILDERS%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer">Continue on WhatsApp <span>↗</span></a>
          <small>No obligation. No inflated promises.</small>
        </div>
      </section>

      <footer><a href="#top" className="brand footer-brand"><span className="brand-mark">A</span><span>ARK<br/><b>BUILDERS</b></span></a><p>Consulting · Software · Hardware<br/>Lagos, Nigeria</p><p>© {new Date().getFullYear()} ARK BUILDERS CONSULTING<br/>Under promise, over deliver.</p></footer>
    </main>
  );
}
