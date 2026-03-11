const { assert, runAction, nock } = require('../helpers');

describe('creates.audio', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests audio sources', async () => {
    const result = await runAction({
      actionKey: 'audio',
      expectedQuery: {
        audio: true
      },
      responseBody: {
        status: 'success',
        data: {
          audio: [{ url: 'https://example.com/audio.mp3' }]
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.ok(Array.isArray(result.data.audio));
  });
});
