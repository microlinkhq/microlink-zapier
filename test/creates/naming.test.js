const { assert, App } = require('../helpers');

// Zapier publishing requirement 5.8 (Integration follows naming conventions):
// action labels must be descriptive, using a "Verb + Noun" format in Title Case.
// https://docs.zapier.com/integrations/publish/integration-publishing-requirements#5-8-integration-follows-naming-conventions
const ACTION_VERBS = ['Extract', 'Create', 'Generate', 'Convert', 'Detect', 'Get'];

const EXPECTED_LABELS = {
  extract: 'Extract Data',
  screenshot: 'Create Screenshot',
  pdf: 'Generate PDF',
  markdown: 'Convert Page to Markdown',
  text: 'Extract Text',
  audio: 'Detect Audio',
  video: 'Detect Video',
  insights: 'Get Insights',
  logo: 'Get Logo'
};

describe('creates.naming', () => {
  const creates = App.creates;

  it('exposes every documented create action', () => {
    assert.deepEqual(Object.keys(creates).sort(), Object.keys(EXPECTED_LABELS).sort());
  });

  Object.keys(creates).forEach((key) => {
    describe(`action "${key}"`, () => {
      const action = creates[key];
      const label = action.display.label;

      it('uses the expected descriptive label', () => {
        assert.equal(label, EXPECTED_LABELS[key]);
      });

      it('starts with an action verb', () => {
        const firstWord = label.split(' ')[0];
        assert.ok(
          ACTION_VERBS.includes(firstWord),
          `Label "${label}" should start with one of: ${ACTION_VERBS.join(', ')}`
        );
      });

      it('is a multi-word Verb + Noun label', () => {
        assert.ok(
          label.trim().split(/\s+/).length >= 2,
          `Label "${label}" should describe the action with at least a verb and a noun`
        );
      });

      it('defines a specific noun (not the generic default)', () => {
        assert.ok(typeof action.noun === 'string' && action.noun.trim().length > 0);
        assert.notEqual(action.noun, 'Microlink Result');
      });

      it('has a descriptive sentence for a description', () => {
        const description = action.display.description;
        assert.ok(typeof description === 'string' && description.trim().length > 0);
        assert.ok(
          description.trim().endsWith('.'),
          `Description "${description}" should be a full sentence ending with a period`
        );
      });
    });
  });
});
