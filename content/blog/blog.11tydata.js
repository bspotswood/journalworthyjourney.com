export default {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	eleventyComputed: {
		"page.excerpt": function(data) {
			// If an excerpt is explicitly provided, use it
			if (data.description) {
				return data.description;
			}
			
			// Otherwise, generate an excerpt from the content
			if (data.content) {
				// Extract first paragraph or up to 200 characters
				const content = data.content.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
				const firstParagraph = content.split("\n\n")[0]; // Get first paragraph
				
				// Return the first paragraph or truncate to 200 chars
				if (firstParagraph && firstParagraph.length < 200) {
					return firstParagraph;
				} else {
					return content.substring(0, 200) + "...";
				}
			}
			
			return ""; // Fallback to empty excerpt
		}
	}
};
