import { setColoursForTime, setStage } from "./gradients.mjs";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function pictureEl(name, alt) {
  return `
<picture>
    <source srcset="/img/themes/geocities/${name}.gif" 
    media="(prefers-reduced-motion: no-preference)">
    <img src="/img/themes/geocities/static/${name}.png" 
    alt="${alt}" />
  </picture>`;
}

function contentStart(reducedMotion) {
  return pictureEl("welcome", "Welcome to my Homepage") + `<p>Thanks for visiting!</p>`;
}

function contentEnd(reducedMotion) {
  return (
    `<p>This site is</p>` +
    pictureEl("consbar", "under construction") +
    pictureEl("flames", "") +
    '<p>You are visitor number <img src="/img/themes/geocities/static/counter.png" alt="hit counter showing 2147483648" /></p>'
  );
}

const currentPage = window.location.pathname;
const THEME_STORAGE_KEY = "user-theme";
const THEMES = {
  city: "city",
  minimalist: "minimalist",
  vaporwave: "vaporwave",
  garden: "garden",
  geocities: "geocities",
  twothousandandthree: "twothousandandthree",
};

let skyscrapers = [];
let themeOptions = [];
let theme = "";

function changeTheme(newTheme) {
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
  if (themeOptions.length > 0) {
    const t = themeOptions.find((el) => el.id === newTheme);
    if (t) {
      t.checked = true;
    }
  }

  if (theme !== newTheme) {
    switch (theme) {
      case "geocities":
        cleanupGeocities();
        break;
      case "twothousandandthree":
        clear2003Stuff();
        break;
      case "garden":
        cleanupGarden();
        break;
      default:
        break;
    }
  }

  switch (newTheme) {
    case "geocities":
      if (currentPage === "/") {
        initGeocities();
      }
      // this is a proxy for "has the page loaded"
      if (skyscrapers.length > 0) {
        new fairyDustCursor({ colors: ["#F5B5FC", "#96F7D2", "#FCB1B1"] });
      }
      break;
    case "twothousandandthree":
      inject2003Stuff();
      break;
    case "garden":
      initGardenTheme();
      break;
    case "city":
      const savedPref = sessionStorage.getItem("stage") ?? "now";
      changeStage(savedPref);
      break;
    default:
      break;
  }
  theme = newTheme;
}

function themeEventListener(e) {
  const newTheme = e.target.value;
  changeTheme(newTheme);
}

function timeEventListener(e) {
  document.body.classList.add("with-transition");
  const newStage = e.target.value;
  window.sessionStorage.setItem("stage", newStage);
  changeStage(newStage);
}

function changeStage(newStage) {
  if (newStage === "now") {
    setColoursForTime();
  } else {
    setStage(newStage);
  }
}
window.addEventListener("load", () => {
  skyscrapers = Array.from(document.getElementsByClassName("skyscraper"));

  document.querySelector("#theme-switcher").addEventListener("change", themeEventListener);
  document.querySelector("#time-selector").addEventListener("change", timeEventListener);
});

function cleanupGeocities() {
  destroyCursor();
  if (theme === "geocities") {
    if (currentPage === "/") {
      clearGeocities();
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
  let possibleColors = (options && options.colors) || ["#D61C59", "#E7D84B", "#1B8798"];
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
    canvas = document.createElement("canvas");
    canvas.id = "cursor-canvas";
    context = canvas.getContext("2d");
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    if (hasWrapperEl) {
      canvas.style.position = "absolute";
      element.appendChild(canvas);
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.style.position = "fixed";
      element.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
    }

    context.font = "15px serif";
    context.textBaseline = "middle";
    context.textAlign = "center";

    possibleColors.forEach((color) => {
      let measurements = context.measureText("★");
      let bgCanvas = document.createElement("canvas");
      let bgContext = bgCanvas.getContext("2d");

      bgCanvas.width = measurements.width;
      bgCanvas.height = measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent;

      bgContext.fillStyle = color;
      bgContext.textAlign = "center";
      bgContext.font = "15px serif";
      bgContext.textBaseline = "middle";
      bgContext.fillText("★", bgCanvas.width / 2, measurements.actualBoundingBoxAscent);

      canvImages.push(bgCanvas);
    });

    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("touchmove", onTouchMove, { passive: true });
    element.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("resize", onWindowResize);
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
        addParticle(e.touches[i].clientX, e.touches[i].clientY, canvImages[Math.floor(Math.random() * canvImages.length)]);
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

      const distBetweenPoints = Math.hypot(cursor.x - lastPos.x, cursor.y - lastPos.y);

      if (distBetweenPoints > 1.5) {
        addParticle(cursor.x, cursor.y, canvImages[Math.floor(Math.random() * possibleColors.length)]);

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
        this.canv.height * scale,
      );
    };
  }

  init();
}

