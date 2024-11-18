import { ConfigService } from './config.service';

const config = ConfigService.getInstance();

export const DEFAULT_OUTPUT_DIR = config.outputDir;
export const DEFAULT_CSV_FILENAME = config.defaultCsvFilename;
export const DEFAULT_ANALYSIS_FILENAME = config.defaultAnalysisFilename;
