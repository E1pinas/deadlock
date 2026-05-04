import { NextResponse } from "next/server";
import { getPlayableHeroes } from "@/lib/deadlock-api";

export async function GET() {
  const heroes = await getPlayableHeroes();

  return NextResponse.json(heroes);
}
