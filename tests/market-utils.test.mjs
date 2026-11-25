import assert from "node:assert/strict";
import test from "node:test";
import { clampLimit, isValidSymbol, normalizeSymbol } from "../lib/market-utils.js";
import { summarizeMarket, technicalSummary } from "../lib/market-analytics.js";
import { inferSymbols, parseAlphaVantageDaily, parseGdeltDate, parseSyncMode } from "../lib/sync-utils.mjs";

test("normalizes and validates stock symbols", () => {
  assert.equal(normalizeSymbol(" aapl "), "AAPL");
  assert.equal(isValidSymbol("brk.b"), true);
  assert.equal(isValidSymbol("bad symbol"), false);
});

test("keeps API limits inside the safe range", () => {
  assert.equal(clampLimit("0"), 1);
  assert.equal(clampLimit("999"), 100);
  assert.equal(clampLimit("nope", 12), 12);
});

test("parses provider payloads at the data boundary", () => {
  const points = parseAlphaVantageDaily({ "Time Series (Daily)": { "2026-11-25": { "1. open": "10", "2. high": "12", "3. low": "9", "4. close": "11.5", "5. volume": "800" } } });
  assert.deepEqual(points[0], { date: "2026-11-25", open: 10, high: 12, low: 9, close: 11.5, volume: 800 });
  assert.equal(parseGdeltDate("20261125T073000Z"), "2026-11-25T07:30:00Z");
  assert.equal(parseGdeltDate("bad"), null);
});

test("matches news to known companies without guessing unknown symbols", () => {
  const stocks = [{ symbol: "AAPL", name: "Apple Inc." }, { symbol: "MSFT", name: "Microsoft Corp." }];
  assert.deepEqual(inferSymbols("Apple expands AI partnership", stocks), ["AAPL"]);
  assert.deepEqual(inferSymbols("Markets close higher", stocks), []);
});

test("accepts only supported sync modes", () => {
  assert.equal(parseSyncMode("news"), "news");
  assert.equal(parseSyncMode(undefined), "all");
  assert.throws(() => parseSyncMode("realtime"), /SYNC_MODE/);
});

test("summarizes breadth, sectors and technical price data", () => {
  const market = summarizeMarket([
    { sector: "Tech", changePercent: 2, volume: 100 },
    { sector: "Tech", changePercent: -1, volume: 200 },
    { sector: "Energy", changePercent: 3, volume: 50 },
  ]);
  assert.equal(market.advancers, 2);
  assert.equal(market.decliners, 1);
  assert.equal(market.totalVolume, 350);
  assert.equal(market.sectors[0].name, "Energy");

  const technical = technicalSummary([
    { close: 10, high: 11, low: 9, volume: 100 },
    { close: 11, high: 12, low: 10, volume: 200 },
  ]);
  assert.equal(technical.periodHigh, 12);
  assert.equal(technical.periodLow, 9);
  assert.equal(technical.periodReturn, 10);
  assert.equal(technical.averageVolume, 150);
});
