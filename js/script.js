// Aonix Studio — site scripts

// Preloader: cycles a "Welcome" greeting through a few languages,
// then the whole overlay slides up off-screen. Runs once per real
// page load (a plain top-level script, never re-invoked by in-page
// #anchor navigation) — nothing to gate that on.
//
// It should still only *play* once per browser tab, though: an
// explicit reload (F5 / the reload button) always replays it, but a
// tab that's just regaining focus, or a fresh navigation into a tab
// that already saw it this session, should not. Switching Chrome
// tabs doesn't reload the page at all — the script never re-runs, so
// there's nothing to special-case for that.
(function () {
  const preloader = document.getElementById('preloader');
  const wordEl = document.getElementById('preloader-word');
  if (!preloader || !wordEl) return;

  const navEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navEntry && navEntry.type === 'reload';
  const alreadyShown = sessionStorage.getItem('preloaderShown') === 'true';

  if (!isReload && alreadyShown) {
    // Not a manual reload, and this tab already saw the greeting —
    // skip straight to content: no animation, no scroll lock.
    preloader.classList.add('is-done');
    return;
  }

  sessionStorage.setItem('preloaderShown', 'true');

  const WORDS = ['Welcome', 'Bienvenido', 'Bienvenue', 'Вітаю', 'Witamy', 'Vitajte'];
  const TOTAL_DURATION = 2000;
  const STEP_DURATION = TOTAL_DURATION / WORDS.length;

  document.body.classList.add('preloader-active');

  function finish() {
    document.body.classList.remove('preloader-active');
    preloader.classList.add('is-hiding');
    preloader.addEventListener(
      'transitionend',
      () => preloader.classList.add('is-done'),
      { once: true }
    );
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    wordEl.textContent = WORDS[0];
    setTimeout(() => {
      document.body.classList.remove('preloader-active');
      preloader.classList.add('is-done');
    }, 500);
    return;
  }

  let index = 0;
  wordEl.textContent = WORDS[index];
  const cycle = setInterval(() => {
    index += 1;
    if (index >= WORDS.length) {
      clearInterval(cycle);
      finish();
      return;
    }
    wordEl.textContent = WORDS[index];
  }, STEP_DURATION);
})();

// Scroll effect: reveal [data-fill-text] word by word, in reading
// order, as the .statement section's sticky inner (.stack-pin) is
// pinned. Each word flips straight from #e5e5e5 to #0a0a0a (see
// .statement-text .word / .is-filled in css/style.css) — no fade.
// rAF-throttled so fast scrolling stays smooth.
(function () {
  const section = document.querySelector('.statement');
  const textEl = document.querySelector('[data-fill-text]');
  if (!section || !textEl) return;

  const words = splitIntoWords(textEl);
  let filledCount = -1;
  let ticking = false;

  function splitIntoWords(el) {
    const words = el.textContent.trim().replace(/\s+/g, ' ').split(' ');
    el.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');
    return Array.from(el.querySelectorAll('.word'));
  }

  function updateFill() {
    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable > 0
      ? Math.min(1, Math.max(0, -rect.top / scrollable))
      : 0;

    const activeCount = Math.round(progress * words.length);
    if (activeCount !== filledCount) {
      words.forEach((word, i) => {
        word.classList.toggle('is-filled', i < activeCount);
      });
      filledCount = activeCount;
    }
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFill);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateFill();
})();

// Dock nav CTA color swap: while the fixed dock nav overlaps the
// .cta-through-footer stretch of .finale (marquee excluded), add
// .on-dark (see css/style.css) to turn the gradient "Contact us"
// button into a plain white pill; everywhere else it stays the
// default gradient. The same overlap also drives body.dock-on-dark,
// which hides the .dock-side email/socials (see css/style.css) once
// the footer below is showing that same contact info anyway.
(function () {
  const dockNav = document.querySelector('.dock-nav');
  const ctaSection = document.querySelector('.cta');
  const finaleSection = document.querySelector('.finale');
  if (!dockNav || !ctaSection || !finaleSection) return;

  let ticking = false;

  function updateDockCta() {
    const dockRect = dockNav.getBoundingClientRect();
    // Dark zone runs from the top of .cta to the very bottom of
    // .finale (footer + its trailing dock-clearance buffer are black
    // too), but starts after the marquee band on purpose.
    const zoneTop = ctaSection.getBoundingClientRect().top;
    const zoneBottom = finaleSection.getBoundingClientRect().bottom;
    const overlaps = dockRect.bottom > zoneTop && dockRect.top < zoneBottom;
    dockNav.classList.toggle('on-dark', overlaps);
    document.body.classList.toggle('dock-on-dark', overlaps);
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateDockCta);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateDockCta();
})();

