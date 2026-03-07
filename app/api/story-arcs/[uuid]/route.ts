import { NextResponse } from "next/server";
import { StoryArcPatchDto } from "@/app/_lib/model/storyArc/dtos/story-arc.patch.dto";
import { getStoryArcService } from "@lib/registry";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  const requestBody = await request.json();
  const storyArcPatchDto = Object.assign(new StoryArcPatchDto(), requestBody);
  const validationErrors = await storyArcPatchDto.validate();

  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 400 });
  }

  const storyArc = await getStoryArcService().patchOne(uuid, storyArcPatchDto);

  return NextResponse.json(storyArc);
}
