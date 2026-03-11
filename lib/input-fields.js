const commonInputFields = [
  {
    key: 'url',
    label: 'URL',
    type: 'string',
    required: true,
    placeholder: 'https://example.com',
    helpText: 'The URL to analyze'
  },
  {
    key: 'responseMode',
    label: 'Response Mode',
    type: 'string',
    required: false,
    default: 'auto',
    choices: {
      auto: 'Auto',
      json: 'JSON',
      text: 'Text',
      binary: 'Binary'
    },
    helpText: 'Auto: JSON unless the request is embedded content.'
  },
  {
    key: 'binaryProperty',
    label: 'Binary Property',
    type: 'string',
    required: false,
    default: 'data',
    helpText: 'Binary output property name (used when Response Mode is Binary).'
  },
  {
    key: 'adblock',
    label: 'Ad Block',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'animations',
    label: 'Animations',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'audio',
    label: 'Audio',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'video',
    label: 'Video',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'insights',
    label: 'Insights',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'logo',
    label: 'Logo',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'pdf',
    label: 'PDF',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'screenshot',
    label: 'Screenshot',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'meta',
    label: 'Meta',
    type: 'boolean',
    required: false,
    default: true,
    helpText: 'Include metadata in the response'
  },
  {
    key: 'force',
    label: 'Force',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'filter',
    label: 'Filter',
    type: 'string',
    required: false
  },
  {
    key: 'device',
    label: 'Device',
    type: 'string',
    required: false
  },
  {
    key: 'colorScheme',
    label: 'Color Scheme',
    type: 'string',
    required: false
  },
  {
    key: 'click',
    label: 'Click',
    type: 'string',
    required: false,
    helpText: 'CSS selector to click before capture'
  },
  {
    key: 'scroll',
    label: 'Scroll',
    type: 'string',
    required: false,
    helpText: 'Scroll instructions, e.g. "1000" or "#selector"'
  },
  {
    key: 'waitForSelector',
    label: 'Wait For Selector',
    type: 'string',
    required: false
  },
  {
    key: 'waitForTimeout',
    label: 'Wait For Timeout',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'waitUntil',
    label: 'Wait Until',
    type: 'string',
    required: false,
    helpText: 'load|domcontentloaded|networkidle0|networkidle2'
  },
  {
    key: 'javascript',
    label: 'JavaScript',
    type: 'boolean',
    required: false,
    default: true
  },
  {
    key: 'prerender',
    label: 'Prerender',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'proxy',
    label: 'Proxy',
    type: 'string',
    required: false,
    helpText: 'Proxy mode or URL'
  },
  {
    key: 'retry',
    label: 'Retry',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'timeout',
    label: 'Timeout (ms)',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'ttl',
    label: 'TTL (seconds)',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'staleTtl',
    label: 'Stale TTL (seconds)',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'ping',
    label: 'Ping',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'filename',
    label: 'Filename',
    type: 'string',
    required: false
  },
  {
    key: 'mediaType',
    label: 'Media Type',
    type: 'string',
    required: false,
    helpText: 'screen or print'
  },
  {
    key: 'embed',
    label: 'Embed',
    type: 'string',
    required: false,
    helpText: 'Return a specific field directly instead of JSON'
  },
  {
    key: 'scripts',
    label: 'Scripts',
    type: 'string',
    required: false
  },
  {
    key: 'styles',
    label: 'Styles',
    type: 'string',
    required: false
  },
  {
    key: 'modules',
    label: 'Modules',
    type: 'string',
    required: false
  },
  {
    key: 'function',
    label: 'Function',
    type: 'string',
    required: false
  },
  {
    key: 'headersJson',
    label: 'Headers (JSON)',
    type: 'text',
    required: false,
    default: '{}'
  },
  {
    key: 'dataJson',
    label: 'Data (JSON)',
    type: 'text',
    required: false,
    default: '{}'
  },
  {
    key: 'metaJson',
    label: 'Meta (JSON)',
    type: 'text',
    required: false,
    default: '{}'
  },
  {
    key: 'viewportJson',
    label: 'Viewport (JSON)',
    type: 'text',
    required: false,
    default: '{}'
  },
  {
    key: 'insightsJson',
    label: 'Insights (JSON)',
    type: 'text',
    required: false,
    default: '{}'
  },
  {
    key: 'pdfFormat',
    label: 'PDF Format',
    type: 'string',
    required: false
  },
  {
    key: 'pdfWidth',
    label: 'PDF Width',
    type: 'string',
    required: false
  },
  {
    key: 'pdfHeight',
    label: 'PDF Height',
    type: 'string',
    required: false
  },
  {
    key: 'viewportWidth',
    label: 'Viewport Width',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'viewportHeight',
    label: 'Viewport Height',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'viewportDeviceScaleFactor',
    label: 'Viewport Device Scale Factor',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'viewportIsMobile',
    label: 'Viewport Is Mobile',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'viewportHasTouch',
    label: 'Viewport Has Touch',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'viewportIsLandscape',
    label: 'Viewport Is Landscape',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'pdfLandscape',
    label: 'PDF Landscape',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'pdfMargin',
    label: 'PDF Margin',
    type: 'string',
    required: false
  },
  {
    key: 'pdfPageRanges',
    label: 'PDF Page Ranges',
    type: 'string',
    required: false
  },
  {
    key: 'pdfScale',
    label: 'PDF Scale',
    type: 'number',
    required: false,
    default: 0
  },
  {
    key: 'screenshotType',
    label: 'Screenshot Type',
    type: 'string',
    required: false
  },
  {
    key: 'screenshotFullPage',
    label: 'Screenshot Full Page',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'screenshotElement',
    label: 'Screenshot Element',
    type: 'string',
    required: false
  },
  {
    key: 'screenshotOmitBackground',
    label: 'Screenshot Omit Background',
    type: 'boolean',
    required: false,
    default: false
  },
  {
    key: 'screenshotOverlayBackground',
    label: 'Screenshot Overlay Background',
    type: 'string',
    required: false,
    default: 'linear-gradient(225deg, #FF057C 0%, #8D0B93 50%, #321575 100%)'
  },
  {
    key: 'screenshotOverlayBrowser',
    label: 'Screenshot Overlay Browser',
    type: 'string',
    required: false,
    default: 'dark'
  },
  {
    key: 'screenshotCodeScheme',
    label: 'Screenshot Code Scheme',
    type: 'string',
    required: false
  },
  {
    key: 'additionalParams',
    label: 'Additional Query Parameters',
    required: false,
    children: [
      {
        key: 'key',
        label: 'Key',
        type: 'string',
        required: false,
        placeholder: 'e.g. data.author.selector'
      },
      {
        key: 'value',
        label: 'Value',
        type: 'string',
        required: false,
        placeholder: 'e.g. .author'
      }
    ]
  }
];

const getCommonInputFields = () => commonInputFields.map((field) => ({ ...field }));

module.exports = {
  getCommonInputFields
};
