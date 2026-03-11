const OBJECT_PARAMS = new Set(['data', 'meta', 'headers', 'viewport', 'insights']);
const BOOLEAN_OR_OBJECT_PARAMS = new Set(['screenshot', 'pdf']);
const NESTED_PARAMS_WIN = ['screenshot', 'pdf', 'insights'];

const DEFAULT_PUBLIC_BASE_URL = 'https://api.microlink.io';
const DEFAULT_PRO_BASE_URL = 'https://pro.microlink.io';

const simpleOptionMappings = [
  ['adblock', 'adblock'],
  ['animations', 'animations'],
  ['audio', 'audio'],
  ['video', 'video'],
  ['insights', 'insights'],
  ['palette', 'logo'],
  ['pdf', 'pdf'],
  ['screenshot', 'screenshot'],
  ['meta', 'meta'],
  ['force', 'force'],
  ['filter', 'filter'],
  ['device', 'device'],
  ['colorScheme', 'colorScheme'],
  ['click', 'click'],
  ['scroll', 'scroll'],
  ['waitForSelector', 'waitForSelector'],
  ['waitForTimeout', 'waitForTimeout'],
  ['waitUntil', 'waitUntil'],
  ['javascript', 'javascript'],
  ['prerender', 'prerender'],
  ['proxy', 'proxy'],
  ['retry', 'retry'],
  ['timeout', 'timeout'],
  ['ttl', 'ttl'],
  ['staleTtl', 'staleTtl'],
  ['ping', 'ping'],
  ['filename', 'filename'],
  ['mediaType', 'mediaType'],
  ['embed', 'embed'],
  ['scripts', 'scripts'],
  ['styles', 'styles'],
  ['modules', 'modules'],
  ['function', 'function'],
  ['pdf.format', 'pdfFormat'],
  ['pdf.width', 'pdfWidth'],
  ['pdf.height', 'pdfHeight'],
  ['viewport.width', 'viewportWidth'],
  ['viewport.height', 'viewportHeight'],
  ['viewport.deviceScaleFactor', 'viewportDeviceScaleFactor'],
  ['viewport.isMobile', 'viewportIsMobile'],
  ['viewport.hasTouch', 'viewportHasTouch'],
  ['viewport.isLandscape', 'viewportIsLandscape'],
  ['pdf.landscape', 'pdfLandscape'],
  ['pdf.margin', 'pdfMargin'],
  ['pdf.pageRanges', 'pdfPageRanges'],
  ['pdf.scale', 'pdfScale'],
  ['screenshot.type', 'screenshotType'],
  ['screenshot.fullPage', 'screenshotFullPage'],
  ['screenshot.element', 'screenshotElement'],
  ['screenshot.omitBackground', 'screenshotOmitBackground'],
  ['screenshot.overlay.background', 'screenshotOverlayBackground'],
  ['screenshot.overlay.browser', 'screenshotOverlayBrowser'],
  ['screenshot.codeScheme', 'screenshotCodeScheme']
];

const jsonOptionMappings = [
  ['data', 'dataJson', 'Data (JSON)'],
  ['meta', 'metaJson', 'Meta (JSON)'],
  ['headers', 'headersJson', 'Headers (JSON)'],
  ['viewport', 'viewportJson', 'Viewport (JSON)'],
  ['insights', 'insightsJson', 'Insights (JSON)']
];

const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

const flattenObject = (prefix, obj, target) => {
  Object.entries(obj).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      flattenObject(path, value, target);
      return;
    }

    if (Array.isArray(value)) {
      target[path] = JSON.stringify(value);
      return;
    }

    target[path] = value;
  });
};

const parseLooseValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if (!Number.isNaN(Number(trimmed)) && /^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (_error) {
      return value;
    }
  }

  return value;
};

