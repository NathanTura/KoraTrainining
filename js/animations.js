
/* ============================
   JS-only scroll + load animations
   - navbar left static (no load bounce)
   - sections animate when entering viewport
   - animations reset on leave so they replay
   - children animate with stagger
   - hero pulses
   ============================ */

(function () {
  // ---- NAVBAR: keep static (no entrance animation) ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.style.transition = ''; // remove previous transitions if any
    navbar.style.transform = 'none';
    navbar.style.opacity = '1';
  }

  // ---- HERO pulse (gentle) ----
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.willChange = 'transform';
    let pulseOn = true;
    // clear any existing interval (safe guard)
    if (heroContent._pulseInterval) clearInterval(heroContent._pulseInterval);
    heroContent._pulseInterval = setInterval(() => {
      heroContent.style.transform = pulseOn ? 'scale(1.02)' : 'scale(1)';
      pulseOn = !pulseOn;
    }, 1400);
  }

  // ---- Section animation settings ----
  const sections = Array.from(document.querySelectorAll('header.hero, section'));
  const timeoutMap = new Map(); // keep timeouts so we can clear when resetting

  // initialize elements: hidden + prepare children stagger
  sections.forEach(section => {
    // initial style for the section
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px) scale(0.98)';
    section.style.transition = 'opacity 600ms ease-out, transform 700ms ease-out';
    section.style.willChange = 'opacity, transform';

    // prepare children for stagger (only immediate children for performance)
    const children = Array.from(section.children);
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(18px)';
      // keep transition but with no delay; delay will be applied in JS via setTimeout
      child.style.transition = 'opacity 500ms ease-out, transform 520ms ease-out';
      child.style.willChange = 'opacity, transform';
    });
  });

  // animate one section (with staggered children)
  function playSectionAnimation(section) {
    // clear previous timeouts for this section
    if (timeoutMap.has(section)) {
      timeoutMap.get(section).forEach(t => clearTimeout(t));
    }
    const children = Array.from(section.children);
    // animate section itself immediately
    section.style.opacity = '1';
    section.style.transform = 'translateY(0) scale(1)';

    // stagger children
    const timeouts = [];
    children.forEach((child, idx) => {
      const t = setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 80 * idx + 60); // stagger gap: 80ms
      timeouts.push(t);
    });
    timeoutMap.set(section, timeouts);
  }

  // reset animation so it can replay later
  function resetSectionAnimation(section) {
    // clear any timeouts
    if (timeoutMap.has(section)) {
      timeoutMap.get(section).forEach(t => clearTimeout(t));
    }
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px) scale(0.98)';

    const children = Array.from(section.children);
    children.forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(18px)';
    });
  }

  // IntersectionObserver to play/reset animations on enter/leave
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;

      if (entry.isIntersecting) {
        // Slight delay to allow natural flow (also avoids flashing)
        playSectionAnimation(section);
      } else {
        // reset when out of viewport so it can replay on re-entry
        resetSectionAnimation(section);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // trigger a little earlier
    threshold: 0.18
  });

  sections.forEach(section => observer.observe(section));

  // ---- Ensure top-most visible sections animate on load (in case observer misses) ----
  // Give observer a moment to set up then manually trigger for already-visible sections
  window.addEventListener('load', () => {
    setTimeout(() => {
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        // If 20% of section is in viewport -> animate
        const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visibleHeight > rect.height * 0.18) {
          playSectionAnimation(section);
        }
      });
    }, 120); // tiny delay
  });

  // Optional: reduce motion for users who prefer it
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    // disable animations, make everything visible
    sections.forEach(section => {
      if (timeoutMap.has(section)) timeoutMap.get(section).forEach(t => clearTimeout(t));
      section.style.opacity = '1';
      section.style.transform = 'none';
      Array.from(section.children).forEach(child => {
        child.style.opacity = '1';
        child.style.transform = 'none';
      });
    });
    if (heroContent && heroContent._pulseInterval) {
      clearInterval(heroContent._pulseInterval);
      heroContent.style.transform = 'none';
    }
  }

})();

