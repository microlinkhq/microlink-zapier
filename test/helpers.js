const assert = require('assert');
const nock = require('nock');
const { createAppTester } = require('zapier-platform-core');

const App = require('../index');

const appTester = createAppTester(App);

const runAction = async ({
  actionKey,
  inputData = {},
  authData = {},
  expectedQuery = {},
  responseBody = { status: 'success', data: {} },
  statusCode = 200
}) => {
  const scope = nock('https://api.microlink.io')
    .get('/')
    .query((query) => {
      if (String(query.url) !== String(inputData.url || 'https://example.com')) {
        return false;
      }

      return Object.entries(expectedQuery).every(
        ([key, value]) => String(query[key]) === String(value)
      );
    })
    .reply(statusCode, responseBody);

  const output = await appTester(App.creates[actionKey].operation.perform, {
    authData,
    inputData: {
      url: 'https://example.com',
      ...inputData
    }
  });

  scope.done();
  return output;
};

module.exports = {
  App,
  appTester,
  assert,
  nock,
  runAction
};
