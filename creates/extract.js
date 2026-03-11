const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'extract',
  label: 'Extract',
  description: 'Return metadata and extracted data for a URL',
  sample: {
    status: 'success',
    data: {
      lang: "en",
      title: "Apple",
      description: "Discover the innovative world of Apple and shop everything iPhone, iPad, Apple Watch, Mac, and Apple TV, plus explore accessories, entertainment, and expert device support.",
      url: "https://www.apple.com/",
      publisher: "Apple",
      image: {
        url: "https://www.apple.com/ac/structured-data/images/open_graph_logo.png?202110180743",
        type: "png",
        size: 11847,
        height: 630,
        width: 1200,
        size_pretty: "11.8 kB"
      },
      date: "2026-03-11T05:06:08.000Z",
      author: null,
      logo: {
        url: "https://www.apple.com/favicon.ico",
        type: "ico",
        size: 22382,
        height: 16,
        width: 16,
        size_pretty: "22.4 kB"
      }
    }
  }
});
