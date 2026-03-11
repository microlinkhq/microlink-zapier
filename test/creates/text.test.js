const { assert, runAction, nock } = require('../helpers');

describe('creates.text', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests text embed output', async () => {
    const result = await runAction({
      actionKey: 'text',
      expectedQuery: {
        force: true,
        meta: false,
        embed: 'text',
        'data.text.attr': 'text'
      },
      responseBody: 'Example Domain'
    });

    assert.equal(result.status, 'success');
    assert.equal(result.data, 'Example Domain');
  });
});
