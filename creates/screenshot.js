const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'screenshot',
  label: 'Create Screenshot',
  noun: 'Screenshot',
  description: 'Capture a screenshot image of a web page from its URL.',
  sample: {
    status: 'success',
    data: {
      screenshot: {
        url: 'https://iad.microlink.io/UllLS558A9r-h_g1Zj2d8xACWHbsQEDY5XN2wyMoUoURCfP2cZ-me7GU-8GFwUFDPhMYcS0I5cBX_sckQw_fFA.png',
        type: 'image/png'
      }
    }
  }
});
