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

export function injectGeocitiesGoodness() {
  const start = document.getElementById('content-start');
  const end = document.getElementById('content-end');

  start.innerHTML = contentStart(prefersReducedMotion);
  end.innerHTML = contentEnd(prefersReducedMotion);
}

export function clearGeocitiesRubbish() {
  document.getElementById('content-start').innerHTML = '';
  document.getElementById('content-end').innerHTML = '';
}
