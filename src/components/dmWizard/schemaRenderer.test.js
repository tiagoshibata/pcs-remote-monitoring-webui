// Copyright (c) Microsoft. All rights reserved.
import SchemaRenderer from './schemaRenderer';

const rootSchema = {
  type: 'object',
  properties: {
    '?': {
      type: 'object',
      additionalProperties: false,
      properties: {
        'store': { type: 'boolean' },
        'nonStore': { type: 'boolean' }
      }
    }
  },
  patternProperties: {
    '.+': {
      type: 'object',
      additionalProperties: false,
      properties: {
        'pkgFamilyName': { type: 'string' },
        'version': {
          type: 'string',
          oneOf: [
            { enum: ['?', 'not installed'] },
            { pattern: '^[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+$' }
          ]
        },
        'startUp': {
          type: 'string',
          enum: ['none', 'foreground', 'background']
        },
        'appxSource': { type: 'string' },
      }
    }
  }
}

it('should get values', () => {
  let renderer = new SchemaRenderer({rootSchema});
  expect(renderer.getValue('?')).toEqual(rootSchema.properties['?']);
});

it('should get nested properties by path', () => {
  let renderer = new SchemaRenderer({rootSchema});
  expect(renderer.getByPath('someApplication.version')).toEqual(rootSchema.patternProperties['.+'].properties.version);
});
