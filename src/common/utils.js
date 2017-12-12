// Copyright (c) Microsoft. All rights reserved.

export function isFunction(value) {
  return typeof value === 'function';
}

export function isObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x);
}

export function getBoundaryChars(str) {
  if (!str) return;
  const len = str.length;
  const same = str.charAt(0) === str.charAt(len - 1);
  return same ? str.charAt(0) : null;
}

export function getTypeOf(val) {
  if (!val) return;
  if (typeof val === 'number') {
    return 'Int';
  } else if (typeof val === 'string' && (getBoundaryChars(val) === '"' || getBoundaryChars(val) === "'")) {
    return 'Text';
  }
  return 'Text';
}

export function booleanValue(input) {
  let number = Number(input);
  if (!isNaN(number)) {
    return !!number;
  }
  let lower = input.toLowerCase()
  if (lower === 'y' || lower === 'yes' || lower === 'true') {
    return true;
  }
  if (lower === 'n' || lower === 'no' || lower === 'false') {
    return false;
  }
  return null;
}

export function typeComputation(cond) {
  cond.type = typeof cond.Value === 'number' ? 'Number' : 'Text';
}

export function getNonFunctionalProps(props) {
  const nonFuncKeys = Object.keys(props).filter(key => !isFunction(props[key]));
  const result = {};
  nonFuncKeys.forEach(key => result[key] = props[key]);
  return result;
}

export function debounce(fn, delay) {
  var timer = null;
  return function() {
    var context = this,
      args = arguments;
    args[0].persist();
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

export function formatString(input, ...values) {
  const matchs = /{\d}/g.exec(input);

  if (!matchs) {
    return input;
  }

  for (let i = 0; i < values.length; i++) {
    let regex = new RegExp(`{[${i}]}`, 'g');
    input = input.replace(regex, values[i]);
  }
  return input;
}

export function formatDate(date) {
  if (!date) {
    date = new Date();
  }
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  if (date instanceof Date) {
    return `${date.getMonth() +
      1}${date.getDate()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  }
}

export function getRandomString(length) {
  let template = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  length = length || 10;
  let retVal = '';
  for (let i = 0; i < length; i++) {
    let rnd = Math.floor(Math.random() * 61);
    retVal = retVal.concat(template[rnd]);
  }
  return retVal;
}

export function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function sanitizeJobName(jobName) {
  return jobName.replace(/[\W_]/g, "");
}

export function makeShallowObject(object, formatter) {
  formatter = formatter || (x => x);
  let shallow = {};
  for (let key in object) {
    let value = formatter(object[key]);
    if (isObject(value)) {
      let subObject = makeShallowObject(value, formatter);
      let finalSubObject = {};
      for (let subKey in subObject)
        finalSubObject[key + '.' + subKey] = subObject[subKey];
      Object.assign(shallow, finalSubObject);
    } else {
      shallow[key] = JSON.stringify(value);
    }
  }
  return shallow;
}

export default {
  isFunction,
  debounce,
  formatDate,
  formatString,
  getRandomString
};
