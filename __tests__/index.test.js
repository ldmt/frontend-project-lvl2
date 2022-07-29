import { test, expect } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('genDiff only nested JSON', () => {
  const path1 = getFixturePath('nestedFile1.json');
  const path2 = getFixturePath('nestedFile2.json');

  expect(genDiff(path1, path2)).toBe(`{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }\n}`);
});

test('genDiff only nested YAML', () => {
  const path1 = getFixturePath('nestedYaml1.yaml');
  const path2 = getFixturePath('nestedYaml2.yml');

  expect(genDiff(path1, path2)).toBe(`{
    doe: a deer, a female deer
  - french-hens: 8
  + french-hens: 5
    pi: 3.14159
  - ray: a drop
  + ray: a drop of golden sun
  - xmas: null
  + xmas: true
    xmas-fifth-day: {
        calling-birds: four
        french-hens: 3
        golden-rings: 5
        partridges: {
            count: 2
          - location: a pear tree
          + location: a pear
        }
        turtle-doves: two
    }\n}`);
});

test('genDiff format plain JSON', () => {
  const path1 = getFixturePath('nestedFile1.json');
  const path2 = getFixturePath('nestedFile2.json');

  expect(genDiff(path1, path2, 'plain')).toBe(`Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`);
});

test('genDiff format json JSON', () => {
  const path1 = getFixturePath('nestedFile1.json');
  const path2 = getFixturePath('nestedFile2.json');

  expect(genDiff(path1, path2, 'json')).toBe('[{"name":"common","type":"childrenObj","data":[{"name":"follow","type":"onlyhasSecond","data":false},{"name":"setting1","type":"sameValue","data":"Value 1"},{"name":"setting2","type":"onlyhasFirst","data":200},{"name":"setting3","type":"diffValue","data":[true,null]},{"name":"setting4","type":"onlyhasSecond","data":"blah blah"},{"name":"setting5","type":"onlyhasSecond","data":{"key5":"value5"}},{"name":"setting6","type":"childrenObj","data":[{"name":"doge","type":"childrenObj","data":[{"name":"wow","type":"diffValue","data":["","so much"]}]},{"name":"key","type":"sameValue","data":"value"},{"name":"ops","type":"onlyhasSecond","data":"vops"}]}]},{"name":"group1","type":"childrenObj","data":[{"name":"baz","type":"diffValue","data":["bas","bars"]},{"name":"foo","type":"sameValue","data":"bar"},{"name":"nest","type":"diffValue","data":[{"key":"value"},"str"]}]},{"name":"group2","type":"onlyhasFirst","data":{"abc":12345,"deep":{"id":45}}},{"name":"group3","type":"onlyhasSecond","data":{"deep":{"id":{"number":45}},"fee":100500}}]');
});
