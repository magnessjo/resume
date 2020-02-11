type EventAccessibilityFocusParams = {
  element: HTMLElement | Element;
  button?: HTMLButtonElement;
  action: (arg: KeyboardEvent) => void;
};

type EventAccessibilityFocusType = (
  arg: EventAccessibilityFocusParams,
) => () => void;

type EventAccessibilityEventsType = () => void | undefined;

const EventAccessibilityFocus: EventAccessibilityFocusType = ({
  element,
  button,
  action,
}) => {
  const escapeEvent = (event: KeyboardEvent) => {
    if (event.keyCode == 27) {
      action(event);
    }
  };

  const keyDownEvent = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (!firstTab) {
        const currentElement = event.target as HTMLElement;
        if (element && !element.contains(currentElement)) {
          action(event);
        }
      } else {
        event.preventDefault();
      }
    }
  };

  const keyUpEvent = (event: KeyboardEvent) => {
    event.preventDefault();

    if (event.key === 'Tab') {
      if (firstTab) {
        firstTab = false;
        const firstElement = element.querySelector('a') as HTMLElement;
        firstElement.focus();
      }
    }

    if (event.key === 'Tab' && event.shiftKey) {
      if (button) button.focus();
    }
  };

  let firstTab = true;

  window.addEventListener('keydown', escapeEvent);
  window.addEventListener('keydown', keyDownEvent);
  window.addEventListener('keyup', keyUpEvent);

  return () => {
    window.removeEventListener('keydown', escapeEvent);
    window.removeEventListener('keydown', keyDownEvent);
    window.removeEventListener('keyup', keyUpEvent);
  };
};

const Menu = () => {
  const main = document.querySelector('main') as HTMLDivElement;
  const button = document.querySelector(
    'button[aria-controls="navigation"]',
  ) as HTMLButtonElement;
  const ANIMATION_TIME = 500;

  if (!main || !button) return;

  const container = main.querySelector('.container') as HTMLDivElement;
  const menu = document.querySelector('menu') as HTMLMenuElement;
  let eventCallbacks: EventAccessibilityEventsType;

  if (!container || !menu) {
    button.style.display = 'none';
    return;
  }

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    const isSizeShrink = container.offsetWidth > 600;

    menu.style.display = 'block';

    const close = () => {
      button.setAttribute('aria-expanded', 'false');

      main.style.transition = `transform ${ANIMATION_TIME}ms`;

      if (isSizeShrink) {
        main.style.transition = `width ${ANIMATION_TIME}ms, transform ${ANIMATION_TIME}ms`;
        main.style.width = `100%`;
      }

      main.style.transform = `translateX(0)`;

      setTimeout(() => {
        menu.style.display = 'none';
      }, ANIMATION_TIME);

      if (eventCallbacks) eventCallbacks();
    };

    const open = () => {
      button.setAttribute('aria-expanded', 'true');
      menu.style.display = 'block';

      eventCallbacks = EventAccessibilityFocus({
        element: menu,
        button,
        action: close,
      });

      setTimeout(() => {
        const menuSize = menu.offsetWidth;

        main.style.transition = `transform ${ANIMATION_TIME}ms`;

        if (isSizeShrink) {
          main.style.transition = `width ${ANIMATION_TIME}ms, transform ${ANIMATION_TIME}ms`;
          main.style.width = `${window.innerWidth - menuSize}px`;
        }

        main.style.transform = `translateX(${menuSize}px)`;
      }, 10);
    };

    isOpen ? close() : open();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  Menu();
});
