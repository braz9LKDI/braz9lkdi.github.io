document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelector('.project-cards');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const sliderDots = document.querySelector('.slider-dots');

  // Get all cards
  const cards = document.querySelectorAll('.project-card');

  // Dynamic values
  let cardWidth;
  let cardsPerView;
  let totalSlides;

  let currentIndex = 0;

  /**
   * Scrolls the slider to a slide and marks the matching dot active.
   *
   * The index is clamped to the valid range, so callers may pass `currentIndex ± 1` without
   * checking bounds. Scrolling is done by setting `scrollLeft`; the animation itself comes from
   * `scroll-behavior: smooth` in the stylesheet.
   *
   * Mutates `currentIndex` and the DOM.
   *
   * @param {number} index: 0-based slide index; clamped to the available range.
   */
  const slideTo = (index) => {
    let targetIndex = index;

    if (targetIndex < 0) {
      targetIndex = 0;
    } else if (targetIndex > totalSlides - 1) {
      targetIndex = totalSlides - 1;
    }

    currentIndex = targetIndex;

    const scrollAmount = targetIndex * (cardsPerView * cardWidth);
    projectCards.scrollLeft = scrollAmount;

    // Update active dot
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  /**
   * Rebuilds the navigation dots, one per slide.
   *
   * Clears the existing dots first, since the slide count changes with the viewport width.
   */
  const initializeDots = () => {
    // Clear existing dots
    sliderDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) {
        dot.classList.add('active');
      }
      // Dot navigation
      dot.addEventListener('click', () => slideTo(i));
      sliderDots.appendChild(dot);
    }
  };

  /**
   * Measures the slider and recalculates how many cards fit in one view.
   *
   * Runs on load and on every resize, because the card count per slide depends on the rendered
   * width. Card width is read from the first card plus the 20px flex gap, which the stylesheet
   * defines and this measurement has to mirror.
   *
   * The dots are rebuilt only when the slide count actually changes, so an ordinary resize does not
   * discard them. The slider returns to the first slide either way, since the previous index may no
   * longer point at the same cards.
   *
   * Returns early when no cards are present, which is the case if the generated markup is empty.
   *
   * Mutates `cardWidth`, `cardsPerView` and `totalSlides`.
   */
  function setup() {
    if (!cards.length) {
      return;
    }

    const previousTotalSlides = totalSlides;
    // Create dots base on number of cards that can be shown at once
    cardWidth = cards[0].offsetWidth + 20; // Including gap
    const containerWidth = projectCards.offsetWidth;
    cardsPerView = Math.max(1, Math.floor(containerWidth / cardWidth));
    totalSlides = Math.max(1, Math.ceil(cards.length / cardsPerView));

    if (previousTotalSlides !== totalSlides) {
      initializeDots();
    }
    slideTo(0);
  }

  prevBtn.addEventListener('click', () => {
    slideTo(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    slideTo(currentIndex + 1);
  });

  window.addEventListener('load', setup);
  window.addEventListener('resize', setup);
});
