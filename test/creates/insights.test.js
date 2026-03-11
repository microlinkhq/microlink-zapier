const { assert, runAction, nock } = require('../helpers');

describe('creates.insights', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests performance insights', async () => {
    const result = await runAction({
      actionKey: 'insights',
      expectedQuery: {
        insights: true
      },
      responseBody: {
        status: 'success',
        data: {
          insights: {
            lighthouse: {
              performance: 0.99
            }
          }
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.equal(result.data.insights.lighthouse.performance, 0.99);
  });
});
