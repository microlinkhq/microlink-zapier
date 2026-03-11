const { assert, runAction, nock } = require('../helpers');

describe('creates.pdf', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests pdf output', async () => {
    const result = await runAction({
      actionKey: 'pdf',
      expectedQuery: {
        pdf: true
      },
      responseBody: {
        status: 'success',
        data: {
          pdf: {
            url: 'https://cdn.microlink.io/pdf/example.com.pdf'
          }
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.ok(result.data.pdf.url);
  });
});
