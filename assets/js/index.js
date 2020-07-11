document.documentElement.classList.remove('no-js');

// thx Andy Bell: https://hankchizljaw.com/wrote/create-a-user-controlled-dark-or-light-mode/
const STORAGE_KEY = 'user-color-scheme';
const COLOR_MODE_KEY = '--color-mode';

const darkModeCheckbox = document.querySelector('#toggle-checkbox');
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
  applySetting(toggleSetting());
});

applySetting();
