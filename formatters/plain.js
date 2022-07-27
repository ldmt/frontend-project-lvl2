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
          acc.push(iter(data, path.concat(name)));
          break;
        case 'sameValue':
          break;
        case 'diffValue':
          acc.push(`Property '${makeEndPath(path, name)}' was updated. From ${stringifyValue(data[0])} to ${stringifyValue(data[1])}`);
          break;
        case 'onlyhasFirst':
          acc.push(`Property '${makeEndPath(path, name)}' was removed`);
          break;
        case 'onlyhasSecond':
          acc.push(`Property '${makeEndPath(path, name)}' was added with value: ${stringifyValue(data)}`);
          break;
        default:
          // code
      }

      return acc;
    }, []);

    return result.join('\n');
  };

  return iter(tree);
};
