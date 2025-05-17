let idCounter = 0;

/**
 * Registers a paired shortcode "gallery" with Eleventy to generate an interactive image gallery.
 *
 * @param {import('@11ty/eleventy/src/EleventyConfig')} eleventyConfig - The Eleventy configuration object.
 * @returns {void}
 *
 * The "gallery" shortcode processes the provided HTML content, extracts <img> tags,
 * and generates a gallery layout with navigation and thumbnails.
 *
 * @shortcodeParam {Object} options - Configuration object for the gallery
 * @shortcodeParam {string} [options.id="image-gallery"] - ID for the gallery container element
 * @shortcodeParam {number} [options.width=850] - Width in pixels for the main viewer images
 * @shortcodeParam {boolean} [options.continuousFlow=false] - Whether to show images in a continuous flow layout
 * 
 * @example
 * {% gallery { id: "my-custom-gallery", width: 1200, continuousFlow: true } %}
 *   <img src="image1.jpg" alt="First image">
 *   <img src="image2.jpg" alt="Second image">
 * {% endgallery %}
 */
export default function(eleventyConfig) {
  eleventyConfig.addPairedShortcode("gallery", function(content, options = {}) {
    // Extract options with default values
    const { id = `image-gallery${++idCounter}`, width = 850, continuousFlow = false } = options;

    // Extract image src and alt from content
    const imgRegex = /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']*)["'][^>]*?>/g;
    const images = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      images.push({
        src: match[1],
        alt: match[2] || ''
      });
    }
    
    // Build the gallery HTML
    const galleryHtml = `<div class="jwj-gallery ${continuousFlow ? 'jwj-gallery-continuous' : ''}" id="${id}" data-continuous-flow="${continuousFlow}">
      <div class="jwj-gallery-main">
        <button class="jwj-gallery-nav jwj-gallery-prev" aria-label="Previous image">&lt;</button>
        <div class="jwj-gallery-viewer">
          ${images.map((image, index) => `
            <div class="jwj-gallery-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${image.src}" alt="${image.alt}" width="${width}" loading="eager">
            </div>
          `).map(h => h.trim()).join('')}
        </div>
        <button class="jwj-gallery-nav jwj-gallery-next" aria-label="Next image">&gt;</button>
      </div>
      <div class="jwj-gallery-thumbnails">
        <div class="jwj-gallery-thumbnails-scroll">
          ${images.map((image, index) => `
            <div class="jwj-gallery-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${image.src}" alt="${image.alt}" width="150" loading="eager" >
            </div>
          `).map(h => h.trim()).join('')}
        </div>
      </div>
    </div>`;
    
    return galleryHtml;
  });
}