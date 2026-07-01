const { assert, App } = require('./helpers');

// Zapier publishing requirement 5.6 (Integration has a valid connection label):
// the label must not fall back to the integration name and must never expose
// sensitive values (API keys). Microlink auth has no account identifier, so the
// label is left blank and Zapier auto-numbers the connections.
// https://docs.zapier.com/integrations/publish/integration-publishing-requirements#5-6-integration-has-a-valid-connection-label
describe('authentication', () => {
  const { connectionLabel } = App.authentication;

  it('does not hardcode the integration name as a connection label', () => {
    const isBlank = connectionLabel === undefined || connectionLabel === '';
    assert.ok(
      isBlank || !/microlink/i.test(String(connectionLabel)),
      'Connection label must be blank (auto-numbered) or reference account data, not the integration name'
    );
  });

  it('never exposes the API key in the connection label', () => {
    assert.ok(!/apiKey/i.test(String(connectionLabel || '')));
  });
});
