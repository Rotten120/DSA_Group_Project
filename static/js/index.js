// SLIDER
document.addEventListener('DOMContentLoaded', function () {
  const sliderContainer = document.querySelector('.slider-container');
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  if (!sliderContainer || slides.length === 0 || indicators.length === 0 || !leftArrow || !rightArrow) {
    console.error('Slider elements not found. Check your HTML structure.');
    return;
  }

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideWidth = 100 / totalSlides;

  sliderContainer.style.animation = 'none';

  function updateSlide(index) {
    const translateX = -index * slideWidth;
    sliderContainer.style.transform = `translateX(${translateX}%)`;
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide(currentIndex);
  });

  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlide(currentIndex);
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateSlide(currentIndex);
    });
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide(currentIndex);
  }, 3000);

  updateSlide(currentIndex);
});
