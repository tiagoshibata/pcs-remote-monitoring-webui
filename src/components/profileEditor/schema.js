import Ajv from 'ajv';
import lang from '../../common/lang'

const schema = {
  "properties": {
    "smaller": {
      "type": "number",
      "maximum": 24
    },
    "larger": { "type": "number" }
  }
};

const validator = new Ajv().compile(schema);

class Schema {
  static validate(data) {
    if (validator(data)) {
      return null;
    }
    return lang.SCHEMA_VALIDATION_FAILED + JSON.stringify(validator.errors, null, 4);
  }
}

export default Schema;
