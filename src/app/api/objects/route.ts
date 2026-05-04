import { NextResponse } from "next/server";
import { getShopItems } from "@/lib/deadlock-api";

export async function GET() {
  const items = await getShopItems();

  return NextResponse.json(items);
}
