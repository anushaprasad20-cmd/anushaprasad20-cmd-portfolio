
// portfolio-sections.jsx v5 — Anusha Prasad, full name, clean animations

const { useState, useEffect, useRef } = React;

// ── CLIP-MASK REVEAL (the core animation) ─────────────────────────
function Reveal({ children, delay = 0, tag = 'span', className = '' }) {
  const ref = useRef(null);
  const [up, setUp] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setUp(true); obs.disconnect(); }
    }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const Tag = tag;
  return (
    <Tag className={`rmask ${className}`} ref={ref}>
      <span className={`rinner ${up ? 'rinner--up' : ''}`} style={{ transitionDelay: `${delay}s` }}>
        {children}
      </span>
    </Tag>
  );
}

// ── MAGNETIC BUTTON (hatom / buttermax effect) ────────────────────
function Magnetic({ children, strength = 0.35, className = '', href, onClick }) {
  const ref = useRef(null);
  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  const props = { ref, onMouseMove: onMove, onMouseLeave: onLeave, className };
  if (href) return <a {...props} href={href} style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', display: 'inline-flex' }}>{children}</a>;
  return <div {...props} style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', display: 'inline-flex' }} onClick={onClick}>{children}</div>;
}

// ── LOGO SVG ─────────────────────────────────────────────────────
function Logo() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="19" fill="#BDD99F"/>
      {/* Stylised "A" — two diagonal strokes + crossbar */}
      <path d="M11.5 27L17.5 11.5H20.5L26.5 27" stroke="#080808" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 22H24.5" stroke="#080808" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Dot accent */}
      <circle cx="28" cy="12" r="1.6" fill="#080808"/>
    </svg>
  );
}

// ── CURSOR ────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const p = useRef({ x: -200, y: -200 }), r = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
  const [big, setBig] = useState(false);
  useEffect(() => {
    const mv = e => { p.current = { x: e.clientX, y: e.clientY }; };
    const over = e => setBig(!!e.target.closest('a,button,[data-mag]'));
    window.addEventListener('mousemove', mv);
    document.addEventListener('mouseover', over);
    const tick = () => {
      if (dot.current) { dot.current.style.left = p.current.x+'px'; dot.current.style.top = p.current.y+'px'; }
      r.current.x += (p.current.x - r.current.x) * 0.1;
      r.current.y += (p.current.y - r.current.y) * 0.1;
      if (ring.current) { ring.current.style.left = r.current.x+'px'; ring.current.style.top = r.current.y+'px'; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', mv); document.removeEventListener('mouseover', over); cancelAnimationFrame(raf.current); };
  }, []);
  return (
    <>
      <div ref={dot} className="cur-dot" />
      <div ref={ring} className="cur-ring" style={{
        width: big ? 50 : 28, height: big ? 50 : 28,
        borderColor: big ? 'rgba(189,217,159,0.6)' : 'rgba(189,217,159,0.28)',
        transition: 'width .35s cubic-bezier(0.16,1,0.3,1), height .35s cubic-bezier(0.16,1,0.3,1), border-color .3s'
      }} />
    </>
  );
}

// ── NAV ──────────────────────────────────────────────────────────
const RESUME_URL = 'https://drive.google.com/file/d/1pCGSOcK_WixaAsxsnxSUG0tcQRmeFyM7/view';

function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Projects', href: '#projects' },
    { label: 'About',    href: 'About.html' },
    { label: 'Contact',  href: '#contact'   },
  ];

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__pill">
        <Magnetic href="#hero" className="nav__logo" strength={0.2}>
          <Logo />
        </Magnetic>
        <div className="nav__links">
          {links.map(l => (
            <a key={l.label} href={l.href}
              className={`nav__link wf-nav${activeSection === l.label.toLowerCase() ? ' nav__link--active' : ''}`}>
              <span className="wf-fill" />
              {l.label}
            </a>
          ))}
          <Magnetic href={RESUME_URL} className="nav__resume" strength={0.15}>
            Resume ↗
          </Magnetic>
        </div>
      </div>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────
