import type { Metadata } from "next";
import { NewsFeed } from "../_components/news-feed";
import { getNews } from "@/lib/repository";

export const metadata: Metadata = { title: "ข่าวตลาด" };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await getNews(undefined, 50);
  return <div className="page-stack"><section className="page-heading"><div><span className="eyebrow">MARKET NEWS</span><h1>ข่าวตลาด</h1><p>ประเด็นสำคัญที่เชื่อมโยงกับหุ้น พร้อมแหล่งข่าวและเวลาเผยแพร่ชัดเจน</p></div></section><section className="panel"><NewsFeed articles={articles} controls live /></section></div>;
}
