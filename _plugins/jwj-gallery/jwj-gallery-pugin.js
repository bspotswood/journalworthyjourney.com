let idCounter = 0;

/**
 * Journal Worthy Journey Gallery Plugin for Eleventy
 *
 * This plugin adds a "gallery" paired shortcode to Eleventy, allowing users to create
 * customizable image galleries with navigation and thumbnail previews.
 *
 * @module jwj-gallery
 * @function
 * @param {import('@11ty/eleventy/src/EleventyConfig')} eleventyConfig - The Eleventy configuration object.
 *
 * @example
 * // In your Eleventy config file (.eleventy.js):
 * const jwjGallery = require('./_plugins/jwj-gallery/jwj-gallery.js');
 * module.exports = function(eleventyConfig) {
 *   jwjGallery(eleventyConfig);
 * };
 *
 * // Usage in a template:
 * {% gallery { id: "my-gallery", width: 1000, continuousFlow: true } %}
 *   <img src="img1.jpg" alt="Image 1">
 *   <img src="img2.jpg" alt="Image 2">
 * {% endgallery %}
 */
export default async function(eleventyConfig) {

  // Add the Render plugin if needed
  if (!eleventyConfig.javascript.functions.renderFile) {
    const { RenderPlugin } = await import("@11ty/eleventy");
    eleventyConfig.addPlugin(RenderPlugin);
  }

  // Add the gallery shortcode
  eleventyConfig.addPairedShortcode("gallery", galleryShortcode);

  // Copy styles and scripts
  eleventyConfig.addPassthroughCopy({
    "./_plugins/jwj-gallery/public/*": "jwj-gallery/"
  });

  // Add a bundle for the needed style and script elements for the html head
  eleventyConfig.addBundle("html");

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
  async function galleryShortcode(content, options) {
    const html = eleventyConfig.javascript.functions.html.bind(this);
    html(`
      <link rel="stylesheet" href="/jwj-gallery/jwj-gallery.css">
      <script src="/jwj-gallery/jwj-gallery.js" type="module"></script>
    `.trimEnd(), "head");

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

      // Ensure defaults in options
      options = {
        id: options?.id || `jwj-image-gallery-${++idCounter}`,
        width: options?.width || 850,
        continuousFlow: options?.continuousFlow || false,
        images
      };

      // Build the gallery HTML
      return eleventyConfig.javascript.functions.renderFile(
        '_plugins/jwj-gallery/jwj-gallery.njk', 
        options, 
        'njk'
      );
    }
  }