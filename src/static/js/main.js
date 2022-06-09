import {
  fairyDustCursor,
  destroyCursor,
  setCursorChar,
} from './fairyDustCursor.js';
import { injectGeocitiesGoodness, clearGeocitiesRubbish } from './themes.js';

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
      document.documentElement.setAttribute('data-cursorchar', '★');
      if (currentPage === '/') {
        injectGeocitiesGoodness();
      }
      setCursorChar('★');
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
