const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'text',
  label: 'Text',
  description: 'Return page content as plain text',
  sample: {
    status: 'success',
    data: 'Example Domain. This domain is for use in illustrative examples.'
  }
});
