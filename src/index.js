/* eslint-disable no-prototype-builtins */
import * as fs from 'fs';

const diff = (dt1, dt2) => {
  const obj1 = JSON.parse(dt1);
  const obj2 = JSON.parse(dt2);

  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  const mergedKeys = keys1.concat(keys2).sort();

  const uniqKeys = mergedKeys.reduce((result, key) => {
    if (!result.includes(key)) {
      result.push(key);
    }
    return result;
  }, []);

  const result = [];
  for (let i = 0; i < uniqKeys.length; i += 1) {
    const key = uniqKeys[i];

    const hasObj1 = obj1.hasOwnProperty(key);
    const hasObj2 = obj2.hasOwnProperty(key);

    if (hasObj1 && !hasObj2) {
      result.push([`  - ${key}: `, `${obj1[key]}`]);
    } else if (!hasObj1 && hasObj2) {
      result.push([`  + ${key}: `, `${obj2[key]}`]);
    } else if (obj1[key] === obj2[key]) {
      result.push([`    ${key}: `, `${obj1[key]}`]);
    } else {
      result.push([`  - ${key}: `, `${obj1[key]}`], [`  + ${key}: `, `${obj2[key]}`]);
    }
  }

  return `{\n${result.map((value) => value.join('')).join('\n')}\n}`;
};

export default (fp1, fp2, format) => {
  const data1 = fs.readFileSync(fp1);
  const data2 = fs.readFileSync(fp2);

  const result = diff(data1, data2);

  return result;
};
