const { assert, runAction, appTester, App, nock } = require('../helpers');

describe('creates.extract', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('returns extracted metadata', async () => {
    const result = await runAction({
      actionKey: 'extract',
      responseBody: {
        status: 'success',
        data: {
          title: 'Example Domain'
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.equal(result.data.title, 'Example Domain');
  });

  it('throws a meaningful Microlink error', async () => {
    nock('https://api.microlink.io')
      .get('/')
      .query(true)
      .reply(400, {
        status: 'error',
        message: 'Invalid URL provided.'
      });

    await assert.rejects(
      appTester(App.creates.extract.operation.perform, {
        authData: {},
        inputData: {
          url: 'notaurl'
        }
      }),
      (error) => {
        assert.match(error.message, /Invalid URL provided/);
        return true;
      }
    );
  });
});
