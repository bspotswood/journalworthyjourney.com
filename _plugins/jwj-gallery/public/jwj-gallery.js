class JWJGallery {
  constructor(galleryElement) {
    this.gallery = galleryElement;
    this.slides = this.gallery.querySelectorAll('.jwj-gallery-slide');
    this.thumbnails = this.gallery.querySelectorAll('.jwj-gallery-thumbnail');
    this.prevButton = this.gallery.querySelector('.jwj-gallery-prev');
    this.nextButton = this.gallery.querySelector('.jwj-gallery-next');
    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.isContinuousFlow = this.gallery.dataset.continuousFlow === 'true';
    this.viewer = this.gallery.querySelector('.jwj-gallery-viewer');
    
    this.init();
  }

  init() {
    // Set up event listeners
    this.prevButton.addEventListener('click', () => this.navigate(-1));
    this.nextButton.addEventListener('click', () => this.navigate(1));
    
    // Add thumbnail click listeners
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Add keyboard listeners when gallery has focus
    this.gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigate(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(1);
      }
    });
    
    // Handle cursor change on hover
    this.viewer.addEventListener('mousemove', (e) => {
      const rect = this.viewer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.right - rect.left;
      
      // Change cursor based on position
      if (x < width * 0.25) {
        this.viewer.style.cursor = 'pointer'; // Show pointer on left edge
      } else if (x > width * 0.75) {
        this.viewer.style.cursor = 'pointer'; // Show pointer on right edge
      } else {
        this.viewer.style.cursor = 'default'; // Default cursor in the middle
      }
    });
    
    // Handle click event for navigation
    this.viewer.addEventListener('click', (e) => {
      const rect = this.viewer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.right - rect.left;
      
      // If click is in left 25% or right 25%
      if (x < width * 0.25) {
        this.navigate(-1);
      } else if (x > width * 0.75) {
        this.navigate(1);
      }
    });
    
    // Make the gallery focusable for keyboard navigation
    this.gallery.setAttribute('tabindex', '0');
    
    // Add touch swipe support
    if ('ontouchstart' in window) {
      this.setupTouchEvents();
    }

    // Initialize the gallery position
    this.positionSlides();
  }
  
  setupTouchEvents() {
    let startX, startY;
    let distX, distY;
    const minSwipeDistance = 50; // Minimum distance for swipe to register
    
    this.viewer.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });
    
    this.viewer.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
      
      // Prevent vertical scrolling if horizontal swipe detected
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    this.viewer.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > minSwipeDistance) {
        // Horizontal swipe
        if (distX > 0) {
          // Swipe right -> previous
          this.navigate(-1);
        } else {
          // Swipe left -> next
          this.navigate(1);
        }
      }
      
      // Reset values
      startX = startY = distX = distY = null;
    }, { passive: true });
  }

  navigate(direction) {
    this.goToSlide((this.currentIndex + direction + this.slideCount) % this.slideCount);
  }

  positionSlides() {
    const firstSlide = this.slides[0];
    const curSlide = this.slides[this.currentIndex];

    const offset = 
      firstSlide.getBoundingClientRect().x
      - curSlide.getBoundingClientRect().x
      + ((this.viewer.clientWidth - curSlide.clientWidth) / 2);

    firstSlide.style.marginLeft = `${offset}px`;
  }

  goToSlide(index) {
    // Update current index
    this.currentIndex = index;
    
    if (this.isContinuousFlow) {
        this.positionSlides();
    }

    // Update active class for current slide and thumbnail
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    this.thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
    
    // Scroll thumbnail into view
    this.thumbnails[this.currentIndex].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
}

// Initialize all galleries on the page
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.jwj-gallery');
  galleries.forEach(gallery => new JWJGallery(gallery));
});
