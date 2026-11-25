"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCompact, formatPercent, formatPrice } from "@/lib/format";
import type { Stock } from "@/lib/types";

export function StockTable({ stocks, searchable = false }: { stocks: Stock[]; searchable?: boolean }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? stocks.filter((stock) => `${stock.symbol} ${stock.name} ${stock.sector}`.toLowerCase().includes(normalized))
      : stocks;
  }, [query, stocks]);

  return (
    <div>
      {searchable && (
        <label className="search-field">
          <span>ค้นหาหุ้น</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ชื่อบริษัทหรือ Symbol" />
        </label>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>บริษัท</th><th>ราคา</th><th>เปลี่ยนแปลง</th><th>มูลค่าตลาด</th><th>ปริมาณซื้อขาย</th></tr></thead>
          <tbody>
            {visible.map((stock) => (
              <tr key={stock.symbol}>
                <td><Link className="stock-name" href={`/stocks/${stock.symbol}`}><span className="ticker-badge">{stock.symbol}</span><span><strong>{stock.name}</strong><small>{stock.exchange} · {stock.sector}</small></span></Link></td>
                <td className="number">{formatPrice(stock.price, stock.currency)}</td>
                <td><span className={stock.changePercent >= 0 ? "change-pill positive-bg" : "change-pill negative-bg"}>{formatPercent(stock.changePercent)}</span></td>
                <td className="number">${formatCompact(stock.marketCap)}</td>
                <td className="number">{formatCompact(stock.volume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!visible.length && <div className="empty-state">ไม่พบหุ้นที่ตรงกับ “{query}”</div>}
    </div>
  );
}
