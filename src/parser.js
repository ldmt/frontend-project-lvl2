import { load } from 'js-yaml';

export default (data, fileExt) => {
  const { data1, data2 } = data;
  const { fileExt1, fileExt2 } = fileExt;

  const formatYAML = ['.yaml', '.yml'];

  const parsedData1 = formatYAML.includes(fileExt1) ? load(data1) : JSON.parse(data1);
  const parsedData2 = formatYAML.includes(fileExt2) ? load(data2) : JSON.parse(data2);

  return { parsedData1, parsedData2 };
};
