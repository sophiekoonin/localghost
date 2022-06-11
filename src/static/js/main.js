const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function contentStart(reducedMotion) {
  return `<img src="/img/geocities/${
    reducedMotion ? 'static/welcome.png' : 'welcome.gif'
  }">
<p>Thanks for visiting!</p>`;
}

function contentEnd(reducedMotion) {
  return `<p>This site is</p>
<img alt="Under Construction" src="/img/geocities/${
    reducedMotion ? 'static/consbar.png' : 'consbar.gif'
  }"/>
<img src="/img/geocities/${
    reducedMotion ? 'static/flames.png' : 'flames.gif'
  }" alt=""/>
<p>You are visitor number <img src="/img/geocities/static/counter.png" alt="hit counter showing 2147483648" /></p>`;
}
document.documentElement.classList.remove('no-js');
const currentPage = window.location.pathname;

const THEME_STORAGE_KEY = 'user-theme';
const THEMES = {
  city: 'city',
  sunset: 'sunset',
  minimalist: 'minimalist',
  vaporwave: 'vaporwave',
  pastel: 'pastel',
  geocities: 'geocities',
};

let palmtrees = [];
let skyscrapers = [];
let themeOptions = [];

const search = new URLSearchParams(window.location.search);
let theme =
  search.get('theme') || localStorage.getItem(THEME_STORAGE_KEY) || 'city';
changeTheme(theme);

function changeTheme(newTheme) {
  if (theme !== newTheme) {
    if (!Object.keys(THEMES).includes(newTheme)) {
      newTheme = 'city';
    }
  }
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  if (themeOptions.length > 0) {
    themeOptions.find((el) => el.id === newTheme).checked = true;
  }
  switch (newTheme) {
    case 'geocities':
      if (currentPage === '/') {
        injectGeocitiesGoodness();
      }
      if (palmtrees.length > 0) {
        new fairyDustCursor({ colors: ['#F5B5FC', '#96F7D2', '#FCB1B1'] });
      }
      break;
    default:
      cleanupGeocities();
      break;
  }
  theme = newTheme;
}

function hideElement(element) {
  element.classList.add('hidden');
}
function showElement(element) {
  element.classList.remove('hidden');
}

window.onload = () => {
  skyscrapers = Array.from(document.getElementsByClassName('skyscraper'));
  palmtrees = Array.from(document.getElementsByClassName('palmtree'));
  themeOptions = Array.from(document.getElementsByClassName('theme-option'));

  themeOptions.forEach((el) =>
    addEventListener('change', function (e) {
      if (e.target.checked) {
        const newTheme = e.target.value;
        changeTheme(newTheme);
      }
    })
  );
  changeTheme(theme);
};

function cleanupGeocities() {
  destroyCursor();
  if (theme === 'geocities') {
    if (currentPage === '/') {
      clearGeocitiesRubbish();
    }
  }
}

// https://github.com/tholman/cursor-effects

let skipAnim = prefersReducedMotion.matches;

prefersReducedMotion.onchange = () => {
  skipAnim = prefersReducedMotion.matches;
};

function fairyDustCursor(options) {
  if (skipAnim) {
    return false;
  }
  let possibleColors = (options && options.colors) || [
    '#D61C59',
    '#E7D84B',
    '#1B8798',
  ];
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: width / 2 };
  const lastPos = { x: width / 2, y: width / 2 };
  const particles = [];
  const canvImages = [];
  let canvas, context;

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    context = canvas.getContext('2d');
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';

    if (hasWrapperEl) {
      canvas.style.position = 'absolute';
      element.appendChild(canvas);
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.style.position = 'fixed';
      element.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
    }

    context.font = '15px serif';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    possibleColors.forEach((color) => {
      let measurements = context.measureText('★');
      let bgCanvas = document.createElement('canvas');
      let bgContext = bgCanvas.getContext('2d');

      bgCanvas.width = measurements.width;
      bgCanvas.height =
        measurements.actualBoundingBoxAscent +
        measurements.actualBoundingBoxDescent;

      bgContext.fillStyle = color;
      bgContext.textAlign = 'center';
      bgContext.font = '15px serif';
      bgContext.textBaseline = 'middle';
      bgContext.fillText(
        '★',
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      );

      canvImages.push(bgCanvas);
    });

    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;

    if (hasWrapperEl) {
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          canvImages[Math.floor(Math.random() * canvImages.length)]
        );
      }
    }
  }

  function onMouseMove(e) {
    window.requestAnimationFrame(() => {
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect();
        cursor.x = e.clientX - boundingRect.left;
        cursor.y = e.clientY - boundingRect.top;
      } else {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
      }

      const distBetweenPoints = Math.hypot(
        cursor.x - lastPos.x,
        cursor.y - lastPos.y
      );

      if (distBetweenPoints > 1.5) {
        addParticle(
          cursor.x,
          cursor.y,
          canvImages[Math.floor(Math.random() * possibleColors.length)]
        );

        lastPos.x = cursor.x;
        lastPos.y = cursor.y;
      }
    });
  }

  function addParticle(x, y, color) {
    particles.push(new Particle(x, y, color));
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);

    // Update
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context);
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1);
      }
    }
  }

  function loop() {
    updateParticles();
    requestAnimationFrame(loop);
  }

  function Particle(x, y, canvasItem) {
    const lifeSpan = Math.floor(Math.random() * 30 + 60);
    this.initialLifeSpan = lifeSpan; //
    this.lifeSpan = lifeSpan; //ms
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
      y: Math.random() * 0.7 + 0.9,
    };
    this.position = { x: x, y: y };
    this.canv = canvasItem;

    this.update = function (context) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;

      this.velocity.y += 0.02;

      const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

      context.drawImage(
        this.canv,
        this.position.x - (this.canv.width / 2) * scale,
        this.position.y - this.canv.height / 2,
        this.canv.width * scale,
        this.canv.height * scale
      );
    };
  }

  init();
}

function destroyCursor() {
  const cursor = document.getElementById('cursor-canvas');
  if (cursor) {
    cursor.remove();
  }
}

function injectGeocitiesGoodness() {
  const start = document.getElementById('content-start');
  const end = document.getElementById('content-end');
  if (start && end) {
    start.innerHTML = contentStart(prefersReducedMotion);
    end.innerHTML = contentEnd(prefersReducedMotion);
  }
}

function clearGeocitiesRubbish() {
  document.getElementById('content-start').innerHTML = '';
  document.getElementById('content-end').innerHTML = '';
}