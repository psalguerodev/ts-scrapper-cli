import {AnalysisResult, IAnalyzerInterface} from "../interfaces/analyzer.interface";
import csv from 'csv-parser';
import fs, {createReadStream} from 'fs';
import {ScrapedItem} from '../interfaces/scraper.interface';
import logger from '../utils/logger';

export class AnalyzerService implements IAnalyzerInterface {

    private calculateMedian(numbers: number[]): number {
        const sorted = numbers.sort(((a, b) => a - b));
        const middle = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    }


    public async analyze(inputPath: string): Promise<AnalysisResult> {
        const items: ScrapedItem[] = [];

        return new Promise((resolve, reject) => {
            createReadStream(inputPath)
                .pipe(csv())
                .on('data', (row: ScrapedItem) => {
                    console.log(row);
                    items.push({
                        ...row,
                        price: parseFloat(row.price.toString()),
                        rating: parseInt(row.rating.toString())
                    });
                })
                .on('end', () => {
                    const prices = items.map(item => item.price);
                    const timestamps = items.map(item => new Date(item.timestamp).getTime());
                    const ratings = items.map(item => item.rating);

                    const result: AnalysisResult = {
                        totalItems: items.length,
                        priceStats: {
                            min: Math.min(...prices),
                            max: Math.max(...prices),
                            average: prices.reduce((a, b) => a + b, 0) / prices.length,
                            median: this.calculateMedian(prices)
                        },
                        ratingStats: {
                            average: ratings.reduce((a, b) => a + b, 0) / ratings.length,
                            distribution: this.calculateRatingDistribution(items)
                        },
                        availabilityDistribution: this.calculateAvailabilityDistribution(items),
                        dateRange: {
                            start: new Date(Math.min(...timestamps)).toISOString(),
                            end: new Date(Math.max(...timestamps)).toISOString()
                        }
                    };

                    resolve(result);
                })
                .on('error', reject);
        });
    }

    private calculateRatingDistribution(items: ScrapedItem[]): Record<number, number> {
        return items.reduce((acc, item) => {
            acc[item.rating] = (acc[item.rating] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
    }

    private calculateAvailabilityDistribution(items: ScrapedItem[]): Record<string, number> {
        return items.reduce((acc, item) => {
            acc[item.availability] = (acc[item.availability] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }

    public async saveResults(results: AnalysisResult, outputPath: string): Promise<void> {
        try {
            await fs.promises.writeFile(
                outputPath,
                JSON.stringify(results, null, 2)
            );
            logger.info(`Analysis results saved to ${outputPath}`);
        } catch (error) {
            logger.error('Error saving analysis results:', error);
            throw error;
        }
    }
}