// FAQ accordion: native <details> toggling has no transition hook (it
// jumps straight to display:none), so we intercept the click, drive
// open/close through a height animation via the Web Animations API,
// and replicate the exclusive "only one open at a time" behavior the
// markup's name="faq" grouping used to give us for free. The .is-open
// class (see .faq-item.is-open .chevron in css/style.css) tracks the
// user's intent immediately so the chevron flips right away instead
// of waiting on the slower height animation.
(function () {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  const DURATION = 300;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  // Per item: the in-flight animation plus a request token. Rapid
  // clicking can fire a stale animation's "finish" event *after* a
  // newer one has already taken over the same element/property (a
  // real WAAPI/compositor race, reproducible by opening/closing the
  // same item several times in under ~300ms) — that stale finish used
  // to still run its onDone (e.g. setting item.open = false right
  // after a newer click had reopened it), which is the reported lag/
  // glitch. Stamping every animateTo() call with an incrementing token
  // and having onfinish bail out unless its token is still the latest
  // makes any late/duplicate callback a harmless no-op.
  const state = new WeakMap();

  function animateTo(item, targetHeight, onDone) {
    const entry = state.get(item);
    const token = (entry ? entry.token : 0) + 1;
    const startHeight = item.getBoundingClientRect().height;
    if (entry) entry.animation.cancel();

    item.style.overflow = 'hidden';
    const animation = item.animate(
      { height: [`${startHeight}px`, `${targetHeight}px`] },
      { duration: DURATION, easing: EASING }
    );
    state.set(item, { animation, token });

    animation.onfinish = () => {
      if (state.get(item)?.token !== token) return; // superseded — ignore
      item.style.height = '';
      item.style.overflow = '';
      if (onDone) onDone();
    };
  }

  function expand(item) {
    item.open = true;
    animateTo(item, item.scrollHeight);
  }

  function collapse(item) {
    const summaryHeight = item.querySelector('summary').offsetHeight;
    animateTo(item, summaryHeight, () => { item.open = false; });
  }

  // Bound to the whole item, not just the summary: once a question is
  // open, the box can grow well past the summary's thin header strip,
  // so closing it required hunting back up for that strip — clicking
  // anywhere on an already-open item now closes it too. A closed item
  // still only reacts to its summary (nothing else is visible yet
  // anyway), and a text-selection drag inside the answer is left
  // alone instead of being swallowed as a close click.
  items.forEach((item) => {
    const summary = item.querySelector('summary');

    item.addEventListener('click', (e) => {
      const onSummary = e.target.closest('summary') === summary;
      const isOpen = item.classList.contains('is-open');

      if (!onSummary && !isOpen) return;
      if (!onSummary && window.getSelection().toString()) return;

      e.preventDefault();

      if (isOpen) {
        item.classList.remove('is-open');
        collapse(item);
        return;
      }

      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          collapse(other);
        }
      });

      item.classList.add('is-open');
      expand(item);
    });
  });
})();

// Project thumb custom cursor: the .project-cursor badge (see
// css/style.css) follows the pointer via the --cursor-x/--cursor-y
// custom properties instead of sitting fixed in the center; CSS alone
// handles the fade/scale on hover.
(function () {
  const thumbs = document.querySelectorAll('.project-thumb');
  if (!thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('mousemove', (e) => {
      const rect = thumb.getBoundingClientRect();
      thumb.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
      thumb.style.setProperty('--cursor-y', `${e.clientY - rect.top}px`);
    });
  });
})();

