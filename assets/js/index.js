document.documentElement.classList.remove('no-js');
gsap.registerPlugin(MotionPathPlugin);
// thx Andy Bell: https://hankchizljaw.com/wrote/create-a-user-controlled-dark-or-light-mode/
const STORAGE_KEY = 'user-color-scheme';
const COLOR_MODE_KEY = '--color-mode';
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

const applySetting = (passedSetting) => {
  let currentSetting = passedSetting || localStorage.getItem(STORAGE_KEY);

  if (currentSetting) {
    document.documentElement.setAttribute(
      'data-user-color-scheme',
      currentSetting
    );
  } else {
    currentSetting = getCSSCustomProp(COLOR_MODE_KEY);
  }
  darkModeCheckbox.checked = currentSetting === 'dark';

  if (!toggleSlider.classList.contains('with-transition')) {
    moonOrSun.className = currentSetting === 'dark' ? 'moon' : 'sun';
    animateSunIn();
    toggleSlider.classList.add('with-transition');
  }
};

const toggleSetting = () => {
  let currentSetting = localStorage.getItem(STORAGE_KEY);

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

  localStorage.setItem(STORAGE_KEY, currentSetting);

  return currentSetting;
};

darkModeCheckbox.addEventListener('click', (evt) => {
  animateSunOut();
  applySetting(toggleSetting());
});

applySetting();

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
