import { test, expect } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('genDiff only JSON', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');

  expect(genDiff(path1, path2)).toBe(`{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true\n}`);
});

test('genDiff only YAML', () => {
  const path1 = getFixturePath('newFile2.yml');
  const path2 = getFixturePath('newFile.yaml');

  expect(genDiff(path1, path2)).toBe(`{
    doe: a deer, a female deer
  + follow: true
  - french-hens: 10
  + french-hens: 3
    pi: 3.14159
  - ray: a drop
  + ray: a drop of golden sun
  - xmas: false
  + xmas: true\n}`);
});

test('genDiff mixed', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('newFile.yaml');

  expect(genDiff(path1, path2)).toBe(`{
  + doe: a deer, a female deer
  - follow: false
  + follow: true
  + french-hens: 3
  - host: hexlet.io
  + pi: 3.14159
  - proxy: 123.234.53.22
  + ray: a drop of golden sun
  - timeout: 50
  + xmas: true\n}`);
});
