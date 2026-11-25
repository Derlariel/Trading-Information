import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsFeed } from "../../_components/news-feed";
import { PriceChart } from "../../_components/price-chart";
import { formatCompact, formatPercent, formatPrice } from "@/lib/format";
import { getNews, getPrices, getStock } from "@/lib/repository";
import { isValidSymbol, normalizeSymbol } from "@/lib/market-utils.js";

type Props = { params: Promise<{ symbol: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const symbol = normalizeSymbol((await params).symbol);
  const stock = isValidSymbol(symbol) ? await getStock(symbol) : null;
  return { title: stock ? `${stock.symbol} · ${stock.name}` : "ไม่พบหุ้น" };
}

export default async function StockDetailPage({ params }: Props) {
  const symbol = normalizeSymbol((await params).symbol);
  if (!isValidSymbol(symbol)) notFound();
  const stock = await getStock(symbol);
  if (!stock) notFound();
  const [prices, news] = await Promise.all([getPrices(symbol), getNews(symbol, 10)]);

  return <div className="page-stack">
    <Link className="back-link" href="/stocks">← กลับไปหุ้นทั้งหมด</Link>
    <section className="stock-hero"><div><span className="ticker-large">{stock.symbol}</span><h1>{stock.name}</h1><p>{stock.exchange} · {stock.sector}</p></div><div className="quote"><strong>{formatPrice(stock.price, stock.currency)}</strong><span className={stock.changePercent >= 0 ? "positive" : "negative"}>{stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} · {formatPercent(stock.changePercent)}</span></div></section>
    <section className="detail-grid"><div className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">PRICE HISTORY</span><h2>ราคาย้อนหลัง</h2></div><span className="time-pill">13 วัน</span></div><PriceChart data={prices} symbol={stock.symbol} /></div><aside className="panel facts"><div><span>มูลค่าตลาด</span><strong>${formatCompact(stock.marketCap)}</strong></div><div><span>ปริมาณซื้อขาย</span><strong>{formatCompact(stock.volume)}</strong></div><div><span>ตลาด</span><strong>{stock.exchange}</strong></div><div><span>สกุลเงิน</span><strong>{stock.currency}</strong></div></aside></section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">RELATED NEWS</span><h2>ข่าวที่เกี่ยวข้องกับ {stock.symbol}</h2></div></div>{news.length ? <NewsFeed articles={news} /> : <div className="empty-state">ยังไม่มีข่าวที่เกี่ยวข้อง</div>}</section>
  </div>;
}
