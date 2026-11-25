import { getStocks } from "@/lib/repository";

export async function GET() {
  return Response.json({ stocks: await getStocks() });
}
