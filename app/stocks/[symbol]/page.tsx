import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsFeed } from "../../_components/news-feed";
import { PriceChart } from "../../_components/price-chart";
import { formatCompact, formatPercent, formatPrice } from "@/lib/format";
import { technicalSummary } from "@/lib/market-analytics.js";
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
  const technical = technicalSummary(prices);

  return <div className="page-stack">
    <Link className="back-link" href="/stocks">← กลับไปหุ้นทั้งหมด</Link>
    <section className="stock-hero"><div><span className="ticker-large">{stock.symbol}</span><h1>{stock.name}</h1><p>{stock.exchange} · {stock.sector}</p></div><div className="quote"><strong>{formatPrice(stock.price, stock.currency)}</strong><span className={stock.changePercent >= 0 ? "positive" : "negative"}>{stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} · {formatPercent(stock.changePercent)}</span></div></section>
    <section className="detail-grid"><div className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">PRICE & VOLUME</span><h2>ราคาและปริมาณย้อนหลัง</h2></div><span className="time-pill">{prices.length} Sessions</span></div><PriceChart data={prices} symbol={stock.symbol} /></div><aside className="panel facts terminal-facts"><div><span>มูลค่าตลาด</span><strong>${formatCompact(stock.marketCap)}</strong></div><div><span>ปริมาณวันนี้</span><strong>{formatCompact(stock.volume)}</strong></div><div><span>ตลาด</span><strong>{stock.exchange}</strong></div><div><span>กลุ่มอุตสาหกรรม</span><strong>{stock.sector}</strong></div>{technical && <><div><span>ช่วงสูง / ต่ำ</span><strong>{technical.periodHigh.toFixed(2)} / {technical.periodLow.toFixed(2)}</strong></div><div><span>ผลตอบแทนช่วงนี้</span><strong className={technical.periodReturn >= 0 ? "positive" : "negative"}>{formatPercent(technical.periodReturn)}</strong></div><div><span>SMA 5 / SMA 10</span><strong>{technical.sma5.toFixed(2)} / {technical.sma10.toFixed(2)}</strong></div><div><span>Technical Signal</span><strong className={`signal ${technical.signal}`}>{technical.signal.toUpperCase()}</strong></div><div><span>ปริมาณเฉลี่ย</span><strong>{formatCompact(technical.averageVolume)}</strong></div><div><span>สกุลเงิน</span><strong>{stock.currency}</strong></div></>}</aside></section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">RELATED NEWS</span><h2>ข่าวที่เกี่ยวข้องกับ {stock.symbol}</h2></div></div>{news.length ? <NewsFeed articles={news} /> : <div className="empty-state">ยังไม่มีข่าวที่เกี่ยวข้อง</div>}</section>
  </div>;
}
