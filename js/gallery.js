/**
 * SALON VELLORA - LUXURY GALLERY & ACCESSIBLE LIGHTBOX
 * Category filtering, smooth transitions, keyboard navigation & touch swipe
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initGalleryLightbox();
});

let currentGalleryItems = [];
let currentLightboxIndex = 0;

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.classList.add('fadeInUp');
        } else {
          item.style.display = 'none';
          item.classList.remove('fadeInUp');
        }
      });
    });
  });
}

function initGalleryLightbox() {
  const modal = document.getElementById('galleryLightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');

  if (!modal || !lightboxImg) return;

  const updateVisibleItems = () => {
    const allItems = Array.from(document.querySelectorAll('.gallery-item'));
    currentGalleryItems = allItems.filter(item => window.getComputedStyle(item).display !== 'none');
  };

  const showImageAtIndex = (index) => {
    if (!currentGalleryItems.length) return;
    
    if (index < 0) {
      currentLightboxIndex = currentGalleryItems.length - 1;
    } else if (index >= currentGalleryItems.length) {
      currentLightboxIndex = 0;
    } else {
      currentLightboxIndex = index;
    }

    const item = currentGalleryItems[currentLightboxIndex];
    const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img')?.src;
    const title = item.getAttribute('data-title') || 'Salon Vellora Artistry';
    const category = item.getAttribute('data-category-name') || 'Haute Beauty';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;
  };

  const openLightbox = (clickedItem) => {
    updateVisibleItems();
    currentLightboxIndex = currentGalleryItems.indexOf(clickedItem);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    showImageAtIndex(currentLightboxIndex);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Bind click on gallery items
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImageAtIndex(currentLightboxIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImageAtIndex(currentLightboxIndex + 1));

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImageAtIndex(currentLightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImageAtIndex(currentLightboxIndex + 1);
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showImageAtIndex(currentLightboxIndex + 1); // Swipe left -> Next
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showImageAtIndex(currentLightboxIndex - 1); // Swipe right -> Prev
    }
  };
}