function destroyCursor() {
  const cursor = document.getElementById("cursor-canvas");
  if (cursor) {
    cursor.remove();
  }
}

function initGeocities() {
  const start = document.getElementById("content-start");
  const end = document.getElementById("content-end");
  if (start && end) {
    start.innerHTML = contentStart(prefersReducedMotion);
    end.innerHTML = contentEnd(prefersReducedMotion);
  }

  document.querySelectorAll(".footer-links a").forEach((el) => el.appendChild(document.createElement("span")));
}

function clearGeocities() {
  const start = document.getElementById("content-start");
  const end = document.getElementById("content-end");
  if (start && end) {
    start.innerHTML = "";
    end.innerHTML = "";
  }
}

function clear2003Stuff() {
  const sidebarExtras = document.querySelector(".sidebar-extras");
  if (sidebarExtras) {
    sidebarExtras.remove();
  }
}

function inject2003Stuff() {
  const sidebar = document.getElementsByClassName("sidebar")[0];
  if (sidebar) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("sidebar-extras");

    const siteStats = document.createElement("section");
    siteStats.innerHTML = `<div class="sidebar-stats"><p>v3.5 // since 2019, like it's 2003.</p><p>host: <a href="https://neocities.org">neocities</a></p></div>`;
    wrapper.appendChild(siteStats);
    const currently = document.createElement("section");
    currently.classList.add("flow");
    currently.innerHTML = `<h2>currently</h2><dl class="php-currently"><dt>Drinking:</dt><dd>diet coke</dd><dt>Listening to:</dt><dd>evanescence</dd><dt>Wearing:</dt><dd>massive flares</dd><dt>Talking to:</dt><dd>friends on MSN</dd></dl><p>not powered by <a href="https://web.archive.org/web/20030803171648/http://www.codegrrl.com/scripts/phpcurrently/index.php" target="_blank" rel="noopener">PHPCurrently</a>`;
    wrapper.appendChild(currently);
    sidebar.appendChild(wrapper);
  }
}

function initGardenTheme() {
  const header = document.getElementsByTagName("header")[0];
  if (header) {
    const btn = document.createElement("button");
    const img = document.createElement("img");
    img.src = "/img/themes/garden-theme/red-admiral.png";
    btn.classList.add("butterfly");
    btn.ariaHidden = true;
    btn.id = "butterfly";
    btn.onclick = function () {
      btn.classList.add("tweened");
      setTimeout(() => {
        btn.classList.remove("tweened");
      }, 4000);
    };
    btn.appendChild(img);
    header.appendChild(btn);
  }
}

function cleanupGarden() {
  const bfly = document.getElementById("butterfly");
  if (bfly) bfly.remove();
}

const search = new URLSearchParams(window.location.search);
theme = search.get("theme") || localStorage.getItem("user-theme") || "city";
changeTheme(theme);

const interestingFacts = [
  "amateur but enthusiastic gardener",
  "dog botherer",
  "baker of delicious treats",
  "arranger of pop songs for choirs",
  "occasional public speaker",
  "inconsistent crafter",
  "Stardew Valley-dweller",
  "hoarder of recipes",
  "maker of terrible jokes",
];

const interestingFactEl = document.getElementById("interesting-fact");
if (interestingFactEl) {
  const randomInterestingFact = interestingFacts[Math.floor(Math.random() * interestingFacts.length)];
  interestingFactEl.textContent = randomInterestingFact;
}
