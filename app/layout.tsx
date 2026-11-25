import type { Metadata } from "next";
import { Sidebar } from "./_components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Market Pulse", template: "%s | Market Pulse" },
  description: "ศูนย์รวมข่าวและข้อมูลหุ้นสำคัญแบบไม่ต้องสมัครสมาชิก",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content" id="main-content">
            <header className="topbar">
              <div><span className="eyebrow">MARKET INTELLIGENCE</span><strong>Global equities · News · Analytics</strong></div>
              <span className="data-badge"><i />{process.env.DATABASE_URL || process.env.PGHOST ? "LIVE DATABASE" : "DEMO FEED"}</span>
            </header>
            {children}
            <footer>ข้อมูลเพื่อการศึกษา ไม่ใช่คำแนะนำในการลงทุน · ข่าวเชื่อมกลับไปยังแหล่งต้นฉบับ</footer>
          </main>
        </div>
      </body>
    </html>
  );
}
