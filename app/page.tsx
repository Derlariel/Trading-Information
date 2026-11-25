import Link from "next/link";
import { NewsFeed } from "./_components/news-feed";
import { PriceChart } from "./_components/price-chart";
import { StockTable } from "./_components/stock-table";
import { formatCompact, formatPercent } from "@/lib/format";
import { getDashboard, getPrices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [{ stocks, news, gainers, averageChange }, prices] = await Promise.all([getDashboard(), getPrices("AAPL")]);
  const positiveCount = stocks.filter((stock) => stock.changePercent >= 0).length;

  return <div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow">OVERVIEW</span><h1>ภาพรวมตลาด</h1><p>ติดตามหุ้นสำคัญ แนวโน้มราคา และข่าวที่ขับเคลื่อนตลาดในหน้าเดียว</p></div><div className="market-open"><span /><div><small>อัปเดตล่าสุด</small><strong>25 พ.ย. 2569 · 14:30 น.</strong></div></div></section>
    <section className="kpi-grid" aria-label="สรุปตลาด">
      <article><span>ค่าเฉลี่ยวันนี้</span><strong className={averageChange >= 0 ? "positive" : "negative"}>{formatPercent(averageChange)}</strong><small>จากหุ้นที่ติดตามทั้งหมด</small></article>
      <article><span>หุ้นที่ติดตาม</span><strong>{stocks.length}</strong><small>บริษัทชั้นนำใน NASDAQ</small></article>
      <article><span>ปิดบวก</span><strong>{positiveCount}<small> / {stocks.length}</small></strong><small>แรงซื้อกระจายในกลุ่มเทคโนโลยี</small></article>
      <article><span>ปริมาณรวม</span><strong>{formatCompact(stocks.reduce((sum, stock) => sum + stock.volume, 0))}</strong><small>หุ้นที่มีการซื้อขาย</small></article>
    </section>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">MARKET TREND</span><h2>AAPL · แนวโน้ม 13 วัน</h2></div><Link href="/stocks/AAPL">ดูรายละเอียด</Link></div><PriceChart data={prices} symbol="AAPL" /></section>
      <aside className="panel movers-panel"><div className="panel-heading"><div><span className="eyebrow">TOP MOVERS</span><h2>โดดเด่นวันนี้</h2></div></div><div className="mover-list">{gainers.map((stock, index) => <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}><span className="rank">0{index + 1}</span><span><strong>{stock.symbol}</strong><small>{stock.name}</small></span><b className="positive">{formatPercent(stock.changePercent)}</b></Link>)}</div></aside>
    </div>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">WATCHLIST</span><h2>หุ้นสำคัญ</h2></div><Link href="/stocks">ดูทั้งหมด</Link></div><StockTable stocks={stocks.slice(0, 5)} /></section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">LATEST NEWS</span><h2>ข่าวล่าสุด</h2></div><Link href="/news">ข่าวทั้งหมด</Link></div><NewsFeed articles={news} /></section>
  </div>;
}
