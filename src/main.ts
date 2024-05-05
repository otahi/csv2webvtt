import { Command } from 'commander';
import { Csv2Webvtt } from './csv2webvtt.js';

const program = new Command();
program
  .name('csv2webtts')
  .version('0.1.0')
  .description('Convert CSV files to WebVTT format.')
  .requiredOption('-i, --input <file>', 'input CSV file')
  .requiredOption('-o, --output <file>', 'output VTT file')
  .action(async (options) => {
    const csv2webvtt = new Csv2Webvtt(options.input, options.output);
    await csv2webvtt.convert();
  });

program.parse(process.argv);