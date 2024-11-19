import {ScrapingOptions} from '../types';
import {ScraperService} from '../services/scraper.service';
import logger from '../utils/logger';
import path from 'path';
import {ConfigService} from "../config/config.service";

export async function executeScrapingCommand(
    options: ScrapingOptions
): Promise<void> {

    const scraper = new ScraperService();
    const config = ConfigService.getInstance();
    const outputPath = path.join(
        config.outputDir,
        options.output || config.defaultCsvFilename
    );

    try {
        logger.info('Starting scraping process...', {url: options.url});

        const scrapedData = await scraper.scrape(options.url);
        await scraper.saveToCSV(scrapedData, outputPath);

        logger.info('Scraping completed successfully', {
            itemsScraped: scrapedData ? scrapedData.length : 0,
            outputPath,
        });
    } catch (error) {
        logger.error('Error in scraping command:', error);
        throw error;
    }
}
