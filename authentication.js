const DEFAULT_PUBLIC_BASE_URL = 'https://api.microlink.io';
const DEFAULT_PRO_BASE_URL = 'https://pro.microlink.io';

const resolveBaseUrl = (bundle) => {
  const baseUrl = (bundle.authData.baseUrl || '').trim();
  const apiKey = (bundle.authData.apiKey || '').trim();

  if (baseUrl) {
    return baseUrl;
  }

  return apiKey ? DEFAULT_PRO_BASE_URL : DEFAULT_PUBLIC_BASE_URL;
};

const includeApiKeyHeader = (request, _z, bundle) => {
  const apiKey = (bundle.authData.apiKey || '').trim();
  if (!apiKey) {
    return request;
  }

  request.headers = request.headers || {};
  request.headers['x-api-key'] = apiKey;
  return request;
};

const test = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: resolveBaseUrl(bundle),
    params: {
      url: 'https://example.com'
    }
  });

  const data = response.data || response.json || {};
  if (!data || data.status !== 'success') {
    throw new z.errors.Error(
      'Unable to authenticate with Microlink. Check your API key.',
      'AuthenticationError',
      response.status || 401
    );
  }

  return data;
};

module.exports = {
  type: 'custom',
  test,
  connectionLabel: '{{bundle.authData.baseUrl || "Microlink"}}',
  fields: [
    {
      key: 'apiKey',
      type: 'password',
      label: 'API Key',
      required: false,
      helpText: 'Your Microlink API key. Leave empty to use the public API tier.'
    },
    {
      key: 'baseUrl',
      type: 'string',
      label: 'Base URL',
      required: false,
      helpText:
        'Optional override. Defaults to https://pro.microlink.io when API key is set, otherwise https://api.microlink.io.'
    }
  ],
  befores: [includeApiKeyHeader]
};
