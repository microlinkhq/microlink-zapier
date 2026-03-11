const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'logo',
  label: 'Logo',
  description: 'Return logo metadata, including logo.palette',
  sample: {
    status: 'success',
    data: {
      logo: {
      url: "https://www.apple.com/favicon.ico",
      type: "ico",
      size: 22382,
      height: 16,
      width: 16,
      size_pretty: "22.4 kB",
      palette: [
        "#D2D2D7",
        "#F8F8F9",
        "#606062",
        "#B7B7B8",
        "#EDEDEF",
        "#1D1D1F"
      ],
      background_color: "#F8F8F9",
      color: "#1D1D1F",
      alternative_color: "#606062"
    }
    }
  }
});