// Reveal-on-scroll: adds .is-visible (see .reveal in css/style.css)
// to each .reveal element the first time it enters the viewport, then
// stops watching it — a one-shot fade/slide-in, not a repeating
// scroll effect.
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

// Contact modal: opened by every [data-open-contact] trigger (the
// dock nav's "Contact us" and the CTA section's "Let's talk"),
// closed via [data-close-contact] (backdrop + X button) or Escape.
// The form posts to Formspree (see form's action= in index.html) —
// that's also the no-JS fallback, a plain POST that redirects to
// Formspree's own thank-you page. With JS, the submit below
// intercepts it and does the same POST via fetch instead, so the
// result shows inline in the modal without leaving the page.
(function () {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-open-contact]');
  const closeTriggers = modal.querySelectorAll('[data-close-contact]');
  const form = modal.querySelector('.contact-form');
  let lastFocused = null;

  function openModal(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // The backdrop's blur has to be recomputed every frame anything
    // behind it changes — with the gradient sweeps, the marquee
    // scroll and the hero badges' own blur(40px) glass all still
    // running, that was the actual source of the jank (measured:
    // ~55ms/frame while open vs ~18ms with these paused). Freezing
    // them while the modal is up removes that ongoing repaint cost;
    // .paused (see css/style.css) resumes them on close.
    document.body.classList.add('modal-open');
    const firstInput = modal.querySelector('.contact-input');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  openTriggers.forEach((trigger) => trigger.addEventListener('click', openModal));
  closeTriggers.forEach((trigger) => trigger.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  if (form) {
    const submitBtn = form.querySelector('.contact-submit');
    const statusEl = form.querySelector('[data-form-status]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.classList.remove('contact-form-status--success', 'contact-form-status--error');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          statusEl.textContent = 'Thanks! We’ll get back to you within 24 hours.';
          statusEl.classList.add('contact-form-status--success');
          form.reset();
          setTimeout(closeModal, 2000);
        } else {
          const data = await response.json().catch(() => null);
          const message = data && data.errors
            ? data.errors.map((err) => err.message).join(', ')
            : 'Something went wrong — please try again or email us directly.';
          statusEl.textContent = message;
          statusEl.classList.add('contact-form-status--error');
        }
      } catch (err) {
        statusEl.textContent = 'Network error — please check your connection and try again.';
        statusEl.classList.add('contact-form-status--error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm';
      }
    });
  }
})();

// Mobile nav: the hamburger (phone-width only — see .dock-burger in
// css/style.css) toggles .mobile-nav, the stand-in for .dock-links at
// that width. Closes on a link click, an outside click, or Escape.
(function () {
  const burger = document.getElementById('dock-burger');
  const nav = document.getElementById('mobile-nav');
  if (!burger || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    nav.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || burger.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });
})();

// Email links (header + footer): on desktop, clicking mailto: often
// does nothing visible — plenty of desktop browsers have no mail
// client registered as the OS default, so the click silently goes
// nowhere and it just looks broken. Mobile always has one, so it's
// left untouched there. Desktop gets a copy-to-clipboard + "Copied"
// text swap alongside the normal mailto: hand-off (no preventDefault
// — if the user *does* have a mail client, it still opens as usual).
(function () {
  const emailLinks = document.querySelectorAll('.dock-side-left, .footer-email');
  if (!emailLinks.length || !navigator.clipboard) return;

  const isDesktop = () => window.matchMedia('(min-width: 761px)').matches;

  emailLinks.forEach((link) => {
    const originalText = link.textContent;
    let resetTimer = null;

    link.addEventListener('click', () => {
      if (!isDesktop()) return;

      const email = link.href.replace(/^mailto:/, '').split('?')[0];
      navigator.clipboard.writeText(email).then(() => {
        clearTimeout(resetTimer);
        link.textContent = 'Copied ✓';
        resetTimer = setTimeout(() => {
          link.textContent = originalText;
        }, 2000);
      }).catch(() => {});
    });
  });
})();
