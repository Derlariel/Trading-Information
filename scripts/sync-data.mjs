import { Pool } from "pg";
import { getJson } from "../lib/https-json.mjs";
import { inferSymbols, parseAlphaVantageDaily, parseGdeltDate, parseSyncMode } from "../lib/sync-utils.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && !process.env.PGHOST) throw new Error("Database connection is required. Copy .env.example to .env first.");

const pool = new Pool(databaseUrl ? { connectionString: databaseUrl, max: 3 } : { max: 3 });
const symbols = (process.env.SYNC_SYMBOLS || "AAPL,MSFT,NVDA,GOOGL,AMZN,TSLA,META,AVGO,AMD,NFLX,JPM,V,WMT,COST,XOM,LLY,UNH,KO")
  .split(",").map((symbol) => symbol.trim().toUpperCase())
  .filter((symbol) => /^[A-Z0-9.-]{1,12}$/.test(symbol)).slice(0, 20);
const syncMode = parseSyncMode(process.env.SYNC_MODE);

async function syncPrices() {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) {
    console.log("Prices skipped: ALPHA_VANTAGE_API_KEY is not configured.");
    return;
  }

  for (const symbol of symbols) {
    const url = new URL("https://www.alphavantage.co/query");
    url.search = new URLSearchParams({ function: "TIME_SERIES_DAILY", symbol, outputsize: "compact", apikey: key }).toString();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Alpha Vantage ${response.status} for ${symbol}`);
    const points = parseAlphaVantageDaily(await response.json());
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const point of points) {
        await client.query(
          `INSERT INTO price_history (symbol, date, open, high, low, close, volume)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (symbol, date) DO UPDATE SET open=EXCLUDED.open, high=EXCLUDED.high,
             low=EXCLUDED.low, close=EXCLUDED.close, volume=EXCLUDED.volume`,
          [symbol, point.date, point.open, point.high, point.low, point.close, point.volume],
        );
      }
      const [latest, previous] = points;
      if (latest && previous) {
        const change = latest.close - previous.close;
        await client.query(
          `UPDATE stocks SET price=$2, change=$3, change_percent=$4, volume=$5 WHERE symbol=$1`,
          [symbol, latest.close, change, (change / previous.close) * 100, latest.volume],
        );
      }
      await client.query("COMMIT");
      console.log(`Prices synced: ${symbol} (${points.length} rows)`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

async function syncNews() {
  const result = await pool.query("SELECT symbol, name FROM stocks WHERE symbol = ANY($1)", [symbols]);
  const stocks = result.rows;
  const query = stocks.map((stock) => `\"${stock.name.replace(/\s+(Inc\.|Corp\.)$/i, "")}\"`).join(" OR ");
  const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
  url.search = new URLSearchParams({ query, mode: "artlist", maxrecords: "75", format: "json", sort: "datedesc" }).toString();
  const payload = await getJson(url, { headers: { "User-Agent": "MarketPulse/0.1 educational-project" } });
  let saved = 0;
  for (const article of payload.articles ?? []) {
    const publishedAt = parseGdeltDate(article.seendate);
    const related = inferSymbols(String(article.title ?? ""), stocks);
    if (!article.url || !article.title || !publishedAt || !related.length) continue;
    await pool.query(
      `INSERT INTO news_articles (title, summary, source, url, published_at, symbols, sentiment)
       VALUES ($1,$2,$3,$4,$5,$6,'neutral') ON CONFLICT (url) DO NOTHING`,
      [article.title, "อ่านรายละเอียดจากแหล่งข่าวต้นฉบับ", article.domain || "GDELT", article.url, publishedAt, related],
    );
    saved += 1;
  }
  console.log(`News synced: ${saved} matched articles`);
}

try {
  if (syncMode !== "news") await syncPrices();
  if (syncMode !== "prices") await syncNews();
} finally {
  await pool.end();
}
