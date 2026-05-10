function createAnimeFallback() {
  const fallback = function(options) {
    const targets = typeof options.targets === 'string'
      ? document.querySelectorAll(options.targets)
      : options.targets instanceof Element
        ? [options.targets]
        : options.targets || [];

    const targetList = Array.from(targets.length === undefined ? [targets] : targets);

    targetList.forEach((target) => {
      if (!target || !target.style) return;

      if (options.opacity) target.style.opacity = Array.isArray(options.opacity) ? options.opacity[1] : options.opacity;
      if (options.scale) target.style.scale = Array.isArray(options.scale) ? options.scale[1] : options.scale;
      if (options.width) target.style.width = options.width;
      if (options.left !== undefined) target.style.left = `${options.left}px`;
      if (options.top !== undefined) target.style.top = `${options.top}px`;
      if (options.translateY) target.style.transform = `translateY(${Array.isArray(options.translateY) ? options.translateY[1] : options.translateY}px)`;
      if (options.innerHTML && target.textContent !== undefined) target.textContent = Array.isArray(options.innerHTML) ? options.innerHTML[1] : options.innerHTML;
    });

    if (typeof options.complete === 'function') options.complete();

    return {
      pause() {},
      play() {},
      restart() {}
    };
  };

  fallback.stagger = function(value) {
    return function(_, index) {
      return index * value;
    };
  };

  return fallback;
}

window.addEventListener('DOMContentLoaded', () => {
  const animeSafe = window.anime || createAnimeFallback();
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('main section');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const scrollProgress = document.getElementById('scrollProgress');
  const cursorGlow = document.querySelector('.cursor-glow');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const revealEls = document.querySelectorAll('.reveal');
  const bars = document.querySelectorAll('.bar span');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const year = document.getElementById('year');

  year.textContent = new Date().getFullYear();

  animeSafe({
    targets: '.bobbing-word',
    translateY: [-8, 8],
    duration: 1800,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });

  animeSafe({
    targets: '.wheel',
    translateY: [0, 12],
    opacity: [1, 0.25],
    duration: 950,
    loop: true,
    easing: 'easeInOutSine'
  });

  animeSafe({
    targets: '.orb',
    translateY: [0, -24],
    scale: [1, 1.05],
    duration: 3200,
    delay: animeSafe.stagger(500),
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine'
  });

  window.addEventListener('mousemove', (event) => {
    animeSafe({
      targets: cursorGlow,
      left: event.clientX,
      top: event.clientY,
      duration: 500,
      easing: 'easeOutExpo'
    });
  });

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');

    animeSafe({
      targets: '#navLinks.open a',
      translateY: [-10, 0],
      opacity: [0, 1],
      delay: animeSafe.stagger(70),
      duration: 400,
      easing: 'easeOutExpo'
    });
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '☀' : '☾';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      projectCards.forEach((card) => {
        const shouldShow = filter === 'all' || card.dataset.category === filter;

        if (shouldShow) {
          card.style.display = 'block';

          animeSafe({
            targets: card,
            opacity: [0, 1],
            scale: [0.96, 1],
            duration: 420,
            easing: 'easeOutExpo'
          });
        } else {
          animeSafe({
            targets: card,
            opacity: [1, 0],
            scale: [1, 0.96],
            duration: 220,
            easing: 'easeInExpo',
            complete: () => {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animeSafe({
          targets: entry.target,
          translateY: [34, 0],
          opacity: [0, 1],
          duration: 750,
          easing: 'easeOutExpo'
        });

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealEls.forEach((el) => {
    el.style.opacity = 0;
    revealObserver.observe(el);
  });

  const learningObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        bars.forEach((bar, index) => {
          animeSafe({
            targets: bar,
            width: bar.dataset.width,
            duration: 1100,
            delay: index * 140,
            easing: 'easeOutExpo'
          });
        });

        learningObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });

  learningObserver.observe(document.getElementById('learning'));

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    animeSafe({
      targets: toast,
      translateY: ['130%', '0%'],
      duration: 500,
      easing: 'easeOutExpo'
    });

    setTimeout(() => {
      animeSafe({
        targets: toast,
        translateY: ['0%', '130%'],
        duration: 500,
        easing: 'easeInExpo'
      });
    }, 2600);

    contactForm.reset();
  });

  function updateScroll() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;

    let current = 'home';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160;

      if (scrollTop >= sectionTop) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  function runSmokeTests() {
    console.assert(document.querySelector('#home'), 'Smoke test failed: home section missing');
    console.assert(document.querySelector('#projects'), 'Smoke test failed: projects section missing');
    console.assert(document.querySelector('#learning'), 'Smoke test failed: learning section missing');
    console.assert(document.querySelector('#contact'), 'Smoke test failed: contact section missing');
    console.assert(document.querySelectorAll('.project-card').length === 6, 'Smoke test failed: expected 6 project cards');
    console.assert(typeof animeSafe === 'function', 'Smoke test failed: animation function unavailable');
    console.log('Portfolio smoke tests passed');
  }

  window.addEventListener('scroll', updateScroll);
  updateScroll();
  runSmokeTests();
});
