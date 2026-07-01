const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'text',
  label: 'Extract Text',
  noun: 'Text',
  description: 'Extract the readable content of a web page as plain text.',
  sample: {
    status: 'success',
    data: 'Example Domain. This domain is for use in illustrative examples.'
  }
});
