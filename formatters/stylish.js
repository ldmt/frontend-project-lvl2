const stringify = (value, depth, replacer = ' ', spacesCount = 1) => {
  let result = '';
  const type = typeof value;

  const iterObject = (valueObj, d) => {
    const entries = Object.entries(valueObj);

    const someArr = entries.map(([k, v]) => {
      const t = typeof v;
      if (t === 'object' && v !== null) {
        const nestedObj = iterObject(v, d + 6);
        return `${replacer.repeat(spacesCount * d)}  ${k}: {\n${nestedObj}\n${replacer.repeat(spacesCount * (d + 4))}}`;
      }
      return `${replacer.repeat(spacesCount * (d))}  ${k}: ${v}`;
    });

    return someArr.join('\n');
  };

  if (type === 'object' && value !== null) {
    result += iterObject(value, depth + 6);
  }

  return `{\n${result}\n${replacer.repeat(spacesCount * (depth + 4))}}`;
};

export default (tree) => {
  const iter = (someTree, depth = 1, replacer = ' ', spacesCount = 1) => {
    const result = someTree.reduce((acc, valueObj) => {
      const { name, type, data } = valueObj;

      const stylishOnlyObj = (someData, someDepth) => {
        const isDataObject = (dt) => typeof dt === 'object' && !Array.isArray(dt) && dt !== null;

        return isDataObject(someData) ? stringify(someData, someDepth) : someData;
      };

      switch (type) {
        case 'childrenObj':
          acc.push(`${replacer.repeat(spacesCount * depth)}  ${name}: {\n${iter(data, depth + 4)}\n${replacer.repeat(spacesCount * (depth + 4))}}`);
          break;
        case 'sameValue':
          acc.push(`${replacer.repeat(spacesCount * depth)}  ${name}: ${stylishOnlyObj(data, depth)}`);
          break;
        case 'diffValue':
          acc.push(`${replacer.repeat(spacesCount * depth)}- ${name}: ${stylishOnlyObj(data[0], depth)}`);
          acc.push(`${replacer.repeat(spacesCount * depth)}+ ${name}: ${stylishOnlyObj(data[1], depth)}`);
          break;
        case 'onlyhasFirst':
          acc.push(`${replacer.repeat(spacesCount * depth)}- ${name}: ${stylishOnlyObj(data, depth)}`);
          break;
        case 'onlyhasSecond':
          acc.push(`${replacer.repeat(spacesCount * depth)}+ ${name}: ${stylishOnlyObj(data, depth)}`);
          break;
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