const parseJsonObjectField = (z, value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (isPlainObject(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    throw new z.errors.Error(
      `${fieldName} must be a JSON object.`,
      'InvalidInput',
      400
    );
  }

  const parsed = parseLooseValue(value);
  if (!isPlainObject(parsed)) {
    throw new z.errors.Error(
      `${fieldName} must be a JSON object.`,
      'InvalidInput',
      400
    );
  }

  return parsed;
};

const normalizeAdditionalParams = (rawValue) => {
  if (!rawValue) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  if (typeof rawValue === 'string') {
    const parsed = parseLooseValue(rawValue);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (isPlainObject(parsed)) {
      return Object.entries(parsed).map(([key, value]) => ({ key, value }));
    }
    return [];
  }

  if (isPlainObject(rawValue) && Array.isArray(rawValue.param)) {
    return rawValue.param;
  }

  if (isPlainObject(rawValue) && (Array.isArray(rawValue.key) || Array.isArray(rawValue.value))) {
    const keys = Array.isArray(rawValue.key) ? rawValue.key : [];
    const values = Array.isArray(rawValue.value) ? rawValue.value : [];
    return keys.map((key, index) => ({ key, value: values[index] }));
  }

  if (isPlainObject(rawValue) && (rawValue.key || rawValue.value)) {
    return [rawValue];
  }

  return [];
};

const buildOperationDefaults = (operation) => {
  const paramBag = {};

  if (operation === 'screenshot') {
    paramBag.screenshot = true;
  }
  if (operation === 'pdf') {
    paramBag.pdf = true;
  }
  if (operation === 'audio') {
    paramBag.audio = true;
  }
  if (operation === 'video') {
    paramBag.video = true;
  }
  if (operation === 'insights') {
    paramBag.insights = true;
  }
  if (operation === 'logo') {
    paramBag.palette = true;
  }
  if (operation === 'markdown') {
    paramBag.force = true;
    paramBag.meta = false;
    paramBag.embed = 'markdown';
    paramBag.data = { markdown: { attr: 'markdown' } };
  }
  if (operation === 'text') {
    paramBag.force = true;
    paramBag.meta = false;
    paramBag.embed = 'text';
    paramBag.data = { text: { attr: 'text' } };
  }

  return paramBag;
};

const buildParamBag = (z, inputData, operation) => {
  const paramBag = buildOperationDefaults(operation);

  const legacyScreenshotOverlay = parseLooseValue(inputData.screenshotOverlay);
  const legacyOverlayObject = isPlainObject(legacyScreenshotOverlay)
    ? legacyScreenshotOverlay
    : undefined;

  const screenshotOverlayBackground =
    inputData.screenshotOverlayBackground ?? legacyOverlayObject?.background;
  const screenshotOverlayBrowser =
    inputData.screenshotOverlayBrowser ??
    legacyOverlayObject?.browser ??
    legacyOverlayObject?.broswer;

  const valueOverrides = {
    screenshotOverlayBackground,
    screenshotOverlayBrowser
  };

  simpleOptionMappings.forEach(([queryKey, inputKey]) => {
    const value =
      Object.prototype.hasOwnProperty.call(valueOverrides, inputKey)
        ? valueOverrides[inputKey]
        : inputData[inputKey];

    if (value !== undefined && value !== '' && value !== 0) {
      paramBag[queryKey] = value;
    }
  });

  jsonOptionMappings.forEach(([queryKey, inputKey, fieldName]) => {
    const parsedObject = parseJsonObjectField(z, inputData[inputKey], fieldName);
    if (parsedObject && Object.keys(parsedObject).length) {
      const previousValue = isPlainObject(paramBag[queryKey]) ? paramBag[queryKey] : {};
      paramBag[queryKey] = { ...previousValue, ...parsedObject };
    }
  });

  return paramBag;
};

const buildQueryParams = (z, bundle, operation) => {
  const { inputData = {} } = bundle;
  const inputUrl = (inputData.url || '').trim();

  if (!inputUrl) {
    throw new z.errors.Error('URL is required.', 'MissingInput', 400);
  }

  const paramBag = buildParamBag(z, inputData, operation);
  const queryParams = { url: inputUrl };

  Object.entries(paramBag).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) {
      return;
    }

    if (isPlainObject(value) && (OBJECT_PARAMS.has(key) || BOOLEAN_OR_OBJECT_PARAMS.has(key))) {
      if (BOOLEAN_OR_OBJECT_PARAMS.has(key)) {
        delete queryParams[key];
      }
      flattenObject(key, value, queryParams);
      return;
    }

    queryParams[key] = value;
  });

  const additionalParams = normalizeAdditionalParams(inputData.additionalParams);
  additionalParams.forEach((entry) => {
    const key = entry?.key;
    if (!key) {
      return;
    }

    const value = parseLooseValue(entry.value);
    if (isPlainObject(value)) {
      if (BOOLEAN_OR_OBJECT_PARAMS.has(key)) {
        delete queryParams[key];
      }
      flattenObject(key, value, queryParams);
      return;
    }

    queryParams[key] = value;
  });

  NESTED_PARAMS_WIN.forEach((key) => {
    const hasNestedKey = Object.keys(queryParams).some((queryKey) =>
      queryKey.startsWith(`${key}.`)
    );
    if (hasNestedKey) {
      delete queryParams[key];
    }
  });

  return queryParams;
};

