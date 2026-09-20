/**
 * SALON VELLORA - LUXURY TESTIMONIALS SLIDER
 * Carousel with auto-play, pause-on-hover, touch swipe, arrow buttons, and indicator dots
 */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialSlider();
});

function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    const dots = dotsContainer?.querySelectorAll('.carousel-dot');
    if (dots) {
      dots.forEach((d, i) => {
        if (i === currentIndex) {
          d.classList.add('active');
        } else {
          d.classList.remove('active');
        }
      });
    }
  };

  const setSliderPosition = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    setSliderPosition();
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  // Auto-play
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 5500);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  const carouselWrap = document.querySelector('.testimonial-carousel-wrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', stopAutoPlay);
    carouselWrap.addEventListener('mouseleave', startAutoPlay);
  }

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoPlay();
  }, { passive: true });

  // Initial call
  setSliderPosition();
  startAutoPlay();
}
