const authentication = require('./authentication');
const extractCreate = require('./creates/extract');
const screenshotCreate = require('./creates/screenshot');
const pdfCreate = require('./creates/pdf');
const markdownCreate = require('./creates/markdown');
const textCreate = require('./creates/text');
const audioCreate = require('./creates/audio');
const videoCreate = require('./creates/video');
const insightsCreate = require('./creates/insights');
const logoCreate = require('./creates/logo');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  flags: {
    cleanInputData: false
  },
  authentication,
  triggers: {},
  searches: {},
  creates: {
    [extractCreate.key]: extractCreate,
    [screenshotCreate.key]: screenshotCreate,
    [pdfCreate.key]: pdfCreate,
    [markdownCreate.key]: markdownCreate,
    [textCreate.key]: textCreate,
    [audioCreate.key]: audioCreate,
    [videoCreate.key]: videoCreate,
    [insightsCreate.key]: insightsCreate,
    [logoCreate.key]: logoCreate
  }
};
