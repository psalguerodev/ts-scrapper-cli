import {AnalysisOptions} from '../types';
import {AnalyzerService} from '../services/analyzer.service';
import logger from '../utils/logger';
import path from 'path';
import {DEFAULT_OUTPUT_DIR} from '../config/constants';
import {ConfigService} from "../config/config.service";

export async function executeAnalysisCommand(options: AnalysisOptions): Promise<void> {
    const analyzer = new AnalyzerService();
    const config = ConfigService.getInstance();
    const outputPath = path.join(
        config.outputDir,
        options.output || config.defaultAnalysisFilename
    );

    try {
        logger.info('Starting analysis...', {inputFile: options.input});

        const results = await analyzer.analyze(options.input);
        await analyzer.saveResults(results, outputPath);

        logger.info('Analysis completed successfully', {
            inputFile: options.input,
            outputPath,
            totalItems: results.totalItems
        });
    } catch (error) {
        logger.error('Error in analysis command:', error);
        throw error;
    }
}