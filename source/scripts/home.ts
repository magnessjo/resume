require('styles/pages/home.css');

const ImageSlider = () => {
  const header = document.querySelector('header');
  const start = 7000;
  let timer = start;

  if (!header) throw new Error('No header found');
  const slider = header.querySelector('.image-slider');
  if (!slider) throw new Error('No image slider found');
  const wrapper = slider.querySelector('.wrapper');
  if (!wrapper) throw new Error('No image slider wrapper found');

  const images = Array.from(
    wrapper.querySelectorAll('img'),
  ).reverse() as HTMLImageElement[];

  images.forEach((image, i) => {
    const interation = start + start * i - i * 1000;
    if (i > 0) timer = interation;

    if (i !== images.length - 1) {
      setTimeout(() => {
        image.style.opacity = '0';
      }, timer);
    }
  });
};

const Highlights = () => {
  const ANIMATION_CLASS = 'animation-letter';
  const container = document.querySelector('.highlights');
  if (!container) throw new Error('No highlights container found');
  const words = Array.from(container.querySelectorAll('li')) as HTMLLIElement[];
  const firstElement = words.splice(0, 1)[0];

  const setLettersWithSpans = () => {
    words.forEach((word, i) => {
      const attrLabel = word.getAttribute('aria-label');
      if (!attrLabel) throw new Error('No data-string attribute found');
      const letters = attrLabel.split('');

      const setWord = ({
        word,
        letter,
      }: {
        word: HTMLElement;
        letter: string;
      }) =>
        (word.innerHTML = word.innerHTML +=
          `<span class="${ANIMATION_CLASS}">${letter}</span>`);

      letters.forEach((letter) => setWord({ word, letter }));
    });
  };

  const setBlink = () => {
    const element = firstElement.querySelector('span');
    if (!element) throw new Error('No span found');
    let showing = true;

    const blink = () => {
      setTimeout(() => {
        if (showing) {
          element.style.opacity = '0';
          showing = false;
        } else {
          element.style.opacity = '1';
          showing = true;
        }
        blink();
      }, 300);
    };

    blink();
  };

  const removeBlink = () => firstElement.querySelector('span')?.remove();

  const setFirst = ({ word }: { word: HTMLElement }) => {
    const attr = word.getAttribute('aria-label');
    if (!attr) throw new Error('No data-string attribute found');
    const str = attr.split('');
    let printout = '';

    str.forEach((letter, i) => {
      setTimeout(() => {
        printout += `${letter}`;
        word.innerHTML = `${printout}<span></span>`;
        if (i === str.length - 1) setBlink();
      }, 100 * i);
    });
  };

  const animationOthers = () => {
    const elements = Array.from(
      container.querySelectorAll(`.${ANIMATION_CLASS}`),
    ) as HTMLElement[];

    elements
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .forEach((element, i) => {
        setTimeout(() => {
          element.style.opacity = '1';
        }, Math.random() * 1600);
      });
  };

  setLettersWithSpans();
  setFirst({ word: firstElement });
  setTimeout(() => {
    animationOthers();
    removeBlink();
  }, 5000);
};

document.addEventListener('DOMContentLoaded', () => {
  ImageSlider();
  Highlights();
});

export {};
