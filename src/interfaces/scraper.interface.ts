export interface ScrapedItem {
  title: string;
  price: number;
  availability: string;
  rating: number;
  category: string;
  imageUrl: string;
  timestamp: string;
}

export interface IScrapperService {
  scrape(url: string): Promise<ScrapedItem[]>;
  saveToCSV(data: ScrapedItem[], outputFile: string): Promise<void>;
}
