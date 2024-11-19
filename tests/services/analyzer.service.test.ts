import {AnalyzerService} from '../../src/services/analyzer.service';
import fs from 'fs';
import {promisify} from 'util';
import {AnalysisResult} from '../../src/interfaces/analyzer.interface';

jest.mock('fs');
const writeFile = promisify(fs.writeFile);

describe('AnalyzerService', () => {
    let analyzerService: AnalyzerService;

    beforeEach(() => {
        analyzerService = new AnalyzerService();
        jest.clearAllMocks();
    });

    const mockCsvData = `
title,price,availability,rating,timestamp
"Test Book 1",10.99,"In stock",4,${new Date().toISOString()}
"Test Book 2",15.99,"Out of stock",5,${new Date().toISOString()}
    `.trim();

    describe('analyze', () => {
        it('should analyze CSV data correctly', async () => {
            // Arrange
            jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
                const Readable = require('stream').Readable;
                const s = new Readable();
                s.push(mockCsvData);
                s.push(null);
                return s;
            });

            // Act
            const result = await analyzerService.analyze('test.csv');

            // Assert
            expect(result.totalItems).toBe(2);
            expect(result.priceStats.average).toBeCloseTo(13.49);
            expect(result.ratingStats.average).toBeCloseTo(4.5);
        });
    });
});