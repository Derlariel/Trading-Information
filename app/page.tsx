import Link from "next/link";
import { NewsFeed } from "./_components/news-feed";
import { PriceChart } from "./_components/price-chart";
import { StockTable } from "./_components/stock-table";
import { formatCompact, formatPercent, formatPrice } from "@/lib/format";
import { getDashboard, getPrices } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [{ stocks, news, gainers, losers, volumeLeaders, averageChange, advancers, decliners, unchanged, totalVolume, sectors }, prices] = await Promise.all([
    getDashboard(),
    getPrices("AAPL"),
  ]);
  const breadth = stocks.length ? (advancers / stocks.length) * 100 : 0;

  return <>
    <section className="market-tape" aria-label="ราคาหุ้นล่าสุด">
      {stocks.slice(0, 12).map((stock) => <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}>
        <strong>{stock.symbol}</strong><span>{stock.price.toFixed(2)}</span><b className={stock.changePercent >= 0 ? "positive" : "negative"}>{formatPercent(stock.changePercent)}</b>
      </Link>)}
    </section>
    <div className="page-stack terminal-page">
      <section className="page-heading terminal-heading">
        <div><span className="eyebrow">MARKET OVERVIEW</span><h1>ศูนย์ติดตามตลาด</h1><p>ราคา ข่าว ปริมาณซื้อขาย และสัญญาณตลาดสำคัญในหน้าจอเดียว</p></div>
        <div className="market-open"><span /><div><small>US MARKET</small><strong>ข้อมูลล่าสุด · {stocks.length} สินทรัพย์</strong></div></div>
      </section>

      <section className="kpi-grid terminal-kpis" aria-label="สรุปตลาด">
        <article><span>MARKET PULSE</span><strong className={averageChange >= 0 ? "positive" : "negative"}>{formatPercent(averageChange)}</strong><small>ค่าเฉลี่ยการเปลี่ยนแปลงวันนี้</small></article>
        <article><span>ADVANCE / DECLINE</span><strong><i className="positive">{advancers}</i><em> / </em><i className="negative">{decliners}</i></strong><small>{unchanged} ไม่เปลี่ยนแปลง · Breadth {breadth.toFixed(0)}%</small></article>
        <article><span>TOTAL VOLUME</span><strong>{formatCompact(totalVolume)}</strong><small>ปริมาณซื้อขายรวมใน watchlist</small></article>
        <article><span>MARKET COVERAGE</span><strong>{sectors.length}</strong><small>กลุ่มอุตสาหกรรม · NASDAQ และ NYSE</small></article>
      </section>

      <div className="terminal-grid">
        <section className="panel chart-panel terminal-chart">
          <div className="panel-heading"><div><span className="eyebrow">AAPL · NASDAQ</span><h2>Apple Inc. <b className="quote-inline">{formatPrice(stocks.find((stock) => stock.symbol === "AAPL")?.price ?? 0, "USD")}</b></h2></div><div className="chart-actions"><span className="active">1M</span><Link href="/stocks/AAPL">รายละเอียด</Link></div></div>
          <PriceChart data={prices} symbol="AAPL" />
        </section>
        <aside className="panel movers-terminal">
          <div className="panel-heading"><div><span className="eyebrow">MARKET MOVERS</span><h2>เคลื่อนไหวเด่น</h2></div></div>
          <div className="mover-columns">
            <div><h3>GAINERS</h3>{gainers.slice(0, 4).map((stock) => <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}><span><strong>{stock.symbol}</strong><small>{stock.price.toFixed(2)}</small></span><b className="positive">{formatPercent(stock.changePercent)}</b></Link>)}</div>
            <div><h3>LOSERS</h3>{losers.slice(0, 4).map((stock) => <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}><span><strong>{stock.symbol}</strong><small>{stock.price.toFixed(2)}</small></span><b className="negative">{formatPercent(stock.changePercent)}</b></Link>)}</div>
          </div>
        </aside>
      </div>

      <div className="terminal-grid lower-grid">
        <section className="panel sector-panel">
          <div className="panel-heading"><div><span className="eyebrow">SECTOR PERFORMANCE</span><h2>ภาพรวมรายอุตสาหกรรม</h2></div></div>
          <div className="sector-grid">{sectors.sort((a, b) => b.change - a.change).map((sector) => {
            const change = sector.change / sector.count;
            return <div className={change >= 0 ? "sector-tile gain" : "sector-tile loss"} key={sector.name}><span>{sector.name}</span><strong>{formatPercent(change)}</strong><small>{sector.count} symbols</small></div>;
          })}</div>
        </section>
        <section className="panel volume-panel">
          <div className="panel-heading"><div><span className="eyebrow">VOLUME LEADERS</span><h2>ซื้อขายสูงสุด</h2></div></div>
          <div className="volume-list">{volumeLeaders.map((stock, index) => <Link href={`/stocks/${stock.symbol}`} key={stock.symbol}><span className="rank">{String(index + 1).padStart(2, "0")}</span><strong>{stock.symbol}</strong><span>{formatCompact(stock.volume)}</span><b className={stock.changePercent >= 0 ? "positive" : "negative"}>{formatPercent(stock.changePercent)}</b></Link>)}</div>
        </section>
      </div>

      <section className="panel watchlist-panel"><div className="panel-heading"><div><span className="eyebrow">MARKET WATCHLIST</span><h2>หุ้นสำคัญ</h2></div><Link href="/stocks">ดูทั้งหมด {stocks.length} รายการ</Link></div><StockTable stocks={stocks.slice(0, 10)} /></section>
      <section className="panel news-panel"><div className="panel-heading"><div><span className="eyebrow">LATEST NEWS</span><h2>ข่าวที่กำลังขับเคลื่อนตลาด</h2></div><Link href="/news">ข่าวทั้งหมด</Link></div><NewsFeed articles={news} /></section>
    </div>
  </>;
}
