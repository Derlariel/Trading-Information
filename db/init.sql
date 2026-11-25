CREATE TABLE stocks (
  symbol varchar(12) PRIMARY KEY,
  name text NOT NULL,
  exchange text NOT NULL,
  sector text NOT NULL,
  price numeric(14, 4) NOT NULL,
  change numeric(14, 4) NOT NULL,
  change_percent numeric(10, 4) NOT NULL,
  market_cap bigint NOT NULL,
  volume bigint NOT NULL,
  currency char(3) NOT NULL DEFAULT 'USD'
);

CREATE TABLE price_history (
  symbol varchar(12) NOT NULL REFERENCES stocks(symbol) ON DELETE CASCADE,
  date date NOT NULL,
  open numeric(14, 4) NOT NULL,
  high numeric(14, 4) NOT NULL,
  low numeric(14, 4) NOT NULL,
  close numeric(14, 4) NOT NULL,
  volume bigint NOT NULL,
  PRIMARY KEY (symbol, date)
);

CREATE TABLE news_articles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  source text NOT NULL,
  url text NOT NULL UNIQUE,
  published_at timestamptz NOT NULL,
  symbols text[] NOT NULL DEFAULT '{}',
  sentiment text NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative'))
);

CREATE INDEX news_published_at_idx ON news_articles (published_at DESC);
CREATE INDEX news_symbols_idx ON news_articles USING gin (symbols);

INSERT INTO stocks (symbol, name, exchange, sector, price, change, change_percent, market_cap, volume) VALUES
  ('AAPL', 'Apple Inc.', 'NASDAQ', 'Technology', 277.55, 3.25, 1.18, 4120000000000, 48200000),
  ('MSFT', 'Microsoft Corp.', 'NASDAQ', 'Technology', 486.74, -2.31, -0.47, 3620000000000, 18900000),
  ('NVDA', 'NVIDIA Corp.', 'NASDAQ', 'Semiconductors', 191.52, 4.86, 2.60, 4650000000000, 152400000),
  ('GOOGL', 'Alphabet Inc.', 'NASDAQ', 'Communication', 318.21, 0.94, 0.30, 3820000000000, 26100000),
  ('AMZN', 'Amazon.com Inc.', 'NASDAQ', 'Consumer', 227.04, -3.18, -1.38, 2420000000000, 41300000),
  ('TSLA', 'Tesla Inc.', 'NASDAQ', 'Automotive', 432.11, 8.72, 2.06, 1440000000000, 96800000);

INSERT INTO price_history (symbol, date, open, high, low, close, volume)
SELECT stock.symbol,
       date '2026-11-07' + series.day,
       stock.start_price + series.day * stock.step - 1.2,
       stock.start_price + series.day * stock.step + 2.1,
       stock.start_price + series.day * stock.step - 2.4,
       stock.start_price + series.day * stock.step,
       20000000 + series.day * 1750000
FROM (VALUES
  ('AAPL', 259.0, 1.55), ('MSFT', 472.0, 1.23), ('NVDA', 169.0, 1.88),
  ('GOOGL', 302.0, 1.35), ('AMZN', 238.0, -0.91), ('TSLA', 386.0, 3.84)
) AS stock(symbol, start_price, step)
CROSS JOIN generate_series(0, 12) AS series(day);

INSERT INTO news_articles (title, summary, source, url, published_at, symbols, sentiment) VALUES
  ('ผู้ผลิตชิปเร่งลงทุนโครงสร้างพื้นฐาน AI รับดีมานด์ปีหน้า', 'อุตสาหกรรมเซมิคอนดักเตอร์ยังได้รับแรงหนุนจากการลงทุนศูนย์ข้อมูลและระบบประมวลผล AI', 'Global Market Wire', 'https://www.gdeltproject.org/#ai-chip', '2026-11-25 07:30:00+00', ARRAY['NVDA','MSFT'], 'positive'),
  ('ตลาดจับตารายงานยอดขายช่วงวันหยุดของกลุ่มค้าปลีกสหรัฐฯ', 'นักลงทุนประเมินกำลังซื้อผู้บริโภคและทิศทางมาร์จินของแพลตฟอร์มอีคอมเมิร์ซรายใหญ่', 'Finance Daily', 'https://www.gdeltproject.org/#retail', '2026-11-25 05:15:00+00', ARRAY['AMZN'], 'neutral'),
  ('หุ้นเทคโนโลยีขนาดใหญ่ปรับตัวขึ้นก่อนประกาศข้อมูลเศรษฐกิจ', 'ดัชนีเทคโนโลยีได้แรงหนุนจากหุ้นซอฟต์แวร์ คลาวด์ และผู้ผลิตอุปกรณ์รายใหญ่', 'Market Brief', 'https://www.gdeltproject.org/#technology', '2026-11-25 03:45:00+00', ARRAY['AAPL','MSFT','GOOGL'], 'positive'),
  ('ผู้ผลิตรถยนต์ไฟฟ้าเผชิญการแข่งขันด้านราคาในตลาดโลก', 'การแข่งขันที่สูงขึ้นอาจกดดันอัตรากำไร แม้ยอดส่งมอบรถยนต์ไฟฟ้ายังคงเติบโต', 'Mobility Watch', 'https://www.gdeltproject.org/#ev', '2026-11-24 23:20:00+00', ARRAY['TSLA'], 'negative'),
  ('การใช้จ่ายด้านคลาวด์ยังเติบโตต่อเนื่องในองค์กรขนาดใหญ่', 'องค์กรให้ความสำคัญกับระบบ AI ความปลอดภัย และการย้ายข้อมูลขึ้นคลาวด์', 'Tech Economy', 'https://www.gdeltproject.org/#cloud', '2026-11-24 18:40:00+00', ARRAY['MSFT','AMZN','GOOGL'], 'positive'),
  ('นักลงทุนประเมินมูลค่าหุ้นเติบโตหลังผลตอบแทนพันธบัตรขยับ', 'การเปลี่ยนแปลงของอัตราผลตอบแทนพันธบัตรอาจเพิ่มความผันผวนให้หุ้นที่มีมูลค่าสูง', 'Capital Note', 'https://www.gdeltproject.org/#bonds', '2026-11-24 14:10:00+00', ARRAY['AAPL','NVDA','TSLA'], 'neutral');
