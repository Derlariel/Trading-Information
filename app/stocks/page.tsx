import type { Metadata } from "next";
import { StockTable } from "../_components/stock-table";
import { getStocks } from "@/lib/repository";

export const metadata: Metadata = { title: "หุ้นทั้งหมด" };
export const dynamic = "force-dynamic";

export default async function StocksPage() {
  const stocks = await getStocks();
  return <div className="page-stack"><section className="page-heading"><div><span className="eyebrow">STOCK DIRECTORY</span><h1>หุ้นทั้งหมด</h1><p>ค้นหาและเปรียบเทียบหุ้นสำคัญจากราคา มูลค่าตลาด และปริมาณซื้อขาย</p></div></section><section className="panel"><StockTable stocks={stocks} searchable /></section></div>;
}
