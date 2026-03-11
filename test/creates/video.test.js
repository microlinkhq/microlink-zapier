const { assert, runAction, nock } = require('../helpers');

describe('creates.video', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests video sources', async () => {
    const result = await runAction({
      actionKey: 'video',
      expectedQuery: {
        video: true
      },
      responseBody: {
        status: 'success',
        data: {
          video: [{ url: 'https://example.com/video.mp4' }]
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.ok(Array.isArray(result.data.video));
  });
});
