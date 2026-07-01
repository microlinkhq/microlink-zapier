const { getCommonInputFields } = require('../lib/input-fields');
const { performMicrolinkRequest } = require('../lib/microlink');

const createMicrolinkAction = ({ key, label, noun, description, sample }) => ({
  key,
  noun: noun || 'Microlink Result',
  display: {
    label,
    description
  },
  operation: {
    inputFields: getCommonInputFields(),
    perform: (z, bundle) => performMicrolinkRequest(z, bundle, key),
    sample
  }
});

module.exports = createMicrolinkAction;
