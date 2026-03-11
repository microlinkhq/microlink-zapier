const { assert, runAction, nock } = require('../helpers');

describe('creates.logo', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests logo palette metadata', async () => {
    const result = await runAction({
      actionKey: 'logo',
      expectedQuery: {
        palette: true
      },
      responseBody: {
        status: 'success',
        data: {
          logo: {
            palette: ['#111111', '#222222', '#333333']
          }
        }
      }
    });

    assert.equal(result.status, 'success');
    assert.deepEqual(result.data.logo.palette, ['#111111', '#222222', '#333333']);
  });
});
