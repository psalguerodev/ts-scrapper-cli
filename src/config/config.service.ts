export class ConfigService {
    private static instance: ConfigService;

    private constructor() {
        // Constructor privado para implementar Singleton
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public get(key: string): string {
        return process.env[key] || ''
    }

    public getNumber(key: string): number {
        return parseInt(this.get(key)) || 0;
    }

    get maxRetries(): number {
        return this.getNumber('MAX_RETRIES') || 0;
    }

    get retryDelay(): number {
        return this.getNumber('RETRY_DELAY') || 2000;
    }

    get userAgent(): string {
        return this.get('USER_AGENT') || 'BookScraperCLI/1.0';
    }

    get outputDir(): string {
        return this.get('DEFAULT_OUTPUT_DIR') || './data';
    }

    get defaultCsvFilename(): string {
        return this.get('CSV_FILENAME') || 'books-data.csv';
    }

    get defaultAnalysisFilename(): string {
        return this.get('ANALYSIS_FILENAME') || 'analysis.json';
    }

    get logLevel(): string {
        return this.get('LOG_LEVEL') || 'info';
    }

    get logFile(): string {
        return this.get('LOG_FILE') || 'app.log';
    }
}