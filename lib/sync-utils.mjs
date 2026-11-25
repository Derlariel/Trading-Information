export function parseAlphaVantageDaily(payload) {
  const series = payload?.["Time Series (Daily)"];
  if (!series || typeof series !== "object") {
    const message = payload?.Note || payload?.Information || payload?.["Error Message"] || "Invalid Alpha Vantage response";
    throw new Error(String(message));
  }
  return Object.entries(series).map(([date, values]) => ({
    date,
    open: Number(values["1. open"]),
    high: Number(values["2. high"]),
    low: Number(values["3. low"]),
    close: Number(values["4. close"]),
    volume: Number(values["5. volume"]),
  })).filter((point) => /^\d{4}-\d{2}-\d{2}$/.test(point.date)
    && [point.open, point.high, point.low, point.close, point.volume].every(Number.isFinite))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function parseGdeltDate(value) {
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(value ?? "");
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

export function inferSymbols(title, stocks) {
  const normalized = title.toUpperCase();
  return stocks.filter(({ symbol, name }) => {
    const company = name.replace(/\s+(INC\.?|CORP\.?|LTD\.?)$/i, "").toUpperCase();
    return new RegExp(`\\b${symbol.replace(".", "\\.")}\\b`).test(normalized) || normalized.includes(company);
  }).map(({ symbol }) => symbol);
}

export function parseSyncMode(value) {
  const mode = value || "all";
  if (["all", "news", "prices"].includes(mode)) return mode;
  throw new Error("SYNC_MODE must be all, news, or prices");
}
