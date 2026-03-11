const { assert, runAction, nock } = require('../helpers');

describe('creates.screenshot', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests screenshot output', async () => {
    const result = await runAction({
      actionKey: 'screenshot',
      expectedQuery: {
        screenshot: true
      },
      responseBody: {
        status: 'success',
        data: {
          screenshot: {
            url: 'https://cdn.microlink.io/screenshot/example.com.png'
          }
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.ok(result.data.screenshot.url);
  });
});
