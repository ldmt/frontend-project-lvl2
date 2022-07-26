/* eslint-disable no-prototype-builtins */
import * as fs from 'fs';
import { extname } from 'path';
import parse from './parser.js';
import stylish from './stylish.js';

const diff = (data) => {
  const { parsedData1, parsedData2 } = data;

  const makeDiff = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const mergedKeys = keys1.concat(keys2).sort();
    const uniqKeys = mergedKeys.reduce((result, key) => {
      if (!result.includes(key)) {
        result.push(key);
      }
      return result;
    }, []);

    const result = uniqKeys.reduce((acc, uniqKey) => {
      const hasFirst = obj1.hasOwnProperty(uniqKey);
      const hasSecond = obj2.hasOwnProperty(uniqKey);

      const typeFirst = typeof obj1[uniqKey];
      const typeSecond = typeof obj2[uniqKey];
      const isBothTypeObj = (typeFirst === 'object' && typeFirst === typeSecond);

      const value1 = obj1[uniqKey];
      const value2 = obj2[uniqKey];
      const isBothEqualValue = (value1 === value2);

      if (hasFirst && hasSecond && isBothTypeObj) {
        const arrDifference = makeDiff(value1, value2);

        acc.push({ name: uniqKey, type: 'childrenObj', data: arrDifference });
      } else if (hasFirst && hasSecond && !isBothEqualValue && !isBothTypeObj) {
        acc.push({ name: uniqKey, type: 'diffValue', data: [value1, value2] });
      } else if (hasFirst && !hasSecond) {
        acc.push({ name: uniqKey, type: 'onlyhasFirst', data: value1 });
      } else if (!hasFirst && hasSecond) {
        acc.push({ name: uniqKey, type: 'onlyhasSecond', data: value2 });
      } else {
        acc.push({ name: uniqKey, type: 'sameValue', data: value1 });
      }

      return acc;
    }, []);

    return result;
  };

  return makeDiff(parsedData1, parsedData2);
};

// eslint-disable-next-line no-unused-vars
export default (fp1, fp2, format) => {
  const data1 = fs.readFileSync(fp1);
  const data2 = fs.readFileSync(fp2);
  const data = { data1, data2 };

  const fileExt1 = extname(fp1);
  const fileExt2 = extname(fp2);
  const fileExt = { fileExt1, fileExt2 };

  const parsedData = parse(data, fileExt);

  const resultDiff = diff(parsedData);

  const result = stylish(resultDiff);

  return result;
};
