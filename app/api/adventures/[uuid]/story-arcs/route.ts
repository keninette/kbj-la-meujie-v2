import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { StoryArcCreateDto } from "@/app/_lib/model/storyArc/dtos/story-arc.create.dto";
import { getStoryArcService } from "@lib/registry";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await params;
  const requestBody = await request.json();
  const storyArcCreateDto = Object.assign(new StoryArcCreateDto(), requestBody);
  const validationErrors = await storyArcCreateDto.validate();

  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 400 });
  }

  try {
    const storyArc = await getStoryArcService().createOne(
      uuid,
      storyArcCreateDto,
    );
    revalidatePath("/");
    revalidatePath(`/adventures/${uuid}/edit`);

    return NextResponse.json(storyArc, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Adventure not found") {
      return NextResponse.json({ errors: [error.message] }, { status: 404 });
    }

    return NextResponse.json(
      { errors: ["Unable to create story arc"] },
      { status: 500 },
    );
  }
}
