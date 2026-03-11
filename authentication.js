const DEFAULT_PUBLIC_BASE_URL = 'https://api.microlink.io';
const DEFAULT_PRO_BASE_URL = 'https://pro.microlink.io';
const API_ENVIRONMENT_CHOICES = {
  auto: 'Automatic (recommended)',
  public: 'Public API (api.microlink.io)',
  pro: 'Pro API (pro.microlink.io)'
};
const API_KEY_DOCS_URL = 'https://microlink.io/docs/api/basics/authentication';
const ENDPOINTS_DOCS_URL = 'https://microlink.io/docs/api/getting-started/api';

const normalizeLegacyBaseUrl = (rawBaseUrl) => {
  const baseUrl = (rawBaseUrl || '').trim();

  if (!baseUrl) {
    return '';
  }

  if (baseUrl !== DEFAULT_PUBLIC_BASE_URL && baseUrl !== DEFAULT_PRO_BASE_URL) {
    throw new Error(
      `Base URL must be one of: ${DEFAULT_PUBLIC_BASE_URL}, ${DEFAULT_PRO_BASE_URL}.`
    );
  }

  return baseUrl;
};

const normalizeApiEnvironment = (rawEnvironment) => {
  const apiEnvironment = (rawEnvironment || 'auto').trim().toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(API_ENVIRONMENT_CHOICES, apiEnvironment)) {
    throw new Error(
      `API Environment must be one of: ${Object.keys(API_ENVIRONMENT_CHOICES).join(', ')}.`
    );
  }

  return apiEnvironment;
};

const resolveBaseUrl = (bundle) => {
  const baseUrl = normalizeLegacyBaseUrl(bundle.authData.baseUrl);
  const apiEnvironment = normalizeApiEnvironment(bundle.authData.apiEnvironment);
  const apiKey = (bundle.authData.apiKey || '').trim();

  if (baseUrl) {
    return baseUrl;
  }

  if (apiEnvironment === 'public') {
    return DEFAULT_PUBLIC_BASE_URL;
  }

  if (apiEnvironment === 'pro') {
    return DEFAULT_PRO_BASE_URL;
  }

  return apiKey ? DEFAULT_PRO_BASE_URL : DEFAULT_PUBLIC_BASE_URL;
};

const test = async (z, bundle) => {
  const apiKey = (bundle.authData.apiKey || '').trim();
  let baseUrl;

  try {
    baseUrl = resolveBaseUrl(bundle);
  } catch (error) {
    throw new z.errors.Error(error.message, 'InvalidAuthData', 400);
  }

  const response = await z.request({
    method: 'GET',
    url: baseUrl,
    headers: apiKey ? { 'x-api-key': apiKey } : {},
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
  connectionLabel: '{{bundle.authData.apiEnvironment || "Microlink"}}',
  fields: [
    {
      key: 'apiKey',
      type: 'password',
      label: 'API Key',
      required: false,
      helpText: `Get your key from the [Microlink authentication docs](${API_KEY_DOCS_URL}). Leave empty to use the public API tier.`
    },
    {
      key: 'apiEnvironment',
      type: 'string',
      label: 'API Environment',
      required: false,
      default: 'auto',
      choices: API_ENVIRONMENT_CHOICES,
      helpText: `Choose the Microlink endpoint to use. See [Microlink API endpoints](${ENDPOINTS_DOCS_URL}).`
    }
  ]
};