// Full name: "Hello, I'm Anusha Prasad"
// ANUSHA scrambles in; PRASAD is outline — both ALWAYS set
function useScramble(target, active) {
  const C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [o, setO] = useState(target); // start with target so never empty
  const f = useRef(0), raf = useRef(null);
  useEffect(() => {
    if (!active) return;
    f.current = 0;
    const len = target.length;
    const total = len * 3.4;
    const tick = () => {
      let idx = 0;
      setO(target.split('').map(ch => {
        if (ch === ' ') return ' ';
        const t = (idx++ / len) * total;
        return f.current > t ? ch : C[Math.floor(Math.random() * C.length)];
      }).join(''));
      f.current++;
      if (f.current < total + 4) raf.current = requestAnimationFrame(tick);
      else setO(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target]);
  return o;
}

function Hero() {
  const [go, setGo] = useState(false);
  const firstName = useScramble('ANUSHA', go);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setGo(true), 200);
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      if (bgRef.current) bgRef.current.style.transform = `scale(${1 + p * 0.04})`;
      if (contentRef.current) {
        contentRef.current.style.opacity = Math.max(0, 1 - p * 2.4).toFixed(3);
        contentRef.current.style.transform = `translateY(${(p * -24).toFixed(1)}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <section className="hero" id="hero">
      <div ref={bgRef} className="hero-bg" />

      <div ref={contentRef} className="hero-content">
        {/* Top meta */}
        <div className="hero-meta">
          <span className="mono faint">UX Designer &amp; Researcher</span>
          <span className="mono faint">Chicago · 2025</span>
        </div>

        {/* Main display */}
        <div className="hero-body">
          <div className="hero-greeting">Hello, I'm</div>
          <h1 className="hero-title">
            <span className="hero-line hero-first">{firstName}</span>
            <span className="hero-line hero-last">PRASAD</span>
          </h1>
        </div>

        {/* Bottom row */}
        <div className="hero-foot">
          <p className="hero-sub">
            MS Human-Computer Interaction<br />
            DePaul University, Chicago
          </p>
          <div className="hero-actions">
            <Magnetic href="#projects" className="btn-primary" strength={0.2}>
              View Work <span className="hero-arrow">↓</span>
            </Magnetic>
            <Magnetic href={RESUME_URL} className="btn-ghost" strength={0.15}>
              Resume ↗
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <span className="mono faint" style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>scroll</span>
        <div className="hero-scroll-line" />
      </div>

      {/* Decorative corner tag */}
      <div className="hero-corner-tag">
        <span className="mono faint" style={{ fontSize: 10, letterSpacing: '0.14em' }}>Anusha Prasad © 2026</span>
      </div>
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────────
function Marquee() {
  const items = ['User Research', 'Prototyping', 'Interaction Design', 'Content Strategy', 'Usability Testing', 'Information Architecture', 'HCI', 'Visual Design', 'Mixed Methods'];
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee__inner">
        {doubled.map((item, i) => (
          <span key={i} className="marquee__item">
            <span className="marquee__sep">—</span>{item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── BIO ──────────────────────────────────────────────────────────
function BioSection() {
  return (
    <section className="bio" id="bio">
      <div className="bio__inner">
        <div className="bio__label">
          <Reveal tag="div"><span className="mono faint">02 — Introduction</span></Reveal>
        </div>
        <div className="bio__quote">
          <Reveal tag="div" delay={0.06}><p className="bio__text">I fit into every stage</p></Reveal>
          <Reveal tag="div" delay={0.16}><p className="bio__text">of the <em>product lifecycle</em> —</p></Reveal>
          <Reveal tag="div" delay={0.28}><p className="bio__text">from <em>discovery</em> to <em>launch</em>.</p></Reveal>
          <Reveal tag="div" delay={0.44}>
            <div className="bio__cta-row">
              <Magnetic href="About.html" className="bio__cta" strength={0.18}>
                About me →
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────────
const PROJECTS = [
  { id:1, num:'01', title:'Unwind', sub:'From Tracking to Intervention', type:'Mixed-Method UX Research', year:'2025', tools:'Figma · FigJam · Mixed Methods', desc:'Designing the exit from sleep procrastination — the behavioral loop that the platforms keeping you up will never fix themselves.', img:'assets/project1-hero.png', accent:'#BDD99F' },
  { id:2, num:'02', title:'DemonHacks', sub:'DePaul Hackathon Sprint', type:'UX Design Sprint · 48h', year:'2025', tools:'Figma · FigJam · React', desc:'Rapid-cycle design and prototyping under pressure — accessible, user-centered solutions in a 48-hour hackathon environment.', img:null, accent:'#F5A623' },
  { id:3, num:'03', title:'IA Study', sub:'Information Architecture', type:'Accessibility & IA Research', year:'2025', tools:'Card Sorting · Tree Testing', desc:'Restructuring complex information hierarchies for improved accessibility and cognitive load reduction across platforms.', img:null, accent:'#C77DFF' },
];

function getCardStyle(i, prog, n) {
  if (i === 0) {
    const s = 1 - Math.min(prog, 0.75) * 0.08;
    const y = -Math.min(prog, 0.75) * 22;
    const o = 1 - Math.min(prog, 0.95) * 0.35;
    return { transform: `scale(${s.toFixed(4)}) translateY(${y.toFixed(1)}px)`, opacity: o.toFixed(3), zIndex: n };
  }
  const start = (i / n) * 0.82;
  const enter = Math.max(0, Math.min((prog - start) / 0.28, 1));
  const ease = 1 - Math.pow(1 - enter, 3);
  return { transform: `translateY(${((1-ease)*80).toFixed(2)}%) scale(${(0.96 + ease*0.04).toFixed(3)})`, opacity: ease.toFixed(3), zIndex: n + i * 2 };
}

function ProjectCard({ p, style }) {
  const imgRef = useRef(null);
  const cardRef = useRef(null);

  // Image parallax
  useEffect(() => {
    const fn = () => {
      if (!imgRef.current) return;
      const r = imgRef.current.getBoundingClientRect();
      const pr = Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / (window.innerHeight * 0.5)));
      imgRef.current.style.transform = `scale(${1 + pr * 0.06}) translateY(${-pr * 12}px)`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div ref={cardRef} className="pcard" style={{ ...style, '--accent': p.accent }}>
      <div className="pcard__img" style={{ background: `${p.accent}0D` }}>
        {p.img
          ? <img ref={imgRef} src={p.img} alt={p.title} />
          : <div ref={imgRef} className="pcard__empty">
              <span className="mono" style={{ color:`${p.accent}40`, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase' }}>{p.type}</span>
            </div>}
        <div className="pcard__img-tag mono" style={{ color: p.accent }}>{p.num} / {PROJECTS.length}</div>
      </div>
      <div className="pcard__body">
        <div className="pcard__head">
          <span className="pcard__num mono" style={{ color: p.accent }}>{p.num}</span>
          <span className="mono faint" style={{ fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase' }}>{p.type}</span>
          <span className="mono faint" style={{ marginLeft:'auto', fontSize:11 }}>{p.year}</span>
        </div>
        <h3 className="pcard__title">{p.title}</h3>
        <p className="pcard__sub" style={{ color: p.accent }}>{p.sub}</p>
        <p className="pcard__desc">{p.desc}</p>
        <div className="pcard__foot">
          <span className="mono faint" style={{ fontSize:11 }}>{p.tools}</span>
          <a href="#" className="pcard__link" style={{ color: p.accent }} data-mag="true">
            <span className="pcard__link-fill" style={{ background: p.accent }} />
            View Project →
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const wrapRef = useRef(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const fn = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const total = wrapRef.current.offsetHeight - window.innerHeight;
      setProg(Math.min(Math.max(0, -rect.top) / Math.max(total, 1), 1));
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <section className="projects" id="projects" ref={wrapRef} style={{ height: `${PROJECTS.length * 100 + 60}vh` }}>
      <div className="projects__sticky">
        <div className="projects__hdr">
          <Reveal tag="div"><span className="mono faint">03 — Selected Work</span></Reveal>
          <Reveal tag="div" delay={0.1}><h2 className="section-title">Recent <em>Projects</em></h2></Reveal>
        </div>
        <div className="card-arena">
          {PROJECTS.map((p, i) => (
            <div key={p.id} className="card-slot">
              <ProjectCard p={p} style={getCardStyle(i, prog, PROJECTS.length)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ───────────────────────────────────────────────────────
const SKILLS = [
  { name: 'User Research & Usability Testing', tools: 'Interviews · Surveys · Observation' },
  { name: 'Interaction & Visual Design',       tools: 'Figma · Wireframing · Prototyping' },
  { name: 'Information Architecture',          tools: 'Card Sorting · Tree Testing · IA Maps' },
  { name: 'Content Strategy',                  tools: 'Copy · Narratives · Positioning' },
  { name: 'Human-Centered Design Thinking',    tools: 'Research Synthesis · Ethics · Systems' },
];

function SkillsSection() {
  const ref = useRef(null);
  const [rev, setRev] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRev(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills__inner">
        <div className="skills__hdr">
          <Reveal tag="div"><span className="mono faint">04 — Expertise</span></Reveal>
          <Reveal tag="div" delay={0.1}><h2 className="section-title">What I <em>Bring</em></h2></Reveal>
        </div>
        <div className="skills__list">
          {SKILLS.map((s, i) => (
            <div key={s.name} className={`skill-row${rev ? ' skill-row--vis' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="skill-row__num mono faint">0{i+1}</span>
              <span className="skill-row__name">{s.name}</span>
              <span className="skill-row__tools mono faint">{s.tools}</span>
              <span className="skill-row__arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────
function FooterSection() {
  const ref = useRef(null);
  const [rev, setRev] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRev(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <footer className="footer" id="contact" ref={ref}>
      <div className="footer__line" style={{ transform: rev ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 1.8s cubic-bezier(0.16,1,0.3,1)' }} />
      <div className="footer__inner">
        <Reveal tag="div"><span className="mono faint footer__lbl">05 — Get In Touch</span></Reveal>
        <div className="footer__title-wrap">
          <Reveal tag="div" delay={0.1}><span className="footer__tline">Let's work</span></Reveal>
          <Reveal tag="div" delay={0.22}><span className="footer__tline footer__tline--em"><em>together.</em></span></Reveal>
        </div>
        <Reveal tag="div" delay={0.38}>
          <Magnetic href="mailto:anushaprasad20@gmail.com" className="footer__email" strength={0.1}>
            anushaprasad20@gmail.com <span className="footer__earrow">↗</span>
          </Magnetic>
        </Reveal>
        <div className="footer__bottom">
          <div className="footer__socials">
            {[['LinkedIn','https://linkedin.com'],['Resume', RESUME_URL]].map(([l,h]) => (
              <Magnetic key={l} href={h} className="footer__social" strength={0.12}>
                {l} <span style={{ opacity:.45, fontSize:11 }}>↗</span>
              </Magnetic>
            ))}
          </div>
          <div className="footer__rhs">
            <span className="mono faint" style={{ fontSize:11 }}>Chicago, IL · 2026</span>
            <span className="footer__copy">© 2026 Anusha Prasad</span>
          </div>
        </div>
      </div>
      <div className="footer__bg" aria-hidden="true">AP</div>
    </footer>
  );
}

Object.assign(window, { Cursor, Nav, Hero, Marquee, BioSection, ProjectsSection, SkillsSection, FooterSection, Reveal, Magnetic, Logo });
