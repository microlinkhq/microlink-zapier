const createMicrolinkAction = require('./action-factory');

module.exports = createMicrolinkAction({
  key: 'insights',
  label: 'Insights',
  description: 'Get performance and technology insights',
  sample: {
    status: 'success',
    data: {
      insights: {
        lighthouse: {
          performance: 0.98,
          accessibility: 0.95,
          bestPractices: 1,
          seo: 1
        }
      }
    }
  }
});
