const { assert, runAction, nock } = require('../helpers');

describe('creates.markdown', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests markdown embed output', async () => {
    const result = await runAction({
      actionKey: 'markdown',
      expectedQuery: {
        force: true,
        meta: false,
        embed: 'markdown',
        'data.markdown.attr': 'markdown'
      },
      responseBody: '# Example Domain'
    });

    assert.equal(result.status, 'success');
    assert.equal(result.data, '# Example Domain');
  });
});
