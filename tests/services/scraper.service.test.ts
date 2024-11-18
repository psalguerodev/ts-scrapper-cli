import axios from "axios";
import {ScraperService} from "../../src/services/scraper.service";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ScraperService', () => {
    let scraperService: ScraperService;

    beforeEach(() => {
        scraperService = new ScraperService();
        jest.clearAllMocks();
    });

    const mockHtmlContent = `
        <html>
            <body>
                <article class="product_pod">
                    <h3><a title="Test Book">Test Book</a></h3>
                    <div class="price_color">£10.99</div>
                    <p class="availability">In stock</p>
                    <p class="star-rating Four"></p>
                    <img src="test.jpg" />
                </article>
            </body>
        </html>
    `;

    describe('scrape', () => {
        it('should scrape data successfully', async () => {
            // Arrange
            mockedAxios.get.mockResolvedValueOnce({ data: mockHtmlContent });
            const url = 'http://example.com';

            // Act
            const result = await scraperService.scrape(url);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                title: 'Test Book',
                price: 10.99,
                availability: 'In stock',
                rating: 4
            });
        });

        it('should handle network errors', async () => {
            // Arrange
            mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
            const url = 'https://example.com';

            // Act & Assert
            await expect(scraperService.scrape(url)).rejects.toThrow();
        });
    });
});