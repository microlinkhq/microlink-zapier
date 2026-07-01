const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'markdown',
  label: 'Convert Page to Markdown',
  noun: 'Markdown',
  description: 'Convert the readable content of a web page into Markdown.',
  sample: {
    status: 'success',
    data: '# Example Domain\n\nThis domain is for use in documentation examples.'
  }
});