const resolveBaseUrl = (authData = {}) => {
  const baseUrl = (authData.baseUrl || '').trim();
  const apiKey = (authData.apiKey || '').trim();

  if (baseUrl) {
    return baseUrl;
  }

  return apiKey ? DEFAULT_PRO_BASE_URL : DEFAULT_PUBLIC_BASE_URL;
};

const getStatusCode = (response) => response?.status || response?.statusCode || 0;

const getHeader = (response, headerName) => {
  if (!response?.headers) {
    return undefined;
  }

  if (typeof response.headers.get === 'function') {
    return response.headers.get(headerName);
  }

  const normalizedHeaderName = headerName.toLowerCase();
  const exactMatch = Object.keys(response.headers).find(
    (key) => key.toLowerCase() === normalizedHeaderName
  );

  if (!exactMatch) {
    return undefined;
  }

  return response.headers[exactMatch];
};

const extractResponseBodySync = (response) => {
  if (!response) {
    return undefined;
  }

  if (typeof response.data !== 'undefined' && typeof response.data !== 'function') {
    return response.data;
  }

  if (typeof response.json !== 'undefined' && typeof response.json !== 'function') {
    return response.json;
  }

  if (typeof response.body === 'string' || Buffer.isBuffer(response.body)) {
    return response.body;
  }

  if (isPlainObject(response.body) || Array.isArray(response.body)) {
    return response.body;
  }

  return undefined;
};

const extractRawResponseBody = async (response, { binary = false } = {}) => {
  if (!response) {
    return undefined;
  }

  if (binary && typeof response.buffer === 'function') {
    return response.buffer();
  }

  if (binary && typeof response.arrayBuffer === 'function') {
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  if (typeof response.text === 'function') {
    return response.text();
  }

  const syncBody = extractResponseBodySync(response);
  if (typeof syncBody !== 'undefined') {
    return syncBody;
  }

  return undefined;
};

const tryParseJson = (value) => {
  if (isPlainObject(value) || Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed);
  } catch (_error) {
    return undefined;
  }
};

const extractErrorMessage = (body) => {
  if (!body) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  if (Array.isArray(body)) {
    return body.map((entry) => extractErrorMessage(entry)).filter(Boolean).join(', ');
  }

  if (!isPlainObject(body)) {
    return undefined;
  }

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }

  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error;
  }

  if (isPlainObject(body.error) && typeof body.error.message === 'string') {
    return body.error.message;
  }

  if (typeof body.data === 'string' && body.data.trim()) {
    return body.data;
  }

  if (isPlainObject(body.data) && typeof body.data.message === 'string') {
    return body.data.message;
  }

  return undefined;
};

