import { getNews } from "@/lib/repository";
import { clampLimit, isValidSymbol, normalizeSymbol } from "@/lib/market-utils.js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawSymbol = url.searchParams.get("symbol");
  const symbol = rawSymbol ? normalizeSymbol(rawSymbol) : undefined;
  if (symbol && !isValidSymbol(symbol)) {
    return Response.json({ error: "Invalid stock symbol" }, { status: 400 });
  }
  const limit = clampLimit(url.searchParams.get("limit"), 20);
  return Response.json(
    { articles: await getNews(symbol, limit) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
