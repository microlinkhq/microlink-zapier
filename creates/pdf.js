const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'pdf',
  label: 'Generate PDF',
  noun: 'PDF',
  description: 'Generate a PDF document of a web page from its URL.',
  sample: {
    status: 'success',
    data: {
      pdf: {
        url: 'https://iad.microlink.io/UllLS558A9r-h_g1Zj2d8xACWHbsQEDY5XN2wyMoUoURCfP2cZ-me7GU-8GFwUFDPhMYcS0I5cBX_sckQw_fFA.pdf',
        type: 'application/pdf'
      }
    }
  }
});
