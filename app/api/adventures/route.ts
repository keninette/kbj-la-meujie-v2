import { getAdventureService } from "@lib/registry";
import { NextResponse } from "next/server";

export async function GET() {
  const adventures = await getAdventureService().getAll();

  return NextResponse.json(adventures);
}
