/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
import stylish from './stylish.js';
import plain from './plain.js';
import toJSON from './formatJSON.js';

export default (frt) => {
  if (frt === 'stylish') {
    return stylish;
  } else if (frt === 'plain') {
    return plain;
  } else if (frt === 'json') {
    return toJSON;
  }
};
