require('styles/pages/dogs.css');

const SlideShow = () => {
  const section = document.querySelector('.image-slides') as HTMLDivElement;

  if (!section) return;

  const container = section.querySelector('.content') as HTMLDivElement;
  const loader = section.querySelector('magness-loader') as HTMLDivElement;

  if (!container) return;

  const sliders = Array.from(
    container.querySelectorAll('.slider'),
  ) as HTMLDivElement[];
  const animationPoints = [] as number[];
  const animationPixels = [8, 16, 8];

  const wrappers = Array.from(
    container.querySelectorAll('.wrapper'),
  ) as HTMLDivElement[];

  if (!sliders) return;

  const makeSlides = () => {
    sliders.forEach((slider) => {
      const wrapper = slider.querySelector('.wrapper') as HTMLDivElement;
      const slide = slider.querySelector('.slide') as HTMLDivElement;
      const cloneOne = slide.cloneNode(true) as HTMLDivElement;
      const cloneTwo = slide.cloneNode(true) as HTMLDivElement;

      wrapper.appendChild(cloneOne);
      wrapper.appendChild(cloneTwo);

      const position = wrapper.offsetWidth / 2 + window.innerWidth / 2;
      wrapper.style.transform = `translateX(-${position}px)`;
      animationPoints.push(position);
    });
  };

  const setContainerSize = () => {
    const height = wrappers.reduce((acc, slide) => {
      return acc + slide.offsetHeight;
    }, 0);

    container.style.height = `${height}px`;
    container.style.opacity = '1';
  };

  const checkSlidePosition = ({
    slider,
    currentSlide,
    removeSlide,
    directionLeft = true,
    index,
  }: {
    slider: HTMLDivElement;
    currentSlide: HTMLDivElement;
    removeSlide: HTMLDivElement;
    directionLeft: boolean;
    index: number;
  }) => {
    if (directionLeft) {
      if (currentSlide.getBoundingClientRect().right < 0) {
        const wrapper = slider.querySelector('.wrapper') as HTMLDivElement;
        const clone = removeSlide.cloneNode(true) as HTMLDivElement;

        wrapper.appendChild(clone);
        animationPoints[index] =
          animationPoints[index] - currentSlide.offsetWidth;

        setTimeout(() => {
          removeSlide.remove();
        }, 100);
      }
    }

    if (!directionLeft) {
      const position = currentSlide.getBoundingClientRect().right;

      if (position > currentSlide.offsetWidth + window.innerWidth) {
        const wrapper = slider.querySelector('.wrapper') as HTMLDivElement;
        const clone = removeSlide.cloneNode(true) as HTMLDivElement;

        removeSlide.remove();

        setTimeout(() => {
          wrapper.insertBefore(clone, wrapper.firstChild);
          animationPoints[1] = animationPoints[1] + currentSlide.offsetWidth;
        }, 100);
      }
    }
  };

  const slideAnimation = () => {
    sliders.forEach((slider, index) => {
      const wrapper = slider.querySelector('.wrapper') as HTMLDivElement;

      const animation = () => {
        let frames = 60;
        let from = animationPoints[index];
        const isMiddleRow = index === 1;
        const animationAmount = animationPixels[index];
        const animationValue = isMiddleRow
          ? animationPoints[index] - animationAmount
          : animationPoints[index] + animationAmount;
        const toPosition = animationValue;
        const jump = (toPosition - from) / frames;
        const directionLeft = isMiddleRow ? false : true;

        animationPoints[index] = animationValue;

        function scroll() {
          if (frames > 0) {
            const position = from + jump;

            from = position;
            wrapper.style.transform = `translateX(-${from}px)`;

            frames--;
            window.requestAnimationFrame(scroll);
          } else {
            animation();

            const slides = Array.from(
              slider.querySelectorAll('.slide'),
            ) as HTMLDivElement[];

            checkSlidePosition({
              slider,
              currentSlide: slides[1],
              removeSlide: slides[isMiddleRow ? 2 : 0],
              directionLeft,
              index,
            });
          }
        }

        scroll();
      };

      animation();
    });
  };

  const eventResize = () => {
    setContainerSize();
  };

  // Load

  makeSlides();
  setContainerSize();
  slideAnimation();

  loader.remove();

  window.addEventListener('resize', eventResize);
};

window.addEventListener('load', () => {
  SlideShow();
});
