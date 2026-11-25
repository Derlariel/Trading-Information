"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Market overview" },
  { href: "/stocks", label: "Markets" },
  { href: "/news", label: "News flow" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="Market Pulse หน้าแรก">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span><strong>MARKET PULSE</strong><small>FINANCIAL TERMINAL</small></span>
      </Link>
      <nav aria-label="เมนูหลัก">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return <Link className={active ? "nav-link active" : "nav-link"} href={item.href} key={item.href}>{item.label}</Link>;
        })}
      </nav>
      <div className="sidebar-note">
        <span className="status-dot" />
        <div><strong>DATA FEED ONLINE</strong><small>US equities · EOD</small></div>
      </div>
    </aside>
  );
}
