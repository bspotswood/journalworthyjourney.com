class JWJGallery {
  constructor(galleryElement) {
    this.gallery = galleryElement;
    this.slides = this.gallery.querySelectorAll('.jwj-gallery-slide');
    this.thumbnails = this.gallery.querySelectorAll('.jwj-gallery-thumbnail');
    this.prevButton = this.gallery.querySelector('.jwj-gallery-prev');
    this.nextButton = this.gallery.querySelector('.jwj-gallery-next');
    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    
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
    
    // Add click on edges of main image area
    const viewer = this.gallery.querySelector('.jwj-gallery-viewer');
    
    // Handle cursor change on hover
    viewer.addEventListener('mousemove', (e) => {
      const rect = viewer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.right - rect.left;
      
      // Change cursor based on position
      if (x < width * 0.25) {
        viewer.style.cursor = 'pointer'; // Show pointer on left edge
      } else if (x > width * 0.75) {
        viewer.style.cursor = 'pointer'; // Show pointer on right edge
      } else {
        viewer.style.cursor = 'default'; // Default cursor in the middle
      }
    });
    
    // Handle click event for navigation
    viewer.addEventListener('click', (e) => {
      const rect = viewer.getBoundingClientRect();
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
  }

  navigate(direction) {
    this.goToSlide((this.currentIndex + direction + this.slideCount) % this.slideCount);
  }

  goToSlide(index) {
    // Remove active class from current slides and thumbnails
    this.slides[this.currentIndex].classList.remove('active');
    this.thumbnails[this.currentIndex].classList.remove('active');
    
    // Update current index
    this.currentIndex = index;
    
    // Add active class to new slides and thumbnails
    this.slides[this.currentIndex].classList.add('active');
    this.thumbnails[this.currentIndex].classList.add('active');
    
    // Scroll thumbnail into view
    this.thumbnails[this.currentIndex].scrollIntoView({
      behavior: 'smooth',
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
