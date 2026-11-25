# Deploy บน `judy-sre-2026`

## 1. ส่ง source code จากเครื่องพัฒนา

รันจากโฟลเดอร์ที่อยู่เหนือ `trading_information`:

```bash
rsync -az \
  --exclude node_modules \
  --exclude .next \
  --exclude .env \
  trading_information/ judygodsre@10.13.104.148:~/market-pulse/
```

## 2. ตั้งค่าและเปิดระบบบน Server

```bash
ssh judygodsre@10.13.104.148
cd ~/market-pulse
cp .env.production.example .env.production
openssl rand -hex 24
nano .env.production
docker compose --env-file .env.production -f compose.production.yml up -d --build
docker compose --env-file .env.production -f compose.production.yml ps
curl http://127.0.0.1/api/health
```

นำค่าจาก `openssl rand -hex 24` ไปใส่หลัง `POSTGRES_PASSWORD=` ใน `.env.production` หากเข้าผ่าน IP ภายในให้ใช้ `SITE_ADDRESS=http://10.13.104.148` ระบบจะไม่ยอมเริ่มหากยังไม่กำหนดรหัสผ่าน

เมื่อ health check ผ่านแล้วจึงเปิด firewall:

```bash
sudo ufw allow 80/tcp
```

หากเปลี่ยนเป็น domain ให้แก้ `SITE_ADDRESS` เป็นชื่อ domain, ชี้ DNS มาที่ Server และเปิด HTTPS เพิ่ม:

```bash
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
docker compose --env-file .env.production -f compose.production.yml up -d
```

## 3. Sync ข้อมูลจริง

ใส่ Alpha Vantage key ฟรีใน `.env.production` แล้วสั่ง:

```bash
docker compose --env-file .env.production -f compose.production.yml --profile tools run --rm sync
```

สำหรับข่าวใกล้ real-time ให้เปิด Cron บน Server:

```bash
crontab -e
```

เพิ่มบรรทัดนี้เพื่อดึงเฉพาะข่าวทุก 15 นาทีโดยไม่ใช้โควตาราคา Alpha Vantage:

```cron
*/15 * * * * cd /home/judygodsre/market-pulse && SYNC_MODE=news /usr/bin/docker compose --env-file .env.production -f compose.production.yml --profile tools run --rm sync 2>&1 | /usr/bin/logger -t market-pulse-sync
```

ตรวจ log ได้ด้วย:

```bash
journalctl -t market-pulse-sync -n 100 --no-pager
```

## คำสั่งดูสถานะ

```bash
docker compose --env-file .env.production -f compose.production.yml ps
docker compose --env-file .env.production -f compose.production.yml logs --tail=100 app caddy db
```

PostgreSQL ไม่มี `ports` จึงเข้าถึงได้เฉพาะ container ภายใน Compose network และไม่ชน Grafana ที่ใช้พอร์ต 3000 บน host
