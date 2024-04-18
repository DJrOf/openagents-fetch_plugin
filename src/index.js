const cheerio = require('cheerio'); 
const TurndownService = require('turndown'); 

function run() {
  // Get user input using Host.inputString()
  const inputString = Host.inputString();

  // Split input into an array of URLs
  const urls = inputString.split(/\s+/);

  // Process each URL
  const results = [];
  for (const url of urls) {
    if (url.startsWith('http')) {
      try {
        // Fetch content using Http.request
        const request = {
          method: "GET",
          url: url,
        };
        const response = Http.request(request);
        if (response.status !== 200) {
          throw new Error(`Got non 200 response ${response.status}`);
        }

        // Parse HTML with Cheerio
        const $ = cheerio.load(response.body);

        // Extract content from specific tags (modify as needed)
        const texts = [];
        $('article, p').each(function () {  // Combine article and p tags
          texts.push($(this).html());  // Extract entire HTML content of the tag
        });

        // Convert extracted HTML to markdown with Turndown
        const turndown = new TurndownService();
        const markdown = texts.map(htmlContent => turndown.turndown(htmlContent)).join('\n\n');

        // Add processed URL and markdown to results
        results.push(`**${url}**\n\n${markdown}`);
      } catch (error) {
        results.push(`Error processing ${url}: ${error.message}`);
      }
    } else {
      results.push(`"${url}" is not a valid URL.`);
    }
  }

  // Output the results (one per URL)
  Host.outputString(results.join('\n\n'));
}

module.exports = { run };