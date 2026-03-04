import { NextResponse } from "next/server";
import { getUniverseService } from "@lib/registry";

export async function GET() {
  const universes = await getUniverseService().getAll();

  return NextResponse.json(universes);
}