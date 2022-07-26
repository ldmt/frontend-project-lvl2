import { Command } from 'commander';
import genDiff from './index.js';

export default () => {
  const program = new Command();

  program
    .name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format <type>', 'output format', 'stylish')
    .action((filepath1, filepath2) => {
      const result = genDiff(filepath1, filepath2, program.opts().format);
      console.log(result);
    });

  program.parse();
};
