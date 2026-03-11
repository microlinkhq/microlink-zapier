const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'markdown',
  label: 'Markdown',
  description: 'Return page content in Markdown',
  sample: {
    status: 'success',
    data: '# Example Domain\n\nThis domain is for use in documentation examples.'
  }
});
