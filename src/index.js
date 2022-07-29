/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
/* eslint-disable no-prototype-builtins */
import * as fs from 'fs';
import { extname } from 'path';
import parse from './parser.js';
import formatter from '../formatters/index.js';

const diff = (data) => {
  const { parsedData1, parsedData2 } = data;

  const makeDiff = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const mergedKeys = keys1.concat(keys2).sort();
    /* const sort = (arr) => {
      for (let i = 0; i < arr.length; i += 1) {
        for (let j = 0; j < arr.length; j += 1) {
          if (arr[j] > arr[i]) {
            const temp = arr[i];
            arr[i] = arr[j];
            result[i]
            arr[j] = temp;
          }
        }
      }
      return arr;
    };
    const sortedMergedKeys = sort(mergedKeys); */
    const uniqKeys = mergedKeys.reduce((result, key) => {
      if (!result.includes(key)) {
        return [...result, key];
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

        return [...acc, { name: uniqKey, type: 'childrenObj', data: arrDifference }];
      } else if (hasFirst && hasSecond && !isBothEqualValue && !isBothTypeObj) {
        return [...acc, { name: uniqKey, type: 'diffValue', data: [value1, value2] }];
      } else if (hasFirst && !hasSecond) {
        return [...acc, { name: uniqKey, type: 'onlyhasFirst', data: value1 }];
      } else if (!hasFirst && hasSecond) {
        return [...acc, { name: uniqKey, type: 'onlyhasSecond', data: value2 }];
      } else {
        return [...acc, { name: uniqKey, type: 'sameValue', data: value1 }];
      }
    }, []);

    return result;
  };

  return makeDiff(parsedData1, parsedData2);
};

// eslint-disable-next-line no-unused-vars
export default (fp1, fp2, format = 'stylish') => {
  const data1 = fs.readFileSync(fp1);
  const data2 = fs.readFileSync(fp2);
  const data = { data1, data2 };

  const fileExt1 = extname(fp1);
  const fileExt2 = extname(fp2);
  const fileExt = { fileExt1, fileExt2 };

  const parsedData = parse(data, fileExt);

  const resultDiff = diff(parsedData);

  const requiredFormatter = formatter(format);

  const result = requiredFormatter(resultDiff);

  return result;
};
