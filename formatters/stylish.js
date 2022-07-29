const stringify = (value, depth, replacer = '  ', spacesCount = 1) => {
  const result = '';
  const type = typeof value;

  const iterObject = (valueObj, d) => {
    const entries = Object.entries(valueObj);

    const someArr = entries.map(([k, v]) => {
      const t = typeof v;
      if (t === 'object' && v !== null) {
        const nestedObj = iterObject(v, d + 2);
        return `${replacer.repeat(spacesCount * d)}  ${k}: {\n${nestedObj}\n${replacer.repeat(spacesCount * (d + 1))}}`;
      }
      return `${replacer.repeat(spacesCount * d)}  ${k}: ${v}`;
    });

    return someArr.join('\n');
  };

  return `{\n${type === 'object' && value !== null ? `${result}${iterObject(value, depth + 2)}` : `${result}`}\n${replacer.repeat(spacesCount * (depth + 1))}}`;
};

export default (tree) => {
  const iter = (someTree, depth = 1, replacer = '  ', spacesCount = 1) => {
    const result = someTree.reduce((acc, valueObj) => {
      const { name, type, data } = valueObj;

      const stylishOnlyObj = (someData, someDepth) => {
        const isDataObject = (dt) => typeof dt === 'object' && !Array.isArray(dt) && dt !== null;

        return isDataObject(someData) ? stringify(someData, someDepth) : someData;
      };

      switch (type) {
        case 'childrenObj':
          return [...acc, `${replacer.repeat(spacesCount * depth)}  ${name}: {\n${iter(data, depth + 2)}\n${replacer.repeat(spacesCount * (depth + 1))}}`];
        case 'sameValue':
          return [...acc, `${replacer.repeat(spacesCount * depth)}  ${name}: ${stylishOnlyObj(data, depth)}`];
        case 'diffValue':
          return [...acc, `${replacer.repeat(spacesCount * depth)}- ${name}: ${stylishOnlyObj(data[0], depth)}`, `${replacer.repeat(spacesCount * depth)}+ ${name}: ${stylishOnlyObj(data[1], depth)}`];
        case 'onlyhasFirst':
          return [...acc, `${replacer.repeat(spacesCount * depth)}- ${name}: ${stylishOnlyObj(data, depth)}`];
        case 'onlyhasSecond':
          return [...acc, `${replacer.repeat(spacesCount * depth)}+ ${name}: ${stylishOnlyObj(data, depth)}`];
        default:
        // code
      }

      return acc;
    }, []);
    return result.join('\n');
  };

  const makeStylish = iter(tree);
  return `{\n${makeStylish}\n}`;
};
