import { NextResponse } from "next/server";
import { heroes } from "@/data/heroes";;

export async function GET() {
  return NextResponse.json(heroes);
}
