/* eslint-disable no-else-return */
import stylish from './stylish.js';
import plain from './plain.js';

export default (frt) => {
  if (frt === 'stylish') {
    return stylish;
  } else if (frt === 'plain') {
    return plain;
  }
};