const normalizeRequestError = (z, error) => {
  const response = error.response || error;
  const statusCode = getStatusCode(response) || error.status || 500;
  const responseBody = extractResponseBodySync(response);
  const parsedBody = tryParseJson(responseBody) || responseBody;
  const message =
    extractErrorMessage(parsedBody) || error.message || 'Microlink request failed.';

  return new z.errors.Error(message, 'MicrolinkError', statusCode);
};

const validateMicrolinkPayload = (z, payload, statusCode = 500) => {
  if (!isPlainObject(payload)) {
    throw new z.errors.Error(
      'Unexpected Microlink response format.',
      'InvalidResponse',
      statusCode || 500
    );
  }

  if (payload.status !== 'success') {
    const message =
      extractErrorMessage(payload) ||
      `Microlink request failed with status "${payload.status || 'unknown'}".`;
    throw new z.errors.Error(message, 'MicrolinkError', statusCode || 400);
  }

  return payload;
};

const toBuffer = (value) => {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return Buffer.from(value, 'utf8');
  }

  if (value === undefined || value === null) {
    return Buffer.from('');
  }

  return Buffer.from(JSON.stringify(value), 'utf8');
};

const performMicrolinkRequest = async (z, bundle, operation) => {
  const responseMode = bundle.inputData.responseMode || 'auto';
  const shouldReturnBinary = responseMode === 'binary';

  const queryParams = buildQueryParams(z, bundle, operation);
  const shouldReturnText = responseMode === 'text';
  const shouldAutoText =
    responseMode === 'auto' && typeof queryParams.embed === 'string' && queryParams.embed !== '';
  const shouldUseRaw = shouldReturnBinary || shouldReturnText || shouldAutoText;

  const authData = bundle.authData || {};
  const apiKey = (authData.apiKey || '').trim();
  const headers = apiKey ? { 'x-api-key': apiKey } : {};
  const baseUrl = resolveBaseUrl(authData);

  let response;
  try {
    response = await z.request({
      method: 'GET',
      url: baseUrl,
      params: queryParams,
      headers,
      raw: shouldUseRaw
    });
  } catch (error) {
    throw normalizeRequestError(z, error);
  }

  const statusCode = getStatusCode(response);
  const responseBody = shouldUseRaw
    ? await extractRawResponseBody(response, { binary: shouldReturnBinary })
    : extractResponseBodySync(response);
  const parsedBody = tryParseJson(responseBody);
  const bodyForErrors = parsedBody || responseBody;

  if (statusCode >= 400) {
    const message =
      extractErrorMessage(bodyForErrors) ||
      `Microlink request failed with HTTP status ${statusCode}.`;
    throw new z.errors.Error(message, 'MicrolinkError', statusCode);
  }

  if (shouldReturnBinary) {
    if (parsedBody && isPlainObject(parsedBody) && parsedBody.status) {
      return validateMicrolinkPayload(z, parsedBody, statusCode || 200);
    }

    const binaryProperty = bundle.inputData.binaryProperty || 'data';
    const buffer = toBuffer(responseBody);
    const contentType = getHeader(response, 'content-type');

    const output = {
      status: 'success',
      [binaryProperty]: buffer.toString('base64'),
      encoding: 'base64'
    };

    if (contentType) {
      output.contentType = contentType;
    }

    return output;
  }

  if (shouldReturnText || shouldAutoText) {
    if (parsedBody && isPlainObject(parsedBody) && parsedBody.status) {
      return validateMicrolinkPayload(z, parsedBody, statusCode || 200);
    }

    if (Buffer.isBuffer(responseBody)) {
      return { status: 'success', data: responseBody.toString('utf8') };
    }

    return { status: 'success', data: String(responseBody ?? '') };
  }

  const jsonPayload = isPlainObject(responseBody) ? responseBody : parsedBody;
  return validateMicrolinkPayload(z, jsonPayload, statusCode || 200);
};

module.exports = {
  BOOLEAN_OR_OBJECT_PARAMS,
  OBJECT_PARAMS,
  buildQueryParams,
  flattenObject,
  isPlainObject,
  parseLooseValue,
  performMicrolinkRequest
};
