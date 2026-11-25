import type { NewsArticle, PricePoint, Stock } from "./types";

export const sampleStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology", price: 277.55, change: 3.25, changePercent: 1.18, marketCap: 4_120_000_000_000, volume: 48_200_000, currency: "USD" },
  { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", sector: "Technology", price: 486.74, change: -2.31, changePercent: -0.47, marketCap: 3_620_000_000_000, volume: 18_900_000, currency: "USD" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", sector: "Semiconductors", price: 191.52, change: 4.86, changePercent: 2.60, marketCap: 4_650_000_000_000, volume: 152_400_000, currency: "USD" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", sector: "Communication", price: 318.21, change: 0.94, changePercent: 0.30, marketCap: 3_820_000_000_000, volume: 26_100_000, currency: "USD" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "Consumer", price: 227.04, change: -3.18, changePercent: -1.38, marketCap: 2_420_000_000_000, volume: 41_300_000, currency: "USD" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Automotive", price: 432.11, change: 8.72, changePercent: 2.06, marketCap: 1_440_000_000_000, volume: 96_800_000, currency: "USD" },
];

const baseCloses: Record<string, number[]> = {
  AAPL: [259, 262, 261, 266, 264, 269, 271, 268, 273, 272, 275, 274, 277.55],
  MSFT: [472, 477, 481, 479, 484, 488, 485, 491, 493, 489, 492, 489, 486.74],
  NVDA: [169, 172, 176, 174, 180, 183, 181, 185, 188, 186, 190, 187, 191.52],
  GOOGL: [302, 305, 304, 309, 311, 308, 313, 315, 312, 316, 317, 317.27, 318.21],
  AMZN: [238, 236, 241, 239, 235, 233, 237, 232, 230, 234, 232, 230.22, 227.04],
  TSLA: [386, 392, 389, 401, 398, 407, 412, 405, 416, 421, 418, 423.39, 432.11],
};

export const samplePrices: Record<string, PricePoint[]> = Object.fromEntries(
  Object.entries(baseCloses).map(([symbol, closes]) => [
    symbol,
    closes.map((close, index) => {
      const date = new Date("2026-11-07T00:00:00Z");
      date.setUTCDate(date.getUTCDate() + index);
      return {
        date: date.toISOString().slice(0, 10),
        open: close - 1.2,
        high: close + 2.1,
        low: close - 2.4,
        close,
        volume: 20_000_000 + index * 1_750_000,
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
