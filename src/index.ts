import { Command } from 'commander';
import {
  DEFAULT_ANALYSIS_FILENAME,
  DEFAULT_CSV_FILENAME,
} from './config/constants';
import { AnalysisOptions, ScrapingOptions } from './types';
import logger from './utils/logger';
import { executeScrapingCommand } from './commands/scrape.command';
import {executeAnalysisCommand} from "./commands/analyze.command";

const program = new Command();

program
  .name('cli')
  .description('CLI for web scraping and data analysis')
  .version('1.0.0');

program
  .command('scrape')
  .description('Scrape data from a website and save to CSV')
  .requiredOption('-u, --url <url>', 'URL to scrape')
  .option('-o, --output <filename>', 'Output filename', DEFAULT_CSV_FILENAME)
  .action(async (options: ScrapingOptions) => {
    try {
      await executeScrapingCommand(options);
    } catch (error) {
      logger.error('Command execution failed:', error);
      process.exit(1);
    }
  });

program
    .command('analyze')
    .description('Analyze scraped data from CSV file')
    .requiredOption('-i, --input <filename>', 'Input CSV file')
    .option(
        '-o, --output <filename>',
        'Output filename for analysis results',
        DEFAULT_ANALYSIS_FILENAME
    )
    .action(async (options: AnalysisOptions) => {
      try {
        await executeAnalysisCommand(options);
      } catch (error) {
        logger.error('Command execution failed:', error);
        process.exit(1);
      }
    });

program.parse();
