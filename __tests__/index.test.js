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
