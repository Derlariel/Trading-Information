import type { NewsArticle, PricePoint, Stock } from "./types";

export const sampleStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology", price: 277.55, change: 3.25, changePercent: 1.18, marketCap: 4_120_000_000_000, volume: 48_200_000, currency: "USD" },
  { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", sector: "Technology", price: 486.74, change: -2.31, changePercent: -0.47, marketCap: 3_620_000_000_000, volume: 18_900_000, currency: "USD" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", sector: "Semiconductors", price: 191.52, change: 4.86, changePercent: 2.60, marketCap: 4_650_000_000_000, volume: 152_400_000, currency: "USD" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", sector: "Communication", price: 318.21, change: 0.94, changePercent: 0.30, marketCap: 3_820_000_000_000, volume: 26_100_000, currency: "USD" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "Consumer", price: 227.04, change: -3.18, changePercent: -1.38, marketCap: 2_420_000_000_000, volume: 41_300_000, currency: "USD" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Automotive", price: 432.11, change: 8.72, changePercent: 2.06, marketCap: 1_440_000_000_000, volume: 96_800_000, currency: "USD" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", sector: "Communication", price: 642.18, change: 7.44, changePercent: 1.17, marketCap: 1_620_000_000_000, volume: 21_600_000, currency: "USD" },
  { symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ", sector: "Semiconductors", price: 356.42, change: 6.12, changePercent: 1.75, marketCap: 1_670_000_000_000, volume: 28_900_000, currency: "USD" },
  { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", sector: "Semiconductors", price: 214.73, change: -1.82, changePercent: -0.84, marketCap: 348_000_000_000, volume: 63_200_000, currency: "USD" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", sector: "Communication", price: 118.64, change: 1.06, changePercent: 0.90, marketCap: 505_000_000_000, volume: 34_100_000, currency: "USD" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financials", price: 294.31, change: -0.76, changePercent: -0.26, marketCap: 809_000_000_000, volume: 12_800_000, currency: "USD" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", sector: "Financials", price: 371.26, change: 2.08, changePercent: 0.56, marketCap: 712_000_000_000, volume: 7_900_000, currency: "USD" },
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", sector: "Consumer", price: 116.82, change: 0.68, changePercent: 0.59, marketCap: 932_000_000_000, volume: 17_800_000, currency: "USD" },
  { symbol: "COST", name: "Costco Wholesale Corp.", exchange: "NASDAQ", sector: "Consumer", price: 992.44, change: -4.20, changePercent: -0.42, marketCap: 440_000_000_000, volume: 2_100_000, currency: "USD" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", exchange: "NYSE", sector: "Energy", price: 128.16, change: 1.43, changePercent: 1.13, marketCap: 548_000_000_000, volume: 19_700_000, currency: "USD" },
  { symbol: "LLY", name: "Eli Lilly and Co.", exchange: "NYSE", sector: "Healthcare", price: 1048.20, change: 12.36, changePercent: 1.19, marketCap: 994_000_000_000, volume: 4_800_000, currency: "USD" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", exchange: "NYSE", sector: "Healthcare", price: 352.78, change: -7.14, changePercent: -1.98, marketCap: 323_000_000_000, volume: 9_600_000, currency: "USD" },
  { symbol: "KO", name: "The Coca-Cola Co.", exchange: "NYSE", sector: "Consumer", price: 74.58, change: 0.12, changePercent: 0.16, marketCap: 321_000_000_000, volume: 13_500_000, currency: "USD" },
];

export const samplePrices: Record<string, PricePoint[]> = Object.fromEntries(
  sampleStocks.map((stock, stockIndex) => [
    stock.symbol,
    Array.from({ length: 30 }, (_, index) => {
      const date = new Date("2026-10-27T00:00:00Z");
      date.setUTCDate(date.getUTCDate() + index);
      const direction = stock.changePercent >= 0 ? 1 : -1;
      const close = Number((stock.price * (1 - direction * (29 - index) * 0.0025 + Math.sin(index + stockIndex) * 0.006)).toFixed(2));
      return {
        date: date.toISOString().slice(0, 10),
        open: Number((close * 0.996).toFixed(2)),
        high: Number((close * 1.009).toFixed(2)),
        low: Number((close * 0.991).toFixed(2)),
        close,
        volume: Math.round(stock.volume * (0.7 + (index % 7) * 0.07)),
      };
    }),
  ]),
);

export const sampleNews: NewsArticle[] = [
  { id: 1, title: "ผู้ผลิตชิปเร่งลงทุนโครงสร้างพื้นฐาน AI รับดีมานด์ปีหน้า", summary: "อุตสาหกรรมเซมิคอนดักเตอร์ยังได้รับแรงหนุนจากการลงทุนศูนย์ข้อมูลและระบบประมวลผล AI", source: "Global Market Wire", url: "https://www.gdeltproject.org/", publishedAt: "2026-11-25T07:30:00Z", symbols: ["NVDA", "MSFT"], sentiment: "positive" },
  { id: 2, title: "ตลาดจับตารายงานยอดขายช่วงวันหยุดของกลุ่มค้าปลีกสหรัฐฯ", summary: "นักลงทุนประเมินกำลังซื้อผู้บริโภคและทิศทางมาร์จินของแพลตฟอร์มอีคอมเมิร์ซรายใหญ่", source: "Finance Daily", url: "https://www.gdeltproject.org/", publishedAt: "2026-11-25T05:15:00Z", symbols: ["AMZN"], sentiment: "neutral" },
  { id: 3, title: "หุ้นเทคโนโลยีขนาดใหญ่ปรับตัวขึ้นก่อนประกาศข้อมูลเศรษฐกิจ", summary: "ดัชนีเทคโนโลยีได้แรงหนุนจากหุ้นซอฟต์แวร์ คลาวด์ และผู้ผลิตอุปกรณ์รายใหญ่", source: "Market Brief", url: "https://www.gdeltproject.org/", publishedAt: "2026-11-25T03:45:00Z", symbols: ["AAPL", "MSFT", "GOOGL"], sentiment: "positive" },
  { id: 4, title: "ผู้ผลิตรถยนต์ไฟฟ้าเผชิญการแข่งขันด้านราคาในตลาดโลก", summary: "การแข่งขันที่สูงขึ้นอาจกดดันอัตรากำไร แม้ยอดส่งมอบรถยนต์ไฟฟ้ายังคงเติบโต", source: "Mobility Watch", url: "https://www.gdeltproject.org/", publishedAt: "2026-11-24T23:20:00Z", symbols: ["TSLA"], sentiment: "negative" },
  { id: 5, title: "การใช้จ่ายด้านคลาวด์ยังเติบโตต่อเนื่องในองค์กรขนาดใหญ่", summary: "ผลสำรวจพบว่าองค์กรให้ความสำคัญกับระบบ AI ความปลอดภัย และการย้ายข้อมูลขึ้นคลาวด์", source: "Tech Economy", url: "https://www.gdeltproject.org/", publishedAt: "2026-11-24T18:40:00Z", symbols: ["MSFT", "AMZN", "GOOGL"], sentiment: "positive" },
  { id: 6, title: "นักลงทุนประเมินมูลค่าหุ้นเติบโตหลังผลตอบแทนพันธบัตรขยับ", summary: "การเปลี่ยนแปลงของอัตราผลตอบแทนพันธบัตรอาจเพิ่มความผันผวนให้หุ้นที่มีมูลค่าสูง", source: "Capital Note", url: "https://www.gdeltproject.org/", publishedAt: "2026-11-24T14:10:00Z", symbols: ["AAPL", "NVDA", "TSLA"], sentiment: "neutral" },
];
