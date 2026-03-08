import { NextResponse } from "next/server";
import { getAdventureService, getUniverseService } from "@lib/registry";
import { AdventurePatchDto } from "@/app/_lib/model/adventure/dtos/adventure.patch.dto";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  const adventure = await getAdventureService().getOne(uuid);

  return NextResponse.json(adventure);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  const requestBody = await request.json();
  const adventurePatchDto = Object.assign(new AdventurePatchDto(), requestBody);
  const validationErrors: string[] =
    await adventurePatchDto.validate(getUniverseService());

  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 400 });
  }

  const adventure = await getAdventureService().patchOne(
    uuid,
    adventurePatchDto,
  );
  revalidatePath("/");
  revalidatePath(`/adventures/${uuid}/edit`);

  return NextResponse.json(adventure);
}
