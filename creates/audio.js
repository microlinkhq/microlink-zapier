const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'audio',
  label: 'Audio',
  description: 'Detect playable audio sources',
  sample: {
    status: 'success',
    data: {
      audio: [
        {
          url: "https://www.w3schools.com/html/horse.mp3",
          type: "mp3",
          size: 28915,
          duration: 2,
          duration_pretty: "2s",
          size_pretty: "28.9 kB"
        }
      ]
    }
  }
});
