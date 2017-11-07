// Copyright (c) Microsoft. All rights reserved.
import assert from 'assert';
import React from 'react';

class SchemaRenderer extends React.Component {
  constructor(props) {
    super(props);
    let {rootSchema, targetPath} = props;
    if (targetPath) {
      this.setSchema(this.getByPath(targetPath, rootSchema));
    } else if (rootSchema) {
      this.setSchema(rootSchema);
    }
  }

  setSchema(schema) {
    this.schema = schema;
  }

  getValue(key, schema) {
    schema = schema || this.schema;
    assert(schema.type, 'object');
    if (schema.properties && schema.properties[key]) {
      return schema.properties[key];
    }
    if (schema.patternProperties) {
      for (let regex of Object.keys(schema.patternProperties)) {
        if (key.match(regex)) {
          return schema.patternProperties[regex];
        }
      }
    }
    throw new Error('Key ' + key + ' not matched in ' + schema);
  }

  getByPath(path, schema) {
    const keys = path.split('.');
    schema = schema || this.schema;

    for (let key of keys) {
      schema = this.getValue(key, schema);
    }
    return schema;
  }

  render() {
    return (
      <div className="schema-renderer">
        {this.props.children}
      </div>
    );
    // <pre>{JSON.stringify(this.props.propertyNames)}</pre>
  }
}

export default SchemaRenderer;
