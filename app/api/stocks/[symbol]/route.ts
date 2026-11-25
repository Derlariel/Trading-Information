import { getNews, getPrices, getStock } from "@/lib/repository";
import { isValidSymbol, normalizeSymbol } from "@/lib/market-utils.js";

type Context = { params: Promise<{ symbol: string }> };

export async function GET(_request: Request, { params }: Context) {
  const symbol = normalizeSymbol((await params).symbol);
  if (!isValidSymbol(symbol)) {
    return Response.json({ error: "Invalid stock symbol" }, { status: 400 });
  }
  const stock = await getStock(symbol);
  if (!stock) return Response.json({ error: "Stock not found" }, { status: 404 });
  const [prices, news] = await Promise.all([getPrices(symbol), getNews(symbol, 6)]);
  return Response.json({ stock, prices, news });
}
