
// about-sections.jsx — About page components

const { useState, useEffect, useRef } = React;

// ─── CURSOR ──────────────────────────────────────────────────────
function AboutCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const rpos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);

  useEffect(() => {
    const mv = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = (e) => {
      const isLink = e.target.closest('a,button,[data-mag]');
      const isImg = e.target.closest('.info-card__img-wrap,.ahack-photo-clip');
      if (!dotRef.current || !ringRef.current) return;
      if (isImg) {
        dotRef.current.style.width = '8px'; dotRef.current.style.height = '8px';
        ringRef.current.style.width = '88px'; ringRef.current.style.height = '88px';
        ringRef.current.style.borderColor = '#BDD99F'; ringRef.current.style.background = 'rgba(189,217,159,0.06)';
      } else if (isLink) {
        dotRef.current.style.width = '10px'; dotRef.current.style.height = '10px';
        ringRef.current.style.width = '56px'; ringRef.current.style.height = '56px';
        ringRef.current.style.borderColor = 'rgba(189,217,159,0.55)'; ringRef.current.style.background = 'rgba(189,217,159,0.05)';
      } else {
        dotRef.current.style.width = '6px'; dotRef.current.style.height = '6px';
        ringRef.current.style.width = '36px'; ringRef.current.style.height = '36px';
        ringRef.current.style.borderColor = 'rgba(255,255,255,0.25)'; ringRef.current.style.background = 'transparent';
      }
    };
    window.addEventListener('mousemove', mv);
    document.addEventListener('mouseover', over);
    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.x + 'px';
        dotRef.current.style.top = pos.current.y + 'px';
      }
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.09;
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.09;
      if (ringRef.current) {
        ringRef.current.style.left = rpos.current.x + 'px';
        ringRef.current.style.top = rpos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', mv);
      document.removeEventListener('mouseover', over);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="c-dot" style={{
        width: 6, height: 6, background: '#fff', borderRadius: '50%',
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)', mixBlendMode: 'difference',
        transition: 'width .18s cubic-bezier(0.16,1,0.3,1), height .18s cubic-bezier(0.16,1,0.3,1)'
      }}/>
      <div ref={ringRef} className="c-ring" style={{
        width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.25)',
        position: 'fixed', pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        transition: 'width .5s cubic-bezier(0.16,1,0.3,1), height .5s cubic-bezier(0.16,1,0.3,1), border-color .3s, background .3s'
      }}/>
    </>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────
function AboutNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`a-nav ${scrolled ? 'a-nav--scrolled' : ''}`}>
      <div className="a-nav__inner">
        <a href="Portfolio.html" className="a-nav__logo" data-mag="true">
          <img src="assets/logo.png" alt="AP" width="38" height="38" style={{borderRadius:'50%',objectFit:'cover',display:'block'}}/>
        </a>
        <div className="a-nav__items">
          {['Projects','About','Resume','Contact'].map(item => (
            <a key={item} href={item === 'Projects' ? 'Portfolio.html#projects' : item === 'About' ? '#' : `Portfolio.html#${item.toLowerCase()}`}
              className={`a-nav__item ${item === 'About' ? 'a-nav__item--active' : ''}`}
              data-mag="true">{item}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── HELLO STICKER ────────────────────────────────────────────────
function HelloSticker() {
  return (
    <div className="sticker">
      <div className="sticker__top">
        <span className="sticker__hello">HELLO</span>
        <span className="sticker__subtitle">my name is</span>
      </div>
      <div className="sticker__body">
        <span className="sticker__name">Anusha Prasad<br/>UX Designer &amp; Researcher</span>
      </div>
      <div className="sticker__bottom" />
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────
function AboutHero() {
  const bgRef = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <section className="ah-hero">
      <div ref={bgRef} className="ah-hero__bg" />
      <div className="ah-hero__content">
        <div className="ah-hero__left">
          <h1 className="ah-hero__title">
            <span className="ah-hero__title-line">About <em>Me</em></span>
          </h1>
          <p className="ah-hero__tagline">MS Human-Computer Interaction<br/>DePaul University, Chicago</p>
          <div className="ah-hero__dots">
            <span className="dot-pill">UX Research</span>
            <span className="dot-pill">Product Design</span>
            <span className="dot-pill">Content Strategy</span>
          </div>
        </div>
        <div className="ah-hero__right">
          <div className="sticker-wrap">
            <HelloSticker />
          </div>
        </div>
      </div>
      <div className="ah-hero__scroll">
        <span className="scroll-lbl">scroll</span>
        <div className="scroll-ln" />
      </div>
    </section>
  );
}

// ─── QUOTE SECTION ────────────────────────────────────────────────
function QuoteSection() {
  const ref = useRef(null);
  const [rev, setRev] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRev(true); obs.disconnect(); }}, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const words = "My background in content strategy and marketing strengthens how I communicate ideas, shape narratives, and align projects around user-centered goals.".split(' ');
  return (
    <section className="aq-section" ref={ref}>
      <div className="aq-section__inner">
        <div className="aq-section__bar" style={{ transform: rev ? 'scaleY(1)' : 'scaleY(0)', transition: 'transform 1s 0.3s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
        <div className="aq-section__text">
          <span className="aq-section__label">Background</span>
          <p className="aq-section__quote">
            {words.map((w, i) => {
              const bold = ['content','strategy','marketing','communicate','narratives','user-centered'].includes(w.replace(/[^a-z-]/gi,'').toLowerCase());
              return (
                <span key={i} style={{ display:'inline-block', marginRight:'0.28em', opacity: rev ? 1 : 0, transform: rev ? 'translateY(0)' : 'translateY(16px)', transition: `opacity 0.55s ${i*0.035}s ease, transform 0.55s ${i*0.035}s ease` }}>
                  {bold ? <strong style={{ color: 'var(--green)', fontWeight: 700 }}>{w}</strong> : w}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── INFO CARD (scroll-triggered) ────────────────────────────────
function InfoCard({ img, handwriting, label, rotation, accentColor }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [textVis, setTextVis] = useState(false);

  useEffect(() => {
    // card appears at 30% in view
    const obsCard = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obsCard.disconnect(); }
    }, { threshold: 0.3 });
    // text appears when card is 65% in view (scrolled further)
    const obsText = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTextVis(true); obsText.disconnect(); }
    }, { threshold: 0.65 });
    if (ref.current) { obsCard.observe(ref.current); obsText.observe(ref.current); }
    return () => { obsCard.disconnect(); obsText.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={`info-card ${vis ? 'info-card--visible' : ''}`}
      style={{ '--rot': rotation, '--accent': accentColor }}>
      <div className="info-card__img-wrap">
        <img src={img} alt={label} className="info-card__img" />
        <div className={`info-card__overlay ${textVis ? 'info-card__overlay--visible' : ''}`}>
          <div className="info-card__bracket info-card__bracket--tl" />
          <div className="info-card__bracket info-card__bracket--br" />
        </div>
      </div>
      <div className={`info-card__text ${textVis ? 'info-card__text--visible' : ''}`}>
        <span className="info-card__handwriting">{handwriting}</span>
      </div>
    </div>
  );
}

// ─── COLLAGE SECTION ─────────────────────────────────────────────
function CollageSection() {
  const pathRef = useRef(null);
  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = total;
    pathRef.current.style.strokeDashoffset = total;
    const onScroll = () => {
      const section = pathRef.current.closest('.ac-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.5)));
      pathRef.current.style.strokeDashoffset = total * (1 - prog);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="ac-section">
      <div className="ac-section__header">
        <span className="ac-eyebrow">In Context</span>
        <h2 className="ac-title">A few things<br /><em>about me</em></h2>
      </div>
      <div className="ac-section__collage">
        {/* Doodle path */}
        <svg className="ac-doodle" viewBox="0 0 900 700" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path ref={pathRef}
            d="M 720 40 C 720 100, 620 120, 520 160 C 420 200, 320 200, 240 260 C 160 320, 140 380, 160 440 C 180 500, 240 520, 320 540 C 400 560, 480 560, 540 600 C 600 640, 660 660, 700 680"
            stroke="rgba(189,217,159,0.5)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
          />
          {/* Decorative dots along path */}
          {[40,160,280,400,520,640].map(n => (
            <circle key={n} cx={720 - n*0.4} cy={40 + n*0.92} r="3" fill="rgba(189,217,159,0.35)" />
          ))}
        </svg>

        <div className="ac-card ac-card--ux">
          <InfoCard img="assets/ux-icon.png" handwriting={"My focus is on creating\nuser-centered &\ninclusive solutions\nfor all users"} label="UX Design" rotation="-4deg" accentColor="var(--green)" />
        </div>
        <div className="ac-card ac-card--edu">
          <InfoCard img="assets/edu-icon.png" handwriting={"I'm a master's student\nin Human-Computer\nInteraction at\nDePaul University"} label="Education" rotation="3deg" accentColor="var(--amber)" />
        </div>
        <div className="ac-card ac-card--chicago">
          <InfoCard img="assets/chicago-icon.png" handwriting={"I live in\nChicago ✦"} label="Chicago" rotation="-2deg" accentColor="var(--purple)" />
        </div>
      </div>
    </section>
  );
}

// ─── HACKATHON SECTION ────────────────────────────────────────────
function HackathonSection() {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const [rev, setRev] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRev(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    const fn = () => {
      if (!imgRef.current) return;
      const r = imgRef.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      imgRef.current.style.transform = `scale(${1 + p * 0.06})`;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener('scroll', fn); };
  }, []);
  return (
    <section className="ahack-section" ref={ref}>
      <div className="ahack-section__inner">
        <div className="ahack-section__header">
          <span className="ac-eyebrow">Real Work, Real People</span>
          <h2 className="ac-title">DePaul<br /><em>DemonHacks</em></h2>
        </div>
        <div className="ahack-layout">
          <div className="ahack-photo-wrap">
            <div className="ahack-photo-clip">
              <img ref={imgRef} src="assets/hackathon.jpg" alt="Anusha at DePaul DemonHacks hackathon" className="ahack-photo" />
            </div>
            <div className={`ahack-annotation ahack-annotation--me ${rev ? 'ann-visible' : ''}`}>
              <span className="ann-text" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontStyle: 'italic' }}>This is me</span>
              <svg className="ann-arrow-svg" width="58" height="44" viewBox="0 0 58 44" fill="none" aria-hidden="true">
                <path d="M2 6 C 18 4, 36 14, 52 36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M52 36 L46 30 M52 36 L44 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ahack-frame-corner ahack-frame-corner--tl" />
            <div className="ahack-frame-corner ahack-frame-corner--tr" />
            <div className="ahack-frame-corner ahack-frame-corner--bl" />
            <div className="ahack-frame-corner ahack-frame-corner--br" />
          </div>
          <div className={`ahack-info ${rev ? 'ahack-info--visible' : ''}`}>
            <p className="ahack-caption" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 24, lineHeight: 1.4 }}>
              Picture from the recent<br />DePaul Hackathon — DemonHacks
            </p>
            <p className="ahack-body">A 48-hour sprint designing accessible, user-centered solutions under pressure. One of my most energizing experiences — rapid research, ideation, and prototyping with a brilliant team.</p>
            <a href="https://github.com/Dhruvachaitanya13/Nexora.git" target="_blank" rel="noopener" className="ahack-cta" data-mag="true">
              Check out the project we worked on <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────
function AboutFooter() {
  const ref = useRef(null);
  const [rev, setRev] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRev(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <footer className="af-footer" ref={ref} id="contact">
      <div className="af-topline">
        <div className="af-topline__fill" style={{ transform: rev ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
      </div>
      <div className="af-inner">
        <div className="af-hero-block">
          <span className="af-eyebrow" style={{ opacity: rev ? 1 : 0, transition: 'opacity .6s .4s' }}>
            05 — Get In Touch
          </span>
          <h2 className="af-title" style={{ opacity: rev ? 1 : 0, transform: rev ? 'none' : 'translateY(28px)', transition: 'opacity .9s .5s ease, transform .9s .5s ease' }}>
            Let's work<br /><em>together.</em>
          </h2>
          <a href="mailto:anushaprasad20@gmail.com" className="af-email" data-mag="true"
            style={{ opacity: rev ? 1 : 0, transform: rev ? 'none' : 'translateY(18px)', transition: 'opacity .8s .8s ease, transform .8s .8s ease' }}>
            anushaprasad20@gmail.com
            <span className="af-email__arrow">↗</span>
          </a>
        </div>
        <div className="af-links" style={{ opacity: rev ? 1 : 0, transition: 'opacity .8s 1s ease' }}>
          <div className="af-socials">
            {[['LinkedIn','https://www.linkedin.com/in/anushaprasad20/'],['Resume','https://drive.google.com/file/d/1pCGSOcK_WixaAsxsnxSUG0tcQRmeFyM7/view']].map(([l,h]) => (
              <a key={l} href={h} className="af-social" data-mag="true">{l} <span>↗</span></a>
            ))}
          </div>
          <span className="af-location">Chicago, IL · 2026</span>
        </div>
        <div className="af-bottom">
          <span className="af-copy">© 2026 Anusha Prasad</span>
          <span className="af-copy" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:'italic', fontSize:18, opacity:.5 }}>
            Designed with intention ✦
          </span>
        </div>
      </div>
      <div className="af-bg-letters" aria-hidden="true">AP</div>
    </footer>
  );
}

Object.assign(window, { AboutCursor, AboutNav, HelloSticker, AboutHero, QuoteSection, CollageSection, HackathonSection, AboutFooter });
