import { Pool, types } from "pg";
import { sampleNews, samplePrices, sampleStocks } from "./sample-data";
import type { NewsArticle, PricePoint, Stock } from "./types";

let pool: Pool | undefined;

types.setTypeParser(1082, (value) => value);

function database() {
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return null;
  pool ??= new Pool(process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, max: 10 }
    : { max: 10 });
  return pool;
}

export async function getDatabaseStatus() {
  const db = database();
  if (!db) return "demo" as const;
  await db.query("SELECT 1");
  return "connected" as const;
}

function mapStock(row: Record<string, unknown>): Stock {
  return {
    symbol: String(row.symbol),
    name: String(row.name),
    exchange: String(row.exchange),
    sector: String(row.sector),
    price: Number(row.price),
    change: Number(row.change),
    changePercent: Number(row.change_percent),
    marketCap: Number(row.market_cap),
    volume: Number(row.volume),
    currency: String(row.currency),
  };
}

function mapPrice(row: Record<string, unknown>): PricePoint {
  return {
    date: String(row.date),
    open: Number(row.open),
    high: Number(row.high),
    low: Number(row.low),
    close: Number(row.close),
    volume: Number(row.volume),
  };
}

function mapNews(row: Record<string, unknown>): NewsArticle {
  return {
    id: Number(row.id),
    title: String(row.title),
    summary: String(row.summary),
    source: String(row.source),
    url: String(row.url),
    publishedAt: new Date(String(row.published_at)).toISOString(),
    symbols: Array.isArray(row.symbols) ? row.symbols.map(String) : [],
    sentiment: row.sentiment as NewsArticle["sentiment"],
  };
}

export async function getStocks(): Promise<Stock[]> {
  const db = database();
  if (!db) return sampleStocks;
  const result = await db.query("SELECT * FROM stocks ORDER BY market_cap DESC");
  return result.rows.map(mapStock);
}

export async function getStock(symbol: string): Promise<Stock | null> {
  const db = database();
  if (!db) return sampleStocks.find((stock) => stock.symbol === symbol) ?? null;
  const result = await db.query("SELECT * FROM stocks WHERE symbol = $1", [symbol]);
  return result.rows[0] ? mapStock(result.rows[0]) : null;
}

export async function getPrices(symbol: string): Promise<PricePoint[]> {
  const db = database();
  if (!db) return samplePrices[symbol] ?? [];
  const result = await db.query(
    "SELECT date, open, high, low, close, volume FROM price_history WHERE symbol = $1 ORDER BY date",
    [symbol],
  );
  return result.rows.map(mapPrice);
}

export async function getNews(symbol?: string, limit = 20): Promise<NewsArticle[]> {
  const db = database();
  if (!db) {
    const articles = symbol
      ? sampleNews.filter((article) => article.symbols.includes(symbol))
      : sampleNews;
    return articles.slice(0, limit);
  }
  const result = symbol
    ? await db.query(
        "SELECT * FROM news_articles WHERE $1 = ANY(symbols) ORDER BY published_at DESC LIMIT $2",
        [symbol, limit],
      )
    : await db.query("SELECT * FROM news_articles ORDER BY published_at DESC LIMIT $1", [limit]);
  return result.rows.map(mapNews);
}

export async function getDashboard() {
  const [stocks, news] = await Promise.all([getStocks(), getNews(undefined, 5)]);
  const leaders = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  return {
    stocks,
    news,
    gainers: leaders.slice(0, 3),
    losers: leaders.slice(-3).reverse(),
    averageChange: stocks.length
      ? stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length
      : 0,
  };
}
