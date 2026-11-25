"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatThaiDate } from "@/lib/format";
import type { NewsArticle } from "@/lib/types";

const filters = [
  { value: "all", label: "ทั้งหมด" },
  { value: "positive", label: "เชิงบวก" },
  { value: "neutral", label: "เป็นกลาง" },
  { value: "negative", label: "เชิงลบ" },
];

export function NewsFeed({ articles, controls = false, live = false }: { articles: NewsArticle[]; controls?: boolean; live?: boolean }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [currentArticles, setCurrentArticles] = useState(articles);
  const [announcement, setAnnouncement] = useState("");
  const articleIds = useRef(new Set(articles.map((article) => article.id)));

  useEffect(() => {
    if (!live) return;
    const refresh = async () => {
      try {
        const response = await fetch("/api/news?limit=50", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data.articles)) return;
        const newCount = data.articles.filter((article: NewsArticle) => !articleIds.current.has(article.id)).length;
        articleIds.current = new Set(data.articles.map((article: NewsArticle) => article.id));
        setCurrentArticles(data.articles);
        if (newCount) setAnnouncement(`มีข่าวใหม่ ${newCount} รายการ`);
      } catch {
        // The next interval retries automatically without hiding the current news.
      }
    };
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [live]);

  const visible = useMemo(() => currentArticles.filter((article) => {
    const sentimentMatch = filter === "all" || article.sentiment === filter;
    const haystack = `${article.title} ${article.summary} ${article.symbols.join(" ")}`.toLowerCase();
    return sentimentMatch && haystack.includes(query.trim().toLowerCase());
  }), [currentArticles, filter, query]);

  return (
    <div>
      {controls && <div className="news-controls">
        <label className="search-field"><span>ค้นหาข่าว</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="หัวข้อข่าวหรือ Symbol" /></label>
        <div className="filter-group" aria-label="กรองตามมุมมองของข่าว">
          {filters.map((item) => <button aria-pressed={filter === item.value} className={filter === item.value ? "active" : ""} key={item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}
        </div>
      </div>}
      {live && <div className="live-status"><span aria-hidden="true"><i /> NEAR LIVE · ตรวจข่าวใหม่ทุก 60 วินาที</span><span className="sr-only" role="status" aria-atomic="true">{announcement}</span></div>}
      <div className="news-list">
        {visible.map((article) => <article className="news-item" key={article.id}>
          <div className={`sentiment-marker ${article.sentiment}`} aria-hidden="true" />
          <div>
            <div className="news-meta"><span>{article.source}</span><span className={`sentiment-label ${article.sentiment}`}>{filters.find((item) => item.value === article.sentiment)?.label}</span><time dateTime={article.publishedAt}>{formatThaiDate(article.publishedAt)}</time></div>
            <h3><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h3>
            <p>{article.summary}</p>
            <div className="symbol-list">{article.symbols.map((symbol) => <a href={`/stocks/${symbol}`} key={symbol}>{symbol}</a>)}</div>
          </div>
        </article>)}
      </div>
      {!visible.length && <div className="empty-state">ไม่พบข่าวตามตัวกรองนี้</div>}
    </div>
  );
}
