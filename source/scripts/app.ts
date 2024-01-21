const MenuBehaviors = () => {
  const menu = document.querySelector('menu');
  const main = document.querySelector('main');

  if (!menu || !main) return;

  const menuDisplay = () => {
    const menuPosition = menu.getBoundingClientRect().top;
    const mainPositon = main.getBoundingClientRect().top;
  };

  menuDisplay();
  window.addEventListener('scroll', menuDisplay);
};

document.addEventListener('DOMContentLoaded', () => {
  MenuBehaviors();
});

export {};
