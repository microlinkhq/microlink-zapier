const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'video',
  label: 'Video',
  description: 'Detect playable video sources',
  sample: {
    status: 'success',
    data: {
      video: [
        {
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          type: "mp4",
          size: 788493,
          duration: 10,
          height: 176,
          width: 320,
          duration_pretty: "10s",
          size_pretty: "788 kB"
        }
      ]
    }
  }
});
