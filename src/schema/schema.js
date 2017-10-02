import Ajv from 'ajv';
import { desiredPropertiesSchema } from './definition'
import lang from '../common/lang'

const desiredPropertiesValidator = new Ajv().compile(desiredPropertiesSchema);

class Schema {
  static validate(validator, data) {
    if (validator(data)) {
      return null;
    }
    return lang.SCHEMA_VALIDATION_FAILED + JSON.stringify(validator.errors, null, 4);
  }

  static validateDesiredProperties(data) {
    return this.validate(desiredPropertiesValidator, data);
  }
}

export default Schema;
