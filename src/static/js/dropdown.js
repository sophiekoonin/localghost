let trigger;
let menuLinks;
let isOpen = false;

window.onload = () => {
  const triggerEl = document.getElementById('submenu-trigger');
  trigger = triggerEl;
  menuLinks = document.querySelectorAll('.submenu-link');

  triggerEl.onclick = (e) => {
    e.stopPropagation();
    toggleVisibility();
  };
  triggerEl.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      toggleVisibility();
    }
  };
  document.onkeydown = (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  };
  closeMenu();
};

function toggleVisibility() {
  if (isOpen) {
    closeMenu();
  } else {
    showMenu();
  }
}

function closeOnBackdropClick(e) {
  if (e.target.id !== 'submenu-dropdown') {
    closeMenu();
  }
}
function closeMenu() {
  isOpen = false;
  trigger.setAttribute('aria-expanded', false);
  menuLinks.forEach((link) => {
    // disable tabbing when menu not visible
    link.setAttribute('tabindex', '-1');
  });
  document.removeEventListener('click', closeOnBackdropClick);
}
function showMenu() {
  isOpen = true;
  trigger.setAttribute('aria-expanded', true);
  menuLinks.forEach((link) => {
    link.removeAttribute('tabindex');
  });
  document.addEventListener('click', closeOnBackdropClick);
}
