export interface AnalysisResult {
    totalItems: number;
    priceStats: {
        min: number;
        max: number;
        average: number;
        median: number;
    };
    ratingStats: {
        average: number;
        distribution: Record<number, number>;
    };
    availabilityDistribution: Record<string, number>;
    dateRange: {
        start: string;
        end: string;
    };
}

export interface IAnalyzerInterface {
    analyze(inputPath: string): Promise<AnalysisResult>;
    saveResults(results: AnalysisResult, outputPath: string): Promise<void>;
}