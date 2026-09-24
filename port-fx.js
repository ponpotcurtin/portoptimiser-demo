(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stamp staggered delays on the pipeline arrows so the CSS flow-pulse
  // reads left-to-right, like data moving through the stages.
  gsap.utils.toArray('.hero-workflow__body > i, .collaboration .impact-chain > i')
    .forEach(function (el, i) {
      el.classList.add('flow-arrow');
      el.style.setProperty('--flow-delay', (i * 0.18) + 's');
    });

  if (prefersReduced) return; // no scroll-driven motion beyond this point

  /* ---------------------------------------------------------------------
     Apple-style "settle into place" reveal for content outside the
     pinned #story scrollytelling section (hero copy, collaboration
     panel, about panel, footer). Each tween's own "from" state is set
     the moment this runs, so there is no flash of fully-visible content
     before the reveal plays.
     ------------------------------------------------------------------- */
  function reveal(selector, opts) {
    opts = opts || {};
    var els = gsap.utils.toArray(selector);
    els.forEach(function (el, i) {
      gsap.fromTo(
        el,
        { y: opts.y || 36, opacity: 0, scale: opts.scale || 1 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: opts.duration || 0.9,
          ease: 'power3.out',
          delay: opts.stagger ? i * opts.stagger : 0,
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: opts.start || 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  reveal('.hero__content .eyebrow', { start: 'top 100%', duration: 0.7, y: 18 });
  reveal('.hero__content h1', { start: 'top 100%', duration: 0.95, y: 46 });
  reveal('.hero__content .lead', { start: 'top 100%', duration: 0.85, y: 30 });
  reveal('.hero-workflow', { start: 'top 100%', duration: 0.95, y: 40, scale: 0.97 });
  reveal('.scroll-cue', { start: 'top 100%', duration: 0.6, y: 14 });

  reveal('.collaboration .eyebrow', { y: 18 });
  reveal('.collaboration h2', { y: 44 });
  reveal('.collaboration__inner > p', { y: 28 });
  reveal('.collaboration-tags', { y: 20 });
  reveal('.terminal-context-dashboard', { y: 50, scale: 0.97, duration: 1 });

  reveal('.about .eyebrow', { y: 18 });
  reveal('.about h2', { y: 44 });
  reveal('.about__lead', { y: 28 });
  reveal('.about-grid article', { y: 36, stagger: 0.12 });

  reveal('.footer', { y: 24, duration: 0.7 });

  /* ---------------------------------------------------------------------
     Port-scene parallax depth in the hero: each atmosphere layer drifts
     at a different rate while the hero scrolls by, the classic
     multi-plane parallax feel. These are separate elements from the
     ones animated by CSS keyframes (crane-trolley/hook/load, the
     sailing-vessel itself) so the two motion systems never fight over
     the same "transform" property on the same node.
     ------------------------------------------------------------------- */
  var heroParallax = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.port-water', { yPercent: 14, ease: 'none', scrollTrigger: heroParallax });
  gsap.to('.yard-grid', { yPercent: -10, ease: 'none', scrollTrigger: heroParallax });
  gsap.to('.quay-edge', { yPercent: 6, ease: 'none', scrollTrigger: heroParallax });
  gsap.to('.crane', { yPercent: -14, xPercent: -4, ease: 'none', scrollTrigger: heroParallax });
})();
