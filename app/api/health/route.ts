import { getDatabaseStatus } from "@/lib/repository";

export async function GET() {
  try {
    return Response.json({ status: "ok", database: await getDatabaseStatus() });
  } catch {
    return Response.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}
