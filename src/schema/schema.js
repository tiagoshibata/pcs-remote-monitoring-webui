import Ajv from 'ajv';
import { desiredPropertiesSchema } from './definition'
import lang from '../common/lang'

const desiredPropertiesValidator = new Ajv().compile(desiredPropertiesSchema);

class Schema {
  static validate(validator, data) {
    if (validator(data)) {
      return null;
    }
    let firstError = validator.errors[0];
    let message = lang.SCHEMA_VALIDATION_FAILED + firstError.message + "\n";
    firstError.message = undefined;
    message += JSON.stringify(firstError, null, 4);
    return message;
  }

  static validateDesiredProperties(data) {
    return this.validate(desiredPropertiesValidator, data);
  }
}

export default Schema;
