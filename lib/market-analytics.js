export function summarizeMarket(stocks) {
  const advancers = stocks.filter((stock) => stock.changePercent > 0).length;
  const decliners = stocks.filter((stock) => stock.changePercent < 0).length;
  const unchanged = stocks.length - advancers - decliners;
  const sectors = Object.values(stocks.reduce((groups, stock) => {
    const group = groups[stock.sector] ??= { name: stock.sector, change: 0, count: 0 };
    group.change += stock.changePercent;
    group.count += 1;
    return groups;
  }, {})).map((sector) => ({ ...sector, change: sector.change / sector.count }))
    .sort((a, b) => b.change - a.change);

  return {
    advancers,
    decliners,
    unchanged,
    breadth: stocks.length ? (advancers / stocks.length) * 100 : 0,
    totalVolume: stocks.reduce((sum, stock) => sum + stock.volume, 0),
    averageChange: stocks.length
      ? stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length
      : 0,
    sectors,
  };
}

export function technicalSummary(prices) {
  if (!prices.length) return null;
  const closes = prices.map((point) => point.close);
  const recent = (days) => closes.slice(-Math.min(days, closes.length));
  const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const sma5 = average(recent(5));
  const sma10 = average(recent(10));
  const latest = prices.at(-1);
  const periodHigh = Math.max(...prices.map((point) => point.high));
  const periodLow = Math.min(...prices.map((point) => point.low));

  return {
    latest,
    sma5,
    sma10,
    periodHigh,
    periodLow,
    periodReturn: ((latest.close - closes[0]) / closes[0]) * 100,
    averageVolume: average(prices.map((point) => point.volume)),
    signal: latest.close > sma5 && sma5 > sma10 ? "bullish" : latest.close < sma5 && sma5 < sma10 ? "bearish" : "neutral",
  };
}
