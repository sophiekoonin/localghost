document.documentElement.classList.remove('no-js');
gsap.registerPlugin(MotionPathPlugin);
// thx Andy Bell: https://hankchizljaw.com/wrote/create-a-user-controlled-dark-or-light-mode/
const COLOR_STORAGE_KEY = 'user-color-scheme';
const FONT_KEY = 'use-8bit-font';
const FONT_VAR = '--font-mode';
const COLOR_VAR = '--color-mode';
const fontToggle = document.querySelector('#font-toggle-checkbox');
const moonOrSun = document.querySelector('#moon-or-sun');
const darkModeCheckbox = document.querySelector('#toggle-checkbox');
const toggleSlider = document.querySelector('.toggle-slider');
const getCSSCustomProp = (propKey) => {
  let response = getComputedStyle(document.documentElement).getPropertyValue(
    propKey
  );

  if (response.length) {
    response = response.replace(/\"/g, '').trim();
  }

  return response;
};

const getCurrentSetting = (passedSetting, dataName, storageKey, cssVar) => {
  let currentSetting = passedSetting || localStorage.getItem(storageKey);

  if (currentSetting) {
    document.documentElement.setAttribute(dataName, currentSetting);
  } else {
    currentSetting = getCSSCustomProp(cssVar);
  }
  return currentSetting;
};
const applyColorSetting = (passedSetting) => {
  const currentSetting = getCurrentSetting(
    passedSetting,
    'data-user-color-scheme',
    COLOR_STORAGE_KEY,
    COLOR_VAR
  );
  darkModeCheckbox.checked = currentSetting === 'dark';

  if (!toggleSlider.classList.contains('with-transition')) {
    moonOrSun.className = currentSetting === 'dark' ? 'moon' : 'sun';
    animateSunIn();
    toggleSlider.classList.add('with-transition');
  }
};

const toggleColorSetting = () => {
  let currentSetting = localStorage.getItem(COLOR_STORAGE_KEY);

  switch (currentSetting) {
    case null:
      currentSetting =
        getCSSCustomProp(COLOR_MODE_KEY) === 'dark' ? 'light' : 'dark';
      break;
    case 'light':
      currentSetting = 'dark';
      break;
    case 'dark':
      currentSetting = 'light';
      break;
  }

  localStorage.setItem(COLOR_STORAGE_KEY, currentSetting);

  return currentSetting;
};

const applyFontSetting = (passedSetting) => {
  console.log(passedSetting);
  const currentSetting = getCurrentSetting(
    passedSetting,
    'data-user-8bit-fonts',
    FONT_KEY,
    FONT_VAR
  );
  console.log({ currentSetting });
  fontToggle.checked = currentSetting === 'on';
};

const toggleFontSetting = () => {
  let currentSetting = localStorage.getItem(FONT_KEY);
  switch (currentSetting) {
    case null:
      currentSetting = 'on';
      break;
    case 'on':
      currentSetting = 'off';
      break;
    case 'off':
      currentSetting = 'on';
      break;
  }

  localStorage.setItem(FONT_KEY, currentSetting);

  return currentSetting;
};

darkModeCheckbox.addEventListener('click', (evt) => {
  animateSunOut();
  applyColorSetting(toggleColorSetting());
});

fontToggle.addEventListener('click', (evt) => {
  applyFontSetting(toggleFontSetting());
});

(function applySettings() {
  applyColorSetting();
  applyFontSetting();
})();

function animateSunIn() {
  gsap.to('#moon-or-sun', {
    motionPath: {
      path: '#sun-motion-path',
      align: '#sun-motion-path',
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
      end: 0.5,
    },
    transformOrigin: '50% 50%',
    duration: 2,
    immediateRender: true,
  });
}

function animateSunOut() {
  gsap.to('#moon-or-sun', {
    motionPath: {
      path: '#sun-motion-path',
      align: '#sun-motion-path',
      alignOrigin: [0.5, 0.5],
      autoRotate: false,
      start: 0.5,
      end: 1,
    },
    transformOrigin: '50% 50%',
    duration: 1,
    immediateRender: true,
    onComplete: () => {
      const currentClassName = moonOrSun.className;
      moonOrSun.className = currentClassName === 'sun' ? 'moon' : 'sun';
      animateSunIn();
    },
  });
}
