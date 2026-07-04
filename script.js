/* ==========================================================================
   VAForLeads — Scripts
   Vanilla JS only. Handles nav, scroll effects, and reveal animations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeaderShadow();
  initScrollReveal();
  initBackToTop();
  initFooterYear();
  initLeadForm();
  initMobileCtaBar();
});

/* --------------------------------------------------------------------------
   Mobile navigation toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('navBackdrop');

  if (!toggle || !mobileNav || !backdrop) return;

  const closeNav = () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  backdrop.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

/* --------------------------------------------------------------------------
   Sticky header background on scroll
   -------------------------------------------------------------------------- */
function initStickyHeaderShadow() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const toggleShadow = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  toggleShadow();
  window.addEventListener('scroll', toggleShadow, { passive: true });
}

/* --------------------------------------------------------------------------
   Fade-in on scroll using IntersectionObserver
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Back-to-top button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (!yearEl) return;

  yearEl.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Lead form — no backend, so we hand off a pre-filled draft to the user's
   own email client rather than making them compose one from scratch.
   -------------------------------------------------------------------------- */
function initLeadForm() {
  const form = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    const company = data.get('company').trim();
    const service = data.get('service');
    const message = data.get('message').trim();

    const subject = `Discovery call request from ${company}`;
    const body = [
      `Name: ${name}`,
      `Work email: ${email}`,
      `Company: ${company}`,
      `Interested in: ${service}`,
      '',
      message || 'No additional details provided.'
    ].join('\n');

    if (status) {
      status.textContent = 'Opening your email client to send your request…';
    }

    window.location.href = `mailto:hello@vaforleads.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* --------------------------------------------------------------------------
   Mobile sticky CTA bar — stays out of the way once the real contact form
   or footer is already on screen, so it never covers what it's promoting.
   -------------------------------------------------------------------------- */
function initMobileCtaBar() {
  const bar = document.getElementById('mobileCtaBar');
  const contact = document.getElementById('contact');
  const footer = document.querySelector('.site-footer');
  if (!bar || !contact || !('IntersectionObserver' in window)) return;

  const targets = [contact, footer].filter(Boolean);
  const isVisible = new Map(targets.map((el) => [el, false]));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => isVisible.set(entry.target, entry.isIntersecting));
    const shouldHide = Array.from(isVisible.values()).some(Boolean);
    bar.classList.toggle('is-hidden', shouldHide);
  }, { threshold: 0.1 });

  targets.forEach((el) => observer.observe(el));
}
