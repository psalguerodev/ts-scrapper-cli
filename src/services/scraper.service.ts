import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { IScrapperService, ScrapedItem } from '../interfaces/scraper.interface';
import logger from '../utils/logger';
import { createObjectCsvWriter } from 'csv-writer';
import { ConfigService } from '../config/config.service';

export class ScraperService implements IScrapperService {
  private readonly config = ConfigService.getInstance();
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly headers: Record<string, string>;

  constructor() {
    this.maxRetries = this.config.maxRetries;
    this.retryDelay = this.config.retryDelay;
    this.headers = {
      'User-Agent': this.config.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    };
  }

  private async ensureDirectoryExists(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  private async fetchWithRetry(
    url: string,
    attempt: number = 1,
  ): Promise<string> {
    try {
      const response = await axios.get(url, { headers: this.headers });
      return response.data as Promise<string>;
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw new Error(
          `Failed to fetch ${url} after ${this.maxRetries} attempts`,
        );
      }
      logger.warn(`Retry attempt ${attempt} for ${url}`);
      await new Promise(resolve =>
        setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1)));
      return this.fetchWithRetry(url, attempt + 1);
    }
  }

  private getRating(ratingClass: string): number {
    const ratings: Record<string, number> = {
      'One': 1, 'Two': 2, 'Three': 3, 'Four': 4, 'Five': 5,
    };
    return ratings[ratingClass.split(' ')[1]] || 0;
  }

  public async scrape(url: string): Promise<ScrapedItem[]> {
    try {
      logger.info(`Starting scraping process for ${url}`);
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);
      const items: ScrapedItem[] = [];

      $('article.product_pod').each((_, element) => {
        const item: ScrapedItem = {
          title: $(element).find('h3 a').attr('title') || '',
          price: this.extractPrice($(element).find('.price_color').text()),
          availability: $(element).find('.availability').text().trim(),
          rating: this.getRating($(element).find('.star-rating').attr('class') || ''),
          category: $(element).find('.category').text().trim(),
          imageUrl: $(element).find('img').attr('src') || '',
          timestamp: new Date().toISOString(),
        };
        items.push(item);
      });

      return items;
    } catch (error) {
      logger.error('Error during scraping:', error);
      throw error;
    }
  }

  private extractPrice(priceString: string): number {
    const price = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    return isNaN(price) ? 0 : price;
  }

  public async saveToCSV(
    data: ScrapedItem[],
    outputPath: string,
  ): Promise<void> {
    try {
      await this.ensureDirectoryExists(outputPath);

      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: [
          { id: 'title', title: 'title' },
          { id: 'price', title: 'price' },
          { id: 'description', title: 'description' },
          { id: 'url', title: 'url' },
          { id: 'timestamp', title: 'timestamp' },
          { id: 'rating', title: 'rating' },
        ],
      });

      await csvWriter.writeRecords(data);
      logger.info(`Data successfully saved to ${outputPath}`);
    } catch (error) {
      logger.error('Error saving to CSV:', error);
      throw error;
    }
  }
}
