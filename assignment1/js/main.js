/* ================================================================
   PARV — PORTFOLIO · MAIN.JS
   Vanilla JavaScript — zero dependencies
   ================================================================ */

;(function () {
  'use strict';

  /* ==============================================================
     0. UTILITIES
     ============================================================== */

  /** Shorthand selectors */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /** Clamp a number between min and max */
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  /** Linear interpolation */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Debounce helper */
  function debounce(fn, ms = 100) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /** Throttle using rAF */
  function rafThrottle(fn) {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
    };
  }

  /** Check prefers-reduced-motion */
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ==============================================================
     1. LOADING SCREEN (Cinematic Multilingual Welcome Experience)
     ============================================================== */
  function initLoader() {
    const loader = $('#loader');
    const greetingEl = $('#loader-greeting');
    const percentEl = $('#loader-percent');
    if (!loader || !greetingEl) return;

    const greetings = [
      'Welcome',
      'Bienvenue',
      'Willkommen',
      'Benvenuto',
      'Bienvenido',
      'Bem-vindo',
      'Welkom',
      'Välkommen',
      'ようこそ',
      '환영합니다',
      '欢迎',
      'Добро пожаловать',
      'أهلاً وسهلاً',
      'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
      'નમસ્તે',
      'નમસ્કાર',
      'வணக்கம்',
      'નમસ્કાર',
      'നമസ്കാരം',
      'ଯାହାର સ્ୱાગત',
      'শেষে...',
      'आपका स्वागत है।'
    ];

    let index = 0;
    const stepInterval = 100;
    const counterDuration = 2700;
    const startTime = performance.now();

    // Smooth percentage counter (0% -> 100%)
    function updatePercentage(now) {
      const elapsed = now - startTime;
      const progress = Math.min(Math.floor((elapsed / counterDuration) * 100), 100);
      if (percentEl) {
        percentEl.textContent = `${progress}%`;
      }
      if (progress < 100) {
        requestAnimationFrame(updatePercentage);
      }
    }
    requestAnimationFrame(updatePercentage);

    // Initial word reveal
    greetingEl.textContent = greetings[0];
    requestAnimationFrame(() => {
      greetingEl.classList.add('is-visible');
    });

    function nextGreeting() {
      index++;

      if (index < greetings.length - 1) {
        greetingEl.classList.remove('is-visible');
        greetingEl.classList.add('is-fade-out');

        setTimeout(() => {
          greetingEl.textContent = greetings[index];
          greetingEl.classList.remove('is-fade-out');
          greetingEl.classList.add('is-visible');
        }, 22);

        setTimeout(nextGreeting, stepInterval);
      } else if (index === greetings.length - 1) {
        // Final Hindi Greeting ("आपका स्वागत है。")
        greetingEl.classList.remove('is-visible');
        greetingEl.classList.add('is-fade-out');

        setTimeout(() => {
          greetingEl.textContent = greetings[index];
          greetingEl.classList.remove('is-fade-out');
          greetingEl.classList.add('is-visible');
          if (percentEl) percentEl.textContent = '100%';

          // Hold final Hindi greeting for ~750ms
          setTimeout(() => {
            // Continuous transition to website
            loader.classList.add('is-exiting');
            document.body.classList.add('is-loaded');

            loader.setAttribute('aria-busy', 'false');
            loader.setAttribute('aria-hidden', 'true');

            // Complete transition after 500ms exit animation
            setTimeout(() => {
              loader.style.display = 'none';
            }, 500);
          }, 750);
        }, 22);
      }
    }

    setTimeout(nextGreeting, stepInterval);
  }


  /* ==============================================================
     2. SMOOTH SCROLLING
     ============================================================== */
  function initSmoothScroll() {
    const anchors = $$('a[href^="#"]');
    const header  = $('#header');

    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = $(targetId);
        if (!target) return;

        e.preventDefault();

        const headerH = header ? header.offsetHeight : 0;
        let top = target.getBoundingClientRect().top + window.scrollY - headerH;

        if (targetId === '#hero') {
          top = 0;
        }

        window.scrollTo({
          top,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });

        // Close mobile menu if open
        closeMobileMenu();
      });
    });
  }


  /* ==============================================================
     3. NAVIGATION — STICKY HEADER & FLOATING HERO NAV
     ============================================================== */
  function initNavigation() {
    const header      = $('#header');
    const floatingNav = $('#hero-floating-nav');
    const heroSection = $('#hero');
    const navLinks    = $$('.nav__link, .hero__nav-link, .nav__mobile-link');
    const sections    = $$('.section[id]');

    if (!header || !sections.length) return;

    const onScroll = rafThrottle(() => {
      const scrollY = window.scrollY;
      const heroHeight = heroSection ? heroSection.offsetHeight : 600;

      // Transition between Hero Floating Nav & Top Sticky Header Bar
      if (scrollY > heroHeight - 120) {
        if (floatingNav) floatingNav.classList.add('is-hidden');
        header.classList.remove('header--hidden');
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
        header.classList.add('header--scrolled');
      } else {
        if (floatingNav) floatingNav.classList.remove('is-hidden');
        header.classList.add('header--hidden');
        header.style.transform = 'translateY(-100%)';
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
        header.classList.remove('header--scrolled');
      }

      updateActiveNav(sections, navLinks);
    });

    // Check initial state
    const scrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;

    if (scrollY > heroHeight - 120) {
      if (floatingNav) floatingNav.classList.add('is-hidden');
      header.classList.remove('header--hidden');
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
      header.style.pointerEvents = 'auto';
      header.classList.add('header--scrolled');
    } else {
      if (floatingNav) floatingNav.classList.remove('is-hidden');
      header.classList.add('header--hidden');
      header.style.transform = 'translateY(-100%)';
      header.style.opacity = '0';
      header.style.pointerEvents = 'none';
      header.classList.remove('header--scrolled');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveNav(sections, navLinks);
  }

  function updateActiveNav(sections, navLinks) {
    const scrollY  = window.scrollY;
    const headerH  = $('#header')?.offsetHeight || 0;
    let currentId  = '';

    sections.forEach(section => {
      const top    = section.offsetTop - headerH - 120;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('is-active');
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('is-active');
        link.classList.remove('nav__link--active');
      }
    });
  }


  /* ==============================================================
     4. MOBILE MENU
     ============================================================== */
  let mobileMenuOpen = false;

  function initMobileMenu() {
    const toggle  = $('#nav-toggle');
    const overlay = $('#nav-mobile-overlay');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      mobileMenuOpen = !mobileMenuOpen;
      toggleMobileMenu(mobileMenuOpen);
    });

    // Close on link click
    $$('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => closeMobileMenu());
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu();
    });
  }

  function toggleMobileMenu(open) {
    const toggle  = $('#nav-toggle');
    const overlay = $('#nav-mobile-overlay');
    const lines   = $$('.nav__toggle-line');

    if (!toggle || !overlay) return;

    mobileMenuOpen = open;

    toggle.setAttribute('aria-expanded', String(open));
    overlay.setAttribute('aria-hidden', String(!open));
    overlay.style.display = open ? 'block' : 'none';

    // Animate hamburger → X
    if (open) {
      if (lines[0]) { lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)'; }
      if (lines[1]) { lines[1].style.opacity = '0'; }
      if (lines[2]) { lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)'; }
      document.body.style.overflow = 'hidden';
    } else {
      lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    if (mobileMenuOpen) toggleMobileMenu(false);
  }


  /* ==============================================================
     5. SCROLL PROGRESS BAR
     Uses the loader bar track as a global scroll progress indicator
     after loading completes.
     ============================================================== */
  function initScrollProgress() {
    const waitForLoad = setInterval(() => {
      if (document.body.classList.contains('is-loaded')) {
        clearInterval(waitForLoad);
        setupProgressBar();
      }
    }, 100);
  }

  function setupProgressBar() {
    const header = $('#header');
    if (!header || header.querySelector('.scroll-progress-track')) return;

    const progressTrack = document.createElement('div');
    progressTrack.className = 'scroll-progress-track';
    progressTrack.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      z-index: 10;
    `;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd);
      border-radius: 0 9999px 9999px 0;
      transition: width 0.1s linear;
    `;

    progressTrack.appendChild(progressBar);
    header.appendChild(progressTrack);

    const update = rafThrottle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ==============================================================
     6. REVEAL ANIMATIONS (Intersection Observer)
     ============================================================== */
  function initRevealAnimations() {
    if (prefersReducedMotion()) return;

    // Elements to animate on scroll
    const revealTargets = [
      ...$$('.section__header'),
      ...$$('.about__portrait'),
      ...$$('.about__content'),
      ...$$('.about__stat'),
      ...$$('.skills__card'),
      ...$$('.projects__card'),
      ...$$('.research__item'),
      ...$$('.creative__item'),
      ...$$('.achievements__card'),
      ...$$('.contact__form'),
      ...$$('.contact__info'),
      ...$$('.hero__badge'),
      ...$$('.hero__title'),
      ...$$('.hero__subtitle'),
      ...$$('.hero__actions'),
    ];

    // Set initial hidden state
    revealTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i % 6 * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i % 6 * 0.08}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealTargets.forEach(el => observer.observe(el));
  }


  /* ==============================================================
     7. HERO TYPING EFFECT (REMOVED - Hero is 100% static)
     ============================================================== */
  function initTypingEffect() {
    // Intentionally empty - hero text is static
  }


  /* ==============================================================
     8. COUNTER ANIMATIONS
     Animates .about__stat-number elements with data-count attr.
     ============================================================== */
  function initCounters() {
    const counters = $$('.about__stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();
    const suffix   = el.textContent.replace(/[\d]/g, '').trim(); // e.g. "+"

    if (prefersReducedMotion()) {
      el.textContent = target + suffix;
      return;
    }

    function tick(now) {
      const elapsed  = now - start;
      const progress = clamp(elapsed / duration, 0, 1);

      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }


  /* ==============================================================
     9. PROJECT CARD HOVER EFFECTS
     3D tilt + spotlight gradient on mouse move.
     ============================================================== */
  function initProjectCardEffects() {
    const cards = $$('.projects__card');
    if (!cards.length || prefersReducedMotion()) return;

    cards.forEach(card => {
      // Create spotlight overlay
      const spotlight = document.createElement('div');
      spotlight.className = 'projects__card-spotlight';
      spotlight.style.cssText = `
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
        z-index: 1;
      `;
      card.style.position = 'relative';
      card.appendChild(spotlight);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt — subtle, max ±4deg
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

        // Spotlight
        spotlight.style.opacity = '1';
        spotlight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(139,92,246,0.06), transparent 40%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, box-shadow 0.35s';
        spotlight.style.opacity = '0';

        // Reset transition after settle
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }


  /* ==============================================================
     10. SKILLS CARD TILT (lighter version)
     ============================================================== */
  function initSkillsCardEffects() {
    const cards = $$('.skills__card');
    if (!cards.length || prefersReducedMotion()) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateX = (y - 0.5) * -6;
        const rotateY = (x - 0.5) * 6;

        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, background 0.35s, box-shadow 0.35s';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }


  /* ==============================================================
     11. SCROLL INDICATOR (Hero Scroll Cue)
     Fades out as user scrolls down.
     ============================================================== */
  function initScrollIndicator() {
    const cue = $('.hero__scroll-cue');
    if (!cue) return;

    const onScroll = rafThrottle(() => {
      const scrollY = window.scrollY;
      const fadeEnd = 300;
      const opacity = clamp(1 - scrollY / fadeEnd, 0, 1);
      cue.style.opacity = String(opacity);

      if (opacity <= 0) {
        cue.style.pointerEvents = 'none';
      } else {
        cue.style.pointerEvents = '';
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ==============================================================
     12. BACK TO TOP BUTTON
     Show/hide + smooth scroll.
     ============================================================== */
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    // Start hidden
    btn.style.opacity = '0';
    btn.style.visibility = 'hidden';
    btn.style.transition = 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), visibility 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.2s, color 0.2s, box-shadow 0.35s';

    const onScroll = rafThrottle(() => {
      if (window.scrollY > 600) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ==============================================================
     13. CUSTOM CURSOR
     ============================================================== */
  function initCustomCursor() {
    // Only on non-touch, non-reduced-motion devices
    if (prefersReducedMotion() || 'ontouchstart' in window) return;

    const cursor = $('#custom-cursor');
    if (!cursor) return;

    const dot  = $('.cursor__dot');
    const ring = $('.cursor__ring');

    cursor.style.display = 'block';

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let isAnimating = false;

    function followRing() {
      ringX = lerp(ringX, mouseX, 0.2);
      ringY = lerp(ringY, mouseY, 0.2);
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;

      if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
        requestAnimationFrame(followRing);
      } else {
        isAnimating = false;
      }
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(followRing);
      }
    }, { passive: true });

    // Expand ring on hoverable elements
    const hoverables = 'a, button, .btn, .projects__card, .skills__card, .achievements__card, .creative__item, input, textarea';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.top = '-28px';
        ring.style.left = '-28px';
        ring.style.borderColor = 'rgba(139,92,246,0.6)';
        dot.style.opacity = '0.5';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) {
        ring.style.width = '';
        ring.style.height = '';
        ring.style.top = '';
        ring.style.left = '';
        ring.style.borderColor = '';
        dot.style.opacity = '';
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }


  /* ==============================================================
     14. PROJECT FILTERS
     ============================================================== */
  function initProjectFilters() {
    const filters = $$('.projects__filter');
    const cards   = $$('.projects__card[data-category]');

    if (!filters.length || !cards.length) return;

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        filters.forEach(f => {
          f.classList.remove('is-active');
          f.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards
        cards.forEach((card, i) => {
          const category = card.dataset.category;
          const show = filter === 'all' || category === filter;

          if (show) {
            card.style.display = '';
            // Staggered re-entrance
            if (!prefersReducedMotion()) {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(() => {
                card.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, i * 80);
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  /* ==============================================================
     15. DYNAMIC FOOTER YEAR
     ============================================================== */
  function initFooterYear() {
    const yearEl = $('#footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }


  /* ==============================================================
     16. CONTACT FORM HANDLING
     ============================================================== */
  function initContactForm() {
    const form = $('#contact-form');
    const status = $('#contact-status');
    const submitBtn = $('#contact-submit');

    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = $('#contact-name')?.value.trim();
      const email = $('#contact-email')?.value.trim();
      const message = $('#contact-message')?.value.trim();

      if (!name || !email || !message) {
        status.style.color = '#ef4444';
        status.textContent = 'Please fill out all required fields.';
        return;
      }

      // Simulate sending state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        status.style.color = '#22c55e';
        status.textContent = 'Thank you! Your message has been sent successfully.';
        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }

        // Clear status after 5s
        setTimeout(() => {
          status.textContent = '';
        }, 5000);
      }, 1000);
    });
  }


  /* ==============================================================
     17. HEADER STYLES INJECTION
     Inject minimal CSS for JS-driven states so we don't touch
     the CSS file.
     ============================================================== */
  function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* JS-driven nav states */
      .header--scrolled {
        padding-block: 0.65rem;
        background: rgba(5, 5, 5, 0.88) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        backdrop-filter: blur(20px) saturate(180%);
      }

      .header--hidden {
        transform: translateY(-100%) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      .header {
        transition:
          padding 0.35s cubic-bezier(0.16,1,0.3,1),
          transform 0.35s cubic-bezier(0.16,1,0.3,1),
          opacity 0.35s cubic-bezier(0.16,1,0.3,1),
          background 0.35s cubic-bezier(0.16,1,0.3,1) !important;
      }

      /* Active nav link */
      .nav__link--active {
        color: #f5f5f7 !important;
      }

      .nav__link--active::after {
        width: 60% !important;
        left: 20% !important;
        background: #8b5cf6 !important;
      }

      /* Body loaded — enable transitions */
      .is-loaded {
        /* marker class */
      }
    `;
    document.head.appendChild(style);
  }


  /* ==============================================================
     18. JUAN MORA STYLE KINETIC SCROLL PARALLAX & DEPTH
     ============================================================== */
  function initScrollParallax() {
    if (prefersReducedMotion()) return;

    const heroInner      = $('.hero__inner');
    const heroBgImg      = $('.hero__bg-img');
    const heroScroll     = $('.hero__scroll-cue');
    const heroSection    = $('#hero');
    const sectionHeaders = $$('.section__header');

    if (!heroSection) return;

    let heroH = heroSection.offsetHeight || 600;

    window.addEventListener('resize', debounce(() => {
      heroH = heroSection.offsetHeight || 600;
    }, 200), { passive: true });

    const updateParallax = rafThrottle(() => {
      const currentScroll = window.scrollY;

      // 1. Hero Content & Background Parallax Motion (Within Hero View)
      if (currentScroll <= heroH + 120) {
        const progress = Math.min(1, currentScroll / heroH);

        if (heroInner) {
          heroInner.style.transform = `translate3d(0, ${ (currentScroll * 0.32).toFixed(2) }px, 0)`;
          heroInner.style.opacity   = Math.max(0, 1 - progress * 1.3).toFixed(3);
        }

        if (heroBgImg) {
          const scale      = 1.0 + progress * 0.08;
          const translateY = currentScroll * 0.18;
          heroBgImg.style.transform = `scale(${ scale.toFixed(4) }) translate3d(0, ${ translateY.toFixed(2) }px, 0)`;
        }

        if (heroScroll) {
          heroScroll.style.opacity = Math.max(0, 1 - progress * 2.5).toFixed(3);
        }
      }

      // 2. Section Headers Subtle Kinetic Parallax
      const winH = window.innerHeight;
      sectionHeaders.forEach(header => {
        const top = header.offsetTop - currentScroll;
        if (top < winH && top + 150 > 0) {
          const deltaY = (top - winH / 2) * 0.04;
          header.style.transform = `translate3d(0, ${ deltaY.toFixed(2) }px, 0)`;
        }
      });
    });

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }


  /* ==============================================================
     INIT — Wire everything up on DOMContentLoaded
     ============================================================== */
  function init() {
    injectDynamicStyles();
    initLoader();
    initSmoothScroll();
    initNavigation();
    initMobileMenu();
    initScrollProgress();
    initRevealAnimations();
    initCounters();
    initProjectCardEffects();
    initSkillsCardEffects();
    initScrollIndicator();
    initBackToTop();
    initCustomCursor();
    initProjectFilters();
    initFooterYear();
    initContactForm();
    initScrollParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
