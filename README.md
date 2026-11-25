# Market Pulse

เว็บรวมข่าวและข้อมูลหุ้นแบบไม่ต้องสมัครสมาชิก มี Dashboard, รายการหุ้น, กราฟราคา, ข่าวที่เกี่ยวข้อง, Backend API และ PostgreSQL schema ในโปรเจกต์เดียว

Dashboard แบบ financial terminal แสดงหุ้น 18 ตัวจาก NASDAQ/NYSE, market breadth, sector performance, gainers/losers, volume leaders และ technical summary จากราคา OHLC โดยไม่ใช้บริการเสียเงินเพิ่ม

## เริ่มใช้งานแบบเร็ว

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000` แอปจะใช้ข้อมูลตัวอย่างในตัวทันทีเมื่อไม่มี `DATABASE_URL`

## ใช้ PostgreSQL

```bash
docker compose up -d db
cp .env.example .env
npm run dev
```

ฐานข้อมูลจะสร้างตารางและข้อมูลตัวอย่างจาก `db/init.sql` ในครั้งแรก หากเคยสร้าง volume แล้วและต้องการเริ่มข้อมูลใหม่ ให้ลบ volume ด้วยตนเองหลังสำรองข้อมูลที่ต้องการเก็บ

## คำสั่งตรวจสอบ

```bash
npm test
npm run typecheck
npm run build
```

## Backend API

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/stocks`
- `GET /api/stocks/:symbol`
- `GET /api/news?symbol=AAPL&limit=20`

## อัปเดตข้อมูลจริงด้วยแหล่งข้อมูลฟรี

ใส่ `ALPHA_VANTAGE_API_KEY` ใน `.env` แล้วรัน:

```bash
npm run sync
```

คำสั่งนี้ดึงราคาสิ้นวันจาก Alpha Vantage และ metadata ข่าวจาก GDELT ลง PostgreSQL ควรรันไม่เกินวันละครั้งเพื่ออยู่ในโควตาฟรี ข่าวจะเก็บเฉพาะหัวข้อ แหล่งข่าว เวลา และ URL ไม่คัดลอกบทความเต็ม

ตั้ง `SYNC_MODE=news` เพื่อดึงเฉพาะข่าวได้บ่อยโดยไม่ใช้โควตาราคา หน้าข่าวตรวจข้อมูลใหม่จาก Backend ทุก 60 วินาที ส่วนขั้นตอน Cron ทุก 15 นาทีอยู่ใน [DEPLOY.md](./DEPLOY.md)

ข้อมูลในโปรเจกต์เป็นข้อมูลเพื่อการศึกษาและไม่ใช่คำแนะนำในการลงทุน

## Deploy

ขั้นตอนสำหรับ Ubuntu Server อยู่ใน [DEPLOY.md](./DEPLOY.md) โดย production stack ไม่เปิดพอร์ต Next.js หรือ PostgreSQL ออกสู่ host และไม่ชนกับ Grafana ที่พอร์ต 3000
