INSERT INTO stocks (symbol, name, exchange, sector, price, change, change_percent, market_cap, volume) VALUES
  ('META', 'Meta Platforms Inc.', 'NASDAQ', 'Communication', 642.18, 7.44, 1.17, 1620000000000, 21600000),
  ('AVGO', 'Broadcom Inc.', 'NASDAQ', 'Semiconductors', 356.42, 6.12, 1.75, 1670000000000, 28900000),
  ('AMD', 'Advanced Micro Devices', 'NASDAQ', 'Semiconductors', 214.73, -1.82, -0.84, 348000000000, 63200000),
  ('NFLX', 'Netflix Inc.', 'NASDAQ', 'Communication', 118.64, 1.06, 0.90, 505000000000, 34100000),
  ('JPM', 'JPMorgan Chase & Co.', 'NYSE', 'Financials', 294.31, -0.76, -0.26, 809000000000, 12800000),
  ('V', 'Visa Inc.', 'NYSE', 'Financials', 371.26, 2.08, 0.56, 712000000000, 7900000),
  ('WMT', 'Walmart Inc.', 'NYSE', 'Consumer', 116.82, 0.68, 0.59, 932000000000, 17800000),
  ('COST', 'Costco Wholesale Corp.', 'NASDAQ', 'Consumer', 992.44, -4.20, -0.42, 440000000000, 2100000),
  ('XOM', 'Exxon Mobil Corp.', 'NYSE', 'Energy', 128.16, 1.43, 1.13, 548000000000, 19700000),
  ('LLY', 'Eli Lilly and Co.', 'NYSE', 'Healthcare', 1048.20, 12.36, 1.19, 994000000000, 4800000),
  ('UNH', 'UnitedHealth Group Inc.', 'NYSE', 'Healthcare', 352.78, -7.14, -1.98, 323000000000, 9600000),
  ('KO', 'The Coca-Cola Co.', 'NYSE', 'Consumer', 74.58, 0.12, 0.16, 321000000000, 13500000)
ON CONFLICT (symbol) DO UPDATE SET
  name=EXCLUDED.name, exchange=EXCLUDED.exchange, sector=EXCLUDED.sector,
  price=EXCLUDED.price, change=EXCLUDED.change, change_percent=EXCLUDED.change_percent,
  market_cap=EXCLUDED.market_cap, volume=EXCLUDED.volume;

INSERT INTO price_history (symbol, date, open, high, low, close, volume)
SELECT stock.symbol,
       date '2026-11-07' + series.day,
       stock.start_price + series.day * stock.step - 1.2,
       stock.start_price + series.day * stock.step + 2.1,
       stock.start_price + series.day * stock.step - 2.4,
       stock.start_price + series.day * stock.step,
       20000000 + series.day * 1750000
FROM (VALUES
  ('META', 600.0, 3.50), ('AVGO', 330.0, 2.20), ('AMD', 205.0, 0.81),
  ('NFLX', 110.0, 0.72), ('JPM', 280.0, 1.19), ('V', 356.0, 1.27),
  ('WMT', 110.0, 0.57), ('COST', 1010.0, -1.46), ('XOM', 121.0, 0.60),
  ('LLY', 980.0, 5.68), ('UNH', 390.0, -3.10), ('KO', 72.0, 0.22)
) AS stock(symbol, start_price, step)
CROSS JOIN generate_series(0, 12) AS series(day)
ON CONFLICT (symbol, date) DO NOTHING;
