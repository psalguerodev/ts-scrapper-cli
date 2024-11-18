import {executeScrapingCommand} from '../../src/commands/scrape.command';
import { ScraperService } from '../../src/services/scraper.service';

jest.mock('../../src/services/scraper.service');

describe('Scrape Command', () => {
    it('should execute scraping successfully', async () => {
        // Arrange
        const mockOptions = {
            url: 'http://example.com',
            output: 'test-book.csv'
        };

        // Act & Assert
        await expect(executeScrapingCommand(mockOptions)).resolves.not.toThrow();
    });
});