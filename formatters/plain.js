export default (tree) => {
  const makeEndPath = (p, endNm) => p.concat(endNm).join('.');

  const stringifyValue = (dt) => {
    if (typeof dt === 'object' && !Array.isArray(dt) && dt !== null) {
      return '[complex value]';
    } if (typeof dt === 'string') {
      return `'${dt}'`;
    }
    return dt;
  };

  const iter = (someTree, path = []) => {
    const result = someTree.reduce((acc, valueObj) => {
      const { name, type, data } = valueObj;

      switch (type) {
        case 'childrenObj':
          return [...acc, iter(data, path.concat(name))];
        case 'sameValue':
          break;
        case 'diffValue':
          return [...acc, `Property '${makeEndPath(path, name)}' was updated. From ${stringifyValue(data[0])} to ${stringifyValue(data[1])}`];
        case 'onlyhasFirst':
          return [...acc, `Property '${makeEndPath(path, name)}' was removed`];
        case 'onlyhasSecond':
          return [...acc, `Property '${makeEndPath(path, name)}' was added with value: ${stringifyValue(data)}`];
        default:
          // code
      }

      return acc;
    }, []);

    return result.join('\n');
  };

  return iter(tree);
};
