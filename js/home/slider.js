document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelector(".project-cards");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const sliderDots = document.querySelector(".slider-dots");

  // Get all cards
  const cards = document.querySelectorAll(".project-card");

  // Dynamic values
  let cardWidth;
  let cardsPerView;
  let totalSlides;

  let currentIndex = 0;
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
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  };

  const initializeDots = () => {
    // Clear existing dots
    sliderDots.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) {
        dot.classList.add("active");
      }
      // Dot navigation
      dot.addEventListener("click", () => slideTo(i));
      sliderDots.appendChild(dot);
    }
  };

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

  prevBtn.addEventListener("click", () => {
    slideTo(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    slideTo(currentIndex + 1);
  });

  window.addEventListener("load", setup);
  window.addEventListener("resize", setup);
});
